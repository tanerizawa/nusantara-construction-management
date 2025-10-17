/**
 * WORK ORDER PDF GENERATOR (Pro v5 — Full DB-Integrated)
 * - Header identik PO: logo (from DB file), nama, alamat, kontak, NPWP
 * - Header detail kanan: No. WO, Tgl. Dibuat, Tgl. Cetak, Proyek
 * - Signature identik PO: kiri (Pelaksana/manual), kanan (Company box + QR + nama direktur & jabatan)
 * - Single-page guaranteed: tabel adaptif, deskripsi & terms clamped, ruang footer & signature aman
 */

const PDFDocument = require('pdfkit');
const moment = require('moment');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

class WorkOrderPDFGenerator {
   constructor() {
      this.pageWidth = 595.28; // A4
      this.pageHeight = 841.89;
      this.margin = 40;

      this.contentWidth = this.pageWidth - this.margin * 2;
      this.safeTop = this.margin;
      this.safeBottom = this.pageHeight - this.margin;
      this.cursorY = this.safeTop;

      // layout helpers
      this.baseline = 2;
      this.sectionGap = 10;

      // reserved blocks
      this.footerH = 30;
      this.signatureH = 120; // sama dengan PO (QR + teks)
   }

   /* ===== Helpers ===== */
   _snap(y) { return Math.round(y / this.baseline) * this.baseline; }
   _advance(dy) {
      this.cursorY = this._snap(this.cursorY + dy);
      if (this.cursorY > this.safeBottom) this.cursorY = this.safeBottom;
   }
   _heightOf(doc, text, width, font = 'Helvetica', size = 9, opts = {}) {
      doc.font(font).fontSize(size);
      return doc.heightOfString(text || '', { width, ...opts });
   }
   _currency(n) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n || 0);
   }

   /**
    * Ambil nama & posisi direktur dari beberapa kemungkinan key (match PO)
    * Tidak pernah mengganti nama dengan "Pimpinan <company>" dlsb.
    */
   _getDirectorInfo(company = {}, wo = {}) {
      console.log('🔍 [_getDirectorInfo] Input company:', {
         director: company.director,
         directorName: company.directorName,
         directorPosition: company.directorPosition,
         director_position: company.director_position
      });

      const nameCandidates = [
         company.director,
         company.directorName,
         company.director_fullname,
         company.director_full_name,
         company.presidentDirector,         // jika struktur berbeda
         wo.approvedByName,
         wo.approved_by_name
      ].filter(Boolean).map(s => String(s).trim()).filter(Boolean);

      const posCandidates = [
         company.directorPosition,
         company.director_position,
         company.positionTitle,
         company.position_title,
         'Direktur Utama' // default terakhir
      ].filter(Boolean).map(s => String(s).trim()).filter(Boolean);

      console.log('🔍 [_getDirectorInfo] Name candidates:', nameCandidates);
      console.log('🔍 [_getDirectorInfo] Position candidates:', posCandidates);

      const result = {
         name: nameCandidates[0] || '',         // biarkan kosong jika tak ada
         position: posCandidates[0] || 'Direktur Utama'
      };

      console.log('✅ [_getDirectorInfo] Result:', result);

      return result;
   }

   /**
    * Generate Work Order PDF buffer
    * @param {Object} woData
    * @param {Object} companyInfo  {name, address, phone, email, npwp, city, logo, director, directorPosition}
    * @param {Object} contractorInfo {name, address, contact, startDate, endDate}
    * @param {Date}   printDate
    */
   async generateWO(woData, companyInfo, contractorInfo, printDate = new Date()) {
      return new Promise(async (resolve, reject) => {
         try {
            const doc = new PDFDocument({
               size: 'A4',
               margin: this.margin,
               info: {
                  Title: `Perintah Kerja ${woData.woNumber}`,
                  Author: companyInfo.name,
                  Subject: 'Perintah Kerja (Work Order)',
                  Keywords: 'work order, perintah kerja, konstruksi'
               }
            });

            // Guard: cegah halaman kedua
            doc.on('pageAdded', () => { throw new Error('Overflow: layout melebihi 1 halaman.'); });

            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);

            // Flow start
            this.cursorY = this.safeTop;

            // 1) Letterhead (match PO)
            this._drawLetterhead(doc, companyInfo);

            // 2) Header WO (match PO detail kanan)
            this._drawWOHeader_MatchPO(doc, woData, printDate);

            // 3) Contractor box
            this._drawContractorBox(doc, contractorInfo);

            // 4) Redaksi + Deskripsi (clamped)
            this._drawScopeAndDescription(doc, woData, contractorInfo);

            // Ruang tersisa untuk Table + Total + Terms + Signature + Footer
            const reservedBottom = this.signatureH + this.footerH + 20;
            let spaceLeft = this.safeBottom - reservedBottom - this.cursorY;

            // 5) Items table (adaptif)
            const tableResult = this._drawItemsTable_Adaptive(doc, woData, spaceLeft);
            spaceLeft -= tableResult.consumeH;

            // 6) Totals (kompak)
            const totalsH = this._drawTotals_Compact(doc, woData);
            spaceLeft -= totalsH + this.sectionGap;

            // 7) Terms (adaptif)
            const termsH = this._drawTerms_Adaptive(doc, spaceLeft);
            spaceLeft -= termsH + this.sectionGap;

            // 8) Signature (match PO: QR + nama direktur center dalam kotak)
            await this._drawSignature_MatchPO(doc, companyInfo, woData, contractorInfo, printDate);

            // 9) Footer
            this._drawFooter(doc, companyInfo, printDate);

            doc.end();
         } catch (err) {
            reject(err);
         }
      });
   }

   /* ==================== SECTION 1: LETTERHEAD (MATCH PO) ==================== */
   _drawLetterhead(doc, company) {
      const startY = this.cursorY;

      // LOGO
      const logoSize = 45;
      const logoX = this.margin;
      const logoY = startY;

      if (company.logo) {
         const logoPath = path.join(__dirname, '..', 'uploads', company.logo); // samakan path dengan PO
         try {
            if (fs.existsSync(logoPath)) {
               doc.image(logoPath, logoX, logoY, { fit: [logoSize, logoSize], align: 'center', valign: 'center' });
            } else {
               doc.rect(logoX, logoY, logoSize, logoSize).strokeColor('#CCCCCC').lineWidth(1).stroke();
               doc.font('Helvetica').fontSize(6).fillColor('#999').text('LOGO', logoX + 15, logoY + 18);
            }
         } catch {
            doc.rect(logoX, logoY, logoSize, logoSize).strokeColor('#CCCCCC').lineWidth(1).stroke();
            doc.font('Helvetica').fontSize(6).fillColor('#999').text('LOGO', logoX + 15, logoY + 18);
         }
      } else {
         doc.rect(logoX, logoY, logoSize, logoSize).strokeColor('#CCCCCC').lineWidth(1).stroke();
         doc.font('Helvetica').fontSize(6).fillColor('#999').text('LOGO', logoX + 15, logoY + 18);
      }

      // INFO PERUSAHAAN
      const companyInfoX = this.margin + logoSize + 10;
      const companyInfoWidth = this.contentWidth - logoSize - 10;

      doc.font('Helvetica-Bold').fontSize(13).fillColor('#000')
         .text(company.name || '-', companyInfoX, startY);

      const addressText = company.address || '-';
      doc.font('Helvetica').fontSize(7.5).fillColor('#333');
      const addrH = doc.heightOfString(addressText, { width: companyInfoWidth });
      doc.text(addressText, companyInfoX, startY + 16, { width: companyInfoWidth })
         .text(`Telp: ${company.phone || '-'} | Email: ${company.email || '-'}`, companyInfoX, startY + 16 + addrH + 2)
         .text(`NPWP: ${company.npwp || '-'}`, companyInfoX, startY + 16 + addrH + 13);

      // GARIS PEMISAH
      const separatorY = this._snap(Math.max(startY + 56, doc.y + 6));
      doc.moveTo(this.margin, separatorY).lineTo(this.pageWidth - this.margin, separatorY)
         .strokeColor('#000').lineWidth(1.5).stroke();

      this._advance((separatorY - startY) + this.sectionGap);
   }

   /* ==================== SECTION 2: WO HEADER (MATCH PO STYLE) ==================== */
   _drawWOHeader_MatchPO(doc, wo, printDate) {
      const startY = this.cursorY + 10;

      // Title center (setara "PURCHASE ORDER" di PO)
      doc.font('Helvetica-Bold').fontSize(16).fillColor('#000')
         .text('PERINTAH KERJA', this.margin, startY, { width: this.contentWidth, align: 'center' });

      // Panel kanan (No., Tgl. Dibuat, Tgl. Cetak, Proyek)
      const infoX = this.pageWidth - this.margin - 200;
      const labelW = 65;
      const labelSize = 7.5;
      const valueSize = 9;

      const createdDate = wo.approved_date || wo.approvedDate || wo.createdAt || wo.created_at || new Date();

      const rows = [
         ['No. WO:', wo.woNumber || wo.wo_number || 'N/A'],
         ['Tgl. Dibuat:', moment(createdDate).format('DD MMM YYYY')],
         ['Tgl. Cetak:', moment(printDate).format('DD MMM YYYY HH:mm')],
         ['Proyek:', wo.projectId || wo.project_id || 'N/A'],
      ];

      let y = startY + 24;
      rows.forEach(([label, val]) => {
         doc.font('Helvetica').fontSize(labelSize).fillColor('#000').text(label, infoX, y);
         doc.font('Helvetica-Bold').fontSize(valueSize)
            .fillColor(label === 'Tgl. Cetak:' ? '#0066CC' : '#000')
            .text(val, infoX + labelW, y);
         y += 11;
      });

      this._advance(this._snap((y - startY) + this.sectionGap));
   }

   /* ==================== SECTION 3: KONTRAKTOR ==================== */
   _drawContractorBox(doc, contractor) {
      const y = this.cursorY + 6;

      doc.font('Helvetica-Bold').fontSize(10).fillColor('#000')
         .text('Kepada Yth,', this.margin, y);

      const boxY = y + 16;
      const boxH = 64;
      const boxW = 250;

      // Box kiri (kontraktor)
      doc.rect(this.margin, boxY, boxW, boxH).strokeColor('#CCCCCC').lineWidth(1).stroke();
      doc.font('Helvetica-Bold').fontSize(10).text(contractor.name || 'Nama Kontraktor/Mandor', this.margin + 8, boxY + 6, { width: boxW - 16 });
      doc.font('Helvetica').fontSize(8.5).text(contractor.address || '-', this.margin + 8, boxY + 22, { width: boxW - 16 });
      if (contractor.contact) doc.text(`Kontak: ${contractor.contact}`, this.margin + 8, boxY + 40);

      // Box kanan (periode kerja)
      if (contractor.startDate || contractor.endDate) {
         const rW = 210;
         const rX = this.pageWidth - this.margin - rW;
         doc.rect(rX, boxY, rW, 48).strokeColor('#CCCCCC').lineWidth(1).stroke();
         doc.font('Helvetica').fontSize(8).text('Periode Kerja:', rX + 8, boxY + 6);
         const sd = contractor.startDate ? moment(contractor.startDate).format('DD MMM YYYY') : '-';
         const ed = contractor.endDate ? moment(contractor.endDate).format('DD MMM YYYY') : '-';
         doc.font('Helvetica-Bold').fontSize(9).text(`${sd} s/d ${ed}`, rX + 8, boxY + 20);
      }

      this._advance(this._snap(boxH + 28));
   }

   /* ==================== SECTION 4: REDAKSI + DESKRIPSI ==================== */
   _drawScopeAndDescription(doc, wo, contractor) {
      const y = this.cursorY;

      doc.font('Helvetica').fontSize(9.5).fillColor('#000')
         .text('Dengan hormat,', this.margin, y);
      doc.text(
         'Bersama ini kami instruksikan kepada Saudara untuk melaksanakan pekerjaan sebagai berikut:',
         this.margin, y + 14, { width: this.contentWidth, lineGap: 2.5 }
      );

      const redaksi = `Bahwa berdasarkan hasil koordinasi dan kesepakatan bersama, perusahaan kami menunjuk ${contractor.name || '__________________'} untuk melaksanakan pekerjaan sebagaimana tercantum dalam rincian berikut. Pelaksanaan pekerjaan wajib mengikuti spesifikasi teknis, jadwal pelaksanaan, serta ketentuan lain yang telah disetujui.`;
      const redH = this._heightOf(doc, redaksi, this.contentWidth, 'Helvetica', 9, { align: 'justify', lineGap: 2 });
      doc.font('Helvetica').fontSize(9).text(redaksi, this.margin, y + 36, { width: this.contentWidth, align: 'justify', lineGap: 2 });

      const instruksi = 'Dengan diterbitkannya Surat Perintah Kerja ini, Saudara wajib memulai pekerjaan sesuai jadwal dan menyampaikan laporan perkembangan secara berkala untuk diverifikasi.';
      const insH = this._heightOf(doc, instruksi, this.contentWidth, 'Helvetica', 9, { align: 'justify', lineGap: 2 });
      doc.text(instruksi, this.margin, y + 36 + redH + 6, { width: this.contentWidth, align: 'justify', lineGap: 2 });

      // Box deskripsi (clamped)
      const descTop = y + 36 + redH + 6 + insH + 10;
      const boxH = 35;
      doc.rect(this.margin, descTop, this.contentWidth, boxH).strokeColor('#E0E0E0').lineWidth(1).stroke();

      doc.font('Helvetica-Bold').fontSize(9).text('Deskripsi Pekerjaan:', this.margin + 8, descTop + 6);
      const desc = wo.description || wo.workScope || '-';
      const maxDescH = boxH - 15;
      const fullDescH = this._heightOf(doc, desc, this.contentWidth - 16, 'Helvetica', 8.5, { lineGap: 1.2 });
      let descText = desc;
      if (fullDescH > maxDescH) {
         let cut = desc.length;
         while (cut > 10) {
            cut = Math.floor(cut * 0.9);
            const tryText = desc.slice(0, cut) + ' …';
            const h = this._heightOf(doc, tryText, this.contentWidth - 16, 'Helvetica', 8.5, { lineGap: 1.2 });
            if (h <= maxDescH) { descText = tryText; break; }
         }
      }
      doc.font('Helvetica').fontSize(8.5).text(descText, this.margin + 8, descTop + 18, { width: this.contentWidth - 16, lineGap: 1.2 });

      this._advance(this._snap((descTop + boxH) - y + this.sectionGap));
   }

   /* ==================== SECTION 5: TABEL (ADAPTIF) ==================== */
   _drawItemsTable_Adaptive(doc, wo, spaceForTable) {
      const startY = this.cursorY + 15;
      const headerH = 20;
      const rowH = 20;
      const labelH = 10;
      const minRows = 1;

      doc.font('Helvetica-Bold').fontSize(10).fillColor('#000')
         .text('Rincian Pekerjaan:', this.margin, startY - 14);

      // hitung baris yang muat
      const spaceRows = Math.max(0, spaceForTable - headerH - labelH);
      const maxRowsFit = Math.max(minRows, Math.floor(spaceRows / rowH));

      const items = Array.isArray(wo.items) ? wo.items : [];
      const rows = Math.min(maxRowsFit, items.length || minRows);
      const truncated = items.length > rows;

      // Header
      doc.rect(this.margin, startY, this.contentWidth, headerH).fillAndStroke('#E8E8E8', '#000');

      const col1 = this.margin;                 // No
      const col2 = this.margin + 30;            // Uraian
      const col3 = this.margin + 200;           // Spesifikasi
      const col4 = this.pageWidth - this.margin - 220; // Volume
      const col5 = this.pageWidth - this.margin - 145; // Harga
      const col6 = this.pageWidth - this.margin - 75;  // Jumlah

      doc.fillColor('#000').font('Helvetica-Bold').fontSize(8)
         .text('No', col1 + 3, startY + 5)
         .text('Uraian', col2, startY + 5)
         .text('Spesifikasi', col3, startY + 5)
         .text('Volume', col4, startY + 5)
         .text('Harga', col5, startY + 5, { width: 60, align: 'right' })
         .text('Jumlah', col6, startY + 5, { width: 70, align: 'right' });

      // Rows
      let rowY = startY + headerH + 4;
      const textOffsetY = 4;
      const showItems = (items.length ? items.slice(0, rows) : [{ itemName: '-', specification: '-', quantity: '', unit: '', unitPrice: 0, totalPrice: 0 }]);

      doc.font('Helvetica').fontSize(7);
      showItems.forEach((it, i) => {
         doc.rect(this.margin, rowY - 4, this.contentWidth, rowH).strokeColor('#CFCFCF').lineWidth(0.4).stroke();
         doc.text(String(i + 1), col1 + 3, rowY + textOffsetY)
            .text(it.itemName || it.description || '-', col2, rowY + textOffsetY, { width: 160 })
            .text(it.specification || '-', col3, rowY + textOffsetY, { width: 150 })
            .text(`${it.quantity || 0} ${it.unit || ''}`, col4, rowY + textOffsetY)
            .text(this._currency(it.unitPrice || 0), col5, rowY + textOffsetY, { width: 65, align: 'right' })
            .text(this._currency(it.totalPrice || 0), col6, rowY + textOffsetY, { width: 70, align: 'right' });
         rowY += rowH;
      });

      if (truncated) {
         doc.font('Helvetica-Oblique').fontSize(7).fillColor('#666')
            .text(`… dan ${items.length - rows} item lainnya`, this.margin + 10, rowY + 2, { width: 220 });
         rowY += 12;
      }

      const consumeH = (rowY - startY) + labelH;
      this._advance(this._snap(consumeH));
      return { consumeH, endY: rowY };
   }

   /* ==================== SECTION 6: TOTAL (KOMPAK) ==================== */
   _drawTotals_Compact(doc, wo) {
      const startY = this.cursorY + 4;

      const RIGHT_INSET = 14;
      const BOX_W = 80;
      const valueX = (this.pageWidth - this.margin - RIGHT_INSET) - BOX_W;
      const labelX = this.pageWidth - this.margin - 200;

      doc.font('Helvetica').fontSize(9).fillColor('#000')
         .text('Subtotal:', labelX, startY);
      doc.font('Helvetica-Bold').fontSize(9)
         .text(this._currency(wo.totalAmount || 0), valueX, startY, { width: BOX_W, align: 'right' });

      let y = startY;
      if (wo.tax && wo.tax > 0) {
         y += 12;
         doc.font('Helvetica').fontSize(9).text(`PPN (${wo.taxRate || 11}%):`, labelX, y);
         doc.font('Helvetica-Bold').fontSize(9)
            .text(this._currency(wo.tax), valueX, y, { width: BOX_W, align: 'right' });
      }

      const totalY = y + 16;
      doc.rect(labelX - 8, totalY - 4, 200, 20).fillAndStroke('#EDEDED', '#000');
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#000')
         .text('TOTAL:', labelX, totalY + 2);
      doc.fontSize(11)
         .text(this._currency(wo.totalAmount || 0), valueX, totalY + 1, { width: BOX_W, align: 'right' });

      const consumed = (totalY + 26) - startY;
      this._advance(this._snap(consumed));
      return consumed;
   }

   /* ==================== SECTION 7: TERMS (ADAPTIF) ==================== */
   _drawTerms_Adaptive(doc, spaceLeftBeforeTerms) {
      const startY = this.cursorY + 4;

      doc.font('Helvetica-Bold').fontSize(9).fillColor('#000')
         .text('Ketentuan Pelaksanaan:', this.margin, startY);

      const termsAll = [
         '1. Pekerjaan dilaksanakan sesuai spesifikasi teknis yang ditetapkan.',
         '2. Kontraktor wajib menyediakan tenaga kerja, alat, dan material yang diperlukan.',
         '3. Pembayaran dilakukan bertahap sesuai progres terverifikasi.',
         '4. Kontraktor bertanggung jawab atas mutu dan keselamatan kerja.',
         '5. Laporan kemajuan disampaikan secara berkala.',
         '6. Pekerjaan harus selesai sesuai jadwal yang ditentukan.',
      ];

      // sisakan ruang signature + footer
      const mustReserve = this.signatureH + this.footerH + 16;
      let space = Math.max(40, spaceLeftBeforeTerms - mustReserve);

      let y = startY + 12;
      const lineH = 11;
      let printed = 0;

      doc.font('Helvetica').fontSize(8).fillColor('#333');
      for (let i = 0; i < termsAll.length; i++) {
         if (space < lineH) break;
         doc.text(termsAll[i], this.margin, y, { width: this.contentWidth });
         y += lineH;
         space -= lineH;
         printed++;
      }

      if (printed < termsAll.length && space >= lineH) {
         doc.font('Helvetica-Oblique').fontSize(7).fillColor('#666')
            .text('… beberapa ketentuan lain tidak ditampilkan demi kerapian halaman.', this.margin, y, { width: this.contentWidth });
         y += lineH;
      }

      const consumed = (y - startY);
      this._advance(this._snap(consumed));
      return consumed;
   }

   /* ==================== SECTION 8: SIGNATURE (MATCH PO + QR) ==================== */
   async _drawSignature_MatchPO(doc, company, wo, contractor, printDate) {
      // Pastikan tidak menabrak footer
      let startY = this.safeBottom - (this.footerH + this.signatureH + 20);
      if (this.cursorY > startY) startY = this.cursorY;
      startY = this._snap(startY);

      // Kotak kanan (company) dibingkai
      const rightBoxW = 200;
      const rightBoxX = this.pageWidth - this.margin - rightBoxW;
      const rightBoxY = startY - 6;
      doc.rect(rightBoxX, rightBoxY, rightBoxW, this.signatureH + 12)
         .strokeColor('#D0D0D0').lineWidth(0.5).stroke();

      const colLeftX = this.margin + 30;     // kiri (Pelaksana)
      const colRightTextX = rightBoxX + 14;  // label kanan sedikit masuk
      const qrSize = 60;
      const qrX = rightBoxX + (rightBoxW - qrSize) / 2; // center dalam kotak
      const qrY = startY + 28;

      // Kolom kiri: Pelaksana (kontraktor)
      doc.font('Helvetica').fontSize(8).fillColor('#000')
         .text('Menyetujui,', colLeftX, startY);
      doc.fontSize(7).text('(Pelaksana)', colLeftX, startY + 12);
      // Garis manual tanda tangan
      doc.font('Helvetica').fontSize(8).text('', colLeftX - 5, startY + 100);
      // Nama pelaksana (opsional)
      if (contractor?.name) {
         doc.font('Helvetica-Bold').fontSize(8).text(contractor.name, colLeftX - 2, startY + 100, { width: 170 });
      }

      // Kolom kanan: Perusahaan (QR + nama direktur)
      doc.font('Helvetica').fontSize(8).fillColor('#000')
         .text('Yang Memerintahkan,', colRightTextX, startY);

      // Lokasi & tanggal (1 baris)
      const city = company.city || 'Karawang';
      const dateStr = moment(printDate).locale('id').format('DD MMMM YYYY');
      doc.fontSize(7).text(`${city}, ${dateStr}`, colRightTextX, startY + 16);

      // Director info menggunakan helper (match PO, tanpa fallback aneh)
      const { name: directorName, position: directorPosition } = this._getDirectorInfo(company, wo);

      // (opsional) debug bila kosong
      if (!directorName) {
         console.warn('[WO] Director name is empty. Check company.director or mapping keys.');
      }

      // Generate & place QR (center)
      try {
         const qrData = {
            wo_number: wo.woNumber || wo.wo_number,
            subsidiary: company.name,
            director: directorName,
            position: directorPosition,
            created_date: moment(wo.createdAt || wo.created_at || new Date()).format('YYYY-MM-DD'),
            print_date: moment(printDate).format('YYYY-MM-DD HH:mm:ss'),
            signature_type: 'digital_verified'
         };
         const qrCodeBuffer = await QRCode.toBuffer(JSON.stringify(qrData), {
            errorCorrectionLevel: 'M',
            type: 'png',
            width: qrSize,
            margin: 1
         });

         doc.image(qrCodeBuffer, qrX, qrY, { width: qrSize, height: qrSize });
         doc.font('Helvetica').fontSize(5.5).fillColor('#0066CC')
            .text('Tanda Tangan Digital', qrX, qrY + 62, { width: qrSize, align: 'center' })
            .fillColor('#000');
      } catch {
         // lanjut tanpa QR jika gagal
      }

      // Nama Direktur & Jabatan — center terhadap KOTAK (bukan QR)
      const nameYBase = qrY + qrSize + 15;

      // Dinamis: kecilkan font jika nama/jabatan terlalu panjang agar tetap 1 baris & center
      let nameFont = 8.5;
      let posFont = 7.5;
      const maxWidth = rightBoxW - 12; // sedikit inset agar tidak mepet border

      // Try-fit untuk nama direktur
      let nameW = doc.widthOfString(directorName, { font: 'Helvetica-Bold', size: nameFont });
      while (nameW > maxWidth && nameFont > 6.5) {
         nameFont -= 0.25;
         nameW = doc.widthOfString(directorName, { font: 'Helvetica-Bold', size: nameFont });
      }
      // Try-fit untuk posisi
      let posText = `(${directorPosition})`;
      let posW = doc.widthOfString(posText, { font: 'Helvetica', size: posFont });
      while (posW > maxWidth && posFont > 6) {
         posFont -= 0.25;
         posW = doc.widthOfString(posText, { font: 'Helvetica', size: posFont });
      }

      doc.font('Helvetica-Bold').fontSize(nameFont)
         .text(directorName, rightBoxX + 6, nameYBase, {
            width: rightBoxW - 12, align: 'center', lineBreak: false
         });
      doc.font('Helvetica').fontSize(posFont)
         .text(posText, rightBoxX + 6, nameYBase + 12, {
            width: rightBoxW - 12, align: 'center', lineBreak: false
         });

      // Update cursor agar footer aman
      this.cursorY = Math.max(this.cursorY, startY + this.signatureH);
   }

   /* ==================== SECTION 9: FOOTER ==================== */
   _drawFooter(doc, company, printDate) {
      const y = this.safeBottom - this.footerH;
      doc.font('Helvetica').fontSize(7).fillColor('#666')
         .text(`${company.name || '-'} | ${company.email || '-'} | ${company.phone || '-'}`,
            0, y, { align: 'center', width: this.pageWidth });
      doc.text('Dokumen ini sah dan resmi tanpa memerlukan tanda tangan basah',
         0, y + 10, { align: 'center', width: this.pageWidth });
      doc.fontSize(6).fillColor('#999')
         .text(`Dicetak pada: ${moment(printDate).format('DD MMMM YYYY HH:mm')} WIB`,
            0, y + 20, { align: 'center', width: this.pageWidth });
   }
}

module.exports = new WorkOrderPDFGenerator();
