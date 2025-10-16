const PDFDocument = require('pdfkit');
const moment = require('moment');
const QRCode = require('qrcode');

/**
 * Generate Professional Purchase Order PDF
 * Indonesian Formal Business Format
 */
class PurchaseOrderPDFGenerator {
  constructor() {
    this.pageWidth = 595.28; // A4 width in points
    this.pageHeight = 841.89; // A4 height in points
    this.margin = 40; // Reduced from 50 for single page optimization
  }

  /**
   * Generate PO PDF and return as buffer
   * @param {Object} poData - Purchase Order data
   * @param {Object} companyInfo - Company information
   * @param {Object} supplierInfo - Supplier information
   * @param {Date} printDate - Date when PDF is generated (default: now)
   */
  async generatePO(poData, companyInfo, supplierInfo, printDate = new Date()) {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 40, // Reduced from 50 for single page
          info: {
            Title: `Purchase Order ${poData.poNumber}`,
            Author: companyInfo.name,
            Subject: 'Purchase Order - Pemesanan Material/Jasa Konstruksi',
            Keywords: 'purchase order, konstruksi, pemesanan',
            CreationDate: printDate // Set PDF creation date
          }
        });

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });
        doc.on('error', reject);

        // Draw content with print date
        this._drawLetterhead(doc, companyInfo);
        this._drawPOHeader(doc, poData, printDate); // Pass print date
        this._drawSupplierInfo(doc, supplierInfo);
        this._drawItemsTable(doc, poData);
        this._drawTotalSection(doc, poData);
        this._drawTermsAndConditions(doc, poData);
        await this._drawSignatureSection(doc, companyInfo, poData, supplierInfo, printDate); // Now async with QR code
        this._drawFooter(doc, companyInfo, printDate); // Pass print date

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Draw company letterhead with actual subsidiary data
   */
  _drawLetterhead(doc, company) {
    const startY = this.margin;
    const fs = require('fs');
    const path = require('path');
    
    // Company Logo - use actual logo if available
    if (company.logo) {
      const logoPath = path.join(__dirname, '..', 'uploads', company.logo);
      try {
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, this.margin, startY, {
            fit: [45, 45],
            align: 'center',
            valign: 'center'
          });
        } else {
          // Logo not found - draw placeholder
          doc.rect(this.margin, startY, 45, 45)
             .strokeColor('#CCCCCC')
             .lineWidth(1)
             .stroke();
          doc.fontSize(6)
             .fillColor('#999999')
             .text('LOGO', this.margin + 15, startY + 18);
        }
      } catch (error) {
        console.error('✗ Failed to load logo:', error.message);
        // Draw placeholder on error
        doc.rect(this.margin, startY, 45, 45)
           .strokeColor('#CCCCCC')
           .lineWidth(1)
           .stroke();
        doc.fontSize(6)
           .fillColor('#999999')
           .text('LOGO', this.margin + 15, startY + 18);
      }
    } else {
      // No logo - draw placeholder
      doc.rect(this.margin, startY, 45, 45)
         .strokeColor('#CCCCCC')
         .lineWidth(1)
         .stroke();
      doc.fontSize(6)
         .fillColor('#999999')
         .text('LOGO', this.margin + 15, startY + 18);
    }

    // Company Name and Info - USE ACTUAL DATA
    doc.font('Helvetica-Bold')
       .fontSize(13)
       .fillColor('#000000')
       .text(company.name, this.margin + 55, startY);
    
    doc.font('Helvetica')
       .fontSize(7.5)
       .fillColor('#333333')
       .text(company.address, this.margin + 55, startY + 16, { width: 450 })
       .text(`Telp: ${company.phone} | Email: ${company.email}`, this.margin + 55, startY + 27)
       .text(`NPWP: ${company.npwp}`, this.margin + 55, startY + 38);

    // Horizontal line separator
    doc.moveTo(this.margin, startY + 52)
       .lineTo(this.pageWidth - this.margin, startY + 52)
       .strokeColor('#000000')
       .lineWidth(1.5)
       .stroke();

    return startY + 58;
  }

  /**
   * Draw PO header - title and reference numbers - OPTIMIZED
   * Shows creation date (approved date) and print date
   */
  _drawPOHeader(doc, po, printDate) {
    const startY = this.margin + 62;

    // PO Title - Centered and Bold (smaller)
    doc.font('Helvetica-Bold')
       .fontSize(15) // Reduced from 16
       .fillColor('#000000')
       .text('PURCHASE ORDER', 0, startY, {
         align: 'center',
         width: this.pageWidth
       });

    // PO Number and Details - Right aligned (more compact)
    const infoX = this.pageWidth - this.margin - 200;
    
    // PO Number
    doc.font('Helvetica')
       .fontSize(7.5) // Reduced from 8
       .text('No. PO:', infoX, startY + 24)
       .font('Helvetica-Bold')
       .fontSize(8.5) // Reduced from 9
       .text(po.poNumber || po.po_number || 'N/A', infoX + 65, startY + 24);
    
    // Tanggal Dibuat (from approved_date or created_at)
    const createdDate = po.approved_date || po.approvedDate || po.createdAt || po.created_at;
    doc.font('Helvetica')
       .fontSize(7.5)
       .text('Tgl. Dibuat:', infoX, startY + 35)
       .font('Helvetica-Bold')
       .text(moment(createdDate).format('DD MMM YYYY'), infoX + 65, startY + 35);
    
    // Tanggal Dicetak (current/print date)
    doc.font('Helvetica')
       .fontSize(7.5)
       .text('Tgl. Cetak:', infoX, startY + 46)
       .font('Helvetica-Bold')
       .fillColor('#0066CC') // Blue color to distinguish
       .text(moment(printDate).format('DD MMM YYYY HH:mm'), infoX + 65, startY + 46)
       .fillColor('#000000'); // Reset to black
    
    // Project ID
    doc.font('Helvetica')
       .fontSize(7.5)
       .text('Proyek:', infoX, startY + 57)
       .font('Helvetica-Bold')
       .text(po.projectId || po.project_id || 'N/A', infoX + 65, startY + 57);

    return startY + 76; // Adjusted for extra line
  }

  /**
   * Draw supplier information box - OPTIMIZED
   */
  _drawSupplierInfo(doc, supplier) {
    const startY = this.margin + 146; // Adjusted from 135 for extra header line

    // "Kepada Yth" section
    doc.font('Helvetica-Bold')
       .fontSize(10)
       .fillColor('#000000')
       .text('Kepada Yth,', this.margin, startY);

    // Supplier detail box (smaller)
    doc.rect(this.margin, startY + 16, 240, 68)
       .strokeColor('#CCCCCC')
       .lineWidth(1)
       .stroke();

    doc.font('Helvetica-Bold')
       .fontSize(10.5)
       .text(supplier.name || 'Nama Supplier', this.margin + 8, startY + 24);

    doc.font('Helvetica')
       .fontSize(8.5)
       .text(supplier.address || '-', this.margin + 8, startY + 40, {
         width: 220,
         lineGap: 1
       });

    if (supplier.contact) {
      doc.text(`Kontak: ${supplier.contact}`, this.margin + 8, startY + 65);
    }

    // Delivery Date box (smaller)
    if (supplier.deliveryDate) {
      const deliveryX = this.pageWidth - this.margin - 210;
      doc.rect(deliveryX, startY + 16, 210, 32)
         .strokeColor('#CCCCCC')
         .lineWidth(1)
         .stroke();

      doc.font('Helvetica')
         .fontSize(8)
         .text('Target Pengiriman:', deliveryX + 8, startY + 23);

      doc.font('Helvetica-Bold')
         .fontSize(10)
         .text(moment(supplier.deliveryDate).format('DD MMMM YYYY'), deliveryX + 8, startY + 35);
    }

    return startY + 92; // Reduced spacing
  }

  /**
   * Draw items table - OPTIMIZED
   */
  _drawItemsTable(doc, po) {
    const startY = this.margin + 246; // Adjusted from 235 for extra header line
    const tableTop = startY;

    // Column positions - adjusted for better spacing
    const col1X = this.margin; // No
    const col2X = this.margin + 28; // Nama Item
    const col3X = this.margin + 180; // Spesifikasi
    const col4X = this.pageWidth - this.margin - 210; // Qty
    const col5X = this.pageWidth - this.margin - 145; // Harga Satuan
    const col6X = this.pageWidth - this.margin - 75; // Total

    // Table header background
    doc.rect(this.margin, tableTop, this.pageWidth - (this.margin * 2), 25)
       .fillAndStroke('#E8E8E8', '#000000');

    // Table header text
    doc.fillColor('#000000')
       .font('Helvetica-Bold')
       .fontSize(9)
       .text('No', col1X + 3, tableTop + 8)
       .text('Nama Item', col2X, tableTop + 8)
       .text('Spesifikasi', col3X, tableTop + 8)
       .text('Qty', col4X, tableTop + 8)
       .text('Harga Satuan', col5X, tableTop + 8, { width: 60, align: 'right' })
       .text('Total', col6X, tableTop + 8, { width: 70, align: 'right' });

    // Table rows - LIMIT TO 6 ITEMS FOR SINGLE PAGE
    let rowY = tableTop + 35;
    const lineHeight = 25; // Reduced from 35 for compact layout
    const items = po.items || [];
    const maxItems = 6; // Max items to fit in single page
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
         .text(item.itemName || item.item_name || '-', col2X, rowY, { width: 160, lineGap: 1 })
         .text(item.specification || '-', col3X, rowY, { width: 150, lineGap: 1 })
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
      rowY += 15;
    }

    return rowY + 10;
  }

  /**
   * Draw total section - FIXED positioning to prevent overlap
   */
  _drawTotalSection(doc, po) {
    const items = po.items || [];
    const lineHeight = 25; // Match table lineHeight
    const maxItems = 6;
    const displayItems = items.length > maxItems ? maxItems : items.length;
    const lastItemY = this.margin + 246 + 35 + (displayItems * lineHeight); // Adjusted from 235
    
    // Add extra spacing if there's a truncation message
    const extraSpace = items.length > maxItems ? 15 : 0;
    const startY = lastItemY + extraSpace + 15; // More spacing to prevent overlap

    const labelX = this.pageWidth - this.margin - 190;
    const valueX = this.pageWidth - this.margin - 75;

    // Subtotal
    doc.font('Helvetica')
       .fontSize(9)
       .fillColor('#000000')
       .text('Subtotal:', labelX, startY)
       .font('Helvetica-Bold')
       .text(this._formatCurrency(po.totalAmount || po.total_amount || 0), valueX, startY, { width: 70, align: 'right' });

    // Tax (if applicable)
    let taxY = startY;
    if (po.tax && po.tax > 0) {
      taxY = startY + 18;
      doc.font('Helvetica')
         .fontSize(9)
         .fillColor('#000000')
         .text(`PPN (${po.taxRate || 11}%):`, labelX, taxY)
         .font('Helvetica-Bold')
         .text(this._formatCurrency(po.tax), valueX, taxY, { width: 70, align: 'right' });
    }

    // Grand Total with background
    const totalY = po.tax && po.tax > 0 ? taxY + 24 : startY + 18;
    doc.rect(labelX - 8, totalY - 4, 190, 22)
       .fillAndStroke('#E8E8E8', '#000000');

    doc.fillColor('#000000')
       .font('Helvetica-Bold')
       .fontSize(11)
       .text('TOTAL:', labelX, totalY + 2)
       .fontSize(12)
       .text(this._formatCurrency(po.totalAmount || po.total_amount || 0), valueX, totalY + 2, { width: 70, align: 'right' });

    return totalY + 32;
  }

  /**
   * Draw terms and conditions
   */
    /**
   * Draw terms and conditions - OPTIMIZED & COMPACT
   */
  _drawTermsAndConditions(doc, po) {
    // Calculate dynamic position based on actual total section
    const items = po.items || [];
    const lineHeight = 25;
    const maxItems = 6;
    const displayItems = items.length > maxItems ? maxItems : items.length;
    const lastItemY = this.margin + 246 + 35 + (displayItems * lineHeight); // Adjusted from 235
    const extraSpace = items.length > maxItems ? 15 : 0;
    const totalSectionHeight = po.tax && po.tax > 0 ? 60 : 45;
    const startY = lastItemY + extraSpace + 15 + totalSectionHeight + 8;

    doc.font('Helvetica-Bold')
       .fontSize(8.5)
       .fillColor('#000000')
       .text('Syarat dan Ketentuan:', this.margin, startY);

    const terms = [
      '1. Pembayaran dilakukan setelah barang/jasa diterima dan sesuai spesifikasi',
      '2. Supplier wajib menyertakan surat jalan dan faktur asli',
      '3. Barang tidak sesuai spesifikasi akan dikembalikan',
      '4. PO ini berlaku sebagai kontrak pemesanan yang mengikat'
    ];

    doc.font('Helvetica')
       .fontSize(7.5) // Reduced for compact
       .fillColor('#333333');

    let termsY = startY + 12;
    terms.forEach(term => {
      doc.text(term, this.margin, termsY, { 
        width: this.pageWidth - (this.margin * 2),
        lineGap: 0
      });
      termsY += 11; // Reduced spacing
    });

    return termsY + 5;
  }

  /**
   * Draw signature section with QR Code Digital Signature
   */
  async _drawSignatureSection(doc, company, po, supplier, printDate) {
    const startY = this.pageHeight - 150; // Adjusted for QR code space

    // Signature columns
    const col1X = this.margin + 30; // Supplier column (left)
    const col2X = this.pageWidth - this.margin - 180; // Company column (right)

    // Left: Supplier (Yang Menerima) - NO QR CODE
    doc.font('Helvetica')
       .fontSize(8)
       .fillColor('#000000')
       .text('Yang Menerima,', col1X, startY);

    doc.fontSize(7)
       .text('(Supplier/Kontraktor)', col1X, startY + 12);

    // Blank signature line for supplier
    doc.font('Helvetica')
       .fontSize(8)
       .text('( _____________________ )', col1X - 5, startY + 50);

    // Right: Company (Yang Memesan) - WITH QR CODE DIGITAL SIGNATURE
    doc.font('Helvetica')
       .fontSize(8)
       .text('Yang Memesan,', col2X, startY);

    doc.fontSize(7)
       .text(company.city || 'Jakarta', col2X, startY + 12);
    doc.text(moment(printDate).format('DD MMMM YYYY'), col2X, startY + 22);

    // Use director from subsidiary board_of_directors ONLY (no fallback to approved_by)
    const directorName = company?.director || null;
    const directorPosition = company?.directorPosition || 'Direktur';
    
    if (directorName && directorName.trim() !== '') {
      // Director name
      doc.font('Helvetica-Bold')
         .fontSize(8.5)
         .text(directorName, col2X, startY + 40);
      
      // Director position
      doc.font('Helvetica')
         .fontSize(7.5)
         .text(`(${directorPosition})`, col2X, startY + 52);

      // Generate QR Code for Digital Signature
      try {
        const qrData = {
          po_number: po.poNumber || po.po_number,
          subsidiary: company.name,
          director: directorName,
          position: directorPosition,
          approved_date: moment(po.approved_date || po.approvedDate || po.createdAt || po.created_at).format('YYYY-MM-DD'),
          print_date: moment(printDate).format('YYYY-MM-DD HH:mm:ss'),
          signature_type: 'digital_verified'
        };

        // Generate QR code as buffer (smaller size for better fit)
        const qrCodeBuffer = await QRCode.toBuffer(JSON.stringify(qrData), {
          errorCorrectionLevel: 'M',
          type: 'png',
          width: 60, // Reduced from 70
          margin: 1
        });

        // Add QR code to PDF (positioned to the right of director name)
        const qrX = col2X + 130; // Position to the right
        const qrY = startY + 38;
        
        doc.image(qrCodeBuffer, qrX, qrY, {
          width: 60,
          height: 60
        });

        // Add "Digital Signature" text below QR code
        doc.font('Helvetica')
           .fontSize(5.5)
           .fillColor('#0066CC')
           .text('Tanda Tangan', qrX, qrY + 62, {
             width: 60,
             align: 'center'
           })
           .text('Digital', qrX, qrY + 68, {
             width: 60,
             align: 'center'
           })
           .fillColor('#000000');

        console.log('✓ QR Code digital signature generated for:', directorName);
      } catch (error) {
        console.error('✗ Failed to generate QR code:', error.message);
        // Continue without QR code if generation fails
      }
    } else {
      // No director data - show blank line
      doc.font('Helvetica')
         .fontSize(8)
         .text('( _____________________ )', col2X - 5, startY + 50);
      doc.fontSize(7)
         .text('(Direktur)', col2X + 30, startY + 62);
      
      console.log('⚠ No director data available for signature');
    }

    return startY + 120; // Adjusted return for QR code height
  }

  /**
   * Draw footer
   */
    /**
   * Draw footer - WITH PRINT DATE
   */
    /**
   * Draw footer with dynamic print date
   */
  _drawFooter(doc, company, printDate) {
    const footerY = this.pageHeight - this.margin + 10;

    doc.font('Helvetica')
       .fontSize(7)
       .fillColor('#666666')
       .text(
         `${company.name} | ${company.email} | ${company.phone}`,
         0,
         footerY,
         { align: 'center', width: this.pageWidth }
       );

    doc.fontSize(7)
       .text(
         'Dokumen ini sah dan resmi tanpa memerlukan tanda tangan basah',
         0,
         footerY + 10,
         { align: 'center', width: this.pageWidth }
       );

    // Use dynamic print date instead of moment()
    doc.fontSize(6)
       .fillColor('#999999')
       .text(
         `Dicetak pada: ${moment(printDate).format('DD MMMM YYYY HH:mm')} WIB`,
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

module.exports = new PurchaseOrderPDFGenerator();
