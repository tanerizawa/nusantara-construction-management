// Costs Tab - Cost tracking and budget management with RAB integration
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, DollarSign, TrendingUp, Edit, Trash2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useMilestoneCosts } from '../hooks/useMilestoneCosts';
import { useRABItems } from '../hooks/useRABItems';
import { COST_CATEGORIES, COST_TYPES } from '../services/milestoneDetailAPI';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import api from '../../../services/api';

// New RAB Integration Components
import EnhancedBudgetSummary from './costs/EnhancedBudgetSummary';
import SimplifiedRABTable from './costs/SimplifiedRABTable';
import AdditionalCostsSection from './costs/AdditionalCostsSection';

const CostsTab = ({ milestone, projectId }) => {
  const { costs, summary, loading, addCost, updateCost, deleteCost } = useMilestoneCosts(projectId, milestone.id);
  
  // NEW: RAB Items Hook
  const { 
    rabItems, 
    summary: rabSummary, 
    loading: loadingRAB, 
    getRealizations,
    refresh: refreshRABItems,
    fallbackUnapproved
  } = useRABItems(projectId, milestone.id);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCost, setEditingCost] = useState(null);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loadingPOs, setLoadingPOs] = useState(false);
  const [expenseAccounts, setExpenseAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [sourceAccounts, setSourceAccounts] = useState([]);
  const [loadingSourceAccounts, setLoadingSourceAccounts] = useState(false);
  const [additionalCostsExpanded, setAdditionalCostsExpanded] = useState(false);
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

  // Debug: Log RAB items state
  useEffect(() => {
    console.log('[CostsTab] RAB Items state updated:', {
      loadingRAB,
      rabItemsLength: rabItems?.length,
      rabItems: rabItems,
      hasRabItems: rabItems && rabItems.length > 0,
      willRender: !loadingRAB && rabItems && rabItems.length > 0
    });
  }, [rabItems, loadingRAB]);

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
      
      console.log('[CostsTab] 🔄 Fetching expense accounts...');
      
      // Fetch EXPENSE type accounts from Chart of Accounts (transactional only)
      const response = await api.get('/chart-of-accounts', {
        params: {
          account_type: 'EXPENSE',
          is_active: true,
          transactional_only: true  // Only show transactional accounts (no parent/control accounts)
        }
      });
      
      console.log('[CostsTab] 📡 Expense accounts response:', response.data);
      
      // Handle both response formats: {success: true, data: [...]} or direct array
      let accountsData = [];
      
      if (Array.isArray(response.data)) {
        // Direct array response
        accountsData = response.data;
        console.log('[CostsTab] 📦 Direct array format detected');
      } else if (response.data.success && response.data.data) {
        // Wrapped response format
        accountsData = response.data.data;
        console.log('[CostsTab] 📦 Wrapped format detected');
      }
      
      if (accountsData.length > 0) {
        // Filter for operational expense accounts (level >= 2)
        const accounts = accountsData.filter(account => {
          return (
            account.accountType === 'EXPENSE' && 
            account.level >= 2 && 
            !account.isControlAccount
          );
        });
        
        console.log('[CostsTab] ✅ Loaded expense accounts:', {
          totalFromAPI: accountsData.length,
          filteredCount: accounts.length,
          accounts: accounts
        });
        setExpenseAccounts(accounts);
      } else {
        console.warn('[CostsTab] ⚠️ No accounts data found:', response.data);
        setExpenseAccounts([]);
      }
    } catch (error) {
      console.error('[CostsTab] ❌ Error fetching expense accounts:', error);
      setExpenseAccounts([]);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const fetchSourceAccounts = async () => {
    try {
      setLoadingSourceAccounts(true);
      
      console.log('[CostsTab] 🔄 Fetching source accounts (bank/cash)...');
      
      // Fetch bank and cash accounts (ASSET type, CASH_AND_BANK subtype)
      const response = await api.get('/chart-of-accounts', {
        params: {
          account_type: 'ASSET',
          is_active: true
        }
      });
      
      console.log('[CostsTab] 📡 Source accounts response:', response.data);
      
      // Handle both response formats: {success: true, data: [...]} or direct array
      let accountsData = [];
      
      if (Array.isArray(response.data)) {
        // Direct array response
        accountsData = response.data;
        console.log('[CostsTab] 📦 Direct array format detected');
      } else if (response.data.success && response.data.data) {
        // Wrapped response format
        accountsData = response.data.data;
        console.log('[CostsTab] 📦 Wrapped format detected');
      }
      
      if (accountsData.length > 0) {
        // Filter for CASH_AND_BANK accounts
        // More flexible filter: check subType OR account code pattern (110x)
        const accounts = accountsData.filter(account => {
          const isAsset = account.accountType === 'ASSET';
          const isCashBank = account.accountSubType === 'CASH_AND_BANK';
          const hasValidLevel = account.level >= 3;
          const notControl = !account.isControlAccount;
          
          // Also check account code pattern: 110x.xx (cash/bank codes)
          const accountCode = account.accountCode || '';
          const isCashBankCode = accountCode.startsWith('1101.') || // Detail accounts like 1101.01
                                accountCode.startsWith('110') && accountCode.includes('.'); // Any 110x.xx
          
          // Must have decimal point in code (means it's a detail account, not parent)
          const isDetailAccount = accountCode.includes('.');
          
          return isAsset && (isCashBank || isCashBankCode) && hasValidLevel && notControl && isDetailAccount;
        });
        
        console.log('[CostsTab] ✅ Loaded source accounts (bank/cash):', {
          totalFromAPI: accountsData.length,
          filteredCount: accounts.length,
          sampleAccount: accounts[0],
          accounts: accounts.map(a => ({ 
            code: a.accountCode, 
            name: a.accountName,
            subType: a.accountSubType,
            level: a.level,
            isControl: a.isControlAccount
          }))
        });
        setSourceAccounts(accounts);
      } else {
        console.warn('[CostsTab] ⚠️ No accounts data found:', response.data);
        setSourceAccounts([]);
      }
    } catch (error) {
      console.error('[CostsTab] ❌ Error fetching source accounts:', error);
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
    console.log('[CostsTab] 🎯 Add Realization clicked for RAB item:', rabItem);
    
    // Map RAB item_type to cost_category
    const itemTypeToCategory = {
      'material': 'materials',
      'service': 'labor',
      'equipment': 'equipment',
      'subcontractor': 'subcontractor'
    };

    const newFormData = {
      costCategory: itemTypeToCategory[rabItem.item_type] || 'other',
      costType: 'actual',
      amount: rabItem.planned_amount.toString(),
      description: `Realisasi: ${rabItem.description}`,
      referenceNumber: '',
      accountId: '',
      sourceAccountId: '',
      rabItemId: rabItem.id,
      rabItemProgress: rabItem.actual_amount > 0 ? 100 : 100  // Default to 100% if adding realization
    };
    
    console.log('[CostsTab] 📝 Form data prepared:', newFormData);
    setFormData(newFormData);
    setShowAddForm(true);
  };

  // Handle inline realization submit from RABItemCard
  const handleSubmitInlineRealization = async (rabItemId, inlineFormData) => {
    console.log('[CostsTab] 🚀 Inline realization submit for RAB item:', rabItemId);
    console.log('[CostsTab] 📦 Inline form data:', inlineFormData);
    
    try {
      // Map RAB item to get category
      const rabItem = rabItems.find(item => item.id === rabItemId);
      const itemTypeToCategory = {
        'material': 'materials',
        'service': 'labor',
        'equipment': 'equipment',
        'subcontractor': 'subcontractor'
      };

      const data = {
        costCategory: itemTypeToCategory[rabItem?.item_type] || 'other',
        costType: 'actual',
        amount: parseFloat(inlineFormData.amount),
        description: inlineFormData.description,
        referenceNumber: '',
        accountId: inlineFormData.accountId,
        sourceAccountId: inlineFormData.sourceAccountId,
        rabItemId: rabItemId,
        rabItemProgress: parseFloat(inlineFormData.progress) || 0
      };
      
      console.log('[CostsTab] 📤 Sending inline realization data:', data);
      
      const result = await addCost(data);
      console.log('[CostsTab] ✅ Inline realization added:', result);
      
      // Refresh source accounts and RAB items to update actual amounts
      await fetchSourceAccounts();
      await refreshRABItems();
      
      return result;
    } catch (error) {
      console.error('[CostsTab] ❌ Failed to save inline realization:', error);
      throw error;
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('[CostsTab] 🚀 Form submitted!');
    console.log('[CostsTab] 📦 Form data:', formData);
    
    // Client-side validation for balance (only for bank accounts, not cash)
    if (formData.sourceAccountId) {
      const selectedAccount = sourceAccounts.find(a => a.id === formData.sourceAccountId);
      
      if (selectedAccount) {
        // Check if it's Kas Tunai (owner's unlimited cash - no validation needed)
        const isKasTunai = selectedAccount.accountName.toLowerCase().includes('kas tunai') ||
                          selectedAccount.accountCode === '1101.07';
        
        if (isKasTunai) {
          console.log('[CostsTab] ✓ Kas Tunai (Owner Capital) - UNLIMITED, skipping all validation');
          // Skip all validation for Kas Tunai - treat as unlimited owner's capital
        } else {
          // For other accounts (bank or kas kecil)
          const isKasKecil = selectedAccount.accountName.toLowerCase().includes('kas kecil') ||
                            selectedAccount.accountCode === '1101.08';
          
          if (!isKasKecil) {
            // Regular bank account - validate balance
            const balance = parseFloat(selectedAccount.currentBalance || 0);
            const amount = parseFloat(formData.amount || 0);
            
            if (amount > balance) {
              alert(`Saldo tidak cukup di ${selectedAccount.accountName}!\nTersedia: ${formatCurrency(balance)}\nDibutuhkan: ${formatCurrency(amount)}`);
              return; // Stop submission
            }
            console.log('[CostsTab] ✓ Bank account - balance sufficient');
          } else {
            console.log('[CostsTab] ✓ Kas Kecil - skipping balance validation');
          }
        }
      }
    } else {
      console.log('[CostsTab] ✓ No source (Owner Personal Cash) - unlimited, no validation');
    }
    
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      console.log('[CostsTab] 📤 Sending data:', data);

      if (editingCost) {
        await updateCost(editingCost.id, data);
        console.log('[CostsTab] ✅ Cost updated');
        setEditingCost(null);
      } else {
        const result = await addCost(data);
        console.log('[CostsTab] ✅ Cost added:', result);
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
      console.error('[CostsTab] ❌ Failed to save cost:', error);
      console.error('[CostsTab] ❌ Error response:', error.response?.data);
      
      // Show error message from backend if available
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Failed to save cost entry: ' + error.message);
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

      {/* Info: RAB Link Not Configured */}
      {!loadingRAB && (!rabItems || rabItems.length === 0) && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-400 mb-1">
                RAB Tracking Belum Diaktifkan
              </h4>
              <p className="text-sm text-gray-300 mb-2">
                Milestone ini belum di-link ke kategori RAB. Untuk melacak actual cost dari item-item RAB secara otomatis:
              </p>
              <ol className="text-sm text-gray-300 space-y-1 ml-4 list-decimal">
                <li>Klik tombol <span className="font-mono text-blue-400">Edit</span> pada milestone ini</li>
                <li>Pilih kategori RAB yang sesuai di bagian <span className="font-semibold text-blue-400">RAB Link</span></li>
                <li>Simpan perubahan</li>
              </ol>
              <p className="text-xs text-gray-400 mt-2">
                💡 Dengan RAB link, Anda dapat mencatat actual cost per item RAB dan sistem akan otomatis menghitung variance (selisih anggaran vs realisasi).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RAB Items Section (if milestone has RAB link) */}
      {!loadingRAB && rabItems && rabItems.length > 0 && (
        <div className="space-y-4">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white flex items-center gap-2 text-lg">
              <DollarSign size={20} className="text-blue-400" />
              RAB Tracking (Planned vs Actual)
              <span className="ml-1 px-2 py-0.5 bg-blue-400/10 border border-blue-400/30 rounded-full text-xs text-blue-400 font-medium">
                {rabItems.length} items
              </span>
            </h3>
          </div>

          {/* Simplified RAB Table with Inline Edit */}
          {fallbackUnapproved && (
            <div className="mb-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded text-sm text-yellow-300">
              Warning: No approved RAB items were found for the linked category — showing draft/unapproved items so you can record actual costs. Please review RAB approval status when ready.
            </div>
          )}

          <SimplifiedRABTable
            rabItems={rabItems}
            onAddRealization={handleSubmitInlineRealization}
            getRealizations={getRealizations}
            expenseAccounts={expenseAccounts}
            sourceAccounts={sourceAccounts}
            onSubmitRealization={handleSubmitInlineRealization}
            projectId={projectId}
            milestoneId={milestone.id}
            isManager={false} // TODO: Get from user context/auth
            isFinance={false} // TODO: Get from user context/auth
          />
        </div>
      )}

      {/* Additional Costs Section (Non-RAB costs) - COLLAPSIBLE */}
      <div className="space-y-3">
        {/* Collapsible Header */}
        <button
          onClick={() => setAdditionalCostsExpanded(!additionalCostsExpanded)}
          className="w-full flex items-center justify-between p-4 bg-[#2C2C2E] hover:bg-[#3C3C3E] rounded-lg border border-[#3C3C3E] transition-colors"
        >
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-purple-400" />
            <h3 className="font-semibold text-white">
              Additional Costs (Diluar RAB)
            </h3>
            {costs.filter(cost => {
              const hasRABLink = cost.rabItemId || cost.rab_item_id || cost.rabItem || cost.rab_item;
              return !hasRABLink;
            }).length > 0 && (
              <span className="px-2 py-0.5 bg-purple-400/10 border border-purple-400/30 rounded-full text-xs text-purple-400 font-medium">
                {costs.filter(cost => {
                  const hasRABLink = cost.rabItemId || cost.rab_item_id || cost.rabItem || cost.rab_item;
                  return !hasRABLink;
                }).length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Kasbon, overhead, biaya tak terduga</span>
            {additionalCostsExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </div>
        </button>

        {/* Collapsible Content */}
        {additionalCostsExpanded && (
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
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">
              {editingCost ? 'Edit Cost Entry' : 'Add New Cost Entry'}
            </h3>
            {/* RAB-Linked Indicator */}
            {formData.rabItemId && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-400/10 border border-blue-400/30 rounded-full">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                <span className="text-xs font-medium text-blue-400">RAB Linked</span>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* RAB Item Info (if linked) */}
            {formData.rabItemId && (
              <div className="p-3 bg-blue-400/5 border border-blue-400/20 rounded-lg mb-3">
                <div className="text-xs text-blue-400 font-medium mb-1">
                  📋 Realisasi dari RAB Item
                </div>
                <div className="text-xs text-gray-300">
                  Cost ini akan tercatat sebagai realisasi dari item RAB. 
                  Variance akan otomatis dihitung berdasarkan planned amount.
                </div>
              </div>
            )}

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
              <label className="block text-xs text-[#8E8E93] mb-1">Sumber Dana (Bank/Kas)</label>
              <select
                value={formData.sourceAccountId}
                onChange={(e) => {
                  console.log('Source account selected:', e.target.value);
                  setFormData(prev => ({ ...prev, sourceAccountId: e.target.value }));
                }}
                className={`w-full px-3 py-2 bg-[#1C1C1E] border rounded text-sm text-white focus:border-[#0A84FF] focus:outline-none ${
                  'border-[#38383A]'
                }`}
                disabled={loadingSourceAccounts}
              >
                <option value="">
                  {loadingSourceAccounts ? 'Loading...' : '� Uang Pribadi Owner (Unlimited)'}
                </option>
                
                {sourceAccounts.length > 0 && (
                  sourceAccounts.map(account => {
                    // Check if account is Kas Tunai (unlimited owner cash)
                    const isKasTunai = account.accountName.toLowerCase().includes('kas tunai') ||
                                      account.accountCode === '1101.07';
                    
                    // Check if account is Kas Kecil (petty cash)
                    const isKasKecil = account.accountName.toLowerCase().includes('kas kecil') ||
                                      account.accountCode === '1101.08';
                    
                    // Regular bank account
                    const isBank = !isKasTunai && !isKasKecil;
                    
                    return (
                      <option key={account.id} value={account.id}>
                        {account.accountCode} - {account.accountName}
                        {isKasTunai && ' (Unlimited - Modal Owner)'}
                        {isBank && account.currentBalance !== undefined && account.currentBalance !== null 
                          ? ` (Saldo: ${formatCurrency(account.currentBalance)})`
                          : ''
                        }
                      </option>
                    );
                  })
                )}
              </select>
              
              {formData.sourceAccountId && sourceAccounts.length > 0 && (() => {
                const selectedAccount = sourceAccounts.find(a => a.id === formData.sourceAccountId);
                
                if (!selectedAccount) return null;
                
                // Check if Kas Tunai (unlimited owner capital)
                const isKasTunai = selectedAccount.accountName.toLowerCase().includes('kas tunai') ||
                                  selectedAccount.accountCode === '1101.07';
                
                // Check if Kas Kecil
                const isKasKecil = selectedAccount.accountName.toLowerCase().includes('kas kecil') ||
                                  selectedAccount.accountCode === '1101.08';
                
                const balance = selectedAccount?.currentBalance;
                const amount = parseFloat(formData.amount) || 0;
                
                // For Kas Tunai - show unlimited message
                if (isKasTunai) {
                  return (
                    <p className="text-xs text-[#30D158] mt-1">
                      ✓ {selectedAccount.accountName} - <strong>Unlimited (Modal Owner)</strong>
                      <br />
                      <span className="text-[#8E8E93]">💡 Transaksi tercatat sebagai injeksi modal pemilik</span>
                    </p>
                  );
                }
                
                // For Kas Kecil - show no validation message
                if (isKasKecil) {
                  return (
                    <p className="text-xs text-[#30D158] mt-1">
                      ✓ {selectedAccount.accountName}
                    </p>
                  );
                }
                
                // For bank accounts - show balance and validation
                if (balance !== undefined && balance !== null) {
                  if (amount > balance) {
                    return (
                      <p className="text-xs text-[#FF453A] mt-1">
                        ⚠️ Saldo tidak cukup! (Tersedia: {formatCurrency(balance)})
                      </p>
                    );
                  } else {
                    return (
                      <p className="text-xs text-[#30D158] mt-1">
                        ✓ {selectedAccount.accountName} - Saldo: {formatCurrency(balance)}
                      </p>
                    );
                  }
                }
                
                return null;
              })()}
              
              {!formData.sourceAccountId && (
                <p className="text-xs text-[#8E8E93] mt-1">
                  � Pilih sumber dana atau biarkan kosong untuk uang pribadi owner
                  <br />
                  <span className="text-[#30D158]">✓ Unlimited - tidak ada batasan saldo</span>
                </p>
              )}
            </div>

            {/* RAB Progress Field (only show if RAB-linked) */}
            {formData.rabItemId && (
              <div>
                <label className="block text-xs text-[#8E8E93] mb-1">
                  Progress (%) <span className="text-[#FF453A]">*</span>
                </label>
                <input
                  type="number"
                  value={formData.rabItemProgress || 0}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    rabItemProgress: Math.min(100, Math.max(0, parseFloat(e.target.value) || 0))
                  }))}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded text-sm text-white focus:border-[#0A84FF] focus:outline-none"
                  placeholder="0.00"
                />
                <p className="text-xs text-[#8E8E93] mt-1">
                  Progress realisasi item RAB (0-100%)
                </p>
              </div>
            )}

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
