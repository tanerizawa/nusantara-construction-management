import React from 'react';
import { Eye, CheckCircle, FileText, Calendar, Plus } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../utils/formatters';

/**
 * Table untuk menampilkan daftar progress payments
 * Modern dark theme with better UX
 */
const PaymentTable = ({ payments, onViewPayment, onApprovePayment, onCreatePayment, canCreate = true }) => {
  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg overflow-hidden">
      {/* Table Header - Compact */}
      <div className="px-4 py-3 border-b border-[#38383A] bg-[#1C1C1E] flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Daftar Progress Payments</h3>
          <p className="text-xs text-[#8E8E93] mt-0.5">{payments.length} pembayaran terdaftar</p>
        </div>
        {canCreate && onCreatePayment && (
          <button
            onClick={onCreatePayment}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#30D158] text-white text-sm rounded-lg hover:bg-[#30D158]/90 transition-colors font-medium"
          >
            <Plus size={16} />
            <span>Buat Pembayaran</span>
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#38383A]">
          <thead className="bg-[#1C1C1E]">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
                Payment Info
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
                Berita Acara
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
                Invoice
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#2C2C2E] divide-y divide-[#38383A]">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-[#38383A]/30 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0A84FF]/20 flex items-center justify-center flex-shrink-0">
                      <FileText size={14} className="text-[#0A84FF]" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white">
                        Payment #{payment.paymentNumber}
                      </div>
                      <div className="text-xs text-[#8E8E93]">
                        {formatDate(payment.createdAt)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div>
                    <div className="text-xs font-medium text-white">
                      {payment.beritaAcara?.baNumber || 'N/A'}
                    </div>
                    <div className="text-xs text-[#8E8E93]">
                      {payment.percentage}% selesai
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div>
                    <div className="text-xs font-medium text-white">
                      {formatCurrency(payment.netAmount)}
                    </div>
                    <div className="text-xs text-[#8E8E93]">
                      Gross: {formatCurrency(payment.amount)}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-[#8E8E93]">
                    <Calendar size={12} />
                    <span className="text-xs">{formatDate(payment.dueDate)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div>
                    <div className="text-xs font-medium text-white">
                      {payment.invoiceNumber || 'N/A'}
                    </div>
                    <div className="text-xs text-[#8E8E93]">
                      {payment.invoiceDate ? formatDate(payment.invoiceDate) : '-'}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onViewPayment(payment)}
                      className="p-1.5 text-[#0A84FF] hover:bg-[#0A84FF]/10 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
                    {payment.status === 'pending_approval' && (
                      <button
                        onClick={() => onApprovePayment(payment.id)}
                        className="p-1.5 text-[#30D158] hover:bg-[#30D158]/10 rounded-lg transition-colors"
                        title="Approve Payment"
                      >
                        <CheckCircle size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentTable;
