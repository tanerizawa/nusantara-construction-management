import React from 'react';
import { formatCurrency, areAccountsBalanced } from '../utils/accountCalculations';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';

const { colors } = CHART_OF_ACCOUNTS_CONFIG;

const AccountSummaryPanel = ({ totalBalances, lastUpdate }) => {
  const isBalanced = areAccountsBalanced(totalBalances);

  if (!totalBalances || (totalBalances.totalDebit === 0 && totalBalances.totalCredit === 0)) {
    return null;
  }

  return (
    <div 
      className="rounded-lg p-4 mb-6" 
      style={{ 
        backgroundColor: colors.background, 
        border: `1px solid ${colors.border}` 
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: colors.primary }}>
            {formatCurrency(totalBalances.totalDebit, { 
              locale: 'id-ID', 
              currency: 'IDR',
              minimumFractionDigits: 0 
            })}
          </div>
          <div className="text-sm" style={{ color: colors.textSecondary }}>
            Total Debit
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: colors.success }}>
            {formatCurrency(totalBalances.totalCredit, { 
              locale: 'id-ID', 
              currency: 'IDR',
              minimumFractionDigits: 0 
            })}
          </div>
          <div className="text-sm" style={{ color: colors.textSecondary }}>
            Total Credit
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold">
            {isBalanced ? (
              <span style={{ color: colors.success }}>✓ Balanced</span>
            ) : (
              <span style={{ color: colors.error }}>⚠ Unbalanced</span>
            )}
          </div>
          <div className="text-sm" style={{ color: colors.textSecondary }}>
            {lastUpdate && `Last Update: ${lastUpdate.toLocaleTimeString('id-ID')}`}
          </div>
          {!isBalanced && (
            <div className="text-xs mt-1" style={{ color: colors.error }}>
              Difference: {formatCurrency(Math.abs(totalBalances.totalDebit - totalBalances.totalCredit), {
                locale: 'id-ID',
                currency: 'IDR',
                minimumFractionDigits: 0
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSummaryPanel;