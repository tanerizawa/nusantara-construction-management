const PDFDocument = require('pdfkit');
const moment = require('moment');

/**
 * Generate Professional Work Order PDF - Perintah Kerja
 * Indonesian Formal Business Format
 */
class WorkOrderPDFGenerator {
  constructor() {
    this.pageWidth = 595.28; // A4 width in points
    this.pageHeight = 841.89; // A4 height in points
    this.margin = 40; // Reduced from 50 for single page optimization
  }

  /**
   * Generate WO PDF and return as buffer - OPTIMIZED FOR SINGLE PAGE
   */
  async generateWO(woData, companyInfo, contractorInfo) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 40, // Reduced margin
          info: {
            Title: `Perintah Kerja ${woData.woNumber}`,
            Author: companyInfo.name,
            Subject: 'Perintah Kerja - Work Order Konstruksi',
            Keywords: 'perintah kerja, work order, konstruksi'
          }
        });

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });
        doc.on('error', reject);

        // Draw content
        this._drawLetterhead(doc, companyInfo);
        this._drawWOHeader(doc, woData);
        this._drawContractorInfo(doc, contractorInfo);
        this._drawWorkScope(doc, woData);
        this._drawItemsTable(doc, woData);
        this._drawTotalSection(doc, woData);
        this._drawTermsAndConditions(doc, woData);
        this._drawSignatureSection(doc, companyInfo, woData, contractorInfo);
        this._drawFooter(doc, companyInfo);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Draw company letterhead - OPTIMIZED
   */
  _drawLetterhead(doc, company) {
    const startY = this.margin;
    
    // Company Logo placeholder (smaller)
    doc.rect(this.margin, startY, 50, 50)
       .strokeColor('#CCCCCC')
       .lineWidth(1)
       .stroke();
    
    doc.fontSize(7)
       .fillColor('#999999')
       .text('LOGO', this.margin + 17, startY + 20);

    // Company Name and Info (more compact)
    doc.font('Helvetica-Bold')
       .fontSize(14) // Reduced from 16
       .fillColor('#000000')
       .text(company.name || 'PT Nusantara Construction', this.margin + 60, startY);
    
    doc.font('Helvetica')
       .fontSize(8) // Reduced from 9
       .text(company.address || 'Jakarta, Indonesia', this.margin + 60, startY + 18, { width: 450 })
       .text(`Telp: ${company.phone || '021-12345678'} | Email: ${company.email || 'info@nusantara.co.id'}`, this.margin + 60, startY + 30)
       .text(`NPWP: ${company.npwp || '00.000.000.0-000.000'}`, this.margin + 60, startY + 42);

    // Horizontal line separator
    doc.moveTo(this.margin, startY + 60)
       .lineTo(this.pageWidth - this.margin, startY + 60)
       .strokeColor('#000000')
       .lineWidth(1.5)
       .stroke();

    return startY + 70; // Reduced spacing
  }

  /**
   * Draw WO header - title and reference numbers - OPTIMIZED
   */
  _drawWOHeader(doc, wo) {
    const startY = this.margin + 75;

    // WO Title - Centered and Bold (smaller)
    doc.font('Helvetica-Bold')
       .fontSize(16) // Reduced from 20
       .fillColor('#000000')
       .text('PERINTAH KERJA', 0, startY, {
         align: 'center',
         width: this.pageWidth
       });
    
    doc.font('Helvetica')
       .fontSize(12)
       .text('(WORK ORDER)', 0, startY + 25, {
         align: 'center',
         width: this.pageWidth
       });

    // WO Number and Details - Right aligned
    const infoX = this.pageWidth - this.margin - 220;
    doc.font('Helvetica')
       .fontSize(10)
       .text('No. WO:', infoX, startY + 45)
       .font('Helvetica-Bold')
       .fontSize(11)
       .text(wo.woNumber || wo.wo_number || 'N/A', infoX + 80, startY + 45)
       
       .font('Helvetica')
       .fontSize(10)
       .text('Tanggal:', infoX, startY + 60)
       .font('Helvetica-Bold')
       .text(moment(wo.createdAt || wo.created_at).format('DD MMMM YYYY'), infoX + 80, startY + 60)
       
       .font('Helvetica')
       .text('Proyek:', infoX, startY + 75)
       .font('Helvetica-Bold')
       .text(wo.projectId || 'N/A', infoX + 80, startY + 75);

    return startY + 110;
  }

  /**
   * Draw contractor information box
   */
  _drawContractorInfo(doc, contractor) {
    const startY = this.margin + 230;

    // "Kepada Yth" section
    doc.font('Helvetica-Bold')
       .fontSize(11)
       .fillColor('#000000')
       .text('Kepada Yth,', this.margin, startY);

    // Contractor detail box
    doc.rect(this.margin, startY + 20, 250, 80)
       .strokeColor('#CCCCCC')
       .lineWidth(1)
       .stroke();

    doc.font('Helvetica-Bold')
       .fontSize(12)
       .text(contractor.name || 'Nama Kontraktor/Mandor', this.margin + 10, startY + 30);

    doc.font('Helvetica')
       .fontSize(10)
       .text(contractor.address || '-', this.margin + 10, startY + 48, {
         width: 230,
         lineGap: 2
       });

    if (contractor.contact) {
      doc.text(`Kontak: ${contractor.contact}`, this.margin + 10, startY + 75);
    }

    // Work Period box
    if (contractor.startDate || contractor.endDate) {
      const periodX = this.pageWidth - this.margin - 220;
      doc.rect(periodX, startY + 20, 220, 50)
         .strokeColor('#CCCCCC')
         .lineWidth(1)
         .stroke();

      doc.font('Helvetica')
         .fontSize(9)
         .text('Periode Kerja:', periodX + 10, startY + 27);

      const startDate = contractor.startDate ? moment(contractor.startDate).format('DD MMM YYYY') : '-';
      const endDate = contractor.endDate ? moment(contractor.endDate).format('DD MMM YYYY') : '-';

      doc.font('Helvetica-Bold')
         .fontSize(10)
         .text(`${startDate} s/d ${endDate}`, periodX + 10, startY + 43, {
           width: 200,
           lineGap: 2
         });
    }

    return startY + 120;
  }

  /**
   * Draw work scope description
   */
  _drawWorkScope(doc, wo) {
    const startY = this.margin + 365;

    doc.font('Helvetica')
       .fontSize(10)
       .fillColor('#000000')
       .text('Dengan hormat,', this.margin, startY);
    
    doc.text(
      `Bersama ini kami instruksikan kepada Saudara untuk melaksanakan pekerjaan sebagai berikut:`,
      this.margin, 
      startY + 15, 
      { width: this.pageWidth - (this.margin * 2), lineGap: 3 }
    );

    // Work description box (if provided)
    if (wo.description || wo.workScope) {
      doc.rect(this.margin, startY + 45, this.pageWidth - (this.margin * 2), 50)
         .strokeColor('#E0E0E0')
         .lineWidth(1)
         .stroke();

      doc.font('Helvetica-Bold')
         .fontSize(9)
         .text('Deskripsi Pekerjaan:', this.margin + 10, startY + 52);

      doc.font('Helvetica')
         .fontSize(9)
         .text(
           wo.description || wo.workScope || 'Pekerjaan sesuai RAB yang telah disetujui',
           this.margin + 10,
           startY + 65,
           { width: this.pageWidth - (this.margin * 2) - 20, lineGap: 2 }
         );
    }

    return startY + 110;
  }

  /**
   * Draw items table
   */
  _drawItemsTable(doc, wo) {
    const startY = this.margin + 380; // Reduced from 500 for compact layout
    const tableTop = startY;

    // Column positions - adjusted for better spacing
    const col1X = this.margin; // No
    const col2X = this.margin + 30; // Uraian Pekerjaan
    const col3X = this.margin + 200; // Spesifikasi
    const col4X = this.pageWidth - this.margin - 220; // Volume
    const col5X = this.pageWidth - this.margin - 150; // Harga Satuan
    const col6X = this.pageWidth - this.margin - 80; // Jumlah

    // Table title
    doc.font('Helvetica-Bold')
       .fontSize(10) // Reduced from 11
       .text('Rincian Pekerjaan:', this.margin, startY - 15);

    // Table header background
    doc.rect(this.margin, tableTop, this.pageWidth - (this.margin * 2), 25)
       .fillAndStroke('#E8E8E8', '#000000');

    // Table header text
    doc.fillColor('#000000')
       .font('Helvetica-Bold')
       .fontSize(8) // Reduced from 9
       .text('No', col1X + 3, tableTop + 8)
       .text('Uraian Pekerjaan', col2X, tableTop + 8)
       .text('Spesifikasi', col3X, tableTop + 8)
       .text('Volume', col4X, tableTop + 8)
       .text('Harga Satuan', col5X, tableTop + 8, { width: 60, align: 'right' })
       .text('Jumlah', col6X, tableTop + 8, { width: 70, align: 'right' });

    // Table rows - LIMIT TO 5 ITEMS FOR SINGLE PAGE
    let rowY = tableTop + 35;
    const lineHeight = 22; // Reduced from 35 for compact layout
    const items = wo.items || [];
    const maxItems = 5; // Max items to fit in single page
    const displayItems = items.slice(0, maxItems);

    displayItems.forEach((item, index) => {
      // Row border
      doc.rect(this.margin, rowY - 5, this.pageWidth - (this.margin * 2), lineHeight)
         .strokeColor('#CCCCCC')
         .lineWidth(0.5)
         .stroke();

      // Row data
      doc.font('Helvetica')
         .fontSize(7) // Reduced from 8 for better fit
         .fillColor('#000000')
         .text((index + 1).toString(), col1X + 3, rowY)
         .text(item.itemName || item.item_name || item.description || '-', col2X, rowY, { width: 160, lineGap: 0 })
         .text(item.specification || '-', col3X, rowY, { width: 150, lineGap: 0 })
         .text(`${item.quantity || 0} ${item.unit || ''}`, col4X, rowY, { width: 60 })
         .text(this._formatCurrency(item.unitPrice || item.unit_price || 0), col5X, rowY, { width: 65, align: 'right' })
         .text(this._formatCurrency(item.totalPrice || item.total_price || 0), col6X, rowY, { width: 70, align: 'right' });

      rowY += lineHeight;
    });

    // Show remaining items count if truncated
    if (items.length > maxItems) {
      doc.font('Helvetica-Oblique')
         .fontSize(7)
         .fillColor('#666666')
         .text(`... dan ${items.length - maxItems} item lainnya`, this.margin + 10, rowY, { width: 200 });
      rowY += 12;
    }

    return rowY + 10;
  }

  /**
   * Draw total section
   */
  _drawTotalSection(doc, wo) {
    const items = wo.items || [];
    const lineHeight = 35; // Match table lineHeight
    const lastItemY = this.margin + 500 + 35 + (items.length * lineHeight);
    const startY = lastItemY + 20;

    const labelX = this.pageWidth - this.margin - 200;
    const valueX = this.pageWidth - this.margin - 80;

    // Subtotal
    doc.font('Helvetica')
       .fontSize(10)
       .text('Subtotal:', labelX, startY)
       .font('Helvetica-Bold')
       .text(this._formatCurrency(wo.totalAmount || wo.total_amount || 0), valueX, startY, { width: 70, align: 'right' });

    // Tax (if applicable)
    if (wo.tax && wo.tax > 0) {
      doc.font('Helvetica')
         .fontSize(10)
         .text(`PPN (${wo.taxRate || 11}%):`, labelX, startY + 20)
         .font('Helvetica-Bold')
         .text(this._formatCurrency(wo.tax), valueX, startY + 20, { width: 70, align: 'right' });
    }

    // Grand Total with background
    const totalY = wo.tax && wo.tax > 0 ? startY + 45 : startY + 25;
    doc.rect(labelX - 10, totalY - 5, 210, 25)
       .fillAndStroke('#E8E8E8', '#000000');

    doc.fillColor('#000000')
       .font('Helvetica-Bold')
       .fontSize(12)
       .text('TOTAL NILAI PEKERJAAN:', labelX - 80, totalY + 3)
       .fontSize(13)
       .text(this._formatCurrency(wo.totalAmount || wo.total_amount || 0), valueX, totalY + 3, { width: 70, align: 'right' });

    return totalY + 40;
  }

  /**
   * Draw terms and conditions
   */
  _drawTermsAndConditions(doc, wo) {
    const items = wo.items || [];
    const lineHeight = 35; // Match table lineHeight
    const lastItemY = this.margin + 500 + 35 + (items.length * lineHeight);
    const startY = lastItemY + 130; // Increased spacing

    doc.font('Helvetica-Bold')
       .fontSize(10)
       .fillColor('#000000')
       .text('Ketentuan Pelaksanaan:', this.margin, startY);

    const terms = [
      '1. Pekerjaan dilaksanakan sesuai dengan spesifikasi teknis yang telah ditetapkan',
      '2. Kontraktor wajib menyediakan tenaga kerja, alat, dan material sesuai kebutuhan',
      '3. Pembayaran dilakukan bertahap sesuai progress pekerjaan yang telah diverifikasi',
      '4. Kontraktor bertanggung jawab atas kualitas dan keamanan kerja',
      '5. Laporan progress wajib disampaikan secara berkala sesuai kesepakatan',
      '6. Pekerjaan harus selesai sesuai jadwal yang telah ditentukan'
    ];

    doc.font('Helvetica')
       .fontSize(8);

    terms.forEach((term, index) => {
      doc.text(term, this.margin, startY + 15 + (index * 12), { width: this.pageWidth - (this.margin * 2) });
    });

    return startY + 100;
  }

  /**
   * Draw signature section - SMART SIGNATURES FROM DATABASE
   */
  _drawSignatureSection(doc, company, wo, contractor) {
    // Fixed position for signature (no new page for single page optimization)
    const startY = this.pageHeight - 120; // Fixed position near bottom
    return this._drawSignatureSectionAtY(doc, company, wo, contractor, startY);
  }

  _drawSignatureSectionAtY(doc, company, wo, contractor, startY) {
    const col1X = this.margin;
    const col2X = this.pageWidth / 2 - 75;
    const col3X = this.pageWidth - this.margin - 150;

    // Left: Kontraktor/Pelaksana
    doc.font('Helvetica')
       .fontSize(8)
       .fillColor('#000000')
       .text('Menyetujui,', col1X, startY);

    // Contractor contact person or blank
    const contractorName = contractor?.contactPerson || contractor?.name || '';
    if (contractorName) {
      doc.font('Helvetica-Bold')
         .fontSize(8)
         .text(contractorName, col1X, startY + 35);
      doc.font('Helvetica')
         .fontSize(7)
         .text('(Pelaksana)', col1X, startY + 48);
    } else {
      doc.font('Helvetica')
         .text('( _____________ )', col1X, startY + 35);
      doc.fontSize(7)
         .text('(Pelaksana)', col1X, startY + 48);
    }

    // Center: Pengawas (usually from project manager)
    doc.font('Helvetica')
       .fontSize(8)
       .text('Mengetahui,', col2X, startY);

    const supervisorName = wo?.supervisor_name || wo?.supervisorName || '';
    if (supervisorName) {
      doc.font('Helvetica-Bold')
         .fontSize(8)
         .text(supervisorName, col2X, startY + 35);
      doc.font('Helvetica')
         .fontSize(7)
         .text('(Pengawas)', col2X, startY + 48);
    } else {
      doc.font('Helvetica')
         .text('( _____________ )', col2X, startY + 35);
      doc.fontSize(7)
         .text('(Pengawas)', col2X, startY + 48);
    }

    // Right: Pimpinan Subsidiary
    doc.font('Helvetica')
       .fontSize(8)
       .text('Yang Memerintahkan,', col3X, startY);

    doc.fontSize(7)
       .text(company.city || 'Jakarta', col3X, startY + 12);
    doc.text(moment().format('DD MMM YYYY'), col3X, startY + 22);

    const companySignature = company?.director || wo?.approved_by || wo?.approvedBy || '';
    if (companySignature) {
      doc.font('Helvetica-Bold')
         .fontSize(8)
         .text(companySignature, col3X, startY + 35);
      doc.font('Helvetica')
         .fontSize(7)
         .text('(Pimpinan)', col3X, startY + 48);
    } else {
      doc.font('Helvetica')
         .text('( _____________ )', col3X, startY + 35);
      doc.fontSize(7)
         .text('(Pimpinan)', col3X, startY + 48);
    }

    return startY + 70;
  }

  /**
   * Draw footer - WITH PRINT DATE
   */
  _drawFooter(doc, company) {
    const footerY = this.pageHeight - 35; // Adjusted for new layout

    doc.font('Helvetica')
       .fontSize(7)
       .fillColor('#666666')
       .text(
         `${company.name || 'PT Nusantara Construction'} | ${company.email || 'info@nusantara.co.id'} | ${company.phone || '021-12345678'}`,
         0,
         footerY,
         { align: 'center', width: this.pageWidth }
       );

    doc.text(
      'Dokumen ini sah dan resmi tanpa memerlukan tanda tangan basah',
      0,
      footerY + 10,
      { align: 'center', width: this.pageWidth }
    );

    doc.fontSize(6)
       .text(
         `Dicetak pada: ${moment().format('DD MMMM YYYY HH:mm')} WIB`,
         0,
         footerY + 20,
         { align: 'center', width: this.pageWidth }
       );
  }

  /**
   * Format currency to Indonesian Rupiah
   */
  _formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  }
}

module.exports = new WorkOrderPDFGenerator();
