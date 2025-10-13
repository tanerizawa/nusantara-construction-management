// Costs Tab - Cost tracking and budget management
import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, TrendingUp, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useMilestoneCosts } from '../hooks/useMilestoneCosts';
import { COST_CATEGORIES, COST_TYPES } from '../services/milestoneDetailAPI';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import api from '../../../services/api';

const CostsTab = ({ milestone, projectId }) => {
  const { costs, summary, loading, addCost, updateCost, deleteCost } = useMilestoneCosts(projectId, milestone.id);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCost, setEditingCost] = useState(null);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loadingPOs, setLoadingPOs] = useState(false);
  const [expenseAccounts, setExpenseAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [formData, setFormData] = useState({
    costCategory: 'materials',
    costType: 'actual',
    amount: '',
    description: '',
    referenceNumber: '',
    accountId: ''
  });

  // Fetch Purchase Orders when component mounts
  useEffect(() => {
    if (projectId) {
      fetchPurchaseOrders();
      fetchExpenseAccounts();
    }
  }, [projectId]);

  const fetchPurchaseOrders = async () => {
    try {
      setLoadingPOs(true);
      const response = await api.get(`/projects/${projectId}`);
      
      // Extract POs from project data
      if (response?.data?.purchaseOrders) {
        setPurchaseOrders(response.data.purchaseOrders);
        console.log('[CostsTab] Loaded POs:', response.data.purchaseOrders.length);
      } else {
        setPurchaseOrders([]);
      }
    } catch (error) {
      console.error('[CostsTab] Error fetching POs:', error);
      setPurchaseOrders([]);
    } finally {
      setLoadingPOs(false);
    }
  };

  const fetchExpenseAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      // Fetch EXPENSE type accounts from Chart of Accounts
      const response = await fetch(`${API_BASE_URL}/chart-of-accounts?account_type=EXPENSE&is_active=true`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch expense accounts');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // Filter for operational expense accounts (level >= 2)
        const accounts = result.data.filter(account => {
          return (
            account.accountType === 'EXPENSE' && 
            account.level >= 2 && 
            !account.isControlAccount
          );
        });
        
        console.log('[CostsTab] Loaded expense accounts:', accounts.length);
        setExpenseAccounts(accounts);
      }
    } catch (error) {
      console.error('[CostsTab] Error fetching expense accounts:', error);
      // Fallback: create default expense accounts if none exist
      setExpenseAccounts([]);
    } finally {
      setLoadingAccounts(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (editingCost) {
        await updateCost(editingCost.id, data);
        setEditingCost(null);
      } else {
        await addCost(data);
      }

      // Reset form
      setFormData({
        costCategory: 'materials',
        costType: 'actual',
        amount: '',
        description: '',
        referenceNumber: '',
        accountId: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to save cost:', error);
      alert('Failed to save cost entry');
    }
  };

  // Handle edit
  const handleEdit = (cost) => {
    setEditingCost(cost);
    setFormData({
      costCategory: cost.costCategory,
      costType: cost.costType,
      amount: cost.amount.toString(),
      description: cost.description || '',
      referenceNumber: cost.referenceNumber || '',
      accountId: cost.accountId || ''
    });
    setShowAddForm(true);
  };

  // Handle delete
  const handleDelete = async (costId) => {
    if (!window.confirm('Are you sure you want to delete this cost entry?')) return;
    try {
      await deleteCost(costId);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete cost entry');
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingCost(null);
    setFormData({
      costCategory: 'materials',
      costType: 'actual',
      amount: '',
      description: '',
      referenceNumber: '',
      accountId: ''
    });
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      materials: '#0A84FF',
      labor: '#30D158',
      equipment: '#FF9F0A',
      subcontractor: '#BF5AF2',
      contingency: '#FF453A',
      indirect: '#8E8E93',
      other: '#636366'
    };
    return colors[category] || '#636366';
  };

  // Get type badge
  const getTypeBadge = (type) => {
    const badges = {
      planned: { text: 'Planned', color: 'bg-[#0A84FF]/10 text-[#0A84FF]' },
      actual: { text: 'Actual', color: 'bg-[#30D158]/10 text-[#30D158]' },
      change_order: { text: 'Change Order', color: 'bg-[#FF9F0A]/10 text-[#FF9F0A]' },
      unforeseen: { text: 'Unforeseen', color: 'bg-[#FF453A]/10 text-[#FF453A]' }
    };
    return badges[type] || badges.actual;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Budget Summary */}
      {loading ? (
        <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
          <p className="text-sm text-[#8E8E93]">Loading summary...</p>
        </div>
      ) : summary ? (
        <div className="bg-[#2C2C2E] rounded-lg p-6 border border-[#38383A]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-[#0A84FF]" />
            <h3 className="font-semibold text-white text-lg">Budget Summary</h3>
          </div>

          {/* Main Numbers */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-[#8E8E93] mb-1">Milestone Budget</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(milestone.budget || 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#8E8E93] mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(summary.totalActual || 0)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#8E8E93]">Budget Usage</span>
              <span className="text-xs font-medium text-white">
                {milestone.budget > 0 
                  ? ((summary.totalActual || 0) / milestone.budget * 100).toFixed(1)
                  : '0.0'
                }%
              </span>
            </div>
            <div className="w-full bg-[#48484A] rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: milestone.budget > 0 
                    ? `${Math.min(((summary.totalActual || 0) / milestone.budget) * 100, 100)}%`
                    : '0%',
                  backgroundColor: summary.status === 'over_budget' ? '#FF453A' : '#30D158'
                }}
              />
            </div>
          </div>

          {/* Variance Alert */}
          {summary.variance !== undefined && summary.variance !== 0 && milestone.budget > 0 && (
            <div className={`flex items-start gap-3 p-3 rounded-lg ${
              summary.status === 'over_budget'
                ? 'bg-[#FF453A]/10 border border-[#FF453A]/30'
                : 'bg-[#30D158]/10 border border-[#30D158]/30'
            }`}>
              <AlertCircle 
                size={20} 
                className={summary.status === 'over_budget' ? 'text-[#FF453A]' : 'text-[#30D158]'}
              />
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  summary.status === 'over_budget' ? 'text-[#FF453A]' : 'text-[#30D158]'
                }`}>
                  {summary.status === 'over_budget' ? 'Over Budget!' : 'Under Budget'}
                </p>
                <p className="text-xs text-[#8E8E93] mt-1">
                  Variance: {summary.variance > 0 ? '+' : ''}{formatCurrency(Math.abs(summary.variance || 0))}
                  {' '}({((Math.abs(summary.variance || 0) / milestone.budget) * 100).toFixed(1)}%)
                </p>
              </div>
            </div>
          )}

          {/* Breakdown by Category */}
          {summary.breakdown && summary.breakdown.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#38383A]">
              <p className="text-xs font-medium text-[#8E8E93] mb-3">Cost Breakdown</p>
              <div className="space-y-2">
                {summary.breakdown.map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getCategoryColor(item.category) }}
                      />
                      <span className="text-xs text-white capitalize">
                        {item.category.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-white">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Add Cost Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white rounded-lg transition-colors font-medium"
        >
          <Plus size={18} />
          <span>Add Cost Entry</span>
        </button>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
          <h3 className="font-semibold text-white mb-4">
            {editingCost ? 'Edit Cost Entry' : 'Add New Cost Entry'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#8E8E93] mb-1">Category *</label>
                <select
                  value={formData.costCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, costCategory: e.target.value }))}
                  required
                  className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded text-sm text-white focus:border-[#0A84FF] focus:outline-none"
                >
                  {Object.entries(COST_CATEGORIES).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#8E8E93] mb-1">Type *</label>
                <select
                  value={formData.costType}
                  onChange={(e) => setFormData(prev => ({ ...prev, costType: e.target.value }))}
                  required
                  className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded text-sm text-white focus:border-[#0A84FF] focus:outline-none"
                >
                  {Object.entries(COST_TYPES).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#8E8E93] mb-1">Amount (Rp) *</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                required
                min="0"
                step="1000"
                placeholder="0"
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded text-sm text-white placeholder-[#636366] focus:border-[#0A84FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#8E8E93] mb-1">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={2}
                placeholder="What was this cost for?"
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded text-sm text-white placeholder-[#636366] focus:border-[#0A84FF] focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#8E8E93] mb-1">Reference Number (Optional)</label>
              <select
                value={formData.referenceNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, referenceNumber: e.target.value }))}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded text-sm text-white focus:border-[#0A84FF] focus:outline-none"
                disabled={loadingPOs}
              >
                <option value="">-- Select PO (Optional) --</option>
                {loadingPOs ? (
                  <option disabled>Loading POs...</option>
                ) : purchaseOrders.length === 0 ? (
                  <option disabled>No POs available</option>
                ) : (
                  purchaseOrders.map((po) => (
                    <option key={po.id || po.poNumber} value={po.poNumber}>
                      {po.poNumber} - {po.supplierName} - {formatCurrency(po.totalAmount)}
                    </option>
                  ))
                )}
              </select>
              {formData.referenceNumber && (
                <p className="text-xs text-[#8E8E93] mt-1">
                  Selected: {formData.referenceNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs text-[#8E8E93] mb-1">Sumber Dana *</label>
              <select
                value={formData.accountId}
                onChange={(e) => {
                  console.log('Account selected:', e.target.value);
                  setFormData(prev => ({ ...prev, accountId: e.target.value }));
                }}
                required
                className={`w-full px-3 py-2 bg-[#1C1C1E] border rounded text-sm text-white focus:border-[#0A84FF] focus:outline-none ${
                  !formData.accountId ? 'border-[#FF453A]' : 'border-[#38383A]'
                }`}
                disabled={loadingAccounts}
              >
                <option value="">
                  {loadingAccounts ? 'Loading accounts...' : '-- Pilih Sumber Dana --'}
                </option>
                
                {expenseAccounts.length > 0 ? (
                  expenseAccounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.accountCode} - {account.accountName}
                    </option>
                  ))
                ) : (
                  !loadingAccounts && <option disabled>No expense accounts found</option>
                )}
              </select>
              
              {!formData.accountId && (
                <p className="text-xs text-[#FF453A] mt-1">
                  Sumber dana wajib dipilih
                </p>
              )}
              
              {formData.accountId && expenseAccounts.length > 0 && (
                <p className="text-xs text-[#30D158] mt-1">
                  ✓ {expenseAccounts.find(a => a.id === formData.accountId)?.accountName}
                </p>
              )}
              
              {expenseAccounts.length > 0 && !formData.accountId && (
                <p className="text-xs text-[#8E8E93] mt-1">
                  {expenseAccounts.length} expense accounts available
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white rounded-lg transition-colors font-medium"
              >
                {editingCost ? 'Update' : 'Add'} Cost
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-[#48484A] hover:bg-[#48484A]/80 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cost Entries List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-white">Cost Entries ({costs.length})</h3>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-sm text-[#8E8E93]">Loading costs...</p>
          </div>
        ) : costs.length === 0 ? (
          <div className="text-center py-8 bg-[#2C2C2E] rounded-lg border border-[#38383A]">
            <DollarSign size={48} className="text-[#636366] mx-auto mb-3" />
            <p className="text-sm text-[#8E8E93]">No cost entries yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {costs.map((cost) => {
              const typeBadge = getTypeBadge(cost.costType);
              return (
                <div
                  key={cost.id}
                  className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A] hover:border-[#48484A] transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: getCategoryColor(cost.costCategory) }}
                        />
                        <span className="text-sm font-medium text-white capitalize">
                          {cost.costCategory.replace('_', ' ')}
                        </span>
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs ${typeBadge.color}`}>
                          {typeBadge.text}
                        </span>
                      </div>
                      <p className="text-xs text-[#8E8E93] mb-2">
                        {cost.description}
                      </p>
                      {cost.referenceNumber && (
                        <p className="text-xs text-[#636366]">
                          Ref: {cost.referenceNumber}
                        </p>
                      )}
                      <p className="text-xs text-[#636366] mt-1">
                        {formatDate(cost.recordedAt || cost.createdAt)}
                        {cost.recorder_name && ` • By: ${cost.recorder_name}`}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">
                          {formatCurrency(cost.amount)}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(cost)}
                          className="p-1.5 text-[#0A84FF] hover:bg-[#0A84FF]/10 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(cost.id)}
                          className="p-1.5 text-[#FF453A] hover:bg-[#FF453A]/10 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CostsTab;
