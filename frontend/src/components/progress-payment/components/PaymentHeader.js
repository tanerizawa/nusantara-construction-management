import React from 'react';
import { Plus } from 'lucide-react';

/**
 * Header component untuk Progress Payment Manager
 */
const PaymentHeader = ({ onCreatePayment, canCreate }) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Progress Payments</h2>
        <p className="text-gray-600 mt-1">Manajemen pembayaran bertahap berdasarkan Berita Acara</p>
      </div>
      <button
        onClick={onCreatePayment}
        disabled={!canCreate}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title={!canCreate ? 'Perlu Berita Acara yang disetujui untuk membuat pembayaran' : 'Buat Progress Payment baru'}
      >
        <Plus className="h-4 w-4 mr-2" />
        Buat Pembayaran
      </button>
    </div>
  );
};

export default PaymentHeader;
