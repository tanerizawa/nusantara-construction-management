import { useMemo } from 'react';

/**
 * Custom hook for client-side budget calculations and formatting
 * @param {object} budgetData - Budget data from API
 * @returns {object} Calculated values and helpers
 */
const useBudgetCalculations = (budgetData) => {
  /**
   * Format currency to Indonesian Rupiah
   */
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'Rp 0';
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  /**
   * Format percentage
   */
  const formatPercent = (value, decimals = 1) => {
    if (value === null || value === undefined) return '0%';
    return `${value.toFixed(decimals)}%`;
  };

  /**
   * Format large numbers with K/M/B suffix
   */
  const formatCompact = (amount) => {
    if (amount === null || amount === undefined) return '0';
    
    if (amount >= 1e9) {
      return `${(amount / 1e9).toFixed(1)}M`; // Miliar
    } else if (amount >= 1e6) {
      return `${(amount / 1e6).toFixed(1)}Jt`; // Juta
    } else if (amount >= 1e3) {
      return `${(amount / 1e3).toFixed(0)}Rb`; // Ribu
    }
    return amount.toString();
  };

  /**
   * Get budget health color class (iOS theme)
   */
  const getHealthColor = (status) => {
    const colors = {
      healthy: 'text-[#30D158]',
      warning: 'text-[#FFD60A]',
      critical: 'text-[#FF9F0A]',
      over_budget: 'text-[#FF453A]'
    };
    return colors[status] || 'text-[#8E8E93]';
  };

  /**
   * Get budget health background color (iOS theme)
   */
  const getHealthBgColor = (status) => {
    const colors = {
      healthy: 'bg-[#30D158]',
      warning: 'bg-[#FFD60A]',
      critical: 'bg-[#FF9F0A]',
      over_budget: 'bg-[#FF453A]'
    };
    return colors[status] || 'bg-[#8E8E93]';
  };

  /**
   * Calculate variance percentage for a single item
   */
  const calculateItemVariance = (budget, actual) => {
    if (!budget || budget === 0) return 0;
    return ((actual - budget) / budget) * 100;
  };

  /**
   * Get status label for variance
   */
  const getVarianceStatus = (variance) => {
    if (variance <= -10) return 'Sangat Hemat';
    if (variance <= 0) return 'Hemat';
    if (variance <= 10) return 'Normal';
    if (variance <= 20) return 'Melampaui';
    return 'Sangat Melampaui';
  };

  /**
   * Calculate totals by category
   */
  const categoryTotals = useMemo(() => {
    if (!budgetData?.categoryBreakdown) return [];

    return budgetData.categoryBreakdown.map(cat => ({
      ...cat,
      variance: cat.actualSpent - cat.budgeted,
      variancePercent: calculateItemVariance(cat.budgeted, cat.actualSpent),
      remaining: cat.budgeted - cat.actualSpent,
      status: getVarianceStatus(calculateItemVariance(cat.budgeted, cat.actualSpent))
    }));
  }, [budgetData?.categoryBreakdown]);

  /**
   * Get over-budget categories
   */
  const overBudgetCategories = useMemo(() => {
    return categoryTotals.filter(cat => cat.variance > 0);
  }, [categoryTotals]);

  /**
   * Get under-budget categories
   */
  const underBudgetCategories = useMemo(() => {
    return categoryTotals.filter(cat => cat.variance < 0);
  }, [categoryTotals]);

  /**
   * Calculate progress percentage for a RAB item
   */
  const calculateProgress = (actual, budget) => {
    if (!budget || budget === 0) return 0;
    return Math.min((actual / budget) * 100, 100);
  };

  /**
   * Get progress bar color (iOS theme)
   */
  const getProgressColor = (percent) => {
    if (percent <= 50) return 'bg-[#30D158]';   // Green
    if (percent <= 75) return 'bg-[#0A84FF]';   // Blue
    if (percent <= 90) return 'bg-[#FFD60A]';   // Yellow
    if (percent <= 100) return 'bg-[#FF9F0A]';  // Orange
    return 'bg-[#FF453A]';                      // Red
  };

  /**
   * Calculate days until budget exceeded
   */
  const calculateDaysUntilExceeded = (summary, timeSeriesData) => {
    if (!summary || !timeSeriesData || timeSeriesData.length === 0) return null;

    const { totalRAB, totalSpent, progress } = summary;
    
    if (progress >= 100) return 0; // Already exceeded
    
    // Calculate daily burn rate from time series
    const recentData = timeSeriesData.slice(-7); // Last 7 days
    if (recentData.length < 2) return null;

    const totalSpending = recentData[recentData.length - 1].cumulative - recentData[0].cumulative;
    const days = recentData.length;
    const dailyBurnRate = totalSpending / days;

    if (dailyBurnRate <= 0) return null;

    const remaining = totalRAB - totalSpent;
    const daysRemaining = Math.floor(remaining / dailyBurnRate);

    return daysRemaining;
  };

  /**
   * Get expense type label
   */
  const getExpenseTypeLabel = (type) => {
    const labels = {
      kasbon: 'Kasbon',
      overtime: 'Lembur',
      emergency: 'Darurat',
      transportation: 'Transportasi',
      accommodation: 'Akomodasi',
      meals: 'Konsumsi',
      equipment_rental: 'Sewa Alat',
      repair: 'Perbaikan',
      miscellaneous: 'Lain-lain',
      other: 'Lainnya'
    };
    return labels[type] || type;
  };

  /**
   * Get approval status badge
   */
  const getApprovalStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Disetujui', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-800' },
      cancelled: { label: 'Dibatalkan', color: 'bg-gray-100 text-gray-800' }
    };
    return badges[status] || badges.pending;
  };

  return {
    // Formatting functions
    formatCurrency,
    formatPercent,
    formatCompact,
    
    // Color helpers
    getHealthColor,
    getHealthBgColor,
    getProgressColor,
    
    // Calculation functions
    calculateItemVariance,
    calculateProgress,
    calculateDaysUntilExceeded,
    
    // Status helpers
    getVarianceStatus,
    getExpenseTypeLabel,
    getApprovalStatusBadge,
    
    // Computed data
    categoryTotals,
    overBudgetCategories,
    underBudgetCategories
  };
};

export default useBudgetCalculations;
