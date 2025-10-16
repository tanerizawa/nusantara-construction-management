import { useState } from 'react';
import { downloadInvoicePDF } from '../services/invoiceAPI';
import { formatPDFDownloadSuccessMessage } from '../utils/invoiceUtils';

/**
 * Custom hook for managing invoice actions
 */
export const useInvoiceActions = (projectId, onApprovePayment) => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleCloseDetail = () => {
    setSelectedInvoice(null);
  };

  const handleApproveInvoice = async (invoice) => {
    if (onApprovePayment) {
      try {
        await onApprovePayment(invoice.id, 'approved');
        // Close detail view after approval
        setSelectedInvoice(null);
        alert(`Invoice ${invoice.invoiceNumber} berhasil disetujui!`);
      } catch (error) {
        alert('Gagal menyetujui invoice: ' + error.message);
      }
    }
  };

  const handleRejectInvoice = async (invoice, reason) => {
    if (onApprovePayment) {
      try {
        await onApprovePayment(invoice.id, 'rejected', reason);
        // Close detail view after rejection
        setSelectedInvoice(null);
        alert(`Invoice ${invoice.invoiceNumber} ditolak.\nAlasan: ${reason}`);
      } catch (error) {
        alert('Gagal menolak invoice: ' + error.message);
      }
    }
  };

  const handleDownloadPDF = async (invoice) => {
    try {
      const result = await downloadInvoicePDF(projectId, invoice.id, invoice.invoiceNumber);
      
      if (result.success) {
        const successMessage = formatPDFDownloadSuccessMessage(invoice.invoiceNumber);
        alert(successMessage);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('❌ Gagal mendownload PDF invoice: ' + error.message);
    }
  };

  const handleSendEmail = (invoice, project) => {
    // Optional: For digital invoice sending via email
    const email = window.prompt(
      '📧 Kirim Invoice via Email\n\n' +
      'Masukkan email penerima:',
      project?.clientEmail || ''
    );
    
    if (email) {
      alert(
        `📧 Kirim Invoice Digital\n\n` +
        `Invoice: ${invoice.invoiceNumber}\n` +
        `Ke: ${email}\n\n` +
        `⚠️ Fitur ini akan segera tersedia.\n\n` +
        `Untuk saat ini, gunakan:\n` +
        `1. Download PDF\n` +
        `2. Cetak & tambahkan TTD + Stempel\n` +
        `3. Kirim hardcopy ke klien\n` +
        `4. Klik "Tandai Terkirim"`
      );
    }
  };

  const handleRejectWithPrompt = (invoice) => {
    const reason = window.prompt(
      '⚠️ Reject Payment\n\n' +
      'Alasan penolakan pembayaran:\n' +
      '(Invoice akan dibatalkan)',
      ''
    );
    if (reason && reason.trim()) {
      handleRejectInvoice(invoice, reason.trim());
    }
  };

  return {
    // State
    selectedInvoice,
    
    // Actions
    handleViewInvoice,
    handleCloseDetail,
    handleApproveInvoice,
    handleRejectInvoice,
    handleRejectWithPrompt,
    handleDownloadPDF,
    handleSendEmail
  };
};