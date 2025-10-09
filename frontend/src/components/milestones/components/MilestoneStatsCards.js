import React from 'react';
import { Target, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const MilestoneStatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <Target size={20} />
          <span className="font-medium">Total Milestone</span>
        </div>
        <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-green-600 mb-2">
          <CheckCircle size={20} />
          <span className="font-medium">Selesai</span>
        </div>
        <div className="text-2xl font-bold text-green-700">
          {stats.completed} ({stats.completionRate.toFixed(0)}%)
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-yellow-600 mb-2">
          <Clock size={20} />
          <span className="font-medium">Berlangsung</span>
        </div>
        <div className="text-2xl font-bold text-yellow-700">{stats.inProgress}</div>
      </div>

      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <AlertCircle size={20} />
          <span className="font-medium">Terlambat</span>
        </div>
        <div className="text-2xl font-bold text-red-700">{stats.overdue}</div>
      </div>
    </div>
  );
};

export default MilestoneStatsCards;
