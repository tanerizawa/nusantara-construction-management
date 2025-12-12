import React from 'react';
import { formatCurrency } from '../../../../utils/formatters';
import { calculateCategoryBreakdown, calculateTotalRAB, calculateCategoryPercentage } from '../utils/rabCalculations';
import { CATEGORY_COLORS } from '../config/rabCategories';

/**
 * RABBreakdownChart Component
 * Displays cost breakdown by category
 */
const RABBreakdownChart = ({ rabItems }) => {
  const totalRAB = calculateTotalRAB(rabItems);
  const breakdown = calculateCategoryBreakdown(rabItems);
  
  const categories = Object.keys(CATEGORY_COLORS);
  
  const getColorStyle = (category) => {
    const color = CATEGORY_COLORS[category];
    const colors = {
      blue: 'bg-[#60a5fa]',
      green: 'bg-[#34d399]',
      yellow: 'bg-[#fbbf24]',
      purple: 'bg-[#c084fc]',
      gray: 'bg-[#94a3b8]'
    };
    return colors[color] || 'bg-[#94a3b8]';
  };

  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-5 shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
      <h3 className="text-base font-semibold text-white">Breakdown Biaya per Kategori</h3>
      <div className="mt-4 space-y-3">
        {categories.map(category => {
          const categoryTotal = breakdown[category] || 0;
          const percentage = calculateCategoryPercentage(categoryTotal, totalRAB);
          
          return (
            <div key={category} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#05070d] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${getColorStyle(category)}`} />
                <span className="text-sm font-medium text-white/80">{category}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-white">
                  {formatCurrency(categoryTotal)}
                </div>
                <div className="text-xs text-white/50">
                  {percentage}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RABBreakdownChart;
