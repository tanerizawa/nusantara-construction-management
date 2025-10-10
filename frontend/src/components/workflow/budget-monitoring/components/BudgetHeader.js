import React from 'react';
import { RefreshCw, Download } from 'lucide-react';

/**
 * Header component untuk Budget Monitoring
 */
const BudgetHeader = ({ 
  projectName, 
  timeframe, 
  onTimeframeChange, 
  onRefresh 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-white">Budget Monitoring</h2>
        <p className="text-[#8E8E93]">Real-time budget tracking untuk {projectName}</p>
      </div>
      
      <div className="flex items-center space-x-3">
        <select
          value={timeframe}
          onChange={(e) => onTimeframeChange(e.target.value)}
          className="bg-[#2C2C2E] text-white border border-[#38383A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">Mingguan</option>
          <option value="month">Bulanan</option>
          <option value="quarter">Kuartal</option>
        </select>
        
        <button
          onClick={onRefresh}
          className="flex items-center px-3 py-2 text-[#8E8E93] hover:text-white transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
        
        <button className="flex items-center px-4 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 transition-colors">
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>
    </div>
  );
};

export default BudgetHeader;
