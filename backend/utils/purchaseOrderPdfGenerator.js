const PDFDocument = require('pdfkit');
const moment = require('moment');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

/**
 * PURCHASE ORDER PDF GENERATOR (Single-Page, Pro Layout)
 * - A4 (595.28 x 841.89 pt), margin 40
 * - Vertical flow via this.cursorY (tanpa Y fixed)
 * - Items table adaptif: menyesuaikan sisa ruang agar tetap 1 halaman
 * - Desain: grid konsisten, spacing baseline 4pt, typographic hierarchy
 */
class PurchaseOrderPDFGenerator {
  constructor() {
    this.pageWidth = 595.28;    // A4 width
    this.pageHeight = 841.89;   // A4 height
    this.margin = 40;

    this.contentWidth = this.pageWidth - (this.margin * 2);
    this.contentHeight = this.pageHeight - (this.margin * 2);

    // Flow cursor & batas aman (bagian bawah konten)
    this.cursorY = this.margin;
    this.safeBottom = this.pageHeight - this.margin;

    // Layout constants
    this.sectionGap = 12;  // jarak standar antar section (kelipatan baseline)
    this.baseline = 4;     // baseline grid 4pt
  }

  // Utility: majuin cursor & snap ke baseline
  _advance(yDelta) {
    this.cursorY += yDelta;
    if (this.cursorY > this.safeBottom) this.cursorY = this.safeBottom;
    this.cursorY = this._snap(this.cursorY);
  }

  // Utility: tinggi teks dinamis
  _textHeight(doc, text, width, font = 'Helvetica', size = 9, options = {}) {
    doc.font(font).fontSize(size);
    return doc.heightOfString(text || '', { width, ...options });
  }

  // Snap ke baseline grid
  _snap(y) { return Math.round(y / this.baseline) * this.baseline; }

  // Ukur kisaran tinggi blok bawah (total, terms, signature, footer) untuk hitung sisa ruang tabel
  _measureBottomBlocks(doc, po) {
    const totalSectionHeight = (po.tax && po.tax > 0) ? 60 : 45;

    const terms = [
      '1. Pembayaran dilakukan setelah barang/jasa diterima dan sesuai spesifikasi',
      '2. Supplier wajib menyertakan surat jalan dan faktur asli',
      '3. Barang tidak sesuai spesifikasi akan dikembalikan',
      '4. PO ini berlaku sebagai kontrak pemesanan yang mengikat'
    ];
    const termsText = terms.join('\n');
    const termsTextH = this._textHeight(doc, termsText, this.contentWidth, 'Helvetica', 7.5, { lineGap: 0 });
    const termsTitleH = 10;
    const termsBlockH = termsTitleH + 12 + termsTextH + 5;

    const signatureH = 120; // kolom tanda tangan + QR
    const footerH = 24;     // 3 baris kecil (info, disclaimer, timestamp)

    return { totalSectionHeight, termsBlockH, signatureH, footerH, terms };
  }

  /**
   * Generate PO PDF and return as buffer
   /*/
  async generatePO(poData, companyInfo, supplierInfo, printDate = new Date()) {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: this.margin,
          info: {
            Title: `Purchase Order ${poData.poNumber}`,
            Author: companyInfo.name,
            Subject: 'Purchase Order - Pemesanan Material/Jasa Konstruksi',
            Keywords: 'purchase order, konstruksi, pemesanan',
            CreationDate: printDate
          }
        });

        // DEBUG: deteksi overflow (hapus di produksi bila sudah yakin)
        doc.on('pageAdded', () => {
          console.warn('⚠️ PDFKit menambah halaman baru (overflow). Periksa perhitungan sisa ruang.');
        });

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // Reset flow
        this.cursorY = this.margin;

        // 1) Letterhead
        this._drawLetterhead(doc, companyInfo);

        // 2) PO Header
        this._drawPOHeader(doc, poData, printDate);

        // 3) Supplier Info
        this._drawSupplierInfo(doc, supplierInfo);

        // 4) Measure bottom blocks (untuk kalkulasi sisa ruang tabel)
        const layoutCtx = this._measureBottomBlocks(doc, poData);

        // 5) Items table (adaptif max rows agar muat)
        this._drawItemsTable(doc, poData, layoutCtx);

        // 6) Total section
        this._drawTotalSection(doc, poData);

        // 7) Terms
        this._drawTermsAndConditions(doc, poData, layoutCtx);

        // 8) Signature (adaptif; geser ke atas bila ruang mepet)
        await this._drawSignatureSection(doc, companyInfo, poData, supplierInfo, printDate);

        // 9) Footer (selalu di dalam margin)
        this._drawFooter(doc, companyInfo, printDate);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /* ==================== SECTION 1: LETTERHEAD ==================== */
  _drawLetterhead(doc, company) {
    const startY = this.cursorY;

    // Logo
    const logoSize = 45;
    const logoX = this.margin;
    const logoY = startY;

    if (company.logo) {
      const logoPath = path.join(__dirname, '..', 'uploads', company.logo);
      try {
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, logoX, logoY, { fit: [logoSize, logoSize], align: 'center', valign: 'center' });
        } else {
          doc.rect(logoX, logoY, logoSize, logoSize).strokeColor('#CCCCCC').lineWidth(1).stroke();
          doc.fontSize(6).fillColor('#999999').text('LOGO', logoX + 15, logoY + 18);
        }
      } catch {
        doc.rect(logoX, logoY, logoSize, logoSize).strokeColor('#CCCCCC').lineWidth(1).stroke();
        doc.fontSize(6).fillColor('#999999').text('LOGO', logoX + 15, logoY + 18);
      }
    } else {
      doc.rect(logoX, logoY, logoSize, logoSize).strokeColor('#CCCCCC').lineWidth(1).stroke();
      doc.fontSize(6).fillColor('#999999').text('LOGO', logoX + 15, logoY + 18);
    }

    // Info perusahaan (kanan logo)
    const companyInfoX = this.margin + logoSize + 10;
    const companyInfoWidth = this.contentWidth - logoSize - 10;

    doc.font('Helvetica-Bold').fontSize(13).fillColor('#000')
      .text(company.name, companyInfoX, startY);

    const addrH = this._textHeight(doc, company.address, companyInfoWidth, 'Helvetica', 7.5);
    doc.font('Helvetica').fontSize(7.5).fillColor('#333')
      .text(company.address, companyInfoX, startY + 16, { width: companyInfoWidth })
      .text(`Telp: ${company.phone} | Email: ${company.email}`, companyInfoX, startY + 16 + addrH + 2)
      .text(`NPWP: ${company.npwp}`, companyInfoX, startY + 16 + addrH + 13);

    // Garis pemisah + napas
    const separatorY = this._snap(Math.max(startY + 56, doc.y + 8));
    doc.moveTo(this.margin, separatorY).lineTo(this.pageWidth - this.margin, separatorY)
      .strokeColor('#000').lineWidth(1.5).stroke();

    this._advance((separatorY - startY) + this.sectionGap);
  }

  /* ==================== SECTION 2: PO HEADER ==================== */
  _drawPOHeader(doc, po, printDate) {
    const startY = this.cursorY + 10;

    doc.font('Helvetica-Bold').fontSize(16).fillColor('#000')
      .text('PURCHASE ORDER', this.margin, startY, { width: this.contentWidth, align: 'center' });

    const infoX = this.pageWidth - this.margin - 200;
    const labelW = 65;
    const labelSize = 7.5;
    const valSize = 9;

    const createdDate = po.approved_date || po.approvedDate || po.createdAt || po.created_at;
    const lines = [
      ['No. PO:', po.poNumber || po.po_number || 'N/A'],
      ['Tgl. Dibuat:', moment(createdDate).format('DD MMM YYYY')],
      ['Tgl. Cetak:', moment(printDate).format('DD MMM YYYY HH:mm')],
      ['Proyek:', po.projectId || po.project_id || 'N/A'],
    ];

    let y = startY + 24;
    lines.forEach(([label, val]) => {
      doc.font('Helvetica').fontSize(labelSize).fillColor('#000').text(label, infoX, y);
      doc.font('Helvetica-Bold').fontSize(valSize)
        .fillColor(label === 'Tgl. Cetak:' ? '#0066CC' : '#000')
        .text(val, infoX + labelW, y);
      y += 11;
    });

    this._advance(this._snap((y - startY) + this.sectionGap));
  }

  /* ==================== SECTION 3: SUPPLIER INFO ==================== */
  _drawSupplierInfo(doc, supplier) {
    const startY = this.cursorY + 6;

    doc.font('Helvetica-Bold').fontSize(10).fillColor('#000')
      .text('Kepada Yth,', this.margin, startY);

    const supplierBoxX = this.margin;
    const supplierBoxY = startY + 16;
    const supplierBoxW = 240;

    const nameH = this._textHeight(doc, supplier.name || 'Nama Supplier', supplierBoxW - 16, 'Helvetica-Bold', 10.5);
    const addrH = this._textHeight(doc, supplier.address || '-', supplierBoxW - 16, 'Helvetica', 8.5, { lineGap: 1 });
    const contactH = supplier.contact ? 10 : 0;
    const supplierBoxH = Math.max(68, 8 + nameH + 8 + addrH + (contactH ? 12 : 0) + 8);

    // Box kiri
    doc.rect(supplierBoxX, supplierBoxY, supplierBoxW, supplierBoxH).strokeColor('#CCCCCC').lineWidth(1).stroke();
    doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#000')
      .text(supplier.name || 'Nama Supplier', supplierBoxX + 8, supplierBoxY + 8, { width: supplierBoxW - 16 });
    doc.font('Helvetica').fontSize(8.5).fillColor('#000')
      .text(supplier.address || '-', supplierBoxX + 8, supplierBoxY + 8 + nameH + 4, { width: supplierBoxW - 16, lineGap: 1 });
    if (supplier.contact) {
      doc.text(`Kontak: ${supplier.contact}`, supplierBoxX + 8, supplierBoxY + 8 + nameH + 4 + addrH + 4);
    }

    // Box kanan (opsional) — samakan tinggi dengan kiri agar simetris
    if (supplier.deliveryDate) {
      const deliveryW = 210;
      let deliveryH = 32;
      deliveryH = Math.max(deliveryH, supplierBoxH);
      const deliveryX = this.pageWidth - this.margin - deliveryW;
      const deliveryY = supplierBoxY;
      doc.rect(deliveryX, deliveryY, deliveryW, deliveryH).strokeColor('#CCCCCC').lineWidth(1).stroke();
      doc.font('Helvetica').fontSize(8).fillColor('#000')
        .text('Target Pengiriman:', deliveryX + 8, deliveryY + 7);
      doc.font('Helvetica-Bold').fontSize(10)
        .text(moment(supplier.deliveryDate).format('DD MMMM YYYY'), deliveryX + 8, deliveryY + 19);
    }

    this._advance(this._snap((supplierBoxH + 16) + this.sectionGap));
  }

  /* ==================== SECTION 4: ITEMS TABLE (ADAPTIF) ==================== */
  _drawItemsTable(doc, po, layoutCtx) {
    const startY = this.cursorY + 24;

    // Label
    doc.font('Helvetica-Bold').fontSize(12).fillColor('#000')
      .text('Daftar Item:', this.margin, startY - 20);

    const headerH = 22;
    const rowH = 22; // sedikit lebih rendah agar lega

    // Hitung ruang tersisa untuk tabel agar semua blok bawah tetap muat
    const spaceForAll = (this.safeBottom - startY)
      - layoutCtx.totalSectionHeight
      - layoutCtx.termsBlockH
      - layoutCtx.signatureH
      - layoutCtx.footerH
      - 30; // buffer kecil

    const items = Array.isArray(po.items) ? po.items : [];
    const minRows = 1;
    const maxRowsFit = Math.max(minRows, Math.floor((spaceForAll - headerH) / rowH));
    const displayItems = items.slice(0, Math.max(minRows, Math.min(maxRowsFit, items.length)));

    // Header
    const tableTop = startY;
    doc.rect(this.margin, tableTop, this.contentWidth, headerH)
      .fillAndStroke('#EFEFEF', '#000000');
    // Garis bawah header tegas
    doc.moveTo(this.margin, tableTop + headerH)
      .lineTo(this.pageWidth - this.margin, tableTop + headerH)
      .lineWidth(1).strokeColor('#000').stroke();

    doc.fillColor('#000').font('Helvetica-Bold').fontSize(9);

    const col1X = this.margin;                    // No (28)
    const col2X = this.margin + 28;               // Nama (152)
    const col3X = this.margin + 180;              // Spesifikasi (150)
    const col4X = this.pageWidth - this.margin - 210; // Qty (65)
    const col5X = this.pageWidth - this.margin - 145; // Harga (70)
    const col6X = this.pageWidth - this.margin - 75;  // Total (70)

    doc.text('No', col1X + 3, tableTop + 8)
      .text('Nama Item', col2X, tableTop + 8)
      .text('Spesifikasi', col3X, tableTop + 8)
      .text('Qty', col4X, tableTop + 8)
      .text('Harga Satuan', col5X, tableTop + 8, { width: 60, align: 'right' })
      .text('Total', col6X, tableTop + 8, { width: 70, align: 'right' });

    // Rows
    let rowY = tableTop + headerH + 10;
    doc.font('Helvetica').fontSize(8).fillColor('#000');

    displayItems.forEach((item, i) => {
      // Body garis tipis & halus
      doc.rect(this.margin, rowY - 5, this.contentWidth, rowH).strokeColor('#BBBBBB').lineWidth(0.35).stroke();

      // Inner padding 6pt utk kolom angka
    const textOffsetY = 4; // turun 4 pt agar center secara visual
    doc.text((i + 1).toString(), col1X + 3, rowY + textOffsetY)
      .text(item.itemName || item.item_name || '-', col2X, rowY + textOffsetY, { width: 160, lineGap: 1 })
      .text(item.specification || '-', col3X, rowY + textOffsetY, { width: 150, lineGap: 1 })
      .text(`${item.quantity || 0} ${item.unit || ''}`, col4X, rowY + textOffsetY, { width: 60 })
      .text(this._formatCurrency(item.unitPrice || item.unit_price || 0), col5X, rowY + textOffsetY, { width: 65 - 6, align: 'right' })
      .text(this._formatCurrency(item.totalPrice || item.total_price || 0), col6X, rowY + textOffsetY, { width: 70 - 6, align: 'right' });

      rowY += rowH;
    });

    if (items.length > displayItems.length) {
      doc.font('Helvetica-Oblique').fontSize(7).fillColor('#666666')
        .text(`... dan ${items.length - displayItems.length} item lainnya`, this.margin + 10, rowY, { width: 200 });
      rowY += 15;
    }

    this._advance(this._snap((rowY - startY) + this.sectionGap));
  }

  /* ==================== SECTION 5: TOTAL SECTION ==================== */
  _drawTotalSection(doc, po) {
  const startY = this.cursorY + 8;

  // ==== RIGHT INSET agar tidak mepet tepi ====
  const RIGHT_INSET = 14;                   // NEW: jarak aman dari margin kanan (pt)
  const VALUE_WIDTH = 80;                   // lebar blok angka (tetap)
  const valueX = (this.pageWidth - this.margin - RIGHT_INSET) - VALUE_WIDTH; // NEW: geser masuk konsisten

  const labelX = this.pageWidth - this.margin - 190;  // posisi label tetap
  const labelFontSize = 9;
  const valueFontSize = 9;

  // Subtotal
  doc.font('Helvetica').fontSize(labelFontSize).fillColor('#000')
     .text('Subtotal:', labelX, startY);
  doc.font('Helvetica-Bold').fontSize(valueFontSize)
     .text(this._formatCurrency(po.totalAmount || po.total_amount || 0),
           valueX, startY, { width: VALUE_WIDTH, align: 'right' });         // NEW: pakai valueX baru

  // PPN (opsional)
  const between = 10;
  let taxY = startY;
  if (po.tax && po.tax > 0) {
    taxY = startY + between + 4;
    doc.font('Helvetica').fontSize(labelFontSize).fillColor('#000')
       .text(`PPN (${po.taxRate || 11}%):`, labelX, taxY);
    doc.font('Helvetica-Bold').fontSize(valueFontSize)
       .text(this._formatCurrency(po.tax),
             valueX, taxY, { width: VALUE_WIDTH, align: 'right' });         // NEW
  }

  // TOTAL (boxed)
  const totalY = (po.tax && po.tax > 0) ? taxY + between + 8 : startY + between + 6;
  const totalBoxWidth = 190, totalBoxHeight = 22;
  doc.rect(labelX - 8, totalY - 4, totalBoxWidth, totalBoxHeight).fillAndStroke('#E8E8E8', '#000');

  doc.fillColor('#000').font('Helvetica-Bold').fontSize(11).text('TOTAL:', labelX, totalY + 2);
  doc.fontSize(12)
     .text(this._formatCurrency(po.totalAmount || po.total_amount || 0),
           valueX, totalY + 2, { width: VALUE_WIDTH, align: 'right' });     // NEW

  this._advance(this._snap((totalY + 32) - startY + this.sectionGap));
}


  /* ==================== SECTION 6: TERMS ==================== */
  _drawTermsAndConditions(doc, po, layoutCtx) {
    const startY = this.cursorY + 8;

    doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#000')
      .text('Syarat dan Ketentuan:', this.margin, startY);

    const termsFontSize = 7.5;
    const lineSpacing = 12; // lebih lega

    doc.font('Helvetica').fontSize(termsFontSize).fillColor('#333333');

    let termsY = startY + 16;
    layoutCtx.terms.forEach(term => {
      doc.text(term, this.margin, termsY, { width: this.contentWidth, lineGap: 0 });
      termsY += lineSpacing;
    });

    this._advance(this._snap((termsY + 5) - startY + this.sectionGap));
  }

 /* ==================== SECTION 7: SIGNATURE (ADAPTIF + BOX KANAN) ==================== */
async _drawSignatureSection(doc, company, po, supplier, printDate) {
  const signatureH = 120;
  const footerH = 24;
  const pad = 10;

  let startY = this.cursorY + 10;
  const needed = signatureH + footerH + pad;

  // Jika tidak muat, geser ke atas agar tidak menabrak footer
  if (startY + needed > this.safeBottom) {
    startY = this.safeBottom - needed;
  }
  startY = this._snap(startY);

  // Kolom kanan dibingkai tipis agar QR “terikat” visual
  const rightBoxW = 200;
  const rightBoxX = this.pageWidth - this.margin - rightBoxW;
  const rightBoxY = startY - 6;
  doc.rect(rightBoxX, rightBoxY, rightBoxW, signatureH + 12)
     .strokeColor('#D0D0D0')
     .lineWidth(0.5)
     .stroke();

  const col1X = this.margin + 30;         // kiri (supplier)
  const col2X = rightBoxX + 14;           // kanan (company)
  const qrSize = 60;
  const qrX = rightBoxX + (rightBoxW - qrSize) / 2;
  const qrY = startY + 28;                // posisi vertikal QR

  // ==========================
  // KOLOM KIRI (SUPPLIER)
  // ==========================
  doc.font('Helvetica').fontSize(8).fillColor('#000')
     .text('Yang Menerima,', col1X, startY);
  doc.fontSize(7)
     .text('(Supplier/Kontraktor)', col1X, startY + 12);
  doc.fontSize(8)
     .text('( _____________________ )', col1X - 5, startY + 100);

  // ==========================
  // KOLOM KANAN (COMPANY + QR)
  // ==========================
  doc.font('Helvetica').fontSize(8).fillColor('#000')
     .text('Yang Memesan,', col2X, startY);

  // Lokasi dan tanggal satu baris
  const city = company.city || 'Karawang';
  const dateStr = moment(printDate).locale('id').format('DD MMMM YYYY');
  doc.fontSize(7)
     .text(`${city}, ${dateStr}`, col2X, startY + 16);

  // Informasi direktur
  const directorName = company?.director || null;
  const directorPosition = company?.directorPosition || 'Direktur';

  if (directorName && directorName.trim() !== '') {
    try {
      // ==========================
      // QR CODE (Digital Signature)
      // ==========================
      const qrData = {
        po_number: po.poNumber || po.po_number,
        subsidiary: company.name,
        director: directorName,
        position: directorPosition,
        approved_date: moment(po.approved_date || po.approvedDate || po.createdAt || po.created_at).format('YYYY-MM-DD'),
        print_date: moment(printDate).format('YYYY-MM-DD HH:mm:ss'),
        signature_type: 'digital_verified'
      };

      const qrCodeBuffer = await QRCode.toBuffer(JSON.stringify(qrData), {
        errorCorrectionLevel: 'M',
        type: 'png',
        width: qrSize,
        margin: 1
      });

      // Tambahkan QR ke PDF
      doc.image(qrCodeBuffer, qrX, qrY, { width: qrSize, height: qrSize });

      // Label QR
      doc.font('Helvetica')
         .fontSize(5.5)
         .fillColor('#0066CC')
         .text('Tanda Tangan Digital', qrX, qrY + 62, { width: qrSize, align: 'center' })
         .fillColor('#000');

    } catch {
      // Jika QR gagal, lanjut tanpa QR
    }

      // ==========================
      // NAMA DIREKTUR & JABATAN (CENTER DALAM KOTAK DENGAN ALIGN OTOMATIS)
      // ==========================
      const nameY = qrY + qrSize + 15; // jarak bawah QR

      doc.font('Helvetica-Bold')
        .fontSize(8.5)
        .text(directorName, rightBoxX, nameY, {
          width: rightBoxW,     // pakai seluruh lebar kotak
          align: 'center',      // otomatis center secara visual
          lineBreak: false
        });

      doc.font('Helvetica')
        .fontSize(7.5)
        .text(`(${directorPosition})`, rightBoxX, nameY + 12, {
          width: rightBoxW,
          align: 'center',
          lineBreak: false
        });

  } else {
    // Jika tidak ada data direktur
    doc.font('Helvetica').fontSize(8)
       .text('( _____________________ )', col2X - 5, startY + 50);
    doc.fontSize(7)
       .text('(Direktur)', col2X + 30, startY + 62);
  }

  // Advance cursor
  this._advance(this._snap((startY + signatureH) - this.cursorY));
}

  /* ==================== SECTION 8: FOOTER (DALAM MARGIN, AMAN) ==================== */
  _drawFooter(doc, company, printDate) {
    // tempel di area konten, bukan di luar margin
    const footerY = this.pageHeight - this.margin - 30;
    const clamp = y => Math.min(this._snap(y), this.safeBottom - 2);

    doc.font('Helvetica').fontSize(7).fillColor('#666666')
      .text(`${company.name} | ${company.email} | ${company.phone}`, 0, clamp(footerY), {
        align: 'center',
        width: this.pageWidth
      });

    doc.fontSize(7)
      .text('Dokumen ini sah dan resmi tanpa memerlukan tanda tangan basah', 0, clamp(footerY + 10), {
        align: 'center',
        width: this.pageWidth
      });

    doc.fontSize(6).fillColor('#999999')
      .text(`Dicetak pada: ${moment(printDate).format('DD MMMM YYYY HH:mm')} WIB`, 0, clamp(footerY + 20), {
        align: 'center',
        width: this.pageWidth
      });
  }

  /* ==================== UTIL: RUPIAH ==================== */
  _formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  }
}

module.exports = new PurchaseOrderPDFGenerator();
