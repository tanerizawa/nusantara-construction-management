import React from 'react';
import { Plus, DollarSign } from 'lucide-react';

/**
 * Header component untuk Progress Payment Manager
 * Modern dark theme with icon
 */
const PaymentHeader = ({ onCreatePayment, canCreate }) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0A84FF] to-[#0066CC] flex items-center justify-center shadow-lg">
          <DollarSign size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Progress Payments</h2>
          <p className="text-[#8E8E93] mt-0.5">Manajemen pembayaran bertahap berdasarkan Berita Acara</p>
        </div>
      </div>
      <button
        onClick={onCreatePayment}
        disabled={!canCreate}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#30D158] text-white rounded-lg hover:bg-[#30D158]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-lg disabled:shadow-none"
        title={!canCreate ? 'Perlu Berita Acara yang disetujui untuk membuat pembayaran' : 'Buat Progress Payment baru'}
      >
        <Plus size={18} />
        Buat Pembayaran
      </button>
    </div>
  );
};

export default PaymentHeader;
