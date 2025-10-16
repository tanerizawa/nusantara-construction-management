import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

// Hooks
import { useChartOfAccounts } from './hooks/useChartOfAccounts';
import { useAccountForm } from './hooks/useAccountForm';
import { useSubsidiaryModal } from './hooks/useSubsidiaryModal';

// Components
import ChartOfAccountsHeader from './components/ChartOfAccountsHeader';
import AccountSummaryPanel from './components/AccountSummaryPanel';
import AccountFilters from './components/AccountFilters';
import AccountTree from './components/AccountTree';
import AccountStatistics from './components/AccountStatistics';
import AddAccountModal from './components/AddAccountModal';
import SubsidiaryModal from './components/SubsidiaryModal';

// Utils
import { exportAccountsToCSV } from './utils/accountExport';

// Config
import { CHART_OF_ACCOUNTS_CONFIG } from './config/chartOfAccountsConfig';

const { colors } = CHART_OF_ACCOUNTS_CONFIG;

const ChartOfAccounts = () => {
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  
  // Main data hook
  const {
    accounts,
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
  const accountForm = useAccountForm(accounts, (result) => {
    setShowAddAccountModal(false);
    handleAccountCreated();
  });

  // Subsidiary modal hook
  const subsidiaryModal = useSubsidiaryModal();

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
        onManageEntities={subsidiaryModal.openModal}
      />

      {/* Summary Panel */}
      <AccountSummaryPanel
        totalBalances={totalBalances}
        lastUpdate={lastUpdate}
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
      />

      {/* Statistics */}
      <AccountStatistics accounts={accounts} />

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={showAddAccountModal}
        onClose={handleCloseAddAccountModal}
        formData={accountForm.formData}
        errors={accountForm.errors}
        isSubmitting={accountForm.isSubmitting}
        accounts={accounts}
        onFormChange={accountForm.handleFormChange}
        onSubmit={accountForm.handleSubmit}
      />

      {/* Subsidiary Modal */}
      <SubsidiaryModal
        isOpen={subsidiaryModal.isOpen}
        onClose={subsidiaryModal.closeModal}
        subsidiaries={subsidiaryModal.subsidiaries}
        loading={subsidiaryModal.loading}
        error={subsidiaryModal.error}
      />
    </div>
  );
};

export default ChartOfAccounts;