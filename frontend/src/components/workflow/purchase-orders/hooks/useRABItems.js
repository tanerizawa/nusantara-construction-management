import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing RAB (Budget) Items
 * Handles RAB fetching, filtering, and approval status synchronization
 */
export const useRABItems = (projectId) => {
  const [rabItems, setRABItems] = useState([]);
  const [filteredRABItems, setFilteredRABItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Sync RAB approval status with localStorage cache
   */
  const syncRABApprovalStatus = useCallback((rabItemsData) => {
    try {
      const cacheKey = `approval_status_${projectId}`;
      const approvalStatusCache = localStorage.getItem(cacheKey);
      
      if (!approvalStatusCache) {
        console.log('[RAB SYNC] No approval cache found');
        return rabItemsData;
      }
      
      const approvalStatuses = JSON.parse(approvalStatusCache);
      console.log('[RAB SYNC] Found approval cache:', approvalStatuses);
      
      // Update RAB items with cached approval status
      const syncedItems = rabItemsData.map(item => {
        const rabApprovalKey = `rab_${item.id}`;
        const cachedStatus = approvalStatuses[rabApprovalKey];
        
        if (cachedStatus) {
          console.log(`[RAB SYNC] Updating ${item.description} status from ${item.isApproved} to ${cachedStatus.status === 'approved'}`);
          return {
            ...item,
            isApproved: cachedStatus.status === 'approved',
            is_approved: cachedStatus.status === 'approved',
            approved_at: cachedStatus.approved_at,
            approved_by: cachedStatus.approved_by,
            approval_status: cachedStatus.status,
            last_sync: new Date().toISOString()
          };
        }
        
        return item;
      });
      
      console.log(`[RAB SYNC] Synced ${syncedItems.filter(item => item.isApproved).length} approved items out of ${rabItemsData.length}`);
      return syncedItems;
    } catch (error) {
      console.error('[RAB SYNC] Error syncing approval status:', error);
      return rabItemsData;
    }
  }, [projectId]);

  /**
   * Fetch RAB items with purchase tracking data
   */
  const fetchRABItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      // First, get RAB items for this project
      const response = await fetch(`/api/projects/${projectId}/rab`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch RAB items');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const rabItemsData = result.data;
        
        // Then get purchase summary for all RAB items in this project
        const summaryUrl = `/api/rab-tracking/projects/${projectId}/purchase-summary`;
        
        const summaryResponse = await fetch(summaryUrl);
        let purchaseSummary = {};
        
        if (summaryResponse.ok) {
          const summaryResult = await summaryResponse.json();
          console.log('[DEBUG] Purchase summary response:', summaryResult);
          
          if (summaryResult.success && summaryResult.data) {
            // Convert array to object with rabItemId as string key (defensive)
            purchaseSummary = summaryResult.data.reduce((acc, s) => {
              const key = String(s.rabItemId ?? s.rab_item_id ?? s.id);
              acc[key] = s;
              return acc;
            }, {});
            console.log('[DEBUG] Processed purchase summary:', purchaseSummary);
          }
        } else {
          console.error('[DEBUG] Purchase summary fetch failed:', summaryResponse.status, await summaryResponse.text());
        }
        
        // Combine RAB items with purchase tracking data
        const enhancedRABItems = rabItemsData.map(item => {
          const key = String(item.id); // Use UUID as key
          const purchaseData = purchaseSummary[key] || {};

          // Support alternate field names from backend
          const totalPurchased = parseFloat(purchaseData.totalPurchased ?? purchaseData.total_purchased ?? purchaseData.total_purchased_quantity ?? 0) || 0;
          const totalAmount = parseFloat(purchaseData.totalAmount ?? purchaseData.total_amount ?? 0) || 0;
          const activePOCount = parseInt(purchaseData.activePOCount ?? purchaseData.active_po_count ?? 0) || 0;
          const lastPurchaseDate = purchaseData.lastPurchaseDate ?? purchaseData.last_purchase_date ?? null;
          const recordCount = parseInt(purchaseData.recordCount ?? purchaseData.record_count ?? 0) || 0;

          const totalQty = parseFloat(item.quantity) || 0;
          // Use Math.floor to eliminate decimal issues like 0.01 difference
          const remainingQuantity = Math.floor(Math.max(0, totalQty - totalPurchased));
          const availableQuantity = remainingQuantity;

          // Calculate remaining values (in Rupiah)
          const unitPrice = parseFloat(item.unitPrice ?? item.unit_price ?? 0) || 0;
          const totalRABValue = totalQty * unitPrice;
          const totalPurchasedValue = totalPurchased * unitPrice;
          const remainingValue = remainingQuantity * unitPrice;

          const enhanced = {
            ...item,
            // Calculate remaining and available quantities
            remainingQuantity,
            availableQuantity,
            // Add purchase tracking data
            totalPurchased,
            totalPurchaseAmount: totalAmount,
            activePOCount,
            lastPurchaseDate,
            purchaseRecordCount: recordCount,
            // Calculate purchase progress percentage
            purchaseProgress: totalQty > 0 ? (totalPurchased / totalQty) * 100 : 0,
            // Add value calculations for real-time budget tracking
            totalRABValue,
            totalPurchasedValue,
            remainingValue,
            unitPrice
          };

          // Debug: log mapping for easier tracing when UI doesn't update
          console.debug('[RAB Purchase] itemId=', key, 'totalQty=', totalQty, 'totalPurchased=', totalPurchased, 'available=', availableQuantity, 'remainingValue=', remainingValue);

          return enhanced;
        });
        
        // Sync RAB approval status with localStorage cache
        const syncedRABItems = syncRABApprovalStatus(enhancedRABItems);
        
        setRABItems(syncedRABItems);
        setFilteredRABItems(syncedRABItems);
      }
    } catch (err) {
      console.error('Error fetching RAB items:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, syncRABApprovalStatus]);

  /**
   * Filter RAB items by category
   */
  const filterByCategory = useCallback((category) => {
    if (!category || category === 'all') {
      setFilteredRABItems(rabItems);
    } else {
      const filtered = rabItems.filter(item => 
        item.category?.toLowerCase() === category.toLowerCase()
      );
      setFilteredRABItems(filtered);
    }
  }, [rabItems]);

  /**
   * Filter RAB items by approval status
   */
  const filterByApproval = useCallback((showOnlyApproved) => {
    if (showOnlyApproved) {
      const filtered = rabItems.filter(item => item.isApproved || item.is_approved);
      setFilteredRABItems(filtered);
    } else {
      setFilteredRABItems(rabItems);
    }
  }, [rabItems]);

  /**
   * Filter RAB items by availability
   */
  const filterByAvailability = useCallback((showOnlyAvailable) => {
    if (showOnlyAvailable) {
      const filtered = rabItems.filter(item => 
        item.availableQuantity > 0 || item.remainingQuantity > 0
      );
      setFilteredRABItems(filtered);
    } else {
      setFilteredRABItems(rabItems);
    }
  }, [rabItems]);

  /**
   * Search RAB items by description
   */
  const searchRABItems = useCallback((searchTerm) => {
    if (!searchTerm) {
      setFilteredRABItems(rabItems);
    } else {
      const filtered = rabItems.filter(item =>
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRABItems(filtered);
    }
  }, [rabItems]);

  // Fetch RAB items on mount and when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchRABItems();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]); // Only re-fetch when projectId changes, not when fetchRABItems changes

  return {
    rabItems,
    filteredRABItems,
    loading,
    error,
    fetchRABItems,
    filterByCategory,
    filterByApproval,
    filterByAvailability,
    searchRABItems,
    syncRABApprovalStatus
  };
};
