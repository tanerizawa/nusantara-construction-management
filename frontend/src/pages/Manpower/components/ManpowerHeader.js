import React from 'react';
import { Plus } from 'lucide-react';

/**
 * Header component for Manpower page
 * @param {Function} onAddClick - Click handler for "Add" button
 * @returns {JSX.Element} Header component
 */
const ManpowerHeader = ({ onAddClick }) => {
  return (
    <div className="bg-[#2C2C2E] rounded-xl shadow-sm border border-[#38383A] p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">Manpower Management</h1>
          <p className="text-[#98989D] mt-2">Kelola data karyawan dan personil proyek</p>
        </div>
        <button 
          onClick={onAddClick}
          className="flex items-center gap-2 px-6 py-3 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="h-5 w-5" />
          Tambah Karyawan
        </button>
      </div>
    </div>
  );
};

export default ManpowerHeader;