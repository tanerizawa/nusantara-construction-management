import React from 'react';
import { Search, Filter } from 'lucide-react';

/**
 * Dark themed search and filter bar
 * Matches modern design standards
 */
const TeamSearchBar = ({ searchTerm, onSearchChange, filterRole, onFilterChange, roles }) => {
  return (
    <div className="flex gap-4 items-center">
      {/* Search Input - Dark Theme */}
      <div className="flex-1 relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8E8E93]" />
        <input
          type="text"
          placeholder="Cari anggota tim..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-colors"
        />
      </div>
      
      {/* Role Filter - Dark Theme */}
      <div className="relative">
        <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8E8E93] pointer-events-none" />
        <select
          value={filterRole}
          onChange={(e) => onFilterChange(e.target.value)}
          className="pl-10 pr-8 py-2.5 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-colors appearance-none cursor-pointer min-w-[180px]"
        >
          <option value="all">Semua Role</option>
          {Object.keys(roles).map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        {/* Custom arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TeamSearchBar;
