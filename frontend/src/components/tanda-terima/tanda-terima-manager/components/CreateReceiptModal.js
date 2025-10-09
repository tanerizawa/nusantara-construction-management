import React from 'react';
import { X } from 'lucide-react';
import { DELIVERY_METHODS } from '../config/formConfig';
import { formatCurrency } from '../utils/formatters';

/**
 * CreateReceiptModal Component
 * Modal for creating new tanda terima
 */
const CreateReceiptModal = ({
  show,
  formData,
  creating,
  availablePOs,
  onClose,
  onSubmit,
  onInputChange,
  onItemChange
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2C2C2E] rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">Buat Tanda Terima Baru</h3>
            <button onClick={onClose} className="text-[#636366] hover:text-[#8E8E93]">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#98989D] mb-1">
                  Purchase Order <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.purchaseOrderId}
                  onChange={(e) => onInputChange('purchaseOrderId', e.target.value)}
                  className="w-full border border-[#38383A] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF]"
                  required
                >
                  <option value="">Pilih Purchase Order</option>
                  {availablePOs.filter(po => po.canCreateReceipt).map((po) => (
                    <option key={po.id} value={po.id}>
                      {po.poNumber} - {po.supplierName} ({formatCurrency(po.totalAmount)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#98989D] mb-1">
                  Tanggal Pengiriman <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => onInputChange('deliveryDate', e.target.value)}
                  className="w-full border border-[#38383A] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#98989D] mb-1">
                  Lokasi Pengiriman <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.deliveryLocation}
                  onChange={(e) => onInputChange('deliveryLocation', e.target.value)}
                  rows={2}
                  className="w-full border border-[#38383A] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF]"
                  placeholder="Alamat lengkap lokasi pengiriman..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#98989D] mb-1">
                  Metode Pengiriman
                </label>
                <select
                  value={formData.deliveryMethod}
                  onChange={(e) => onInputChange('deliveryMethod', e.target.value)}
                  className="w-full border border-[#38383A] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF]"
                >
                  {DELIVERY_METHODS.map(method => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Receiver Info */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-white mb-4">Informasi Penerima</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#98989D] mb-1">
                    Nama Penerima <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.receiverName}
                    onChange={(e) => onInputChange('receiverName', e.target.value)}
                    className="w-full border border-[#38383A] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF]"
                    placeholder="Nama lengkap penerima"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#98989D] mb-1">
                    Jabatan
                  </label>
                  <input
                    type="text"
                    value={formData.receiverPosition}
                    onChange={(e) => onInputChange('receiverPosition', e.target.value)}
                    className="w-full border border-[#38383A] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF]"
                    placeholder="Site Manager, Supervisor, dll"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#98989D] mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    value={formData.receiverPhone}
                    onChange={(e) => onInputChange('receiverPhone', e.target.value)}
                    className="w-full border border-[#38383A] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF]"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>
            </div>

            {/* Items Table */}
            {formData.items.length > 0 && (
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-white mb-4">Daftar Barang</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-[#38383A] rounded-lg">
                    <thead className="bg-[#1C1C1E]">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#636366] uppercase">Item</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#636366] uppercase">Dipesan</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#636366] uppercase">Dikirim</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#636366] uppercase">Kondisi</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#636366] uppercase">Catatan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">
                            <div className="text-sm font-medium text-white">{item.itemName}</div>
                            <div className="text-sm text-[#636366]">
                              {formatCurrency(item.unitPrice)}/{item.unit}
                            </div>
                          </td>
                          <td className="px-4 py-2 text-sm text-white">
                            {item.orderedQuantity} {item.unit}
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={item.deliveredQuantity}
                              onChange={(e) => onItemChange(index, 'deliveredQuantity', parseFloat(e.target.value) || 0)}
                              className="w-20 border border-[#38383A] rounded px-2 py-1 text-sm"
                              min="0"
                              max={item.orderedQuantity}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <select
                              value={item.condition}
                              onChange={(e) => onItemChange(index, 'condition', e.target.value)}
                              className="w-full border border-[#38383A] rounded px-2 py-1 text-sm"
                            >
                              <option value="good">Baik</option>
                              <option value="damaged">Rusak</option>
                              <option value="incomplete">Tidak Lengkap</option>
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={item.notes}
                              onChange={(e) => onItemChange(index, 'notes', e.target.value)}
                              className="w-full border border-[#38383A] rounded px-2 py-1 text-sm"
                              placeholder="Catatan item..."
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-white mb-4">Catatan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#98989D] mb-1">
                    Catatan Kualitas
                  </label>
                  <textarea
                    value={formData.qualityNotes}
                    onChange={(e) => onInputChange('qualityNotes', e.target.value)}
                    rows={3}
                    className="w-full border border-[#38383A] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF]"
                    placeholder="Kondisi kualitas barang yang diterima..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#98989D] mb-1">
                    Catatan Pengiriman
                  </label>
                  <textarea
                    value={formData.deliveryNotes}
                    onChange={(e) => onInputChange('deliveryNotes', e.target.value)}
                    rows={3}
                    className="w-full border border-[#38383A] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF]"
                    placeholder="Catatan proses pengiriman..."
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#38383A] rounded-lg text-[#98989D] hover:bg-[#1C1C1E]"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={creating || !formData.purchaseOrderId}
                className="px-4 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 disabled:opacity-50"
              >
                {creating ? 'Membuat...' : 'Buat Tanda Terima'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateReceiptModal;
