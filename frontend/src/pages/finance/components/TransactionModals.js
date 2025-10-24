import React from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDate, getPaymentMethodLabel } from '../utils/formatters';

/**
 * ViewTransactionModal Component
 * Displays detailed transaction information
 */
const ViewTransactionModal = ({ transaction, subsidiaryInfo, onClose }) => {
  if (!transaction) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
      <div className="rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
        <div className="p-6 flex justify-between items-center" style={{ borderBottom: '1px solid #38383A' }}>
          <h3 className="text-lg font-medium" style={{ color: '#FFFFFF' }}>Detail Transaksi</h3>
          <button
            onClick={onClose}
            className="transition-colors"
            style={{ color: '#636366' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#98989D'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#636366'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Transaction Type Badge */}
          <div className="flex items-center space-x-2">
            <span 
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: transaction.type === 'income' 
                  ? 'rgba(48, 209, 88, 0.15)' 
                  : transaction.type === 'expense'
                  ? 'rgba(255, 69, 58, 0.15)'
                  : 'rgba(10, 132, 255, 0.15)',
                color: transaction.type === 'income'
                  ? '#30D158'
                  : transaction.type === 'expense'
                  ? '#FF453A'
                  : '#0A84FF',
                border: transaction.type === 'income'
                  ? '1px solid rgba(48, 209, 88, 0.3)'
                  : transaction.type === 'expense'
                  ? '1px solid rgba(255, 69, 58, 0.3)'
                  : '1px solid rgba(10, 132, 255, 0.3)'
              }}
            >
              {transaction.type === 'income' ? 'Pendapatan' :
               transaction.type === 'expense' ? 'Pengeluaran' : 'Transfer'}
            </span>
          </div>

          {/* Amount */}
          <div className="rounded-lg p-4" style={{ backgroundColor: '#1C1C1E' }}>
            <p className="text-sm mb-1" style={{ color: '#98989D' }}>Nilai</p>
            <p 
              className="text-2xl font-bold"
              style={{ 
                color: transaction.type === 'income' ? '#30D158' : '#FF453A'
              }}
            >
              {formatCurrency(transaction.amount)}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-1" style={{ color: '#98989D' }}>Kategori</p>
              <p className="font-medium" style={{ color: '#FFFFFF' }}>{transaction.category}</p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#98989D' }}>Tanggal</p>
              <p className="font-medium" style={{ color: '#FFFFFF' }}>{formatDate(transaction.date, true)}</p>
            </div>
            
            {/* Account From - for expense/transfer */}
            {(transaction.type === 'expense' || transaction.type === 'transfer') && transaction.accountFrom && (
              <div>
                <p className="text-sm mb-1" style={{ color: '#98989D' }}>
                  {transaction.type === 'transfer' ? 'Dari Rekening' : 'Rekening Pembayar'}
                </p>
                <p className="font-medium" style={{ color: '#FFFFFF' }}>
                  {transaction.accountFrom}
                </p>
              </div>
            )}
            
            {/* Account To - for income/transfer */}
            {(transaction.type === 'income' || transaction.type === 'transfer') && transaction.accountTo && (
              <div>
                <p className="text-sm mb-1" style={{ color: '#98989D' }}>
                  {transaction.type === 'transfer' ? 'Ke Rekening' : 'Rekening Penerima'}
                </p>
                <p className="font-medium" style={{ color: '#FFFFFF' }}>
                  {transaction.accountTo}
                </p>
              </div>
            )}
            
            {/* Legacy Payment Method (for old transactions) */}
            {transaction.paymentMethod && (
              <div>
                <p className="text-sm mb-1" style={{ color: '#98989D' }}>Metode Pembayaran</p>
                <p className="font-medium" style={{ color: '#FFFFFF' }}>
                  {getPaymentMethodLabel(transaction.paymentMethod)}
                </p>
              </div>
            )}
            
            <div>
              <p className="text-sm mb-1" style={{ color: '#98989D' }}>Nomor Referensi</p>
              <p className="font-medium" style={{ color: '#FFFFFF' }}>{transaction.referenceNumber || '-'}</p>
            </div>
          </div>

          {/* Subsidiary Info */}
          {subsidiaryInfo && (
            <div>
              <p className="text-sm mb-1" style={{ color: '#98989D' }}>Anak Perusahaan</p>
              <p className="font-medium" style={{ color: '#FFFFFF' }}>{subsidiaryInfo.name}</p>
            </div>
          )}

          {/* Project Info */}
          {transaction.projectId && (
            <div>
              <p className="text-sm mb-1" style={{ color: '#98989D' }}>Proyek</p>
              <p className="font-medium" style={{ color: '#FFFFFF' }}>{transaction.projectName || transaction.projectId}</p>
            </div>
          )}

          {/* Description */}
          <div>
            <p className="text-sm mb-1" style={{ color: '#98989D' }}>Deskripsi</p>
            <p style={{ color: '#FFFFFF' }}>{transaction.description}</p>
          </div>

          {/* Notes */}
          {transaction.notes && (
            <div>
              <p className="text-sm mb-1" style={{ color: '#98989D' }}>Catatan</p>
              <p className="text-sm rounded p-3" style={{ color: '#98989D', backgroundColor: '#1C1C1E' }}>{transaction.notes}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 text-xs" style={{ borderTop: '1px solid #38383A', color: '#636366' }}>
            <p>ID Transaksi: {transaction.id}</p>
            {transaction.createdAt && (
              <p>Dibuat: {formatDate(transaction.createdAt, true)}</p>
            )}
          </div>
        </div>

        <div className="p-6 flex justify-end" style={{ borderTop: '1px solid #38383A' }}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: 'rgba(10, 132, 255, 0.15)',
              color: '#0A84FF',
              border: '1px solid rgba(10, 132, 255, 0.3)'
            }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

/**
 * DeleteTransactionModal Component
 * Confirmation dialog for transaction deletion
 */
const DeleteTransactionModal = ({ transaction, onConfirm, onCancel, isDeleting }) => {
  if (!transaction) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
      <div className="rounded-lg max-w-md w-full" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 69, 58, 0.15)' }}>
              <AlertTriangle className="w-5 h-5" style={{ color: '#FF453A' }} />
            </div>
            <h3 className="text-lg font-medium" style={{ color: '#FFFFFF' }}>Hapus Transaksi</h3>
          </div>
          
          <p className="mb-4" style={{ color: '#98989D' }}>
            Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="rounded-lg p-3 mb-4 text-sm" style={{ backgroundColor: '#1C1C1E' }}>
            <p style={{ color: '#98989D' }}>Detail Transaksi:</p>
            <p className="font-medium mt-1" style={{ color: '#FFFFFF' }}>{transaction.description}</p>
            <p 
              className="font-semibold mt-1"
              style={{ 
                color: transaction.type === 'income' ? '#30D158' : '#FF453A'
              }}
            >
              {formatCurrency(transaction.amount)}
            </p>
            <p className="mt-1" style={{ color: '#98989D' }}>{formatDate(transaction.date)}</p>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: 'rgba(152, 152, 157, 0.15)',
                color: '#98989D',
                border: '1px solid rgba(152, 152, 157, 0.3)'
              }}
              disabled={isDeleting}
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'rgba(255, 69, 58, 0.15)',
                color: '#FF453A',
                border: '1px solid rgba(255, 69, 58, 0.3)'
              }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Menghapus...</span>
                </>
              ) : (
                <span>Hapus Transaksi</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

/**
 * TransactionModals Component
 * Container for all transaction-related modals
 */
const TransactionModals = ({
  showView,
  showDelete,
  transaction,
  subsidiaryInfo,
  onCloseView,
  onCloseDelete,
  onConfirmDelete,
  isDeleting
}) => {
  return (
    <>
      {showView && (
        <ViewTransactionModal
          transaction={transaction}
          subsidiaryInfo={subsidiaryInfo}
          onClose={onCloseView}
        />
      )}
      {showDelete && (
        <DeleteTransactionModal
          transaction={transaction}
          onConfirm={onConfirmDelete}
          onCancel={onCloseDelete}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
};

export default TransactionModals;
export { ViewTransactionModal, DeleteTransactionModal };
