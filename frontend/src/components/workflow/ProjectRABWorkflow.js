import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, Download, List } from 'lucide-react';
import useRABItems from './rab-workflow/hooks/useRABItems';
import useBulkRABForm from './rab-workflow/hooks/useBulkRABForm';
import useRABSync from './rab-workflow/hooks/useRABSync';
import StatusBadge from './rab-workflow/components/StatusBadge';
import Notification from './rab-workflow/components/Notification';
import RABSummaryCards from './rab-workflow/components/RABSummaryCards';
import BulkRABForm from './rab-workflow/components/BulkRABForm';
import RABItemsTable from './rab-workflow/components/RABItemsTable';
import RABBreakdownChart from './rab-workflow/components/RABBreakdownChart';
import RABStatistics from './rab-workflow/components/RABStatistics';
import WorkflowActions from './rab-workflow/components/WorkflowActions';
import EmptyState from './rab-workflow/components/EmptyState';
import { canAddItems } from './rab-workflow/config/statusConfig';
import useApprovalActions from '../../hooks/useApprovalActions';
import api from '../../services/api';

const ProjectRABWorkflow = ({ projectId, project, onDataChange }) => {
  console.log('=== ProjectRABWorkflow COMPONENT LOADED ===');
  console.log('Received projectId:', projectId);
  console.log('Received project:', project);
  console.log('onDataChange function:', typeof onDataChange);

  const [showBulkForm, setShowBulkForm] = useState(false);
  const [loadedDraftItems, setLoadedDraftItems] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [isApproving, setIsApproving] = useState(false);
  const [workflowStats, setWorkflowStats] = useState({
    totalPOs: 0,
    approvedPOs: 0,
    totalReceipts: 0,
    totalBAs: 0,
    totalPayments: 0
  });

  // Define showNotification function first, before it's used in any hooks
  const showNotification = useCallback((message, type = 'success') => {
    const timestamp = new Date().toLocaleTimeString();
    const timestampedMessage = `[${timestamp}] ${message}`;
    console.log(`📢 Notification: ${timestampedMessage}`);
    
    setNotification({ show: true, message: timestampedMessage, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  }, []); // No dependencies needed

  // Store onDataChange in ref to ensure it's stable across renders
  const onDataChangeRef = useRef(onDataChange);
  
  // Update onDataChangeRef when onDataChange changes
  useEffect(() => {
    onDataChangeRef.current = onDataChange;
  }, [onDataChange]);
  
  // Custom hooks
  const {
    rabItems,
    loading,
    approvalStatus,
    addRABItem,
    updateRABItem,
    deleteRABItem,
    approveRAB,
    refetch
  } = useRABItems(projectId, onDataChangeRef.current);

  // Use refs to keep stable callback references and avoid infinite loops
  const refetchRef = useRef(refetch);
  const showNotificationRef = useRef(showNotification);
  
  // Update refs when functions change
  useEffect(() => {
    refetchRef.current = refetch;
    showNotificationRef.current = showNotification;
  }, [refetch, showNotification]);

  // Stable approval callbacks that don't cause re-renders
  const handleApprovalSuccess = useCallback((data, action) => {
    showNotificationRef.current(`Item berhasil ${action === 'approved' ? 'diapprove' : 'ditolak'}`, 'success');
    refetchRef.current();
  }, []); // No dependencies - uses refs

  const handleApprovalError = useCallback((error) => {
    showNotificationRef.current(error, 'error');
  }, []); // No dependencies - uses refs

  // Approval actions hook
  const {
    approveItem,
    rejectItem
  } = useApprovalActions('rab', projectId, handleApprovalSuccess, handleApprovalError);

  // Bulk form handler for success callback
  const handleBulkSubmitSuccess = useCallback(async (results) => {
    await refetch(); // Refresh data
    const totalItems = results.reduce((sum, r) => sum + r.count, 0);
    showNotification(
      `${totalItems} item RAB berhasil ditambahkan!`,
      'success'
    );
  }, [refetch, showNotification]); // Include showNotification in dependencies

  // Sync with approval changes
  useRABSync(projectId, refetch);

  // Bulk RAB operations
  const {
    draftItems,
    loadDraft,
    saveDraft,
    submitBulkItems,
    generateSubmissionSummary
  } = useBulkRABForm(projectId, handleBulkSubmitSuccess);

  // Fetch workflow statistics
  useEffect(() => {
    const fetchWorkflowStats = async () => {
      try {
        // Fetch POs - Using query parameter for project filtering
        const poResponse = await api.get(`/purchase-orders?projectId=${projectId}`);
        const pos = poResponse.data?.data || [];
        const approvedPOs = pos.filter(po => po.status === 'approved');

        // Fetch Delivery Receipts - Using correct nested route
        let receipts = [];
        try {
          const receiptResponse = await api.get(`/projects/${projectId}/delivery-receipts`);
          receipts = receiptResponse.data?.data || [];
        } catch (err) {
          console.warn('Error fetching receipts:', err.message);
        }

        // Fetch Berita Acara - Using correct nested route
        let bas = [];
        try {
          const baResponse = await api.get(`/projects/${projectId}/berita-acara`);
          bas = baResponse.data?.data || [];
        } catch (err) {
          console.warn('Error fetching berita acara:', err.message);
        }

        // Fetch Progress Payments - Using correct nested route
        let payments = [];
        try {
          const paymentResponse = await api.get(`/projects/${projectId}/progress-payments`);
          payments = paymentResponse.data?.data || [];
        } catch (err) {
          console.warn('Error fetching payments:', err.message);
        }

        setWorkflowStats({
          totalPOs: pos.length,
          approvedPOs: approvedPOs.length,
          totalReceipts: receipts.length,
          totalBAs: bas.length,
          totalPayments: payments.length
        });
      } catch (error) {
        console.error('Error fetching workflow stats:', error);
      }
    };

    if (projectId && approvalStatus?.status === 'approved') {
      fetchWorkflowStats();
    }
  }, [projectId, approvalStatus]);

  const handleAddClick = useCallback(() => {
    // Load draft items once when the form opens, not on every render
    const items = loadDraft();
    setLoadedDraftItems(items);
    setShowBulkForm(true);
  }, [loadDraft]);

  const handleCancelForm = useCallback(() => {
    setShowBulkForm(false);
  }, []);

  const handleFormSubmitWrapper = useCallback(async (e) => {
    e.preventDefault();
    setShowBulkForm(false);
  }, []);

  const handleBulkSubmit = useCallback(async (items) => {
    console.log('🔄 ProjectRABWorkflow: Starting bulk submit with items:', items);
    
    const result = await submitBulkItems(items);
    console.log('🔄 ProjectRABWorkflow: Bulk submit result:', result);
    
    if (result.success) {
      setShowBulkForm(false);
      
      console.log('🔄 ProjectRABWorkflow: Refreshing RAB data after successful submit...');
      // Force refresh of RAB data
      await refetch();
      console.log('🔄 ProjectRABWorkflow: RAB data refresh completed');
      
      const summary = generateSubmissionSummary(result.results);
      showNotification(summary.join(', '), 'success');
    } else {
      console.error('❌ ProjectRABWorkflow: Bulk submit failed:', result.error);
      showNotification(result.error || 'Gagal menyimpan item bulk', 'error');
    }
    return result;
  }, [submitBulkItems, refetch, generateSubmissionSummary, showNotification]);

  const handleSaveDraft = useCallback(async (items) => {
    const result = await saveDraft(items);
    if (result.success) {
      showNotification(result.message, 'success');
    } else {
      showNotification(result.error || 'Gagal menyimpan draft', 'error');
    }
    return result;
  }, [saveDraft, showNotification]);

  const handleEditItem = useCallback((item) => {
    // For now, editing will be done within the bulk form or a modal
    // This is a placeholder for future edit functionality
    console.log('Edit item:', item);
  }, []);

  const handleDeleteItem = useCallback(async (itemId, description) => {
    const confirmMessage = `Apakah Anda yakin ingin menghapus item:\n"${description}"?\n\nTindakan ini tidak dapat dibatalkan.`;
    
    // eslint-disable-next-line no-restricted-globals
    if (confirm(confirmMessage)) {
      const result = await deleteRABItem(itemId);
      if (result.success) {
        showNotification(
          `Item RAB berhasil dihapus!${result.demo ? ' (Mode Demo)' : ''}`,
          'success'
        );
      }
    }
  }, [deleteRABItem, showNotification]);

  const handleApproveItem = useCallback(async (item) => {
    const result = await approveItem(item);
    if (result.success) {
      showNotification('Item RAB berhasil diapprove!', 'success');
    }
  }, [approveItem, showNotification]);

  const handleRejectItem = useCallback(async (item) => {
    const reason = prompt('Alasan penolakan:');
    if (reason && reason.trim()) {
      const result = await rejectItem(item, reason);
      if (result.success) {
        showNotification('Item RAB ditolak', 'warning');
      }
    }
  }, [rejectItem, showNotification]);

  const handleApproveAll = useCallback(async () => {
    const pendingItems = rabItems.filter(item => !item.isApproved);
    if (pendingItems.length === 0) {
      return;
    }

    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Approve ${pendingItems.length} item sekaligus?`)) {
      let successCount = 0;
      for (const item of pendingItems) {
        const result = await approveItem(item);
        if (result.success) successCount++;
      }
      showNotification(`${successCount} dari ${pendingItems.length} item berhasil diapprove`, 'success');
    }
  }, [rabItems, approveItem, showNotification]);

  const handleApproveRAB = useCallback(async () => {
    if (rabItems.length === 0) {
      alert('Tidak ada item RAB untuk diapprove');
      return;
    }

    setIsApproving(true);
    const result = await approveRAB();
    setIsApproving(false);

    if (result.success) {
      showNotification('RAB berhasil diapprove!', 'success');
    } else {
      showNotification(result.error || 'Gagal approve RAB. Silakan coba lagi.', 'error');
    }
  }, [rabItems.length, approveRAB, showNotification]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Notification */}
      <Notification 
        show={notification.show}
        message={notification.message}
        type={notification.type}
      />

      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">RAB Management</h2>
          <p className="text-sm text-[#8E8E93]">Rencana Anggaran Biaya untuk {project.name}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Approval Status Indicator */}
          {approvalStatus && (
            <StatusBadge status={approvalStatus.status} />
          )}

          {/* Add RAB Button - Only show if not approved */}
          {canAddItems(approvalStatus) && (
            <button
              onClick={handleAddClick}
              className="flex items-center px-6 py-3 bg-[#30D158] text-white rounded-lg hover:bg-[#30D158]/90 transition-colors font-medium"
            >
              <List className="h-5 w-5 mr-2" />
              Kelola RAB
            </button>
          )}
          
          {/* Show message when RAB is approved */}
          {approvalStatus?.status === 'approved' && (
            <div className="text-sm text-[#98989D] italic">
              RAB telah disetujui - tidak dapat menambah item baru
            </div>
          )}
        </div>
      </div>

      {/* RAB Summary Card */}
      <RABSummaryCards rabItems={rabItems} approvalStatus={approvalStatus} />

      {/* RAB Items Table with Inline Approval */}
      <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#38383A]">
          <h3 className="text-base font-semibold text-white">Daftar Item RAB</h3>
        </div>
        
        {/* Bulk Input Form */}
        {showBulkForm && (
          <BulkRABForm
            onSubmit={handleBulkSubmit}
            onSaveDraft={handleSaveDraft}
            onCancel={handleCancelForm}
            draftItems={loadedDraftItems}
          />
        )}
        
        {/* Items Table or Empty State */}
        {!showBulkForm && (
          rabItems.length > 0 ? (
            <RABItemsTable
              rabItems={rabItems}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onApprove={handleApproveItem}
              onReject={handleRejectItem}
              onApproveAll={handleApproveAll}
            />
          ) : (
            <EmptyState onAddClick={handleAddClick} />
          )
        )}
      </div>

      {/* RAB Analysis Summary */}
      {rabItems.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Cost Breakdown by Category */}
          <RABBreakdownChart rabItems={rabItems} />

          {/* RAB Statistics */}
          <RABStatistics rabItems={rabItems} approvalStatus={approvalStatus} />
        </div>
      )}

      {/* Workflow Actions */}
      <WorkflowActions
        approvalStatus={approvalStatus}
        rabItemsCount={rabItems.length}
        isSubmitting={isApproving}
        onApprove={handleApproveRAB}
        workflowStats={workflowStats}
      />
    </div>
  );
};

export default ProjectRABWorkflow;
