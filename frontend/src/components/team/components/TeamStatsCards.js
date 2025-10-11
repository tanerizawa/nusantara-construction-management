import React from 'react';
import { Users, DollarSign, Clock, Award } from 'lucide-react';
import { formatCurrencyCompact } from '../../../utils/formatters';

/**
 * Team Statistics Cards with modern dark theme and gradients
 * Matches PaymentSummaryCards design standard
 */
const TeamStatsCards = ({ teamStats }) => {
  // Calculate percentages
  const activePercentage = teamStats.totalMembers > 0 
    ? ((teamStats.activeMembers / teamStats.totalMembers) * 100).toFixed(0)
    : 0;

  const cards = [
    {
      icon: Users,
      label: 'Total Anggota',
      value: teamStats.totalMembers,
      subValue: `${teamStats.activeMembers} aktif`,
      description: `${activePercentage}% aktif`,
      gradient: 'from-[#0A84FF]/10 to-[#0A84FF]/5',
      borderColor: 'border-[#0A84FF]/30',
      iconBg: 'bg-[#0A84FF]/20',
      iconColor: 'text-[#0A84FF]',
      valueColor: 'text-white',
      subValueColor: 'text-[#0A84FF]'
    },
    {
      icon: DollarSign,
      label: 'Total Cost',
      value: formatCurrencyCompact(teamStats.totalCost),
      subValue: teamStats.totalMembers > 0 ? `${teamStats.totalMembers} anggota` : 'Belum ada data',
      description: 'Total biaya anggota',
      gradient: 'from-[#30D158]/10 to-[#30D158]/5',
      borderColor: 'border-[#30D158]/30',
      iconBg: 'bg-[#30D158]/20',
      iconColor: 'text-[#30D158]',
      valueColor: 'text-white',
      subValueColor: 'text-[#30D158]'
    },
    {
      icon: Clock,
      label: 'Total Hours',
      value: teamStats.totalHours.toLocaleString('id-ID'),
      subValue: teamStats.totalMembers > 0 ? `${teamStats.totalMembers} anggota` : 'Belum ada data',
      description: 'Total jam kerja',
      gradient: 'from-[#FFD60A]/10 to-[#FFD60A]/5',
      borderColor: 'border-[#FFD60A]/30',
      iconBg: 'bg-[#FFD60A]/20',
      iconColor: 'text-[#FFD60A]',
      valueColor: 'text-white',
      subValueColor: 'text-[#FFD60A]'
    },
    {
      icon: Award,
      label: 'Avg Performance',
      value: `${teamStats.avgPerformance.toFixed(1)}%`,
      subValue: teamStats.totalMembers > 0 ? `${teamStats.totalMembers} anggota` : 'Belum ada data',
      description: 'Rata-rata performa',
      gradient: 'from-[#BF5AF2]/10 to-[#BF5AF2]/5',
      borderColor: 'border-[#BF5AF2]/30',
      iconBg: 'bg-[#BF5AF2]/20',
      iconColor: 'text-[#BF5AF2]',
      valueColor: 'text-white',
      subValueColor: 'text-[#BF5AF2]'
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
            
            {/* Main Value */}
            <div className="mb-2">
              <p className={`text-3xl font-bold ${card.valueColor} leading-none`}>
                {card.value}
              </p>
            </div>
            
            {/* Sub Value */}
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

export default TeamStatsCards;
