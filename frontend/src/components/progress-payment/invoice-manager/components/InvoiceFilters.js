import React from 'react';
import { Search } from 'lucide-react';
import { FILTER_OPTIONS } from '../config/invoiceConfig';

/**
 * Invoice Filters Component
 */
const InvoiceFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter 
}) => {
  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#636366]" />
          <input
            type="text"
            placeholder="Cari invoice atau BA..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1C1C1E] text-white text-sm border border-[#38383A] rounded-lg pl-9 pr-3 py-2 placeholder-[#636366] focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1C1C1E] text-white text-sm border border-[#38383A] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0A84FF] min-w-[140px]"
        >
          {FILTER_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default InvoiceFilters;