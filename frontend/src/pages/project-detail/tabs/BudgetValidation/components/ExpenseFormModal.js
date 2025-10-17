import React, { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';
import useAdditionalExpenses from '../hooks/useAdditionalExpenses';
import useBudgetCalculations from '../hooks/useBudgetCalculations';
import { validateAdditionalExpense, sanitizeExpenseData, requiresApproval } from '../utils/budgetValidation';

/**
 * Expense Form Modal Component
 * Modal for adding/editing additional expenses (kasbon, overtime, etc)
 */
const ExpenseFormModal = ({ isOpen, onClose, projectId, expense = null, onSuccess }) => {
  const isEditMode = !!expense;

  const [formData, setFormData] = useState({
    expenseType: '',
    description: '',
    amount: '',
    recipientName: '',
    paymentMethod: '',
    expenseDate: '',
    receiptUrl: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const { submitting, updating, addExpense, updateExpense } = useAdditionalExpenses(projectId, onSuccess);

  // Initialize form data when editing
  useEffect(() => {
    if (expense) {
      setFormData({
        expenseType: expense.expenseType || '',
        description: expense.description || '',
        amount: expense.amount || '',
        recipientName: expense.recipientName || '',
        paymentMethod: expense.paymentMethod || '',
        expenseDate: expense.expenseDate ? expense.expenseDate.split('T')[0] : '',
        receiptUrl: expense.receiptUrl || '',
        notes: expense.notes || ''
      });
    }
  }, [expense]);

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
    const validation = validateAdditionalExpense(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Sanitize data
    const sanitizedData = sanitizeExpenseData(formData);

    // Submit
    let result;
    if (isEditMode) {
      result = await updateExpense(expense.id, sanitizedData);
    } else {
      result = await addExpense(sanitizedData);
    }

    if (result.success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      expenseType: '',
      description: '',
      amount: '',
      recipientName: '',
      paymentMethod: '',
      expenseDate: '',
      receiptUrl: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const needsApproval = formData.amount && requiresApproval(formData.amount);
  const isProcessing = submitting || updating;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#38383A]">
          <h3 className="text-lg font-semibold text-white">
            {isEditMode ? 'Edit Pengeluaran' : 'Tambah Pengeluaran Tambahan'}
          </h3>
          <button
            onClick={handleClose}
            className="text-[#8E8E93] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Info Alert */}
          {needsApproval && (
            <div className="bg-[#FFD60A]/10 border border-[#FFD60A]/30 rounded-lg p-3">
              <div className="flex items-start">
                <Info className="text-[#FFD60A] mt-0.5 mr-2 flex-shrink-0 w-4 h-4" />
                <p className="text-sm text-white">
                  Pengeluaran dengan nilai ≥ Rp 10.000.000 memerlukan persetujuan manual.
                  Pengeluaran di bawah itu akan otomatis disetujui.
                </p>
              </div>
            </div>
          )}

          {/* Expense Type */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Jenis Pengeluaran <span className="text-[#FF453A]">*</span>
            </label>
            <select
              name="expenseType"
              value={formData.expenseType}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border ${
                errors.expenseType ? 'border-[#FF453A]' : 'border-[#38383A]'
              } rounded-lg bg-[#1C1C1E] text-white focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent`}
            >
              <option value="">Pilih jenis pengeluaran</option>
              <option value="kasbon">Kasbon</option>
              <option value="overtime">Lembur</option>
              <option value="emergency">Darurat</option>
              <option value="transportation">Transportasi</option>
              <option value="accommodation">Akomodasi</option>
              <option value="meals">Konsumsi</option>
              <option value="equipment_rental">Sewa Alat</option>
              <option value="repair">Perbaikan</option>
              <option value="miscellaneous">Lain-lain</option>
              <option value="other">Lainnya</option>
            </select>
            {errors.expenseType && (
              <p className="mt-1 text-xs text-[#FF453A]">{errors.expenseType}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Deskripsi <span className="text-[#FF453A]">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={`w-full px-3 py-2 text-sm border ${
                errors.description ? 'border-[#FF453A]' : 'border-[#38383A]'
              } rounded-lg bg-[#1C1C1E] text-white placeholder-[#8E8E93] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent`}
              placeholder="Jelaskan detail pengeluaran"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-[#FF453A]">{errors.description}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Jumlah <span className="text-[#FF453A]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8E8E93] text-sm">
                Rp
              </span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="1000"
                className={`w-full pl-12 pr-3 py-2 text-sm border ${
                  errors.amount ? 'border-[#FF453A]' : 'border-[#38383A]'
                } rounded-lg bg-[#1C1C1E] text-white placeholder-[#8E8E93] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent`}
                placeholder="0"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-xs text-[#FF453A]">{errors.amount}</p>
            )}
            {formData.amount && (
              <p className="mt-1 text-xs text-[#8E8E93]">
                {formatCurrency(formData.amount)}
              </p>
            )}
          </div>

          {/* Recipient Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Nama Penerima <span className="text-[#FF453A]">*</span>
            </label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border ${
                errors.recipientName ? 'border-[#FF453A]' : 'border-[#38383A]'
              } rounded-lg bg-[#1C1C1E] text-white placeholder-[#8E8E93] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent`}
              placeholder="Nama yang menerima pembayaran"
            />
            {errors.recipientName && (
              <p className="mt-1 text-xs text-[#FF453A]">{errors.recipientName}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Metode Pembayaran
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-[#38383A] rounded-lg bg-[#1C1C1E] text-white focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
            >
              <option value="">Pilih metode pembayaran</option>
              <option value="cash">Cash</option>
              <option value="transfer">Transfer</option>
              <option value="check">Cek</option>
              <option value="credit_card">Kartu Kredit</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          {/* Expense Date */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Tanggal Pengeluaran <span className="text-[#FF453A]">*</span>
            </label>
            <input
              type="date"
              name="expenseDate"
              value={formData.expenseDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 text-sm border ${
                errors.expenseDate ? 'border-[#FF453A]' : 'border-[#38383A]'
              } rounded-lg bg-[#1C1C1E] text-white focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent`}
            />
            {errors.expenseDate && (
              <p className="mt-1 text-xs text-[#FF453A]">{errors.expenseDate}</p>
            )}
          </div>

          {/* Receipt URL */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              URL Bukti Pembayaran (opsional)
            </label>
            <input
              type="url"
              name="receiptUrl"
              value={formData.receiptUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-[#38383A] rounded-lg bg-[#1C1C1E] text-white placeholder-[#8E8E93] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
              placeholder="https://..."
            />
            {errors.receiptUrl && (
              <p className="mt-1 text-xs text-[#FF453A]">{errors.receiptUrl}</p>
            )}
            <p className="mt-1 text-xs text-[#8E8E93]">
              Link ke file bukti pembayaran (foto, scan, atau dokumen)
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Catatan Tambahan (opsional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 text-sm border border-[#38383A] rounded-lg bg-[#1C1C1E] text-white placeholder-[#8E8E93] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
              placeholder="Catatan tambahan jika diperlukan"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-[#38383A]">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 text-sm bg-[#38383A] text-white rounded-lg hover:bg-[#48484A] transition-colors"
              disabled={isProcessing}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isProcessing}
            >
              {isProcessing ? 'Menyimpan...' : isEditMode ? 'Update' : 'Tambah Pengeluaran'}
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

export default ExpenseFormModal;
