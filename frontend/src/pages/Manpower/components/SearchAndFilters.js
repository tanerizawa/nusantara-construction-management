import React from 'react';
import { Search, Filter } from 'lucide-react';
import { DEPARTMENTS } from '../utils';

/**
 * Search and filters component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Search and filters component
 */
const SearchAndFilters = ({
  searchTerm,
  setSearchTerm,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  showFilters,
  setShowFilters,
  hasActiveFilters,
  resetFilters
}) => {
  return (
    <section className="rounded-3xl border border-white/5 bg-[#080b13]/85 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
          <input
            type="text"
            placeholder="Cari nama, ID, atau posisi karyawan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-sm text-white placeholder-white/40 outline-none transition focus:border-[#0ea5e9] focus:ring-0"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition-colors text-sm font-medium ${showFilters ? 'border-[#0ea5e9] bg-[#0ea5e9]/10 text-[#0ea5e9]' : 'border-white/10 text-white/70 hover:border-white/30 hover:text-white'}`}
        >
          <Filter className="h-5 w-5" />
          Filter
        </button>
      </div>

      {/* Collapsible Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-[0.3em] text-white/60">Departemen</label>
            <select 
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-[#0ea5e9] focus:ring-0"
            >
              <option value="">Semua Departemen</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-[0.3em] text-white/60">Status</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-[#0ea5e9] focus:ring-0"
            >
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Non-Aktif</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <button
            onClick={resetFilters}
            className="text-sm text-[#0ea5e9] hover:text-[#0ea5e9]/80 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      )}
    </section>
  );
};

export default SearchAndFilters;