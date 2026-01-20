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
      label: 'Ruang Kerja Keuangan',
      icon: Banknote,
      description: 'Dashboard keuangan terintegrasi dengan analisis PSAK'
    },
    {
      id: 'transactions',
      label: 'Transaksi',
      icon: Receipt,
      description: 'Manajemen transaksi keuangan harian'
    },
    {
      id: 'reports',
      label: 'Laporan Keuangan',
      icon: BarChart3,
      description: 'Laporan keuangan lengkap (Neraca, L/R, Arus Kas)'
    },
    {
      id: 'tax-management',
      label: 'Manajemen Pajak',
      icon: Calculator,
      description: 'Manajemen pajak dan kepatuhan fiskal'
    },
    {
      id: 'projects',
      label: 'Keuangan Proyek',
      icon: Building2,
      description: 'Integrasi keuangan proyek konstruksi'
    },
    {
      id: 'chart-of-accounts',
      label: 'Bagan Akun',
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
            <div className="rounded-2xl p-6 border border-white/5 bg-[#0b0f19]/80 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-semibold text-white">
                  Manajemen Transaksi
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
                    className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                      transactions.showTransactionForm 
                        ? 'bg-[#FF453A]/15 text-[#FF453A] border border-[#FF453A]/30' 
                        : 'bg-[#0ea5e9]/15 text-[#0ea5e9] border border-[#0ea5e9]/30'
                    }`}
                  >
                    <span>{transactions.showTransactionForm ? 'Batalkan' : 'Transaksi Baru'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Info Banner - Explaining Transaction Types */}
            {!transactions.showTransactionForm && transactions.transactions.length === 0 && (
              <div className="rounded-2xl p-4 border border-[#0ea5e9]/30 bg-[#0ea5e9]/10">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-[#0ea5e9]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold mb-1 text-[#0ea5e9]">
                      Transaksi Keuangan Manual
                    </h4>
                    <p className="text-xs leading-relaxed text-white/60">
                      Tab ini untuk transaksi keuangan manual (biaya operasional, pendapatan lain-lain, dan sebagainya).
                      Untuk data konstruksi (pembayaran progres, biaya milestone), lihat tab <strong>Ruang Kerja Keuangan</strong> atau <strong>Keuangan Proyek</strong>.
                    </p>
                    <div className="mt-2 text-xs text-white/60">
                      💡 <strong>Tips:</strong> Klik tombol "<span className="text-[#0ea5e9]">Tambah Transaksi</span>" untuk menambahkan transaksi keuangan baru.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transaction Summary */}
            {!transactions.showTransactionForm && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl p-5 transition-transform hover:scale-105 border border-[#30D158]/20 bg-[#30D158]/10">
                  <p className="text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                    Total Pendapatan
                  </p>
                  <p className="text-2xl font-bold text-[#30D158]">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transactions.transactionSummary.income)}
                  </p>
                  <p className="text-xs mt-1 text-white/50">Hanya transaksi manual</p>
                </div>
                <div className="rounded-2xl p-5 transition-transform hover:scale-105 border border-[#FF453A]/20 bg-[#FF453A]/10">
                  <p className="text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                    Total Pengeluaran
                  </p>
                  <p className="text-2xl font-bold text-[#FF453A]">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transactions.transactionSummary.expense)}
                  </p>
                  <p className="text-xs mt-1 text-white/50">Hanya transaksi manual</p>
                </div>
                <div className="rounded-2xl p-5 transition-transform hover:scale-105 border border-[#0ea5e9]/20 bg-[#0ea5e9]/10">
                  <p className="text-xs uppercase tracking-[0.15em] text-white/50 mb-2">
                    Saldo Bersih
                  </p>
                  <p className="text-2xl font-bold text-[#0ea5e9]">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transactions.transactionSummary.balance)}
                  </p>
                  <p className="text-xs mt-1 text-white/50">Hanya transaksi manual</p>
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
            <div className="rounded-2xl p-6 border border-white/5 bg-[#0b0f19]/80 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-semibold text-white">
                  Laporan Keuangan (Sesuai PSAK)
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
            <div className="rounded-2xl p-6 border border-white/5 bg-[#0b0f19]/80 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-semibold text-white">
                  Keuangan Proyek
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
          <div className="rounded-2xl p-12 text-center border border-white/5 bg-[#0b0f19]/80 backdrop-blur-xl">
            <FileText className="w-16 h-16 mx-auto mb-4 text-white/30" />
            <p className="text-white/60">Pilih tab untuk melihat konten</p>
          </div>
        );
    }
  };

  return (
    <div className="relative isolate min-h-screen">
      <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden="true">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),_transparent_45%)]" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
        {/* Header Section */}
        <div className="rounded-3xl p-6 lg:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.55)] border border-white/5 bg-[#0b0f19]/90 backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#0ea5e9]/40 to-[#8b5cf6]/40 blur-3xl" />
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center mb-3">
                <Banknote className="w-10 h-10 mr-4 text-[#0ea5e9]" />
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Sistem Manajemen Keuangan
                  </h1>
                  <p className="mt-1 text-white/60 text-sm">
                    Manajemen keuangan sesuai PSAK untuk Nusantara Construction Group
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl p-4 transition-transform hover:scale-105 border border-[#0ea5e9]/20 bg-[#0ea5e9]/10">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-[#0ea5e9]" />
                  <div className="ml-3">
                    <p className="text-xs uppercase tracking-[0.15em] text-white/50">
                      Total Pendapatan
                    </p>
                    <p className="text-2xl font-bold text-[#0ea5e9]">
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

              <div className="rounded-2xl p-4 transition-transform hover:scale-105 border border-[#30D158]/20 bg-[#30D158]/10">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-[#30D158]" />
                  <div className="ml-3">
                    <p className="text-xs uppercase tracking-[0.15em] text-white/50">
                      Saldo Bersih
                    </p>
                    <p className="text-2xl font-bold text-[#30D158]">
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
        <div className="rounded-2xl p-2 border border-white/5 bg-[#0b0f19]/80 backdrop-blur-xl">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    isActive 
                      ? 'bg-[#0ea5e9]/15 text-[#0ea5e9] border border-[#0ea5e9]/30' 
                      : 'text-white/60 border border-transparent hover:text-white hover:bg-white/5'
                  }`}
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
