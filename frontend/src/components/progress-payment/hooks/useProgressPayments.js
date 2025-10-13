import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook untuk mengelola data progress payments
 */
export const useProgressPayments = (projectId, onPaymentChange) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    total: 0,
    totalAmount: 0,
    paid: 0,
    paidAmount: 0,
    approved: 0,
    approvedAmount: 0,
    pending: 0,
    pendingAmount: 0
  });

  const fetchProgressPayments = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/progress-payments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPayments(data.data || []);
        // Backend mengirim 'stats', bukan 'summary'
        setSummary(data.stats || {
          total: 0,
          totalAmount: 0,
          paid: 0,
          paidAmount: 0,
          approved: 0,
          approvedAmount: 0,
          pending: 0,
          pendingAmount: 0
        });
      } else {
        throw new Error('Failed to load Progress Payments');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching progress payments:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const createPayment = useCallback(async (paymentData) => {
    console.log('📝 Creating payment with data:', paymentData);
    
    try {
      const response = await fetch(`/api/projects/${projectId}/progress-payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(paymentData)
      });

      const responseData = await response.json();
      console.log('📬 Server response:', responseData);

      if (response.ok) {
        await fetchProgressPayments();
        if (onPaymentChange) onPaymentChange();
        return { success: true, message: 'Progress Payment berhasil dibuat' };
      } else {
        // Handle both array and string details
        let errorMsg = 'Gagal membuat Progress Payment';
        
        if (responseData.details) {
          errorMsg = Array.isArray(responseData.details) 
            ? responseData.details.join(', ')
            : String(responseData.details);
        } else if (responseData.error) {
          errorMsg = responseData.error;
        }
        
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('❌ Error creating progress payment:', error);
      return { success: false, message: error.message };
    }
  }, [projectId, fetchProgressPayments, onPaymentChange]);

  const approvePayment = useCallback(async (paymentId, status = 'approved', reason = '') => {
    // Skip confirmation if called programmatically with status
    const needsConfirmation = status === 'approved' && !reason;
    if (needsConfirmation && !window.confirm('Yakin ingin menyetujui pembayaran ini?')) {
      return { success: false, cancelled: true };
    }

    try {
      // Both approval and rejection use the same /status endpoint
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const endpoint = `${API_BASE_URL}/projects/${projectId}/progress-payments/${paymentId}/status`;
      
      // Prepare request body
      const body = {
        status: status === 'rejected' ? 'rejected' : 'approved'
      };
      
      // Add rejection reason if provided
      if (status === 'rejected' && reason) {
        body.reason = reason;
      }

      const response = await fetch(endpoint, {
        method: 'PUT', // Backend uses PUT, not PATCH
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await fetchProgressPayments();
        if (onPaymentChange) onPaymentChange();
        const message = status === 'rejected' 
          ? 'Pembayaran berhasil ditolak'
          : 'Pembayaran berhasil disetujui';
        return { success: true, message };
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Gagal ${status === 'rejected' ? 'menolak' : 'menyetujui'} pembayaran`);
      }
    } catch (error) {
      console.error('Error approving/rejecting payment:', error);
      return { 
        success: false, 
        message: error.message || `Gagal ${status === 'rejected' ? 'menolak' : 'menyetujui'} pembayaran` 
      };
    }
  }, [projectId, fetchProgressPayments, onPaymentChange]);

  useEffect(() => {
    fetchProgressPayments();
  }, [fetchProgressPayments]);

  return {
    payments,
    summary,
    loading,
    error,
    createPayment,
    approvePayment,
    refreshPayments: fetchProgressPayments
  };
};
