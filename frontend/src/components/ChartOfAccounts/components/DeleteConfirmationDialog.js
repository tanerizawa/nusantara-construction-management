import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';

const { colors, modal } = CHART_OF_ACCOUNTS_CONFIG;

const DeleteConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  account,
  isDeleting 
}) => {
  // CRITICAL FIX: Only check isOpen, account will be set by parent
  if (!isOpen) return null;
  
  // If account not loaded yet, show loading state
  if (!account) {
    return createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && !isDeleting && onClose()}
    >
      <div 
        className="rounded-lg p-6 w-full shadow-2xl"
        style={{
          backgroundColor: colors.background,
          maxWidth: '500px',
          border: `1px solid ${colors.border}`
        }}
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div 
            className="p-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
          >
            <AlertTriangle size={24} style={{ color: '#EF4444' }} />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
              Delete Account?
            </h3>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              This action cannot be undone. The account will be permanently deleted.
            </p>
          </div>
          
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Account Info */}
        <div 
          className="p-4 rounded-lg mb-6"
          style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>
              Account Code
            </span>
            <span className="font-mono font-semibold" style={{ color: colors.text }}>
              {account.accountCode}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>
              Account Name
            </span>
            <span className="font-semibold" style={{ color: colors.text }}>
              {account.accountName}
            </span>
          </div>
        </div>

        {/* Warning Message */}
        <div 
          className="p-3 rounded-lg mb-6 flex items-start gap-2"
          style={{ 
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}
        >
          <AlertTriangle size={16} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '2px' }} />
          <p className="text-xs" style={{ color: '#F59E0B' }}>
            <strong>Note:</strong> You cannot delete an account that has sub-accounts. 
            Please delete all sub-accounts first.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: colors.backgroundSecondary,
              color: colors.text,
              border: `1px solid ${colors.border}`
            }}
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            style={{
              backgroundColor: '#EF4444',
              color: 'white',
              opacity: isDeleting ? 0.6 : 1
            }}
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              'Delete Account'
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteConfirmationDialog;
