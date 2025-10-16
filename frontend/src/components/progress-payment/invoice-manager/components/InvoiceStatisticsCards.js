import React from 'react';
import { STATS_CONFIG } from '../config/invoiceConfig';
import { formatCurrencyCompact } from '../../../../utils/formatters';

/**
 * Invoice Statistics Cards Component
 */
const InvoiceStatisticsCards = ({ statistics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {STATS_CONFIG.map(stat => {
        const Icon = stat.icon;
        return (
          <div 
            key={stat.key}
            className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg ${stat.color.split(' ')[0]}/20 flex items-center justify-center`}>
                <Icon size={16} className={stat.color.split(' ')[1]} />
              </div>
              <p className="text-xs text-[#8E8E93]">{stat.label}</p>
            </div>
            <p className="text-xl font-bold text-white">{statistics[stat.key]}</p>
            <p className="text-xs text-[#8E8E93] mt-1">
              {formatCurrencyCompact(statistics[stat.amountKey])}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default InvoiceStatisticsCards;