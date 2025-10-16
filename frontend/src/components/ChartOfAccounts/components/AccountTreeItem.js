import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { getAccountTypeIcon, getAccountTypeColor } from '../config/accountTypes';
import { formatCurrency } from '../utils/accountCalculations';
import { hasSubAccounts } from '../utils/accountHelpers';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';

const { colors, ui } = CHART_OF_ACCOUNTS_CONFIG;

const AccountTreeItem = ({ 
  account, 
  level = 0, 
  isExpanded, 
  onToggleExpansion, 
  children 
}) => {
  const hasChildren = hasSubAccounts(account);
  const paddingLeft = level * ui.treeViewPadding;

  const handleClick = () => {
    if (hasChildren && onToggleExpansion) {
      onToggleExpansion(account.id);
    }
  };

  return (
    <div key={account.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
      <div 
        className="flex items-center py-3 cursor-pointer transition-colors duration-150"
        style={{ paddingLeft: `${paddingLeft + 12}px` }}
        onClick={handleClick}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <div className="flex items-center flex-1">
          {hasChildren && (
            <button className="mr-2 p-1">
              {isExpanded ? 
                <ChevronDown size={16} style={{ color: colors.textSecondary }} /> : 
                <ChevronRight size={16} style={{ color: colors.textSecondary }} />
              }
            </button>
          )}
          {!hasChildren && <div className="w-6" />}
          
          <div className="mr-3">
            {getAccountTypeIcon(account.accountType)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span 
                  className="font-mono text-sm mr-3" 
                  style={{ color: colors.textSecondary }}
                >
                  {account.accountCode}
                </span>
                <span 
                  className="font-medium" 
                  style={{ color: colors.text }}
                >
                  {account.accountName}
                </span>
                
                {account.constructionSpecific && (
                  <span 
                    className="ml-2 text-xs px-2 py-1 rounded" 
                    style={{ 
                      backgroundColor: "rgba(10, 132, 255, 0.15)", 
                      color: colors.primary 
                    }}
                  >
                    Konstruksi
                  </span>
                )}
                
                {account.projectCostCenter && (
                  <span 
                    className="ml-2 text-xs px-2 py-1 rounded" 
                    style={{ 
                      backgroundColor: "rgba(50, 215, 75, 0.15)", 
                      color: colors.success 
                    }}
                  >
                    Cost Center
                  </span>
                )}
              </div>
              
              {/* Balance Information */}
              <div className="flex items-center space-x-4">
                {(account.debit > 0 || account.credit > 0) && (
                  <div className="text-right">
                    <div 
                      className="text-sm font-medium"
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
                    </div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>
                      D: {formatCurrency(account.debit || 0, { 
                        locale: 'id-ID', 
                        currency: 'IDR', 
                        minimumFractionDigits: 0 
                      })} |
                      C: {formatCurrency(account.credit || 0, { 
                        locale: 'id-ID', 
                        currency: 'IDR', 
                        minimumFractionDigits: 0 
                      })}
                    </div>
                  </div>
                )}
                
                <span 
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: getAccountTypeColor(account.accountType).bg,
                    color: getAccountTypeColor(account.accountType).color
                  }}
                >
                  {account.accountType}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {hasChildren && isExpanded && children}
    </div>
  );
};

export default AccountTreeItem;