/**
 * Calculate total balances from accounts array
 */
export const calculateTotalBalances = (accounts) => {
  const balances = {
    totalDebit: 0,
    totalCredit: 0,
    netBalance: 0
  };

  const processAccounts = (accountsList) => {
    accountsList.forEach(account => {
      // Add current account balances
      balances.totalDebit += account.debit || 0;
      balances.totalCredit += account.credit || 0;
      
      // Process sub accounts recursively
      if (account.SubAccounts && account.SubAccounts.length > 0) {
        processAccounts(account.SubAccounts);
      }
    });
  };

  processAccounts(accounts);
  balances.netBalance = balances.totalDebit - balances.totalCredit;
  
  return balances;
};

/**
 * Calculate balance for a single account based on normal balance type
 */
export const calculateAccountBalance = (account) => {
  const debit = account.debit || 0;
  const credit = account.credit || 0;
  
  // For normal debit accounts (Assets, Expenses), balance = debit - credit
  // For normal credit accounts (Liabilities, Equity, Revenue), balance = credit - debit
  if (account.normalBalance === 'DEBIT') {
    return debit - credit;
  } else {
    return credit - debit;
  }
};

/**
 * Format currency amount
 */
export const formatCurrency = (amount, options = {}) => {
  const {
    locale = 'id-ID',
    currency = 'IDR',
    minimumFractionDigits = 0,
    showSign = false
  } = options;

  const formattedAmount = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits
  }).format(Math.abs(amount));

  if (showSign && amount !== 0) {
    return amount > 0 ? `+${formattedAmount}` : `-${formattedAmount}`;
  }

  return formattedAmount;
};

/**
 * Get balance color based on amount and account type
 */
export const getBalanceColor = (balance, accountType) => {
  if (balance === 0) return '#FFFFFF';
  
  // For assets and expenses, positive balance is good (green)
  // For liabilities, equity, and revenue, positive balance is normal (green)
  return balance > 0 ? '#32D74B' : '#FF453A';
};

/**
 * Check if accounts are balanced (total debits = total credits)
 */
export const areAccountsBalanced = (totalBalances, tolerance = 0.01) => {
  return Math.abs(totalBalances.totalDebit - totalBalances.totalCredit) < tolerance;
};