import React, { memo, useState, useMemo } from 'react';
import { Grid, List, Filter, X, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Professional Project Filters Component with Dynamic Subsidiary Integration
 * Provides advanced filtering with real-time subsidiary data
 */
const ProjectFilters = memo(({ 
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  hasActiveFilters = false,
  onResetFilters,
  subsidiaries = [],
  loadingSubsidiaries = false,
  subsidiaryError = null,
  className = ''
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Process subsidiary data for dropdown options
  const subsidiaryOptions = useMemo(() => {
    if (!subsidiaries || subsidiaries.length === 0) return [];
    
    return subsidiaries.map(subsidiary => ({
      value: subsidiary.id,
      label: `${subsidiary.name} - ${subsidiary.specialization}`,
      code: subsidiary.code,
      specialization: subsidiary.specialization,
      location: subsidiary.location
    }));
  }, [subsidiaries]);

  const noSubsidiaries = subsidiaries.length === 0;

  // Filter options
  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'planning', label: 'Perencanaan' },
    { value: 'active', label: 'Berlangsung' },
    { value: 'completed', label: 'Selesai' },
    { value: 'on_hold', label: 'Ditunda' },
    { value: 'cancelled', label: 'Dibatalkan' },
    { value: 'archived', label: 'Diarsipkan' }
  ];

  const priorityOptions = [
    { value: '', label: 'Semua Prioritas' },
    { value: 'critical', label: 'Kritis' },
    { value: 'high', label: 'Tinggi' },
    { value: 'medium', label: 'Sedang' },
    { value: 'low', label: 'Rendah' }
  ];

  // Dynamic subsidiary options from database

  const sortOptions = [
    { value: 'created_at', label: 'Tanggal Dibuat' },
    { value: 'name', label: 'Nama Proyek' },
    { value: 'startDate', label: 'Tanggal Mulai' },
    { value: 'endDate', label: 'Tanggal Selesai' },
    { value: 'budget', label: 'Budget' },
    { value: 'progress', label: 'Progress' }
  ];

  const orderOptions = [
    { value: 'desc', label: 'Terbaru - Terlama' },
    { value: 'asc', label: 'Terlama - Terbaru' }
  ];

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  // Handle reset filters
  const handleResetFilters = () => {
    onResetFilters?.();
    setShowAdvanced(false);
  };

  return (
    <div className={`bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 ${className}`}>
      {/* Main Filters Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Primary Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Status Filter */}
          <div className="min-w-0 flex-1 sm:max-w-xs">
            <label htmlFor="status-filter" className="sr-only">
              Filter Status
            </label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-colors duration-200"
              aria-label="Filter berdasarkan status"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="min-w-0 flex-1 sm:max-w-xs">
            <label htmlFor="priority-filter" className="sr-only">
              Filter Prioritas
            </label>
            <select
              id="priority-filter"
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-colors duration-200"
              aria-label="Filter berdasarkan prioritas"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subsidiary Filter with Dynamic Data */}
          <div className="min-w-0 flex-1 sm:max-w-xs">
            <label htmlFor="subsidiary-filter" className="sr-only">
              Filter Anak Perusahaan
            </label>
            <select
              id="subsidiary-filter"
              value={filters.subsidiary || ''}
              onChange={(e) => handleFilterChange('subsidiary', e.target.value)}
              disabled={loadingSubsidiaries}
              className={`w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-colors duration-200 ${
                           loadingSubsidiaries ? 'opacity-50 cursor-not-allowed' : ''
                         }`}
              aria-label="Filter berdasarkan anak perusahaan"
            >
              {loadingSubsidiaries ? (
                <option value="">Loading anak perusahaan...</option>
              ) : subsidiaryError ? (
                <option value="">Error loading subsidiaries</option>
              ) : (
                subsidiaryOptions.map(option => (
                  <option 
                    key={option.value} 
                    value={option.value}
                    title={option.specialization ? `Spesialisasi: ${option.specialization}${option.city ? ` | Lokasi: ${option.city}` : ''}` : ''}
                  >
                    {option.label}
                  </option>
                ))
              )}
            </select>
            {!loadingSubsidiaries && noSubsidiaries && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                ⚠️ Belum ada data anak perusahaan
              </p>
            )}
          </div>

          {/* Advanced Filters Toggle */}
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="outline"
            className="inline-flex items-center gap-2 whitespace-nowrap"
            aria-expanded={showAdvanced}
            aria-controls="advanced-filters"
          >
            <Filter className="h-4 w-4" />
            Filter Lanjutan
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        {/* View Controls & Actions */}
        <div className="flex items-center gap-3">
          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              onClick={handleResetFilters}
              variant="ghost"
              size="sm"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400"
            >
              <X className="h-4 w-4" />
              Reset
            </Button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <Grid className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            
            <button
              onClick={() => onViewModeChange('table')}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              aria-label="Table view"
              aria-pressed={viewMode === 'table'}
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div 
          id="advanced-filters"
          className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sort By */}
            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Urutkan berdasarkan
              </label>
              <select
                id="sort-by"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Urutan
              </label>
              <select
                id="sort-order"
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {orderOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional filters can be added here */}
            <div className="flex items-end">
              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="w-full"
              >
                Reset Semua Filter
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Filter className="h-4 w-4" />
            <span>Filter aktif:</span>
            <div className="flex items-center gap-2 flex-wrap">
              {filters.status && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-md">
                  Status: {statusOptions.find(opt => opt.value === filters.status)?.label}
                  <button
                    onClick={() => handleFilterChange('status', '')}
                    className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                    aria-label="Remove status filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.priority && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-md">
                  Prioritas: {priorityOptions.find(opt => opt.value === filters.priority)?.label}
                  <button
                    onClick={() => handleFilterChange('priority', '')}
                    className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
                    aria-label="Remove priority filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

ProjectFilters.displayName = 'ProjectFilters';

export default ProjectFilters;
