import React from 'react';
import { Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/budgetFormatters';

/**
 * Component untuk cash flow forecast
 */
const CashFlowForecast = ({ forecast = [] }) => {
  return (
    <div className="bg-[#2C2C2E] rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Cash Flow Forecast</h3>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-[#98989D]" />
          <span className="text-sm text-[#8E8E93]">Next 3 months</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {forecast.map((item, index) => (
          <div key={index} className="text-center p-4 border border-[#38383A] rounded-lg hover:border-blue-300 transition-colors">
            <p className="text-sm text-[#8E8E93] mb-1">{item.period}</p>
            <p className="text-lg font-bold text-white">{formatCurrency(item.projectedSpend)}</p>
            <p className="text-xs text-[#98989D]">Planned expenses</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CashFlowForecast;
