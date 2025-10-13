import React, { useState } from 'react';
import { PackageCheck, MapPin, User, ChevronDown, ChevronUp } from 'lucide-react';
import { DateInputWithIcon } from '../../../ui/CalendarIcon';

/**
 * CreateTandaTerimaForm Component
 * Inline collapsible form for creating new delivery receipt
 */
const CreateTandaTerimaForm = ({ availablePOs, projectId, onSuccess }) => {
  const [isExpanded, setIsExpanded] = useState(false);
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
      // Prepare items from selected PO
      const items = selectedPO && selectedPO.items ? selectedPO.items.map(item => ({
        itemName: item.itemName || item.description || 'Item',
        orderedQty: parseFloat(item.quantity) || 0,
        receivedQty: parseFloat(item.quantity) || 0, // Full delivery by default
        unit: item.unit || 'pcs',
        condition: 'good',
        notes: ''
      })) : [];

      // Transform formData to match backend schema
      const requestData = {
        purchaseOrderId: formData.purchaseOrderId,
        receiptType: formData.receiptType,
        receivedDate: formData.deliveryDate, // Map deliveryDate → receivedDate
        location: formData.deliveryLocation, // Map deliveryLocation → location
        receivedBy: formData.receiverName || 'System',
        items: items, // REQUIRED: items array
        vehicleInfo: formData.receiverPhone ? {
          driverName: formData.receiverName,
          driverPhone: formData.receiverPhone
        } : undefined,
        notes: formData.deliveryNotes || '', // Map deliveryNotes → notes
        storageLocation: formData.deliveryLocation,
        status: 'received', // Set to received for auto-approval
        createdBy: localStorage.getItem('userId') || localStorage.getItem('username') || 'system' // REQUIRED
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${projectId}/delivery-receipts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('✅ Tanda Terima berhasil dibuat dan otomatis disetujui!');
        
        // Reset form
        setFormData({
          purchaseOrderId: '',
          deliveryDate: new Date().toISOString().split('T')[0],
          deliveryLocation: '',
          receiverName: '',
          receiverPosition: '',
          receiverPhone: '',
          deliveryNotes: '',
          receiptType: 'full_delivery'
        });
        setSelectedPO(null);
        setIsExpanded(false);
        
        onSuccess && onSuccess();
      } else {
        // Show detailed validation errors
        let errorMsg = 'Gagal membuat tanda terima';
        
        if (result.details) {
          // Handle both array and object details
          if (Array.isArray(result.details)) {
            errorMsg = `Validation error: ${result.details.join(', ')}`;
          } else if (typeof result.details === 'object') {
            errorMsg = `Validation error: ${JSON.stringify(result.details)}`;
          } else {
            errorMsg = `Validation error: ${result.details}`;
          }
        } else if (result.error) {
          errorMsg = result.error;
        } else if (result.message) {
          errorMsg = result.message;
        }
        
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Error creating delivery receipt:', err);
      setError('Terjadi kesalahan saat membuat tanda terima');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setError('');
    setSelectedPO(null);
    setFormData({
      purchaseOrderId: '',
      deliveryDate: new Date().toISOString().split('T')[0],
      deliveryLocation: '',
      receiverName: '',
      receiverPosition: '',
      receiverPhone: '',
      deliveryNotes: '',
      receiptType: 'full_delivery'
    });
  };

  if (availablePOs.length === 0) {
    return null; // Don't show form if no POs available
  }

  return (
    <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] overflow-hidden" data-create-form>
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-[#3A3A3C] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#BF5AF2]/10">
            <PackageCheck className="h-5 w-5 text-[#BF5AF2]" />
          </div>
          <div className="text-left">
            <h3 className="text-base font-semibold text-white">Buat Tanda Terima Baru</h3>
            <p className="text-sm text-[#8E8E93]">
              {availablePOs.length} PO tersedia untuk dibuat tanda terima
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-[#8E8E93]" />
        ) : (
          <ChevronDown className="h-5 w-5 text-[#8E8E93]" />
        )}
      </button>

      {/* Form Content - Collapsible */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="border-t border-[#38383A]">
          <div className="p-4 space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/30 rounded-lg p-3">
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
                className="w-full px-3 py-2.5 bg-[#1C1C1E] text-white rounded-lg border border-[#38383A] focus:outline-none focus:ring-2 focus:ring-[#BF5AF2] focus:border-transparent text-sm"
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
              <div className="bg-[#1C1C1E] rounded-lg p-3 border border-[#38383A]">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-[#8E8E93]">Supplier:</span>
                    <p className="text-white font-medium">{selectedPO.supplierName}</p>
                  </div>
                  <div>
                    <span className="text-[#8E8E93]">Total:</span>
                    <p className="text-white font-medium">Rp {parseInt(selectedPO.totalAmount).toLocaleString('id-ID')}</p>
                  </div>
                  {selectedPO.items && selectedPO.items.length > 0 && (
                    <div className="col-span-2 mt-2 pt-2 border-t border-[#38383A]">
                      <span className="text-[#8E8E93] text-xs">Items: {selectedPO.items.length} item</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Receipt Type */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Tipe Penerimaan <span className="text-[#FF3B30]">*</span>
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="receiptType"
                      value="full_delivery"
                      checked={formData.receiptType === 'full_delivery'}
                      onChange={(e) => setFormData({ ...formData, receiptType: e.target.value })}
                      className="text-[#BF5AF2]"
                    />
                    <span className="text-white text-sm">Penuh</span>
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
                    <span className="text-white text-sm">Sebagian</span>
                  </label>
                </div>
              </div>

              {/* Delivery Date */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Tanggal Terima <span className="text-[#FF3B30]">*</span>
                </label>
                <DateInputWithIcon
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 bg-[#1C1C1E] text-white rounded-lg border border-[#38383A] focus:outline-none focus:ring-2 focus:ring-[#BF5AF2] focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Delivery Location */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <MapPin className="inline h-3.5 w-3.5 mr-1" />
                Lokasi Penerimaan <span className="text-[#FF3B30]">*</span>
              </label>
              <input
                type="text"
                value={formData.deliveryLocation}
                onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                placeholder="Contoh: Gudang Site, Kantor Proyek"
                required
                className="w-full px-3 py-2.5 bg-[#1C1C1E] text-white rounded-lg border border-[#38383A] focus:outline-none focus:ring-2 focus:ring-[#BF5AF2] focus:border-transparent text-sm placeholder-[#636366]"
              />
            </div>

            {/* Receiver Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <User className="inline h-3.5 w-3.5 mr-1" />
                  Nama Penerima <span className="text-[#FF3B30]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.receiverName}
                  onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                  placeholder="Nama lengkap"
                  required
                  className="w-full px-3 py-2.5 bg-[#1C1C1E] text-white rounded-lg border border-[#38383A] focus:outline-none focus:ring-2 focus:ring-[#BF5AF2] focus:border-transparent text-sm placeholder-[#636366]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Jabatan <span className="text-[#FF3B30]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.receiverPosition}
                  onChange={(e) => setFormData({ ...formData, receiverPosition: e.target.value })}
                  placeholder="Site Manager, dll"
                  required
                  className="w-full px-3 py-2.5 bg-[#1C1C1E] text-white rounded-lg border border-[#38383A] focus:outline-none focus:ring-2 focus:ring-[#BF5AF2] focus:border-transparent text-sm placeholder-[#636366]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  No. Telepon
                </label>
                <input
                  type="tel"
                  value={formData.receiverPhone}
                  onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })}
                  placeholder="08xxx"
                  className="w-full px-3 py-2.5 bg-[#1C1C1E] text-white rounded-lg border border-[#38383A] focus:outline-none focus:ring-2 focus:ring-[#BF5AF2] focus:border-transparent text-sm placeholder-[#636366]"
                />
              </div>
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
                rows={2}
                className="w-full px-3 py-2.5 bg-[#1C1C1E] text-white rounded-lg border border-[#38383A] focus:outline-none focus:ring-2 focus:ring-[#BF5AF2] focus:border-transparent text-sm placeholder-[#636366] resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[#3A3A3C] text-white hover:bg-[#48484A] transition-colors disabled:opacity-50 text-sm"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading || !formData.purchaseOrderId}
                className="px-4 py-2 rounded-lg bg-[#BF5AF2] text-white hover:bg-[#BF5AF2]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <PackageCheck className="h-4 w-4" />
                    Simpan Tanda Terima
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateTandaTerimaForm;
