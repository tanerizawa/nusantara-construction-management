import React from 'react';
import { Plus } from 'lucide-react';

/**
 * Komponen header untuk Berita Acara Manager
 */
const BAHeader = ({ onCreateBA }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Berita Acara Management</h3>
        <p className="text-sm text-gray-600 mt-1">
          Kelola Berita Acara untuk milestone dan pembayaran proyek
        </p>
      </div>
      <button
        onClick={onCreateBA}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Buat BA Baru</span>
      </button>
    </div>
  );
};

export default BAHeader;
