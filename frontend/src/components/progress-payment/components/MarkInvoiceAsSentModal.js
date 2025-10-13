import React, { useState } from 'react';
import { X, Upload, Calendar, User, Package, FileText } from 'lucide-react';

/**
 * Modal untuk konfirmasi invoice sudah dikirim (hardcopy)
 * Includes: recipient, date, method, evidence upload, notes
 */
const MarkInvoiceAsSentModal = ({ invoice, isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    recipientName: '',
    sentDate: new Date().toISOString().split('T')[0],
    deliveryMethod: 'courier',
    deliveryNotes: '',
    courierService: '',
    trackingNumber: ''
  });
  
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !invoice) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          evidenceFile: 'File harus berupa JPG, PNG, atau PDF'
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          evidenceFile: 'Ukuran file maksimal 5MB'
        }));
        return;
      }

      setEvidenceFile(file);
      setErrors(prev => ({ ...prev, evidenceFile: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Nama penerima harus diisi';
    } else if (formData.recipientName.trim().length < 3) {
      newErrors.recipientName = 'Nama penerima minimal 3 karakter';
    }

    if (!formData.sentDate) {
      newErrors.sentDate = 'Tanggal kirim harus diisi';
    } else {
      const sentDate = new Date(formData.sentDate);
      const today = new Date();
      if (sentDate > today) {
        newErrors.sentDate = 'Tanggal kirim tidak boleh di masa depan';
      }
    }

    if (!formData.deliveryMethod) {
      newErrors.deliveryMethod = 'Metode pengiriman harus dipilih';
    }

    if (formData.deliveryMethod === 'courier' && !formData.courierService.trim()) {
      newErrors.courierService = 'Nama kurir harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onConfirm({
        ...formData,
        recipientName: formData.recipientName.trim(),
        deliveryNotes: formData.deliveryNotes.trim(),
        courierService: formData.courierService.trim(),
        trackingNumber: formData.trackingNumber.trim(),
        evidenceFile
      });
      onClose();
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Gagal menyimpan data: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1C1C1E] rounded-2xl border border-[#38383A] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1C1C1E] border-b border-[#38383A] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FF9F0A]/20 flex items-center justify-center">
              <Package size={20} className="text-[#FF9F0A]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Konfirmasi Pengiriman Invoice</h2>
              <p className="text-sm text-[#8E8E93]">Invoice {invoice.invoiceNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#38383A] rounded-lg transition-colors"
          >
            <X size={20} className="text-[#8E8E93]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Invoice Info */}
          <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#8E8E93] mb-1">Invoice Amount</p>
                <p className="text-white font-semibold">{invoice.netAmount?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}</p>
              </div>
              <div>
                <p className="text-[#8E8E93] mb-1">Due Date</p>
                <p className="text-white">{new Date(invoice.dueDate).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-[#0A84FF]/10 border border-[#0A84FF]/30 rounded-lg p-4">
            <p className="text-sm font-medium text-[#0A84FF] mb-3">Pastikan sebelum mengirim:</p>
            <div className="space-y-2 text-sm text-[#8E8E93]">
              <div className="flex items-center gap-2">
                <span className="text-[#30D158]">✓</span>
                <span>Invoice sudah dicetak pada kertas berkualitas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#30D158]">✓</span>
                <span>Tanda tangan basah dari pejabat berwenang</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#30D158]">✓</span>
                <span>Stempel perusahaan sudah dibubuhkan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#30D158]">✓</span>
                <span>Materai (jika diperlukan untuk nilai &gt; Rp 5 juta)</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Recipient Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Diterima oleh <span className="text-[#FF3B30]">*</span>
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => handleChange('recipientName', e.target.value)}
                  placeholder="Nama penerima (contoh: Bpk. Budi Santoso)"
                  className={`w-full bg-[#2C2C2E] text-white border ${errors.recipientName ? 'border-[#FF3B30]' : 'border-[#38383A]'} rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50 placeholder-[#636366]`}
                />
              </div>
              {errors.recipientName && (
                <p className="mt-1 text-xs text-[#FF3B30]">{errors.recipientName}</p>
              )}
            </div>

            {/* Send Date */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tanggal Kirim <span className="text-[#FF3B30]">*</span>
              </label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
                <input
                  type="date"
                  value={formData.sentDate}
                  onChange={(e) => handleChange('sentDate', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full bg-[#2C2C2E] text-white border ${errors.sentDate ? 'border-[#FF3B30]' : 'border-[#38383A]'} rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50`}
                />
              </div>
              {errors.sentDate && (
                <p className="mt-1 text-xs text-[#FF3B30]">{errors.sentDate}</p>
              )}
            </div>

            {/* Delivery Method */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Metode Pengiriman <span className="text-[#FF3B30]">*</span>
              </label>
              <div className="space-y-2">
                {[
                  { value: 'courier', label: 'Kurir (JNE, JNT, SiCepat, dll)', icon: '🚚' },
                  { value: 'post', label: 'Pos Indonesia', icon: '📮' },
                  { value: 'hand_delivery', label: 'Diantar langsung', icon: '👤' },
                  { value: 'other', label: 'Lainnya', icon: '📦' }
                ].map(method => (
                  <label
                    key={method.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${formData.deliveryMethod === method.value ? 'border-[#0A84FF] bg-[#0A84FF]/10' : 'border-[#38383A] hover:border-[#8E8E93]'} cursor-pointer transition-colors`}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value={method.value}
                      checked={formData.deliveryMethod === method.value}
                      onChange={(e) => handleChange('deliveryMethod', e.target.value)}
                      className="text-[#0A84FF]"
                    />
                    <span className="text-lg">{method.icon}</span>
                    <span className="text-sm text-white">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Courier Service (conditional) */}
            {formData.deliveryMethod === 'courier' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Nama Kurir <span className="text-[#FF3B30]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.courierService}
                    onChange={(e) => handleChange('courierService', e.target.value)}
                    placeholder="contoh: JNE"
                    className={`w-full bg-[#2C2C2E] text-white border ${errors.courierService ? 'border-[#FF3B30]' : 'border-[#38383A]'} rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50 placeholder-[#636366]`}
                  />
                  {errors.courierService && (
                    <p className="mt-1 text-xs text-[#FF3B30]">{errors.courierService}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    No. Resi (opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.trackingNumber}
                    onChange={(e) => handleChange('trackingNumber', e.target.value)}
                    placeholder="contoh: JNE12345678"
                    className="w-full bg-[#2C2C2E] text-white border border-[#38383A] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50 placeholder-[#636366]"
                  />
                </div>
              </div>
            )}

            {/* Evidence Upload */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Bukti Pengiriman (opsional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="evidence-upload"
                />
                <label
                  htmlFor="evidence-upload"
                  className="flex items-center gap-3 p-4 bg-[#2C2C2E] border border-dashed border-[#38383A] rounded-lg cursor-pointer hover:border-[#0A84FF] transition-colors"
                >
                  <Upload size={20} className="text-[#8E8E93]" />
                  <div className="flex-1">
                    {evidenceFile ? (
                      <p className="text-sm text-white">{evidenceFile.name}</p>
                    ) : (
                      <p className="text-sm text-[#8E8E93]">
                        Klik untuk upload foto resi atau bukti kirim (JPG, PNG, PDF - Max 5MB)
                      </p>
                    )}
                  </div>
                </label>
                {errors.evidenceFile && (
                  <p className="mt-1 text-xs text-[#FF3B30]">{errors.evidenceFile}</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Catatan Tambahan (opsional)
              </label>
              <textarea
                value={formData.deliveryNotes}
                onChange={(e) => handleChange('deliveryNotes', e.target.value)}
                placeholder="contoh: Invoice dikirim via JNE reguler, estimasi 2-3 hari"
                rows={3}
                className="w-full bg-[#2C2C2E] text-white border border-[#38383A] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50 placeholder-[#636366] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#1C1C1E] border-t border-[#38383A] px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#2C2C2E] text-white rounded-lg hover:bg-[#38383A] transition-colors text-sm font-medium disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#FF9F0A] text-white rounded-lg hover:bg-[#FF9F0A]/90 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <FileText size={16} />
                <span>Konfirmasi Terkirim</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkInvoiceAsSentModal;
