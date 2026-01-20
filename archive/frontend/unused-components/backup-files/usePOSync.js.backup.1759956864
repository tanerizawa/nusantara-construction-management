import { useEffect, useCallback } from 'react';

/**
 * Custom hook for synchronizing Purchase Orders with Approval Dashboard
 * Handles real-time sync between PO workflow and approval system
 */
export const usePOSync = (projectId, onDataChange) => {
  /**
   * Setup sync listener for approval status changes
   */
  const setupSyncListener = useCallback(() => {
    const handleApprovalChange = (event) => {
      if (event.key === `approval_status_${projectId}` && event.newValue) {
        console.log('[PO SYNC] Approval status changed, triggering refresh');
        
        // Trigger data refresh callback
        if (onDataChange) {
          onDataChange();
        }
      }
    };

    // Listen for localStorage changes (from approval dashboard)
    window.addEventListener('storage', handleApprovalChange);
    
    return () => {
      window.removeEventListener('storage', handleApprovalChange);
    };
  }, [projectId, onDataChange]);

  /**
   * Broadcast PO creation/update to other components
   */
  const broadcastPOChange = useCallback((poData, action = 'update') => {
    const event = new CustomEvent('po-changed', {
      detail: {
        projectId,
        action, // 'create', 'update', 'delete'
        data: poData,
        timestamp: new Date().toISOString()
      }
    });
    
    window.dispatchEvent(event);
    console.log(`[PO SYNC] Broadcasted PO ${action}:`, poData);
  }, [projectId]);

  /**
   * Listen for PO changes from other components
   */
  const setupPOListener = useCallback((callback) => {
    const handlePOChange = (event) => {
      if (event.detail.projectId === projectId) {
        console.log('[PO SYNC] Received PO change:', event.detail);
        callback(event.detail);
      }
    };

    window.addEventListener('po-changed', handlePOChange);
    
    return () => {
      window.removeEventListener('po-changed', handlePOChange);
    };
  }, [projectId]);

  /**
   * Sync PO data with approval dashboard cache
   */
  const syncWithApprovalDashboard = useCallback(() => {
    try {
      const cacheKey = `approval_status_${projectId}`;
      const cache = localStorage.getItem(cacheKey);
      
      if (cache) {
        const approvalStatuses = JSON.parse(cache);
        console.log('[PO SYNC] Syncing with approval dashboard:', approvalStatuses);
        return approvalStatuses;
      }
      
      return null;
    } catch (error) {
      console.error('[PO SYNC] Error syncing with approval dashboard:', error);
      return null;
    }
  }, [projectId]);

  /**
   * Update approval cache when PO is created/updated
   */
  const updateApprovalCache = useCallback((poId, status, metadata = {}) => {
    try {
      const cacheKey = `approval_status_${projectId}`;
      const cache = localStorage.getItem(cacheKey);
      let approvalStatuses = {};
      
      if (cache) {
        approvalStatuses = JSON.parse(cache);
      }
      
      const poApprovalKey = `po_${poId}`;
      approvalStatuses[poApprovalKey] = {
        status,
        ...metadata,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem(cacheKey, JSON.stringify(approvalStatuses));
      console.log(`[PO SYNC] Updated approval cache for PO ${poId}:`, status);
      
      return true;
    } catch (error) {
      console.error('[PO SYNC] Error updating approval cache:', error);
      return false;
    }
  }, [projectId]);

  /**
   * Clear approval cache for this project
   */
  const clearApprovalCache = useCallback(() => {
    try {
      const cacheKey = `approval_status_${projectId}`;
      localStorage.removeItem(cacheKey);
      console.log('[PO SYNC] Cleared approval cache');
      return true;
    } catch (error) {
      console.error('[PO SYNC] Error clearing approval cache:', error);
      return false;
    }
  }, [projectId]);

  // Setup sync listener on mount
  useEffect(() => {
    const cleanup = setupSyncListener();
    return cleanup;
  }, [setupSyncListener]);

  return {
    broadcastPOChange,
    setupPOListener,
    syncWithApprovalDashboard,
    updateApprovalCache,
    clearApprovalCache
  };
};
