import React from 'react';
import { formatCurrency } from '../utils/budgetFormatters';

/**
 * Component untuk progress bar utilization
 */
const BudgetUtilization = ({ summary = {} }) => {
  const { totalBudget = 1, committedAmount = 0, actualSpent = 0 } = summary;

  return (
    <div className="bg-[#2C2C2E] rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-white mb-4">Budget Utilization</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-[#8E8E93] mb-1">
            <span>Committed ({formatCurrency(committedAmount)})</span>
            <span>{((committedAmount / totalBudget) * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-[#48484A] rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((committedAmount / totalBudget) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm text-[#8E8E93] mb-1">
            <span>Actual Spent ({formatCurrency(actualSpent)})</span>
            <span>{((actualSpent / totalBudget) * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-[#48484A] rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((actualSpent / totalBudget) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetUtilization;
