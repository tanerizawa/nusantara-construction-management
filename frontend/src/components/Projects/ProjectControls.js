import React, { useState } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Simplified Project Controls Component
 * Clean, minimal interface for project management
 */
const ProjectControls = ({
  filters,
  onFiltersChange,
  currentSort,
  currentOrder, 
  onSortChange,
  viewMode,
  onViewModeChange,
  subsidiaries = [],
  onResetFilters,
  hasActiveFilters = false
}) => {
  const [showSubsidiary, setShowSubsidiary] = useState(false);

  const sortOptions = [
    { value: 'created_at', label: 'Terbaru', order: 'desc' },
    { value: 'priority', label: 'Prioritas', order: 'desc' },
    { value: 'progress', label: 'Progress', order: 'asc' },
    { value: 'endDate', label: 'Deadline', order: 'asc' },
    { value: 'name', label: 'Nama A-Z', order: 'asc' }
  ];

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'planning', label: 'Perencanaan' },
    { value: 'active', label: 'Aktif / Berjalan' },
    { value: 'on_hold', label: 'Terhenti' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' }
  ];

  const priorityOptions = [
    { value: '', label: 'Semua' },
    { value: 'high', label: 'Tinggi' },
    { value: 'medium', label: 'Sedang' },
    { value: 'low', label: 'Rendah' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Left: Sort */}
        <select
          value={`${currentSort}_${currentOrder}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split('_');
            onSortChange(sortBy, order);
          }}
          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={`${option.value}_${option.order}`}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Center: Quick Filters */}
        <div className="flex items-center gap-2 flex-1 lg:flex-none">
          <select
            value={filters.status || ''}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filters.priority || ''}
            onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value })}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {subsidiaries.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSubsidiary(!showSubsidiary)}
              className={`${showSubsidiary || filters.subsidiary ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30' : ''}`}
            >
              <Filter className="h-4 w-4" />
            </Button>
          )}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="text-gray-500 hover:text-gray-700 text-xs"
            >
              Reset
            </Button>
          )}
        </div>

        {/* Right: View Mode */}
        <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="rounded-none border-0 px-3"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('table')}
            className="rounded-none border-0 border-l border-gray-300 dark:border-gray-600 px-3"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Subsidiary Filter */}
      {showSubsidiary && subsidiaries.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <select
            value={filters.subsidiary || ''}
            onChange={(e) => onFiltersChange({ ...filters, subsidiary: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua Anak Perusahaan</option>
            {subsidiaries.map(subsidiary => (
              <option key={subsidiary.id} value={subsidiary.id}>
                {subsidiary.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default ProjectControls;
