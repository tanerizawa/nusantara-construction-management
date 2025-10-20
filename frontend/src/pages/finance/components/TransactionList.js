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
      income: 'Income',
      expense: 'Expense',
      transfer: 'Transfer'
    };
    return labels[type] || type;
  };

  return (
    <div className="rounded-xl shadow-lg overflow-hidden" style={{
      backgroundColor: '#2C2C2E',
      border: '1px solid #38383A'
    }}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr style={{ backgroundColor: '#1C1C1E' }}>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#98989D' }}>
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#98989D' }}>
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#98989D' }}>
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#98989D' }}>
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#98989D' }}>
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#98989D' }}>
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#98989D' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: '#0A84FF' }}></div>
                  <p className="mt-2" style={{ color: '#98989D' }}>Loading transactions...</p>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <div className="mb-4" style={{ color: '#636366' }}>
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: '#FFFFFF' }}>No Transactions Found</h3>
                  <p className="mb-4" style={{ color: '#98989D' }}>Get started by creating your first financial transaction.</p>
                  {onAddNew && (
                    <button 
                      onClick={onAddNew}
                      className="px-4 py-2 rounded-lg transition-all duration-200 inline-flex items-center space-x-2"
                      style={{
                        backgroundColor: 'rgba(10, 132, 255, 0.15)',
                        color: '#0A84FF',
                        border: '1px solid rgba(10, 132, 255, 0.3)'
                      }}
                    >
                      <span>Add First Transaction</span>
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr 
                  key={transaction.id} 
                  className="transition-colors duration-150"
                  style={{
                    borderBottom: '1px solid #38383A'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(56, 56, 58, 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#FFFFFF' }}>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#FFFFFF' }}>
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 text-sm max-w-xs truncate" style={{ color: '#98989D' }}>
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
                          title="View Details"
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
                          title="Edit Transaction"
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
                          title="Delete Transaction"
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
                          title="Void Transaction (Cancel)"
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
                          title="Reverse & Correct Transaction"
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
        <div 
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderTop: '1px solid #38383A' }}
        >
          <div className="text-sm" style={{ color: '#98989D' }}>
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: currentPage === 1 ? 'rgba(56, 56, 58, 0.3)' : 'rgba(10, 132, 255, 0.15)',
                color: currentPage === 1 ? '#636366' : '#0A84FF',
                border: currentPage === 1 ? '1px solid #38383A' : '1px solid rgba(10, 132, 255, 0.3)'
              }}
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: currentPage === totalPages ? 'rgba(56, 56, 58, 0.3)' : 'rgba(10, 132, 255, 0.15)',
                color: currentPage === totalPages ? '#636366' : '#0A84FF',
                border: currentPage === totalPages ? '1px solid #38383A' : '1px solid rgba(10, 132, 255, 0.3)'
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
