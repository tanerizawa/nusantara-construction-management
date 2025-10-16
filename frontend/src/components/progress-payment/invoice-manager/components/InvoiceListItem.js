import React from 'react';
import { Receipt } from 'lucide-react';
import { formatDate, formatCurrency } from '../../../../utils/formatters';
import InvoiceStatusBadge from './InvoiceStatusBadge';
import InvoiceActions from './InvoiceActions';

/**
 * Individual Invoice List Item Component
 */
const InvoiceListItem = ({ 
  invoice,
  onView,
  onDownloadPDF,
  onMarkAsSent,
  onConfirmPayment,
  onSendEmail,
  onApprove,
  onReject
}) => {
  return (
    <div className="p-4 hover:bg-[#38383A]/20 transition-colors">
      <div className="flex items-start justify-between gap-4">
        {/* Invoice Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#FF453A]/20 flex items-center justify-center flex-shrink-0">
            <Receipt size={20} className="text-[#FF453A]" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h4 className="text-sm font-semibold text-white truncate">
                {invoice.invoiceNumber}
              </h4>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs mb-2">
              <div>
                <p className="text-[#8E8E93] mb-0.5">Invoice Date</p>
                <p className="text-white">{formatDate(invoice.invoiceDate)}</p>
              </div>
              <div>
                <p className="text-[#8E8E93] mb-0.5">Due Date</p>
                <p className="text-white">{formatDate(invoice.dueDate)}</p>
              </div>
              <div>
                <p className="text-[#8E8E93] mb-0.5">Berita Acara</p>
                <p className="text-white truncate">{invoice.beritaAcara?.baNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#8E8E93] mb-0.5">Amount</p>
                <p className="text-white font-semibold">{formatCurrency(invoice.netAmount)}</p>
              </div>
            </div>

            {invoice.notes && (
              <p className="text-xs text-[#8E8E93] line-clamp-1">{invoice.notes}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <InvoiceActions
          invoice={invoice}
          onView={onView}
          onDownloadPDF={onDownloadPDF}
          onMarkAsSent={onMarkAsSent}
          onConfirmPayment={onConfirmPayment}
          onSendEmail={onSendEmail}
          onApprove={onApprove}
          onReject={onReject}
        />
      </div>
    </div>
  );
};

export default InvoiceListItem;