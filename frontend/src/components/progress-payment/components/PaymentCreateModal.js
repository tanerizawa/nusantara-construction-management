import React from 'react';

/**
 * Modal untuk membuat progress payment baru
 * TODO: Implement full form functionality
 */
const PaymentCreateModal = ({ show, onClose, onSubmit }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <h3 className="text-lg font-semibold mb-4">Buat Progress Payment</h3>
        <p className="text-gray-600 mb-4">
          Form untuk membuat progress payment berdasarkan Berita Acara yang sudah disetujui.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onClose();
              alert('Progress Payment form sedang dalam pengembangan');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCreateModal;
