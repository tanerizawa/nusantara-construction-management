import { useState } from 'react';
import { confirmPayment } from '../services/invoiceAPI';
import { validatePaymentData, formatPaymentSuccessMessage } from '../utils/invoiceUtils';

/**
 * Custom hook for managing payment confirmation functionality
 */
export const useInvoicePayment = (projectId, onRefresh) => {
  const [showConfirmPaymentForm, setShowConfirmPaymentForm] = useState(false);
  const [invoiceForAction, setInvoiceForAction] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [confirmPaymentData, setConfirmPaymentData] = useState({
    paidAmount: '',
    paidDate: new Date().toISOString().split('T')[0],
    bankName: '',
    paymentReference: '',
    paymentNotes: '',
    evidenceFile: null
  });

  const initializePaymentConfirmation = (invoice) => {
    setInvoiceForAction(invoice);
    setConfirmPaymentData({
      paidAmount: invoice.netAmount,
      paidDate: new Date().toISOString().split('T')[0],
      bankName: '',
      paymentReference: '',
      paymentNotes: '',
      evidenceFile: null
    });
    setShowConfirmPaymentForm(true);
    
    // Scroll to form
    setTimeout(() => {
      document.getElementById('confirm-payment-form')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 100);
  };

  const closePaymentForm = () => {
    setShowConfirmPaymentForm(false);
    setInvoiceForAction(null);
    setConfirmPaymentData({
      paidAmount: '',
      paidDate: new Date().toISOString().split('T')[0],
      bankName: '',
      paymentReference: '',
      paymentNotes: '',
      evidenceFile: null
    });
  };

  const updatePaymentData = (updates) => {
    setConfirmPaymentData(prev => ({ ...prev, ...updates }));
  };

  const submitPaymentConfirmation = async () => {
    try {
      setLoading(true);
      
      // Validate form data
      const validation = validatePaymentData(confirmPaymentData, invoiceForAction?.netAmount);
      if (!validation.isValid) {
        alert('❌ ' + validation.errors.join('\n'));
        return { success: false };
      }

      // Debug log
      console.log('📤 Submitting payment confirmation:', {
        paidAmount: confirmPaymentData.paidAmount,
        paidDate: confirmPaymentData.paidDate,
        bank: confirmPaymentData.bankName,
        hasEvidence: !!confirmPaymentData.evidenceFile
      });

      const result = await confirmPayment(projectId, invoiceForAction.id, confirmPaymentData);
      
      if (result.success) {
        const successMessage = formatPaymentSuccessMessage(result, confirmPaymentData);
        alert(successMessage);
        
        // Close form and refresh
        closePaymentForm();
        
        if (onRefresh) {
          await onRefresh();
        }
        
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('❌ Gagal konfirmasi pembayaran: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    showConfirmPaymentForm,
    invoiceForAction,
    confirmPaymentData,
    loading,
    
    // Actions
    initializePaymentConfirmation,
    closePaymentForm,
    updatePaymentData,
    submitPaymentConfirmation
  };
};