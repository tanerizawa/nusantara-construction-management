import React from 'react';
import { getUniqueCategories } from '../utils/rabCalculations';

/**
 * RABStatistics Component
 * Displays statistical overview of RAP
 */
const RABStatistics = ({ rabItems, approvalStatus }) => {
  const uniqueCategories = getUniqueCategories(rabItems);
  
  const items = [
    {
      label: 'Total Item',
      value: rabItems.length,
      gradient: 'from-[#60a5fa]/25 to-[#7c3aed]/15'
    },
    {
      label: 'Status RAP',
      value: approvalStatus?.status === 'approved' ? 'Disetujui' : 'Draft',
      gradient: 'from-[#34d399]/25 to-[#22c55e]/15'
    },
    {
      label: 'Kategori',
      value: uniqueCategories,
      gradient: 'from-[#fbbf24]/25 to-[#f97316]/15'
    }
  ];
  
  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-5 shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
      <h3 className="text-base font-semibold text-white">Statistik RAP</h3>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-[#05070d] p-4">
            <div className={`inline-flex rounded-full bg-gradient-to-r ${item.gradient} px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/90`}>
              {item.label}
            </div>
            <p className="mt-2 text-xl font-semibold text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RABStatistics;
