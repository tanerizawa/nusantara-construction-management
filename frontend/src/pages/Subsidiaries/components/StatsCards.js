import React from 'react';
import { Building, MapPin, Users, Award } from 'lucide-react';

/**
 * Statistics cards component for Subsidiaries page
 * 
 * @param {Object} props Component props
 * @param {Object} props.stats Statistics data object
 * @returns {JSX.Element} Stats cards UI
 */
const StatsCards = ({ stats }) => {
  if (!stats) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Subsidiaries */}
      <div className="rounded-3xl border border-white/5 bg-[#070b13]/85 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">Total Anak Usaha</p>
            <p className="text-3xl font-bold text-white">{stats.total || 0}</p>
          </div>
          <div className="w-12 h-12 bg-[#0A84FF]/20 rounded-2xl flex items-center justify-center">
            <Building className="h-6 w-6 text-[#0A84FF]" />
          </div>
        </div>
      </div>

      {/* Active Subsidiaries */}
      <div className="rounded-3xl border border-white/5 bg-[#070b13]/85 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">Anak Usaha Aktif</p>
            <p className="text-3xl font-bold text-[#30D158]">{stats.active || 0}</p>
          </div>
          <div className="w-12 h-12 bg-[#30D158]/20 rounded-2xl flex items-center justify-center">
            <Award className="h-6 w-6 text-[#30D158]" />
          </div>
        </div>
      </div>

      {/* Total Employees */}
      <div className="rounded-3xl border border-white/5 bg-[#070b13]/85 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">Total Karyawan</p>
            <p className="text-3xl font-bold text-[#FF9F0A]">{stats.totalEmployees || 0}</p>
          </div>
          <div className="w-12 h-12 bg-[#FF9F0A]/20 rounded-2xl flex items-center justify-center">
            <Users className="h-6 w-6 text-[#FF9F0A]" />
          </div>
        </div>
      </div>

      {/* Specializations Count */}
      <div className="rounded-3xl border border-white/5 bg-[#070b13]/85 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">Spesialisasi</p>
            <p className="text-3xl font-bold text-[#8b5cf6]">{stats.specializations || 0}</p>
          </div>
          <div className="w-12 h-12 bg-[#8b5cf6]/20 rounded-2xl flex items-center justify-center">
            <MapPin className="h-6 w-6 text-[#8b5cf6]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;