import React, { useState } from 'react';
import { X, PackageCheck, Calendar, MapPin, User } from 'lucide-react';

/**
 * CreateTandaTerimaModal Component
 * Modal for creating new delivery receipt (Tanda Terima)
 */
const CreateTandaTerimaModal = ({ isOpen, onClose, availablePOs, projectId, onSuccess }) => {
  const [formData, setFormData] = useState({
    purchaseOrderId: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    deliveryLocation: '',
    receiverName: '',
    receiverPosition: '',
    receiverPhone: '',
    deliveryNotes: '',
    receiptType: 'full_delivery'
  });
  
  const [selectedPO, setSelectedPO] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePOSelect = (e) => {
    const poId = e.target.value;
    setFormData({ ...formData, purchaseOrderId: poId });
    
    const po = availablePOs.find(p => p.id === poId);
    setSelectedPO(po);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${projectId}/delivery-receipts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('✅ Tanda Terima berhasil dibuat!');
        onSuccess && onSuccess();
        onClose();
      } else {
        setError(result.error || 'Gagal membuat tanda terima');
      }
    } catch (err) {
      console.error('Error creating delivery receipt:', err);
      setError('Terjadi kesalahan saat membuat tanda terima');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#1C1C1E] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-[#38383A]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#38383A]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#BF5AF2]/10">
              <PackageCheck className="h-5 w-5 text-[#BF5AF2]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Buat Tanda Terima</h2>
              <p className="text-sm text-[#8E8E93]">Catat penerimaan barang/material dari supplier</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#2C2C2E] transition-colors"
          >
            <X className="h-5 w-5 text-[#8E8E93]" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/30 rounded-lg p-4">
                <p className="text-[#FF3B30] text-sm">{error}</p>
              </div>
            )}

            {/* Purchase Order Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Purchase Order <span className="text-[#FF3B30]">*</span>
              </label>
              <select
                value={formData.purchaseOrderId}
                onChange={handlePOSelect}
                required
                className="w-full px-4 py-3 bg-[#2C2C2E] text-white rounded-lg border border-[#38383A] focus:outline-none focus:ring-2 focus:ring-[#BF5AF2] focus:border-transparent"
              >
                <option value="">Pilih Purchase Order</option>
                {availablePOs.map(po => (
                  <option key={po.id} value={po.id}>
                    {po.poNumber} - {po.supplierName} (Rp {parseInt(po.totalAmount).toLocaleString('id-ID')})
                  </option>
                ))}
              </select>
            </div>

            {/* PO Details Preview */}
            {selectedPO && (
              <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
                <h3 className="text-sm font-semibold text-white mb-3">Detail Purchase Order</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8E8E93]">Supplier:</span>
                    <span className="text-white font-medium">{selectedPO.supplierName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8E8E93]">Total Amount:</span>
                    <span className="text-white font-medium">Rp {parseInt(selectedPO.totalAmount).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8E8E93]">Order Date:</span>
                    <span className="text-white">{new Date(selectedPO.orderDate).toLocaleDateString('id-ID')}</span>
                  </div>
                  {selectedPO.items && selectedPO.items.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#38383A]">
                      <p className="text-[#8E8E93] text-xs mb-2">Items ({selectedPO.items.length}):</p>
                      {selectedPO.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="text-sm text-white mb-1">
                          • {item.itemName || item.description} ({item.quantity} {item.unit || 'pcs'})
                        </div>
                      ))}
                      {selectedPO.items.length > 3 && (
                        <p className="text-xs text-[#8E8E93] mt-1">+{selectedPO.items.length - 3} item lainnya</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Receipt Type */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tipe Penerimaan <span className="text-[#FF3B30]">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="receiptType"
                    value="full_delivery"
                    checked={formData.receiptType === 'full_delivery'}
                    onChange={(e) => setFormData({ ...formData, receiptType: e.target.value })}
                    className="text-[#BF5AF2]"
                  />
                  <span className="text-white text-sm">Pengiriman Penuh</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="receiptType"
                    value="partial_delivery"
                    checked={formData.receiptType === 'partial_delivery'}
                    onChange={(e) => setFormData({ ...formData, receiptType: e.target.value })}
                    className="text-[#BF5AF2]"
                  />
                  <span className="text-white text-sm">Pengiriman Sebagian</span>
                </label>
              </div>
            </div>

            {/* Delivery Date */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Tanggal Penerimaan <span className="text-[#FF3B30]">*</span>
              </label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                required
                className="w-full px-4 py-3 bg-[#2C2C2E] text-white rounded-lg border border-[#38383A] focus:outline-none focus:ring-2 focus:ring-[#BF5AF2] focus:border-transparent"
              />
            </div>

            {/* Delivery Location */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Lokasi Penerimaan <span className="text-[#FF3B30]">*</span>
              </label>
              <input
                type="text"
                value={formData.deliveryLocation}
                onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                placeholder="Contoh: Gudang Site, Kantor Proyek, dll"
                required
                className="w-full px-4 py-3 bg-[#2C2C2E] text-white rounded-lg border border-[#38383A] focus:outline-none focus:ring-2 focus:ring-[#BF5AF2] focus:border-transparent placeholder-[#636366]"
              />
            </div>

            {/* Receiver Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Nama Penerima <span className="text-[#FF3B30]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.receiverName}
                  onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                  placeholder="Nama lengkap penerima"
                  required
                  className="w-full px-4 py-3 bg-[#2C2C2E] text-white rounded-lg border border-[#38383A] focus:outline-none focus:ring-2 focus:ring-[#BF5AF2] focus:border-transparent placeholder-[#636366]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Jabatan Penerima <span className="text-[#FF3B30]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.receiverPosition}
                  onChange={(e) => setFormData({ ...formData, receiverPosition: e.target.value })}
                  placeholder="Contoh: Site Manager, Logistik"
                  required
                  className="w-full px-4 py-3 bg-[#2C2C2E] text-white rounded-lg border border-[#38383A] focus:outline-none focus:ring-2 focus:ring-[#BF5AF2] focus:border-transparent placeholder-[#636366]"
                />
              </div>
            </div>

            {/* Receiver Phone */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                No. Telepon Penerima
              </label>
              <input
                type="tel"
                value={formData.receiverPhone}
                onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })}
                placeholder="08xxx"
                className="w-full px-4 py-3 bg-[#2C2C2E] text-white rounded-lg border border-[#38383A] focus:outline-none focus:ring-2 focus:ring-[#BF5AF2] focus:border-transparent placeholder-[#636366]"
              />
            </div>

            {/* Delivery Notes */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Catatan Pengiriman
              </label>
              <textarea
                value={formData.deliveryNotes}
                onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                placeholder="Kondisi barang, keterangan tambahan, dll"
                rows={3}
                className="w-full px-4 py-3 bg-[#2C2C2E] text-white rounded-lg border border-[#38383A] focus:outline-none focus:ring-2 focus:ring-[#BF5AF2] focus:border-transparent placeholder-[#636366] resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-[#38383A] bg-[#1C1C1E]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-[#2C2C2E] text-white hover:bg-[#3A3A3C] transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || !formData.purchaseOrderId}
              className="px-6 py-2.5 rounded-lg bg-[#BF5AF2] text-white hover:bg-[#BF5AF2]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <PackageCheck className="h-4 w-4" />
                  Buat Tanda Terima
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTandaTerimaModal;
