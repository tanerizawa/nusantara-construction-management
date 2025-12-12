import React from 'react';
import { formatCurrency } from '../../../../utils/formatters';
import { calculateTotalRAB } from '../utils/rabCalculations';

/**
 * RABSummaryCards Component
 * Displays summary statistics for RAP items
 */
const RABSummaryCards = ({ rabItems, approvalStatus }) => {
  const totalRAB = calculateTotalRAB(rabItems);
  
  const cards = [
    { label: 'Total Item', value: rabItems.length, gradient: 'from-[#60a5fa]/30 to-[#2563eb]/20', text: 'text-[#bfdbfe]' },
    { label: 'Total RAP', value: formatCurrency(totalRAB), gradient: 'from-[#34d399]/30 to-[#22c55e]/20', text: 'text-[#bbf7d0]' },
    { label: 'Langkah Aktif', value: approvalStatus?.currentStep || '-', gradient: 'from-[#fbbf24]/30 to-[#f97316]/20', text: 'text-[#fde68a]' },
    { label: 'Progres Approval', value: `${approvalStatus?.progress || 0}%`, gradient: 'from-[#c084fc]/30 to-[#a855f7]/20', text: 'text-[#f3e8ff]' }
  ];
  
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_15px_35px_rgba(0,0,0,0.35)]">
          <div className={`inline-flex items-center rounded-2xl bg-gradient-to-br ${card.gradient} px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em]`}>
            {card.label}
          </div>
          <p className={`mt-3 text-2xl font-semibold ${card.text}`}>
            {card.value}
          </p>
          <p className="text-xs text-white/50">RAP Management</p>
        </div>
      ))}
    </div>
  );
};

export default RABSummaryCards;
