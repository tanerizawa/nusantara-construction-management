import React from 'react';
import AccountTreeItem from './AccountTreeItem';
import { hasSubAccounts } from '../utils/accountHelpers';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';

const { colors } = CHART_OF_ACCOUNTS_CONFIG;

const AccountTree = ({ 
  accounts, 
  expandedNodes, 
  onToggleNode 
}) => {
  const renderAccount = (account, level = 0) => {
    const isExpanded = expandedNodes.has(account.id);
    
    return (
      <AccountTreeItem
        key={account.id}
        account={account}
        level={level}
        isExpanded={isExpanded}
        onToggleExpansion={onToggleNode}
      >
        {hasSubAccounts(account) && isExpanded && (
          <div>
            {account.SubAccounts.map(subAccount => 
              renderAccount(subAccount, level + 1)
            )}
          </div>
        )}
      </AccountTreeItem>
    );
  };

  if (!accounts || accounts.length === 0) {
    return (
      <div 
        className="rounded-lg" 
        style={{ 
          backgroundColor: colors.background, 
          border: `1px solid ${colors.border}` 
        }}
      >
        <div 
          className="px-6 py-4" 
          style={{ borderBottom: `1px solid ${colors.border}` }}
        >
          <h2 className="text-lg font-semibold" style={{ color: colors.text }}>
            Struktur Akun
          </h2>
        </div>
        <div className="px-6 py-8 text-center">
          <div style={{ color: colors.textSecondary }}>
            No accounts found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="rounded-lg" 
      style={{ 
        backgroundColor: colors.background, 
        border: `1px solid ${colors.border}` 
      }}
    >
      <div 
        className="px-6 py-4" 
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <h2 className="text-lg font-semibold" style={{ color: colors.text }}>
          Struktur Akun
        </h2>
      </div>
      <div style={{ borderTop: `1px solid ${colors.border}` }}>
        {accounts.map(account => renderAccount(account))}
      </div>
    </div>
  );
};

export default AccountTree;