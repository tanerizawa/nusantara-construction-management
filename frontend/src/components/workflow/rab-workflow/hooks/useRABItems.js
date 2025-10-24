import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for managing RAB items data
 * Handles fetching, creating, updating, and deleting RAB items
 */
const useRABItems = (projectId, onDataChange) => {
  const [rabItems, setRABItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [refetchCounter, setRefetchCounter] = useState(0);
  
  // Store onDataChange in ref to avoid re-renders
  const onDataChangeRef = useRef(onDataChange);
  
  // Update ref when onDataChange changes
  useEffect(() => {
    onDataChangeRef.current = onDataChange;
  }, [onDataChange]);

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
      console.log('🔄 useRABItems: Starting fetchRABData for projectId:', projectId);
      
      if (!projectId) {
        console.log('⚠️ useRABItems: No projectId provided');
        setRABItems([]);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        console.log('⚠️ useRABItems: No token found');
        setRABItems([]);
        return;
      }

      console.log('📡 useRABItems: Making API call to get RAB items...');
      console.log('📡 useRABItems: Project ID:', projectId);
      
      const response = await fetch(`/api/projects/${projectId}/rab`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 useRABItems: Response status:', response.status);
      
      const result = await response.json();
      console.log('🚀 useRABItems: Full result:', result);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${result.message || 'API Error'}`);
      }
      
      if (!result.success) {
        throw new Error(`Database Error: ${result.message}`);
      }
      
      const items = result.data || [];
      console.log('🔍 useRABItems: Items found:', items.length, items);
      
      if (items.length === 0) {
        console.log('⚠️ useRABItems: No RAB items found for project:', projectId);
        setRABItems([]);
        setApprovalStatus(null);
        return;
      }
      
      // Transform data
      const transformedItems = items.map((item, index) => {
        console.log(`🔄 useRABItems: Transforming item ${index + 1}:`, item);
        
        return {
          id: item.id,
          code: `RAB-${item.id.substring(0, 8)}`, // Generate code for display
          name: item.description || 'No description', // Add name field for ApprovalSection
          category: item.category || 'Unknown',
          description: item.description || 'No description',
          unit: item.unit || 'Unit',
          quantity: parseFloat(item.quantity) || 0,
          unitPrice: parseFloat(item.unitPrice) || 0,
          total: parseFloat(item.totalPrice) || 0,
          totalPrice: parseFloat(item.totalPrice) || 0,
          total_amount: parseFloat(item.totalPrice) || 0, // Add total_amount for ApprovalSection
          specifications: item.notes || '',
          status: item.isApproved ? 'approved' : 'draft',
          approval_status: item.isApproved ? 'approved' : 'pending_approval', // Add approval_status field
          isApproved: item.isApproved || false,
          approvedBy: item.approvedBy,
          approvedAt: item.approvedAt,
          created_at: item.createdAt, // Add created_at for ApprovalSection
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        };
      });

      console.log('🎯 useRABItems: Final transformed items count:', transformedItems.length);
      
      // Sync with localStorage approval status
      const syncedRABItems = syncRABApprovalStatus(transformedItems);
      console.log('✅ useRABItems: Setting rabItems state with', syncedRABItems.length, 'items');
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

  // Create memoized refetch function for external use
  const refetch = useCallback(() => {
    setRefetchCounter(prev => prev + 1);
  }, []);

  useEffect(() => {
    fetchRABData();
  }, [projectId, refetchCounter]); // eslint-disable-line react-hooks/exhaustive-deps

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
        if (onDataChangeRef.current) onDataChangeRef.current();
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
        status: 'draft', // Default status - will trigger FCM notification
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
      const response = await fetch(`/api/projects/${projectId}/rab/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(itemData)
      });

      if (response.ok) {
        await fetchRABData();
        if (onDataChangeRef.current) onDataChangeRef.current();
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
      if (onDataChangeRef.current) onDataChangeRef.current();
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
        if (onDataChangeRef.current) onDataChangeRef.current();
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
    refetch
  };
};

export default useRABItems;
