import React from 'react';
import { Plus } from 'lucide-react';

/**
 * Header component for Manpower page
 * @param {Function} onAddClick - Click handler for "Add" button
 * @returns {JSX.Element} Header component
 */
const ManpowerHeader = ({ onAddClick }) => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#0b0f19]/90 px-6 py-6 shadow-[0_25px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#0ea5e9]/40 to-[#8b5cf6]/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-[#34d399]/20 blur-3xl" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white/70">
            <Plus className="h-5 w-5 text-[#60a5fa]" />
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Human Resources</p>
          </div>
          <h1 className="text-3xl font-semibold text-white">Manpower Management</h1>
          <p className="text-sm text-white/60">Kelola data karyawan dan personil proyek</p>
        </div>
        <button 
          onClick={onAddClick}
          className="h-11 rounded-2xl border border-white/10 bg-gradient-to-r from-[#0ea5e9] via-[#2563eb] to-[#7c3aed] px-6 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(37,99,235,0.35)] hover:brightness-110 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Tambah Karyawan
        </button>
      </div>
    </section>
  );
};

export default ManpowerHeader;