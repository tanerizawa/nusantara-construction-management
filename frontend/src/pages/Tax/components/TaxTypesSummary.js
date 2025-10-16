import React from 'react';
import { FileText } from 'lucide-react';
import { formatCurrency } from '../utils';

/**
 * Component for displaying tax types summary
 * @param {Object} props Component props
 * @param {Object} props.stats Tax statistics data
 * @returns {JSX.Element} Tax types summary UI
 */
const TaxTypesSummary = ({ stats }) => {
  if (!stats?.byType || Object.keys(stats.byType).length === 0) {
    return null;
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan per Jenis Pajak</h3>
      <div className="space-y-3">
        {Object.entries(stats.byType).map(([type, amount]) => (
          <div key={type} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <span className="font-medium text-gray-700">{type}</span>
            <span className="font-bold text-blue-600">{formatCurrency(amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaxTypesSummary;