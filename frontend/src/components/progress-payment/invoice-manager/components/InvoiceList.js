import React from 'react';
import { Receipt } from 'lucide-react';
import InvoiceListItem from './InvoiceListItem';

/**
 * Invoice List Component
 */
const InvoiceList = ({ 
  invoices,
  onView,
  onDownloadPDF,
  onMarkAsSent,
  onConfirmPayment,
  onSendEmail,
  onApprove,
  onReject
}) => {
  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-[#38383A] bg-[#1C1C1E] flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Daftar Invoice</h3>
          <p className="text-xs text-[#8E8E93] mt-0.5">{invoices.length} invoice ditemukan</p>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="p-8 text-center">
          <Receipt size={40} className="text-[#8E8E93] mx-auto mb-3" />
          <p className="text-sm text-[#8E8E93]">Tidak ada invoice ditemukan</p>
        </div>
      ) : (
        <div className="divide-y divide-[#38383A]">
          {invoices.map(invoice => (
            <InvoiceListItem
              key={invoice.id}
              invoice={invoice}
              onView={onView}
              onDownloadPDF={onDownloadPDF}
              onMarkAsSent={onMarkAsSent}
              onConfirmPayment={onConfirmPayment}
              onSendEmail={onSendEmail}
              onApprove={onApprove}
              onReject={onReject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceList;