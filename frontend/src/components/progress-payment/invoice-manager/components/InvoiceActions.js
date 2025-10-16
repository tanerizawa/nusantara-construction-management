import React from 'react';
import { Eye, Printer, Send, CheckCircle, Mail, XCircle } from 'lucide-react';
import { INVOICE_STATUS } from '../config/invoiceConfig';

/**
 * Invoice Actions Component
 */
const InvoiceActions = ({ 
  invoice, 
  onView,
  onDownloadPDF,
  onMarkAsSent,
  onConfirmPayment,
  onSendEmail,
  onApprove,
  onReject
}) => {
  const { status } = invoice;

  return (
    <div className="flex gap-1.5 flex-shrink-0">
      {/* View - Always available */}
      <button
        onClick={() => onView(invoice)}
        className="p-2 text-[#0A84FF] hover:bg-[#0A84FF]/10 rounded-lg transition-colors"
        title="Lihat Detail Invoice"
      >
        <Eye size={16} />
      </button>
      
      {/* Download PDF - Always available for generated/sent/paid/overdue */}
      {status !== INVOICE_STATUS.DRAFT && (
        <button
          onClick={() => onDownloadPDF(invoice)}
          className="p-2 text-[#30D158] hover:bg-[#30D158]/10 rounded-lg transition-colors"
          title="Download & Cetak PDF"
        >
          <Printer size={16} />
        </button>
      )}
      
      {/* Mark as Sent - For generated status */}
      {status === INVOICE_STATUS.GENERATED && (
        <button
          onClick={() => onMarkAsSent(invoice)}
          className="p-2 text-[#FF9F0A] hover:bg-[#FF9F0A]/10 rounded-lg transition-colors"
          title="Tandai Terkirim (Hardcopy)"
        >
          <Send size={16} />
        </button>
      )}
      
      {/* Confirm Payment - For invoice_sent status */}
      {status === INVOICE_STATUS.INVOICE_SENT && (
        <button
          onClick={() => onConfirmPayment(invoice)}
          className="p-2 text-[#30D158] hover:bg-[#30D158]/10 rounded-lg transition-colors"
          title="Konfirmasi Pembayaran Diterima"
        >
          <CheckCircle size={16} />
        </button>
      )}
      
      {/* Send Email - Optional for digital copy */}
      {(status === INVOICE_STATUS.GENERATED || status === INVOICE_STATUS.INVOICE_SENT) && (
        <button
          onClick={() => onSendEmail(invoice)}
          className="p-2 text-[#8E8E93] hover:bg-[#8E8E93]/10 rounded-lg transition-colors"
          title="Kirim via Email (Opsional)"
        >
          <Mail size={16} />
        </button>
      )}
      
      {/* Draft indicator - with Approve/Reject buttons */}
      {status === INVOICE_STATUS.DRAFT && (
        <div className="flex gap-2">
          {/* Approve Payment button for draft invoices */}
          <button
            onClick={() => onApprove(invoice)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-[#30D158] text-white rounded-lg hover:bg-[#30D158]/90 transition-colors"
            title="Approve Payment to Generate Invoice"
          >
            <CheckCircle size={14} />
            <span>Approve</span>
          </button>
          
          {/* Reject Payment button */}
          <button
            onClick={() => onReject(invoice)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-[#FF3B30] text-white rounded-lg hover:bg-[#FF3B30]/90 transition-colors"
            title="Reject Payment"
          >
            <XCircle size={14} />
            <span>Reject</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default InvoiceActions;