import React from 'react';
import { Filter, ArrowUpDown, X } from 'lucide-react';
import ProjectSearchBar from './ProjectSearchBar';
import { useTranslation } from '../../i18n';

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
  const { status, common } = useTranslation();
  const statusOptions = [
    { value: '', label: `Semua Status` },
    { value: 'active', label: status.active },
    { value: 'completed', label: status.completed },
    { value: 'on_hold', label: status.onHold },
    { value: 'cancelled', label: status.canceled }
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
    <section className="rounded-3xl border border-white/5 bg-[#080b13]/85 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 lg:flex-row">
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
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-[0.3em] text-white/60">Status</label>
            <div className="relative">
              <select
                value={filters.status || ''}
                onChange={(e) => onFilterChange('status', e.target.value)}
                disabled={disabled}
                className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-[#0ea5e9] focus:ring-0 disabled:opacity-50"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Filter className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-[0.3em] text-white/60">Prioritas</label>
            <div className="relative">
              <select
                value={filters.priority || ''}
                onChange={(e) => onFilterChange('priority', e.target.value)}
                disabled={disabled}
                className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-[#0ea5e9] focus:ring-0 disabled:opacity-50"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Filter className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-[0.3em] text-white/60">Urutkan</label>
            <div className="relative">
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                disabled={disabled}
                className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-[#0ea5e9] focus:ring-0 disabled:opacity-50"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            </div>
          </div>
        </div>
      </div>

      {(hasActiveFilters || searchTerm) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/5 pt-4 text-xs text-white/70">
          <span>Filter aktif:</span>
          {searchTerm && (
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-white">
              Pencarian: "{searchTerm}"
            </span>
          )}
          {filters.status && (
            <span className="rounded-full border border-[#34d399]/30 bg-[#34d399]/10 px-3 py-1 text-[#a7f3d0]">
              Status: {statusOptions.find(o => o.value === filters.status)?.label}
            </span>
          )}
          {filters.priority && (
            <span className="rounded-full border border-[#fbbf24]/30 bg-[#fbbf24]/10 px-3 py-1 text-[#fde68a]">
              Prioritas: {priorityOptions.find(o => o.value === filters.priority)?.label}
            </span>
          )}
          <button
            onClick={onClearFilters}
            disabled={disabled}
            className="ml-auto inline-flex items-center gap-2 text-[#fb923c] transition hover:text-[#fdba74] disabled:opacity-50"
            aria-label="Hapus semua filter dan pencarian"
          >
            <X className="h-4 w-4" />
            <span>{common.reset}</span>
          </button>
        </div>
      )}
    </section>
  );
};

export default ProjectToolbar;
