import React from 'react';

/**
 * Form component untuk membuat atau mengedit Berita Acara
 * TODO: Implement full form functionality
 */
const BeritaAcaraForm = ({ 
  projectId, 
  project, 
  beritaAcara, 
  onSave, 
  onCancel 
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        {beritaAcara ? 'Edit Berita Acara' : 'Buat Berita Acara Baru'}
      </h3>
      <p className="text-gray-600 mb-4">Form implementation would go here...</p>
      <div className="flex space-x-3">
        <button
          onClick={onSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Simpan
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Batal
        </button>
      </div>
    </div>
  );
};

export default BeritaAcaraForm;
