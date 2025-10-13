const PDFDocument = require('pdfkit');
const moment = require('moment');

/**
 * Generate Professional Invoice PDF with Company Letterhead
 * Indonesian Formal Business Letter Format
 */
class InvoicePDFGenerator {
  constructor() {
    this.pageWidth = 595.28; // A4 width in points
    this.pageHeight = 841.89; // A4 height in points
    this.margin = 50;
  }

  /**
   * Generate invoice PDF and return as buffer
   */
  async generateInvoice(invoiceData, companyInfo, clientInfo) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: this.margin,
          info: {
            Title: `Invoice ${invoiceData.invoiceNumber}`,
            Author: companyInfo.name,
            Subject: 'Invoice Pembayaran Progress Konstruksi',
            Keywords: 'invoice, konstruksi, pembayaran'
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
        this._drawInvoiceHeader(doc, invoiceData);
        this._drawClientInfo(doc, clientInfo);
        this._drawInvoiceDetails(doc, invoiceData);
        this._drawPaymentTerms(doc, invoiceData);
        this._drawSignatureSection(doc, companyInfo);
        this._drawFooter(doc, companyInfo);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Draw company letterhead - formal business style
   */
  _drawLetterhead(doc, company) {
    const startY = this.margin;
    
    // Company Logo (if available)
    if (company.logoPath) {
      try {
        doc.image(company.logoPath, this.margin, startY, { width: 60 });
      } catch (err) {
        console.log('Logo not found, skipping...');
      }
    }

    // Company Name and Info
    doc.font('Helvetica-Bold')
       .fontSize(16)
       .text(company.name || 'PT YK CONSTRUCTION', this.margin + 70, startY);
    
    doc.font('Helvetica')
       .fontSize(9)
       .text(company.address || 'Jl. Contoh No. 123, Jakarta', this.margin + 70, startY + 20)
       .text(`Telp: ${company.phone || '021-12345678'} | Email: ${company.email || 'info@ykconstruction.com'}`, this.margin + 70, startY + 33)
       .text(`NPWP: ${company.npwp || '00.000.000.0-000.000'}`, this.margin + 70, startY + 46);

    // Horizontal line separator
    doc.moveTo(this.margin, startY + 70)
       .lineTo(this.pageWidth - this.margin, startY + 70)
       .strokeColor('#000000')
       .lineWidth(2)
       .stroke();

    return startY + 85;
  }

  /**
   * Draw invoice header - title and reference numbers
   */
  _drawInvoiceHeader(doc, invoice) {
    const startY = this.margin + 100;

    // Invoice Title - Centered
    doc.font('Helvetica-Bold')
       .fontSize(18)
       .text('INVOICE', 0, startY, {
         align: 'center',
         width: this.pageWidth
       });

    // Invoice Number and Date - Right aligned
    const infoX = this.pageWidth - this.margin - 200;
    doc.font('Helvetica')
       .fontSize(10)
       .text('No. Invoice:', infoX, startY + 30)
       .font('Helvetica-Bold')
       .text(invoice.invoiceNumber, infoX + 80, startY + 30)
       
       .font('Helvetica')
       .text('Tanggal:', infoX, startY + 45)
       .font('Helvetica-Bold')
       .text(moment(invoice.invoiceDate).format('DD MMMM YYYY'), infoX + 80, startY + 45)
       
       .font('Helvetica')
       .text('Jatuh Tempo:', infoX, startY + 60)
       .font('Helvetica-Bold')
       .text(moment(invoice.dueDate).format('DD MMMM YYYY'), infoX + 80, startY + 60);

    return startY + 95;
  }

  /**
   * Draw client information
   */
  _drawClientInfo(doc, client) {
    const startY = this.margin + 215;

    doc.font('Helvetica-Bold')
       .fontSize(11)
       .text('Kepada Yth,', this.margin, startY);

    doc.font('Helvetica-Bold')
       .fontSize(12)
       .text(client.name || 'Nama Klien', this.margin, startY + 20);

    doc.font('Helvetica')
       .fontSize(10)
       .text(client.address || 'Alamat Klien', this.margin, startY + 38, {
         width: 250,
         lineGap: 2
       });

    if (client.phone) {
      doc.text(`Telp: ${client.phone}`, this.margin, startY + 70);
    }

    return startY + 100;
  }

  /**
   * Draw invoice details table
   */
  _drawInvoiceDetails(doc, invoice) {
    const startY = this.margin + 335;
    const tableTop = startY;
    const col1X = this.margin;
    const col2X = this.margin + 60;
    const col3X = this.pageWidth - this.margin - 120;
    const col4X = this.pageWidth - this.margin - 100;

    // Opening statement
    doc.font('Helvetica')
       .fontSize(10)
       .text('Dengan hormat,', this.margin, startY - 20);
    
    doc.text(`Berikut ini kami sampaikan tagihan untuk pembayaran progress pekerjaan ${invoice.projectName || 'Proyek Konstruksi'}:`, 
             this.margin, startY - 5, { width: this.pageWidth - (this.margin * 2) });

    // Table header
    doc.rect(this.margin, tableTop + 15, this.pageWidth - (this.margin * 2), 25)
       .fillAndStroke('#E8E8E8', '#000000');

    doc.fillColor('#000000')
       .font('Helvetica-Bold')
       .fontSize(10)
       .text('No', col1X + 5, tableTop + 23)
       .text('Deskripsi', col2X, tableTop + 23)
       .text('Jumlah', col3X, tableTop + 23, { align: 'right', width: 90 });

    // Table rows
    let rowY = tableTop + 50;
    const lineHeight = 20;

    // Item 1: Main payment amount
    doc.font('Helvetica')
       .fontSize(10)
       .text('1', col1X + 5, rowY)
       .text(`Pembayaran Progress - ${invoice.description || invoice.beritaAcara?.baNumber || 'Progress Payment'}`, 
             col2X, rowY, { width: 300 })
       .text(this._formatCurrency(invoice.amount), col3X, rowY, { align: 'right', width: 90 });

    rowY += lineHeight + 10;

    // Calculation section
    const calcX = this.pageWidth - this.margin - 220;
    
    // Subtotal
    doc.moveTo(this.margin, rowY - 5)
       .lineTo(this.pageWidth - this.margin, rowY - 5)
       .stroke();

    doc.font('Helvetica')
       .text('Sub Total:', calcX, rowY)
       .text(this._formatCurrency(invoice.amount), calcX + 100, rowY, { align: 'right', width: 100 });
    rowY += lineHeight;

    // Tax if applicable
    if (invoice.taxAmount && invoice.taxAmount > 0) {
      doc.text(`PPN ${invoice.taxRate || 11}%:`, calcX, rowY)
         .text(this._formatCurrency(invoice.taxAmount), calcX + 100, rowY, { align: 'right', width: 100 });
      rowY += lineHeight;
    }

    // Retention if applicable
    if (invoice.retentionAmount && invoice.retentionAmount > 0) {
      doc.text(`Retensi ${invoice.retentionRate || 5}%:`, calcX, rowY)
         .text(`(${this._formatCurrency(invoice.retentionAmount)})`, calcX + 100, rowY, { align: 'right', width: 100 });
      rowY += lineHeight;
    }

    // Total - highlighted
    doc.moveTo(calcX - 10, rowY - 5)
       .lineTo(this.pageWidth - this.margin, rowY - 5)
       .lineWidth(1.5)
       .stroke();

    doc.font('Helvetica-Bold')
       .fontSize(12)
       .text('TOTAL:', calcX, rowY)
       .text(this._formatCurrency(invoice.netAmount), calcX + 100, rowY, { align: 'right', width: 100 });

    return rowY + 30;
  }

  /**
   * Draw payment terms and bank details
   */
  _drawPaymentTerms(doc, invoice) {
    const startY = this.pageHeight - 320;

    doc.font('Helvetica-Bold')
       .fontSize(11)
       .text('Pembayaran:', this.margin, startY);

    doc.font('Helvetica')
       .fontSize(10)
       .text(`Mohon pembayaran dilakukan paling lambat ${moment(invoice.dueDate).format('DD MMMM YYYY')} melalui transfer ke:`, 
             this.margin, startY + 18, { width: this.pageWidth - (this.margin * 2) });

    // Bank details box
    const boxY = startY + 40;
    doc.rect(this.margin, boxY, this.pageWidth - (this.margin * 2), 65)
       .fillAndStroke('#F5F5F5', '#CCCCCC');

    doc.fillColor('#000000')
       .font('Helvetica-Bold')
       .fontSize(10)
       .text('Bank:', this.margin + 10, boxY + 10)
       .text(invoice.bankName || 'Bank Mandiri', this.margin + 80, boxY + 10)
       
       .text('No. Rekening:', this.margin + 10, boxY + 25)
       .text(invoice.accountNumber || '1234567890', this.margin + 80, boxY + 25)
       
       .text('Atas Nama:', this.margin + 10, boxY + 40)
       .text(invoice.accountName || 'PT YK Construction', this.margin + 80, boxY + 40);

    doc.font('Helvetica')
       .fontSize(9)
       .text('Harap menyertakan nomor invoice pada keterangan transfer.', 
             this.margin, boxY + 72, { width: this.pageWidth - (this.margin * 2) });

    return boxY + 95;
  }

  /**
   * Draw signature section with space for wet signature and stamp
   */
  _drawSignatureSection(doc, company) {
    const startY = this.pageHeight - 180;

    doc.font('Helvetica')
       .fontSize(10)
       .text('Demikian invoice ini kami sampaikan. Atas perhatian dan kerjasamanya kami ucapkan terima kasih.', 
             this.margin, startY, { width: this.pageWidth - (this.margin * 2) });

    // Signature area - right side
    const sigX = this.pageWidth - this.margin - 180;
    
    doc.text(`Jakarta, ${moment().format('DD MMMM YYYY')}`, sigX, startY + 25);
    doc.font('Helvetica-Bold')
       .text(company.name || 'PT YK Construction', sigX, startY + 40);

    // Space for stamp and signature (70px height)
    doc.font('Helvetica')
       .fontSize(8)
       .fillColor('#999999')
       .text('( Materai & Stempel )', sigX + 20, startY + 60, { align: 'center', width: 120 });

    // Name and position line
    doc.moveTo(sigX, startY + 110)
       .lineTo(sigX + 160, startY + 110)
       .stroke();

    doc.fillColor('#000000')
       .font('Helvetica-Bold')
       .fontSize(9)
       .text(company.directorName || 'Nama Direktur', sigX, startY + 118, { align: 'center', width: 160 })
       .font('Helvetica')
       .text(company.directorTitle || 'Direktur', sigX, startY + 132, { align: 'center', width: 160 });

    return startY + 150;
  }

  /**
   * Draw footer with notes
   */
  _drawFooter(doc, company) {
    const footerY = this.pageHeight - 40;

    doc.moveTo(this.margin, footerY - 15)
       .lineTo(this.pageWidth - this.margin, footerY - 15)
       .strokeColor('#CCCCCC')
       .lineWidth(0.5)
       .stroke();

    doc.font('Helvetica')
       .fontSize(8)
       .fillColor('#666666')
       .text('Invoice ini dicetak secara resmi dan merupakan bukti penagihan yang sah.', 
             0, footerY, { align: 'center', width: this.pageWidth })
       .text(`${company.name || 'PT YK Construction'} - ${company.website || 'www.ykconstruction.com'}`, 
             0, footerY + 12, { align: 'center', width: this.pageWidth });
  }

  /**
   * Format currency to Indonesian Rupiah
   */
  _formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  }
}

module.exports = new InvoicePDFGenerator();
