import { useState } from 'react';

/**
 * Custom hook untuk mengelola modal states
 */
export const usePaymentModals = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const openCreateForm = () => setShowCreateForm(true);
  const closeCreateForm = () => setShowCreateForm(false);
  
  const openPaymentDetail = (payment) => setSelectedPayment(payment);
  const closePaymentDetail = () => setSelectedPayment(null);

  return {
    showCreateForm,
    selectedPayment,
    openCreateForm,
    closeCreateForm,
    openPaymentDetail,
    closePaymentDetail
  };
};
