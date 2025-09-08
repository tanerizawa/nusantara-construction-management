import React from 'react';
import { AlertTriangle, RefreshCw, FileX, Plus } from 'lucide-react';
import Button from './Button';

/**
 * Professional Loading State Component
 * Provides consistent loading experience across the application
 */
export const LoadingState = ({ type = 'grid', count = 6 }) => {
  if (type === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 animate-pulse"
          >
            {/* Header skeleton */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 pr-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
            </div>
            
            {/* Content skeleton */}
            <div className="space-y-2 mb-3">
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
            </div>
            
            {/* Progress skeleton */}
            <div className="space-y-2 mb-3">
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-12"></div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
            </div>
            
            {/* Actions skeleton */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
              <div className="flex space-x-1">
                <div className="h-7 w-7 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div className="h-7 w-7 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div className="h-7 w-7 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse"
        >
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-600 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Professional Empty State Component
 * Provides contextual empty states with clear actions
 */
export const EmptyState = ({ 
  type = 'no-data',
  title,
  description,
  action,
  onAction,
  hasFilters = false,
  onResetFilters
}) => {
  const configs = {
    'no-data': {
      icon: FileX,
      defaultTitle: 'Belum ada proyek',
      defaultDescription: 'Mulai dengan membuat proyek konstruksi pertama Anda',
      iconColor: 'text-gray-400',
      bgColor: 'bg-gray-50'
    },
    'no-results': {
      icon: FileX,
      defaultTitle: 'Tidak ada hasil ditemukan',
      defaultDescription: 'Coba ubah filter pencarian atau buat proyek baru',
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-50'
    },
    'error': {
      icon: AlertTriangle,
      defaultTitle: 'Terjadi kesalahan',
      defaultDescription: 'Gagal memuat data. Silakan coba lagi',
      iconColor: 'text-red-400',
      bgColor: 'bg-red-50'
    }
  };

  const config = configs[type] || configs['no-data'];
  const Icon = config.icon;

  return (
    <div className="text-center py-12">
      <div className={`inline-flex items-center justify-center w-16 h-16 ${config.bgColor} rounded-full mb-4`}>
        <Icon className={`h-8 w-8 ${config.iconColor}`} />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title || config.defaultTitle}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {description || config.defaultDescription}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {hasFilters && onResetFilters && (
          <Button
            onClick={onResetFilters}
            variant="outline"
            className="inline-flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Filter
          </Button>
        )}
        
        {action && onAction && (
          <Button
            onClick={onAction}
            className="inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {action}
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * Professional Error State Component
 * Provides user-friendly error handling with recovery options
 */
export const ErrorState = ({ 
  error, 
  onRetry, 
  onReportIssue,
  title = 'Terjadi kesalahan',
  showDetails = false 
}) => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {error?.message || 'Terjadi kesalahan saat memuat data. Silakan coba lagi.'}
      </p>
      
      {showDetails && error?.stack && (
        <details className="mb-6 text-left max-w-2xl mx-auto">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            Detail teknis
          </summary>
          <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs overflow-auto">
            {error.stack}
          </pre>
        </details>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="inline-flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </Button>
        )}
        
        {onReportIssue && (
          <Button
            onClick={onReportIssue}
            variant="ghost"
            className="inline-flex items-center gap-2"
          >
            Laporkan Masalah
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * Stats Card Component for Dashboard Metrics
 */
export const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon: Icon,
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-medium ${
            trend.direction === 'up' 
              ? 'text-green-600' 
              : trend.direction === 'down' 
                ? 'text-red-600' 
                : 'text-gray-600'
          }`}>
            {trend.value}
          </span>
          <span className="text-gray-600 dark:text-gray-400 ml-1">
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
};
