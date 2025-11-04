import React, { useState } from 'react';
import { DollarSign, Calendar, FileText, CreditCard, X } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';

/**
 * PaymentExecutionModal Component
 * Modal for executing payment from approved cost realization
 * Creates finance_transaction and updates status to 'paid'
 */
const PaymentExecutionModal = ({ 
  cost, 
  onExecute, 
  onClose, 
  loading = false 
}) => {
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'bank_transfer',
    referenceNumber: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentData.referenceNumber.trim()) {
      alert('Nomor referensi pembayaran harus diisi!');
      return;
    }

    if (!paymentData.paymentDate) {
      alert('Tanggal pembayaran harus diisi!');
      return;
    }

    setSubmitting(true);
    try {
      await onExecute(cost.id, paymentData);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const paymentMethods = [
    { value: 'bank_transfer', label: '🏦 Bank Transfer', icon: '🏦' },
    { value: 'cash', label: '💵 Cash', icon: '💵' },
    { value: 'check', label: '📄 Check', icon: '📄' },
    { value: 'credit_card', label: '💳 Credit Card', icon: '💳' },
    { value: 'debit_card', label: '💳 Debit Card', icon: '💳' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1C1C1E] rounded-lg shadow-2xl max-w-2xl w-full border border-[#3C3C3E]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#3C3C3E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <DollarSign size={20} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Execute Payment</h2>
              <p className="text-sm text-gray-400">Create finance transaction and mark as paid</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-2 hover:bg-[#3C3C3E] rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Cost Summary */}
        <div className="p-6 bg-[#2C2C2E] border-b border-[#3C3C3E]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-400 mb-1">Cost Description</div>
              <div className="text-sm text-white font-medium">{cost.description || cost.item_name || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Amount</div>
              <div className="text-lg text-blue-400 font-bold">{formatCurrency(cost.actual_value || cost.amount)}</div>
            </div>
            {cost.expense_account_name && (
              <div>
                <div className="text-xs text-gray-400 mb-1">Expense Account</div>
                <div className="text-sm text-yellow-400">{cost.expense_account_name}</div>
              </div>
            )}
            {cost.source_account_name && (
              <div>
                <div className="text-xs text-gray-400 mb-1">Source Account</div>
                <div className="text-sm text-purple-400">{cost.source_account_name}</div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <CreditCard size={16} className="inline mr-2" />
              Payment Method *
            </label>
            <select
              value={paymentData.paymentMethod}
              onChange={(e) => handleChange('paymentMethod', e.target.value)}
              className="w-full px-4 py-2 bg-[#2C2C2E] border border-[#3C3C3E] rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {paymentMethods.map(method => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar size={16} className="inline mr-2" />
              Payment Date *
            </label>
            <input
              type="date"
              value={paymentData.paymentDate}
              onChange={(e) => handleChange('paymentDate', e.target.value)}
              className="w-full px-4 py-2 bg-[#2C2C2E] border border-[#3C3C3E] rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Reference Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FileText size={16} className="inline mr-2" />
              Reference Number *
            </label>
            <input
              type="text"
              value={paymentData.referenceNumber}
              onChange={(e) => handleChange('referenceNumber', e.target.value)}
              placeholder="e.g., TRF-2025-001, CHECK-12345"
              className="w-full px-4 py-2 bg-[#2C2C2E] border border-[#3C3C3E] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Bank reference, check number, or transaction ID</p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={paymentData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes about this payment..."
              rows={3}
              className="w-full px-4 py-2 bg-[#2C2C2E] border border-[#3C3C3E] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Warning */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-300">
              ⚠️ <strong>Warning:</strong> This action will:
            </p>
            <ul className="text-xs text-yellow-300 mt-2 ml-6 list-disc space-y-1">
              <li>Create a new finance transaction record</li>
              <li>Update this cost status to 'paid'</li>
              <li>Deduct <strong>{formatCurrency(cost.actual_value || cost.amount)}</strong> from source account balance</li>
              <li>Add amount to expense account balance</li>
              <li>This action cannot be undone (requires manual reversal)</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-[#3C3C3E] hover:bg-[#4C4C4E] text-white rounded-lg transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || loading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <DollarSign size={18} />
                  <span>Execute Payment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentExecutionModal;
