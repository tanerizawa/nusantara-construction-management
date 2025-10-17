import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

// Hooks
import { useChartOfAccounts } from './hooks/useChartOfAccounts';
import { useAccountForm } from './hooks/useAccountForm';

// Components
import ChartOfAccountsHeader from './components/ChartOfAccountsHeader';
import AccountSummaryPanel from './components/AccountSummaryPanel';
import AccountFilters from './components/AccountFilters';
import AccountTree from './components/AccountTree';
import AccountStatistics from './components/AccountStatistics';
import AddAccountModal from './components/AddAccountModal';
import InlineSubsidiaryPanel from './components/InlineSubsidiaryPanel';

// Utils
import { exportAccountsToCSV } from './utils/accountExport';

// Services
import { getAccountById, updateAccount, deleteAccount } from './services/accountService';
import { fetchSubsidiaries } from './services/subsidiaryService';

// Config
import { CHART_OF_ACCOUNTS_CONFIG } from './config/chartOfAccountsConfig';

const { colors } = CHART_OF_ACCOUNTS_CONFIG;

const ChartOfAccounts = () => {
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  
  // INLINE approach - no modals, expand in place
  const [expandedAccountId, setExpandedAccountId] = useState(null); // Which account detail is shown
  const [editingAccountId, setEditingAccountId] = useState(null); // Which account is being edited
  const [selectedAccount, setSelectedAccount] = useState(null); // Current account data
  const [deleteConfirmId, setDeleteConfirmId] = useState(null); // Show delete confirmation
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSubsidiaryPanel, setShowSubsidiaryPanel] = useState(false); // NEW: Inline subsidiary panel
  
  // Main data hook
  const {
    accounts,
    allAccounts,
    totalBalances,
    lastUpdate,
    loading,
    error,
    refreshing,
    handleRefresh,
    handleAccountCreated,
    expandedNodes,
    toggleNode,
    filteredAccounts,
    searchTerm,
    filterType,
    handleSearchChange,
    handleFilterTypeChange,
    clearAllFilters,
    getFilterStats
  } = useChartOfAccounts();

  // Account form hook
  const accountForm = useAccountForm(allAccounts || accounts, (result) => {
    setShowAddAccountModal(false);
    handleAccountCreated();
  });
  
  // Edit form hook
  const editForm = useAccountForm(allAccounts || accounts, (result) => {
    setShowEditModal(false);
    handleAccountCreated();
  });

  // Subsidiary modal hook
  const subsidiaryModal = useSubsidiaryModal();
  
  // Handle subsidiary panel toggle
  const handleToggleSubsidiaryPanel = () => {
    const newState = !showSubsidiaryPanel;
    setShowSubsidiaryPanel(newState);
    
    // Load subsidiaries when opening panel
    if (newState && subsidiaryModal.subsidiaries.length === 0) {
      console.log('📊 Loading subsidiaries...');
      subsidiaryModal.openModal(); // This loads the data
    }
  };

  // Handle export
  const handleExport = () => {
    const result = exportAccountsToCSV(accounts);
    if (!result.success) {
      alert(result.error);
    }
  };

  // Handle add account
  const handleAddAccount = () => {
    accountForm.resetForm();
    setShowAddAccountModal(true);
  };

  // Handle close add account modal
  const handleCloseAddAccountModal = () => {
    setShowAddAccountModal(false);
    accountForm.resetForm();
  };
  
  // Handle view detail - INLINE approach
  const handleViewDetail = async (account) => {
    console.log('🔍 VIEW DETAIL clicked for account:', account.id, account.accountName);
    try {
      // If clicking same account, collapse it
      if (expandedAccountId === account.id) {
        setExpandedAccountId(null);
        setSelectedAccount(null);
        return;
      }
      
      // Load fresh data from API
      const result = await getAccountById(account.id);
      if (result.success) {
        console.log('✅ Loaded account data:', result.data);
        setSelectedAccount(result.data);
        setExpandedAccountId(account.id);
        setEditingAccountId(null); // Close edit if open
      } else {
        alert('Failed to load account details: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error loading account:', error);
      alert('Failed to load account details');
    }
  };
  
  // Handle edit account - INLINE approach
  const handleEdit = async (account) => {
    console.log('✏️ EDIT clicked for account:', account.id, account.accountName);
    try {
      // If clicking same account, collapse it
      if (editingAccountId === account.id) {
        setEditingAccountId(null);
        setSelectedAccount(null);
        editForm.resetForm();
        return;
      }
      
      // Load fresh data from API
      const result = await getAccountById(account.id);
      if (result.success) {
        console.log('✅ Loading account data for edit');
        setSelectedAccount(result.data);
        editForm.setFormData({
          accountCode: result.data.accountCode || '',
          accountName: result.data.accountName || '',
          accountType: result.data.accountType || '',
          accountSubType: result.data.accountSubType || '',
          parentAccountId: result.data.parentAccountId || '',
          subsidiaryId: result.data.subsidiaryId || '',
          normalBalance: result.data.normalBalance || '',
          description: result.data.description || '',
          notes: result.data.notes || '',
          constructionSpecific: result.data.constructionSpecific || false,
          taxDeductible: result.data.taxDeductible || false,
          vatApplicable: result.data.vatApplicable || false,
          projectCostCenter: result.data.projectCostCenter || false
        });
        setEditingAccountId(account.id);
        setExpandedAccountId(null); // Close detail if open
      } else {
        alert('Failed to load account details: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error loading account:', error);
      alert('Failed to load account details');
    }
  };
  
  // Handle edit form submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateAccount(selectedAccount.id, editForm.formData);
      if (result.success) {
        console.log('✅ Account updated successfully');
        setEditingAccountId(null);
        setSelectedAccount(null);
        editForm.resetForm();
        handleAccountCreated();
      } else {
        alert(result.error || 'Failed to update account');
      }
    } catch (error) {
      console.error('❌ Error updating account:', error);
      alert('Failed to update account');
    }
  };
  
  // Handle delete account - Show inline confirmation
  const handleDelete = (account) => {
    console.log('🗑️ DELETE clicked for account:', account.id, account.accountName);
    setDeleteConfirmId(account.id);
    setSelectedAccount(account);
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAccount(selectedAccount.id);
      if (result.success) {
        console.log('✅ Account deleted successfully');
        setDeleteConfirmId(null);
        setSelectedAccount(null);
        handleAccountCreated();
      } else {
        alert(result.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('❌ Error deleting account:', error);
      alert('Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div 
          className="animate-spin rounded-full h-8 w-8 border-b-2" 
          style={{ borderBottomColor: colors.primary }}
        ></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ChartOfAccountsHeader
        accounts={accounts}
        totalBalances={totalBalances}
        lastUpdate={lastUpdate}
        error={error}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onAddAccount={handleAddAccount}
        onManageEntities={handleToggleSubsidiaryPanel}
      />

      {/* Summary Panel */}
      <AccountSummaryPanel
        totalBalances={totalBalances}
        lastUpdate={lastUpdate}
      />
      
      {/* Inline Subsidiary Panel */}
      <InlineSubsidiaryPanel
        isOpen={showSubsidiaryPanel}
        onClose={() => setShowSubsidiaryPanel(false)}
        subsidiaries={subsidiaryModal.subsidiaries}
        loading={subsidiaryModal.loading}
        error={subsidiaryModal.error}
      />

      {/* Error Display */}
      {error && (
        <div 
          className="rounded-lg p-4" 
          style={{ 
            backgroundColor: "rgba(255, 69, 58, 0.1)", 
            border: `1px solid ${colors.error}` 
          }}
        >
          <div className="flex items-center">
            <AlertCircle style={{ color: colors.error }} className="mr-3" size={20} />
            <div>
              <h3 className="font-medium" style={{ color: colors.error }}>
                Error loading accounts
              </h3>
              <p className="text-sm mt-1" style={{ color: colors.error }}>
                {error}
              </p>
              <button 
                onClick={handleRefresh}
                className="text-sm font-medium mt-2 underline"
                style={{ color: colors.error }}
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <AccountFilters
        searchTerm={searchTerm}
        filterType={filterType}
        onSearchChange={handleSearchChange}
        onFilterTypeChange={handleFilterTypeChange}
        onClearFilters={clearAllFilters}
        filterStats={getFilterStats()}
      />

      {/* Account Tree */}
      <AccountTree
        accounts={filteredAccounts}
        expandedNodes={expandedNodes}
        onToggleNode={toggleNode}
        loading={loading}
        onAddAccount={handleAddAccount}
        onViewDetail={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
        expandedAccountId={expandedAccountId}
        editingAccountId={editingAccountId}
        selectedAccount={selectedAccount}
        deleteConfirmId={deleteConfirmId}
        onDeleteConfirm={handleDeleteConfirm}
        onDeleteCancel={() => { setDeleteConfirmId(null); setSelectedAccount(null); }}
        isDeleting={isDeleting}
        editForm={editForm}
        onEditSubmit={handleEditSubmit}
        onEditCancel={() => { setEditingAccountId(null); editForm.resetForm(); }}
        allAccounts={allAccounts || accounts}
        subsidiaries={subsidiaryModal.subsidiaries}
      />

      {/* Statistics */}
      <AccountStatistics accounts={accounts} />

      {/* Add Account Modal - Keep this one */}
      <AddAccountModal
        isOpen={showAddAccountModal}
        onClose={handleCloseAddAccountModal}
        formData={accountForm.formData}
        errors={accountForm.errors}
        isSubmitting={accountForm.isSubmitting}
        accounts={allAccounts || accounts}
        onFormChange={accountForm.handleFormChange}
        onSubmit={accountForm.handleSubmit}
      />
    </div>
  );
};

export default ChartOfAccounts;