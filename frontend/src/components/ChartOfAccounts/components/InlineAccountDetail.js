import React from 'react';
import { X, Building2, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/accountCalculations';
import { getAccountTypeIcon, getAccountTypeColor } from '../config/accountTypes';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';

const { colors } = CHART_OF_ACCOUNTS_CONFIG;

const InlineAccountDetail = ({ account, onClose, subsidiaryData }) => {
  if (!account) return null;

  const subsidiaryInfo = account.subsidiaryId && subsidiaryData?.[account.subsidiaryId];

  return (
    <div 
      className="border-l-4 ml-12 my-2 p-4 rounded-r-lg animate-slideDown shadow-lg"
      style={{
        backgroundColor: 'rgba(10, 132, 255, 0.08)',
        borderLeftColor: colors.primary,
        border: `1px solid rgba(10, 132, 255, 0.3)`,
        borderLeft: `4px solid ${colors.primary}`
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {getAccountTypeIcon(account.accountType, 28)}
          <div>
            <h4 className="text-xl font-bold" style={{ color: '#FFFFFF' }}>
              {account.accountName}
            </h4>
            <p className="text-sm font-mono mt-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {account.accountCode}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-all duration-200"
          title="Close Detail View"
          style={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs font-semibold block mb-2 uppercase tracking-wide" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Account Type
          </label>
          <div 
            className="px-3 py-2 rounded-lg text-sm font-medium"
            style={{ 
              backgroundColor: `${getAccountTypeColor(account.accountType)}30`,
              color: getAccountTypeColor(account.accountType),
              border: `1px solid ${getAccountTypeColor(account.accountType)}50`
            }}
          >
            {account.accountType}
          </div>
        </div>

        {account.accountSubType && (
          <div>
            <label className="text-xs font-semibold block mb-2 uppercase tracking-wide" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Sub Type
            </label>
            <p className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {account.accountSubType}
            </p>
          </div>
        )}

        <div>
          <label className="text-xs font-semibold block mb-2 uppercase tracking-wide" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Normal Balance
          </label>
          <div className="flex items-center gap-2">
            {account.normalBalance === 'DEBIT' ? 
              <TrendingDown size={18} style={{ color: '#10B981' }} /> :
              <TrendingUp size={18} style={{ color: '#EF4444' }} />
            }
            <span className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {account.normalBalance}
            </span>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold block mb-2 uppercase tracking-wide" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Current Balance
          </label>
          <p className="text-base font-bold" style={{ color: '#FFFFFF' }}>
            {formatCurrency(account.currentBalance || 0)}
          </p>
        </div>
      </div>

      {/* Subsidiary */}
      {subsidiaryInfo && (
        <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(10, 132, 255, 0.1)' }}>
          <label className="text-xs font-semibold block mb-2 uppercase tracking-wide" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Subsidiary
          </label>
          <div className="flex items-center gap-2">
            <Building2 size={18} style={{ color: colors.primary }} />
            <span className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {subsidiaryInfo.code} - {subsidiaryInfo.name}
            </span>
          </div>
        </div>
      )}

      {/* Description */}
      {account.description && (
        <div className="mb-4">
          <label className="text-xs font-semibold block mb-2 uppercase tracking-wide" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Description
          </label>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {account.description}
          </p>
        </div>
      )}

      {/* Notes */}
      {account.notes && (
        <div className="mb-4">
          <label className="text-xs font-semibold block mb-2 uppercase tracking-wide" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Notes
          </label>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {account.notes}
          </p>
        </div>
      )}

      {/* Flags */}
      <div className="flex flex-wrap gap-2">
        {account.constructionSpecific && (
          <span 
            className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ 
              backgroundColor: "rgba(10, 132, 255, 0.2)", 
              color: '#3B82F6',
              border: '1px solid rgba(10, 132, 255, 0.4)'
            }}
          >
            🏗️ Construction Specific
          </span>
        )}
        {account.taxDeductible && (
          <span 
            className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ 
              backgroundColor: "rgba(16, 185, 129, 0.2)", 
              color: "#10B981",
              border: '1px solid rgba(16, 185, 129, 0.4)'
            }}
          >
            💰 Tax Deductible
          </span>
        )}
        {account.vatApplicable && (
          <span 
            className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ 
              backgroundColor: "rgba(245, 158, 11, 0.2)", 
              color: "#F59E0B",
              border: '1px solid rgba(245, 158, 11, 0.4)'
            }}
          >
            📊 VAT Applicable
          </span>
        )}
        {account.projectCostCenter && (
          <span 
            className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ 
              backgroundColor: "rgba(139, 92, 246, 0.2)", 
              color: "#8B5CF6",
              border: '1px solid rgba(139, 92, 246, 0.4)'
            }}
          >
            📈 Project Cost Center
          </span>
        )}
      </div>
    </div>
  );
};

export default InlineAccountDetail;
