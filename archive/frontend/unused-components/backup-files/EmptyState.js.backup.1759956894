import React from 'react';
import { Calculator, Plus } from 'lucide-react';

/**
 * EmptyState Component
 * Displays when no RAB items exist
 */
const EmptyState = ({ onAddClick }) => {
  return (
    <div className="text-center py-12">
      <Calculator className="h-12 w-12 text-[#636366] mx-auto mb-4" />
      <h3 className="text-lg font-medium text-white mb-2">Belum Ada Item RAB</h3>
      <p className="text-[#8E8E93] mb-4">Silakan tambahkan item RAB untuk memulai</p>
      <button
        onClick={onAddClick}
        className="bg-[#0A84FF] text-white px-4 py-2 rounded-lg hover:bg-[#0A84FF]/90"
      >
        <Plus className="h-4 w-4 inline mr-2" />
        Tambah Item RAB
      </button>
    </div>
  );
};

export default EmptyState;
