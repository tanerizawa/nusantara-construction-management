/**
 * Budget calculation utilities
 * Pure functions for budget-related calculations
 */

/**
 * Calculate total RAB (budget)
 */
export const calculateTotalRAB = (rabItems) => {
  if (!Array.isArray(rabItems)) return 0;
  return rabItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
};

/**
 * Calculate total actual spending
 */
export const calculateTotalActual = (rabItems) => {
  if (!Array.isArray(rabItems)) return 0;
  return rabItems.reduce((sum, item) => sum + (item.actualSpent || 0), 0);
};

/**
 * Calculate total additional expenses
 */
export const calculateTotalAdditional = (expenses, statusFilter = 'approved') => {
  if (!Array.isArray(expenses)) return 0;
  
  return expenses
    .filter(exp => !statusFilter || exp.approvalStatus === statusFilter)
    .reduce((sum, exp) => sum + (exp.amount || 0), 0);
};

/**
 * Calculate variance (spent - budget)
 */
export const calculateVariance = (spent, budget) => {
  return spent - budget;
};

/**
 * Calculate variance percentage
 */
export const calculateVariancePercent = (spent, budget) => {
  if (!budget || budget === 0) return 0;
  return ((spent - budget) / budget) * 100;
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (spent, budget) => {
  if (!budget || budget === 0) return 0;
  return (spent / budget) * 100;
};

/**
 * Calculate remaining budget
 */
export const calculateRemaining = (budget, spent) => {
  return budget - spent;
};

/**
 * Determine budget health status
 */
export const determineBudgetHealth = (progress) => {
  if (progress > 100) {
    return {
      status: 'over_budget',
      label: 'Melebihi Anggaran',
      color: 'red'
    };
  } else if (progress > 90) {
    return {
      status: 'critical',
      label: 'Kritis',
      color: 'orange'
    };
  } else if (progress > 75) {
    return {
      status: 'warning',
      label: 'Perhatian',
      color: 'yellow'
    };
  } else {
    return {
      status: 'healthy',
      label: 'Sehat',
      color: 'green'
    };
  }
};

/**
 * Calculate category breakdown
 */
export const calculateCategoryBreakdown = (rabItems) => {
  if (!Array.isArray(rabItems)) return [];

  const categoryMap = {};

  rabItems.forEach(item => {
    const category = item.category || 'Lainnya';
    
    if (!categoryMap[category]) {
      categoryMap[category] = {
        category,
        budgeted: 0,
        actualSpent: 0,
        itemCount: 0
      };
    }

    categoryMap[category].budgeted += item.totalPrice || 0;
    categoryMap[category].actualSpent += item.actualSpent || 0;
    categoryMap[category].itemCount += 1;
  });

  return Object.values(categoryMap).map(cat => ({
    ...cat,
    variance: cat.actualSpent - cat.budgeted,
    variancePercent: calculateVariancePercent(cat.actualSpent, cat.budgeted),
    percentUsed: calculateProgress(cat.actualSpent, cat.budgeted),
    remaining: cat.budgeted - cat.actualSpent
  }));
};

/**
 * Calculate summary statistics
 */
export const calculateSummary = (rabItems, additionalExpenses = []) => {
  const totalRAB = calculateTotalRAB(rabItems);
  const totalActual = calculateTotalActual(rabItems);
  const totalAdditional = calculateTotalAdditional(additionalExpenses, 'approved');
  const totalSpent = totalActual + totalAdditional;
  const variance = calculateVariance(totalSpent, totalRAB);
  const variancePercent = calculateVariancePercent(totalSpent, totalRAB);
  const progress = calculateProgress(totalSpent, totalRAB);
  const remaining = calculateRemaining(totalRAB, totalSpent);
  const budgetHealth = determineBudgetHealth(progress);

  return {
    totalRAB,
    totalActual,
    totalAdditional,
    totalSpent,
    variance,
    variancePercent,
    progress,
    remaining,
    budgetHealth
  };
};

/**
 * Group items by status
 */
export const groupByStatus = (items) => {
  return {
    onTrack: items.filter(item => {
      const progress = calculateProgress(item.actualSpent || 0, item.totalPrice || 0);
      return progress <= 90;
    }),
    warning: items.filter(item => {
      const progress = calculateProgress(item.actualSpent || 0, item.totalPrice || 0);
      return progress > 90 && progress <= 100;
    }),
    overBudget: items.filter(item => {
      const progress = calculateProgress(item.actualSpent || 0, item.totalPrice || 0);
      return progress > 100;
    })
  };
};

/**
 * Calculate daily burn rate
 */
export const calculateBurnRate = (timeSeriesData) => {
  if (!Array.isArray(timeSeriesData) || timeSeriesData.length < 2) return 0;

  const recentData = timeSeriesData.slice(-7); // Last 7 days
  const totalSpending = recentData[recentData.length - 1].cumulative - recentData[0].cumulative;
  const days = recentData.length;

  return totalSpending / days;
};

/**
 * Project budget completion date
 */
export const projectCompletionDate = (summary, burnRate) => {
  if (!summary || burnRate <= 0) return null;

  const remaining = summary.remaining;
  const daysRemaining = Math.ceil(remaining / burnRate);

  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() + daysRemaining);

  return completionDate;
};

/**
 * Find top spending items
 */
export const getTopSpendingItems = (rabItems, limit = 5) => {
  if (!Array.isArray(rabItems)) return [];

  return [...rabItems]
    .sort((a, b) => (b.actualSpent || 0) - (a.actualSpent || 0))
    .slice(0, limit);
};

/**
 * Find items needing attention (over budget or close to limit)
 */
export const getItemsNeedingAttention = (rabItems) => {
  if (!Array.isArray(rabItems)) return [];

  return rabItems.filter(item => {
    const progress = calculateProgress(item.actualSpent || 0, item.totalPrice || 0);
    return progress > 90; // Over 90% or exceeded
  });
};
