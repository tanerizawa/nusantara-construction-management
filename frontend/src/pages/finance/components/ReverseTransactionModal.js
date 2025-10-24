import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, X } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

/**
 * ReverseTransactionModal Component
 * 
 * Modal for reversing (correcting) a posted transaction
 * Creates reversal entry + new corrected transaction
 * Requires reason for audit trail compliance
 * 
 * Best Practice: REVERSE is used to correct transaction errors
 * - Original transaction kept (marked as reversed)
 * - Reversal entry created (opposite)
 * - New corrected transaction created
 * - All three linked for audit trail
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onReverse - Reverse handler
 * @param {Object} props.transaction - Transaction to reverse
 * @param {Array} props.accounts - Chart of accounts list
 * @param {boolean} props.loading - Loading state
 */
const ReverseTransactionModal = ({
  isOpen,
  onClose,
  onReverse,
  transaction,
  accounts = [],
  loading = false
}) => {
  const [reason, setReason] = useState('');
  const [correctedData, setCorrectedData] = useState({
    type: '',
    category: '',
    amount: '',
    description: '',
    accountFrom: '',
    accountTo: ''
  });
  const [errors, setErrors] = useState({});

  /**
   * Initialize corrected data from original transaction
   */
  useEffect(() => {
    if (transaction && isOpen) {
      setCorrectedData({
        type: transaction.type || '',
        category: transaction.category || '',
        amount: transaction.amount || '',
        description: transaction.description || '',
        accountFrom: transaction.accountFrom || '',
        accountTo: transaction.accountTo || ''
      });
    }
  }, [transaction, isOpen]);

  /**
   * Validate form data
   */
  const validate = () => {
    const newErrors = {};

    // Validate reason
    if (!reason || reason.trim() === '') {
      newErrors.reason = 'Alasan pembalikan wajib diisi untuk jejak audit';
    } else if (reason.trim().length < 15) {
      newErrors.reason = 'Alasan minimal 15 karakter';
    }

    // Validate corrected amount
    if (!correctedData.amount || correctedData.amount <= 0) {
      newErrors.amount = 'Nilai harus lebih dari 0';
    }

    // Validate description
    if (!correctedData.description || correctedData.description.trim() === '') {
      newErrors.description = 'Deskripsi wajib diisi';
    }

    // Validate accounts based on type
    if (correctedData.type === 'income') {
      if (!correctedData.accountTo) {
        newErrors.accountTo = 'Rekening tujuan wajib diisi untuk pendapatan';
      }
    } else if (correctedData.type === 'expense') {
      if (!correctedData.accountFrom) {
        newErrors.accountFrom = 'Rekening sumber wajib diisi untuk pengeluaran';
      }
    } else if (correctedData.type === 'transfer') {
      if (!correctedData.accountFrom) {
        newErrors.accountFrom = 'Rekening sumber wajib diisi';
      }
      if (!correctedData.accountTo) {
        newErrors.accountTo = 'Rekening tujuan wajib diisi';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle reverse submission
   */
  const handleReverse = async () => {
    if (!validate()) return;

    try {
      await onReverse({
        reason: reason.trim(),
        reversedBy: 'current-user', // TODO: Get from auth context
        correctedData: {
          ...correctedData,
          amount: parseFloat(correctedData.amount)
        }
      });
      handleClose();
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    setReason('');
    setCorrectedData({
      type: '',
      category: '',
      amount: '',
      description: '',
      accountFrom: '',
      accountTo: ''
    });
    setErrors({});
    onClose();
  };

  /**
   * Handle input change
   */
  const handleChange = (field, value) => {
    setCorrectedData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  if (!isOpen || !transaction) return null;

  // Filter accounts by type
  const sourceAccounts = accounts.filter(acc => 
    acc.accountType === 'ASSET' && acc.isActive
  );
  const destinationAccounts = accounts.filter(acc => 
    (correctedData.type === 'income' && acc.accountType === 'REVENUE') ||
    (correctedData.type === 'expense' && acc.accountType === 'EXPENSE') ||
    (correctedData.type === 'transfer' && acc.accountType === 'ASSET')
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
      onClick={handleClose}
    >
      <div 
        className="rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: '#2C2C2E',
          border: '1px solid #38383A'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="px-6 py-4 flex items-center justify-between sticky top-0 z-10"
          style={{ 
            borderBottom: '1px solid #38383A',
            backgroundColor: '#2C2C2E'
          }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ 
                backgroundColor: 'rgba(255, 149, 0, 0.15)',
                border: '1px solid rgba(255, 149, 0, 0.3)'
              }}
            >
              <RefreshCw className="w-5 h-5" style={{ color: '#FF9500' }} />
            </div>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>
                Balik & Koreksi Transaksi
              </h3>
              <p className="text-xs" style={{ color: '#98989D' }}>
                Buat koreksi dengan jejak audit yang tepat
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg transition-all duration-200"
            style={{ color: '#98989D' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(56, 56, 58, 0.5)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#98989D';
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Banner */}
        <div 
          className="mx-6 mt-4 p-3 rounded-lg flex items-start space-x-3"
          style={{
            backgroundColor: 'rgba(10, 132, 255, 0.1)',
            border: '1px solid rgba(10, 132, 255, 0.3)'
          }}
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#0A84FF' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: '#0A84FF' }}>
              Cara Kerja Pembalikan
            </p>
            <p className="text-xs mt-1" style={{ color: '#98989D' }}>
              Ini akan membuat 3 transaksi yang saling terkait: Asli (dipertahankan), Pembalikan (kebalikan), 
              dan Koreksi (data baru Anda). Semua saldo akan diperbarui sesuai.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Original Transaction */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
              <span style={{ color: '#98989D' }}>Transaksi Asli</span>
              <span 
                className="px-2 py-0.5 text-xs rounded"
                style={{
                  backgroundColor: 'rgba(142, 142, 147, 0.15)',
                  color: '#8E8E93'
                }}
              >
                Akan ditandai sebagai DIBALIK
              </span>
            </h4>
            <div 
              className="rounded-lg p-4 space-y-2"
              style={{ 
                backgroundColor: 'rgba(56, 56, 58, 0.3)',
                border: '1px solid #38383A'
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs block" style={{ color: '#636366' }}>ID</span>
                  <span className="text-sm font-mono" style={{ color: '#FFFFFF' }}>
                    {transaction.id}
                  </span>
                </div>
                <div>
                  <span className="text-xs block" style={{ color: '#636366' }}>Tanggal</span>
                  <span className="text-sm" style={{ color: '#FFFFFF' }}>
                    {formatDate(transaction.date)}
                  </span>
                </div>
                <div>
                  <span className="text-xs block" style={{ color: '#636366' }}>Nilai</span>
                  <span className="text-sm font-semibold" style={{ color: '#FF9500' }}>
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
                <div>
                  <span className="text-xs block" style={{ color: '#636366' }}>Jenis</span>
                  <span className="text-sm capitalize" style={{ color: '#FFFFFF' }}>
                    {transaction.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reversal Reason */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
              Alasan Pembalikan <span style={{ color: '#FF453A' }}>*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (errors.reason) {
                  setErrors({ ...errors, reason: null });
                }
              }}
              placeholder="contoh: Nilai salah, seharusnya 30 juta bukan 50 juta"
              rows={3}
              className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 focus:outline-none"
              style={{
                backgroundColor: '#1C1C1E',
                border: errors.reason ? '1px solid #FF453A' : '1px solid #38383A',
                color: '#FFFFFF'
              }}
              onFocus={(e) => {
                if (!errors.reason) {
                  e.target.style.borderColor = '#0A84FF';
                }
              }}
              onBlur={(e) => {
                if (!errors.reason) {
                  e.target.style.borderColor = '#38383A';
                }
              }}
              disabled={loading}
            />
            {errors.reason && (
              <p className="mt-1 text-xs" style={{ color: '#FF453A' }}>
                {errors.reason}
              </p>
            )}
          </div>

          {/* Corrected Transaction Data */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
              <span style={{ color: '#FFFFFF' }}>Data Transaksi yang Dikoreksi</span>
              <span 
                className="px-2 py-0.5 text-xs rounded"
                style={{
                  backgroundColor: 'rgba(48, 209, 88, 0.15)',
                  color: '#30D158'
                }}
              >
                Entri benar yang baru
              </span>
            </h4>

            <div className="space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                  Nilai yang Dikoreksi <span style={{ color: '#FF453A' }}>*</span>
                </label>
                <input
                  type="number"
                  value={correctedData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 focus:outline-none"
                  style={{
                    backgroundColor: '#1C1C1E',
                    border: errors.amount ? '1px solid #FF453A' : '1px solid #38383A',
                    color: '#FFFFFF'
                  }}
                  onFocus={(e) => {
                    if (!errors.amount) {
                      e.target.style.borderColor = '#0A84FF';
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.amount) {
                      e.target.style.borderColor = '#38383A';
                    }
                  }}
                  disabled={loading}
                />
                {errors.amount && (
                  <p className="mt-1 text-xs" style={{ color: '#FF453A' }}>
                    {errors.amount}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                  Deskripsi <span style={{ color: '#FF453A' }}>*</span>
                </label>
                <textarea
                  value={correctedData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Masukkan deskripsi transaksi"
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 focus:outline-none"
                  style={{
                    backgroundColor: '#1C1C1E',
                    border: errors.description ? '1px solid #FF453A' : '1px solid #38383A',
                    color: '#FFFFFF'
                  }}
                  onFocus={(e) => {
                    if (!errors.description) {
                      e.target.style.borderColor = '#0A84FF';
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.description) {
                      e.target.style.borderColor = '#38383A';
                    }
                  }}
                  disabled={loading}
                />
                {errors.description && (
                  <p className="mt-1 text-xs" style={{ color: '#FF453A' }}>
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Account Fields (based on type) */}
              {(correctedData.type === 'expense' || correctedData.type === 'transfer') && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                    Rekening Sumber <span style={{ color: '#FF453A' }}>*</span>
                  </label>
                  <select
                    value={correctedData.accountFrom}
                    onChange={(e) => handleChange('accountFrom', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 focus:outline-none"
                    style={{
                      backgroundColor: '#1C1C1E',
                      border: errors.accountFrom ? '1px solid #FF453A' : '1px solid #38383A',
                      color: '#FFFFFF'
                    }}
                    disabled={loading}
                  >
                    <option value="">Pilih rekening sumber...</option>
                    {sourceAccounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountCode} - {acc.accountName}
                      </option>
                    ))}
                  </select>
                  {errors.accountFrom && (
                    <p className="mt-1 text-xs" style={{ color: '#FF453A' }}>
                      {errors.accountFrom}
                    </p>
                  )}
                </div>
              )}

              {(correctedData.type === 'income' || correctedData.type === 'transfer') && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
                    Rekening Tujuan <span style={{ color: '#FF453A' }}>*</span>
                  </label>
                  <select
                    value={correctedData.accountTo}
                    onChange={(e) => handleChange('accountTo', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 focus:outline-none"
                    style={{
                      backgroundColor: '#1C1C1E',
                      border: errors.accountTo ? '1px solid #FF453A' : '1px solid #38383A',
                      color: '#FFFFFF'
                    }}
                    disabled={loading}
                  >
                    <option value="">Pilih rekening tujuan...</option>
                    {destinationAccounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountCode} - {acc.accountName}
                      </option>
                    ))}
                  </select>
                  {errors.accountTo && (
                    <p className="mt-1 text-xs" style={{ color: '#FF453A' }}>
                      {errors.accountTo}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Balance Effect Preview */}
          {correctedData.amount && transaction.amount && (
            <div 
              className="rounded-lg p-4"
              style={{
                backgroundColor: 'rgba(10, 132, 255, 0.1)',
                border: '1px solid rgba(10, 132, 255, 0.3)'
              }}
            >
              <h4 className="text-sm font-medium mb-2" style={{ color: '#0A84FF' }}>
                Dampak Saldo
              </h4>
              <div className="space-y-1 text-xs" style={{ color: '#98989D' }}>
                <div className="flex justify-between">
                  <span>Asli:</span>
                  <span style={{ color: '#FF9500' }}>
                    -{formatCurrency(transaction.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pembalikan:</span>
                  <span style={{ color: '#30D158' }}>
                    +{formatCurrency(transaction.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Koreksi:</span>
                  <span style={{ color: '#FF9500' }}>
                    -{formatCurrency(correctedData.amount)}
                  </span>
                </div>
                <div 
                  className="flex justify-between pt-2 mt-2 font-semibold"
                  style={{ borderTop: '1px solid rgba(10, 132, 255, 0.3)' }}
                >
                  <span style={{ color: '#FFFFFF' }}>Dampak Bersih:</span>
                  <span style={{ color: '#0A84FF' }}>
                    -{formatCurrency(correctedData.amount)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div 
              className="p-3 rounded-lg"
              style={{
                backgroundColor: 'rgba(255, 69, 58, 0.1)',
                border: '1px solid rgba(255, 69, 58, 0.3)'
              }}
            >
              <p className="text-sm" style={{ color: '#FF453A' }}>
                {errors.submit}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div 
          className="px-6 py-4 flex items-center justify-end space-x-3 sticky bottom-0"
          style={{ 
            borderTop: '1px solid #38383A',
            backgroundColor: '#2C2C2E'
          }}
        >
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50"
            style={{
              backgroundColor: 'rgba(56, 56, 58, 0.5)',
              color: '#FFFFFF',
              border: '1px solid #38383A'
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = 'rgba(56, 56, 58, 0.7)')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = 'rgba(56, 56, 58, 0.5)')}
          >
            Batal
          </button>
          <button
            onClick={handleReverse}
            disabled={loading || !reason.trim() || !correctedData.amount}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            style={{
              backgroundColor: loading || !reason.trim() || !correctedData.amount 
                ? 'rgba(255, 149, 0, 0.3)' 
                : '#FF9500',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 149, 0, 0.5)'
            }}
            onMouseEnter={(e) => !loading && reason.trim() && correctedData.amount && (e.currentTarget.style.backgroundColor = '#FF8C00')}
            onMouseLeave={(e) => !loading && reason.trim() && correctedData.amount && (e.currentTarget.style.backgroundColor = '#FF9500')}
          >
            {loading ? (
              <>
                <div 
                  className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
                />
                <span>Membalikkan...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Balik & Koreksi</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReverseTransactionModal;
