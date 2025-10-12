import React from 'react';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';
import ProjectSearchBar from './ProjectSearchBar';

/**
 * Toolbar component untuk Projects page
 * Combines search, filter, and sorting in one compact toolbar
 */
const ProjectToolbar = ({ 
  searchTerm,
  onSearchChange,
  onSearchClear,
  filters,
  onFilterChange,
  sortBy,
  sortOrder,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
  disabled = false,
  isSearching = false // New prop untuk show loading indicator
}) => {
  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'active', label: 'Aktif' },
    { value: 'completed', label: 'Selesai' },
    { value: 'on-hold', label: 'Ditunda' },
    { value: 'cancelled', label: 'Dibatalkan' }
  ];

  const priorityOptions = [
    { value: '', label: 'Semua Prioritas' },
    { value: 'high', label: 'Tinggi' },
    { value: 'medium', label: 'Sedang' },
    { value: 'low', label: 'Rendah' }
  ];

  const sortOptions = [
    { value: 'name-asc', label: 'Nama (A-Z)' },
    { value: 'name-desc', label: 'Nama (Z-A)' },
    { value: 'budget-desc', label: 'Budget (Tertinggi)' },
    { value: 'budget-asc', label: 'Budget (Terendah)' },
    { value: 'progress-desc', label: 'Progress (Tertinggi)' },
    { value: 'progress-asc', label: 'Progress (Terendah)' },
    { value: 'createdAt-desc', label: 'Terbaru' },
    { value: 'createdAt-asc', label: 'Terlama' }
  ];

  const handleSortChange = (value) => {
    const [field, order] = value.split('-');
    onSortChange(field, order);
  };

  const currentSort = `${sortBy}-${sortOrder}`;

  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search Bar */}
        <div className="flex-1">
          <ProjectSearchBar
            value={searchTerm}
            onChange={onSearchChange}
            onClear={onSearchClear}
            placeholder="Cari proyek berdasarkan nama, kode, atau klien..."
            disabled={disabled}
            isLoading={isSearching}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="relative min-w-[150px]">
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange('status', e.target.value)}
              disabled={disabled}
              className="appearance-none w-full pl-3 pr-10 py-2 border border-[#38383A] rounded-lg 
                         focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent 
                         bg-[#1C1C1E] text-white text-sm
                         cursor-pointer transition-all duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#636366] w-4 h-4 pointer-events-none" />
          </div>

          {/* Priority Filter */}
          <div className="relative min-w-[150px]">
            <select
              value={filters.priority || ''}
              onChange={(e) => onFilterChange('priority', e.target.value)}
              disabled={disabled}
              className="appearance-none w-full pl-3 pr-10 py-2 border border-[#38383A] rounded-lg 
                         focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent 
                         bg-[#1C1C1E] text-white text-sm
                         cursor-pointer transition-all duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#636366] w-4 h-4 pointer-events-none" />
          </div>

          {/* Sorting */}
          <div className="relative min-w-[180px]">
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              disabled={disabled}
              className="appearance-none w-full pl-3 pr-10 py-2 border border-[#38383A] rounded-lg 
                         focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent 
                         bg-[#1C1C1E] text-white text-sm
                         cursor-pointer transition-all duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#636366] w-4 h-4 pointer-events-none" />
          </div>

          {/* Clear Filters Button */}
          {(hasActiveFilters || searchTerm) && (
            <button
              onClick={onClearFilters}
              disabled={disabled}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#FF9F0A] 
                         hover:text-[#FF9F0A]/80 transition-colors duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Hapus semua filter dan pencarian"
            >
              <X className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Info */}
      {(hasActiveFilters || searchTerm) && (
        <div className="mt-3 pt-3 border-t border-[#38383A]">
          <div className="flex items-center gap-2 flex-wrap text-xs text-[#8E8E93]">
            <span>Filter aktif:</span>
            {searchTerm && (
              <span className="px-2 py-1 bg-[#0A84FF]/20 text-[#0A84FF] rounded">
                Pencarian: "{searchTerm}"
              </span>
            )}
            {filters.status && (
              <span className="px-2 py-1 bg-[#30D158]/20 text-[#30D158] rounded">
                Status: {statusOptions.find(o => o.value === filters.status)?.label}
              </span>
            )}
            {filters.priority && (
              <span className="px-2 py-1 bg-[#FF9F0A]/20 text-[#FF9F0A] rounded">
                Prioritas: {priorityOptions.find(o => o.value === filters.priority)?.label}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectToolbar;
