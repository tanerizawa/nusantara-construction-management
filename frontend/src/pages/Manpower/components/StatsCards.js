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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-[#2C2C2E] rounded-xl p-6 shadow-sm border border-[#38383A]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#98989D] mb-1">Total Karyawan</p>
            <p className="text-3xl font-bold text-white">{total}</p>
          </div>
          <div className="w-14 h-14 bg-[#0A84FF]/20 rounded-xl flex items-center justify-center">
            <Users className="h-7 w-7 text-[#0A84FF]" />
          </div>
        </div>
      </div>

      <div className="bg-[#2C2C2E] rounded-xl p-6 shadow-sm border border-[#38383A]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#98989D] mb-1">Aktif</p>
            <p className="text-3xl font-bold text-[#30D158]">{active}</p>
          </div>
          <div className="w-14 h-14 bg-[#30D158]/20 rounded-xl flex items-center justify-center">
            <UserCheck className="h-7 w-7 text-[#30D158]" />
          </div>
        </div>
      </div>

      <div className="bg-[#2C2C2E] rounded-xl p-6 shadow-sm border border-[#38383A]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#98989D] mb-1">Non-Aktif</p>
            <p className="text-3xl font-bold text-[#98989D]">{inactive}</p>
          </div>
          <div className="w-14 h-14 bg-[#98989D]/20 rounded-xl flex items-center justify-center">
            <Users className="h-7 w-7 text-[#98989D]" />
          </div>
        </div>
      </div>

      <div className="bg-[#2C2C2E] rounded-xl p-6 shadow-sm border border-[#38383A]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#98989D] mb-1">Departemen</p>
            <p className="text-3xl font-bold text-[#0A84FF]">{departments}</p>
          </div>
          <div className="w-14 h-14 bg-[#0A84FF]/20 rounded-xl flex items-center justify-center">
            <Calendar className="h-7 w-7 text-[#0A84FF]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;