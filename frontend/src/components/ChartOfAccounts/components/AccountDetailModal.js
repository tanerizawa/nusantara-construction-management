import React from 'react';
import { createPortal } from 'react-dom';
import { X, Building2, TrendingUp, TrendingDown, FileText } from 'lucide-react';
import { formatCurrency } from '../utils/accountCalculations';
import { getAccountTypeIcon, getAccountTypeColor } from '../config/accountTypes';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';

const { colors, modal } = CHART_OF_ACCOUNTS_CONFIG;

const AccountDetailModal = ({ 
  isOpen, 
  onClose, 
  account,
  subsidiaryData 
}) => {
  // CRITICAL FIX: Only check isOpen, account will be set by parent
  if (!isOpen) return null;
  
  // If account not loaded yet, show loading state
  if (!account) {
    return createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>,
      document.body
    );
  }

  const subsidiaryInfo = account.subsidiaryId && subsidiaryData?.[account.subsidiaryId];

  return createPortal(
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="rounded-lg p-6 w-full shadow-2xl overflow-y-auto"
        style={{
          backgroundColor: colors.background,
          maxWidth: '700px',
          maxHeight: '90vh',
          border: `1px solid ${colors.border}`
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: colors.backgroundSecondary }}>
              {getAccountTypeIcon(account.accountType, 28)}
            </div>
            <div>
              <h3 className="text-xl font-semibold" style={{ color: colors.text }}>
                Account Details
              </h3>
              <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                Viewing account information
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Account Code & Name */}
        <div 
          className="p-4 rounded-lg mb-6"
          style={{ backgroundColor: colors.backgroundSecondary }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>
              Account Code
            </span>
            <span className="font-mono text-lg font-bold" style={{ color: colors.text }}>
              {account.accountCode}
            </span>
          </div>
          
          <div>
            <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>
              Account Name
            </span>
            <p className="text-lg font-semibold mt-1" style={{ color: colors.text }}>
              {account.accountName}
            </p>
          </div>
        </div>

        {/* Account Type & Level */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
              Account Type
            </span>
            <div className="flex items-center gap-2 mt-2">
              <span 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: getAccountTypeColor(account.accountType).bg,
                  color: getAccountTypeColor(account.accountType).color
                }}
              >
                {account.accountType}
              </span>
            </div>
          </div>
          
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
              Level
            </span>
            <p className="text-2xl font-bold mt-2" style={{ color: colors.text }}>
              {account.level}
            </p>
          </div>
        </div>

        {/* Balance Information */}
        {(account.debit > 0 || account.credit > 0 || account.balance !== 0) && (
          <div 
            className="p-4 rounded-lg mb-6"
            style={{ 
              backgroundColor: colors.backgroundSecondary,
              border: `2px solid ${colors.border}`
            }}
          >
            <h4 className="text-sm font-semibold mb-4" style={{ color: colors.text }}>
              Balance Information
            </h4>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} style={{ color: colors.success }} />
                  <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                    Debit
                  </span>
                </div>
                <p className="text-lg font-semibold" style={{ color: colors.success }}>
                  {formatCurrency(account.debit || 0, {
                    locale: 'id-ID',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  })}
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown size={16} style={{ color: colors.error }} />
                  <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                    Credit
                  </span>
                </div>
                <p className="text-lg font-semibold" style={{ color: colors.error }}>
                  {formatCurrency(account.credit || 0, {
                    locale: 'id-ID',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  })}
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={16} style={{ color: colors.primary }} />
                  <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                    Balance
                  </span>
                </div>
                <p 
                  className="text-lg font-bold"
                  style={{
                    color: account.balance > 0 ? colors.success : 
                           account.balance < 0 ? colors.error : colors.text
                  }}
                >
                  {account.balance > 0 ? '+' : account.balance < 0 ? '-' : ''}
                  {formatCurrency(Math.abs(account.balance || 0), {
                    locale: 'id-ID',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Subsidiary Information */}
        {subsidiaryInfo && (
          <div 
            className="p-4 rounded-lg mb-6"
            style={{ 
              backgroundColor: 'rgba(255, 159, 10, 0.1)',
              border: '1px solid rgba(255, 159, 10, 0.3)'
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Building2 size={18} style={{ color: '#FF9F0A' }} />
              <span className="text-sm font-semibold" style={{ color: '#FF9F0A' }}>
                Subsidiary
              </span>
            </div>
            <p className="text-lg font-bold" style={{ color: colors.text }}>
              {subsidiaryInfo.code} - {subsidiaryInfo.name}
            </p>
          </div>
        )}

        {/* Additional Properties */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {account.constructionSpecific && (
            <div 
              className="p-3 rounded-lg flex items-center gap-2"
              style={{ 
                backgroundColor: 'rgba(10, 132, 255, 0.1)',
                border: '1px solid rgba(10, 132, 255, 0.3)'
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
              <span className="text-sm font-medium" style={{ color: colors.primary }}>
                Construction Specific
              </span>
            </div>
          )}
          
          {account.projectCostCenter && (
            <div 
              className="p-3 rounded-lg flex items-center gap-2"
              style={{ 
                backgroundColor: 'rgba(50, 215, 75, 0.1)',
                border: '1px solid rgba(50, 215, 75, 0.3)'
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.success }} />
              <span className="text-sm font-medium" style={{ color: colors.success }}>
                Project Cost Center
              </span>
            </div>
          )}
          
          {account.taxDeductible && (
            <div 
              className="p-3 rounded-lg flex items-center gap-2"
              style={{ 
                backgroundColor: 'rgba(142, 142, 147, 0.1)',
                border: '1px solid rgba(142, 142, 147, 0.3)'
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.textSecondary }} />
              <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                Tax Deductible
              </span>
            </div>
          )}
          
          {account.vatApplicable && (
            <div 
              className="p-3 rounded-lg flex items-center gap-2"
              style={{ 
                backgroundColor: 'rgba(142, 142, 147, 0.1)',
                border: '1px solid rgba(142, 142, 147, 0.3)'
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.textSecondary }} />
              <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                VAT Applicable
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {account.description && (
          <div 
            className="p-4 rounded-lg mb-6"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <span className="text-sm font-semibold mb-2 block" style={{ color: colors.text }}>
              Description
            </span>
            <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
              {account.description}
            </p>
          </div>
        )}

        {/* Notes */}
        {account.notes && (
          <div 
            className="p-4 rounded-lg mb-6"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <span className="text-sm font-semibold mb-2 block" style={{ color: colors.text }}>
              Notes
            </span>
            <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
              {account.notes}
            </p>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: colors.primary,
              color: 'white'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AccountDetailModal;
