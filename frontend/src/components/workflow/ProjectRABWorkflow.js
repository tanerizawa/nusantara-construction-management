import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import useRABItems from './rab-workflow/hooks/useRABItems';
import useRABForm from './rab-workflow/hooks/useRABForm';
import useRABSync from './rab-workflow/hooks/useRABSync';
import StatusBadge from './rab-workflow/components/StatusBadge';
import Notification from './rab-workflow/components/Notification';
import RABSummaryCards from './rab-workflow/components/RABSummaryCards';
import RABItemForm from './rab-workflow/components/RABItemForm';
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

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [isApproving, setIsApproving] = useState(false);
  const [workflowStats, setWorkflowStats] = useState({
    totalPOs: 0,
    approvedPOs: 0,
    totalReceipts: 0,
    totalBAs: 0,
    totalPayments: 0
  });

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
  } = useRABItems(projectId, onDataChange);

  // Approval actions hook
  const {
    approveItem,
    rejectItem
  } = useApprovalActions('rab', projectId, 
    (data, action) => {
      // On success callback
      showNotification(`Item berhasil ${action === 'approved' ? 'diapprove' : 'ditolak'}`, 'success');
      refetch(); // Refresh data
    },
    (error) => {
      // On error callback
      showNotification(error, 'error');
    }
  );

  // Form submission handler
  const handleFormSubmit = async (itemData) => {
    if (editingItem) {
      const result = await updateRABItem(editingItem.id, itemData);
      if (result.success) {
        showNotification(
          `Item RAB berhasil diperbarui!${result.demo ? ' (Mode Demo)' : ''}`,
          'success'
        );
        return result;
      }
    } else {
      const result = await addRABItem(itemData);
      if (result.success) {
        showNotification(
          `Item RAB berhasil ditambahkan!${result.demo ? ' (Mode Demo)' : ''}`,
          'success'
        );
        return result;
      }
    }
  };

  const {
    formData,
    formErrors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    loadEditData
  } = useRABForm(handleFormSubmit, editingItem);

  // Sync with approval changes
  useRABSync(projectId, refetch);

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

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
    setEditingItem(null);
    resetForm();
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
    resetForm();
  };

  const handleFormSubmitWrapper = async (e) => {
    e.preventDefault();
    const result = await handleSubmit(e);
    if (result && result.success) {
      setShowAddForm(false);
      setEditingItem(null);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    loadEditData(item);
    setShowAddForm(true);
  };

  const handleDeleteItem = async (itemId, description) => {
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
  };

  const handleApproveItem = async (item) => {
    const result = await approveItem(item);
    if (result.success) {
      showNotification('Item RAB berhasil diapprove!', 'success');
    }
  };

  const handleRejectItem = async (item) => {
    const reason = prompt('Alasan penolakan:');
    if (reason && reason.trim()) {
      const result = await rejectItem(item, reason);
      if (result.success) {
        showNotification('Item RAB ditolak', 'warning');
      }
    }
  };

  const handleApproveAll = async () => {
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
  };

  const handleApproveRAB = async () => {
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
  };

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

          {/* Add Item Button - Only show if not approved */}
          {canAddItems(approvalStatus) && (
            <button
              onClick={handleAddClick}
              className="flex items-center px-4 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Item RAB
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
        
        {/* Inline Add/Edit Form */}
        {showAddForm && (
          <RABItemForm
            formData={formData}
            formErrors={formErrors}
            isSubmitting={isSubmitting}
            editingItem={editingItem}
            onSubmit={handleFormSubmitWrapper}
            onCancel={handleCancelForm}
            onChange={handleChange}
          />
        )}
        
        {/* Items Table or Empty State */}
        {rabItems.length > 0 ? (
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
