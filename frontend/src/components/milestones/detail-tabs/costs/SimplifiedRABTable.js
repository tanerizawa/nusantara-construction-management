import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  Package, 
  Wrench, 
  Truck, 
  Users,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit2,
  Save,
  X,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../utils/formatters';
import StatusBadge from './StatusBadge';
import ActionButtons from './ActionButtons';
import PaymentExecutionModal from './PaymentExecutionModal';

/**
 * Modal Component with Portal - Robust Implementation
 */
const Modal = ({ isOpen, onClose, children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalRoot = document.body;

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ 
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onClick={handleBackdropClick}
    >
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {children}
      </div>
    </div>,
    modalRoot
  );
};

/**
 * SimplifiedRABTable Component
 * 
 * Excel-like table for quick RAB actual cost entry
 * Click on "Actual Cost" cell to edit inline
 */
const SimplifiedRABTable = ({ 
  rabItems, 
  onAddRealization,
  getRealizations,
  expenseAccounts = [],
  sourceAccounts = [],
  onSubmitRealization,
  projectId,
  milestoneId,
  isManager = false, // Add this prop to determine if user can approve/reject
  isFinance = false  // Add this prop for payment execution permission
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState('add'); // 'add' or 'edit'
  const [editingRealizationId, setEditingRealizationId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAccount, setEditAccount] = useState('');
  const [editSource, setEditSource] = useState('');
  const [saving, setSaving] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [realizations, setRealizations] = useState({});
  const [workflowLoading, setWorkflowLoading] = useState(false);
  
  // Payment execution modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedCostForPayment, setSelectedCostForPayment] = useState(null);

  // Item type icons
  const itemTypeIcons = {
    material: Package,
    service: Wrench,
    equipment: Truck,
    subcontractor: Users
  };

  // Status configuration
  const getStatusColor = (status) => {
    const configs = {
      not_started: 'text-gray-400',
      in_progress: 'text-blue-400',
      completed: 'text-green-400',
      over_budget: 'text-red-400'
    };
    return configs[status] || configs.not_started;
  };

  // Start editing - Open Modal
  const handleStartEdit = (item) => {
    console.log('[SimplifiedRABTable] handleStartEdit called', { item });
    console.log('[SimplifiedRABTable] Document body exists:', !!document.body);
    console.log('[SimplifiedRABTable] ReactDOM.createPortal exists:', !!ReactDOM.createPortal);
    
    setSelectedItem(item);
    setEditMode('add');
    setEditingRealizationId(null);
    setEditValue('');
    setEditDescription('');
    setEditAccount(expenseAccounts[0]?.id || '');
    setEditSource(sourceAccounts[0]?.id || '');
    setModalOpen(true);
    
    console.log('[SimplifiedRABTable] After setState - modalOpen should be true');
  };

  const handleEditRealization = (item, realization) => {
    console.log('[SimplifiedRABTable] handleEditRealization called', { item, realization });
    
    setSelectedItem(item);
    setEditMode('edit');
    setEditingRealizationId(realization.id);
    setEditValue(realization.actual_value.toString());
    setEditDescription(realization.description || '');
    setEditAccount(realization.expense_account_id || '');
    setEditSource(realization.source_account_id || '');
    setModalOpen(true);
  };

  const handleDeleteRealization = async (realizationId) => {
    if (!window.confirm('Hapus transaksi realisasi ini?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/realizations/${realizationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete realization');
      }

      // Reload data after delete
      if (selectedItem?.id) {
        const data = await getRealizations(selectedItem.id);
        setRealizations(prev => ({ ...prev, [selectedItem.id]: data || [] }));
      }
      alert('Transaksi berhasil dihapus');
    } catch (error) {
      console.error('Error deleting realization:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // ========== WORKFLOW HANDLERS ==========
  
  const handleSubmitCost = async (costId) => {
    setWorkflowLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3000/api/projects/${projectId}/milestones/${milestoneId}/costs/${costId}/submit`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit cost');
      }

      alert('✅ Realisasi biaya berhasil diajukan untuk persetujuan');
      
      // Reload realizations to get updated status
      if (selectedItem?.id) {
        const data = await getRealizations(selectedItem.id);
        setRealizations(prev => ({ ...prev, [selectedItem.id]: data || [] }));
      }
    } catch (error) {
      console.error('Error submitting cost:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setWorkflowLoading(false);
    }
  };

  const handleApproveCost = async (costId) => {
    setWorkflowLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3000/api/projects/${projectId}/milestones/${milestoneId}/costs/${costId}/approve`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve cost');
      }

      alert('✅ Realisasi biaya telah disetujui');
      
      // Reload realizations to get updated status
      if (selectedItem?.id) {
        const data = await getRealizations(selectedItem.id);
        setRealizations(prev => ({ ...prev, [selectedItem.id]: data || [] }));
      }
    } catch (error) {
      console.error('Error approving cost:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setWorkflowLoading(false);
    }
  };

  const handleRejectCost = async (costId, reason) => {
    setWorkflowLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3000/api/projects/${projectId}/milestones/${milestoneId}/costs/${costId}/reject`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reason })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject cost');
      }

      alert('❌ Realisasi biaya telah ditolak');
      
      // Reload realizations to get updated status
      if (selectedItem?.id) {
        const data = await getRealizations(selectedItem.id);
        setRealizations(prev => ({ ...prev, [selectedItem.id]: data || [] }));
      }
    } catch (error) {
      console.error('Error rejecting cost:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setWorkflowLoading(false);
    }
  };

  // ========== PAYMENT EXECUTION ==========
  
  const handleOpenPaymentModal = (costId) => {
    // Find the cost/realization object
    const allRealizations = Object.values(realizations).flat();
    const cost = allRealizations.find(r => r.id === costId);
    
    if (!cost) {
      alert('Cost data not found');
      return;
    }
    
    if (cost.status !== 'approved') {
      alert('Only approved costs can be paid');
      return;
    }
    
    setSelectedCostForPayment(cost);
    setPaymentModalOpen(true);
  };

  const handleExecutePayment = async (costId, paymentData) => {
    setWorkflowLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3000/api/projects/${projectId}/milestones/${milestoneId}/costs/${costId}/execute-payment`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paymentData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to execute payment');
      }

      const result = await response.json();
      
      alert(`✅ Payment executed successfully!\nTransaction ID: ${result.transactionId}`);
      
      // Close modal
      setPaymentModalOpen(false);
      setSelectedCostForPayment(null);
      
      // Reload realizations to get updated status
      if (selectedItem?.id) {
        const data = await getRealizations(selectedItem.id);
        setRealizations(prev => ({ ...prev, [selectedItem.id]: data || [] }));
      }
    } catch (error) {
      console.error('Error executing payment:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setWorkflowLoading(false);
    }
  };

  // Cancel editing - Close Modal
  const handleCancelEdit = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setEditMode('add');
    setEditingRealizationId(null);
    setEditValue('');
    setEditDescription('');
    setEditAccount('');
    setEditSource('');
  };

  // Save actual cost - ADD NEW or UPDATE EXISTING
  const handleSaveActual = async () => {
    if (!selectedItem) return;
    
    if (!editValue || parseFloat(editValue) <= 0) {
      alert('Masukkan jumlah yang valid');
      return;
    }

    if (!editAccount) {
      alert('Pilih akun biaya (Expense Account)');
      return;
    }

    if (!editSource) {
      alert('Pilih sumber dana (Bank/Cash)');
      return;
    }

    try {
      setSaving(true);
      
      const token = localStorage.getItem('token');

      if (editMode === 'edit' && editingRealizationId) {
        // UPDATE existing realization
        const response = await fetch(`http://localhost:3000/api/realizations/${editingRealizationId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            actual_value: parseFloat(editValue),
            description: editDescription,
            expense_account_id: editAccount,
            source_account_id: editSource
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal update realisasi');
        }

        alert('Realisasi berhasil diupdate!');
      } else {
        // ADD NEW realization
        const realizationData = {
          amount: parseFloat(editValue),
          description: editDescription,
          accountId: editAccount,
          sourceAccountId: editSource,
          progress: 100 // Default 100% progress
        };

        await onAddRealization(selectedItem.id, realizationData);
        alert('Realisasi berhasil ditambahkan!');
      }
      
      // Reload realizations for this specific item
      if (selectedItem?.id) {
        const data = await getRealizations(selectedItem.id);
        setRealizations(prev => ({ ...prev, [selectedItem.id]: data || [] }));
      }
      
      handleCancelEdit();
    } catch (error) {
      console.error('Error saving realization:', error);
      alert(`Error: ${error.message || 'Gagal menyimpan data'}`);
    } finally {
      setSaving(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !saving) {
      e.preventDefault();
      handleSaveActual();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // Toggle expand realizations
  const toggleExpand = async (itemId) => {
    const isCurrentlyExpanded = expandedItems[itemId];

    // If expanding and realizations not loaded yet, fetch them
    if (!isCurrentlyExpanded && !realizations[itemId]) {
      try {
        const data = await getRealizations(itemId);
        setRealizations(prev => ({ ...prev, [itemId]: data || [] }));
      } catch (error) {
        console.error('Error loading realizations:', error);
        setRealizations(prev => ({ ...prev, [itemId]: [] }));
      }
    }

    // Toggle expanded state
    setExpandedItems(prev => ({ 
      ...prev, 
      [itemId]: !prev[itemId] 
    }));
  };

  // Calculate totals
  const totals = {
    planned: rabItems.reduce((sum, item) => sum + parseFloat(item.planned_amount || 0), 0),
    actual: rabItems.reduce((sum, item) => sum + parseFloat(item.actual_amount || 0), 0),
  };
  totals.variance = totals.planned - totals.actual;
  totals.variancePercent = totals.planned > 0 ? (totals.variance / totals.planned) * 100 : 0;

  if (!rabItems || rabItems.length === 0) {
    return null;
  }

  console.log('[SimplifiedRABTable] Render - modalOpen:', modalOpen, 'selectedItem:', selectedItem);

  return (
    <div className="space-y-4">
      {/* Add Realization Modal using Portal */}
      <Modal isOpen={modalOpen} onClose={handleCancelEdit}>
        {selectedItem && (
          <div className="bg-[#2C2C2E] rounded-xl border border-[#3C3C3E] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#3C3C3E]">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {editMode === 'edit' ? 'Edit Realization' : 'Add Actual Cost'}
                </h3>
                <p className="text-sm text-gray-400 mt-1">{selectedItem.description}</p>
              </div>
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="p-2 hover:bg-[#3C3C3E] rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Budget Info */}
              <div className="bg-[#1C1C1E] rounded-lg p-4 border border-[#3C3C3E]">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Budget (RAB)</div>
                    <div className="text-white font-semibold mt-1">
                      {formatCurrency(selectedItem.planned_amount || 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Already Spent</div>
                    <div className="text-blue-400 font-semibold mt-1">
                      {formatCurrency(selectedItem.actual_amount || 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Remaining</div>
                    <div className={`font-semibold mt-1 ${
                      ((selectedItem.planned_amount || 0) - (selectedItem.actual_amount || 0)) > 0 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {formatCurrency((selectedItem.planned_amount || 0) - (selectedItem.actual_amount || 0))}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Entries</div>
                    <div className="text-white font-semibold mt-1">
                      {selectedItem.realization_count || 0} entries
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="0"
                  autoFocus
                  className="w-full px-4 py-2.5 bg-[#1C1C1E] border border-[#3C3C3E] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Deskripsi realisasi biaya..."
                  className="w-full px-4 py-2.5 bg-[#1C1C1E] border border-[#3C3C3E] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Expense Account Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expense Account <span className="text-red-400">*</span>
                </label>
                <select
                  value={editAccount}
                  onChange={(e) => setEditAccount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#1C1C1E] border border-[#3C3C3E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select expense account...</option>
                  {expenseAccounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.accountCode} - {account.accountName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Source Account Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Source Account (Bank/Cash) <span className="text-red-400">*</span>
                </label>
                <select
                  value={editSource}
                  onChange={(e) => setEditSource(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#1C1C1E] border border-[#3C3C3E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select source account...</option>
                  {sourceAccounts.map(account => {
                    const isKasTunai = account.accountName?.toLowerCase().includes('kas tunai') || account.accountCode === '1101.07';
                    const displayLabel = isKasTunai 
                      ? `${account.accountCode} - ${account.accountName} (Unlimited)`
                      : `${account.accountCode} - ${account.accountName}`;
                    
                    return (
                      <option key={account.id} value={account.id}>
                        {displayLabel}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-[#3C3C3E]">
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="px-4 py-2 bg-[#3C3C3E] hover:bg-[#4C4C4E] text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveActual}
                disabled={saving || !editValue || !editAccount || !editSource}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Realization
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Table Container */}
      <div className="bg-[#2C2C2E] rounded-lg border border-[#3C3C3E] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-[#1C1C1E] border-b border-[#3C3C3E]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-[30%]">
                  Item RAB
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider w-[10%]">
                  Qty
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider w-[12%]">
                  Unit Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider w-[13%]">
                  Planned (RAB)
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-blue-400 uppercase tracking-wider w-[15%]">
                  Actual Cost
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider w-[12%]">
                  Variance
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider w-[8%]">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#3C3C3E]">
              {rabItems.map((item, index) => {
                const ItemIcon = itemTypeIcons[item.item_type] || Package;
                const variance = item.variance;
                const variancePercent = item.planned_amount > 0 
                  ? ((variance / item.planned_amount) * 100) 
                  : 0;
                const isUnderBudget = variance > 0;
                const isOverBudget = variance < 0;
                const isExpanded = expandedItems[item.id];
                const itemRealizations = realizations[item.id] || [];

                return (
                  <React.Fragment key={item.id}>
                    {/* Main Row */}
                    <tr className="hover:bg-[#3C3C3E]/30 transition-colors">
                      {/* Item */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-400/10 border border-blue-400/30 flex items-center justify-center">
                            <ItemIcon size={14} className="text-blue-400" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-white truncate">
                              {item.description}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {item.item_type}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="px-4 py-3 text-center">
                        <div className="text-sm text-white font-medium">
                          {parseFloat(item.quantity).toLocaleString('id-ID')}
                        </div>
                        <div className="text-xs text-gray-500">{item.unit}</div>
                      </td>

                      {/* Unit Price */}
                      <td className="px-4 py-3 text-right">
                        <div className="text-sm text-white">
                          {formatCurrency(item.unit_price)}
                        </div>
                      </td>

                      {/* Planned Amount */}
                      <td className="px-4 py-3 text-right">
                        <div className="text-sm font-semibold text-white">
                          {formatCurrency(item.planned_amount)}
                        </div>
                      </td>

                      {/* Actual Cost - Click to Open Modal */}
                      <td className="px-4 py-3 text-right">
                        {item.actual_amount > 0 ? (
                          <div>
                            <div className="text-sm font-semibold text-blue-400">
                              {formatCurrency(item.actual_amount)}
                            </div>
                            {item.realization_count > 0 && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                {item.realization_count} {item.realization_count === 1 ? 'entry' : 'entries'}
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="w-full px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm rounded-lg transition-colors border border-blue-500/30 hover:border-blue-500 flex items-center justify-center gap-2"
                          >
                            <Edit2 size={14} />
                            Add Cost
                          </button>
                        )}
                      </td>

                      {/* Variance */}
                      <td className="px-4 py-3 text-right">
                        {item.actual_amount > 0 ? (
                          <div>
                            <div className={`text-sm font-semibold flex items-center justify-end gap-1 ${
                              isUnderBudget ? 'text-green-400' : isOverBudget ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              {isUnderBudget && <TrendingDown size={14} />}
                              {isOverBudget && <TrendingUp size={14} />}
                              <span>{formatCurrency(Math.abs(variance))}</span>
                            </div>
                            <div className={`text-xs mt-0.5 ${
                              isUnderBudget ? 'text-green-400' : isOverBudget ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              {isUnderBudget ? '-' : '+'}{Math.abs(variancePercent).toFixed(1)}%
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">-</div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {item.actual_amount > 0 && (
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1.5 hover:bg-blue-500/20 rounded text-blue-400 transition-colors"
                              title="Add More Cost"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                          {item.realization_count > 0 && (
                            <button
                              onClick={() => toggleExpand(item.id)}
                              className="p-1.5 hover:bg-gray-500/20 rounded text-gray-400 transition-colors"
                              title="View Details"
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded: Realizations Detail */}
                    {isExpanded && (
                      <tr>
                        <td colSpan="7" className="px-4 py-3 bg-[#1C1C1E]">
                          <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                            Detail Realizations ({item.realization_count})
                          </div>

                          {itemRealizations.length > 0 ? (
                            <div className="space-y-2">
                              {itemRealizations.map((real, idx) => (
                                <div 
                                  key={real.id || idx}
                                  className="bg-[#2C2C2E] rounded p-3 border border-[#3C3C3E] hover:border-blue-500/30 transition-colors"
                                >
                                  <div className="flex items-center justify-between gap-4 text-xs">
                                    {/* Left: Amount and Details */}
                                    <div className="flex items-center gap-4 flex-1">
                                      <div className="font-semibold text-blue-400 min-w-[100px]">
                                        {formatCurrency(real.actual_value || real.amount)}
                                      </div>
                                      {real.recorded_at && (
                                        <div className="text-gray-500 min-w-[90px]">
                                          {formatDate(real.recorded_at)}
                                        </div>
                                      )}
                                      {real.description && (
                                        <div className="text-gray-400 flex-1">
                                          {real.description}
                                        </div>
                                      )}
                                      {real.expense_account_name && (
                                        <div className="text-yellow-400 min-w-[120px]">
                                          {real.expense_account_name}
                                        </div>
                                      )}
                                      {real.source_account_name && (
                                        <div className="text-purple-400 min-w-[120px]">
                                          {real.source_account_name}
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* Right: Status Badge and Actions */}
                                    <div className="flex items-center gap-2">
                                      {/* Status Badge */}
                                      <StatusBadge status={real.status || 'draft'} size="small" />
                                      
                                      {/* Edit & Delete Buttons (only if draft or rejected) */}
                                      {(real.status === 'draft' || real.status === 'rejected' || !real.status) && (
                                        <>
                                          <button
                                            onClick={() => handleEditRealization(item, real)}
                                            className="p-1.5 hover:bg-blue-500/20 rounded text-blue-400 transition-colors"
                                            title="Edit Realization"
                                          >
                                            <Edit2 size={13} />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteRealization(real.id)}
                                            className="p-1.5 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                                            title="Delete Realization"
                                          >
                                            <X size={13} />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Rejection Reason (if rejected) */}
                                  {real.status === 'rejected' && real.rejection_reason && (
                                    <div className="mt-2 p-2 bg-red-900/20 border border-red-500/30 rounded text-xs">
                                      <div className="text-red-400 font-semibold mb-1">Alasan Penolakan:</div>
                                      <div className="text-gray-300">{real.rejection_reason}</div>
                                    </div>
                                  )}
                                  
                                  {/* Action Buttons (Submit/Approve/Reject/Execute Payment) */}
                                  <div className="mt-2 flex justify-end">
                                    <ActionButtons
                                      cost={real}
                                      onSubmit={handleSubmitCost}
                                      onApprove={handleApproveCost}
                                      onReject={handleRejectCost}
                                      onExecutePayment={handleOpenPaymentModal}
                                      isManager={isManager}
                                      isFinance={isFinance}
                                      loading={workflowLoading}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-500 text-xs">
                              No realizations found
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>

            {/* Table Footer - Totals */}
            <tfoot className="bg-[#1C1C1E] border-t-2 border-blue-500/30">
              <tr>
                <td colSpan="3" className="px-4 py-3 text-left text-sm font-bold text-white uppercase">
                  Total
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-white">
                  {formatCurrency(totals.planned)}
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-blue-400">
                  {formatCurrency(totals.actual)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div>
                    <div className={`text-sm font-bold flex items-center justify-end gap-1 ${
                      totals.variance > 0 ? 'text-green-400' : totals.variance < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {totals.variance > 0 && <TrendingDown size={14} />}
                      {totals.variance < 0 && <TrendingUp size={14} />}
                      <span>{formatCurrency(Math.abs(totals.variance))}</span>
                    </div>
                    <div className={`text-xs mt-0.5 ${
                      totals.variance > 0 ? 'text-green-400' : totals.variance < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {totals.variance > 0 ? '-' : '+'}{Math.abs(totals.variancePercent).toFixed(1)}%
                    </div>
                  </div>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Info Footer */}
      <div className="bg-blue-400/5 border border-blue-400/20 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <AlertCircle size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-300">
            <span className="font-medium text-blue-400">Quick Entry:</span> Klik tombol "Add Cost" atau icon <Edit2 size={12} className="inline" /> untuk input realisasi biaya. 
            Klik <ChevronDown size={12} className="inline" /> untuk expand dan lihat detail transaksi. 
            Setiap transaksi bisa <span className="font-semibold text-green-400">diedit</span> atau <span className="font-semibold text-red-400">dihapus</span>. 
            Variance otomatis dihitung (hijau = hemat, merah = over budget). 
            Tekan <kbd className="px-1 py-0.5 bg-[#3C3C3E] rounded text-xs">Enter</kbd> untuk save cepat.
          </div>
        </div>
      </div>

      {/* Payment Execution Modal */}
      {paymentModalOpen && selectedCostForPayment && (
        <PaymentExecutionModal
          cost={selectedCostForPayment}
          onExecute={handleExecutePayment}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedCostForPayment(null);
          }}
          loading={workflowLoading}
        />
      )}
    </div>
  );
};

export default SimplifiedRABTable;
