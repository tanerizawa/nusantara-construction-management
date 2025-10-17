/**
 * Variance analysis utilities
 * Functions for analyzing budget variances and generating insights
 */

/**
 * Analyze variance by category
 */
export const analyzeVarianceByCategory = (categoryBreakdown) => {
  if (!Array.isArray(categoryBreakdown)) return [];

  return categoryBreakdown.map(cat => {
    const severity = getVarianceSeverity(cat.variancePercent);
    const trend = getVarianceTrend(cat.variancePercent);
    const recommendation = getVarianceRecommendation(cat, severity);

    return {
      ...cat,
      severity,
      trend,
      recommendation
    };
  });
};

/**
 * Get variance severity level
 */
export const getVarianceSeverity = (variancePercent) => {
  const absVariance = Math.abs(variancePercent);

  if (absVariance > 20) return 'high';
  if (absVariance > 10) return 'medium';
  return 'low';
};

/**
 * Get variance trend description
 */
export const getVarianceTrend = (variancePercent) => {
  if (variancePercent > 10) return 'significantly_over';
  if (variancePercent > 0) return 'slightly_over';
  if (variancePercent > -10) return 'slightly_under';
  return 'significantly_under';
};

/**
 * Get variance recommendation
 */
export const getVarianceRecommendation = (category, severity) => {
  if (category.variancePercent > 20) {
    return `Kategori ${category.category} sangat melampaui anggaran. Segera lakukan review dan pengendalian biaya.`;
  } else if (category.variancePercent > 10) {
    return `Kategori ${category.category} mulai melampaui anggaran. Perhatikan pengeluaran selanjutnya.`;
  } else if (category.variancePercent > 0) {
    return `Kategori ${category.category} sedikit melebihi anggaran. Tetap monitor pengeluaran.`;
  } else if (category.variancePercent < -20) {
    return `Kategori ${category.category} sangat hemat. Pastikan kualitas pekerjaan tetap terjaga.`;
  } else if (category.variancePercent < -10) {
    return `Kategori ${category.category} hemat. Pertahankan efisiensi ini.`;
  } else {
    return `Kategori ${category.category} sesuai dengan anggaran.`;
  }
};

/**
 * Generate budget alerts
 */
export const generateBudgetAlerts = (summary, categoryBreakdown, rabItems) => {
  const alerts = [];

  // Overall budget alert
  if (summary.progress > 100) {
    alerts.push({
      type: 'error',
      severity: 'high',
      title: 'Anggaran Terlampaui',
      message: `Total pengeluaran melebihi anggaran sebesar ${Math.abs(summary.variancePercent).toFixed(1)}%`,
      value: summary.variance,
      action: 'Segera lakukan evaluasi dan pengendalian biaya'
    });
  } else if (summary.progress > 90) {
    alerts.push({
      type: 'warning',
      severity: 'medium',
      title: 'Anggaran Mendekati Batas',
      message: `Penggunaan anggaran sudah mencapai ${summary.progress.toFixed(1)}%`,
      value: summary.remaining,
      action: 'Monitor pengeluaran dengan ketat'
    });
  }

  // Category-specific alerts
  if (Array.isArray(categoryBreakdown)) {
    categoryBreakdown.forEach(cat => {
      if (cat.variancePercent > 20) {
        alerts.push({
          type: 'error',
          severity: 'high',
          title: `Kategori ${cat.category} Melampaui Anggaran`,
          message: `Melebihi ${cat.variancePercent.toFixed(1)}% dari anggaran`,
          value: cat.variance,
          category: cat.category,
          action: 'Review item-item dalam kategori ini'
        });
      } else if (cat.variancePercent > 10) {
        alerts.push({
          type: 'warning',
          severity: 'medium',
          title: `Kategori ${cat.category} Perlu Perhatian`,
          message: `Melebihi ${cat.variancePercent.toFixed(1)}% dari anggaran`,
          value: cat.variance,
          category: cat.category,
          action: 'Monitor pengeluaran kategori ini'
        });
      }
    });
  }

  // Item-specific alerts
  if (Array.isArray(rabItems)) {
    const overBudgetItems = rabItems.filter(item => {
      const progress = (item.actualSpent || 0) / (item.totalPrice || 1) * 100;
      return progress > 100;
    });

    if (overBudgetItems.length > 0) {
      alerts.push({
        type: 'info',
        severity: 'low',
        title: 'Item Melebihi Anggaran',
        message: `${overBudgetItems.length} item pekerjaan melebihi anggaran`,
        count: overBudgetItems.length,
        action: 'Lihat detail item yang melebihi anggaran'
      });
    }
  }

  return alerts;
};

/**
 * Calculate variance score (0-100, higher is worse)
 */
export const calculateVarianceScore = (variancePercent) => {
  // Convert variance to a 0-100 score
  // 0% variance = 0 score (perfect)
  // >20% variance = 100 score (worst)
  const absVariance = Math.abs(variancePercent);
  return Math.min(100, (absVariance / 20) * 100);
};

/**
 * Get variance color indicator
 */
export const getVarianceColor = (variancePercent) => {
  if (variancePercent > 20) return 'red';
  if (variancePercent > 10) return 'orange';
  if (variancePercent > 0) return 'yellow';
  if (variancePercent > -10) return 'green';
  return 'blue'; // Very under budget
};

/**
 * Format variance for display
 */
export const formatVariance = (variance, variancePercent) => {
  const isOver = variance > 0;
  const prefix = isOver ? '+' : '';
  
  return {
    amount: variance,
    amountFormatted: `${prefix}Rp ${Math.abs(variance).toLocaleString('id-ID')}`,
    percent: variancePercent,
    percentFormatted: `${prefix}${variancePercent.toFixed(1)}%`,
    isOver,
    label: isOver ? 'Lebih' : 'Kurang'
  };
};

/**
 * Compare current vs previous period
 */
export const comparePerformance = (currentSummary, previousSummary) => {
  if (!previousSummary) return null;

  return {
    spendingChange: currentSummary.totalSpent - previousSummary.totalSpent,
    spendingChangePercent: ((currentSummary.totalSpent - previousSummary.totalSpent) / previousSummary.totalSpent) * 100,
    progressChange: currentSummary.progress - previousSummary.progress,
    varianceChange: currentSummary.variance - previousSummary.variance,
    trend: currentSummary.variance > previousSummary.variance ? 'worsening' : 'improving'
  };
};

/**
 * Generate variance insights
 */
export const generateVarianceInsights = (summary, categoryBreakdown) => {
  const insights = [];

  // Most efficient category
  const efficientCategories = categoryBreakdown
    .filter(cat => cat.variancePercent < -10)
    .sort((a, b) => a.variancePercent - b.variancePercent);

  if (efficientCategories.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Kategori Paling Efisien',
      message: `${efficientCategories[0].category} menghemat ${Math.abs(efficientCategories[0].variancePercent).toFixed(1)}% dari anggaran`,
      category: efficientCategories[0].category
    });
  }

  // Least efficient category
  const inefficientCategories = categoryBreakdown
    .filter(cat => cat.variancePercent > 0)
    .sort((a, b) => b.variancePercent - a.variancePercent);

  if (inefficientCategories.length > 0) {
    insights.push({
      type: 'negative',
      title: 'Kategori Perlu Perhatian',
      message: `${inefficientCategories[0].category} melebihi ${inefficientCategories[0].variancePercent.toFixed(1)}% dari anggaran`,
      category: inefficientCategories[0].category
    });
  }

  // Overall performance
  if (summary.variancePercent < -5) {
    insights.push({
      type: 'info',
      title: 'Performa Anggaran Baik',
      message: `Proyek hemat ${Math.abs(summary.variancePercent).toFixed(1)}% dari total anggaran`
    });
  } else if (summary.variancePercent > 5) {
    insights.push({
      type: 'warning',
      title: 'Performa Anggaran Perlu Perbaikan',
      message: `Proyek melebihi ${summary.variancePercent.toFixed(1)}% dari total anggaran`
    });
  }

  return insights;
};
