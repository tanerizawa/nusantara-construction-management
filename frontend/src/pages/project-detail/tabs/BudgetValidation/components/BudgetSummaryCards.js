import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Percent
} from 'lucide-react';
import useBudgetCalculations from '../hooks/useBudgetCalculations';

/**
 * Budget Summary Cards Component
 * Displays 6 key metric cards at the top of budget validation page
 */
const BudgetSummaryCards = ({ summary, loading }) => {
  const { formatCurrency, formatPercent, getHealthColor, getHealthBgColor } = useBudgetCalculations();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-3 animate-pulse">
            <div className="h-3 bg-[#38383A] rounded w-1/2 mb-3"></div>
            <div className="h-6 bg-[#38383A] rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-[#38383A] rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const cards = [
    {
      title: 'Total RAB',
      value: formatCurrency(summary.totalRAB),
      icon: Wallet,
      color: 'blue',
      bgColor: 'bg-[#0A84FF]',
      iconColor: 'text-[#0A84FF]',
      description: 'Total anggaran yang disetujui'
    },
    {
      title: 'Realisasi',
      value: formatCurrency(summary.totalActual),
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-[#30D158]',
      iconColor: 'text-[#30D158]',
      description: `${formatPercent(summary.progress, 1)} dari anggaran`,
      subValue: formatCurrency(summary.totalAdditional),
      subLabel: 'Pengeluaran tambahan'
    },
    {
      title: 'Total Terpakai',
      value: formatCurrency(summary.totalSpent),
      icon: TrendingUp,
      color: 'purple',
      bgColor: 'bg-[#BF5AF2]',
      iconColor: 'text-[#BF5AF2]',
      description: 'Realisasi + Tambahan',
      progress: summary.progress,
      progressLabel: `${formatPercent(summary.progress, 1)} terpakai`
    },
    {
      title: 'Sisa Anggaran',
      value: formatCurrency(summary.remaining),
      icon: summary.remaining >= 0 ? CheckCircle : AlertTriangle,
      color: summary.remaining >= 0 ? 'teal' : 'red',
      bgColor: summary.remaining >= 0 ? 'bg-[#64D2FF]' : 'bg-[#FF453A]',
      iconColor: summary.remaining >= 0 ? 'text-[#64D2FF]' : 'text-[#FF453A]',
      description: summary.remaining >= 0 ? 'Tersedia' : 'Defisit'
    },
    {
      title: 'Selisih',
      value: `${summary.variance >= 0 ? '+' : ''}${formatCurrency(summary.variance)}`,
      icon: Percent,
      color: summary.variance > 0 ? 'orange' : 'green',
      bgColor: summary.variance > 0 ? 'bg-[#FF9F0A]' : 'bg-[#30D158]',
      iconColor: summary.variance > 0 ? 'text-[#FF9F0A]' : 'text-[#30D158]',
      description: summary.variance > 0 ? 'Over budget' : 'Hemat',
      badge: `${summary.variancePercent >= 0 ? '+' : ''}${formatPercent(summary.variancePercent, 1)}`
    },
    {
      title: 'Status',
      value: summary.budgetHealth?.label || 'Sehat',
      icon: summary.budgetHealth?.status === 'healthy' ? CheckCircle : AlertTriangle,
      color: summary.budgetHealth?.color || 'green',
      bgColor: getHealthBgColor(summary.budgetHealth?.status),
      iconColor: getHealthColor(summary.budgetHealth?.status),
      description: getHealthDescription(summary.budgetHealth?.status, summary.progress),
      isStatusCard: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {cards.map((card, index) => (
        <MetricCard key={index} card={card} />
      ))}
    </div>
  );
};

/**
 * Individual Metric Card Component - Compact iOS Style
 */
const MetricCard = ({ card }) => {
  const Icon = card.icon;

  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-3 hover:border-[#0A84FF] transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`p-1.5 ${card.bgColor.replace('bg-', 'bg-').replace('-100', '/20')} rounded-lg`}>
            <Icon className={`${card.iconColor.replace('text-', 'text-').replace('-600', '')} w-4 h-4`} />
          </div>
          <p className="text-xs text-[#8E8E93]">
            {card.title}
          </p>
        </div>
      </div>
      
      <div className="mb-2">
        <h3 className={`text-lg font-bold text-white ${card.isStatusCard ? 'text-base' : ''}`}>
          {card.value}
        </h3>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-[#98989D]">
          {card.description}
        </p>

        {card.badge && (
          <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-semibold ${card.bgColor.replace('-100', '/20')} ${card.iconColor}`}>
            {card.badge}
          </span>
        )}

        {card.subValue && (
          <div className="pt-1.5 border-t border-[#38383A]">
            <p className="text-xs text-[#98989D]">
              {card.subLabel}
            </p>
            <p className="text-sm font-semibold text-white">
              {card.subValue}
            </p>
          </div>
        )}

        {card.progress !== undefined && (
          <div className="pt-1.5">
            <div className="w-full bg-[#38383A] rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  card.progress > 100 ? 'bg-[#FF453A]' :
                  card.progress > 90 ? 'bg-[#FF9F0A]' :
                  card.progress > 75 ? 'bg-[#FFD60A]' :
                  'bg-[#30D158]'
                }`}
                style={{ width: `${Math.min(card.progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-[#98989D] mt-1">
              {card.progressLabel}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Get health status description
 */
const getHealthDescription = (status, progress) => {
  switch (status) {
    case 'healthy':
      return `Anggaran sehat (${progress.toFixed(1)}% terpakai)`;
    case 'warning':
      return `Perhatian: Mendekati batas anggaran`;
    case 'critical':
      return `Kritis: Anggaran hampir habis`;
    case 'over_budget':
      return `Anggaran sudah terlampaui`;
    default:
      return 'Status normal';
  }
};

export default BudgetSummaryCards;
