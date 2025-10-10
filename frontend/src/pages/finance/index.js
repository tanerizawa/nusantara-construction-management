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
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Transaction Management</h2>
              <div className="flex space-x-3">
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
                  className={`px-4 py-2 rounded-lg transition-colors duration-150 flex items-center space-x-2 ${
                    transactions.showTransactionForm
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <span>{transactions.showTransactionForm ? 'Cancel' : 'New Transaction'}</span>
                </button>
              </div>
            </div>

            {/* Transaction Summary */}
            {!transactions.showTransactionForm && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-900 font-medium">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transactions.transactionSummary.income)}
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-sm text-red-900 font-medium">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transactions.transactionSummary.expense)}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-900 font-medium">Net Balance</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transactions.transactionSummary.balance)}
                  </p>
                </div>
              </div>
            )}

            {/* Transaction Form */}
            {transactions.showTransactionForm && (
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
                isSubmitting={transactions.isSubmittingTransaction}
              />
            )}

            {/* Transaction List */}
            {!transactions.showTransactionForm && (
              <TransactionList
                transactions={transactions.transactions}
                loading={transactions.transactionLoading}
                onView={transactions.handleViewTransaction}
                onEdit={transactions.handleEditTransaction}
                onDelete={transactions.handleDeleteTransaction}
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
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Financial Reports (PSAK Compliant)</h2>
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
          />
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Project Finance</h2>
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
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Select a tab to view content</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center mb-4">
                <Banknote className="w-10 h-10 text-blue-600 mr-4" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Financial Management System</h1>
                  <p className="text-gray-600 mt-1">
                    PSAK-compliant financial management for Nusantara Construction Group
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-900">Total Revenue</p>
                    <p className="text-2xl font-bold text-blue-600">Rp 125.8B</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-900">Net Profit</p>
                    <p className="text-2xl font-bold text-green-600">Rp 28.5B</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    title={tab.description}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Finance;
