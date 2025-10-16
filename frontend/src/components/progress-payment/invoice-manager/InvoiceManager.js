import React from 'react';
import InvoiceDetailView from '../InvoiceDetailView';

// Hooks
import { useInvoiceManager } from './hooks/useInvoiceManager';
import { useInvoiceFilters } from './hooks/useInvoiceFilters';
import { useInvoiceActions } from './hooks/useInvoiceActions';
import { useInvoiceMarkSent } from './hooks/useInvoiceMarkSent';
import { useInvoicePayment } from './hooks/useInvoicePayment';
import { useBankAccounts } from './hooks/useBankAccounts';

// Components
import InvoiceStatisticsCards from './components/InvoiceStatisticsCards';
import InvoiceFilters from './components/InvoiceFilters';
import InvoiceList from './components/InvoiceList';
import MarkSentForm from './components/MarkSentForm';
import PaymentConfirmationForm from './components/PaymentConfirmationForm';

/**
 * Modular Invoice Manager Component
 * Manages invoices generated from progress payments
 */
const InvoiceManager = ({ 
  projectId, 
  payments, 
  project, 
  onApprovePayment,
  onRefresh
}) => {
  // Hooks
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter } = useInvoiceFilters();
  const { invoices, filteredInvoices, statistics } = useInvoiceManager(payments, searchTerm, statusFilter);
  const { bankAccounts, loadingBankAccounts } = useBankAccounts();
  
  const {
    selectedInvoice,
    handleViewInvoice,
    handleCloseDetail,
    handleApproveInvoice,
    handleRejectWithPrompt,
    handleDownloadPDF,
    handleSendEmail
  } = useInvoiceActions(projectId, onApprovePayment);

  const {
    showMarkSentForm,
    invoiceForAction: markSentInvoice,
    markSentData,
    loading: markSentLoading,
    initializeMarkSent,
    closeMarkSentForm,
    updateMarkSentData,
    submitMarkAsSent
  } = useInvoiceMarkSent(projectId, onRefresh);

  const {
    showConfirmPaymentForm,
    invoiceForAction: paymentInvoice,
    confirmPaymentData,
    loading: paymentLoading,
    initializePaymentConfirmation,
    closePaymentForm,
    updatePaymentData,
    submitPaymentConfirmation
  } = useInvoicePayment(projectId, onRefresh);

  // Action handlers for list items
  const handleMarkAsSent = (invoice) => {
    initializeMarkSent(invoice);
  };

  const handleConfirmPayment = (invoice) => {
    initializePaymentConfirmation(invoice);
  };

  const handleSendEmailWithProject = (invoice) => {
    handleSendEmail(invoice, project);
  };

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <InvoiceStatisticsCards statistics={statistics} />

      {/* Filters */}
      <InvoiceFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Invoice List */}
      <InvoiceList
        invoices={filteredInvoices}
        onView={handleViewInvoice}
        onDownloadPDF={handleDownloadPDF}
        onMarkAsSent={handleMarkAsSent}
        onConfirmPayment={handleConfirmPayment}
        onSendEmail={handleSendEmailWithProject}
        onApprove={handleApproveInvoice}
        onReject={handleRejectWithPrompt}
      />

      {/* Invoice Detail View */}
      {selectedInvoice && (
        <div className="mt-6">
          <InvoiceDetailView
            invoice={selectedInvoice}
            onClose={handleCloseDetail}
            projectInfo={project}
            onApprove={handleApproveInvoice}
            onReject={(invoice, reason) => {
              if (onApprovePayment) {
                onApprovePayment(invoice.id, 'rejected', reason);
                handleCloseDetail();
                alert(`Invoice ${invoice.invoiceNumber} ditolak.\nAlasan: ${reason}`);
              }
            }}
            canApprove={true}
          />
        </div>
      )}

      {/* Mark Invoice as Sent Form */}
      {showMarkSentForm && markSentInvoice && (
        <MarkSentForm
          invoice={markSentInvoice}
          formData={markSentData}
          onUpdateData={updateMarkSentData}
          onSubmit={submitMarkAsSent}
          onClose={closeMarkSentForm}
          loading={markSentLoading}
        />
      )}

      {/* Payment Confirmation Form */}
      {showConfirmPaymentForm && paymentInvoice && (
        <PaymentConfirmationForm
          invoice={paymentInvoice}
          formData={confirmPaymentData}
          bankAccounts={bankAccounts}
          loadingBanks={loadingBankAccounts}
          onUpdateData={updatePaymentData}
          onSubmit={submitPaymentConfirmation}
          onClose={closePaymentForm}
          loading={paymentLoading}
        />
      )}
    </div>
  );
};

export default InvoiceManager;