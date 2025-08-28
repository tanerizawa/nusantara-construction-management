// Performance utilities untuk optimisasi aplikasi
import React, { memo, useMemo, useState, useEffect, lazy, Component } from 'react';

// Lazy loading untuk components besar
export const LazyFinanceManagement = lazy(() => import('../components/FinanceManagement'));
export const LazyTaxManagement = lazy(() => import('../components/TaxManagement'));
export const LazyPerformanceAnalytics = lazy(() => import('../components/PerformanceAnalytics'));
export const LazyAttendancePayroll = lazy(() => import('../components/AttendancePayroll'));

// Loading component yang dapat digunakan kembali
export const LoadingSpinner = memo(({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
    </div>
  );
});

// Error Boundary Component
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-64 p-8">
          <div className="text-red-600 text-lg font-semibold mb-4">Something went wrong</div>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Memoized Table Component untuk performa yang lebih baik
export const OptimizedTable = memo(({ data, columns, renderRow }) => {
  const memoizedRows = useMemo(() => {
    return data.map((item, index) => renderRow(item, index));
  }, [data, renderRow]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="text-left py-4 px-6 font-medium text-gray-600 text-sm">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {memoizedRows}
        </tbody>
      </table>
    </div>
  );
});

// Hook untuk optimized search dan filtering
export const useOptimizedFilter = (data, searchTerm, filters) => {
  return useMemo(() => {
    return data.filter(item => {
      const matchesSearch = searchTerm === '' || 
        Object.values(item).some(value => 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        return value === '' || item[key] === value;
      });

      return matchesSearch && matchesFilters;
    });
  }, [data, searchTerm, filters]);
};

// Currency formatter dengan caching
const currencyFormatterCache = new Map();

export const formatCurrency = (amount) => {
  const key = amount.toString();
  if (currencyFormatterCache.has(key)) {
    return currencyFormatterCache.get(key);
  }
  
  const formatted = `Rp ${(amount / 1000000000).toFixed(1)}B`;
  currencyFormatterCache.set(key, formatted);
  return formatted;
};

// Debounced search hook
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const performanceUtils = {
  LazyFinanceManagement,
  LazyTaxManagement,
  LazyPerformanceAnalytics,
  LazyAttendancePayroll,
  LoadingSpinner,
  ErrorBoundary,
  OptimizedTable,
  useOptimizedFilter,
  formatCurrency,
  useDebounce
};

export default performanceUtils;
