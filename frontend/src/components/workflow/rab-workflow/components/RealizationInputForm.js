import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import api from '../../../../services/api';

/**
 * RealizationInputForm Component
 * Modal form for creating new realization entry
 */
const RealizationInputForm = ({ projectId, rabItem, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    transactionDate: new Date().toISOString().split('T')[0],
    quantity: '',
    unitPrice: '',
    vendorName: '',
    invoiceNumber: '',
    paymentMethod: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Calculate total amount
  const totalAmount = (parseFloat(formData.quantity) || 0) * (parseFloat(formData.unitPrice) || 0);
  
  // Calculate variance
  const budgetUnitPrice = parseFloat(rabItem?.rabItem?.unitPrice || 0);
  const actualUnitPrice = parseFloat(formData.unitPrice) || 0;
  const varianceAmount = (actualUnitPrice - budgetUnitPrice) * (parseFloat(formData.quantity) || 0);
  const variancePercentage = budgetUnitPrice > 0 
    ? ((actualUnitPrice - budgetUnitPrice) / budgetUnitPrice * 100) 
    : 0;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.transactionDate) {
      newErrors.transactionDate = 'Tanggal transaksi wajib diisi';
    }
    
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Kuantitas harus lebih dari 0';
    }
    
    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      newErrors.unitPrice = 'Harga satuan harus lebih dari 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      // Get current user from localStorage or context
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      const payload = {
        transactionDate: formData.transactionDate,
        quantity: parseFloat(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        vendorName: formData.vendorName || null,
        invoiceNumber: formData.invoiceNumber || null,
        paymentMethod: formData.paymentMethod || null,
        notes: formData.notes || null,
        createdBy: currentUser.id || 'SYSTEM'
      };

      const response = await api.post(
        `/projects/${projectId}/rab/${rabItem.rabItem.id}/realizations`,
        payload
      );

      if (response.data.success) {
        onSuccess(response.data.data);
        onClose();
      } else {
        throw new Error(response.data.error || 'Gagal menyimpan realisasi');
      }
    } catch (err) {
      console.error('Error creating realization:', err);
      alert(err.response?.data?.error || err.message || 'Gagal menyimpan realisasi');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle input change
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2C2C2E] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#38383A]">
        {/* Header */}
        <div className="sticky top-0 bg-[#1C1C1E] border-b border-[#38383A] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Input Realisasi Belanja</h2>
            <p className="text-sm text-[#8E8E93] mt-1">
              Masukkan detail transaksi realisasi belanja
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#38383A] rounded-lg transition-colors"
            disabled={submitting}
          >
            <X className="w-5 h-5 text-[#8E8E93]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Item Info */}
          <div className="bg-[#1C1C1E] border border-[#BF5AF2]/30 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#BF5AF2] mb-3">Item Pekerjaan</h3>
            <div className="space-y-2">
              <div>
                <p className="text-base font-semibold text-white">
                  {rabItem?.rabItem?.description}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-[#8E8E93]">Kategori:</span>
                  <span className="ml-2 font-medium text-white">
                    {rabItem?.rabItem?.category || '-'}
                  </span>
                </div>
                <div className="h-4 w-px bg-[#38383A]"></div>
                <div>
                  <span className="text-[#8E8E93]">Tipe:</span>
                  <span className="ml-2 font-medium text-white">
                    {rabItem?.rabItem?.item_type === 'material' ? 'Material' :
                     rabItem?.rabItem?.item_type === 'labor' ? 'Tenaga Kerja' :
                     rabItem?.rabItem?.item_type === 'equipment' ? 'Alat' :
                     rabItem?.rabItem?.item_type === 'service' ? 'Jasa' : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Info */}
          <div className="bg-[#1C1C1E] border border-[#0A84FF]/30 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#0A84FF] mb-2">Informasi Anggaran</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[#8E8E93]">Satuan:</span>
                <span className="ml-2 font-medium text-white">{rabItem?.rabItem?.unit}</span>
              </div>
              <div>
                <span className="text-[#8E8E93]">Harga Satuan Budget:</span>
                <span className="ml-2 font-medium text-white">
                  {formatCurrency(rabItem?.rabItem?.unitPrice)}
                </span>
              </div>
              <div>
                <span className="text-[#8E8E93]">Kuantitas Budget:</span>
                <span className="ml-2 font-medium text-white">
                  {rabItem?.rabItem?.quantity} {rabItem?.rabItem?.unit}
                </span>
              </div>
              <div>
                <span className="text-[#8E8E93]">Total Budget:</span>
                <span className="ml-2 font-medium text-white">
                  {formatCurrency(rabItem?.rabItem?.totalBudget)}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Transaction Date */}
            <div>
              <label className="block text-sm font-medium text-[#8E8E93] mb-2">
                Tanggal Transaksi <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.transactionDate}
                onChange={(e) => handleChange('transactionDate', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent ${
                  errors.transactionDate ? 'border-red-500' : 'border-[#38383A] bg-[#2C2C2E] text-white'
                }`}
                disabled={submitting}
              />
              {errors.transactionDate && (
                <p className="mt-1 text-sm text-red-600">{errors.transactionDate}</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-[#8E8E93] mb-2">
                Kuantitas ({rabItem?.rabItem?.unit}) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                placeholder="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent ${
                  errors.quantity ? 'border-red-500' : 'border-[#38383A] bg-[#2C2C2E] text-white'
                }`}
                disabled={submitting}
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
              )}
            </div>

            {/* Unit Price */}
            <div>
              <label className="block text-sm font-medium text-[#8E8E93] mb-2">
                Harga Satuan <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => handleChange('unitPrice', e.target.value)}
                placeholder="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent ${
                  errors.unitPrice ? 'border-red-500' : 'border-[#38383A] bg-[#2C2C2E] text-white'
                }`}
                disabled={submitting}
              />
              {errors.unitPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.unitPrice}</p>
              )}
            </div>

            {/* Total Amount (Calculated) */}
            <div>
              <label className="block text-sm font-medium text-[#8E8E93] mb-2">
                Total Belanja
              </label>
              <div className="px-3 py-2 bg-gray-100 border border-[#38383A] bg-[#2C2C2E] text-white rounded-lg text-gray-900 font-semibold">
                {formatCurrency(totalAmount)}
              </div>
            </div>
          </div>

          {/* Variance Alert */}
          {formData.quantity && formData.unitPrice && Math.abs(variancePercentage) > 5 && (
            <div className={`flex items-start gap-3 p-4 rounded-lg ${
              variancePercentage > 0 
                ? 'bg-[#FF453A]/10 border border-[#FF453A]/30' 
                : 'bg-[#30D158]/10 border border-[#30D158]/30'
            }`}>
              <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                variancePercentage > 0 ? 'text-[#FF453A]' : 'text-[#30D158]'
              }`} />
              <div className="flex-1">
                <p className={`text-sm font-semibold ${
                  variancePercentage > 0 ? 'text-[#FF453A]' : 'text-[#30D158]'
                }`}>
                  {variancePercentage > 0 ? 'Harga Over Budget' : 'Harga Under Budget'}
                </p>
                <p className={`text-sm mt-1 ${
                  variancePercentage > 0 ? 'text-[#FF453A]/80' : 'text-[#30D158]/80'
                }`}>
                  Selisih: {formatCurrency(Math.abs(varianceAmount))} ({variancePercentage > 0 ? '+' : ''}{variancePercentage.toFixed(2)}%)
                </p>
              </div>
            </div>
          )}

          {/* Vendor Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vendor Name */}
            <div>
              <label className="block text-sm font-medium text-[#8E8E93] mb-2">
                Nama Vendor/Supplier
              </label>
              <input
                type="text"
                value={formData.vendorName}
                onChange={(e) => handleChange('vendorName', e.target.value)}
                placeholder="Masukkan nama vendor"
                className="w-full px-3 py-2 border border-[#38383A] bg-[#2C2C2E] text-white rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                disabled={submitting}
              />
            </div>

            {/* Invoice Number */}
            <div>
              <label className="block text-sm font-medium text-[#8E8E93] mb-2">
                Nomor Invoice/Faktur
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => handleChange('invoiceNumber', e.target.value)}
                placeholder="Masukkan nomor invoice"
                className="w-full px-3 py-2 border border-[#38383A] bg-[#2C2C2E] text-white rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
                disabled={submitting}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-[#8E8E93] mb-2">
              Metode Pembayaran
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => handleChange('paymentMethod', e.target.value)}
              className="w-full px-3 py-2 border border-[#38383A] bg-[#2C2C2E] text-white rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
              disabled={submitting}
            >
              <option value="">-- Pilih Metode --</option>
              <option value="cash">Tunai</option>
              <option value="transfer">Transfer Bank</option>
              <option value="check">Cek</option>
              <option value="giro">Giro</option>
              <option value="credit_card">Kartu Kredit</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#8E8E93] mb-2">
              Catatan
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Tambahkan catatan jika diperlukan..."
              rows={3}
              className="w-full px-3 py-2 border border-[#38383A] bg-[#2C2C2E] text-white rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent resize-none"
              disabled={submitting}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#38383A]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#8E8E93] bg-[#1C1C1E] border border-[#38383A] rounded-lg hover:bg-[#38383A] transition-colors"
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0077ED] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Realisasi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RealizationInputForm;
