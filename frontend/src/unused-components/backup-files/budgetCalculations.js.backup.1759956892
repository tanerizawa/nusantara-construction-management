import { CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

/**
 * Calculate variance percentage between budgeted and actual
 */
export const calculateVariancePercentage = (budgeted, actual) => {
  if (!budgeted || budgeted === 0) return 0;
  return ((actual - budgeted) / budgeted) * 100;
};

/**
 * Get variance color based on percentage
 */
export const getVarianceColor = (percentage) => {
  if (percentage <= 5) return 'text-[#30D158]';
  if (percentage <= 15) return 'text-[#FF9F0A]';
  return 'text-[#FF3B30]';
};

/**
 * Get status icon based on variance
 */
export const getStatusIcon = (percentage) => {
  if (percentage <= 5) return CheckCircle;
  if (percentage <= 15) return AlertTriangle;
  return AlertCircle;
};

/**
 * Calculate budget utilization percentage
 */
export const calculateUtilization = (spent, total) => {
  if (!total || total === 0) return 0;
  return (spent / total) * 100;
};

/**
 * Calculate remaining budget
 */
export const calculateRemaining = (total, spent) => {
  return Math.max(0, total - spent);
};

/**
 * Check if budget is over limit
 */
export const isOverBudget = (actual, budgeted) => {
  return actual > budgeted;
};

/**
 * Get budget health status
 */
export const getBudgetHealth = (percentage) => {
  if (percentage <= 5) return 'excellent';
  if (percentage <= 15) return 'good';
  if (percentage <= 30) return 'warning';
  return 'critical';
};
