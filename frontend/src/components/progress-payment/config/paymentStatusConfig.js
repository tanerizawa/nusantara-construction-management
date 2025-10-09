/**
 * Payment status configurations
 */
export const PAYMENT_STATUS = {
  PAID: 'paid',
  PAYMENT_APPROVED: 'payment_approved',
  BA_APPROVED: 'ba_approved',
  PROCESSING: 'processing',
  PENDING_BA: 'pending_ba',
  CANCELLED: 'cancelled'
};

/**
 * Get color class for payment status
 */
export const getStatusColor = (status) => {
  switch (status) {
    case PAYMENT_STATUS.PAID:
      return 'bg-green-100 text-green-800';
    case PAYMENT_STATUS.PAYMENT_APPROVED:
      return 'bg-blue-100 text-blue-800';
    case PAYMENT_STATUS.BA_APPROVED:
      return 'bg-purple-100 text-purple-800';
    case PAYMENT_STATUS.PROCESSING:
      return 'bg-yellow-100 text-yellow-800';
    case PAYMENT_STATUS.PENDING_BA:
      return 'bg-gray-100 text-gray-800';
    case PAYMENT_STATUS.CANCELLED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get label for payment status
 */
export const getStatusLabel = (status) => {
  switch (status) {
    case PAYMENT_STATUS.PAID:
      return 'Dibayar';
    case PAYMENT_STATUS.PAYMENT_APPROVED:
      return 'Payment Disetujui';
    case PAYMENT_STATUS.BA_APPROVED:
      return 'BA Disetujui';
    case PAYMENT_STATUS.PROCESSING:
      return 'Diproses';
    case PAYMENT_STATUS.PENDING_BA:
      return 'Menunggu BA';
    case PAYMENT_STATUS.CANCELLED:
      return 'Dibatalkan';
    default:
      return status;
  }
};

/**
 * Check if payment can be approved
 */
export const canApprovePayment = (status) => {
  return status === PAYMENT_STATUS.BA_APPROVED;
};

/**
 * Check if payment is completed
 */
export const isPaymentCompleted = (status) => {
  return status === PAYMENT_STATUS.PAID;
};
