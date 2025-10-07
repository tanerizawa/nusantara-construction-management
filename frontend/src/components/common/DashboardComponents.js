import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Common Loading Component
export const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">{message}</span>
  </div>
);

// Common Error Component
export const ErrorDisplay = ({ error, onRetry, title = "Error Loading Data" }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{error}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      )}
    </div>
  </div>
);

// Common Chart Placeholder
export const ChartPlaceholder = ({ height = "h-64", title = "Chart" }) => (
  <div className={`${height} flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200`}>
    <div className="text-center text-gray-500">
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs">No data available</div>
    </div>
  </div>
);

// Common Stats Card
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
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    purple: 'text-purple-600 bg-purple-50',
    gray: 'text-gray-600 bg-gray-50'
  };

  return (
    <div 
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 truncate">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
              <span className="text-xs text-gray-500 ml-1">from last period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
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

// Empty state component
export const EmptyState = ({ 
  title = "No data available", 
  description = "There is no data to display at the moment.",
  icon: Icon,
  action
}) => (
  <div className="text-center py-12">
    {Icon && <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />}
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 mb-4">{description}</p>
    {action}
  </div>
);