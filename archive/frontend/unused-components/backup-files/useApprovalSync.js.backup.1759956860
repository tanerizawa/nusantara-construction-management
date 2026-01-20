import { useEffect, useCallback } from 'react';

/**
 * Custom hook for approval synchronization
 * Handles cross-component sync and auto-refresh
 */
export const useApprovalSync = (projectId, loadApprovalData) => {
  
  /**
   * Setup approval status change listener
   */
  const setupApprovalListener = useCallback(() => {
    const handleApprovalChange = (event) => {
      if (event.detail && event.detail.projectId === projectId) {
        console.log('[APPROVAL SYNC] Approval status changed, refreshing data...', event.detail);
        loadApprovalData();
      }
    };

    window.addEventListener('approvalStatusChanged', handleApprovalChange);
    
    return () => {
      window.removeEventListener('approvalStatusChanged', handleApprovalChange);
    };
  }, [projectId, loadApprovalData]);

  /**
   * Setup storage listener for cross-tab sync
   */
  const setupStorageListener = useCallback(() => {
    const handleStorageChange = (event) => {
      if (event.key === `approval_status_${projectId}`) {
        console.log('[APPROVAL SYNC] Storage changed, refreshing data...');
        loadApprovalData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [projectId, loadApprovalData]);

  /**
   * Setup auto-refresh interval
   */
  const setupAutoRefresh = useCallback((intervalMs = 60000) => {
    const interval = setInterval(() => {
      console.log('[AUTO-REFRESH] Refreshing approval data...');
      loadApprovalData();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [loadApprovalData]);

  // Setup all listeners on mount
  useEffect(() => {
    const cleanupApproval = setupApprovalListener();
    const cleanupStorage = setupStorageListener();
    const cleanupAutoRefresh = setupAutoRefresh();

    return () => {
      cleanupApproval();
      cleanupStorage();
      cleanupAutoRefresh();
    };
  }, [setupApprovalListener, setupStorageListener, setupAutoRefresh]);

  return {
    setupApprovalListener,
    setupStorageListener,
    setupAutoRefresh
  };
};
