/**
 * Budget Validation Tab
 * Main entry point for budget validation feature
 */

export { default } from './BudgetValidationTab';
export { default as BudgetValidationTab } from './BudgetValidationTab';

// Export components for external use
export { default as BudgetSummaryCards } from './components/BudgetSummaryCards';
export { default as BudgetAlerts } from './components/BudgetAlerts';
export { default as RABComparisonTable } from './components/RABComparisonTable';
export { default as AdditionalExpensesSection } from './components/AdditionalExpensesSection';
export { default as ActualInputModal } from './components/ActualInputModal';
export { default as ExpenseFormModal } from './components/ExpenseFormModal';

// Export hooks for reuse
export { default as useBudgetData } from './hooks/useBudgetData';
export { default as useActualTracking } from './hooks/useActualTracking';
export { default as useAdditionalExpenses } from './hooks/useAdditionalExpenses';
export { default as useBudgetCalculations } from './hooks/useBudgetCalculations';

// Export utilities
export * from './utils/budgetCalculations';
export * from './utils/varianceAnalysis';
export * from './utils/budgetValidation';
