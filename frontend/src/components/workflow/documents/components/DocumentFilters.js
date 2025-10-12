import React from 'react';
import { Search } from 'lucide-react';
import { documentCategories } from '../config';

/**
 * Search and filter controls component
 * Handles: search input, category filter dropdown
 */
const DocumentFilters = ({ searchTerm, setSearchTerm, filterCategory, setFilterCategory }) => {
  return (
    <div className="flex gap-4">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8E8E93]" />
        <input
          type="text"
          placeholder="Cari dokumen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white placeholder-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent transition-all"
        />
      </div>
      
      {/* Category Filter */}
      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="bg-[#2C2C2E] border border-[#38383A] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent transition-all appearance-none cursor-pointer pr-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238E8E93' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center'
        }}
      >
        <option value="all">Semua Kategori</option>
        {Object.entries(documentCategories).map(([key, cat]) => (
          <option key={key} value={key}>{cat.name}</option>
        ))}
      </select>
    </div>
  );
};

export default DocumentFilters;
