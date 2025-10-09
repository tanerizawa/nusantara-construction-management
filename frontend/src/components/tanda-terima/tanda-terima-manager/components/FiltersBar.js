import React from 'react';
import { Search } from 'lucide-react';
import { STATUS_FILTER_OPTIONS } from '../config/statusConfig';

/**
 * FiltersBar Component
 * Search and filter controls
 */
const FiltersBar = ({ searchTerm, statusFilter, onSearchChange, onStatusChange }) => {
  return (
    <div className="flex gap-4">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#636366]" />
        <input
          type="text"
          placeholder="Cari nomor tanda terima, PO, atau supplier..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ 
            backgroundColor: '#1C1C1E !important', 
            color: 'white !important',
            border: '1px solid #38383A',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            paddingLeft: '2.5rem'
          }}
          className="w-full placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF]"
        />
      </div>

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        style={{ 
          backgroundColor: '#1C1C1E !important', 
          color: 'white !important',
          border: '1px solid #38383A',
          borderRadius: '0.5rem',
          padding: '0.5rem 1rem'
        }}
        className="focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF]"
      >
        {STATUS_FILTER_OPTIONS.map(option => (
          <option key={option.value} value={option.value} style={{ backgroundColor: '#1C1C1E', color: 'white' }}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FiltersBar;
