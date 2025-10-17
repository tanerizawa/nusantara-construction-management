import React from 'react';
import { CheckCircle } from 'lucide-react';
import { getTotalAccountCount } from '../utils/accountHelpers';
import { formatCurrency, areAccountsBalanced } from '../utils/accountCalculations';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';
import SubsidiarySelector from './SubsidiarySelector';

const { colors } = CHART_OF_ACCOUNTS_CONFIG;

const ChartOfAccountsHeader = ({ 
  accounts, 
  totalBalances, 
  lastUpdate, 
  error, 
  refreshing, 
  onRefresh, 
  onAddAccount,
  selectedSubsidiary,
  onSubsidiaryChange
}) => {
  const totalAccountCount = getTotalAccountCount(accounts);
  const isBalanced = areAccountsBalanced(totalBalances);

  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Chart of Accounts
          </h1>
          {!error && accounts.length > 0 && (
            <span 
              className="flex items-center text-sm px-2 py-1 rounded" 
              style={{ 
                backgroundColor: "rgba(50, 215, 75, 0.15)", 
                color: colors.success 
              }}
            >
              <CheckCircle size={14} className="mr-1" />
              {totalAccountCount} accounts loaded
            </span>
          )}
          {isBalanced && (
            <span 
              className="flex items-center text-sm px-2 py-1 rounded" 
              style={{ 
                backgroundColor: "rgba(50, 215, 75, 0.15)", 
                color: colors.success 
              }}
            >
              ✓ Balanced
            </span>
          )}
        </div>
        <p className="mt-1" style={{ color: colors.textSecondary }}>
          Bagan akun standar industri konstruksi sesuai PSAK - Real-time data
        </p>
        {lastUpdate && (
          <p className="text-xs mt-1" style={{ color: colors.textTertiary }}>
            Last updated: {lastUpdate.toLocaleTimeString('id-ID')}
          </p>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Subsidiary Selector */}
        <SubsidiarySelector
          selectedSubsidiary={selectedSubsidiary}
          onSubsidiaryChange={onSubsidiaryChange}
        />
        
        <button 
          onClick={onRefresh}
          disabled={refreshing}
          className="px-4 py-2 rounded-lg flex items-center transition-colors duration-150 disabled:opacity-50"
          style={{ 
            backgroundColor: "rgba(152, 152, 157, 0.15)", 
            border: `1px solid ${colors.border}`, 
            color: colors.textSecondary 
          }}
        >
          <svg 
            className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
        
        <button 
          onClick={onAddAccount}
          className="px-4 py-2 rounded-lg flex items-center transition-colors duration-150"
          style={{ 
            background: `linear-gradient(135deg, ${colors.primary} 0%, #0066CC 100%)`, 
            color: colors.text 
          }}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Akun
        </button>
      </div>
    </div>
  );
};

export default ChartOfAccountsHeader;