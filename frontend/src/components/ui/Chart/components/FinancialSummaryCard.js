import React from 'react';
import ChartContainer from './ChartContainer';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercentage, calculatePercentage } from '../utils/chartUtils';

/**
 * FinancialSummaryCard Component
 * Card for summarizing financial metrics with trends
 *
 * @param {object} props - Component props
 * @param {string} props.title - Card title
 * @param {string} props.subtitle - Card subtitle
 * @param {number} props.currentValue - Current value
 * @param {number} props.previousValue - Previous value for comparison
 * @param {string} props.label - Label for the value
 * @param {boolean} props.inverse - Inverse trend interpretation (true = down is good)
 * @param {boolean} props.isCurrency - Format as currency
 */
const FinancialSummaryCard = ({
  title,
  subtitle,
  currentValue = 0,
  previousValue = 0,
  label = '',
  inverse = false,
  isCurrency = true
}) => {
  // Calculate change and percentage
  const change = currentValue - previousValue;
  const changePercentage = previousValue !== 0 
    ? calculatePercentage(Math.abs(change), previousValue)
    : 0;
  
  // Determine trend
  const hasIncrease = change > 0;
  const isPositiveTrend = inverse ? !hasIncrease : hasIncrease;
  
  // Format the value based on type
  const formattedValue = isCurrency 
    ? formatCurrency(currentValue)
    : formatPercentage(currentValue);
  
  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      height="h-48"
    >
      <div className="p-6 flex flex-col justify-between h-full">
        <div>
          <div className="text-3xl font-semibold">
            {formattedValue}
          </div>
          {label && (
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          )}
        </div>
        
        {previousValue > 0 && (
          <div className={`flex items-center mt-4 ${
            isPositiveTrend ? 'text-green-600' : 'text-red-600'
          }`}>
            {hasIncrease ? (
              <TrendingUp size={16} className="mr-1" />
            ) : (
              <TrendingDown size={16} className="mr-1" />
            )}
            <span className="text-sm font-medium">
              {isCurrency ? formatCurrency(Math.abs(change)) : formatPercentage(Math.abs(change))}
              &nbsp;
              ({formatPercentage(changePercentage)})
              &nbsp;
              {hasIncrease ? 'higher' : 'lower'} than previous period
            </span>
          </div>
        )}
      </div>
    </ChartContainer>
  );
};

export default FinancialSummaryCard;