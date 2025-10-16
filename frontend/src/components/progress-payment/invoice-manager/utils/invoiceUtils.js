import { INVOICE_STATUS } from '../config/invoiceConfig';

/**
 * Generate invoices from payments
 */
export const generateInvoicesFromPayments = (payments) => {
  return payments
    .filter(p => p.invoiceNumber) // Show all payments with invoice number
    .map(payment => {
      // Use backend invoiceStatus if available, otherwise determine from payment data
      let invoiceStatus = payment.invoiceStatus || 'draft';
      
      // Backend provides accurate status mapping, use it
      // Only fallback to client-side logic if not provided
      if (!payment.invoiceStatus) {
        // Fallback logic (legacy)
        if (payment.status === 'approved' || payment.status === 'payment_approved') {
          invoiceStatus = 'generated';
        }
        
        if (payment.status === 'invoice_sent' || payment.invoiceSentAt || payment.invoiceSent) {
          invoiceStatus = 'invoice_sent';
        }
        
        if (payment.status === 'paid') {
          invoiceStatus = 'paid';
        }
        
        // Check if overdue
        const dueDate = new Date(payment.dueDate);
        const today = new Date();
        if (dueDate < today && payment.status !== 'paid' && (payment.status === 'approved' || payment.status === 'invoice_sent')) {
          invoiceStatus = 'overdue';
        }
      }
      
      return {
        id: payment.id,
        invoiceNumber: payment.invoiceNumber || `INV-${payment.paymentNumber}`,
        invoiceDate: payment.invoiceDate || payment.createdAt,
        dueDate: payment.dueDate,
        amount: payment.amount,
        netAmount: payment.netAmount,
        taxAmount: payment.taxAmount,
        retentionAmount: payment.retentionAmount,
        status: invoiceStatus, // Clean invoice status
        paymentStatus: payment.status, // Original payment status
        paymentTerms: payment.paymentTerms || 30, // Default 30 days
        beritaAcara: payment.beritaAcara,
        notes: payment.notes,
        invoiceSentAt: payment.invoiceSentAt,
        paidAt: payment.paidAt
      };
    });
};

/**
 * Filter invoices based on search term and status
 */
export const filterInvoices = (invoices, searchTerm, statusFilter) => {
  return invoices.filter(invoice => {
    const matchesSearch = searchTerm === '' || 
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.beritaAcara?.baNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
};

/**
 * Calculate invoice statistics
 */
export const calculateInvoiceStatistics = (invoices) => {
  const stats = {
    total: invoices.length,
    draft: invoices.filter(i => i.status === INVOICE_STATUS.DRAFT).length,
    generated: invoices.filter(i => i.status === INVOICE_STATUS.GENERATED).length,
    sent: invoices.filter(i => i.status === INVOICE_STATUS.SENT || i.status === INVOICE_STATUS.INVOICE_SENT).length,
    paid: invoices.filter(i => i.status === INVOICE_STATUS.PAID).length,
    overdue: invoices.filter(i => i.status === INVOICE_STATUS.OVERDUE).length,
    totalAmount: invoices.reduce((sum, i) => sum + parseFloat(i.netAmount || 0), 0),
    draftAmount: invoices.filter(i => i.status === INVOICE_STATUS.DRAFT).reduce((sum, i) => sum + parseFloat(i.netAmount || 0), 0),
    sentAmount: invoices.filter(i => i.status === INVOICE_STATUS.SENT || i.status === INVOICE_STATUS.INVOICE_SENT || i.status === INVOICE_STATUS.OVERDUE).reduce((sum, i) => sum + parseFloat(i.netAmount || 0), 0),
    paidAmount: invoices.filter(i => i.status === INVOICE_STATUS.PAID).reduce((sum, i) => sum + parseFloat(i.netAmount || 0), 0),
    overdueAmount: invoices.filter(i => i.status === INVOICE_STATUS.OVERDUE).reduce((sum, i) => sum + parseFloat(i.netAmount || 0), 0)
  };

  return stats;
};

/**
 * Validate mark as sent form data
 */
export const validateMarkSentData = (data) => {
  const errors = [];

  if (!data.recipientName || data.recipientName.trim().length < 3) {
    errors.push('Nama penerima minimal 3 karakter');
  }

  if (!data.sentDate) {
    errors.push('Tanggal kirim wajib diisi');
  } else {
    const sentDate = new Date(data.sentDate);
    const today = new Date();
    if (sentDate > today) {
      errors.push('Tanggal kirim tidak boleh lebih dari hari ini');
    }
  }

  if (data.deliveryMethod === 'courier' && !data.courierService?.trim()) {
    errors.push('Nama kurir wajib diisi untuk pengiriman via kurir');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate payment confirmation form data
 */
export const validatePaymentData = (data, expectedAmount) => {
  const errors = [];

  if (!data.paidAmount || parseFloat(data.paidAmount) <= 0) {
    errors.push('Jumlah pembayaran harus diisi dan lebih dari 0');
  }

  if (!data.paidDate) {
    errors.push('Tanggal pembayaran wajib diisi');
  } else {
    const paidDate = new Date(data.paidDate);
    const today = new Date();
    if (paidDate > today) {
      errors.push('Tanggal pembayaran tidak boleh lebih dari hari ini');
    }
  }

  if (!data.bankName?.trim()) {
    errors.push('Bank penerima wajib dipilih');
  }

  if (!data.evidenceFile) {
    errors.push('Bukti transfer wajib diupload');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format success message for mark as sent
 */
export const formatMarkSentSuccessMessage = (result, formData) => {
  return `✅ ${result.message}\n\nInvoice: ${result.data.invoiceNumber}\nDiterima: ${formData.recipientName}\nTanggal: ${new Date(formData.sentDate).toLocaleDateString('id-ID')}`;
};

/**
 * Format success message for payment confirmation
 */
export const formatPaymentSuccessMessage = (result, formData) => {
  return `✅ ${result.message}\n\nInvoice: ${result.data.invoiceNumber}\nJumlah: Rp ${parseFloat(formData.paidAmount).toLocaleString('id-ID')}\nBank: ${formData.bankName}\nTanggal: ${new Date(formData.paidDate).toLocaleDateString('id-ID')}`;
};

/**
 * Format PDF download success message
 */
export const formatPDFDownloadSuccessMessage = (invoiceNumber) => {
  return `✅ Invoice ${invoiceNumber} berhasil didownload!\n\nSilahkan cetak dan tambahkan:\n• Tanda tangan basah\n• Stempel perusahaan\n• Materai (jika diperlukan)`;
};

/**
 * Check if bank account matches bank/cash criteria
 */
export const isBankAccount = (account) => {
  const name = account.accountName?.toLowerCase() || '';
  const code = account.accountCode || '';
  const subType = account.accountSubType?.toLowerCase() || '';
  
  // Must be ASSET type and contain bank/cash keywords
  if (account.accountType !== 'ASSET') return false;
  
  // Check for bank/cash keywords in name or subtype
  const hasBankKeyword = name.includes('bank') || name.includes('cash') || name.includes('kas');
  const isCashBankType = subType.includes('cash') || subType.includes('bank');
  
  // Typically bank accounts start with 110x (cash and bank section in COA)
  const isBankCode = code.startsWith('110') && code.length >= 4;
  
  return (hasBankKeyword || isCashBankType) && isBankCode;
};