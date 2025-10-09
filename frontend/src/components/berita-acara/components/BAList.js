import React from 'react';
import { FileText } from 'lucide-react';
import BACard from './BACard';

/**
 * Komponen untuk menampilkan daftar Berita Acara
 */
const BAList = ({ 
  baList, 
  onView, 
  onEdit, 
  onSubmit, 
  onDelete,
  onCreateBA 
}) => {
  if (baList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Daftar Berita Acara</h4>
        </div>
        <div className="px-6 py-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Belum ada Berita Acara yang dibuat</p>
          <button
            onClick={onCreateBA}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Buat BA Pertama
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h4 className="text-lg font-medium text-gray-900">Daftar Berita Acara</h4>
      </div>
      <div className="divide-y divide-gray-200">
        {baList.map((ba) => (
          <BACard
            key={ba.id}
            ba={ba}
            onView={onView}
            onEdit={onEdit}
            onSubmit={onSubmit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default BAList;
