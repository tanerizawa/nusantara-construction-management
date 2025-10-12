import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';

/**
 * Search bar component untuk Projects page
 * Implements debounced search untuk performance
 */
const ProjectSearchBar = ({ 
  value, 
  onChange, 
  onClear,
  placeholder = "Cari proyek...",
  disabled = false,
  isLoading = false // New prop untuk show loading spinner
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#636366] w-4 h-4 pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full pl-10 pr-10 py-2 border border-[#38383A] rounded-lg 
                   focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent 
                   bg-[#1C1C1E] text-white placeholder-[#636366]
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-150"
      />
      {/* Loading Spinner or Clear Button */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        {isLoading ? (
          <Loader2 className="w-4 h-4 text-[#0A84FF] animate-spin" aria-label="Mencari..." />
        ) : value ? (
          <button
            onClick={onClear}
            className="text-[#636366] hover:text-white transition-colors duration-150"
            aria-label="Hapus pencarian"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ProjectSearchBar;
