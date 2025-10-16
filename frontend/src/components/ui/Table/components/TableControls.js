import React from 'react';
import { Search, Filter, RefreshCw, Download } from 'lucide-react';
import { Input } from '../../Form/components/Input';
import Button from '../../Button';
import { Dropdown, DropdownItem } from '../../Dropdown';

export const TableControls = ({
  searchable = false,
  filterable = false,
  searchQuery = '',
  onSearchChange,
  columns = [],
  filters = {},
  onFilterChange,
  onClearFilters,
  onRefresh,
  onExport,
  selectedCount = 0,
  bulkActions = [],
  onBulkAction,
  showRefresh = true,
  showExport = true,
  className = ''
}) => {
  const hasActiveFilters = searchQuery || Object.keys(filters).some(key => filters[key]);

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 ${className}`}>
      <div className="flex items-center space-x-3">
        {/* Search */}
        {searchable && (
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari data..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        )}
        
        {/* Filters */}
        {filterable && (
          <Dropdown
            trigger={
              <Button 
                variant="secondary" 
                icon={<Filter size={16} />}
                className={hasActiveFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}
              >
                Filter
                {hasActiveFilters && (
                  <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {Object.keys(filters).filter(key => filters[key]).length}
                  </span>
                )}
              </Button>
            }
          >
            <div className="p-4 w-64">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Filter Data</h4>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={onClearFilters}
                  >
                    Clear
                  </Button>
                )}
              </div>
              
              {columns
                .filter(col => col.filterable)
                .map(column => (
                  <div key={column.key} className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {column.title}
                    </label>
                    <Input
                      type="text"
                      placeholder={`Filter ${column.title.toLowerCase()}...`}
                      value={filters[column.key] || ''}
                      onChange={(e) => onFilterChange?.(column.key, e.target.value)}
                      size="sm"
                    />
                  </div>
                ))}
            </div>
          </Dropdown>
        )}
        
        {/* Bulk Actions */}
        {selectedCount > 0 && bulkActions.length > 0 && (
          <Dropdown
            trigger={
              <Button variant="secondary">
                {selectedCount} dipilih
              </Button>
            }
          >
            {bulkActions.map((action, index) => (
              <DropdownItem
                key={index}
                onClick={() => onBulkAction?.(action)}
                variant={action.variant}
                icon={action.icon}
              >
                {action.label}
              </DropdownItem>
            ))}
          </Dropdown>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Refresh */}
        {showRefresh && (
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<RefreshCw size={16} />}
            onClick={onRefresh}
          >
            Refresh
          </Button>
        )}
        
        {/* Export */}
        {showExport && (
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<Download size={16} />}
            onClick={onExport}
          >
            Export
          </Button>
        )}
      </div>
    </div>
  );
};