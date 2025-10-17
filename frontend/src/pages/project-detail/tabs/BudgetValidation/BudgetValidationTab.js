import React, { useState } from 'react';
import { RefreshCw, Calendar } from 'lucide-react';
import useBudgetData from './hooks/useBudgetData';

// Components
import BudgetSummaryCards from './components/BudgetSummaryCards';
import BudgetAlerts from './components/BudgetAlerts';
import RABComparisonTable from './components/RABComparisonTable';
import AdditionalExpensesSection from './components/AdditionalExpensesSection';
import ActualInputModal from './components/ActualInputModal';
import ExpenseFormModal from './components/ExpenseFormModal';

/**
 * Budget Validation Tab - Main Container
 * Comprehensive budget monitoring and validation page
 */
const BudgetValidationTab = ({ projectId }) => {
  // Modals state
  const [actualModalOpen, setActualModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [selectedRABItem, setSelectedRABItem] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Fetch budget data with auto-refresh
  const {
    budgetData,
    loading,
    error,
    lastUpdated,
    refresh,
    summary,
    rabItems,
    categoryBreakdown,
    additionalExpenses
  } = useBudgetData(projectId, {
    autoRefresh: true,
    refreshInterval: 60000 // Refresh every 60 seconds
  });

  // Handlers
  const handleAddActual = (rabItem) => {
    setSelectedRABItem(rabItem);
    setActualModalOpen(true);
  };

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setExpenseModalOpen(true);
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setExpenseModalOpen(true);
  };

  const handleActualSuccess = () => {
    refresh();
    setActualModalOpen(false);
    setSelectedRABItem(null);
  };

  const handleExpenseSuccess = () => {
    refresh();
    setExpenseModalOpen(false);
    setSelectedExpense(null);
  };

  // Loading state
  if (loading && !budgetData) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse space-y-3">
          <div className="h-16 bg-[#2C2C2E] border border-[#38383A] rounded-lg"></div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-24 bg-[#2C2C2E] border border-[#38383A] rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-[#2C2C2E] border border-[#38383A] rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !budgetData) {
    return (
      <div className="space-y-3">
        <div className="bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-lg p-4">
          <h3 className="text-base font-semibold text-[#FF453A] mb-2">
            Gagal Memuat Data
          </h3>
          <p className="text-sm text-[#FF453A]/80 mb-3">{error}</p>
          <button
            onClick={refresh}
            className="px-3 py-1.5 bg-[#FF453A] hover:bg-[#FF453A]/90 text-white rounded-lg transition-colors text-sm"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between bg-[#2C2C2E] border border-[#38383A] rounded-lg p-3">
        <div>
          <h2 className="text-base font-semibold text-white">
            Validasi Anggaran
          </h2>
          <p className="text-xs text-[#8E8E93] mt-0.5">
            Monitor penggunaan anggaran vs RAB
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {lastUpdated && (
            <div className="flex items-center text-xs text-[#8E8E93] bg-[#1C1C1E] border border-[#38383A] px-2.5 py-1.5 rounded-lg">
              <Calendar className="mr-1.5 w-3.5 h-3.5" />
              <span>
                {lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center px-3 py-1.5 bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <RefreshCw className={`mr-1.5 w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <BudgetSummaryCards summary={summary} loading={loading} />

      {/* Budget Alerts */}
      <BudgetAlerts
        summary={summary}
        categoryBreakdown={categoryBreakdown}
        rabItems={rabItems}
      />

      {/* RAB Comparison Table */}
      <RABComparisonTable
        rabItems={rabItems}
        loading={loading}
        onAddActual={handleAddActual}
      />

      {/* Additional Expenses Section */}
      <AdditionalExpensesSection
        projectId={projectId}
        expenses={additionalExpenses}
        onRefresh={refresh}
        onAddExpense={handleAddExpense}
        onEditExpense={handleEditExpense}
      />

      {/* Variance Analysis Chart - Coming Soon */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Analisis Varians (Coming Soon)
        </h3>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Grafik analisis varians akan ditampilkan di sini
          </p>
        </div>
      </div>

      {/* Modals */}
      <ActualInputModal
        isOpen={actualModalOpen}
        onClose={() => {
          setActualModalOpen(false);
          setSelectedRABItem(null);
        }}
        rabItem={selectedRABItem}
        projectId={projectId}
        onSuccess={handleActualSuccess}
      />

      <ExpenseFormModal
        isOpen={expenseModalOpen}
        onClose={() => {
          setExpenseModalOpen(false);
          setSelectedExpense(null);
        }}
        projectId={projectId}
        expense={selectedExpense}
        onSuccess={handleExpenseSuccess}
      />
    </div>
  );
};

export default BudgetValidationTab;
