import React from 'react';
import { Eye } from 'lucide-react';
import { getStatusInfo } from '../config/statusConfig';
import { formatDate } from '../utils/formatters';

/**
 * ReceiptsTable Component
 * Displays list of receipts in table format
 * Note: Approval button removed - receipts are auto-approved on creation
 */
const ReceiptsTable = ({ receipts, onView }) => {
  return (
    <div className="overflow-x-auto">
            <table className="w-full">
        <thead className="bg-[#1C1C1E] border-b border-[#38383A]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
              Tanda Terima
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
              Purchase Order
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
              Penerima
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
              Tanggal
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#8E8E93] uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-[#2C2C2E] divide-y divide-[#38383A]">
          {receipts.map((receipt) => {
            const statusInfo = getStatusInfo(receipt.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <tr key={receipt.id} className="hover:bg-[#3A3A3C]">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">
                    {receipt.receiptNumber}
                  </div>
                  <div className="text-sm text-[#636366]">
                    {receipt.receiptType === 'full_delivery' ? 'Pengiriman Penuh' : 'Pengiriman Sebagian'}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">
                    {receipt.purchaseOrder?.poNumber || 'N/A'}
                  </div>
                  <div className="text-sm text-[#636366]">
                    {receipt.purchaseOrder?.supplierName || 'N/A'}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">
                    {receipt.receiverName}
                  </div>
                  <div className="text-sm text-[#636366]">
                    {receipt.receiverPosition || 'N/A'}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">
                    Diterima: {formatDate(receipt.receivedDate)}
                  </div>
                  <div className="text-sm text-[#636366]">
                    Kirim: {formatDate(receipt.deliveryDate)}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onView(receipt)}
                    className="p-2 rounded-lg bg-[#0A84FF]/10 text-[#0A84FF] hover:bg-[#0A84FF]/20 transition-colors"
                    title="Lihat Detail"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ReceiptsTable;
