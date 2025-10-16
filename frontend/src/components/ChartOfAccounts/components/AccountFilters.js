import React from 'react';
import { Search } from 'lucide-react';
import { ACCOUNT_TYPE_OPTIONS } from '../config/accountTypes';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';

const { colors, search } = CHART_OF_ACCOUNTS_CONFIG;

const AccountFilters = ({ 
  searchTerm, 
  filterType, 
  onSearchChange, 
  onFilterTypeChange,
  onClearFilters,
  filterStats 
}) => {
  const hasActiveFilters = searchTerm || filterType;

  return (
    <div 
      className="rounded-lg p-4" 
      style={{ 
        backgroundColor: colors.background, 
        border: `1px solid ${colors.border}` 
      }}
    >
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2" 
              style={{ color: colors.textTertiary }} 
              size={20} 
            />
            <input
              type="text"
              placeholder={search.placeholder}
              value={searchTerm}
              onChange={onSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:outline-none transition-all duration-200"
              style={{
                backgroundColor: colors.backgroundSecondary,
                color: colors.text,
                border: `1px solid ${colors.border}`,
                focusRingColor: colors.primary
              }}
            />
          </div>
        </div>
        
        <div className="w-48">
          <select
            value={filterType}
            onChange={onFilterTypeChange}
            className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none transition-all duration-200"
            style={{
              backgroundColor: colors.backgroundSecondary,
              color: colors.text,
              border: `1px solid ${colors.border}`
            }}
          >
            {ACCOUNT_TYPE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-3 py-2 rounded-lg transition-colors duration-150 text-sm"
            style={{
              backgroundColor: "rgba(152, 152, 157, 0.15)",
              border: `1px solid ${colors.border}`,
              color: colors.textSecondary
            }}
          >
            Clear Filters
          </button>
        )}
      </div>
      
      {filterStats && hasActiveFilters && (
        <div className="mt-2 text-sm" style={{ color: colors.textSecondary }}>
          Showing {filterStats.filteredCount} of {filterStats.totalAccounts} accounts
          {filterStats.filteredPercentage < 100 && (
            <span> ({Math.round(filterStats.filteredPercentage)}%)</span>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountFilters;