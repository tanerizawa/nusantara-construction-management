import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing approval data
 * Handles fetching RAB, PO, and Tanda Terima data from API
 */
export const useApprovalData = (projectId) => {
  const [approvalData, setApprovalData] = useState({
    rab: [],
    purchaseOrders: [],
    tandaTerima: [],
    progressPayments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load RAB data from API with approval status sync
   */
  const loadRAB = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${projectId}/rab`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch RAB');
      
      const result = await response.json();
      const rabData = result.data || [];
      
      // Map RAB data and sync with localStorage cache
      return rabData.map(item => {
        // Get cached status from localStorage
        const cacheKey = `approval_status_${projectId}`;
        const approvalStatusCache = localStorage.getItem(cacheKey);
        let cachedStatus = null;
        
        if (approvalStatusCache) {
          try {
            const cache = JSON.parse(approvalStatusCache);
            const itemKey = `rab_${item.id}`;
            cachedStatus = cache[itemKey];
          } catch (error) {
            console.error('Error parsing approval cache:', error);
          }
        }
        
        // Determine final status
        let finalStatus = 'draft';
        if (cachedStatus && cachedStatus.status) {
          finalStatus = cachedStatus.status;
        } else if (item.isApproved) {
          finalStatus = 'approved';
        }
        
        return {
          id: item.id,
          approval_id: `RAB-${item.id.slice(0, 8)}`,
          approval_type: 'rab',
          type: 'rab',
          category: item.category || 'General',
          description: item.description,
          quantity: parseFloat(item.quantity) || 1,
          unit: item.unit || 'ls',
          unit_price: parseFloat(item.unitPrice) || 0,
          total_price: parseFloat(item.totalPrice) || 0,
          status: finalStatus,
          created_at: item.createdAt,
          updated_at: item.updatedAt,
          approved_at: item.approvedAt,
          approved_by: item.approvedBy,
          notes: item.notes || '',
          document_number: `RAB-${item.category?.replace(/\s+/g, '')}-${item.id.slice(-3)}`
        };
      });
    } catch (error) {
      console.error('[RAB] Load error:', error);
      return [];
    }
  }, [projectId]);

  /**
   * Load Purchase Orders from API
   */
  const loadPO = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/purchase-orders?projectId=${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch PO');
      
      const result = await response.json();
      const poData = result.data || [];
      
      return poData.map(item => ({
        id: item.id,
        approval_id: item.poNumber || `PO-${item.id.slice(-8)}`,
        approval_type: 'purchaseOrders',
        type: 'purchase_order',
        po_number: item.poNumber,
        supplier_name: item.supplierName,
        supplier_id: item.supplierId,
        description: `Purchase Order - ${item.supplierName}`,
        total_amount: parseFloat(item.totalAmount) || 0,
        status: item.status || 'draft',
        created_at: item.createdAt || item.orderDate,
        expected_delivery_date: item.expectedDeliveryDate,
        delivery_address: item.deliveryAddress || 'Site Project',
        notes: item.notes || '',
        items: Array.isArray(item.items) 
          ? item.items.map(i => `${i.itemName} (${i.quantity})`).join(', ') 
          : 'N/A',
        created_by: item.createdBy || 'System',
        approved_by: item.approvedBy,
        approved_at: item.approvedAt,
        document_number: item.poNumber,
        subtotal: parseFloat(item.subtotal) || 0,
        tax_amount: parseFloat(item.taxAmount) || 0
      }));
    } catch (error) {
      console.error('[PO] Load error:', error);
      return [];
    }
  }, [projectId]);

  /**
   * Load Tanda Terima (Delivery Receipts) from API
   */
  const loadTandaTerima = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/projects/${projectId}/delivery-receipts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Delivery Receipts: ${response.status}`);
      }
      
      const result = await response.json();
      const receiptData = result.data || [];
      
      return receiptData.map(item => ({
        id: item.id,
        approval_id: item.receiptNumber || `TR-${item.id.slice(-8)}`,
        approval_type: 'tandaTerima',
        type: 'delivery_receipt',
        receipt_number: item.receiptNumber,
        po_number: item.purchaseOrder?.poNumber || 'N/A',
        supplier_name: item.purchaseOrder?.supplierName || 'N/A',
        description: `Tanda Terima - ${item.purchaseOrder?.supplierName || 'N/A'}`,
        receiver_name: item.receiverName,
        delivery_location: item.deliveryLocation,
        status: item.status || 'pending_delivery',
        created_at: item.createdAt,
        received_date: item.receivedDate,
        delivery_date: item.deliveryDate,
        inspection_result: item.inspectionResult || 'pending',
        created_by: item.createdBy || 'System',
        approved_by: item.approvedBy,
        approved_at: item.approvedAt,
        document_number: item.receiptNumber,
        total_items: item.items?.length || 0,
        delivery_percentage: item.receiptType === 'full_delivery' ? 100 : 
          (item.items ? Math.round((item.items.reduce((sum, i) => sum + (i.deliveredQuantity || 0), 0) / 
            item.items.reduce((sum, i) => sum + (i.orderedQuantity || 0), 0)) * 100) : 0)
      }));
    } catch (error) {
      console.error('[TANDA TERIMA] Load error:', error);
      return [];
    }
  }, [projectId]);

  /**
   * Load Progress Payments for approval
   */
  const loadProgressPayments = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${projectId}/progress-payments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch progress payments');
      
      const result = await response.json();
      const paymentsData = result.data || [];
      
      // Filter payments that need approval (pending_ba or pending_approval status)
      const pendingPayments = paymentsData.filter(payment => 
        payment.status === 'pending_ba' || 
        payment.status === 'pending_approval'
      );
      
      return pendingPayments.map(payment => ({
        ...payment,
        approval_id: payment.invoiceNumber || `PAY-${payment.id?.slice(0, 8)}`,
        approval_type: 'payment',
        type: 'payment'
      }));
    } catch (error) {
      console.error('[Progress Payments] Load error:', error);
      return [];
    }
  }, [projectId]);

  /**
   * Load all approval data
   */
  const loadApprovalData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load all data types in parallel
      const [rabData, poData, receiptData, paymentsData] = await Promise.all([
        loadRAB(),
        loadPO(),
        loadTandaTerima(),
        loadProgressPayments()
      ]);

      setApprovalData({
        rab: rabData,
        purchaseOrders: poData,
        tandaTerima: receiptData,
        progressPayments: paymentsData
      });

    } catch (err) {
      console.error('Error loading approval data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, loadRAB, loadPO, loadTandaTerima, loadProgressPayments]);

  /**
   * Refresh specific category data
   */
  const refreshCategory = useCallback(async (category) => {
    try {
      let categoryData = [];
      
      switch(category) {
        case 'rab':
          categoryData = await loadRAB();
          break;
        case 'purchaseOrders':
          categoryData = await loadPO();
          break;
        case 'tandaTerima':
          categoryData = await loadTandaTerima();
          break;
        case 'progressPayments':
          categoryData = await loadProgressPayments();
          break;
        default:
          return;
      }
      
      setApprovalData(prev => ({
        ...prev,
        [category]: categoryData
      }));
    } catch (err) {
      console.error(`Error refreshing ${category}:`, err);
    }
  }, [loadRAB, loadPO, loadTandaTerima, loadProgressPayments]);

  // Load data on mount
  useEffect(() => {
    if (projectId) {
      loadApprovalData();
    }
  }, [projectId, loadApprovalData]);

  return {
    approvalData,
    setApprovalData,
    loading,
    error,
    loadApprovalData,
    refreshCategory
  };
};
