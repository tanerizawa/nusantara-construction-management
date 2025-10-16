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
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-auto md:flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari anak usaha..."
            className="w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              backgroundColor: "#2C2C2E",
              border: "1px solid #38383A",
              color: "#FFFFFF"
            }}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "#98989D" }} size={18} />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg ${showFilters ? 'bg-blue-500/20 text-blue-400' : ''}`}
          style={{
            border: "1px solid #38383A",
            color: showFilters ? "#0A84FF" : "#98989D",
            backgroundColor: showFilters ? "rgba(10, 132, 255, 0.1)" : "#2C2C2E"
          }}
        >
          <Filter size={18} />
          Filter
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
        </button>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 rounded-lg" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
              Spesialisasi
            </label>
            <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{
                backgroundColor: "#1C1C1E",
                border: "1px solid #38383A",
                color: "#FFFFFF"
              }}
            >
              {SPECIALIZATIONS.map(spec => (
                <option key={spec.value} value={spec.value}>
                  {spec.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#98989D" }}>
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{
                backgroundColor: "#1C1C1E",
                border: "1px solid #38383A",
                color: "#FFFFFF"
              }}
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: "#38383A",
                color: "#FFFFFF"
              }}
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