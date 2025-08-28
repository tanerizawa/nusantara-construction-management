import React from 'react';
import { Search } from 'lucide-react';
import DensityToggle from './DensityToggle';

/**
 * PageActions: Reusable toolbar for list pages (search, filters, sort, view toggle, density)
 * Props:
 * - searchPlaceholder, searchValue, onSearchChange
 * - filters: [{ id, label, value, onChange, options: [{value,label}] }]
 * - sortOptions: [{ value, label }], sortValue, onSortChange
 * - viewMode: 'grid'|'table' (optional), onViewModeChange
 * - compact, onCompactChange
 * - right:
 *     optional React node rendered on the far right (e.g., Create button)
 */
const PageActions = ({
  searchPlaceholder = 'Cari...',
  searchValue = '',
  onSearchChange,
  filters = [],
  sortOptions = [],
  sortValue,
  onSortChange,
  viewMode,
  onViewModeChange,
  compact,
  onCompactChange,
  right
}) => {
  return (
    <div className="card">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="form-input pl-10"
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>

        {/* Filters */}
        {filters.map((f) => (
          <select
            key={f.id}
            className="form-input min-w-[140px]"
            value={f.value}
            onChange={(e) => f.onChange && f.onChange(e.target.value)}
          >
            {f.options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ))}

        {/* Sort */}
        {sortOptions.length > 0 && (
          <select
            className="form-input min-w-[140px]"
            value={sortValue}
            onChange={(e) => onSortChange && onSortChange(e.target.value)}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )}

        {/* View toggle */}
        {viewMode && onViewModeChange && (
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => onViewModeChange('grid')}
            >
              Grid
            </button>
            <button
              className={`px-3 py-2 text-sm ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => onViewModeChange('table')}
            >
              Table
            </button>
          </div>
        )}

        {/* Density */}
        {typeof compact === 'boolean' && onCompactChange && (
          <DensityToggle compact={compact} onChange={onCompactChange} />
        )}

        {/* Right-aligned slot */}
        {right && (
          <div className="lg:ml-auto">{right}</div>
        )}
      </div>
    </div>
  );
};

export default PageActions;
