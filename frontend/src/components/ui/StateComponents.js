import React from 'react';
import { AlertTriangle, RefreshCw, FileX, Plus } from 'lucide-react';
import Button from './Button';

/**
 * Professional Loading State Component
 * Apple HIG inspired loading with clean spinner
 */
export const LoadingState = ({ message = 'Memuat data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      {/* Apple-style Loading Spinner */}
      <div className="relative w-16 h-16">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-[#2C2C2E] rounded-full"></div>
        {/* Animated spinner */}
        <div className="absolute inset-0 border-4 border-transparent border-t-[#0A84FF] rounded-full animate-spin"></div>
      </div>
      
      {/* Loading text */}
      <div className="text-center space-y-1">
        <p className="text-white font-medium">{message}</p>
        <p className="text-[#98989D] text-sm">Mohon tunggu sebentar</p>
      </div>
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
      iconColor: 'text-[#8E8E93]',
      bgColor: 'bg-[#2C2C2E]'
    },
    'no-results': {
      icon: FileX,
      defaultTitle: 'Tidak ada hasil ditemukan',
      defaultDescription: 'Coba ubah filter pencarian atau buat proyek baru',
      iconColor: 'text-[#0A84FF]',
      bgColor: 'bg-[#0A84FF]/10'
    },
    'error': {
      icon: AlertTriangle,
      defaultTitle: 'Terjadi kesalahan',
      defaultDescription: 'Gagal memuat data. Silakan coba lagi',
      iconColor: 'text-[#FF453A]',
      bgColor: 'bg-[#FF453A]/10'
    }
  };

  const config = configs[type] || configs['no-data'];
  const Icon = config.icon;

  return (
    <div className="text-center py-12">
      <div className={`inline-flex items-center justify-center w-16 h-16 ${config.bgColor} rounded-full mb-4`}>
        <Icon className={`h-8 w-8 ${config.iconColor}`} />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        {title || config.defaultTitle}
      </h3>
      
      <p className="text-[#98989D] mb-6 max-w-md mx-auto">
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
      <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF453A]/10 rounded-full mb-4">
        <AlertTriangle className="h-8 w-8 text-[#FF453A]" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        {title}
      </h3>
      
      <p className="text-[#98989D] mb-6 max-w-md mx-auto">
        {error?.message || 'Terjadi kesalahan saat memuat data. Silakan coba lagi.'}
      </p>
      
      {showDetails && error?.stack && (
        <details className="mb-6 text-left max-w-2xl mx-auto">
          <summary className="cursor-pointer text-sm text-[#8E8E93] hover:text-[#98989D]">
            Detail teknis
          </summary>
          <pre className="mt-2 p-4 bg-[#2C2C2E] rounded-lg text-xs overflow-auto text-[#98989D]">
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
 * Apple HIG Design
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
    blue: {
      bg: 'bg-[#0A84FF]/10',
      text: 'text-[#0A84FF]',
      icon: 'text-[#0A84FF]'
    },
    green: {
      bg: 'bg-[#30D158]/10',
      text: 'text-[#30D158]',
      icon: 'text-[#30D158]'
    },
    yellow: {
      bg: 'bg-[#FF9F0A]/10',
      text: 'text-[#FF9F0A]',
      icon: 'text-[#FF9F0A]'
    },
    red: {
      bg: 'bg-[#FF453A]/10',
      text: 'text-[#FF453A]',
      icon: 'text-[#FF453A]'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-[#2C2C2E] rounded-xl border border-[#38383A] p-6 hover:border-[#48484A] transition-colors duration-150">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-[#98989D]">
            {title}
          </p>
          <p className="text-2xl font-bold text-white mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-[#636366] mt-1">
              {subtitle}
            </p>
          )}
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-lg ${colors.bg}`}>
            <Icon className={`h-6 w-6 ${colors.icon}`} />
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-medium ${
            trend.direction === 'up' 
              ? 'text-[#30D158]' 
              : trend.direction === 'down' 
                ? 'text-[#FF453A]' 
                : 'text-[#98989D]'
          }`}>
            {trend.value}
          </span>
          <span className="text-[#98989D] ml-1">
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
};
// Cache cleared at Wed Oct  8 07:41:07 PM UTC 2025
