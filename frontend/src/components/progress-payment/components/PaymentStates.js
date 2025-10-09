import React from 'react';
import { Receipt } from 'lucide-react';
import { AlertCircle } from 'lucide-react';

/**
 * Empty state component
 */
export const PaymentEmptyState = ({ hasApprovedBA }) => {
  return (
    <div className="text-center py-12">
      <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Progress Payment</h3>
      <p className="text-gray-600 mb-4">
        {!hasApprovedBA 
          ? 'Buat dan setujui Berita Acara terlebih dahulu untuk membuat pembayaran.'
          : 'Buat progress payment pertama berdasarkan Berita Acara yang sudah disetujui.'
        }
      </p>
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
