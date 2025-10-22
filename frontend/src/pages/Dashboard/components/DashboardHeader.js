import React from 'react';
import { RefreshCw } from 'lucide-react';

/**
 * Header untuk halaman dashboard
 * @param {Object} props Component props
 * @param {boolean} props.loading Loading state
 * @param {Function} props.onRefresh Function untuk refresh data
 * @returns {JSX.Element} Dashboard header UI
 */
const DashboardHeader = ({ loading, onRefresh }) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-white">Dasbor</h1>
        <p className="text-[#98989D] text-sm">Ringkasan aktivitas dan statistik proyek</p>
      </div>
      <button 
        onClick={onRefresh}
        disabled={loading}
        className="px-5 py-2.5 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0970DD] transition-colors duration-150 flex items-center gap-2 text-sm font-medium disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        Segarkan
      </button>
    </div>
  );
};

export default DashboardHeader;
