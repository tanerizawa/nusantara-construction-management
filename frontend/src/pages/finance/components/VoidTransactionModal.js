import React, { useState } from 'react';
import { XCircle, AlertTriangle, X } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuth } from '../../../context/AuthContext';

/**
 * VoidTransactionModal Component
 * 
 * Modal for voiding (cancelling) a posted transaction
 * Requires reason for audit trail compliance
 * 
 * Best Practice: VOID is used to cancel a transaction completely
 * - Original transaction kept (marked as voided)
 * - Balance reversed
 * - Reason recorded for audit
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onVoid - Void handler
 * @param {Object} props.transaction - Transaction to void
 * @param {boolean} props.loading - Loading state
 */
const VoidTransactionModal = ({
  isOpen,
  onClose,
  onVoid,
  transaction,
  loading = false
}) => {
  const { user } = useAuth();
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});

  /**
   * Validate void reason
   */
  const validate = () => {
    const newErrors = {};

    if (!reason || reason.trim() === '') {
      newErrors.reason = 'Alasan pembatalan wajib diisi untuk jejak audit';
    } else if (reason.trim().length < 10) {
      newErrors.reason = 'Alasan minimal 10 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle void submission
   */
  const handleVoid = async () => {
    if (!validate()) return;

    try {
      await onVoid({
        reason: reason.trim(),
        voidedBy: user?.id || user?.username || 'unknown'
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
    setErrors({});
    onClose();
  };

  if (!isOpen || !transaction) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
      onClick={handleClose}
    >
      <div 
        className="rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: '#2C2C2E',
          border: '1px solid #38383A'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid #38383A' }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ 
                backgroundColor: 'rgba(255, 69, 58, 0.15)',
                border: '1px solid rgba(255, 69, 58, 0.3)'
              }}
            >
              <XCircle className="w-5 h-5" style={{ color: '#FF453A' }} />
            </div>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>
                Batalkan Transaksi
              </h3>
              <p className="text-xs" style={{ color: '#98989D' }}>
                Batalkan transaksi ini secara permanen
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
            backgroundColor: 'rgba(255, 159, 10, 0.1)',
            border: '1px solid rgba(255, 159, 10, 0.3)'
          }}
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#FF9F0A' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: '#FF9F0A' }}>
              Tindakan ini tidak dapat dibatalkan
            </p>
            <p className="text-xs mt-1" style={{ color: '#98989D' }}>
              Transaksi akan ditandai sebagai DIBATALKAN dan saldo akun akan disesuaikan. 
              Data transaksi asli akan disimpan untuk jejak audit.
            </p>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="px-6 py-4">
          <h4 className="text-sm font-medium mb-3" style={{ color: '#98989D' }}>
            Detail Transaksi
          </h4>
          <div 
            className="rounded-lg p-4 space-y-2"
            style={{ 
              backgroundColor: 'rgba(56, 56, 58, 0.3)',
              border: '1px solid #38383A'
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: '#98989D' }}>ID:</span>
              <span className="text-sm font-mono" style={{ color: '#FFFFFF' }}>
                {transaction.id}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: '#98989D' }}>Tanggal:</span>
              <span className="text-sm" style={{ color: '#FFFFFF' }}>
                {formatDate(transaction.date)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: '#98989D' }}>Jenis:</span>
              <span 
                className="text-sm px-2 py-0.5 rounded"
                style={{
                  backgroundColor: transaction.type === 'income' 
                    ? 'rgba(48, 209, 88, 0.15)' 
                    : 'rgba(255, 69, 58, 0.15)',
                  color: transaction.type === 'income' ? '#30D158' : '#FF453A'
                }}
              >
                {transaction.type?.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: '#98989D' }}>Nilai:</span>
              <span 
                className="text-sm font-semibold"
                style={{ color: transaction.type === 'income' ? '#30D158' : '#FF453A' }}
              >
                {formatCurrency(transaction.amount)}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm" style={{ color: '#98989D' }}>Deskripsi:</span>
              <span className="text-sm text-right max-w-xs" style={{ color: '#FFFFFF' }}>
                {transaction.description || '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Void Reason Input */}
        <div className="px-6 pb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
            Alasan Pembatalan <span style={{ color: '#FF453A' }}>*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (errors.reason) {
                setErrors({ ...errors, reason: null });
              }
            }}
            placeholder="contoh: Transaksi tercatat dua kali (duplikat)"
            rows={4}
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
          <p className="mt-1 text-xs" style={{ color: '#636366' }}>
            Minimal 10 karakter. Ini akan direkam dalam jejak audit.
          </p>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div 
            className="mx-6 mb-4 p-3 rounded-lg"
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

        {/* Footer Actions */}
        <div 
          className="px-6 py-4 flex items-center justify-end space-x-3"
          style={{ borderTop: '1px solid #38383A' }}
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
            onClick={handleVoid}
            disabled={loading || !reason.trim()}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            style={{
              backgroundColor: loading || !reason.trim() ? 'rgba(255, 69, 58, 0.3)' : '#FF453A',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 69, 58, 0.5)'
            }}
            onMouseEnter={(e) => !loading && reason.trim() && (e.currentTarget.style.backgroundColor = '#FF3B30')}
            onMouseLeave={(e) => !loading && reason.trim() && (e.currentTarget.style.backgroundColor = '#FF453A')}
          >
            {loading ? (
              <>
                <div 
                  className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
                />
                <span>Membatalkan...</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                <span>Batalkan Transaksi</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoidTransactionModal;
