import React from 'react';
import { formatCurrency } from '../../../utils/formatters';

const MilestoneProgressOverview = ({ stats }) => {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h4 className="font-semibold mb-4">Progress Overview</h4>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progress Keseluruhan</span>
            <span>{stats.progressWeighted.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.progressWeighted}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div>
            <span className="text-sm text-gray-600">Total Budget Milestone</span>
            <div className="text-lg font-semibold">{formatCurrency(stats.totalBudget)}</div>
          </div>
          <div>
            <span className="text-sm text-gray-600">Actual Cost</span>
            <div className="text-lg font-semibold">{formatCurrency(stats.totalActualCost)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneProgressOverview;
