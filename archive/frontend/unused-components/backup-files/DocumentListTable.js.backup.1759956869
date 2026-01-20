import React from 'react';
import { Download, Edit, Trash2 } from 'lucide-react';
import { formatDate } from '../../../../utils/formatters';
import { documentCategories } from '../config';
import { getStatusInfo } from '../config/statusConfig';
import { formatFileSize, getFileIcon } from '../utils';

/**
 * Document list table component for list view
 * Displays: documents in table format with actions
 */
const DocumentListTable = ({ documents, onDownload, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-900">Dokumen</th>
              <th className="px-4 py-3 text-left font-medium text-gray-900">Kategori</th>
              <th className="px-4 py-3 text-left font-medium text-gray-900">Size</th>
              <th className="px-4 py-3 text-left font-medium text-gray-900">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-900">Upload Date</th>
              <th className="px-4 py-3 text-center font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documents.map((doc) => {
              const category = documentCategories[doc.category];
              const Icon = getFileIcon(doc.fileType);
              const statusInfo = getStatusInfo(doc.status);
              
              return (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Icon size={20} className={`text-${category.color}-600`} />
                      <div>
                        <div className="font-medium text-gray-900">{doc.name}</div>
                        <div className="text-sm text-gray-500">{doc.filename}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{category.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatFileSize(doc.size)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
                      {statusInfo.text}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(doc.uploadDate)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => onDownload(doc.id, doc.filename)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(doc)}
                        className="text-green-600 hover:text-green-800"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(doc.id)}
                        className="text-red-600 hover:text-red-800"
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
