import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { SPECIALIZATIONS, STATUS_OPTIONS } from '../utils';

/**
 * Search and filters component for Subsidiaries page
 * 
 * @param {Object} props Component props
 * @param {string} props.searchTerm Search term
 * @param {Function} props.setSearchTerm Search term setter
 * @param {string} props.specializationFilter Specialization filter
 * @param {Function} props.setSpecializationFilter Specialization filter setter
 * @param {string} props.statusFilter Status filter
 * @param {Function} props.setStatusFilter Status filter setter
 * @param {boolean} props.showFilters Show filters toggle
 * @param {Function} props.setShowFilters Show filters toggle setter
 * @param {boolean} props.hasActiveFilters Whether any filter is active
 * @param {Function} props.resetFilters Reset filters function
 * @returns {JSX.Element} Search and filters UI
 */
const SearchAndFilters = ({
  searchTerm,
  setSearchTerm,
  specializationFilter,
  setSpecializationFilter,
  statusFilter,
  setStatusFilter,
  showFilters,
  setShowFilters,
  hasActiveFilters,
  resetFilters
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-auto md:flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari anak usaha..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:ring-2 focus:ring-[#0ea5e9]/50 focus:border-[#0ea5e9]/50 backdrop-blur-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl border transition-colors ${
            showFilters 
              ? 'border-[#0ea5e9]/50 bg-[#0ea5e9]/10 text-[#0ea5e9]' 
              : 'border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20'
          }`}
        >
          <Filter size={18} />
          Filter
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#0ea5e9]"></span>}
        </button>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl border border-white/5 bg-[#0b0f19]/80 backdrop-blur-xl">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
              Spesialisasi
            </label>
            <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-[#0ea5e9]/50 focus:border-[#0ea5e9]/50"
            >
              {SPECIALIZATIONS.map(spec => (
                <option key={spec.value} value={spec.value} className="bg-[#0b0f19]">
                  {spec.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-[#0ea5e9]/50 focus:border-[#0ea5e9]/50"
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status.value} value={status.value} className="bg-[#0b0f19]">
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={16} />
              Reset Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;