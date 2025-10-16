import React from 'react';
import ChartContainer from './ChartContainer';
import { formatCurrency, formatPercentage } from '../utils/chartUtils';
import { TrendingDown } from 'lucide-react';
import { CHART_COLORS } from '../config/chartConfig';

/**
 * BudgetChart Component
 * Visualizes budget tracking for projects
 *
 * @param {object} props - Component props
 * @param {string} props.projectId - Project ID
 * @param {number} props.contractValue - Contract value
 * @param {number} props.actualCost - Actual cost to date
 * @param {number} props.estimatedCost - Estimated total cost
 * @param {array} props.costBreakdown - Cost breakdown by category
 * @param {boolean} props.showProjections - Show cost projections
 */
const BudgetChart = ({
  projectId,
  contractValue = 0,
  actualCost = 0,
  estimatedCost = 0,
  costBreakdown = [],
  showProjections = true
}) => {
  const remaining = contractValue - actualCost;
  const percentage = contractValue > 0 ? (actualCost / contractValue) * 100 : 0;
  const isOverBudget = actualCost > contractValue;
  
  return (
    <ChartContainer
      title="Budget Tracking"
      subtitle={`Contract: ${formatCurrency(contractValue)} • Spent: ${formatCurrency(actualCost)}`}
      height="h-80"
    >
      <div className="p-6">
        {/* Budget Overview Bars */}
        <div className="space-y-4 mb-6">
          {/* Contract vs Actual */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Biaya Aktual</span>
              <span className="text-sm font-medium">{formatPercentage(percentage)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  isOverBudget 
                    ? 'bg-red-500' 
                    : percentage > 80 
                    ? 'bg-orange-500' 
                    : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
          </div>
          
          {/* Estimated vs Contract */}
          {showProjections && estimatedCost > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Proyeksi Total</span>
                <span className="text-sm font-medium">
                  {formatPercentage((estimatedCost / contractValue) * 100)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((estimatedCost / contractValue) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Cost Breakdown */}
        {costBreakdown.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Rincian Biaya</h4>
            <div className="space-y-2">
              {costBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">{item.category}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">{formatCurrency(item.amount)}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({formatPercentage((item.amount / actualCost) * 100)})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budget Status Alert */}
        {isOverBudget && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center">
              <TrendingDown size={16} className="text-red-600 mr-2" />
              <span className="text-sm font-medium text-red-800">
                Anggaran terlampaui sebesar {formatCurrency(Math.abs(remaining))}
              </span>
            </div>
          </div>
        )}
      </div>
    </ChartContainer>
  );
};

export default BudgetChart;