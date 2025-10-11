import React from 'react';
import { X, FileText, Calendar, DollarSign, Receipt, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../utils/formatters';

/**
 * Inline detail view untuk Progress Payment
 * Menampilkan semua informasi payment, BA, dan invoice
 */
const PaymentDetailView = ({ payment, onClose }) => {
  if (!payment) return null;

  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg overflow-hidden animate-slideDown">
      {/* Header with Close Button */}
      <div className="sticky top-0 z-10 bg-[#1C1C1E] border-b border-[#38383A] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0A84FF] to-[#0066CC] flex items-center justify-center">
            <Receipt size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Payment Details</h3>
            <p className="text-sm text-[#8E8E93]">Payment #{payment.paymentNumber}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-[#8E8E93] hover:text-white hover:bg-[#38383A] rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Invoice Information */}
        <div className="bg-[#1C1C1E] rounded-lg p-4 border border-[#38383A]">
          <div className="flex items-center gap-2 mb-4">
            <Receipt size={18} className="text-[#0A84FF]" />
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Invoice Information</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#8E8E93] mb-1">Invoice Number</p>
              <p className="text-sm font-medium text-white">{payment.invoiceNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-[#8E8E93] mb-1">Invoice Date</p>
              <p className="text-sm font-medium text-white">
                {payment.invoiceDate ? formatDate(payment.invoiceDate) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#8E8E93] mb-1">Invoice Status</p>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${
                payment.status === 'paid' ? 'bg-[#30D158]/20 text-[#30D158]' :
                payment.status === 'approved' ? 'bg-[#30D158]/20 text-[#30D158]' :
                payment.status === 'rejected' ? 'bg-[#FF3B30]/20 text-[#FF3B30]' :
                payment.status === 'processing' ? 'bg-[#FF9F0A]/20 text-[#FF9F0A]' :
                'bg-[#8E8E93]/20 text-[#8E8E93]'
              }`}>
                {payment.status === 'paid' ? 'Paid' :
                 payment.status === 'approved' ? 'Approved' :
                 payment.status === 'rejected' ? 'Rejected' :
                 payment.status === 'processing' ? 'Pending' : 'Draft'}
              </span>
            </div>
            <div>
              <p className="text-xs text-[#8E8E93] mb-1">Due Date</p>
              <div className="flex items-center gap-1 text-sm font-medium text-white">
                <Calendar size={14} className="text-[#8E8E93]" />
                {formatDate(payment.dueDate)}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Amount Breakdown */}
        <div className="bg-[#1C1C1E] rounded-lg p-4 border border-[#38383A]">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={18} className="text-[#30D158]" />
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Payment Amount</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-[#38383A]">
              <span className="text-sm text-[#8E8E93]">Gross Amount</span>
              <span className="text-base font-semibold text-white">{formatCurrency(payment.amount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8E8E93]">Tax Amount</span>
              <span className="text-sm text-[#FF453A]">- {formatCurrency(payment.taxAmount || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8E8E93]">Retention Amount</span>
              <span className="text-sm text-[#FF9F0A]">- {formatCurrency(payment.retentionAmount || 0)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-[#38383A]">
              <span className="text-base font-semibold text-white">Net Amount</span>
              <span className="text-xl font-bold text-[#30D158]">{formatCurrency(payment.netAmount)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-[#8E8E93]">Percentage</span>
              <span className="text-sm font-medium text-[#0A84FF]">{payment.percentage}%</span>
            </div>
          </div>
        </div>

        {/* Berita Acara Information */}
        {payment.beritaAcara && (
          <div className="bg-[#1C1C1E] rounded-lg p-4 border border-[#38383A]">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={18} className="text-[#BF5AF2]" />
              <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Berita Acara</h4>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-[#8E8E93] mb-1">BA Number</p>
                <p className="text-sm font-medium text-white">{payment.beritaAcara.baNumber}</p>
              </div>
              <div>
                <p className="text-xs text-[#8E8E93] mb-1">BA Type</p>
                <p className="text-sm font-medium text-white">{payment.beritaAcara.baType}</p>
              </div>
              <div>
                <p className="text-xs text-[#8E8E93] mb-1">Work Description</p>
                <p className="text-sm text-white">{payment.beritaAcara.workDescription || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-[#8E8E93] mb-1">Completion</p>
                <p className="text-sm font-medium text-white">{payment.beritaAcara.completionPercentage}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="bg-[#1C1C1E] rounded-lg p-4 border border-[#38383A]">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-[#8E8E93]" />
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Additional Information</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#8E8E93] mb-1">Payment Method</p>
              <p className="text-sm font-medium text-white">{payment.paymentMethod || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-[#8E8E93] mb-1">Bank Account</p>
              <p className="text-sm font-medium text-white">{payment.bankAccount || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-[#8E8E93] mb-1">Reference Number</p>
              <p className="text-sm font-medium text-white">{payment.referenceNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-[#8E8E93] mb-1">Created At</p>
              <p className="text-sm font-medium text-white">{formatDate(payment.createdAt)}</p>
            </div>
          </div>
          {payment.notes && (
            <div className="mt-4">
              <p className="text-xs text-[#8E8E93] mb-1">Notes</p>
              <p className="text-sm text-white bg-[#2C2C2E] p-3 rounded-lg">{payment.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailView;
