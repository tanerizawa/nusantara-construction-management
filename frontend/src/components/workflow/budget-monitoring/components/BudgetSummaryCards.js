import React from 'react';
import { Target, Activity, DollarSign, Calculator, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/budgetFormatters';
import { getVarianceColor } from '../config/budgetConfig';

/**
 * Summary cards component untuk budget overview
 */
const BudgetSummaryCards = ({ summary = {} }) => {
  const {
    totalBudget = 0,
    totalCommitted = 0,
    totalActual = 0,
    remainingBudget = 0,
    variancePercentage = 0
  } = summary;

  const cards = [
    {
      label: 'Total Budget',
      value: formatCurrency(totalBudget),
      icon: Target,
      color: 'text-[#0A84FF]'
    },
    {
      label: 'Committed',
      value: formatCurrency(totalCommitted),
      percentage: ((totalCommitted / totalBudget) * 100).toFixed(1),
      icon: Activity,
      color: 'text-[#FF9F0A]'
    },
    {
      label: 'Actual Spent',
      value: formatCurrency(totalActual),
      percentage: ((totalActual / totalBudget) * 100).toFixed(1),
      icon: DollarSign,
      color: 'text-[#30D158]'
    },
    {
      label: 'Remaining',
      value: formatCurrency(remainingBudget),
      variance: variancePercentage,
      icon: Calculator,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-[#2C2C2E] rounded-lg shadow p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#8E8E93] mb-1">{card.label}</p>
                <p className={`text-base md:text-lg font-bold ${card.color} break-words`}>
                  {card.value}
                </p>
                {card.percentage && (
                  <p className="text-xs text-[#98989D] mt-1">
                    {card.percentage}% of budget
                  </p>
                )}
                {card.variance !== undefined && (
                  <div className="flex items-center mt-1">
                    {card.variance > 0 ? (
                      <TrendingUp className={`h-3 w-3 mr-1 flex-shrink-0 ${getVarianceColor(Math.abs(card.variance))}`} />
                    ) : (
                      <TrendingDown className={`h-3 w-3 mr-1 flex-shrink-0 ${getVarianceColor(Math.abs(card.variance))}`} />
                    )}
                    <span className={`text-xs ${getVarianceColor(Math.abs(card.variance))}`}>
                      {Math.abs(card.variance).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
              <Icon className={`h-6 w-6 flex-shrink-0 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetSummaryCards;
