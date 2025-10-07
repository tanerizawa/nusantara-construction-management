/**
 * Utility functions for project detail formatting
 */

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return 'Rp 0';
  const numericAmount = parseFloat(amount);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericAmount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const calculateDaysDifference = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  return Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
};

export const calculateBudgetUtilization = (totalBudget, actualSpent) => {
  const budget = parseFloat(totalBudget) || 0;
  const spent = parseFloat(actualSpent) || 0;
  
  if (budget === 0) return 0;
  return Math.round((spent / budget) * 100);
};
