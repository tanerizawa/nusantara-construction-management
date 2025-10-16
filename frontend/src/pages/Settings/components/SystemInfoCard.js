import React from 'react';
import { Info } from 'lucide-react';
import { SYSTEM_INFO } from '../utils';

/**
 * System information card component
 * @returns {JSX.Element} System information UI
 */
const SystemInfoCard = () => {
  return (
    <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5" style={{ color: '#0A84FF' }} />
        <h2 className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>
          Informasi Sistem
        </h2>
      </div>
      <div className="h-px mb-4" style={{ backgroundColor: '#38383A' }}></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <p className="text-sm mb-1" style={{ color: '#98989D' }}>
            Versi Aplikasi
          </p>
          <p className="text-lg font-bold" style={{ color: '#FFFFFF' }}>
            {SYSTEM_INFO.version}
          </p>
        </div>
        <div>
          <p className="text-sm mb-1" style={{ color: '#98989D' }}>
            Lingkungan
          </p>
          <p className="text-lg font-bold" style={{ color: '#FFFFFF' }}>
            {SYSTEM_INFO.environment}
          </p>
        </div>
        <div>
          <p className="text-sm mb-1" style={{ color: '#98989D' }}>
            Terakhir Update
          </p>
          <p className="text-lg font-bold" style={{ color: '#FFFFFF' }}>
            {SYSTEM_INFO.lastUpdate}
          </p>
        </div>
        <div>
          <p className="text-sm mb-1" style={{ color: '#98989D' }}>
            Pengembang
          </p>
          <p className="text-lg font-bold" style={{ color: '#FFFFFF' }}>
            {SYSTEM_INFO.developer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemInfoCard;