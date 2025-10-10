import React from 'react';
import { Plus } from 'lucide-react';

/**
 * Komponen header untuk Berita Acara Manager
 * Dark theme version
 */
const BAHeader = ({ onCreateBA }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-xl font-semibold text-white">Berita Acara Management</h3>
        <p className="text-sm text-[#8E8E93] mt-1">
          Kelola Berita Acara untuk milestone dan pembayaran proyek
        </p>
      </div>
      <button
        onClick={onCreateBA}
        className="bg-[#0A84FF] text-white px-4 py-2 rounded-lg hover:bg-[#0A84FF]/90 flex items-center gap-2 transition-colors"
      >
        <Plus size={16} />
        <span>Buat BA Baru</span>
      </button>
    </div>
  );
};

export default BAHeader;
