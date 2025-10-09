import React from 'react';
import { Eye, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import { getStatusColor, getStatusLabel } from '../config/paymentStatusConfig';

/**
 * Table untuk menampilkan daftar progress payments
 */
const PaymentTable = ({ payments, onViewPayment, onApprovePayment }) => {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Berita Acara
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Payment #{payment.paymentNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      BA #{payment.beritaAcara?.baNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.completionPercentage}% selesai
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.netAmount)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Gross: {formatCurrency(payment.grossAmount)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                    {getStatusLabel(payment.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewPayment(payment)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {payment.status === 'ba_approved' && (
                      <button
                        onClick={() => onApprovePayment(payment.id)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="Approve Payment"
                      >
                        <CheckCircle className="h-4 w-4" />
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
