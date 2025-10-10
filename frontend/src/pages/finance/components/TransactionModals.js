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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Transaction Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Transaction Type Badge */}
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              transaction.type === 'income' ? 'bg-green-100 text-green-800' :
              transaction.type === 'expense' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {transaction.type === 'income' ? 'Income' :
               transaction.type === 'expense' ? 'Expense' : 'Transfer'}
            </span>
          </div>

          {/* Amount */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Amount</p>
            <p className={`text-2xl font-bold ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(transaction.amount)}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Category</p>
              <p className="font-medium text-gray-900">{transaction.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Date</p>
              <p className="font-medium text-gray-900">{formatDate(transaction.date, true)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Payment Method</p>
              <p className="font-medium text-gray-900">
                {getPaymentMethodLabel(transaction.paymentMethod)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Reference Number</p>
              <p className="font-medium text-gray-900">{transaction.referenceNumber || '-'}</p>
            </div>
          </div>

          {/* Subsidiary Info */}
          {subsidiaryInfo && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Subsidiary</p>
              <p className="font-medium text-gray-900">{subsidiaryInfo.name}</p>
            </div>
          )}

          {/* Project Info */}
          {transaction.projectId && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Project</p>
              <p className="font-medium text-gray-900">{transaction.projectName || transaction.projectId}</p>
            </div>
          )}

          {/* Description */}
          <div>
            <p className="text-sm text-gray-600 mb-1">Description</p>
            <p className="text-gray-900">{transaction.description}</p>
          </div>

          {/* Notes */}
          {transaction.notes && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Notes</p>
              <p className="text-gray-700 text-sm bg-gray-50 rounded p-3">{transaction.notes}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
            <p>Transaction ID: {transaction.id}</p>
            {transaction.createdAt && (
              <p>Created: {formatDate(transaction.createdAt, true)}</p>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Delete Transaction</h3>
          </div>
          
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </p>

          <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
            <p className="text-gray-600">Transaction Details:</p>
            <p className="font-medium text-gray-900 mt-1">{transaction.description}</p>
            <p className={`font-semibold mt-1 ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(transaction.amount)}
            </p>
            <p className="text-gray-600 mt-1">{formatDate(transaction.date)}</p>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Transaction</span>
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
