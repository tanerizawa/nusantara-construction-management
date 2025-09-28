import React, { useState, useEffect, useCallback } from 'react';
import { 
  ClipboardCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  Calendar,
  RefreshCw,
  Eye,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  FileText,
  Download,
  ShoppingCart,
  Hammer,
  FileBarChart,
  DollarSign,
  Package,
  Search,
  Check,
  X,
  FileCheck
} from 'lucide-react';
import TandaTerimaManager from '../tanda-terima/TandaTerimaManager';

const ProfessionalApprovalDashboard = ({ projectId, project, userDetails, onDataChange }) => {
  const [approvalData, setApprovalData] = useState({
    rab: [],
    purchaseOrders: [],
    tandaTerima: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('rab');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Approval Categories Configuration - RAB dan PO real data
  const approvalCategories = [
    {
      id: 'rab',
      name: 'RAB',
      fullName: 'RAB & BOQ',
      icon: FileBarChart,
      color: 'bg-blue-100 text-blue-800',
      description: 'Rencana Anggaran Biaya & Bill of Quantities'
    },
    {
      id: 'purchaseOrders',
      name: 'PO',
      fullName: 'Purchase Orders',
      icon: ShoppingCart,
      color: 'bg-green-100 text-green-800',
      description: 'Pemesanan material dan equipment'
    },
    {
      id: 'tandaTerima',
      name: 'Tanda Terima',
      fullName: 'Tanda Terima',
      icon: Package,
      color: 'bg-purple-100 text-purple-800',
      description: 'Konfirmasi penerimaan barang dari PO yang sudah approved'
    }
  ];

  // Status Configuration with Approval Workflow
  const statusConfig = {
    'draft': { 
      label: 'Draft', 
      color: 'bg-gray-100 text-gray-800', 
      icon: FileText,
      description: 'Dokumen belum submit',
      canReview: true,
      canApprove: false
    },
    'under_review': { 
      label: 'Diperiksa', 
      color: 'bg-blue-100 text-blue-800', 
      icon: Eye,
      description: 'Sedang dalam pemeriksaan',
      canReview: false,
      canApprove: true
    },
    'pending': { 
      label: 'Menunggu Approval', 
      color: 'bg-yellow-100 text-yellow-800', 
      icon: Clock,
      description: 'Menunggu persetujuan',
      canReview: false,
      canApprove: true
    },
    'approved': { 
      label: 'Disetujui', 
      color: 'bg-green-100 text-green-800', 
      icon: CheckCircle,
      description: 'Telah disetujui',
      canReview: false,
      canApprove: false
    },
    'rejected': { 
      label: 'Ditolak', 
      color: 'bg-red-100 text-red-800', 
      icon: XCircle,
      description: 'Ditolak',
      canReview: true,
      canApprove: false
    }
  };

  // Function to update PO status in database
  const updatePOStatusInDatabase = async (poId, status, approvedBy = null) => {
    try {
      // Map frontend status to backend-compatible status
      const statusMapping = {
        'under_review': 'pending',
        'approved': 'approved',
        'rejected': 'cancelled',
        'draft': 'draft'
      };
      
      const backendStatus = statusMapping[status] || status;
      console.log(`[API UPDATE] Updating PO ${poId} status from ${status} to backend status ${backendStatus}`);
      
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
      console.log(`[API UPDATE] Successfully updated PO ${poId} status:`, result);
      
      return result;
    } catch (error) {
      console.error('[API UPDATE] Error updating PO status:', error);
      throw error;
    }
  };

  // Function to update RAB approval status in database
  const updateRABStatusInDatabase = async (rabId, isApproved, approvedBy = null) => {
    try {
      console.log(`[API UPDATE] Updating RAB ${rabId} approval status to ${isApproved}`);
      
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
        console.log(`[API UPDATE] Successfully approved RAB ${rabId}:`, result);
        return result;
        
      } else {
        // Use the general update endpoint for other status changes
        const updateData = {
          isApproved: false,
          status: 'under_review', // Set appropriate status for reviewed state
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
        console.log(`[API UPDATE] Successfully updated RAB ${rabId} status:`, result);
        return result;
      }
    } catch (error) {
      console.error('[API UPDATE] Error updating RAB status:', error);
      throw error;
    }
  };

  // Load real data from API
  const loadRealApprovalData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[REAL APPROVAL DASH] Loading data for project:', projectId);
      
      // Load RAB data from real API
      const loadRAB = async () => {
        try {
          const response = await fetch(`/api/projects/${projectId}/rab`);
          if (!response.ok) throw new Error('Failed to fetch RAB');
          
          const result = await response.json();
          const rabData = result.data || [];
          
          // Map RAB data dan sync dengan localStorage cache untuk status intermediate
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
            
            // Determine final status: use localStorage cache as source of truth for approval status
            // since backend API doesn't update RAB approval fields correctly
            let finalStatus = 'draft';
            if (cachedStatus && cachedStatus.status) {
              finalStatus = cachedStatus.status;
              console.log(`[RAB STATUS] Using cached status for ${item.id}: ${finalStatus}`);
            } else if (item.isApproved) {
              finalStatus = 'approved';
              console.log(`[RAB STATUS] Using database status for ${item.id}: approved`);
            } else {
              console.log(`[RAB STATUS] Using default status for ${item.id}: draft`);
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
      };

      // Load Purchase Orders from real API
      const loadPO = async () => {
        try {
          const response = await fetch(`/api/purchase-orders?projectId=${projectId}`);
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
      };

      // Load Delivery Receipts (Tanda Terima) from real API
      const loadTandaTerima = async () => {
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
      };

      // Load all data types
      const [rabData, poData, receiptData] = await Promise.all([
        loadRAB(),
        loadPO(),
        loadTandaTerima()
      ]);

      console.log('[REAL APPROVAL DASH] Data loaded:', {
        rab: rabData.length,
        po: poData.length,
        tandaTerima: receiptData.length
      });

      setApprovalData({
        rab: rabData,
        purchaseOrders: poData,
        tandaTerima: receiptData
      });

    } catch (error) {
      console.error('Error loading approval data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Save approval status to localStorage for realtime sync
  const saveApprovalStatusToCache = (item, newStatus, approvedBy = null) => {
    try {
      const cacheKey = `approval_status_${projectId}`;
      const existingCache = localStorage.getItem(cacheKey);
      let approvalStatuses = existingCache ? JSON.parse(existingCache) : {};
      
      const itemKey = item.approval_type === 'purchaseOrders' ? `po_${item.id}` : `rab_${item.id}`;
      
      console.log(`[APPROVAL DASHBOARD] Saving approval status:`, {
        cacheKey,
        itemKey,
        item_id: item.id,
        item_type: item.approval_type,
        newStatus,
        approvedBy
      });
      
      approvalStatuses[itemKey] = {
        status: newStatus,
        approved_at: newStatus === 'approved' ? new Date().toISOString() : null,
        approved_by: approvedBy,
        updated_at: new Date().toISOString(),
        item_id: item.id,
        item_type: item.approval_type
      };
      
      localStorage.setItem(cacheKey, JSON.stringify(approvalStatuses));
      console.log(`[APPROVAL CACHE] Saved status for ${itemKey}: ${newStatus}`);
      
      // Verify localStorage save
      const verifyCache = localStorage.getItem(cacheKey);
      const verifyParsed = JSON.parse(verifyCache);
      console.log(`[APPROVAL VERIFY] localStorage content after save:`, verifyParsed);
      
      // Trigger event to notify other components about status change
      const statusChangeEvent = new CustomEvent('approvalStatusChanged', {
        detail: {
          projectId,
          itemId: item.id,
          itemType: item.approval_type,
          newStatus,
          timestamp: new Date().toISOString()
        }
      });
      console.log(`[APPROVAL EVENT] Dispatching event:`, statusChangeEvent.detail);
      window.dispatchEvent(statusChangeEvent);
      
    } catch (error) {
      console.error('Error saving approval status to cache:', error);
    }
  };

  // Handle approval actions - Mark as "Under Review"
  const handleMarkAsReviewed = async (item) => {
    console.log(`[APPROVAL] Starting handleMarkAsReviewed for:`, item);
    
    try {
      // Update item status to under_review
      const updatedItem = { ...item, status: 'under_review' };
      
      console.log(`[APPROVAL] Updating local state for item ${item.id} to under_review`);
      
      // Update local state immediately for better UX
      setApprovalData(prevData => ({
        ...prevData,
        [activeCategory]: prevData[activeCategory].map(dataItem =>
          dataItem.id === item.id ? updatedItem : dataItem
        )
      }));

      // Save to localStorage for realtime sync
      console.log(`[APPROVAL DEBUG] Calling saveApprovalStatusToCache for under_review:`, {
        item_id: item.id,
        approval_id: item.approval_id,
        approval_type: item.approval_type
      });
      saveApprovalStatusToCache(item, 'under_review');

      // Update status in backend database
      if (item.approval_type === 'purchaseOrders') {
        console.log(`[APPROVAL] Updating PO in database...`);
        await updatePOStatusInDatabase(item.id, 'under_review');
        console.log(`[APPROVAL] PO database update completed`);
      } else if (item.approval_type === 'rab') {
        console.log(`[APPROVAL] Updating RAB in database...`);
        await updateRABStatusInDatabase(item.id, false); // false = under_review
        console.log(`[APPROVAL] RAB database update completed`);
      }
      
      console.log(`[APPROVAL] Successfully marked as reviewed:`, item.approval_id);
      
    } catch (error) {
      console.error('❌ [APPROVAL] Error marking as reviewed:', error);
      alert(`Error marking as reviewed: ${error.message}`);
      // Revert state on error
      loadRealApprovalData();
    }
  };

  // Handle final approval - Mark as "Approved"
  const handleApprove = async (item) => {
    console.log(`[APPROVAL] Starting handleApprove for:`, item);
    
    try {
      const approvedBy = userDetails?.name || 'Current User';
      
      // Update item status to approved
      const updatedItem = { 
        ...item, 
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: approvedBy
      };
      
      console.log(`[APPROVAL] Updating local state for item ${item.id} to approved`);
      
      // Update local state immediately for better UX
      setApprovalData(prevData => ({
        ...prevData,
        [activeCategory]: prevData[activeCategory].map(dataItem =>
          dataItem.id === item.id ? updatedItem : dataItem
        )
      }));

      // Save to localStorage for realtime sync
      console.log(`[APPROVAL DEBUG] Calling saveApprovalStatusToCache for approved:`, {
        item_id: item.id,
        approval_id: item.approval_id,
        approval_type: item.approval_type,
        approvedBy
      });
      saveApprovalStatusToCache(item, 'approved', approvedBy);

      // Update status in backend database
      if (item.approval_type === 'purchaseOrders') {
        console.log(`[APPROVAL] Updating PO in database...`);
        await updatePOStatusInDatabase(item.id, 'approved', approvedBy);
        console.log(`[APPROVAL] PO database update completed`);
      } else if (item.approval_type === 'rab') {
        console.log(`[APPROVAL] Updating RAB in database...`);
        await updateRABStatusInDatabase(item.id, true, approvedBy); // true = approved
        console.log(`[APPROVAL] RAB database update completed`);
      }
      
      console.log(`[APPROVAL] Successfully approved:`, item.approval_id);
      
    } catch (error) {
      console.error('❌ [APPROVAL] Error approving item:', error);
      alert(`Error approving item: ${error.message}`);
      // Revert state on error
      loadRealApprovalData();
    }
  };

  // Handle rejection
  const handleReject = async (item) => {
    try {
      // Update item status to rejected
      const updatedItem = { ...item, status: 'rejected' };
      
      // Update local state immediately for better UX
      setApprovalData(prevData => ({
        ...prevData,
        [activeCategory]: prevData[activeCategory].map(dataItem =>
          dataItem.id === item.id ? updatedItem : dataItem
        )
      }));

      // Save to localStorage for realtime sync
      saveApprovalStatusToCache(item, 'rejected');

      // Update status in backend database
      if (item.approval_type === 'purchaseOrders') {
        await updatePOStatusInDatabase(item.id, 'rejected');
      } else if (item.approval_type === 'rab') {
        console.log(`[APPROVAL] Updating RAB rejection in database...`);
        // For rejection, we need a general update since there's no specific reject endpoint
        const response = await fetch(`/api/projects/${projectId}/rab/${item.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            isApproved: false,
            status: 'rejected',
            approvedBy: null,
            approvedAt: null
          })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to reject RAB: ${response.statusText}`);
        }
        console.log(`[APPROVAL] RAB rejection database update completed`);
      }
      
      console.log(`[APPROVAL] Rejected:`, item.approval_id);
      
    } catch (error) {
      console.error('Error rejecting item:', error);
      // Revert state on error
      loadRealApprovalData();
    }
  };

  useEffect(() => {
    if (projectId) {
      loadRealApprovalData();
    }
  }, [projectId, loadRealApprovalData]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  // Filter data based on search and status
  const getFilteredData = () => {
    const currentData = approvalData[activeCategory] || [];
    
    return currentData.filter(item => {
      const matchesSearch = !searchTerm || 
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.approval_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  // Export RAB to CSV
  const handleExportRAB = () => {
    const rabItems = approvalData.rab || [];
    if (rabItems.length === 0) {
      alert('Tidak ada data RAB untuk diekspor');
      return;
    }

    const csvHeaders = ['No', 'Kategori', 'Deskripsi', 'Quantity', 'Unit', 'Harga Satuan', 'Total Harga', 'Status', 'Tanggal Dibuat'];
    const csvData = rabItems.map((item, index) => [
      index + 1,
      item.category,
      item.description,
      item.quantity,
      item.unit,
      item.unit_price,
      item.total_price,
      statusConfig[item.status]?.label || item.status,
      formatDate(item.created_at)
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RAB_${projectId}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Generate BOQ from approved RAB
  const handleGenerateBOQ = () => {
    const approvedRAB = (approvalData.rab || []).filter(item => item.status === 'approved');
    
    if (approvedRAB.length === 0) {
      alert('Tidak ada RAB yang disetujui untuk generate BOQ');
      return;
    }

    const boqHeaders = ['No', 'Item Code', 'Deskripsi', 'Unit', 'Quantity', 'Harga Satuan', 'Total'];
    const boqData = approvedRAB.map((item, index) => [
      index + 1,
      `BOQ-${item.approval_id}`,
      item.description,
      item.unit,
      item.quantity,
      item.unit_price,
      item.total_price
    ]);

    const csvContent = [boqHeaders, ...boqData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BOQ_${projectId}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading approval data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadRealApprovalData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4 mr-2 inline" />
          Retry
        </button>
      </div>
    );
  }

  const filteredData = getFilteredData();
  const currentCategory = approvalCategories.find(cat => cat.id === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Approval Dashboard</h2>
          <p className="text-gray-600">Monitor RAB & Purchase Order approvals - Real Data</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadRealApprovalData}
            disabled={loading}
            className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </button>
          {activeCategory === 'rab' && (
            <>
              <button
                onClick={handleExportRAB}
                className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-1" />
                Export RAB
              </button>
              <button
                onClick={handleGenerateBOQ}
                className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FileBarChart className="h-4 w-4 mr-1" />
                Generate BOQ
              </button>
            </>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {approvalCategories.map((category) => {
          const categoryData = approvalData[category.id] || [];
          const totalValue = categoryData.reduce((sum, item) => sum + (item.total_price || 0), 0);
          const approvedCount = categoryData.filter(item => item.status === 'approved').length;
          
          return (
            <div key={category.id} className="bg-white rounded-lg border p-4">
              <div className="flex items-center">
                <category.icon className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-2xl font-bold text-gray-900">{categoryData.length}</p>
                  <p className="text-sm text-gray-600">{category.fullName}</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <p>{approvedCount} approved • {formatCurrency(totalValue)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {approvalCategories.map((category) => {
            const count = approvalData[category.id]?.length || 0;
            const isActive = activeCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <category.icon className="h-4 w-4 mr-2" />
                {category.fullName}
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${currentCategory?.fullName}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="under_review">Diperiksa</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {currentCategory?.fullName} ({filteredData.length})
          </h3>
        </div>

        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <currentCategory.icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {currentCategory?.fullName} Found
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : `No ${currentCategory?.fullName.toLowerCase()} data available for this project.`
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID / Description
                  </th>
                  {activeCategory === 'rab' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                    </>
                  )}
                  {activeCategory === 'purchaseOrders' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supplier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                    </>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.approval_id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.description}
                        </div>
                      </div>
                    </td>
                    {activeCategory === 'rab' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity} {item.unit}
                        </td>
                      </>
                    )}
                    {activeCategory === 'purchaseOrders' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.supplier_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {item.items}
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(item.total_price || item.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        statusConfig[item.status]?.color || 'bg-gray-100 text-gray-800'
                      }`}>
                        {statusConfig[item.status]?.label || item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        {/* Tombol "Diperiksa" - hanya tampil jika status draft atau rejected */}
                        {statusConfig[item.status]?.canReview && (
                          <button
                            onClick={() => handleMarkAsReviewed(item)}
                            className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                            title="Mark as Reviewed"
                          >
                            <FileCheck className="h-3 w-3 mr-1" />
                            Diperiksa
                          </button>
                        )}
                        
                        {/* Tombol "Disetujui" - hanya tampil jika status under_review atau pending */}
                        {statusConfig[item.status]?.canApprove && (
                          <button
                            onClick={() => handleApprove(item)}
                            className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                            title="Approve"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Disetujui
                          </button>
                        )}
                        
                        {/* Tombol "Tolak" - tampil jika bukan status approved */}
                        {item.status !== 'approved' && (
                          <button
                            onClick={() => handleReject(item)}
                            className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                            title="Reject"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Tolak
                          </button>
                        )}
                        
                        {/* Status indicator untuk approved items */}
                        {item.status === 'approved' && (
                          <span className="inline-flex items-center px-2 py-1 text-xs text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Selesai
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Summary */}
      {filteredData.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredData.length} of {(approvalData[activeCategory] || []).length} items
            </span>
            <span>
              Total Value: {formatCurrency(
                filteredData.reduce((sum, item) => sum + (item.total_price || item.total_amount || 0), 0)
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalApprovalDashboard;