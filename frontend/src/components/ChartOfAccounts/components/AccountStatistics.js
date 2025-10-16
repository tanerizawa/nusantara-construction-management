import React from 'react';
import { ACCOUNT_TYPES, getAccountTypeIcon } from '../config/accountTypes';
import { getAccountCountByType } from '../utils/accountHelpers';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';

const { colors } = CHART_OF_ACCOUNTS_CONFIG;

const AccountStatistics = ({ accounts }) => {
  const accountTypes = Object.values(ACCOUNT_TYPES);

  if (!accounts || accounts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {accountTypes.map(type => {
        const count = getAccountCountByType(accounts, type);

        return (
          <div 
            key={type} 
            className="rounded-lg p-4" 
            style={{ 
              backgroundColor: colors.background, 
              border: `1px solid ${colors.border}` 
            }}
          >
            <div className="flex items-center">
              <div className="mr-3">
                {getAccountTypeIcon(type)}
              </div>
              <div>
                <p 
                  className="text-sm font-medium" 
                  style={{ color: colors.textSecondary }}
                >
                  {type}
                </p>
                <p 
                  className="text-2xl font-bold" 
                  style={{ color: colors.text }}
                >
                  {count}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AccountStatistics;