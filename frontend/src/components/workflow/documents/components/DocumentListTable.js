import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { formatDate } from '../../../../utils/formatters';
import { documentCategories } from '../config';
import { getStatusInfo } from '../config/statusConfig';
import { formatFileSize, getFileIcon } from '../utils';

/**
 * Document list table component for list view
 * Displays: documents in table format with actions
 * Dark theme with gradient background
 */
const DocumentListTable = ({ documents, onDownload, onEdit, onDelete }) => {
  return (
    <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border border-[#38383A] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#2C2C2E]/50 border-b border-[#38383A]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">Dokumen</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">Size</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">Upload Date</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-[#8E8E93] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#38383A]">
            {documents.map((doc) => {
              const category = documentCategories[doc.category];
              const Icon = getFileIcon(doc.fileType);
              const statusInfo = getStatusInfo(doc.status);
              
              return (
                <tr key={doc.id} className="hover:bg-[#2C2C2E]/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* File Icon with Background */}
                      <div className={`w-10 h-10 bg-${category.color}-500/10 rounded-lg flex items-center justify-center border border-${category.color}-500/30`}>
                        <Icon size={20} className={`text-${category.color}-500`} />
                      </div>
                      <div>
                        <div className="font-medium text-white">{doc.name}</div>
                        <div className="text-sm text-[#8E8E93]">{doc.filename}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#0A84FF]/10 text-[#0A84FF]">
                      {category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#FFFFFF]">{formatFileSize(doc.size)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                      doc.status === 'approved' ? 'bg-[#30D158]/20 text-[#30D158]' :
                      doc.status === 'review' ? 'bg-[#FFD60A]/20 text-[#FFD60A]' :
                      doc.status === 'draft' ? 'bg-[#8E8E93]/20 text-[#8E8E93]' :
                      'bg-[#FF453A]/20 text-[#FF453A]'
                    }`}>
                      {statusInfo.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#8E8E93]">{formatDate(doc.uploadDate)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => onDownload(doc.id, doc.filename)}
                        className="p-2 text-[#0A84FF] hover:bg-[#0A84FF]/10 rounded-lg transition-colors"
                        title="View Document"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(doc)}
                        className="p-2 text-[#FFD60A] hover:bg-[#FFD60A]/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(doc.id)}
                        className="p-2 text-[#FF453A] hover:bg-[#FF453A]/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentListTable;
