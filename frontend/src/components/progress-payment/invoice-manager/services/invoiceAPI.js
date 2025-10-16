/**
 * Invoice API Service
 * Handles all invoice-related API calls
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Get authentication token
 */
const getAuthToken = () => localStorage.getItem('token');

/**
 * Get common headers for API requests
 */
const getHeaders = (includeAuth = true, contentType = 'application/json') => {
  const headers = {};
  
  if (contentType && contentType !== 'multipart/form-data') {
    headers['Content-Type'] = contentType;
  }
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

/**
 * Fetch bank accounts from Chart of Accounts
 */
export const fetchBankAccounts = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/chart-of-accounts?account_type=ASSET&is_active=true`,
      {
        headers: getHeaders()
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch bank accounts');
    }

    const result = await response.json();
    
    if (result.success && result.data) {
      // Filter for bank/cash accounts only
      const banks = result.data.filter(account => {
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
      });
      
      return { success: true, data: banks };
    }
    
    return { success: false, data: [] };
  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Download invoice PDF
 */
export const downloadInvoicePDF = async (projectId, invoiceId, invoiceNumber) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/progress-payments/${invoiceId}/invoice/pdf`,
      {
        headers: getHeaders()
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    // Get the PDF blob
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    return { success: true };
  } catch (error) {
    console.error('Error downloading PDF:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Mark invoice as sent
 */
export const markInvoiceAsSent = async (projectId, invoiceId, formData) => {
  try {
    const data = new FormData();
    
    // Required fields
    data.append('recipientName', formData.recipientName);
    data.append('sentDate', formData.sentDate);
    data.append('deliveryMethod', formData.deliveryMethod);
    
    // Optional fields
    if (formData.deliveryNotes) {
      data.append('deliveryNotes', formData.deliveryNotes);
    }
    
    // Courier-specific fields
    if (formData.deliveryMethod === 'courier') {
      data.append('courierService', formData.courierService);
      if (formData.trackingNumber) {
        data.append('trackingNumber', formData.trackingNumber);
      }
    }
    
    // Evidence file
    if (formData.evidenceFile) {
      data.append('delivery_evidence', formData.evidenceFile);
    }
    
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/progress-payments/${invoiceId}/mark-sent`,
      {
        method: 'PATCH',
        headers: getHeaders(true, 'multipart/form-data'),
        body: data
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to mark invoice as sent');
    }

    const result = await response.json();
    return { success: true, data: result.data, message: result.message };
  } catch (error) {
    console.error('Error marking as sent:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Confirm payment received
 */
export const confirmPayment = async (projectId, invoiceId, formData) => {
  try {
    const data = new FormData();
    
    // Required fields
    data.append('paidAmount', formData.paidAmount);
    data.append('paidDate', formData.paidDate);
    data.append('bank', formData.bankName); // Backend expects 'bank' not 'bankName'
    
    // Optional fields
    if (formData.paymentReference) {
      data.append('paymentReference', formData.paymentReference);
    }
    
    if (formData.paymentNotes) {
      data.append('paymentNotes', formData.paymentNotes);
    }
    
    // Evidence file (REQUIRED)
    if (formData.evidenceFile) {
      data.append('payment_evidence', formData.evidenceFile);
    }
    
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/progress-payments/${invoiceId}/confirm-payment`,
      {
        method: 'PATCH',
        headers: getHeaders(true, 'multipart/form-data'),
        body: data
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to confirm payment');
    }

    const result = await response.json();
    return { success: true, data: result.data, message: result.message };
  } catch (error) {
    console.error('Error confirming payment:', error);
    return { success: false, error: error.message };
  }
};