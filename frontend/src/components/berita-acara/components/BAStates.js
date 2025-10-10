import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Komponen loading state untuk Berita Acara
 * Dark theme version
 */
export const BALoadingState = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A84FF]"></div>
      <span className="ml-3 text-[#8E8E93]">Loading Berita Acara...</span>
    </div>
  );
};

/**
 * Komponen error state untuk Berita Acara
 * Dark theme version
 */
export const BAErrorState = ({ error }) => {
  return (
    <div className="bg-[#2C2C2E] border border-[#FF3B30] rounded-lg p-6">
      <div className="flex items-center">
        <AlertTriangle size={20} className="text-[#FF3B30] mr-2" />
        <span className="text-[#FF3B30] font-medium">Error</span>
      </div>
      <p className="text-[#8E8E93] text-sm mt-1">{error}</p>
    </div>
  );
};
