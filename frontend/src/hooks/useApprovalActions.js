import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

/**
 * useApprovalActions Hook
 * 
 * Reusable hook for handling approval actions (approve, reject, review)
 * Works with any approval type (RAB, PO, BA, TT)
 * 
 * @param {string} type - Type of approval (rab, po, ba, tt)
 * @param {number} projectId - Project ID
 * @param {Function} onSuccess - Callback on successful action
 * @param {Function} onError - Callback on error
 */
const useApprovalActions = (type, projectId, onSuccess, onError) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get current user

  // API endpoint mapping
  const endpoints = {
    rab: `/api/projects/${projectId}/rab`,
    po: `/api/purchase-orders`,  // PO routes are at root level
    'purchase-orders': `/api/purchase-orders`,  // Alternative name
    wo: `/api/projects/${projectId}/work-orders`,  // Work Orders
    'work-orders': `/api/projects/${projectId}/work-orders`,  // Alternative name
    ba: `/api/projects/${projectId}/berita-acara`,
    tt: `/api/projects/${projectId}/tanda-terima`
  };

  const baseEndpoint = endpoints[type] || endpoints.rab;

  /**
   * Mark item as reviewed
   */
  const markAsReviewed = useCallback(async (item) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.patch(`${baseEndpoint}/${item.id}/status`, {
        approval_status: 'reviewed',
        notes: 'Marked as reviewed for approval'
      });

      // Emit event for synchronization
      window.dispatchEvent(new CustomEvent('approval-status-changed', {
        detail: {
          type,
          itemId: item.id,
          status: 'reviewed',
          item: response.data
        }
      }));

      if (onSuccess) {
        onSuccess(response.data, 'reviewed');
      }

      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal menandai item sebagai reviewed';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage, err);
      }

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [baseEndpoint, type, onSuccess, onError]);

  /**
   * Approve item
   */
  const approveItem = useCallback(async (item, notes = '') => {
    setIsLoading(true);
    setError(null);

    try {
      // Get user ID from auth context
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }

      const response = await axios.put(`${baseEndpoint}/${item.id}/approve`, {
        approvedBy: user.id,
        notes,
        approval_date: new Date().toISOString()
      });

      // Emit event for synchronization
      window.dispatchEvent(new CustomEvent('approval-status-changed', {
        detail: {
          type,
          itemId: item.id,
          status: 'approved',
          item: response.data
        }
      }));

      // Show success notification
      window.dispatchEvent(new CustomEvent('show-notification', {
        detail: {
          type: 'success',
          message: `${item.code || 'Item'} berhasil diapprove`,
          duration: 3000
        }
      }));

      if (onSuccess) {
        onSuccess(response.data, 'approved');
      }

      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal approve item';
      setError(errorMessage);
      
      // Show error notification
      window.dispatchEvent(new CustomEvent('show-notification', {
        detail: {
          type: 'error',
          message: errorMessage,
          duration: 5000
        }
      }));

      if (onError) {
        onError(errorMessage, err);
      }

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [baseEndpoint, type, user, onSuccess, onError]);

  /**
   * Reject item
   */
  const rejectItem = useCallback(async (item, reason) => {
    if (!reason || !reason.trim()) {
      const errorMessage = 'Alasan penolakan harus diisi';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }

      return { success: false, error: errorMessage };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get user ID from auth context
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }

      const response = await axios.put(`${baseEndpoint}/${item.id}/reject`, {
        rejectedBy: user.id,
        rejectionReason: reason,
        rejection_date: new Date().toISOString()
      });

      // Emit event for synchronization
      window.dispatchEvent(new CustomEvent('approval-status-changed', {
        detail: {
          type,
          itemId: item.id,
          status: 'rejected',
          reason,
          item: response.data
        }
      }));

      // Show notification
      window.dispatchEvent(new CustomEvent('show-notification', {
        detail: {
          type: 'warning',
          message: `${item.code || 'Item'} ditolak: ${reason}`,
          duration: 5000
        }
      }));

      if (onSuccess) {
        onSuccess(response.data, 'rejected');
      }

      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal reject item';
      setError(errorMessage);
      
      // Show error notification
      window.dispatchEvent(new CustomEvent('show-notification', {
        detail: {
          type: 'error',
          message: errorMessage,
          duration: 5000
        }
      }));

      if (onError) {
        onError(errorMessage, err);
      }

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [baseEndpoint, type, user, onSuccess, onError]);

  /**
   * Bulk approve multiple items
   */
  const bulkApprove = useCallback(async (items, notes = '') => {
    setIsLoading(true);
    setError(null);

    const results = {
      success: [],
      failed: []
    };

    try {
      // Process items sequentially to avoid overwhelming the server
      for (const item of items) {
        const result = await approveItem(item, notes);
        if (result.success) {
          results.success.push(item);
        } else {
          results.failed.push({ item, error: result.error });
        }
      }

      // Show summary notification
      window.dispatchEvent(new CustomEvent('show-notification', {
        detail: {
          type: results.failed.length === 0 ? 'success' : 'warning',
          message: `${results.success.length} item berhasil, ${results.failed.length} gagal`,
          duration: 5000
        }
      }));

      if (onSuccess) {
        onSuccess(results, 'bulk-approved');
      }

      return { success: results.failed.length === 0, data: results };
    } catch (err) {
      const errorMessage = 'Gagal bulk approve items';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage, err);
      }

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [approveItem, onSuccess, onError]);

  return {
    isLoading,
    error,
    markAsReviewed,
    approveItem,
    rejectItem,
    bulkApprove
  };
};

export default useApprovalActions;
