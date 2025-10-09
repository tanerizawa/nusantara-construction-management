import { useEffect } from 'react';

/**
 * Custom hook for RAB approval synchronization
 * Listens for approval status changes from other components
 */
const useRABSync = (projectId, onRefresh) => {
  useEffect(() => {
    const handleApprovalStatusChange = (event) => {
      if (event.detail && 
          event.detail.projectId === projectId && 
          event.detail.itemType === 'rab') {
        console.log('[RAB WORKFLOW] RAB approval status changed, refreshing data...');
        onRefresh();
      }
    };

    // Listen for same-tab approval changes
    window.addEventListener('approvalStatusChanged', handleApprovalStatusChange);

    return () => {
      window.removeEventListener('approvalStatusChanged', handleApprovalStatusChange);
    };
  }, [projectId, onRefresh]);
};

export default useRABSync;
