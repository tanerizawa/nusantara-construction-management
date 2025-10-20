import React, { useState } from 'react';
import './AttendanceFilters.css';

/**
 * AttendanceFilters Component
 * 
 * Filter controls for attendance history:
 * - Date range (start/end date)
 * - Status filter (all/present/late/absent)
 * - Search by notes
 */
const AttendanceFilters = ({ filters, onFilterChange, recordCount }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // Handle input change
  const handleChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle apply filters
  const handleApply = () => {
    onFilterChange(localFilters);
    setIsExpanded(false);
  };

  // Handle reset
  const handleReset = () => {
    const defaultFilters = {
      startDate: getDefaultStartDate(),
      endDate: new Date().toISOString().split('T')[0],
      status: 'all',
      search: ''
    };
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  // Get default start date (30 days ago)
  function getDefaultStartDate() {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  }

  // Count active filters
  const activeFiltersCount = () => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.search) count++;
    // Date range is always active, so we don't count it
    return count;
  };

  return (
    <div className="attendance-filters">
      {/* Filter Header */}
      <div className="filters-header">
        <button 
          className="toggle-filters-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="filter-icon">🔍</span>
          <span className="filter-text">Filters</span>
          {activeFiltersCount() > 0 && (
            <span className="active-count">{activeFiltersCount()}</span>
          )}
          <span className={`chevron ${isExpanded ? 'expanded' : ''}`}>▼</span>
        </button>
        
        <div className="filters-summary">
          <span className="record-count">{recordCount} records found</span>
        </div>
      </div>

      {/* Filter Controls */}
      {isExpanded && (
        <div className="filters-content">
          {/* Date Range */}
          <div className="filter-group">
            <label className="filter-label">Date Range</label>
            <div className="date-range-inputs">
              <div className="date-input-wrapper">
                <span className="date-label">From</span>
                <input
                  type="date"
                  className="date-input"
                  value={localFilters.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  max={localFilters.endDate}
                />
              </div>
              <span className="date-separator">→</span>
              <div className="date-input-wrapper">
                <span className="date-label">To</span>
                <input
                  type="date"
                  className="date-input"
                  value={localFilters.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  min={localFilters.startDate}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="filter-group">
            <label className="filter-label">Status</label>
            <div className="status-options">
              {[
                { value: 'all', label: 'All', icon: '📋' },
                { value: 'present', label: 'Present', icon: '✓' },
                { value: 'late', label: 'Late', icon: '⏰' },
                { value: 'absent', label: 'Absent', icon: '✗' },
                { value: 'leave', label: 'Leave', icon: '🏖️' }
              ].map(option => (
                <button
                  key={option.value}
                  className={`status-option ${localFilters.status === option.value ? 'active' : ''}`}
                  onClick={() => handleChange('status', option.value)}
                >
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="filter-group">
            <label className="filter-label">Search Notes</label>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search in notes..."
                value={localFilters.search}
                onChange={(e) => handleChange('search', e.target.value)}
              />
              {localFilters.search && (
                <button
                  className="clear-search-btn"
                  onClick={() => handleChange('search', '')}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="filter-actions">
            <button className="reset-filters-btn" onClick={handleReset}>
              Reset
            </button>
            <button className="apply-filters-btn" onClick={handleApply}>
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceFilters;
