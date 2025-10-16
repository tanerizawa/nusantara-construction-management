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
    <div className="bg-[#2C2C2E] rounded-xl shadow-sm border border-[#38383A] p-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#636366]" />
          <input
            type="text"
            placeholder="Cari nama, ID, atau posisi karyawan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 border border-[#38383A] rounded-lg hover:bg-[#38383A]/30 transition-colors text-white"
        >
          <Filter className="h-5 w-5" />
          Filter
        </button>
      </div>

      {/* Collapsible Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#38383A]">
          <div>
            <label className="block text-sm font-medium text-[#98989D] mb-2">Departemen</label>
            <select 
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:ring-2 focus:ring-[#0A84FF]"
            >
              <option value="">Semua Departemen</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#98989D] mb-2">Status</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:ring-2 focus:ring-[#0A84FF]"
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
        <div className="mt-4 pt-4 border-t border-[#38383A]">
          <button
            onClick={resetFilters}
            className="text-sm text-[#0A84FF] hover:text-[#0A84FF]/80"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;