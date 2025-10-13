import React, { useState } from 'react';
import { X, Upload, Calendar, DollarSign, Building, CheckCircle } from 'lucide-react';

/**
 * Modal untuk konfirmasi pembayaran sudah diterima
 * Includes: amount validation, date, bank, evidence upload (required), reference, notes
 */
const ConfirmPaymentReceivedModal = ({ invoice, isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    paidAmount: invoice?.netAmount || 0,
    paidDate: new Date().toISOString().split('T')[0],
    bank: '',
    paymentReference: '',
    paymentNotes: ''
  });
  
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !invoice) return null;

  const invoiceAmount = parseFloat(invoice.netAmount || 0);
  const amountMatches = parseFloat(formData.paidAmount) === invoiceAmount;

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

    if (!formData.paidAmount || formData.paidAmount <= 0) {
      newErrors.paidAmount = 'Jumlah pembayaran harus diisi';
    } else {
      const paidAmount = parseFloat(formData.paidAmount);
      if (paidAmount !== invoiceAmount) {
        newErrors.paidAmount = `Jumlah tidak sesuai invoice (${invoiceAmount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })})`;
      }
    }

    if (!formData.paidDate) {
      newErrors.paidDate = 'Tanggal terima harus diisi';
    } else {
      const paidDate = new Date(formData.paidDate);
      const today = new Date();
      if (paidDate > today) {
        newErrors.paidDate = 'Tanggal terima tidak boleh di masa depan';
      }
      // Check if before invoice sent date
      if (invoice.invoiceSentAt) {
        const sentDate = new Date(invoice.invoiceSentAt);
        if (paidDate < sentDate) {
          newErrors.paidDate = 'Tanggal terima tidak boleh sebelum invoice dikirim';
        }
      }
    }

    if (!formData.bank.trim()) {
      newErrors.bank = 'Bank penerima harus dipilih';
    }

    if (!evidenceFile) {
      newErrors.evidenceFile = 'Bukti transfer harus diupload';
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
        paidAmount: parseFloat(formData.paidAmount),
        paymentReference: formData.paymentReference.trim(),
        paymentNotes: formData.paymentNotes.trim(),
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

  const bankList = [
    'Bank Mandiri',
    'Bank BCA',
    'Bank BNI',
    'Bank BRI',
    'Bank CIMB Niaga',
    'Bank Danamon',
    'Bank Permata',
    'Bank BTN',
    'Bank Syariah Indonesia (BSI)',
    'Lainnya'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1C1C1E] rounded-2xl border border-[#38383A] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1C1C1E] border-b border-[#38383A] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#30D158]/20 flex items-center justify-center">
              <DollarSign size={20} className="text-[#30D158]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Konfirmasi Pembayaran Diterima</h2>
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
                <p className="text-white font-bold text-lg">
                  {invoiceAmount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                </p>
              </div>
              <div>
                <p className="text-[#8E8E93] mb-1">Due Date</p>
                <p className="text-white">{new Date(invoice.dueDate).toLocaleDateString('id-ID')}</p>
              </div>
              {invoice.invoiceSentAt && (
                <>
                  <div>
                    <p className="text-[#8E8E93] mb-1">Sent Date</p>
                    <p className="text-white">{new Date(invoice.invoiceSentAt).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-[#8E8E93] mb-1">Received By</p>
                    <p className="text-white">{invoice.invoiceRecipient || '-'}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Warning Alert */}
          <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/30 rounded-lg p-4">
            <p className="text-sm font-medium text-[#FF3B30] mb-2">⚠️ Penting!</p>
            <ul className="space-y-1 text-sm text-[#8E8E93]">
              <li>• Pastikan jumlah pembayaran sesuai dengan invoice</li>
              <li>• Upload bukti transfer adalah <strong className="text-white">WAJIB</strong></li>
              <li>• Data yang sudah dikonfirmasi tidak dapat diubah</li>
            </ul>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Paid Amount */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Jumlah Diterima <span className="text-[#FF3B30]">*</span>
              </label>
              <div className="relative">
                <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
                <input
                  type="number"
                  value={formData.paidAmount}
                  onChange={(e) => handleChange('paidAmount', e.target.value)}
                  className={`w-full bg-[#2C2C2E] text-white border ${errors.paidAmount ? 'border-[#FF3B30]' : amountMatches ? 'border-[#30D158]' : 'border-[#38383A]'} rounded-lg pl-10 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50`}
                />
                {amountMatches && (
                  <CheckCircle size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#30D158]" />
                )}
              </div>
              {errors.paidAmount && (
                <p className="mt-1 text-xs text-[#FF3B30]">{errors.paidAmount}</p>
              )}
              {amountMatches && !errors.paidAmount && (
                <p className="mt-1 text-xs text-[#30D158]">✓ Jumlah sesuai dengan invoice</p>
              )}
            </div>

            {/* Paid Date */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tanggal Terima <span className="text-[#FF3B30]">*</span>
              </label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
                <input
                  type="date"
                  value={formData.paidDate}
                  onChange={(e) => handleChange('paidDate', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  min={invoice.invoiceSentAt ? new Date(invoice.invoiceSentAt).toISOString().split('T')[0] : undefined}
                  className={`w-full bg-[#2C2C2E] text-white border ${errors.paidDate ? 'border-[#FF3B30]' : 'border-[#38383A]'} rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50`}
                />
              </div>
              {errors.paidDate && (
                <p className="mt-1 text-xs text-[#FF3B30]">{errors.paidDate}</p>
              )}
            </div>

            {/* Bank */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Bank Penerima <span className="text-[#FF3B30]">*</span>
              </label>
              <div className="relative">
                <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
                <select
                  value={formData.bank}
                  onChange={(e) => handleChange('bank', e.target.value)}
                  className={`w-full bg-[#2C2C2E] text-white border ${errors.bank ? 'border-[#FF3B30]' : 'border-[#38383A]'} rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50 appearance-none`}
                >
                  <option value="">Pilih bank...</option>
                  {bankList.map(bank => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>
              {errors.bank && (
                <p className="mt-1 text-xs text-[#FF3B30]">{errors.bank}</p>
              )}
            </div>

            {/* Payment Reference */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                No. Referensi / Rekening (opsional)
              </label>
              <input
                type="text"
                value={formData.paymentReference}
                onChange={(e) => handleChange('paymentReference', e.target.value)}
                placeholder="contoh: TRF2025011200123 atau nomor rekening"
                className="w-full bg-[#2C2C2E] text-white border border-[#38383A] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50 placeholder-[#636366]"
              />
            </div>

            {/* Evidence Upload - REQUIRED */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Bukti Transfer <span className="text-[#FF3B30]">* WAJIB</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="payment-evidence-upload"
                />
                <label
                  htmlFor="payment-evidence-upload"
                  className={`flex items-center gap-3 p-4 bg-[#2C2C2E] border border-dashed ${errors.evidenceFile ? 'border-[#FF3B30]' : evidenceFile ? 'border-[#30D158]' : 'border-[#38383A]'} rounded-lg cursor-pointer hover:border-[#0A84FF] transition-colors`}
                >
                  {evidenceFile ? (
                    <CheckCircle size={20} className="text-[#30D158]" />
                  ) : (
                    <Upload size={20} className="text-[#8E8E93]" />
                  )}
                  <div className="flex-1">
                    {evidenceFile ? (
                      <div>
                        <p className="text-sm text-white font-medium">{evidenceFile.name}</p>
                        <p className="text-xs text-[#30D158]">✓ File berhasil dipilih</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-white">Upload bukti transfer</p>
                        <p className="text-xs text-[#8E8E93]">JPG, PNG, atau PDF - Max 5MB - WAJIB diisi</p>
                      </div>
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
                value={formData.paymentNotes}
                onChange={(e) => handleChange('paymentNotes', e.target.value)}
                placeholder="contoh: Transfer diterima full amount, sesuai invoice"
                rows={3}
                className="w-full bg-[#2C2C2E] text-white border border-[#38383A] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50 placeholder-[#636366] resize-none"
              />
            </div>
          </div>

          {/* Confirmation Checklist */}
          <div className="bg-[#30D158]/10 border border-[#30D158]/30 rounded-lg p-4">
            <p className="text-sm font-medium text-[#30D158] mb-3">Konfirmasi sebelum submit:</p>
            <div className="space-y-2 text-sm text-[#8E8E93]">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Jumlah pembayaran sudah sesuai dengan invoice</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Bukti transfer sudah diupload</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Data yang diinput sudah benar dan tidak dapat diubah</span>
              </div>
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
            disabled={isSubmitting || !amountMatches}
            className="px-6 py-2.5 bg-[#30D158] text-white rounded-lg hover:bg-[#30D158]/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:bg-[#8E8E93] flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                <span>Konfirmasi Pembayaran</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPaymentReceivedModal;
