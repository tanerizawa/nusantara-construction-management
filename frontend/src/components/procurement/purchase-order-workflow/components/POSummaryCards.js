import React from 'react';
import { SUMMARY_CONFIG } from '../config/poConfig';
import { formatCurrency } from '../utils/poUtils';

/**
 * Purchase Order Summary Cards Component
 */
const POSummaryCards = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {SUMMARY_CONFIG.map((config) => {
        const Icon = config.icon;
        const value = config.isAmount 
          ? formatCurrency(summary[config.key])
          : summary[config.key];

        return (
          <div key={config.key} className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <Icon className={`h-8 w-8 ${config.color}`} />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{config.label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default POSummaryCards;