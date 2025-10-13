import React, { useState } from 'react';
import { DollarSign, Receipt } from 'lucide-react';
import { useProgressPayments, useApprovedBA, usePaymentModals } from './hooks';
import {
  PaymentSummaryCards,
  BARequirementAlert,
  PaymentTable,
  PaymentEmptyState,
  PaymentLoadingState,
  PaymentErrorState,
  PaymentCreateForm,
  PaymentDetailView,
  InvoiceManager,
  PaymentWorkflowGuide
} from './components';

/**
 * Main component untuk Progress Payment Management
 * Modularized version with tabs: Payments & Invoices
 */
const ProgressPaymentManager = ({ projectId, project, onPaymentChange }) => {
  const [activeTab, setActiveTab] = useState('payments'); // 'payments' or 'invoices'
  
  // Custom hooks
  const {
    payments,
    summary,
    loading,
    error,
    createPayment,
    approvePayment,
    refreshPayments
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
  const handleApprovePayment = async (paymentId, status = 'approved', reason = '') => {
    const result = await approvePayment(paymentId, status, reason);
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

  // Tab configuration
  const tabs = [
    {
      id: 'payments',
      label: 'Progress Payments',
      icon: DollarSign,
      description: 'Manajemen pembayaran progress'
    },
    {
      id: 'invoices',
      label: 'Invoice Management',
      icon: Receipt,
      description: 'Manajemen invoice dan tagihan'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Progress Payments</h2>
            <p className="text-sm text-[#8E8E93] mt-1">
              Manajemen pembayaran bertahap berdasarkan Berita Acara
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-[#38383A]">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative
                  ${isActive 
                    ? 'text-[#0A84FF] border-b-2 border-[#0A84FF]' 
                    : 'text-[#8E8E93] hover:text-white'
                  }
                `}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Workflow Guide - Collapsible Info Card */}
          <PaymentWorkflowGuide />
          
          {/* Summary Cards */}
          <PaymentSummaryCards summary={summary} />

          {/* Inline Create Form - Shows between summary cards and list */}
          {showCreateForm && (
            <PaymentCreateForm
              projectId={projectId}
              onClose={closeCreateForm}
              onSubmit={handleCreatePayment}
            />
          )}

          {/* Inline Detail View - Shows when payment is selected */}
          {selectedPayment && (
            <PaymentDetailView
              payment={selectedPayment}
              onClose={closePaymentDetail}
            />
          )}

          {/* BA Requirement Alert */}
          <BARequirementAlert hasApprovedBA={hasApprovedBA} />

          {/* Payments List */}
          {payments.length === 0 ? (
            <PaymentEmptyState 
              hasApprovedBA={hasApprovedBA} 
              onCreatePayment={hasApprovedBA ? openCreateForm : null}
            />
          ) : (
            <PaymentTable
              payments={payments}
              onViewPayment={openPaymentDetail}
              onApprovePayment={handleApprovePayment}
              onCreatePayment={openCreateForm}
              canCreate={hasApprovedBA}
            />
          )}
        </div>
      )}

      {/* Invoice Management Tab */}
      {activeTab === 'invoices' && (
        <InvoiceManager 
          projectId={projectId}
          payments={payments}
          project={project}
          onApprovePayment={handleApprovePayment}
          onRefresh={refreshPayments}
        />
      )}
    </div>
  );
};

export default ProgressPaymentManager;
