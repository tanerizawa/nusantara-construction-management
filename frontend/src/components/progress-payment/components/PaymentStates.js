import React from 'react';
import { Receipt, Plus } from 'lucide-react';
import { AlertCircle } from 'lucide-react';

/**
 * Empty state component
 */
export const PaymentEmptyState = ({ hasApprovedBA, onCreatePayment }) => {
  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-12 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0A84FF]/10 mb-4">
        <Receipt className="h-8 w-8 text-[#0A84FF]" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Belum Ada Progress Payment</h3>
      <p className="text-[#8E8E93] mb-6 max-w-md mx-auto">
        {!hasApprovedBA 
          ? 'Buat dan setujui Berita Acara terlebih dahulu untuk membuat pembayaran progress.'
          : 'Buat progress payment pertama berdasarkan Berita Acara yang sudah disetujui.'
        }
      </p>
      {hasApprovedBA && onCreatePayment && (
        <button
          onClick={onCreatePayment}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#30D158] text-white text-sm font-medium rounded-lg hover:bg-[#30D158]/90 transition-colors"
        >
          <Plus size={16} />
          <span>Buat Pembayaran Pertama</span>
        </button>
      )}
      {!hasApprovedBA && (
        <p className="text-xs text-[#FF9500] mt-4">
          💡 Tip: Approve Berita Acara di tab "Berita Acara" untuk membuat pembayaran
        </p>
      )}
    </div>
  );
};

/**
 * Loading state component
 */
export const PaymentLoadingState = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2 text-gray-600">Loading Progress Payments...</span>
    </div>
  );
};

/**
 * Error state component
 */
export const PaymentErrorState = ({ error }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <span className="text-red-700">Error: {error}</span>
      </div>
    </div>
  );
};
