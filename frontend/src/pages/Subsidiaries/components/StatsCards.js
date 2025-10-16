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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Total Subsidiaries */}
      <div className="rounded-xl p-6 shadow-sm" 
        style={{ 
          background: "linear-gradient(135deg, rgba(10, 132, 255, 0.2) 0%, rgba(10, 132, 255, 0.1) 100%)",
          border: "1px solid rgba(10, 132, 255, 0.3)" 
        }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm" style={{ color: "#98989D" }}>Total Anak Usaha</p>
            <p className="text-2xl font-bold" style={{ color: "#FFFFFF" }}>{stats.total || 0}</p>
          </div>
          <Building className="w-8 h-8" style={{ color: "#0A84FF" }} />
        </div>
      </div>

      {/* Active Subsidiaries */}
      <div className="rounded-xl p-6 shadow-sm" 
        style={{ 
          background: "linear-gradient(135deg, rgba(52, 199, 89, 0.2) 0%, rgba(52, 199, 89, 0.1) 100%)",
          border: "1px solid rgba(52, 199, 89, 0.3)" 
        }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm" style={{ color: "#98989D" }}>Anak Usaha Aktif</p>
            <p className="text-2xl font-bold" style={{ color: "#FFFFFF" }}>{stats.active || 0}</p>
          </div>
          <Award className="w-8 h-8" style={{ color: "#34C759" }} />
        </div>
      </div>

      {/* Total Employees */}
      <div className="rounded-xl p-6 shadow-sm" 
        style={{ 
          background: "linear-gradient(135deg, rgba(255, 159, 10, 0.2) 0%, rgba(255, 159, 10, 0.1) 100%)",
          border: "1px solid rgba(255, 159, 10, 0.3)" 
        }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm" style={{ color: "#98989D" }}>Total Karyawan</p>
            <p className="text-2xl font-bold" style={{ color: "#FFFFFF" }}>{stats.totalEmployees || 0}</p>
          </div>
          <Users className="w-8 h-8" style={{ color: "#FF9F0A" }} />
        </div>
      </div>

      {/* Specializations Count */}
      <div className="rounded-xl p-6 shadow-sm" 
        style={{ 
          background: "linear-gradient(135deg, rgba(191, 90, 242, 0.2) 0%, rgba(191, 90, 242, 0.1) 100%)",
          border: "1px solid rgba(191, 90, 242, 0.3)" 
        }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm" style={{ color: "#98989D" }}>Spesialisasi</p>
            <p className="text-2xl font-bold" style={{ color: "#FFFFFF" }}>{stats.specializations || 0}</p>
          </div>
          <MapPin className="w-8 h-8" style={{ color: "#BF5AF2" }} />
        </div>
      </div>
    </div>
  );
};

export default StatsCards;