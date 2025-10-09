import React, { useState } from 'react';
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

const ProjectRABWorkflow = ({ projectId, project, onDataChange }) => {
  console.log('=== ProjectRABWorkflow COMPONENT LOADED ===');
  console.log('Received projectId:', projectId);
  console.log('Received project:', project);
  console.log('onDataChange function:', typeof onDataChange);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [isApproving, setIsApproving] = useState(false);

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

      {/* RAB Items Table */}
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
      />
    </div>
  );
};

export default ProjectRABWorkflow;
