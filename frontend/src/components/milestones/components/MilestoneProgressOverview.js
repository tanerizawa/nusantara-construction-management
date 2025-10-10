import React from 'react';
import { formatCurrency } from '../../../utils/formatters';

const MilestoneProgressOverview = ({ stats }) => {
  return (
    <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] p-6">
      <h4 className="font-semibold text-white mb-4">Progress Overview</h4>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2 text-[#8E8E93]">
            <span>Progress Keseluruhan</span>
            <span>{stats.progressWeighted.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-[#48484A] rounded-full h-2">
            <div 
              className="bg-[#0A84FF] h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.progressWeighted}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div>
            <span className="text-sm text-[#8E8E93]">Total Budget Milestone</span>
            <div className="text-base font-semibold text-white">{formatCurrency(stats.totalBudget)}</div>
          </div>
          <div>
            <span className="text-sm text-[#8E8E93]">Actual Cost</span>
            <div className="text-base font-semibold text-white">{formatCurrency(stats.totalActualCost)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneProgressOverview;
