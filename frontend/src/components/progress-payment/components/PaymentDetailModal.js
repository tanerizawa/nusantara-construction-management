import React from 'react';

/**
 * Modal untuk menampilkan detail payment
 * @deprecated Use PaymentDetailView.js instead which has full functionality
 * This component is kept for backward compatibility
 */
const PaymentDetailModal = ({ payment, onClose }) => {
  if (!payment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
        <p className="text-gray-600 mb-4">
          Detail informasi pembayaran #{payment.paymentNumber}
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailModal;
