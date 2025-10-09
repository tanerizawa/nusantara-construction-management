import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Komponen loading state untuk Berita Acara
 */
export const BALoadingState = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Loading Berita Acara...</span>
    </div>
  );
};

/**
 * Komponen error state untuk Berita Acara
 */
export const BAErrorState = ({ error }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
        <span className="text-red-700 font-medium">Error</span>
      </div>
      <p className="text-red-600 text-sm mt-1">{error}</p>
    </div>
  );
};
