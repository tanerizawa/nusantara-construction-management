import React from 'react';
import { CheckCircle, TrendingUp, Clock, FileText } from 'lucide-react';
import { formatCurrency, formatCurrencyCompact } from '../../../utils/formatters';

/**
 * Summary cards untuk payment overview
 * Modern dark theme with gradients and detailed information
 */
const PaymentSummaryCards = ({ summary }) => {
  const cards = [
    {
      label: 'Total Payments',
      value: summary.total || 0,
      subValue: formatCurrencyCompact(summary.totalAmount),
      fullValue: formatCurrency(summary.totalAmount),
      description: 'Total pembayaran',
      icon: FileText,
      gradient: 'from-[#0A84FF]/10 to-[#0A84FF]/5',
      borderColor: 'border-[#0A84FF]/30',
      iconBg: 'bg-[#0A84FF]/20',
      iconColor: 'text-[#0A84FF]',
      valueColor: 'text-white',
      subValueColor: 'text-[#0A84FF]'
    },
    {
      label: 'Paid',
      value: summary.paid || 0,
      subValue: formatCurrencyCompact(summary.paidAmount),
      fullValue: formatCurrency(summary.paidAmount),
      description: `${summary.total > 0 ? Math.round((summary.paid / summary.total) * 100) : 0}% dari total`,
      icon: CheckCircle,
      gradient: 'from-[#30D158]/10 to-[#30D158]/5',
      borderColor: 'border-[#30D158]/30',
      iconBg: 'bg-[#30D158]/20',
      iconColor: 'text-[#30D158]',
      valueColor: 'text-white',
      subValueColor: 'text-[#30D158]'
    },
    {
      label: 'Approved',
      value: summary.approved || 0,
      subValue: formatCurrencyCompact(summary.approvedAmount || 0),
      fullValue: formatCurrency(summary.approvedAmount || 0),
      description: `${summary.total > 0 ? Math.round((summary.approved / summary.total) * 100) : 0}% dari total`,
      icon: TrendingUp,
      gradient: 'from-[#BF5AF2]/10 to-[#BF5AF2]/5',
      borderColor: 'border-[#BF5AF2]/30',
      iconBg: 'bg-[#BF5AF2]/20',
      iconColor: 'text-[#BF5AF2]',
      valueColor: 'text-white',
      subValueColor: 'text-[#BF5AF2]'
    },
    {
      label: 'Pending',
      value: summary.pending || 0,
      subValue: formatCurrencyCompact(summary.pendingAmount),
      fullValue: formatCurrency(summary.pendingAmount),
      description: `${summary.total > 0 ? Math.round((summary.pending / summary.total) * 100) : 0}% dari total`,
      icon: Clock,
      gradient: 'from-[#FFD60A]/10 to-[#FFD60A]/5',
      borderColor: 'border-[#FFD60A]/30',
      iconBg: 'bg-[#FFD60A]/20',
      iconColor: 'text-[#FFD60A]',
      valueColor: 'text-white',
      subValueColor: 'text-[#FFD60A]'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div 
            key={index} 
            className={`bg-gradient-to-br ${card.gradient} border ${card.borderColor} rounded-xl p-4 hover:scale-[1.02] transition-all duration-200 cursor-pointer`}
            title={card.fullValue}
          >
            {/* Header with Icon */}
            <div className="flex items-center justify-between mb-3">
              <div className={`${card.iconBg} rounded-lg p-2`}>
                <Icon size={18} className={card.iconColor} />
              </div>
              <span className="text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
                {card.label}
              </span>
            </div>
            
            {/* Main Value (Count) */}
            <div className="mb-2">
              <p className={`text-3xl font-bold ${card.valueColor} leading-none`}>
                {card.value}
              </p>
            </div>
            
            {/* Sub Value (Amount) */}
            <div className="mb-1">
              <p className={`text-base font-semibold ${card.subValueColor}`}>
                {card.subValue}
              </p>
            </div>
            
            {/* Description */}
            <div className="pt-2 border-t border-white/10">
              <p className="text-xs text-[#8E8E93]">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PaymentSummaryCards;
