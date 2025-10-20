// Costs Tab - Cost tracking and budget management with RAB integration
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, DollarSign, TrendingUp, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useMilestoneCosts } from '../hooks/useMilestoneCosts';
import { useRABItems } from '../hooks/useRABItems';
import { COST_CATEGORIES, COST_TYPES } from '../services/milestoneDetailAPI';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import api from '../../../services/api';

// New RAB Integration Components
import EnhancedBudgetSummary from './costs/EnhancedBudgetSummary';
import RABItemsSection from './costs/RABItemsSection';
import AdditionalCostsSection from './costs/AdditionalCostsSection';

const CostsTab = ({ milestone, projectId }) => {
  const { costs, summary, loading, addCost, updateCost, deleteCost } = useMilestoneCosts(projectId, milestone.id);
  
  // NEW: RAB Items Hook
  const { 
    rabItems, 
    summary: rabSummary, 
    loading: loadingRAB, 
    getRealizations 
  } = useRABItems(projectId, milestone.id);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCost, setEditingCost] = useState(null);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loadingPOs, setLoadingPOs] = useState(false);
  const [expenseAccounts, setExpenseAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [sourceAccounts, setSourceAccounts] = useState([]);
  const [loadingSourceAccounts, setLoadingSourceAccounts] = useState(false);
  const [formData, setFormData] = useState({
    costCategory: 'materials',
    costType: 'actual',
    amount: '',
    description: '',
    referenceNumber: '',
    accountId: '',
    sourceAccountId: '',
    rabItemId: null,           // NEW: Link to RAB item
    rabItemProgress: 0         // NEW: Progress percentage
  });

  // Fetch Purchase Orders when component mounts
  useEffect(() => {
    if (projectId) {
      fetchPurchaseOrders();
      fetchExpenseAccounts();
      fetchSourceAccounts();
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
      const response = await fetch(`${API_BASE_URL}/chart-of-accounts?account_type=EXPENSE&is_active=true`, {
        credentials: 'include'
      });
      
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
      setExpenseAccounts([]);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const fetchSourceAccounts = async () => {
    try {
      setLoadingSourceAccounts(true);
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      // Fetch bank and cash accounts (ASSET type, CASH_AND_BANK subtype)
      const response = await fetch(`${API_BASE_URL}/chart-of-accounts?account_type=ASSET&is_active=true`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch source accounts');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // Filter for CASH_AND_BANK accounts (level >= 3 for actual bank/cash accounts)
        const accounts = result.data.filter(account => {
          return (
            account.accountType === 'ASSET' && 
            account.accountSubType === 'CASH_AND_BANK' &&
            account.level >= 3 && 
            !account.isControlAccount
          );
        });
        
        console.log('[CostsTab] Loaded source accounts (bank/cash):', accounts.length);
        setSourceAccounts(accounts);
      }
    } catch (error) {
      console.error('[CostsTab] Error fetching source accounts:', error);
      setSourceAccounts([]);
    } finally {
      setLoadingSourceAccounts(false);
    }
  };

  // NEW: Calculate total additional costs (non-RAB)
  const additionalCostsTotal = useMemo(() => {
    return costs
      .filter(cost => !cost.rabItemId && !cost.rab_item_id)
      .reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0);
  }, [costs]);

  // NEW: Auto-fill form from RAB item
  const handleAddRealizationFromRAB = (rabItem) => {
    // Map RAB item_type to cost_category
    const itemTypeToCategory = {
      'material': 'materials',
      'service': 'labor',
      'equipment': 'equipment',
      'subcontractor': 'subcontractor'
    };

    setFormData({
      costCategory: itemTypeToCategory[rabItem.item_type] || 'other',
      costType: 'actual',
      amount: rabItem.planned_amount.toString(),
      description: `Realisasi: ${rabItem.description}`,
      referenceNumber: '',
      accountId: '',
      sourceAccountId: '',
      rabItemId: rabItem.id,
      rabItemProgress: rabItem.actual_amount > 0 ? 100 : 100  // Default to 100% if adding realization
    });
    setShowAddForm(true);
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

      // Refresh source accounts to get updated balances
      await fetchSourceAccounts();
      console.log('[CostsTab] Balances refreshed after transaction');

      // Reset form
      setFormData({
        costCategory: 'materials',
        costType: 'actual',
        amount: '',
        description: '',
        referenceNumber: '',
        accountId: '',
        sourceAccountId: '',
        rabItemId: null,
        rabItemProgress: 0
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to save cost:', error);
      
      // Show error message from backend if available
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to save cost entry');
      }
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
      accountId: cost.accountId || '',
      sourceAccountId: cost.sourceAccountId || '',
      rabItemId: cost.rabItemId || cost.rab_item_id || null,
      rabItemProgress: cost.rabItemProgress || cost.rab_item_progress || 0
    });
    setShowAddForm(true);
  };

  // Handle delete
  const handleDelete = async (costId) => {
    if (!window.confirm('Are you sure you want to delete this cost entry?')) return;
    try {
      await deleteCost(costId);
      
      // Refresh source accounts to get updated balances (restored after delete)
      await fetchSourceAccounts();
      console.log('[CostsTab] Balances refreshed after deletion');
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
      accountId: '',
      sourceAccountId: '',
      rabItemId: null,
      rabItemProgress: 0
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
      {/* Enhanced Budget Summary with RAB Integration */}
      {loading || loadingRAB ? (
        <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
          <p className="text-sm text-[#8E8E93]">Loading summary...</p>
        </div>
      ) : (
        <EnhancedBudgetSummary 
          milestone={milestone}
          rabSummary={rabSummary}
          additionalCosts={additionalCostsTotal}
        />
      )}

      {/* RAB Items Section (if milestone has RAB link) */}
      {!loadingRAB && rabItems && rabItems.length > 0 && (
        <RABItemsSection
          rabItems={rabItems}
          onAddRealization={handleAddRealizationFromRAB}
          getRealizations={getRealizations}
        />
      )}

      {/* Additional Costs Section (Non-RAB costs) */}
      <AdditionalCostsSection
        costs={costs}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={() => {
          setFormData({
            costCategory: 'materials',
            costType: 'actual',
            amount: '',
            description: '',
            referenceNumber: '',
            accountId: '',
            sourceAccountId: '',
            rabItemId: null,
            rabItemProgress: 0
          });
          setShowAddForm(true);
        }}
      />

      {/* Add Cost Button (old - keep for now for manual additional costs) */}
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

            {/* Jenis Pengeluaran (Expense Account) */}
            <div>
              <label className="block text-xs text-[#8E8E93] mb-1">Jenis Pengeluaran *</label>
              <select
                value={formData.accountId}
                onChange={(e) => {
                  console.log('Expense account selected:', e.target.value);
                  setFormData(prev => ({ ...prev, accountId: e.target.value }));
                }}
                required
                className={`w-full px-3 py-2 bg-[#1C1C1E] border rounded text-sm text-white focus:border-[#0A84FF] focus:outline-none ${
                  !formData.accountId ? 'border-[#FF453A]' : 'border-[#38383A]'
                }`}
                disabled={loadingAccounts}
              >
                <option value="">
                  {loadingAccounts ? 'Loading...' : '-- Pilih Jenis Pengeluaran --'}
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
                  Jenis pengeluaran wajib dipilih
                </p>
              )}
              
              {formData.accountId && expenseAccounts.length > 0 && (
                <p className="text-xs text-[#30D158] mt-1">
                  ✓ {expenseAccounts.find(a => a.id === formData.accountId)?.accountName}
                </p>
              )}
            </div>

            {/* Sumber Dana (Bank/Cash Source) */}
            <div>
              <label className="block text-xs text-[#8E8E93] mb-1">Sumber Dana (Bank/Kas) *</label>
              <select
                value={formData.sourceAccountId}
                onChange={(e) => {
                  console.log('Source account selected:', e.target.value);
                  setFormData(prev => ({ ...prev, sourceAccountId: e.target.value }));
                }}
                required
                className={`w-full px-3 py-2 bg-[#1C1C1E] border rounded text-sm text-white focus:border-[#0A84FF] focus:outline-none ${
                  !formData.sourceAccountId ? 'border-[#FF453A]' : 'border-[#38383A]'
                }`}
                disabled={loadingSourceAccounts}
              >
                <option value="">
                  {loadingSourceAccounts ? 'Loading...' : '-- Pilih Sumber Dana --'}
                </option>
                
                {sourceAccounts.length > 0 ? (
                  sourceAccounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.accountCode} - {account.accountName}
                      {account.currentBalance !== undefined && account.currentBalance !== null 
                        ? ` (Saldo: ${formatCurrency(account.currentBalance)})`
                        : ''
                      }
                    </option>
                  ))
                ) : (
                  !loadingSourceAccounts && <option disabled>No bank/cash accounts found</option>
                )}
              </select>
              
              {!formData.sourceAccountId && (
                <p className="text-xs text-[#FF453A] mt-1">
                  Sumber dana pembayaran wajib dipilih
                </p>
              )}
              
              {formData.sourceAccountId && sourceAccounts.length > 0 && (
                <p className="text-xs text-[#30D158] mt-1">
                  ✓ {sourceAccounts.find(a => a.id === formData.sourceAccountId)?.accountName}
                  {(() => {
                    const selectedAccount = sourceAccounts.find(a => a.id === formData.sourceAccountId);
                    const balance = selectedAccount?.currentBalance;
                    const amount = parseFloat(formData.amount) || 0;
                    
                    if (balance !== undefined && balance !== null) {
                      if (amount > balance) {
                        return <span className="text-[#FF453A]"> - ⚠️ Saldo tidak cukup! (Saldo: {formatCurrency(balance)})</span>;
                      } else {
                        return <span className="text-[#8E8E93]"> - Saldo: {formatCurrency(balance)}</span>;
                      }
                    }
                    return null;
                  })()}
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
    </div>
  );
};

export default CostsTab;
