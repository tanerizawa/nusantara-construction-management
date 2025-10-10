import { useEffect, useCallback } from 'react';

/**
 * Custom hook for approval synchronization
 * Handles cross-component sync and auto-refresh
 */
export const useApprovalSync = (projectId, loadApprovalData) => {
  
  /**
   * Setup approval status change listener
   */
  // Listen to approval status changes from other components
  const setupApprovalListener = useCallback(() => {
    const handleApprovalChange = (event) => {
      const { projectId: changedProjectId } = event.detail;
      
      // Reload data if this project's approval status changed
      if (changedProjectId === projectId) {
        loadApprovalData();
      }
    };

    window.addEventListener('approvalStatusChanged', handleApprovalChange);
    return () => window.removeEventListener('approvalStatusChanged', handleApprovalChange);
  }, [projectId, loadApprovalData]);

  /**
   * Setup storage listener for cross-tab sync
   */
  const setupStorageListener = useCallback(() => {
    const handleStorageChange = (event) => {
      if (event.key === `approval_status_${projectId}`) {
        loadApprovalData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [projectId, loadApprovalData]);

  // Setup all listeners on mount
  useEffect(() => {
    const cleanupApproval = setupApprovalListener();
    const cleanupStorage = setupStorageListener();

    return () => {
      cleanupApproval();
      cleanupStorage();
    };
  }, [setupApprovalListener, setupStorageListener]);

  return {
    setupApprovalListener,
    setupStorageListener
  };
};
