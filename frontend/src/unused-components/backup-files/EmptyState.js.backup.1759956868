import React from 'react';
import { FileText } from 'lucide-react';

/**
 * Empty state component
 * Shown when no documents available or no search results
 */
const EmptyState = ({ searchTerm, filterCategory }) => {
  return (
    <div className="text-center py-12">
      <FileText size={48} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada dokumen</h3>
      <p className="text-gray-600">
        {searchTerm || filterCategory !== 'all' 
          ? 'Tidak ada dokumen yang sesuai dengan filter' 
          : 'Belum ada dokumen yang diupload'
        }
      </p>
    </div>
  );
};

export default EmptyState;
