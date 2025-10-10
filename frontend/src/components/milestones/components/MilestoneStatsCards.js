import React from 'react';
import { Target, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const MilestoneStatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[#2C2C2E] p-4 rounded-lg border border-[#38383A]">
        <div className="flex items-center gap-2 text-[#0A84FF] mb-2">
          <Target size={18} />
          <span className="text-sm font-medium">Total Milestone</span>
        </div>
        <div className="text-lg font-bold text-[#0A84FF]">{stats.total}</div>
      </div>
      
      <div className="bg-[#2C2C2E] p-4 rounded-lg border border-[#38383A]">
        <div className="flex items-center gap-2 text-[#30D158] mb-2">
          <CheckCircle size={18} />
          <span className="text-sm font-medium">Selesai</span>
        </div>
        <div className="text-lg font-bold text-[#30D158]">
          {stats.completed} ({stats.completionRate.toFixed(0)}%)
        </div>
      </div>

      <div className="bg-[#2C2C2E] p-4 rounded-lg border border-[#38383A]">
        <div className="flex items-center gap-2 text-[#FF9F0A] mb-2">
          <Clock size={18} />
          <span className="text-sm font-medium">Berlangsung</span>
        </div>
        <div className="text-lg font-bold text-[#FF9F0A]">{stats.inProgress}</div>
      </div>

      <div className="bg-[#2C2C2E] p-4 rounded-lg border border-[#38383A]">
        <div className="flex items-center gap-2 text-[#FF3B30] mb-2">
          <AlertCircle size={18} />
          <span className="text-sm font-medium">Terlambat</span>
        </div>
        <div className="text-lg font-bold text-[#FF3B30]">{stats.overdue}</div>
      </div>
    </div>
  );
};

export default MilestoneStatsCards;
