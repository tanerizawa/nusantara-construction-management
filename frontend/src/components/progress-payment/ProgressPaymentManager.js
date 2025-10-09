import React from 'react';
import { useProgressPayments, useApprovedBA, usePaymentModals } from './hooks';
import {
  PaymentHeader,
  PaymentSummaryCards,
  BARequirementAlert,
  PaymentTable,
  PaymentEmptyState,
  PaymentLoadingState,
  PaymentErrorState,
  PaymentCreateModal,
  PaymentDetailModal
} from './components';

/**
 * Main component untuk Progress Payment Management
 * Modularized version - business logic extracted to hooks and components
 */
const ProgressPaymentManager = ({ projectId, project, onPaymentChange }) => {
  // Custom hooks
  const {
    payments,
    summary,
    loading,
    error,
    createPayment,
    approvePayment
  } = useProgressPayments(projectId, onPaymentChange);

  const { beritaAcaraList } = useApprovedBA(projectId);

  const {
    showCreateForm,
    selectedPayment,
    openCreateForm,
    closeCreateForm,
    openPaymentDetail,
    closePaymentDetail
  } = usePaymentModals();

  // Handle payment approval
  const handleApprovePayment = async (paymentId) => {
    const result = await approvePayment(paymentId);
    if (result.success && !result.cancelled) {
      alert(result.message);
    } else if (!result.success && !result.cancelled) {
      alert(result.message);
    }
  };

  // Handle create payment
  const handleCreatePayment = async (paymentData) => {
    const result = await createPayment(paymentData);
    if (result.success) {
      alert(result.message);
      closeCreateForm();
    } else {
      alert(result.message);
    }
  };

  // Loading state
  if (loading) {
    return <PaymentLoadingState />;
  }

  // Error state
  if (error) {
    return <PaymentErrorState error={error} />;
  }

  const hasApprovedBA = beritaAcaraList.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PaymentHeader 
        onCreatePayment={openCreateForm}
        canCreate={hasApprovedBA}
      />

      {/* Summary Cards */}
      <PaymentSummaryCards summary={summary} />

      {/* BA Requirement Alert */}
      <BARequirementAlert hasApprovedBA={hasApprovedBA} />

      {/* Payments List */}
      {payments.length === 0 ? (
        <PaymentEmptyState hasApprovedBA={hasApprovedBA} />
      ) : (
        <PaymentTable
          payments={payments}
          onViewPayment={openPaymentDetail}
          onApprovePayment={handleApprovePayment}
        />
      )}

      {/* Modals */}
      <PaymentCreateModal
        show={showCreateForm}
        onClose={closeCreateForm}
        onSubmit={handleCreatePayment}
      />

      <PaymentDetailModal
        payment={selectedPayment}
        onClose={closePaymentDetail}
      />
    </div>
  );
};

export default ProgressPaymentManager;
