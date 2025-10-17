import { useState, useCallback } from 'react';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../../../../../utils/toast';

/**
 * Custom hook for managing additional expenses (kasbon, overtime, etc)
 * @param {string} projectId - Project ID
 * @param {function} onSuccess - Callback after successful operation
 * @returns {object} State and functions for expense management
 */
const useAdditionalExpenses = (projectId, onSuccess = null) => {
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Add new additional expense
   */
  const addExpense = useCallback(async (data) => {
    try {
      setSubmitting(true);
      setError(null);

      const response = await axios.post(
        `/api/projects/${projectId}/budget-validation/additional-expenses`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        const isAutoApproved = response.data.data.approvalStatus === 'approved';
        
        showSuccessToast(
          isAutoApproved 
            ? 'Pengeluaran berhasil ditambahkan dan disetujui otomatis' 
            : 'Pengeluaran berhasil ditambahkan, menunggu persetujuan'
        );
        
        if (onSuccess) {
          onSuccess(response.data.data);
        }

        return { success: true, data: response.data.data };
      }
    } catch (err) {
      console.error('Error adding expense:', err);
      const errorMessage = err.response?.data?.message || 'Gagal menambahkan pengeluaran';
      setError(errorMessage);
      showErrorToast(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  }, [projectId, onSuccess]);

  /**
   * Update existing expense
   */
  const updateExpense = useCallback(async (expenseId, data) => {
    try {
      setUpdating(true);
      setError(null);

      const response = await axios.put(
        `/api/projects/${projectId}/budget-validation/additional-expenses/${expenseId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        showSuccessToast('Pengeluaran berhasil diperbarui');
        
        if (onSuccess) {
          onSuccess(response.data.data);
        }

        return { success: true, data: response.data.data };
      }
    } catch (err) {
      console.error('Error updating expense:', err);
      const errorMessage = err.response?.data?.message || 'Gagal memperbarui pengeluaran';
      setError(errorMessage);
      showErrorToast(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      setUpdating(false);
    }
  }, [projectId, onSuccess]);

  /**
   * Delete expense (soft delete)
   */
  const deleteExpense = useCallback(async (expenseId) => {
    try {
      setDeleting(true);
      setError(null);

      const response = await axios.delete(
        `/api/projects/${projectId}/budget-validation/additional-expenses/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        showSuccessToast('Pengeluaran berhasil dihapus');
        
        if (onSuccess) {
          onSuccess({ deleted: true, expenseId });
        }

        return { success: true };
      }
    } catch (err) {
      console.error('Error deleting expense:', err);
      const errorMessage = err.response?.data?.message || 'Gagal menghapus pengeluaran';
      setError(errorMessage);
      showErrorToast(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      setDeleting(false);
    }
  }, [projectId, onSuccess]);

  /**
   * Approve pending expense
   */
  const approveExpense = useCallback(async (expenseId) => {
    try {
      setApproving(true);
      setError(null);

      const response = await axios.post(
        `/api/projects/${projectId}/budget-validation/additional-expenses/${expenseId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        showSuccessToast('Pengeluaran berhasil disetujui');
        
        if (onSuccess) {
          onSuccess(response.data.data);
        }

        return { success: true, data: response.data.data };
      }
    } catch (err) {
      console.error('Error approving expense:', err);
      const errorMessage = err.response?.data?.message || 'Gagal menyetujui pengeluaran';
      setError(errorMessage);
      showErrorToast(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      setApproving(false);
    }
  }, [projectId, onSuccess]);

  /**
   * Reject pending expense
   */
  const rejectExpense = useCallback(async (expenseId, reason) => {
    try {
      setRejecting(true);
      setError(null);

      const response = await axios.post(
        `/api/projects/${projectId}/budget-validation/additional-expenses/${expenseId}/reject`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        showSuccessToast('Pengeluaran berhasil ditolak');
        
        if (onSuccess) {
          onSuccess(response.data.data);
        }

        return { success: true, data: response.data.data };
      }
    } catch (err) {
      console.error('Error rejecting expense:', err);
      const errorMessage = err.response?.data?.message || 'Gagal menolak pengeluaran';
      setError(errorMessage);
      showErrorToast(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      setRejecting(false);
    }
  }, [projectId, onSuccess]);

  /**
   * Validate expense data before submission
   */
  const validateExpense = useCallback((data) => {
    const errors = {};

    if (!data.expenseType) {
      errors.expenseType = 'Jenis pengeluaran harus dipilih';
    }

    if (!data.description || data.description.trim() === '') {
      errors.description = 'Deskripsi harus diisi';
    }

    if (!data.amount || data.amount <= 0) {
      errors.amount = 'Jumlah harus lebih dari 0';
    }

    if (!data.recipientName || data.recipientName.trim() === '') {
      errors.recipientName = 'Nama penerima harus diisi';
    }

    if (!data.expenseDate) {
      errors.expenseDate = 'Tanggal pengeluaran harus diisi';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  return {
    submitting,
    updating,
    deleting,
    approving,
    rejecting,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    approveExpense,
    rejectExpense,
    validateExpense
  };
};

export default useAdditionalExpenses;
