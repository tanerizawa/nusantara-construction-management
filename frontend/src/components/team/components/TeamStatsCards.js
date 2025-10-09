import React from 'react';
import { Users, DollarSign, Clock, Award } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

const TeamStatsCards = ({ teamStats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <Users size={20} />
          <span className="font-medium">Total Anggota</span>
        </div>
        <div className="text-2xl font-bold text-blue-700">{teamStats.totalMembers}</div>
        <div className="text-sm text-blue-600">{teamStats.activeMembers} aktif</div>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-green-600 mb-2">
          <DollarSign size={20} />
          <span className="font-medium">Total Cost</span>
        </div>
        <div className="text-2xl font-bold text-green-700">
          {formatCurrency(teamStats.totalCost)}
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-yellow-600 mb-2">
          <Clock size={20} />
          <span className="font-medium">Total Hours</span>
        </div>
        <div className="text-2xl font-bold text-yellow-700">
          {teamStats.totalHours.toLocaleString('id-ID')}
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-purple-600 mb-2">
          <Award size={20} />
          <span className="font-medium">Avg Performance</span>
        </div>
        <div className="text-2xl font-bold text-purple-700">
          {teamStats.avgPerformance.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export default TeamStatsCards;
