import React from 'react';
import { FileText, FolderOpen, Eye, Clock } from 'lucide-react';
import { formatFileSize } from '../utils';

/**
 * Document statistics cards component
 * Displays: total documents, total size, approved count, review count
 */
const DocumentStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <FileText size={20} />
          <span className="font-medium">Total Dokumen</span>
        </div>
        <div className="text-2xl font-bold text-blue-700">{stats.totalDocuments}</div>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-green-600 mb-2">
          <FolderOpen size={20} />
          <span className="font-medium">Total Size</span>
        </div>
        <div className="text-2xl font-bold text-green-700">
          {formatFileSize(stats.totalSize)}
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-yellow-600 mb-2">
          <Eye size={20} />
          <span className="font-medium">Disetujui</span>
        </div>
        <div className="text-2xl font-bold text-yellow-700">{stats.byStatus.approved}</div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-purple-600 mb-2">
          <Clock size={20} />
          <span className="font-medium">Review</span>
        </div>
        <div className="text-2xl font-bold text-purple-700">{stats.byStatus.review}</div>
      </div>
    </div>
  );
};

export default DocumentStats;
