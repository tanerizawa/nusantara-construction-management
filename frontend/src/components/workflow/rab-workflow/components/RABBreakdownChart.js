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
  
  const getColorClass = (category) => {
    const color = CATEGORY_COLORS[category];
    const colors = {
      blue: 'bg-[#0A84FF]',
      green: 'bg-[#30D158]',
      yellow: 'bg-[#FF9F0A]',
      purple: 'bg-purple-500',
      gray: 'bg-gray-500'
    };
    return colors[color] || 'bg-gray-500';
  };

  return (
    <div className="bg-[#2C2C2E] rounded-lg  p-4">
      <h3 className="text-lg font-medium text-white mb-4">Breakdown Biaya per Kategori</h3>
      <div className="space-y-3">
        {categories.map(category => {
          const categoryTotal = breakdown[category] || 0;
          const percentage = calculateCategoryPercentage(categoryTotal, totalRAB);
          
          return (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getColorClass(category)}`}></div>
                <span className="text-sm font-medium text-[#98989D]">{category}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-white">
                  {formatCurrency(categoryTotal)}
                </div>
                <div className="text-xs text-[#98989D]">
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
