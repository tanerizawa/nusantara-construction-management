import React from 'react';
import { Users, UserCheck, Calendar } from 'lucide-react';

/**
 * Stats cards component
 * @param {Object} stats - Statistics data
 * @returns {JSX.Element} Stats cards component
 */
const StatsCards = ({ stats }) => {
  const { total, active, inactive, departments } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="rounded-3xl border border-white/5 bg-[#070b13]/85 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">Total Karyawan</p>
            <p className="text-3xl font-bold text-white">{total}</p>
          </div>
          <div className="w-12 h-12 bg-[#0A84FF]/20 rounded-2xl flex items-center justify-center">
            <Users className="h-6 w-6 text-[#0A84FF]" />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/5 bg-[#070b13]/85 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">Aktif</p>
            <p className="text-3xl font-bold text-[#30D158]">{active}</p>
          </div>
          <div className="w-12 h-12 bg-[#30D158]/20 rounded-2xl flex items-center justify-center">
            <UserCheck className="h-6 w-6 text-[#30D158]" />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/5 bg-[#070b13]/85 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">Non-Aktif</p>
            <p className="text-3xl font-bold text-white/60">{inactive}</p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <Users className="h-6 w-6 text-white/60" />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/5 bg-[#070b13]/85 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">Departemen</p>
            <p className="text-3xl font-bold text-[#8b5cf6]">{departments}</p>
          </div>
          <div className="w-12 h-12 bg-[#8b5cf6]/20 rounded-2xl flex items-center justify-center">
            <Calendar className="h-6 w-6 text-[#8b5cf6]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;