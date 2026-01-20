import React from 'react';
import { Eye, Edit2, Trash2, XCircle, RefreshCw } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import TransactionStatusBadge from './TransactionStatusBadge';

/**
 * TransactionList Component
 * 
 * Displays transaction table with pagination and actions
 * Supports filtering, sorting, and CRUD operations
 * 
 * @param {Object} props
 * @param {Array} props.transactions - List of transactions to display
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onView - Handler for view transaction
 * @param {Function} props.onEdit - Handler for edit transaction
 * @param {Function} props.onDelete - Handler for delete transaction
 * @param {Function} props.onVoid - Handler for void transaction (NEW)
 * @param {Function} props.onReverse - Handler for reverse transaction (NEW)
 * @param {number} props.currentPage - Current pagination page
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Handler for page change
 * @param {Function} props.onAddNew - Handler for adding new transaction
 */
const TransactionList = ({
  transactions = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onVoid,
  onReverse,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onAddNew
}) => {
  /**
   * Get transaction type badge styling
   */
  const getTypeBadge = (type) => {
    const styles = {
      income: 'bg-green-100 text-green-800',
      expense: 'bg-red-100 text-red-800',
      transfer: 'bg-blue-100 text-blue-800'
    };
    return styles[type] || 'bg-gray-100 text-gray-800';
  };

  /**
   * Get transaction type label
   */
  const getTypeLabel = (type) => {
    const labels = {
      income: 'Pendapatan',
      expense: 'Pengeluaran',
      transfer: 'Transfer'
    };
    return labels[type] || type;
  };

  return (
    <div className="rounded-2xl shadow-lg overflow-hidden border border-white/5 bg-[#0b0f19]/80 backdrop-blur-xl">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-white/5">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/50">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/50">
                Jenis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/50">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/50">
                Deskripsi
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-[0.15em] text-white/50">
                Nilai
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/50">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-[0.15em] text-white/50">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0ea5e9] mx-auto"></div>
                  <p className="mt-2 text-white/60">Memuat transaksi...</p>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <div className="mb-4 text-white/30">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-white">Tidak Ada Transaksi</h3>
                  <p className="mb-4 text-white/60">Mulailah dengan membuat transaksi keuangan pertama Anda.</p>
                  {onAddNew && (
                    <button 
                      onClick={onAddNew}
                      className="px-4 py-2 rounded-xl transition-all duration-200 inline-flex items-center space-x-2 bg-[#0ea5e9]/15 text-[#0ea5e9] border border-[#0ea5e9]/30 hover:bg-[#0ea5e9]/25"
                    >
                      <span>Tambah Transaksi Pertama</span>
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr 
                  key={transaction.id} 
                  className="transition-colors duration-150 border-b border-white/5 hover:bg-white/5"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="px-2 py-1 text-xs rounded-full font-medium"
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
                      {getTypeLabel(transaction.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 text-sm max-w-xs truncate text-white/60">
                    {transaction.description}
                  </td>
                  <td 
                    className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold"
                    style={{ 
                      color: transaction.type === 'income' ? '#30D158' : '#FF453A'
                    }}
                  >
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <TransactionStatusBadge 
                      status={transaction.status} 
                      isReversed={transaction.isReversed}
                      size="sm"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {/* View button - always available */}
                      {onView && (
                        <button
                          onClick={() => onView(transaction)}
                          className="p-1.5 rounded transition-all duration-200"
                          style={{
                            color: '#0A84FF',
                            backgroundColor: 'transparent'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(10, 132, 255, 0.15)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* Edit button - only for DRAFT/PENDING */}
                      {onEdit && ['draft', 'pending'].includes(transaction.status?.toLowerCase()) && (
                        <button
                          onClick={() => onEdit(transaction)}
                          className="p-1.5 rounded transition-all duration-200"
                          style={{
                            color: '#30D158',
                            backgroundColor: 'transparent'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(48, 209, 88, 0.15)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          title="Sunting Transaksi"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* Delete button - only for DRAFT/PENDING */}
                      {onDelete && ['draft', 'pending'].includes(transaction.status?.toLowerCase()) && (
                        <button
                          onClick={() => onDelete(transaction)}
                          className="p-1.5 rounded transition-all duration-200"
                          style={{
                            color: '#FF453A',
                            backgroundColor: 'transparent'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 69, 58, 0.15)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* Void button - for POSTED/COMPLETED/APPROVED (not voided/reversed) */}
                      {onVoid && 
                        ['posted', 'completed', 'approved'].includes(transaction.status?.toLowerCase()) && 
                        !transaction.isReversed &&
                        transaction.status?.toLowerCase() !== 'voided' && (
                        <button
                          onClick={() => onVoid(transaction)}
                          className="p-1.5 rounded transition-all duration-200"
                          style={{
                            color: '#FF9F0A',
                            backgroundColor: 'transparent'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 159, 10, 0.15)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          title="Batalkan Transaksi (Void)"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* Reverse button - for POSTED (not voided/reversed) */}
                      {onReverse && 
                        transaction.status?.toLowerCase() === 'posted' && 
                        !transaction.isReversed && (
                        <button
                          onClick={() => onReverse(transaction)}
                          className="p-1.5 rounded transition-all duration-200"
                          style={{
                            color: '#BF5AF2',
                            backgroundColor: 'transparent'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(191, 90, 242, 0.15)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          title="Balik & Koreksi Transaksi"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && transactions.length > 0 && totalPages > 1 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-white/5">
          <div className="text-sm text-white/60">
            Halaman {currentPage} dari {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                currentPage === 1 
                  ? 'bg-white/5 text-white/30 border border-white/10' 
                  : 'bg-[#0ea5e9]/15 text-[#0ea5e9] border border-[#0ea5e9]/30'
              }`}
            >
              Sebelumnya
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                currentPage === totalPages 
                  ? 'bg-white/5 text-white/30 border border-white/10' 
                  : 'bg-[#0ea5e9]/15 text-[#0ea5e9] border border-[#0ea5e9]/30'
              }`}
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
