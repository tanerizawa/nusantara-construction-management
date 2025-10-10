import React from 'react';
import { formatCurrency } from '../utils/budgetFormatters';
import { calculateVariancePercentage, getVarianceColor, getStatusIcon } from '../utils/budgetCalculations';

/**
 * Component table untuk category breakdown
 */
const CategoryTable = ({ categories = [] }) => {
  return (
    <div className="bg-[#2C2C2E] rounded-lg shadow">
      <div className="px-6 py-4 border-b border-[#38383A]">
        <h3 className="text-lg font-medium text-white">Budget by Category</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#38383A]">
          <thead className="bg-[#1C1C1E]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
                Budget
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
                Actual
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
                Variance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#2C2C2E] divide-y divide-[#38383A]">
            {categories.map((category, index) => {
              const variance = calculateVariancePercentage(category.budget, category.actual);
              const StatusIcon = getStatusIcon(Math.abs(variance));
              
              return (
                <tr key={index} className="hover:bg-[#1C1C1E] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {category.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {formatCurrency(category.budget)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {formatCurrency(category.actual)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getVarianceColor(Math.abs(variance))}`}>
                    {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusIcon className={`h-4 w-4 ${getVarianceColor(Math.abs(variance))}`} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;
