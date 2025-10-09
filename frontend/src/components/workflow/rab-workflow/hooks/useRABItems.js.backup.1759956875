import { useState, useEffect } from 'react';

/**
 * Custom hook for managing RAB items data
 * Handles fetching, creating, updating, and deleting RAB items
 */
const useRABItems = (projectId, onDataChange) => {
  const [rabItems, setRABItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvalStatus, setApprovalStatus] = useState(null);

  useEffect(() => {
    fetchRABData();
  }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync RAB approval status with localStorage cache
  const syncRABApprovalStatus = (rabItems) => {
    try {
      const cacheKey = `approval_status_${projectId}`;
      const approvalStatusCache = localStorage.getItem(cacheKey);
      
      if (!approvalStatusCache) {
        console.log('[RAB WORKFLOW SYNC] No approval cache found for project:', projectId);
        return rabItems;
      }
      
      const approvalStatuses = JSON.parse(approvalStatusCache);
      console.log('[RAB WORKFLOW SYNC] Found approval cache:', approvalStatuses);
      
      // Update RAB items with cached approval status
      const syncedItems = rabItems.map(item => {
        const rabApprovalKey = `rab_${item.id}`;
        const cachedStatus = approvalStatuses[rabApprovalKey];
        
        if (cachedStatus) {
          const isApproved = cachedStatus.status === 'approved';
          console.log(`[RAB WORKFLOW SYNC] Updating ${item.description}: ${item.isApproved} → ${isApproved}`);
          
          return {
            ...item,
            isApproved: isApproved,
            status: isApproved ? 'approved' : 'draft',
            approved_at: cachedStatus.approved_at,
            approved_by: cachedStatus.approved_by,
            approval_status: cachedStatus.status,
            last_sync: new Date().toISOString()
          };
        }
        
        return item;
      });
      
      const approvedCount = syncedItems.filter(item => item.isApproved).length;
      console.log(`[RAB WORKFLOW SYNC] Synced ${approvedCount} approved items out of ${rabItems.length} total`);
      
      return syncedItems;
    } catch (error) {
      console.error('[RAB WORKFLOW SYNC] Error syncing approval status:', error);
      return rabItems;
    }
  };

  const fetchRABData = async () => {
    try {
      setLoading(true);
      
      if (!projectId) {
        setRABItems([]);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setRABItems([]);
        return;
      }

      console.log('📡 Making API call to get RAB items...');
      console.log('📡 Project ID:', projectId);
      
      const response = await fetch(`/api/projects/${projectId}/rab`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 RAB Workflow Response status:', response.status);
      
      const result = await response.json();
      console.log('🚀 RAB Workflow Full result:', result);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${result.message || 'API Error'}`);
      }
      
      if (!result.success) {
        throw new Error(`Database Error: ${result.message}`);
      }
      
      const items = result.data || [];
      console.log('RAB Workflow Items found:', items.length, items);
      
      if (items.length === 0) {
        console.log('⚠️ No RAB items found for project:', projectId);
        setRABItems([]);
        setApprovalStatus(null);
        return;
      }
      
      // Transform data
      const transformedItems = items.map((item, index) => {
        console.log(`🔄 Transforming item ${index + 1}:`, item);
        
        return {
          id: item.id,
          category: item.category || 'Unknown',
          description: item.description || 'No description',
          unit: item.unit || 'Unit',
          quantity: parseFloat(item.quantity) || 0,
          unitPrice: parseFloat(item.unitPrice) || 0,
          total: parseFloat(item.totalPrice) || 0,
          totalPrice: parseFloat(item.totalPrice) || 0,
          specifications: item.notes || '',
          status: item.isApproved ? 'approved' : 'draft',
          isApproved: item.isApproved || false,
          approvedBy: item.approvedBy,
          approvedAt: item.approvedAt,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        };
      });

      console.log('🎯 Final transformed items count:', transformedItems.length);
      
      // Sync with localStorage approval status
      const syncedRABItems = syncRABApprovalStatus(transformedItems);
      setRABItems(syncedRABItems);
      
      // Calculate approval status
      const totalItems = syncedRABItems.length;
      const approvedItems = syncedRABItems.filter(item => item.isApproved).length;
      const isRabApproved = totalItems > 0 && approvedItems === totalItems;
      
      setApprovalStatus({
        status: isRabApproved ? 'approved' : 'draft',
        totalItems: totalItems,
        canAddItems: !isRabApproved && totalItems >= 0
      });

    } catch (error) {
      console.error('❌ RAB Workflow Error:', error);
      setRABItems([]);
      setApprovalStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const addRABItem = async (itemData) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/rab`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(itemData)
      });

      if (response.ok) {
        await fetchRABData();
        if (onDataChange) onDataChange();
        return { success: true };
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add RAB item');
      }
    } catch (error) {
      console.error('Error adding RAB item:', error);
      
      // Fallback: add to local state (demo mode)
      const newItem = {
        ...itemData,
        id: Date.now(),
        projectId: projectId,
        status: 'draft',
        isApproved: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setRABItems([...rabItems, newItem]);
      return { success: true, demo: true };
    }
  };

  const updateRABItem = async (itemId, itemData) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/rab`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...itemData, id: itemId })
      });

      if (response.ok) {
        await fetchRABData();
        if (onDataChange) onDataChange();
        return { success: true };
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update RAB item');
      }
    } catch (error) {
      console.error('Error updating RAB item:', error);
      
      // Fallback: update local state (demo mode)
      setRABItems(rabItems.map(item => 
        item.id === itemId ? { ...item, ...itemData, updatedAt: new Date().toISOString() } : item
      ));
      return { success: true, demo: true };
    }
  };

  const deleteRABItem = async (itemId) => {
    try {
      await fetch(`/api/projects/${projectId}/rab/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setRABItems(rabItems.filter(item => item.id !== itemId));
      if (onDataChange) onDataChange();
      return { success: true };
    } catch (error) {
      console.error('Error deleting RAB item:', error);
      
      // Fallback: remove from local state (demo mode)
      setRABItems(rabItems.filter(item => item.id !== itemId));
      return { success: true, demo: true };
    }
  };

  const approveRAB = async () => {
    try {
      const token = localStorage.getItem('token');
      const approvedBy = localStorage.getItem('userId') || localStorage.getItem('username') || 'system';

      const response = await fetch(`/api/projects/${projectId}/rab/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ approvedBy })
      });

      if (response.ok) {
        await fetchRABData();
        if (onDataChange) onDataChange();
        return { success: true };
      } else {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to approve RAB');
      }
    } catch (error) {
      console.error('Error approving RAB:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    rabItems,
    loading,
    approvalStatus,
    addRABItem,
    updateRABItem,
    deleteRABItem,
    approveRAB,
    refetch: fetchRABData
  };
};

export default useRABItems;
