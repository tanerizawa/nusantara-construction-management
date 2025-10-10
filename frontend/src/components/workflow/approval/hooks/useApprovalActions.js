import { useCallback } from 'react';
import { mapStatusToBackend } from '../config';

/**
 * Custom hook for approval actions
 * Handles approve, reject, and review operations
 */
export const useApprovalActions = (projectId, setApprovalData, activeCategory, onDataChange) => {
  
  /**
   * Update PO status in database
   */
  const updatePOStatusInDatabase = useCallback(async (poId, status, approvedBy = null) => {
    try {
      const backendStatus = mapStatusToBackend(status);
      
      const updateData = {
        status: backendStatus,
        approved_by: approvedBy
      };
      
      const response = await fetch(`/api/purchase-orders/${poId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update PO status: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('[API UPDATE] Error updating PO status:', error);
      throw error;
    }
  }, []);

  /**
   * Update RAB approval status in database
   */
  const updateRABStatusInDatabase = useCallback(async (rabId, isApproved, approvedBy = null) => {
    try {
      if (isApproved) {
        // Use the approve endpoint for approval
        const response = await fetch(`/api/projects/${projectId}/rab/${rabId}/approve`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            approvedBy: approvedBy || 'Current User'
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to approve RAB: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
        
      } else {
        // Use the general update endpoint for other status changes
        const updateData = {
          isApproved: false,
          status: 'under_review',
          approvedBy: null,
          approvedAt: null
        };
        
        const response = await fetch(`/api/projects/${projectId}/rab/${rabId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(updateData)
        });

        if (!response.ok) {
          throw new Error(`Failed to update RAB status: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
      }
    } catch (error) {
      console.error('[API UPDATE] Error updating RAB status:', error);
      throw error;
    }
  }, [projectId]);

  /**
   * Save approval status to localStorage cache
   */
  const saveApprovalStatusToCache = useCallback((item, newStatus, approvedBy = null) => {
    try {
      const cacheKey = `approval_status_${projectId}`;
      const existingCache = localStorage.getItem(cacheKey);
      let approvalStatuses = existingCache ? JSON.parse(existingCache) : {};
      
      const itemKey = item.approval_type === 'purchaseOrders' ? `po_${item.id}` : `rab_${item.id}`;
      
      approvalStatuses[itemKey] = {
        status: newStatus,
        approved_at: newStatus === 'approved' ? new Date().toISOString() : null,
        approved_by: approvedBy,
        updated_at: new Date().toISOString(),
        item_id: item.id,
        item_type: item.approval_type
      };
      
      localStorage.setItem(cacheKey, JSON.stringify(approvalStatuses));
      
      // Trigger event to notify other components
      const statusChangeEvent = new CustomEvent('approvalStatusChanged', {
        detail: {
          projectId,
          itemId: item.id,
          itemType: item.approval_type,
          newStatus,
          timestamp: new Date().toISOString()
        }
      });
      window.dispatchEvent(statusChangeEvent);
      
    } catch (error) {
      console.error('Error saving approval status to cache:', error);
    }
  }, [projectId]);

  /**
   * Handle mark as reviewed
   */
  const handleMarkAsReviewed = useCallback(async (item, loadApprovalData) => {
    try {
      const updatedItem = { ...item, status: 'under_review' };
      
      // Update local state immediately
      setApprovalData(prevData => ({
        ...prevData,
        [activeCategory]: prevData[activeCategory].map(dataItem =>
          dataItem.id === item.id ? updatedItem : dataItem
        )
      }));

      // Save to localStorage
      saveApprovalStatusToCache(item, 'under_review');

      // Update in database
      if (item.approval_type === 'purchaseOrders') {
        await updatePOStatusInDatabase(item.id, 'under_review');
      } else if (item.approval_type === 'rab') {
        await updateRABStatusInDatabase(item.id, false);
      }
      
    } catch (error) {
      console.error('❌ [APPROVAL] Error marking as reviewed:', error);
      alert(`Error marking as reviewed: ${error.message}`);
      loadApprovalData();
    }
  }, [activeCategory, setApprovalData, saveApprovalStatusToCache, updatePOStatusInDatabase, updateRABStatusInDatabase]);

  /**
   * Handle approve
   */
  const handleApprove = useCallback(async (item, userDetails, loadApprovalData) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`Setujui ${item.approval_id}?`)) return;
    
    try {
      const approvedBy = userDetails?.username || userDetails?.name || 'Current User';
      const updatedItem = { 
        ...item, 
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: approvedBy
      };
      
      // Update local state
      setApprovalData(prevData => ({
        ...prevData,
        [activeCategory]: prevData[activeCategory].map(dataItem =>
          dataItem.id === item.id ? updatedItem : dataItem
        )
      }));

      // Save to localStorage
      saveApprovalStatusToCache(item, 'approved', approvedBy);

      // Update in database
      if (item.approval_type === 'purchaseOrders') {
        await updatePOStatusInDatabase(item.id, 'approved', approvedBy);
      } else if (item.approval_type === 'rab') {
        await updateRABStatusInDatabase(item.id, true, approvedBy);
      }
      
      if (onDataChange) onDataChange();
      
      alert(`✅ ${item.approval_id} berhasil disetujui!`);
      
    } catch (error) {
      console.error('❌ [APPROVAL] Error approving:', error);
      alert(`Error approving: ${error.message}`);
      loadApprovalData();
    }
  }, [activeCategory, setApprovalData, saveApprovalStatusToCache, updatePOStatusInDatabase, updateRABStatusInDatabase, onDataChange]);

  /**
   * Handle reject
   */
  const handleReject = useCallback(async (item, userDetails, loadApprovalData) => {
    const reason = prompt(`Alasan penolakan ${item.approval_id}:`);
    if (!reason) return;
    
    try {
      const rejectedBy = userDetails?.username || userDetails?.name || 'Current User';
      const updatedItem = { 
        ...item, 
        status: 'rejected',
        notes: reason,
        rejected_by: rejectedBy,
        rejected_at: new Date().toISOString()
      };
      
      // Update local state
      setApprovalData(prevData => ({
        ...prevData,
        [activeCategory]: prevData[activeCategory].map(dataItem =>
          dataItem.id === item.id ? updatedItem : dataItem
        )
      }));

      // Save to localStorage
      saveApprovalStatusToCache(item, 'rejected', rejectedBy);

      // Update in database
      if (item.approval_type === 'purchaseOrders') {
        await updatePOStatusInDatabase(item.id, 'rejected', rejectedBy);
      } else if (item.approval_type === 'rab') {
        await updateRABStatusInDatabase(item.id, false);
      }
      
      if (onDataChange) onDataChange();
      
      alert(`❌ ${item.approval_id} ditolak dengan alasan: ${reason}`);
      
    } catch (error) {
      console.error('❌ [APPROVAL] Error rejecting:', error);
      alert(`Error rejecting: ${error.message}`);
      loadApprovalData();
    }
  }, [activeCategory, setApprovalData, saveApprovalStatusToCache, updatePOStatusInDatabase, updateRABStatusInDatabase, onDataChange]);

  return {
    handleMarkAsReviewed,
    handleApprove,
    handleReject,
    saveApprovalStatusToCache
  };
};
