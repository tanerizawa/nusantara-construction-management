import React, { useState, useEffect } from 'react';
import { X, Calculator } from 'lucide-react';
import useActualTracking from '../hooks/useActualTracking';
import { validateActualCost, sanitizeActualCostData } from '../utils/budgetValidation';

/**
 * Actual Input Modal Component
 * Modal for recording actual costs for RAB items
 */
const ActualInputModal = ({ isOpen, onClose, rabItem, projectId, onSuccess }) => {
  const [formData, setFormData] = useState({
    rabItemId: '',
    quantity: '',
    unitPrice: '',
    totalAmount: '',
    poNumber: '',
    purchaseDate: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [autoCalculate, setAutoCalculate] = useState(true);

  const { recording, recordActualCost, calculateTotal } = useActualTracking(projectId, onSuccess);

  // Initialize form data when rabItem changes
  useEffect(() => {
    if (rabItem) {
      setFormData(prev => ({
        ...prev,
        rabItemId: rabItem.id,
        quantity: rabItem.quantity || '',
        unitPrice: rabItem.unitPrice || ''
      }));
    }
  }, [rabItem]);

  // Auto-calculate total when quantity or unitPrice changes
  useEffect(() => {
    if (autoCalculate && formData.quantity && formData.unitPrice) {
      const total = calculateTotal(formData.quantity, formData.unitPrice);
      setFormData(prev => ({ ...prev, totalAmount: total }));
    }
  }, [formData.quantity, formData.unitPrice, autoCalculate, calculateTotal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const validation = validateActualCost(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Sanitize and submit
    const sanitizedData = sanitizeActualCostData(formData);
    const result = await recordActualCost(sanitizedData);

    if (result.success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      rabItemId: '',
      quantity: '',
      unitPrice: '',
      totalAmount: '',
      poNumber: '',
      purchaseDate: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#38383A]">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Input Biaya Aktual
            </h3>
            {rabItem && (
              <p className="text-sm text-[#8E8E93] mt-0.5">
                {rabItem.itemNumber} - {rabItem.workName}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-[#8E8E93] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* RAB Item Info */}
          {rabItem && (
            <div className="bg-[#0A84FF]/10 border border-[#0A84FF]/30 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[#8E8E93] mb-1 text-xs">Anggaran RAB</p>
                  <p className="font-semibold text-white">
                    {formatCurrency(rabItem.totalPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-[#8E8E93] mb-1 text-xs">Realisasi Sebelumnya</p>
                  <p className="font-semibold text-white">
                    {formatCurrency(rabItem.actualSpent || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-[#8E8E93] mb-1 text-xs">Sisa Anggaran</p>
                  <p className={`font-semibold ${
                    (rabItem.totalPrice - (rabItem.actualSpent || 0)) < 0 
                      ? 'text-[#FF453A]' 
                      : 'text-[#30D158]'
                  }`}>
                    {formatCurrency(rabItem.totalPrice - (rabItem.actualSpent || 0))}
                  </p>
                </div>
                <div>
                  <p className="text-[#8E8E93] mb-1 text-xs">Progress</p>
                  <p className="font-semibold text-white">
                    {((rabItem.actualSpent || 0) / rabItem.totalPrice * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Kuantitas <span className="text-[#FF453A]">*</span>
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                step="0.01"
                className={`flex-1 px-3 py-2 text-sm border ${
                  errors.quantity ? 'border-[#FF453A]' : 'border-[#38383A]'
                } rounded-lg bg-[#1C1C1E] text-white placeholder-[#8E8E93] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent`}
                placeholder="Masukkan kuantitas"
              />
              {rabItem && (
                <span className="flex items-center px-3 py-2 text-sm bg-[#38383A] text-[#8E8E93] rounded-lg">
                  {rabItem.unit}
                </span>
              )}
            </div>
            {errors.quantity && (
              <p className="mt-1 text-xs text-[#FF453A]">{errors.quantity}</p>
            )}
          </div>

          {/* Unit Price */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Harga Satuan <span className="text-[#FF453A]">*</span>
            </label>
            <input
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              step="0.01"
              className={`w-full px-3 py-2 text-sm border ${
                errors.unitPrice ? 'border-[#FF453A]' : 'border-[#38383A]'
              } rounded-lg bg-[#1C1C1E] text-white placeholder-[#8E8E93] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent`}
              placeholder="Masukkan harga satuan"
            />
            {errors.unitPrice && (
              <p className="mt-1 text-xs text-[#FF453A]">{errors.unitPrice}</p>
            )}
          </div>

          {/* Auto Calculate Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoCalculate"
              checked={autoCalculate}
              onChange={(e) => setAutoCalculate(e.target.checked)}
              className="w-4 h-4 text-[#0A84FF] border-[#38383A] rounded focus:ring-[#0A84FF] bg-[#1C1C1E]"
            />
            <label htmlFor="autoCalculate" className="ml-2 text-sm text-white flex items-center">
              <Calculator className="mr-1 w-4 h-4" />
              Hitung otomatis total biaya
            </label>
          </div>

          {/* Total Amount */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Total Biaya <span className="text-[#FF453A]">*</span>
            </label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              step="0.01"
              disabled={autoCalculate}
              className={`w-full px-3 py-2 text-sm border ${
                errors.totalAmount ? 'border-[#FF453A]' : 'border-[#38383A]'
              } rounded-lg bg-[#1C1C1E] text-white placeholder-[#8E8E93] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent ${
                autoCalculate ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              placeholder="Total biaya"
            />
            {errors.totalAmount && (
              <p className="mt-1 text-xs text-[#FF453A]">{errors.totalAmount}</p>
            )}
          </div>

          {/* PO Number */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Nomor PO (opsional)
            </label>
            <input
              type="text"
              name="poNumber"
              value={formData.poNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-[#38383A] rounded-lg bg-[#1C1C1E] text-white placeholder-[#8E8E93] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
              placeholder="Nomor Purchase Order"
            />
          </div>

          {/* Purchase Date */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Tanggal Pembelian <span className="text-[#FF453A]">*</span>
            </label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 text-sm border ${
                errors.purchaseDate ? 'border-[#FF453A]' : 'border-[#38383A]'
              } rounded-lg bg-[#1C1C1E] text-white focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent`}
            />
            {errors.purchaseDate && (
              <p className="mt-1 text-xs text-[#FF453A]">{errors.purchaseDate}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Catatan (opsional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 text-sm border border-[#38383A] rounded-lg bg-[#1C1C1E] text-white placeholder-[#8E8E93] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
              placeholder="Tambahkan catatan jika diperlukan"
            />
            {errors.notes && (
              <p className="mt-1 text-xs text-[#FF453A]">{errors.notes}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-[#38383A]">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 text-sm bg-[#38383A] text-white rounded-lg hover:bg-[#48484A] transition-colors"
              disabled={recording}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={recording}
            >
              {recording ? 'Menyimpan...' : 'Simpan Biaya Aktual'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Format currency helper
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0);
};

export default ActualInputModal;
