import { useState } from 'react';
import { markInvoiceAsSent } from '../services/invoiceAPI';
import { validateMarkSentData, formatMarkSentSuccessMessage } from '../utils/invoiceUtils';

/**
 * Custom hook for managing "Mark Invoice as Sent" functionality
 */
export const useInvoiceMarkSent = (projectId, onRefresh) => {
  const [showMarkSentForm, setShowMarkSentForm] = useState(false);
  const [invoiceForAction, setInvoiceForAction] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [markSentData, setMarkSentData] = useState({
    recipientName: '',
    sentDate: new Date().toISOString().split('T')[0],
    deliveryMethod: 'courier',
    courierService: '',
    trackingNumber: '',
    deliveryNotes: '',
    evidenceFile: null
  });

  const initializeMarkSent = (invoice) => {
    setInvoiceForAction(invoice);
    setMarkSentData({
      recipientName: invoice.beritaAcara?.baNumber || '',
      sentDate: new Date().toISOString().split('T')[0],
      deliveryMethod: 'courier',
      courierService: '',
      trackingNumber: '',
      deliveryNotes: '',
      evidenceFile: null
    });
    setShowMarkSentForm(true);
    
    // Scroll to form
    setTimeout(() => {
      document.getElementById('mark-sent-form')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 100);
  };

  const closeMarkSentForm = () => {
    setShowMarkSentForm(false);
    setInvoiceForAction(null);
    setMarkSentData({
      recipientName: '',
      sentDate: new Date().toISOString().split('T')[0],
      deliveryMethod: 'courier',
      courierService: '',
      trackingNumber: '',
      deliveryNotes: '',
      evidenceFile: null
    });
  };

  const updateMarkSentData = (updates) => {
    setMarkSentData(prev => ({ ...prev, ...updates }));
  };

  const submitMarkAsSent = async () => {
    try {
      setLoading(true);
      
      // Validate form data
      const validation = validateMarkSentData(markSentData);
      if (!validation.isValid) {
        alert('❌ ' + validation.errors.join('\n'));
        return { success: false };
      }

      const result = await markInvoiceAsSent(projectId, invoiceForAction.id, markSentData);
      
      if (result.success) {
        const successMessage = formatMarkSentSuccessMessage(result, markSentData);
        alert(successMessage);
        
        // Close form and refresh
        closeMarkSentForm();
        
        if (onRefresh) {
          await onRefresh();
        }
        
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error marking as sent:', error);
      alert('❌ Gagal menandai invoice sebagai terkirim: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    showMarkSentForm,
    invoiceForAction,
    markSentData,
    loading,
    
    // Actions
    initializeMarkSent,
    closeMarkSentForm,
    updateMarkSentData,
    submitMarkAsSent
  };
};