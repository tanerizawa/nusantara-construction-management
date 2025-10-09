import React from 'react';
import { X, UserCheck } from 'lucide-react';
import { getStatusInfo } from '../config/statusConfig';
import { getItemConditionColor, getItemConditionLabel } from '../config/formConfig';
import { formatDate, formatCurrency } from '../utils/formatters';

/**
 * DetailModal Component
 * Shows detailed information about a receipt
 */
const DetailModal = ({ receipt, onClose, onApprove }) => {
  if (!receipt) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2C2C2E] rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">Detail Tanda Terima</h3>
            <button onClick={onClose} className="text-[#636366] hover:text-[#8E8E93]">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-3">Informasi Tanda Terima</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Nomor:</span>
                    <span className="font-medium">{receipt.receiptNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Tanggal Diterima:</span>
                    <span className="font-medium">{formatDate(receipt.receivedDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Tanggal Kirim:</span>
                    <span className="font-medium">{formatDate(receipt.deliveryDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(receipt.status).color}`}>
                      {getStatusInfo(receipt.status).label}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">Informasi PO</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Nomor PO:</span>
                    <span className="font-medium">{receipt.purchaseOrder?.poNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Supplier:</span>
                    <span className="font-medium">{receipt.purchaseOrder?.supplierName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Total PO:</span>
                    <span className="font-medium">{formatCurrency(receipt.purchaseOrder?.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Receiver Info */}
            <div>
              <h4 className="font-medium text-white mb-3">Informasi Penerima</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-[#8E8E93]">Nama:</span>
                  <p className="font-medium">{receipt.receiverName}</p>
                </div>
                <div>
                  <span className="text-[#8E8E93]">Jabatan:</span>
                  <p className="font-medium">{receipt.receiverPosition || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[#8E8E93]">Telepon:</span>
                  <p className="font-medium">{receipt.receiverPhone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            {receipt.items && receipt.items.length > 0 && (
              <div>
                <h4 className="font-medium text-white mb-3">Daftar Barang</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-[#38383A] rounded-lg text-sm">
                    <thead className="bg-[#1C1C1E]">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-[#636366]">Item</th>
                        <th className="px-4 py-2 text-left font-medium text-[#636366]">Dipesan</th>
                        <th className="px-4 py-2 text-left font-medium text-[#636366]">Diterima</th>
                        <th className="px-4 py-2 text-left font-medium text-[#636366]">Kondisi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {receipt.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 font-medium">{item.itemName}</td>
                          <td className="px-4 py-2">{item.orderedQuantity} {item.unit}</td>
                          <td className="px-4 py-2">{item.deliveredQuantity} {item.unit}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getItemConditionColor(item.condition)}`}>
                              {getItemConditionLabel(item.condition)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Notes */}
            {(receipt.qualityNotes || receipt.deliveryNotes) && (
              <div>
                <h4 className="font-medium text-white mb-3">Catatan</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {receipt.qualityNotes && (
                    <div>
                      <span className="text-[#8E8E93] font-medium">Kualitas:</span>
                      <p className="mt-1 text-gray-800">{receipt.qualityNotes}</p>
                    </div>
                  )}
                  {receipt.deliveryNotes && (
                    <div>
                      <span className="text-[#8E8E93] font-medium">Pengiriman:</span>
                      <p className="mt-1 text-gray-800">{receipt.deliveryNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              {(receipt.status === 'received' || receipt.status === 'pending_delivery') && (
                <button
                  onClick={() => {
                    onApprove(receipt.id);
                    onClose();
                  }}
                  className="px-4 py-2 bg-[#30D158] text-white rounded-lg hover:bg-[#30D158]/90 flex items-center gap-2"
                >
                  <UserCheck className="h-4 w-4" />
                  Setujui Tanda Terima
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-[#98989D] hover:bg-[#1C1C1E]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
