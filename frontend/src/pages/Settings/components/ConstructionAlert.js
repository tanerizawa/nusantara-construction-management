import React from 'react';
import { Construction } from 'lucide-react';

/**
 * Construction alert component
 * @returns {JSX.Element} Construction alert UI
 */
const ConstructionAlert = () => {
  return (
    <div className="rounded-xl p-6 mb-8 flex items-start gap-4" style={{ 
      backgroundColor: 'rgba(10, 132, 255, 0.1)',
      border: '1px solid rgba(10, 132, 255, 0.2)'
    }}>
      <Construction className="h-6 w-6 flex-shrink-0" style={{ color: '#0A84FF' }} />
      <div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#FFFFFF' }}>
          Halaman Sedang Dalam Pengembangan
        </h3>
        <p className="text-sm" style={{ color: '#98989D' }}>
          Fitur pengaturan sistem sedang dalam tahap pengembangan. 
          Fitur-fitur di bawah ini akan segera tersedia dalam update mendatang.
        </p>
      </div>
    </div>
  );
};

export default ConstructionAlert;