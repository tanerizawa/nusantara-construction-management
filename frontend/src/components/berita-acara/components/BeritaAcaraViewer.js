import React from 'react';

/**
 * Viewer component untuk menampilkan detail Berita Acara
 * TODO: Implement full viewer functionality
 */
const BeritaAcaraViewer = ({ 
  beritaAcara, 
  project, 
  onEdit, 
  onBack 
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">View Berita Acara</h3>
      <p className="text-gray-600 mb-4">BA viewer implementation would go here...</p>
      <div className="flex space-x-3">
        <button
          onClick={onEdit}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onBack}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Kembali
        </button>
      </div>
    </div>
  );
};

export default BeritaAcaraViewer;
