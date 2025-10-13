import React from 'react';
import { FileText, DollarSign, Receipt } from 'lucide-react';
import { CalendarIconWhite } from '../../../../components/ui/CalendarIcon';
import { ApprovalStatusBadge, ApprovalActions } from './';
import { formatCurrency, formatDate } from '../../../../utils/formatters';

/**
 * Progress Payment Content Component
 * Displays list of payments waiting for approval
 */
const ProgressPaymentContent = ({ 
  data, 
  onMarkAsReviewed, 
  onApprove, 
  onReject 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2C2C2E] flex items-center justify-center">
          <DollarSign size={32} className="text-[#30D158]" />
        </div>
        <p className="text-[#8E8E93] text-sm">Tidak ada payment yang menunggu approval</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map(payment => (
        <div
          key={payment.id}
          className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4 hover:border-[#0A84FF]/30 transition-all"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1">
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg bg-[#FF453A]/20 flex items-center justify-center flex-shrink-0">
                <Receipt size={20} className="text-[#FF453A]" />
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-white">
                    Payment #{payment.paymentNumber || payment.id?.slice(0, 8)}
                  </h4>
                  <ApprovalStatusBadge status={payment.status} />
                </div>
                <p className="text-xs text-[#8E8E93] line-clamp-2">
                  {payment.notes || 'No description'}
                </p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4 pl-[52px]">
            {/* Invoice Info */}
            <div>
              <p className="text-xs text-[#8E8E93] mb-1">Invoice Number</p>
              <div className="flex items-center gap-1">
                <Receipt size={14} className="text-[#8E8E93]" />
                <p className="text-sm font-medium text-white">
                  {payment.invoiceNumber || 'N/A'}
                </p>
              </div>
            </div>

            {/* Invoice Date */}
            <div>
              <p className="text-xs text-[#8E8E93] mb-1">Invoice Date</p>
              <div className="flex items-center gap-1">
                <CalendarIconWhite size={14} className="text-[#0A84FF]" />
                <p className="text-sm text-white">
                  {payment.invoiceDate ? formatDate(payment.invoiceDate) : 'N/A'}
                </p>
              </div>
            </div>

            {/* Berita Acara */}
            <div>
              <p className="text-xs text-[#8E8E93] mb-1">Berita Acara</p>
              <div className="flex items-center gap-1">
                <FileText size={14} className="text-[#0A84FF]" />
                <p className="text-sm font-medium text-white">
                  {payment.beritaAcara?.baNumber || 'N/A'}
                </p>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <p className="text-xs text-[#8E8E93] mb-1">Due Date</p>
              <div className="flex items-center gap-1">
                <CalendarIconWhite size={14} className="text-[#0A84FF]" />
                <p className="text-sm text-white">
                  {formatDate(payment.dueDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="bg-[#1C1C1E] rounded-lg p-3 mb-4 pl-[52px] ml-[-52px]">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#8E8E93]">Gross Amount</span>
                <span className="text-sm font-medium text-white">
                  {formatCurrency(payment.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#8E8E93]">Tax Amount</span>
                <span className="text-sm text-[#FF453A]">
                  - {formatCurrency(payment.taxAmount || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#8E8E93]">Retention Amount</span>
                <span className="text-sm text-[#FF9F0A]">
                  - {formatCurrency(payment.retentionAmount || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#38383A]">
                <span className="text-sm font-semibold text-white">Net Amount</span>
                <span className="text-base font-bold text-[#30D158]">
                  {formatCurrency(payment.netAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#8E8E93]">Percentage</span>
                <span className="text-sm font-medium text-[#0A84FF]">
                  {payment.percentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pl-[52px]">
            <ApprovalActions
              item={payment}
              onReview={onMarkAsReviewed}
              onApprove={onApprove}
              onReject={onReject}
            />
          </div>

          {/* Metadata Footer */}
          <div className="flex items-center gap-4 pt-3 mt-3 border-t border-[#38383A] pl-[52px] text-xs text-[#8E8E93]">
            <span>Created: {formatDate(payment.createdAt)}</span>
            {payment.approvedAt && (
              <span>Approved: {formatDate(payment.approvedAt)}</span>
            )}
            {payment.approvedBy && (
              <span>By: {payment.approvedBy}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressPaymentContent;
