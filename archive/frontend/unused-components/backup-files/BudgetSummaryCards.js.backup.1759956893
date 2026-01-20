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
    committedAmount = 0,
    actualSpent = 0,
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
      value: formatCurrency(committedAmount),
      percentage: ((committedAmount / totalBudget) * 100).toFixed(1),
      icon: Activity,
      color: 'text-[#FF9F0A]'
    },
    {
      label: 'Actual Spent',
      value: formatCurrency(actualSpent),
      percentage: ((actualSpent / totalBudget) * 100).toFixed(1),
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-[#2C2C2E] rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8E8E93]">{card.label}</p>
                <p className={`text-2xl font-bold ${card.color}`}>
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
                      <TrendingUp className={`h-4 w-4 mr-1 ${getVarianceColor(Math.abs(card.variance))}`} />
                    ) : (
                      <TrendingDown className={`h-4 w-4 mr-1 ${getVarianceColor(Math.abs(card.variance))}`} />
                    )}
                    <span className={`text-xs ${getVarianceColor(Math.abs(card.variance))}`}>
                      {Math.abs(card.variance).toFixed(1)}% variance
                    </span>
                  </div>
                )}
              </div>
              <Icon className={`h-8 w-8 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetSummaryCards;
