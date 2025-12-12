import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Common Loading Component - Apple HIG Style
export const LoadingSpinner = ({ message = "Memuat..." }) => (
  <div className="flex items-center justify-center h-64 bg-[#1C1C1E]">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A84FF]"></div>
      <span className="mt-3 text-[#98989D] text-sm">{message}</span>
    </div>
  </div>
);

// Common Error Component - Apple HIG Style
export const ErrorDisplay = ({ error, onRetry, title = "Kesalahan Memuat Data" }) => (
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
          Muat Ulang
        </button>
      )}
    </div>
  </div>
);

// Common Chart Placeholder - Apple HIG Style
export const ChartPlaceholder = ({ height = "h-64", title = "Grafik" }) => (
  <div className={`${height} flex items-center justify-center bg-[#2C2C2E] rounded-xl border-2 border-dashed border-[#38383A]`}>
    <div className="text-center text-[#636366]">
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs">Data tidak tersedia</div>
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
  onClick,
  urgent = false
}) => {
  const getTrendTone = () => {
    if (!trend) return 'text-white/70';
    if (trend.includes('⚠️') || trend.toLowerCase().includes('mendesak') || trend.toLowerCase().includes('terlambat')) {
      return 'text-[#facc15]';
    }
    if (trend.startsWith('+') || trend.toLowerCase().includes('tersisa')) {
      return 'text-[#34d399]';
    }
    return 'text-white/70';
  };

  const iconBackgrounds = {
    blue: 'text-[#60a5fa]',
    green: 'text-[#34d399]',
    red: 'text-[#fb7185]',
    yellow: 'text-[#facc15]',
    orange: 'text-[#f97316]',
    purple: 'text-[#c084fc]',
    cyan: 'text-[#67e8f9]',
    indigo: 'text-[#818cf8]',
    gray: 'text-[#94a3b8]'
  };

  const panelGlows = {
    blue: 'from-[#60a5fa1f] via-transparent to-transparent',
    green: 'from-[#34d3991f] via-transparent to-transparent',
    red: 'from-[#fb71851f] via-transparent to-transparent',
    yellow: 'from-[#facc151f] via-transparent to-transparent',
    orange: 'from-[#fb923c1f] via-transparent to-transparent',
    purple: 'from-[#c084fc1f] via-transparent to-transparent',
    cyan: 'from-[#67e8f91f] via-transparent to-transparent',
    indigo: 'from-[#818cf81f] via-transparent to-transparent',
    gray: 'from-[#94a3b81f] via-transparent to-transparent'
  };

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-[rgba(12,16,24,0.85)] p-5 transition-all duration-300 ${
        urgent 
          ? 'shadow-[0_0_35px_rgba(248,113,113,0.35)] ring-1 ring-[#fb7185]/40' 
          : 'hover:-translate-y-1 hover:shadow-[0_25px_45px_rgba(0,0,0,0.45)]'
      } ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${panelGlows[color] || panelGlows.blue} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/50 mb-2 break-words">{title}</p>
          <p className="text-2xl font-semibold text-white mb-1 break-words">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
          {subtitle && (
            <p className="text-sm text-white/60 break-words">{subtitle}</p>
          )}
          {trend && (
            <div className={`mt-3 inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs ${getTrendTone()}`}>
              {trend}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg ${iconBackgrounds[color] || iconBackgrounds.blue}`}>
            <Icon className="h-5 w-5" />
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
  title = "Data tidak tersedia", 
  description = "Tidak ada data untuk ditampilkan saat ini.",
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
