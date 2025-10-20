import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Banknote,
  FileText,
  BarChart3,
  Calculator,
  Receipt,
  BookOpen,
  Building2,
  DollarSign,
  TrendingUp
} from 'lucide-react';

// Custom Hooks
import { useFinanceData } from './hooks/useFinanceData';
import { useTransactions } from './hooks/useTransactions';
import { useFinancialReports } from './hooks/useFinancialReports';
import { useTaxRecords } from './hooks/useTaxRecords';

// Components
import TransactionFilters from './components/TransactionFilters';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import TransactionModals from './components/TransactionModals';
import VoidTransactionModal from './components/VoidTransactionModal';
import ReverseTransactionModal from './components/ReverseTransactionModal';
import FinancialReportsView from './components/FinancialReportsView';
import TaxManagement from './components/TaxManagement';
import FinanceWorkspace from './components/FinanceWorkspace';
import ProjectFinanceView from './components/ProjectFinanceView';
import ChartOfAccountsView from './components/ChartOfAccountsView';

/**
 * Finance - Main Finance Management Container
 * 
 * Modularized finance management system with tab-based navigation
 * Integrates all financial features: transactions, reports, tax, workspace
 * 
 * Features:
 * - Transaction management with CRUD operations
 * - PSAK-compliant financial reports
 * - Tax management and compliance
 * - Financial workspace dashboard
 * - Project finance integration
 * - Chart of Accounts (COA)
 */
const Finance = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('workspace');

  // Initialize custom hooks
  const financeData = useFinanceData();
  const transactions = useTransactions(
    financeData.selectedSubsidiary,
    financeData.selectedProject
  );
  const financialReports = useFinancialReports(
    financeData.selectedSubsidiary,
    financeData.selectedProject
  );
  const taxRecords = useTaxRecords();

  // Handle URL params for tab navigation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const validTabs = ['workspace', 'transactions', 'reports', 'tax-management', 'chart-of-accounts', 'projects'];
    if (tab && validTabs.includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Refresh data when tab changes
  useEffect(() => {
    if (activeTab === 'transactions') {
      transactions.fetchTransactions();
    } else if (activeTab === 'reports') {
      financialReports.fetchFinancialReports();
    } else if (activeTab === 'tax-management') {
      taxRecords.fetchTaxRecords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  /**
   * Tab Configuration
   */
  const tabs = [
    {
      id: 'workspace',
      label: 'Financial Workspace',
      icon: Banknote,
      description: 'Dashboard keuangan terintegrasi dengan analisis PSAK'
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: Receipt,
      description: 'Manajemen transaksi keuangan harian'
    },
    {
      id: 'reports',
      label: 'Financial Reports',
      icon: BarChart3,
      description: 'Laporan keuangan lengkap (Neraca, L/R, Arus Kas)'
    },
    {
      id: 'tax-management',
      label: 'Tax Management',
      icon: Calculator,
      description: 'Manajemen pajak dan kepatuhan fiskal'
    },
    {
      id: 'projects',
      label: 'Project Finance',
      icon: Building2,
      description: 'Integrasi keuangan proyek konstruksi'
    },
    {
      id: 'chart-of-accounts',
      label: 'Chart of Accounts',
      icon: BookOpen,
      description: 'Bagan akun standar PSAK dengan struktur hierarkis'
    }
  ];

  /**
   * Render content based on active tab
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'workspace':
        return (
          <FinanceWorkspace
            selectedSubsidiary={financeData.selectedSubsidiary}
            selectedProject={financeData.selectedProject}
          />
        );

      case 'transactions':
        return (
          <div className="space-y-6">
            <div className="rounded-xl p-6" style={{
              backgroundColor: '#2C2C2E',
              border: '1px solid #38383A'
            }}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-semibold" style={{ color: '#FFFFFF' }}>
                  Transaction Management
                </h2>
                <div className="flex flex-wrap gap-3">
                  <TransactionFilters
                    selectedSubsidiary={financeData.selectedSubsidiary}
                    onSubsidiaryChange={(value) => {
                      financeData.handleSubsidiaryChange(value);
                      transactions.setCurrentPage(1);
                    }}
                    subsidiaries={financeData.subsidiaries}
                    loadingSubsidiaries={financeData.loadingSubsidiaries}
                    selectedProject={financeData.selectedProject}
                    onProjectChange={(value) => {
                      financeData.handleProjectChange(value);
                      transactions.setCurrentPage(1);
                    }}
                    projects={financeData.filteredProjects}
                    loadingProjects={financeData.loadingProjects}
                  />
                  <button
                    onClick={() => transactions.setShowTransactionForm(!transactions.showTransactionForm)}
                    className="px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
                    style={{
                      backgroundColor: transactions.showTransactionForm ? 'rgba(255, 69, 58, 0.15)' : 'rgba(10, 132, 255, 0.15)',
                      color: transactions.showTransactionForm ? '#FF453A' : '#0A84FF',
                      border: transactions.showTransactionForm ? '1px solid rgba(255, 69, 58, 0.3)' : '1px solid rgba(10, 132, 255, 0.3)'
                    }}
                  >
                    <span>{transactions.showTransactionForm ? 'Cancel' : 'New Transaction'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Info Banner - Explaining Transaction Types */}
            {!transactions.showTransactionForm && transactions.transactions.length === 0 && (
              <div className="rounded-xl p-4" style={{
                background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.15), rgba(10, 132, 255, 0.05))',
                border: '1px solid rgba(10, 132, 255, 0.3)'
              }}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5" style={{ color: '#0A84FF' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold mb-1" style={{ color: '#0A84FF' }}>
                      Manual Finance Transactions
                    </h4>
                    <p className="text-xs leading-relaxed" style={{ color: '#98989D' }}>
                      Tab ini untuk transaksi keuangan manual (biaya operasional, pendapatan lain-lain, dll). 
                      Untuk data konstruksi (pembayaran progress, biaya milestone), lihat tab <strong>Financial Workspace</strong> atau <strong>Project Finance</strong>.
                    </p>
                    <div className="mt-2 text-xs" style={{ color: '#98989D' }}>
                      💡 <strong>Tip:</strong> Klik tombol "<span style={{ color: '#0A84FF' }}>Add Transaction</span>" untuk menambah transaksi keuangan baru.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transaction Summary */}
            {!transactions.showTransactionForm && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl p-5 transition-transform hover:scale-105" style={{
                  background: 'linear-gradient(135deg, rgba(48, 209, 88, 0.15), rgba(48, 209, 88, 0.05))',
                  border: '1px solid rgba(48, 209, 88, 0.3)'
                }}>
                  <p className="text-sm font-medium mb-2" style={{ color: '#98989D' }}>
                    Total Income
                  </p>
                  <p className="text-2xl font-bold" style={{ color: '#30D158' }}>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transactions.transactionSummary.income)}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#98989D' }}>Manual transactions only</p>
                </div>
                <div className="rounded-xl p-5 transition-transform hover:scale-105" style={{
                  background: 'linear-gradient(135deg, rgba(255, 69, 58, 0.15), rgba(255, 69, 58, 0.05))',
                  border: '1px solid rgba(255, 69, 58, 0.3)'
                }}>
                  <p className="text-sm font-medium mb-2" style={{ color: '#98989D' }}>
                    Total Expenses
                  </p>
                  <p className="text-2xl font-bold" style={{ color: '#FF453A' }}>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transactions.transactionSummary.expense)}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#98989D' }}>Manual transactions only</p>
                </div>
                <div className="rounded-xl p-5 transition-transform hover:scale-105" style={{
                  background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.15), rgba(10, 132, 255, 0.05))',
                  border: '1px solid rgba(10, 132, 255, 0.3)'
                }}>
                  <p className="text-sm font-medium mb-2" style={{ color: '#98989D' }}>
                    Net Balance
                  </p>
                  <p className="text-2xl font-bold" style={{ color: '#0A84FF' }}>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transactions.transactionSummary.balance)}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#98989D' }}>Manual transactions only</p>
                </div>
              </div>
            )}

            {/* Transaction Form (Create) */}
            {transactions.showTransactionForm && !transactions.showEditModal && (
              <TransactionForm
                formData={transactions.transactionForm}
                onChange={transactions.handleTransactionFormChange}
                onSubmit={transactions.handleSubmitTransaction}
                onCancel={() => {
                  transactions.setShowTransactionForm(false);
                  transactions.resetTransactionForm();
                }}
                projects={financeData.filteredProjects}
                loadingProjects={financeData.loadingProjects}
                cashAccounts={transactions.cashAccounts}
                loadingCashAccounts={transactions.loadingCashAccounts}
                isSubmitting={transactions.isSubmittingTransaction}
              />
            )}

            {/* Transaction Form (Edit) */}
            {transactions.showEditModal && (
              <TransactionForm
                formData={transactions.transactionForm}
                onChange={transactions.handleTransactionFormChange}
                onSubmit={transactions.handleUpdateTransaction}
                onCancel={() => {
                  transactions.setShowEditModal(false);
                  transactions.setSelectedTransaction(null);
                  transactions.resetTransactionForm();
                }}
                projects={financeData.filteredProjects}
                loadingProjects={financeData.loadingProjects}
                cashAccounts={transactions.cashAccounts}
                loadingCashAccounts={transactions.loadingCashAccounts}
                isSubmitting={transactions.isSubmittingTransaction}
                isEdit={true}
              />
            )}

            {/* Transaction List */}
            {!transactions.showTransactionForm && !transactions.showEditModal && (
              <TransactionList
                transactions={transactions.transactions}
                loading={transactions.transactionLoading}
                onView={transactions.handleViewTransaction}
                onEdit={transactions.handleEditTransaction}
                onDelete={transactions.handleDeleteTransaction}
                onVoid={transactions.handleVoidTransaction}
                onReverse={transactions.handleReverseTransaction}
                currentPage={transactions.currentPage}
                totalPages={transactions.totalPages}
                onPageChange={transactions.handlePageChange}
                onAddNew={() => transactions.setShowTransactionForm(true)}
              />
            )}

            {/* Transaction Modals */}
            <TransactionModals
              showView={transactions.showViewModal}
              showDelete={transactions.showDeleteModal}
              transaction={transactions.selectedTransaction}
              subsidiaryInfo={
                transactions.selectedTransaction
                  ? financeData.getSubsidiaryInfo(transactions.selectedTransaction.subsidiaryId)
                  : null
              }
              onCloseView={transactions.closeViewModal}
              onCloseDelete={() => transactions.setShowDeleteModal(false)}
              onConfirmDelete={transactions.confirmDeleteTransaction}
              isDeleting={false}
            />

            {/* VOID Transaction Modal - for cancelling posted transactions */}
            <VoidTransactionModal
              isOpen={transactions.showVoidModal}
              onClose={transactions.cancelVoidTransaction}
              onConfirm={transactions.confirmVoidTransaction}
              transaction={transactions.selectedTransaction}
              loading={transactions.isVoiding}
            />

            {/* REVERSE Transaction Modal - for correcting posted transactions */}
            <ReverseTransactionModal
              isOpen={transactions.showReverseModal}
              onClose={transactions.cancelReverseTransaction}
              onConfirm={transactions.confirmReverseTransaction}
              transaction={transactions.selectedTransaction}
              loading={transactions.isReversing}
              cashAccounts={financeData.cashAccounts}
            />
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <div className="rounded-xl p-6" style={{
              backgroundColor: '#2C2C2E',
              border: '1px solid #38383A'
            }}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-semibold" style={{ color: '#FFFFFF' }}>
                  Financial Reports (PSAK Compliant)
                </h2>
                <TransactionFilters
                  selectedSubsidiary={financeData.selectedSubsidiary}
                  onSubsidiaryChange={financeData.handleSubsidiaryChange}
                  subsidiaries={financeData.subsidiaries}
                  loadingSubsidiaries={financeData.loadingSubsidiaries}
                  selectedProject={financeData.selectedProject}
                  onProjectChange={financeData.handleProjectChange}
                  projects={financeData.filteredProjects}
                  loadingProjects={financeData.loadingProjects}
                />
              </div>
            </div>

            <FinancialReportsView
              reports={financialReports.financialReports}
              loading={financialReports.reportsLoading}
              activeDetailedReport={financialReports.activeDetailedReport}
              onToggleDetailedReport={financialReports.toggleDetailedReport}
            />
          </div>
        );

      case 'tax-management':
        return (
          <TaxManagement
            taxRecords={taxRecords.taxRecords}
            loading={taxRecords.loadingTaxRecords}
            showForm={taxRecords.showTaxForm}
            onToggleForm={() => taxRecords.setShowTaxForm(!taxRecords.showTaxForm)}
            formData={taxRecords.taxForm}
            onChange={taxRecords.handleTaxFormChange}
            onSubmit={taxRecords.handleSubmitTax}
            onCancel={() => {
              taxRecords.setShowTaxForm(false);
              taxRecords.resetTaxForm();
            }}
            isSubmitting={taxRecords.isSubmittingTax}
            onDelete={taxRecords.handleDeleteTax}
            selectedTax={taxRecords.selectedTax}
            showDeleteModal={taxRecords.showDeleteModal}
            onConfirmDelete={taxRecords.confirmDeleteTax}
            onCancelDelete={taxRecords.cancelDeleteTax}
          />
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="rounded-xl p-6" style={{
              backgroundColor: '#2C2C2E',
              border: '1px solid #38383A'
            }}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-semibold" style={{ color: '#FFFFFF' }}>
                  Project Finance
                </h2>
                <TransactionFilters
                  selectedSubsidiary={financeData.selectedSubsidiary}
                  onSubsidiaryChange={financeData.handleSubsidiaryChange}
                  subsidiaries={financeData.subsidiaries}
                  loadingSubsidiaries={financeData.loadingSubsidiaries}
                  selectedProject={financeData.selectedProject}
                  onProjectChange={financeData.handleProjectChange}
                  projects={financeData.filteredProjects}
                  loadingProjects={financeData.loadingProjects}
                />
              </div>
            </div>

            <ProjectFinanceView
              selectedSubsidiary={financeData.selectedSubsidiary}
              selectedProject={financeData.selectedProject}
            />
          </div>
        );

      case 'chart-of-accounts':
        return (
          <ChartOfAccountsView
            selectedSubsidiary={financeData.selectedSubsidiary}
          />
        );

      default:
        return (
          <div className="rounded-xl p-12 text-center" style={{
            backgroundColor: '#2C2C2E',
            border: '1px solid #38383A'
          }}>
            <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: '#636366' }} />
            <p style={{ color: '#98989D' }}>Select a tab to view content</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1C1C1E' }}>
      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
        {/* Header Section */}
        <div className="rounded-xl p-6 lg:p-8 shadow-lg" style={{ 
          backgroundColor: '#2C2C2E',
          border: '1px solid #38383A'
        }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center mb-3">
                <Banknote className="w-10 h-10 mr-4" style={{ color: '#0A84FF' }} />
                <div>
                  <h1 className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>
                    Financial Management System
                  </h1>
                  <p className="mt-1" style={{ color: '#98989D', fontSize: '0.95rem' }}>
                    PSAK-compliant financial management for Nusantara Construction Group
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl p-4 transition-transform hover:scale-105" style={{
                background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.15), rgba(10, 132, 255, 0.05))',
                border: '1px solid rgba(10, 132, 255, 0.3)'
              }}>
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8" style={{ color: '#0A84FF' }} />
                  <div className="ml-3">
                    <p className="text-xs font-medium" style={{ color: '#98989D' }}>
                      Total Income
                    </p>
                    <p className="text-2xl font-bold" style={{ color: '#0A84FF' }}>
                      {new Intl.NumberFormat('id-ID', { 
                        style: 'currency', 
                        currency: 'IDR', 
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(transactions.transactionSummary.income)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-4 transition-transform hover:scale-105" style={{
                background: 'linear-gradient(135deg, rgba(48, 209, 88, 0.15), rgba(48, 209, 88, 0.05))',
                border: '1px solid rgba(48, 209, 88, 0.3)'
              }}>
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8" style={{ color: '#30D158' }} />
                  <div className="ml-3">
                    <p className="text-xs font-medium" style={{ color: '#98989D' }}>
                      Net Balance
                    </p>
                    <p className="text-2xl font-bold" style={{ color: '#30D158' }}>
                      {new Intl.NumberFormat('id-ID', { 
                        style: 'currency', 
                        currency: 'IDR', 
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(transactions.transactionSummary.balance)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="rounded-xl p-2" style={{
          backgroundColor: '#2C2C2E',
          border: '1px solid #38383A'
        }}>
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap"
                  style={{
                    backgroundColor: isActive ? 'rgba(10, 132, 255, 0.15)' : 'transparent',
                    color: isActive ? '#0A84FF' : '#98989D',
                    border: isActive ? '1px solid rgba(10, 132, 255, 0.3)' : '1px solid transparent'
                  }}
                  title={tab.description}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Finance;
