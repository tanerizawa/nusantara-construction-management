import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook untuk mengelola data progress payments
 */
export const useProgressPayments = (projectId, onPaymentChange) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    approvedAmount: 0
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
        setSummary(data.summary || {
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
          approvedAmount: 0
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
    try {
      const response = await fetch(`/api/projects/${projectId}/progress-payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(paymentData)
      });

      if (response.ok) {
        await fetchProgressPayments();
        if (onPaymentChange) onPaymentChange();
        return { success: true, message: 'Progress Payment berhasil dibuat' };
      } else {
        throw new Error('Gagal membuat Progress Payment');
      }
    } catch (error) {
      console.error('Error creating progress payment:', error);
      return { success: false, message: 'Gagal membuat Progress Payment' };
    }
  }, [projectId, fetchProgressPayments, onPaymentChange]);

  const approvePayment = useCallback(async (paymentId) => {
    if (!window.confirm('Yakin ingin menyetujui pembayaran ini?')) {
      return { success: false, cancelled: true };
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/progress-payments/${paymentId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await fetchProgressPayments();
        if (onPaymentChange) onPaymentChange();
        return { success: true, message: 'Pembayaran berhasil disetujui' };
      } else {
        throw new Error('Gagal menyetujui pembayaran');
      }
    } catch (error) {
      console.error('Error approving payment:', error);
      return { success: false, message: 'Gagal menyetujui pembayaran' };
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
