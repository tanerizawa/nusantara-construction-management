import { useState, useCallback } from 'react';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../../../../../utils/toast';

/**
 * Custom hook for managing actual cost tracking
 * @param {string} projectId - Project ID
 * @param {function} onSuccess - Callback after successful operation
 * @returns {object} State and functions for actual tracking
 */
const useActualTracking = (projectId, onSuccess = null) => {
  const [recording, setRecording] = useState(false);
  const [recordError, setRecordError] = useState(null);

  /**
   * Record actual cost for a RAB item
   */
  const recordActualCost = useCallback(async (data) => {
    try {
      setRecording(true);
      setRecordError(null);

      const response = await axios.post(
        `/api/projects/${projectId}/budget-validation/actual-costs`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        showSuccessToast('Biaya aktual berhasil dicatat');
        
        if (onSuccess) {
          onSuccess(response.data.data);
        }

        return { success: true, data: response.data.data };
      }
    } catch (err) {
      console.error('Error recording actual cost:', err);
      const errorMessage = err.response?.data?.message || 'Gagal mencatat biaya aktual';
      setRecordError(errorMessage);
      showErrorToast(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      setRecording(false);
    }
  }, [projectId, onSuccess]);

  /**
   * Validate actual cost data before submission
   */
  const validateActualCost = useCallback((data) => {
    const errors = {};

    if (!data.rabItemId) {
      errors.rabItemId = 'Item RAB harus dipilih';
    }

    if (!data.quantity || data.quantity <= 0) {
      errors.quantity = 'Kuantitas harus lebih dari 0';
    }

    if (!data.unitPrice || data.unitPrice <= 0) {
      errors.unitPrice = 'Harga satuan harus lebih dari 0';
    }

    if (!data.totalAmount || data.totalAmount <= 0) {
      errors.totalAmount = 'Total biaya harus lebih dari 0';
    }

    // Validate that totalAmount = quantity * unitPrice
    const calculatedTotal = (data.quantity || 0) * (data.unitPrice || 0);
    if (data.totalAmount && Math.abs(data.totalAmount - calculatedTotal) > 0.01) {
      errors.totalAmount = 'Total biaya tidak sesuai dengan kuantitas × harga satuan';
    }

    if (!data.purchaseDate) {
      errors.purchaseDate = 'Tanggal pembelian harus diisi';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  /**
   * Calculate total amount from quantity and unit price
   */
  const calculateTotal = useCallback((quantity, unitPrice) => {
    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(unitPrice) || 0;
    return qty * price;
  }, []);

  return {
    recording,
    recordError,
    recordActualCost,
    validateActualCost,
    calculateTotal
  };
};

export default useActualTracking;
