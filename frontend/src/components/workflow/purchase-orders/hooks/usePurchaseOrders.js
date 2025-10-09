import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing Purchase Orders
 * Handles PO fetching, creation, updates, and approval status synchronization
 */
export const usePurchaseOrders = (projectId) => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Sync PO status with approval dashboard status from localStorage
   */
  const syncPOApprovalStatus = useCallback((poData) => {
    try {
      const cacheKey = `approval_status_${projectId}`;
      const approvalStatusCache = localStorage.getItem(cacheKey);
      let approvalStatuses = {};
      
      if (approvalStatusCache) {
        approvalStatuses = JSON.parse(approvalStatusCache);
      }

      // Update PO status based on approval status
      const syncedData = poData.map(po => {
        const poApprovalKey = `po_${po.id}`;
        const cachedStatus = approvalStatuses[poApprovalKey];
        
        console.log(`[WORKFLOW PO SYNC] Checking PO ${po.poNumber}:`, {
          po_id: po.id,
          poApprovalKey,
          current_status: po.status,
          cached_status: cachedStatus?.status || 'none',
          has_cache: !!cachedStatus,
          projectId
        });
        
        if (cachedStatus && cachedStatus.status !== po.status) {
          console.log(`[WORKFLOW PO SYNC] Updating PO ${po.poNumber} status from ${po.status} to ${cachedStatus.status}`);
          return {
            ...po,
            status: cachedStatus.status,
            approved_at: cachedStatus.approved_at,
            approved_by: cachedStatus.approved_by,
            last_sync: new Date().toISOString()
          };
        }
        
        return po;
      });

      return syncedData;
    } catch (error) {
      console.error('Error syncing PO approval status:', error);
      return poData;
    }
  }, [projectId]);

  /**
   * Fetch purchase orders for the project
   */
  const fetchPurchaseOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/purchase-orders?projectId=${projectId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const poData = data.data || [];
        
        // Sync PO status with approval status from localStorage
        const syncedPOData = syncPOApprovalStatus(poData);
        setPurchaseOrders(syncedPOData);
      } else {
        throw new Error('Failed to fetch purchase orders');
      }
    } catch (err) {
      console.error('Error fetching purchase orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, syncPOApprovalStatus]);

  /**
   * Create a new purchase order
   */
  const createPurchaseOrder = useCallback(async (poData) => {
    try {
      console.log('🔵 [usePurchaseOrders] Creating PO...');
      console.log('📦 [usePurchaseOrders] Payload:', poData);
      
      setLoading(true);
      setError(null);

      const response = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(poData)
      });

      console.log('📡 [usePurchaseOrders] Response status:', response.status);
      console.log('📡 [usePurchaseOrders] Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [usePurchaseOrders] Error response:', errorData);
        console.error('❌ [usePurchaseOrders] Validation details:', errorData.details);
        
        // Show detailed error message
        let errorMessage = errorData.message || errorData.error || 'Failed to create purchase order';
        if (errorData.details && Array.isArray(errorData.details)) {
          errorMessage += '\n\nDetails:\n' + errorData.details.map(d => `- ${d.message || d}`).join('\n');
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ [usePurchaseOrders] Success response:', result);
      
      // Refresh purchase orders after creation
      console.log('🔄 [usePurchaseOrders] Refreshing PO list...');
      await fetchPurchaseOrders();
      
      return { success: true, data: result.data };
    } catch (err) {
      console.error('💥 [usePurchaseOrders] Exception:', err);
      console.error('💥 [usePurchaseOrders] Stack:', err.stack);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchPurchaseOrders]);

  /**
   * Update an existing purchase order
   */
  const updatePurchaseOrder = useCallback(async (poId, updateData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/purchase-orders/${poId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update purchase order');
      }

      const result = await response.json();
      
      // Update local state
      setPurchaseOrders(prev => 
        prev.map(po => po.id === poId ? { ...po, ...result.data } : po)
      );
      
      return { success: true, data: result.data };
    } catch (err) {
      console.error('Error updating purchase order:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a purchase order
   */
  const deletePurchaseOrder = useCallback(async (poId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/purchase-orders/${poId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete purchase order');
      }

      // Remove from local state
      setPurchaseOrders(prev => prev.filter(po => po.id !== poId));
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting purchase order:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch purchase orders on mount and when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchPurchaseOrders();
    }
  }, [projectId, fetchPurchaseOrders]);

  return {
    purchaseOrders,
    loading,
    error,
    fetchPurchaseOrders,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    syncPOApprovalStatus
  };
};
