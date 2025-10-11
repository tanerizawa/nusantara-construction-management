import React, { useState } from 'react';
import { X, Receipt, DollarSign, FileText, Building, User, CheckCircle, XCircle, Clock, Send } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { formatAddress } from '../../../utils/locationUtils';

/**
 * Invoice Detail View Component
 * Displays complete invoice information inline with approval functionality
 */
const InvoiceDetailView = ({ 
  invoice, 
  onClose, 
  projectInfo,
  onApprove,
  onReject,
  onSend,
  onMarkAsPaid,
  canApprove = false
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  if (!invoice) return null;

  // Determine invoice status based on payment workflow
  // paymentStatus comes from backend and is already transformed to frontend format:
  // 'pending_ba', 'ba_approved', 'pending_approval' → Draft
  // 'processing' → Pending
  // 'approved' (from payment_approved) → Approved
  // 'paid' → Paid
  // 'rejected' (from cancelled) → Rejected
  
  const isDraft = invoice.paymentStatus === 'pending_ba' || 
                  invoice.paymentStatus === 'ba_approved' ||
                  invoice.paymentStatus === 'pending_approval';
  const isPending = invoice.paymentStatus === 'processing';
  const isApproved = invoice.paymentStatus === 'approved';
  const isPaid = invoice.paymentStatus === 'paid';
  const isRejected = invoice.paymentStatus === 'rejected';

  const handleSend = () => {
    if (onSend) {
      onSend(invoice);
    }
  };

  const handleApprove = () => {
    if (onApprove) {
      onApprove(invoice);
    }
  };

  const handleMarkAsPaid = () => {
    if (onMarkAsPaid) {
      onMarkAsPaid(invoice);
    }
  };

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const handleRejectConfirm = () => {
    if (onReject) {
      onReject(invoice, rejectionReason);
      setShowRejectModal(false);
      setRejectionReason('');
    }
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setRejectionReason('');
  };

  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg overflow-hidden animate-slideDown">
      {/* Header with Close Button */}
      <div className="sticky top-0 z-10 bg-[#1C1C1E] border-b border-[#38383A] px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF453A] to-[#CC0000] flex items-center justify-center">
              <Receipt size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Invoice Detail</h3>
              <p className="text-sm text-[#8E8E93]">{invoice.invoiceNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8E8E93] hover:text-white hover:bg-[#38383A] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Payment Status Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#8E8E93]">Invoice Status:</span>
            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
              isPaid ? 'bg-[#30D158]/20 text-[#30D158]' :
              isApproved ? 'bg-[#30D158]/20 text-[#30D158]' :
              isRejected ? 'bg-[#FF3B30]/20 text-[#FF3B30]' :
              isPending ? 'bg-[#FF9F0A]/20 text-[#FF9F0A]' :
              'bg-[#8E8E93]/20 text-[#8E8E93]'
            }`}>
              {isPaid && <CheckCircle size={14} />}
              {isApproved && <CheckCircle size={14} />}
              {isRejected && <XCircle size={14} />}
              {isPending && <Clock size={14} />}
              {isPaid ? 'Paid' :
               isApproved ? 'Approved' :
               isRejected ? 'Rejected' :
               isPending ? 'Pending Approval' : 'Draft'}
            </span>
          </div>

          {/* Action Buttons based on status */}
          <div className="flex gap-2">
            {/* Draft: Show Send button */}
            {isDraft && (
              <button
                onClick={handleSend}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 transition-colors"
              >
                <Send size={16} />
                Kirim Invoice
              </button>
            )}

            {/* Pending: Show Approve/Reject buttons */}
            {canApprove && isPending && (
              <>
                <button
                  onClick={handleApprove}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#30D158] text-white rounded-lg hover:bg-[#30D158]/90 transition-colors"
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
                <button
                  onClick={handleRejectClick}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#FF3B30] text-white rounded-lg hover:bg-[#FF3B30]/90 transition-colors"
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </>
            )}

            {/* Approved: Show Mark as Paid button */}
            {canApprove && isApproved && (
              <button
                onClick={handleMarkAsPaid}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#30D158] text-white rounded-lg hover:bg-[#30D158]/90 transition-colors"
              >
                <CheckCircle size={16} />
                Mark as Paid
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Invoice Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* From (Company) */}
          <div className="bg-[#1C1C1E] rounded-lg p-4 border border-[#38383A]">
            <div className="flex items-center gap-2 mb-3">
              <Building size={18} className="text-[#0A84FF]" />
              <h4 className="text-sm font-semibold text-white uppercase tracking-wide">From</h4>
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-white">Nusantara Group</p>
              <p className="text-sm text-[#8E8E93]">Construction & Development</p>
              <p className="text-sm text-[#8E8E93]">Jl. Syeh Quro, Ruko Grandpermata</p>
              <p className="text-sm text-[#8E8E93]">Lt. 2, Karawang, Jawa Barat</p>
            </div>
          </div>

          {/* To (Client) */}
          <div className="bg-[#1C1C1E] rounded-lg p-4 border border-[#38383A]">
            <div className="flex items-center gap-2 mb-3">
              <User size={18} className="text-[#30D158]" />
              <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Bill To</h4>
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-white">{projectInfo?.clientName || 'Client Name'}</p>
              <p className="text-sm text-[#8E8E93]">{projectInfo?.name || 'Project Name'}</p>
              <p className="text-sm text-[#8E8E93]">{formatAddress(projectInfo?.location, 'Lokasi belum ditentukan')}</p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="bg-[#1C1C1E] rounded-lg p-4 border border-[#38383A]">
          <div className="flex items-center gap-2 mb-4">
            <Receipt size={18} className="text-[#FF453A]" />
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Invoice Information</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-[#8E8E93] mb-1">Invoice Number</p>
              <p className="text-sm font-medium text-white">{invoice.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-xs text-[#8E8E93] mb-1">Invoice Date</p>
              <p className="text-sm font-medium text-white">{formatDate(invoice.invoiceDate)}</p>
            </div>
            <div>
              <p className="text-xs text-[#8E8E93] mb-1">Due Date</p>
              <p className="text-sm font-medium text-white">{formatDate(invoice.dueDate)}</p>
            </div>
            <div>
              <p className="text-xs text-[#8E8E93] mb-1">Status</p>
              <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                isPaid ? 'bg-[#30D158]/20 text-[#30D158]' :
                isApproved ? 'bg-[#30D158]/20 text-[#30D158]' :
                isRejected ? 'bg-[#FF3B30]/20 text-[#FF3B30]' :
                isPending ? 'bg-[#FF9F0A]/20 text-[#FF9F0A]' :
                'bg-[#8E8E93]/20 text-[#8E8E93]'
              }`}>
                {isPaid && <CheckCircle size={12} />}
                {isApproved && <CheckCircle size={12} />}
                {isRejected && <XCircle size={12} />}
                {isPending && <Clock size={12} />}
                {isPaid ? 'Paid' :
                 isApproved ? 'Approved' :
                 isRejected ? 'Rejected' :
                 isPending ? 'Pending' : 'Draft'}
              </span>
            </div>
          </div>
        </div>

        {/* Berita Acara Reference */}
        {invoice.beritaAcara && (
          <div className="bg-[#1C1C1E] rounded-lg p-4 border border-[#38383A]">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={18} className="text-[#BF5AF2]" />
              <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Berita Acara Reference</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#8E8E93] mb-1">BA Number</p>
                <p className="text-sm font-medium text-white">{invoice.beritaAcara.baNumber}</p>
              </div>
              <div>
                <p className="text-xs text-[#8E8E93] mb-1">BA Type</p>
                <p className="text-sm font-medium text-white">{invoice.beritaAcara.baType}</p>
              </div>
              {invoice.beritaAcara.workDescription && (
                <div className="col-span-2">
                  <p className="text-xs text-[#8E8E93] mb-1">Work Description</p>
                  <p className="text-sm text-white">{invoice.beritaAcara.workDescription}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Amount Breakdown */}
        <div className="bg-[#1C1C1E] rounded-lg p-4 border border-[#38383A]">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={18} className="text-[#30D158]" />
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Amount Details</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-[#38383A]">
              <span className="text-sm text-[#8E8E93]">Gross Amount</span>
              <span className="text-base font-semibold text-white">{formatCurrency(invoice.amount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8E8E93]">Tax Amount</span>
              <span className="text-sm text-[#FF453A]">- {formatCurrency(invoice.taxAmount || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8E8E93]">Retention Amount</span>
              <span className="text-sm text-[#FF9F0A]">- {formatCurrency(invoice.retentionAmount || 0)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t-2 border-[#38383A]">
              <span className="text-lg font-bold text-white">Net Amount</span>
              <span className="text-2xl font-bold text-[#30D158]">{formatCurrency(invoice.netAmount)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="bg-[#1C1C1E] rounded-lg p-4 border border-[#38383A]">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-2">Notes</h4>
            <p className="text-sm text-[#8E8E93]">{invoice.notes}</p>
          </div>
        )}

        {/* Terms & Conditions */}
        <div className="bg-[#1C1C1E] rounded-lg p-4 border border-[#38383A]">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">Terms & Conditions</h4>
          <ul className="text-sm text-[#8E8E93] space-y-2">
            <li>• Payment must be made within {invoice.paymentTerms || 30} days from invoice date</li>
            <li>• Late payments may incur additional charges</li>
            <li>• All prices are in Indonesian Rupiah (IDR)</li>
            <li>• Please include invoice number in payment reference</li>
          </ul>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1C1C1E] border border-[#38383A] rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#FF3B30]/20 flex items-center justify-center">
                <XCircle size={20} className="text-[#FF3B30]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Reject Invoice</h3>
                <p className="text-sm text-[#8E8E93]">{invoice.invoiceNumber}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#8E8E93] mb-2">
                Rejection Reason <span className="text-[#FF3B30]">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white placeholder-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#FF3B30] focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRejectConfirm}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-2 text-sm font-medium bg-[#FF3B30] text-white rounded-lg hover:bg-[#FF3B30]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Rejection
              </button>
              <button
                onClick={handleRejectCancel}
                className="flex-1 px-4 py-2 text-sm font-medium bg-[#38383A] text-white rounded-lg hover:bg-[#48484A] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetailView;
