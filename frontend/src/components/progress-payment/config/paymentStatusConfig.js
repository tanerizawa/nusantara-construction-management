/**
 * Payment status configurations
 * Match with backend enum: pending_ba, pending_approval, approved, paid, rejected
 */
export const PAYMENT_STATUS = {
  PENDING_BA: 'pending_ba',           // Menunggu approval BA
  PENDING_APPROVAL: 'pending_approval', // Menunggu approval pembayaran
  APPROVED: 'approved',                // Disetujui, siap dibayar
  PAID: 'paid',                        // Sudah dibayar
  REJECTED: 'rejected'                 // Ditolak
};

/**
 * Get color class for payment status
 */
export const getStatusColor = (status) => {
  switch (status) {
    case PAYMENT_STATUS.PAID:
      return 'bg-green-100 text-green-800';
    case PAYMENT_STATUS.APPROVED:
      return 'bg-blue-100 text-blue-800';
    case PAYMENT_STATUS.PENDING_APPROVAL:
      return 'bg-purple-100 text-purple-800';
    case PAYMENT_STATUS.PENDING_BA:
      return 'bg-yellow-100 text-yellow-800';
    case PAYMENT_STATUS.REJECTED:
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
    case PAYMENT_STATUS.APPROVED:
      return 'Disetujui';
    case PAYMENT_STATUS.PENDING_APPROVAL:
      return 'Menunggu Approval';
    case PAYMENT_STATUS.PENDING_BA:
      return 'Menunggu BA';
    case PAYMENT_STATUS.REJECTED:
      return 'Ditolak';
    default:
      return status;
  }
};

/**
 * Check if payment can be approved
 */
export const canApprovePayment = (status) => {
  return status === PAYMENT_STATUS.PENDING_APPROVAL;
};

/**
 * Check if payment is completed
 */
export const isPaymentCompleted = (status) => {
  return status === PAYMENT_STATUS.PAID;
};
