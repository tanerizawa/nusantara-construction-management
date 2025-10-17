import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';

const { colors } = CHART_OF_ACCOUNTS_CONFIG;

const InlineDeleteConfirm = ({ account, onConfirm, onCancel, isDeleting }) => {
  if (!account) return null;

  return (
    <div 
      className="border-l-4 ml-12 my-2 p-4 rounded-r-lg animate-slideDown shadow-lg"
      style={{
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        borderLeftColor: '#EF4444',
        border: `1px solid rgba(239, 68, 68, 0.3)`,
        borderLeft: `4px solid #EF4444`
      }}
    >
      <div className="flex items-start gap-3">
        <div 
          className="p-3 rounded-full flex-shrink-0 animate-pulse"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
        >
          <AlertTriangle size={24} style={{ color: '#EF4444' }} />
        </div>
        
        <div className="flex-1">
          <h4 className="text-lg font-bold mb-2" style={{ color: '#FFFFFF' }}>
            ⚠️ Delete Account?
          </h4>
          <p className="text-sm mb-2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Are you sure you want to permanently delete this account?
          </p>
          <div className="p-3 rounded-lg mb-3" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}>
            <p className="text-sm font-mono mb-1" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              {account.accountCode}
            </p>
            <p className="text-base font-bold" style={{ color: '#FFFFFF' }}>
              {account.accountName}
            </p>
          </div>
          
          {account.SubAccounts && account.SubAccounts.length > 0 && (
            <div 
              className="p-3 rounded-lg mb-4 border-l-4"
              style={{ 
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#F59E0B',
                borderLeftColor: '#F59E0B',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderLeft: '4px solid #F59E0B'
              }}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="mt-0.5" />
                <div className="text-sm">
                  <strong>Warning:</strong> This account has <strong>{account.SubAccounts.length}</strong> sub-account(s). Deleting this will affect all child accounts.
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all disabled:opacity-50 hover:shadow-lg font-medium"
              style={{
                backgroundColor: isDeleting ? 'rgba(239, 68, 68, 0.5)' : '#EF4444',
                color: 'white',
                fontSize: '0.875rem',
                boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)'
              }}
            >
              <Trash2 size={18} />
              {isDeleting ? 'Deleting...' : 'Yes, Delete Permanently'}
            </button>
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-lg transition-all disabled:opacity-50 hover:bg-white/10 font-medium"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: `1px solid rgba(255, 255, 255, 0.2)`,
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.875rem'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InlineDeleteConfirm;
