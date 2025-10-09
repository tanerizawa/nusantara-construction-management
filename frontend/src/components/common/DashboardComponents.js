import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Common Loading Component - Apple HIG Style
export const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center h-64 bg-[#1C1C1E]">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A84FF]"></div>
      <span className="mt-3 text-[#98989D] text-sm">{message}</span>
    </div>
  </div>
);

// Common Error Component - Apple HIG Style
export const ErrorDisplay = ({ error, onRetry, title = "Error Loading Data" }) => (
  <div className="flex items-center justify-center h-64 bg-[#1C1C1E]">
    <div className="text-center">
      <AlertCircle className="h-16 w-16 text-[#FF453A] mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-[#98989D] mb-4">{error}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-5 py-2.5 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0970DD] transition-colors duration-150 flex items-center gap-2 mx-auto focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      )}
    </div>
  </div>
);

// Common Chart Placeholder - Apple HIG Style
export const ChartPlaceholder = ({ height = "h-64", title = "Chart" }) => (
  <div className={`${height} flex items-center justify-center bg-[#2C2C2E] rounded-xl border-2 border-dashed border-[#38383A]`}>
    <div className="text-center text-[#636366]">
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs">No data available</div>
    </div>
  </div>
);

// Common Stats Card - Apple HIG Style
export const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'blue', 
  trend,
  onClick 
}) => {
  const colorClasses = {
    blue: 'text-[#0A84FF] bg-[#0A84FF]/10',
    green: 'text-[#30D158] bg-[#30D158]/10',
    red: 'text-[#FF453A] bg-[#FF453A]/10',
    yellow: 'text-[#FF9F0A] bg-[#FF9F0A]/10',
    purple: 'text-[#BF5AF2] bg-[#BF5AF2]/10',
    gray: 'text-[#98989D] bg-[#98989D]/10'
  };

  return (
    <div 
      className={`bg-[#2C2C2E] border border-[#38383A] rounded-xl p-5 hover:border-[#48484A] transition-colors duration-150 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#98989D] truncate mb-2">{title}</p>
          <p className="text-2xl font-bold text-white mb-1">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
          {subtitle && (
            <p className="text-sm text-[#636366]">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium ${trend.startsWith('+') ? 'text-[#30D158]' : 'text-[#FF453A]'}`}>
                {trend}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
};

// Format number utility
const formatNumber = (num) => {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// Format currency utility  
export const formatCurrency = (amount, currency = 'IDR') => {
  if (!amount || isNaN(amount)) return 'Rp 0';
  
  const numAmount = parseFloat(amount);
  
  if (numAmount >= 1000000000) {
    return `Rp ${(numAmount / 1000000000).toFixed(1)}B`;
  } else if (numAmount >= 1000000) {
    return `Rp ${(numAmount / 1000000).toFixed(1)}M`;
  } else if (numAmount >= 1000) {
    return `Rp ${(numAmount / 1000).toFixed(1)}K`;
  }
  return `Rp ${numAmount.toLocaleString('id-ID')}`;
};

// Empty state component - Apple HIG Style
export const EmptyState = ({ 
  title = "No data available", 
  description = "There is no data to display at the moment.",
  icon: Icon,
  action
}) => (
  <div className="text-center py-12 bg-[#2C2C2E] border border-[#38383A] rounded-xl">
    {Icon && <Icon className="h-12 w-12 text-[#636366] mx-auto mb-4" />}
    <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
    <p className="text-[#98989D] mb-4">{description}</p>
    {action}
  </div>
);