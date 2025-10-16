/**
 * Count total accounts including sub accounts recursively
 */
export const getTotalAccountCount = (accounts) => {
  let count = 0;
  accounts.forEach(account => {
    count += 1; // Count current account
    if (account.SubAccounts && account.SubAccounts.length > 0) {
      count += getTotalAccountCount(account.SubAccounts); // Recursively count sub accounts
    }
  });
  return count;
};

/**
 * Count accounts by type including sub accounts
 */
export const getAccountCountByType = (accounts, targetType) => {
  const countSubAccounts = (accountsList) => {
    return accountsList.reduce((count, account) => {
      if (account.accountType === targetType) count++;
      if (account.SubAccounts) {
        count += countSubAccounts(account.SubAccounts);
      }
      return count;
    }, 0);
  };

  return countSubAccounts(accounts);
};

/**
 * Filter accounts based on search term and type
 */
export const filterAccounts = (accounts, searchTerm, filterType) => {
  const normalizedSearchTerm = searchTerm.toLowerCase();
  
  return accounts.filter(account => {
    const matchesSearch = searchTerm === '' || 
      account.accountName.toLowerCase().includes(normalizedSearchTerm) ||
      account.accountCode.toLowerCase().includes(normalizedSearchTerm);
    
    const matchesType = filterType === '' || account.accountType === filterType;
    
    return matchesSearch && matchesType;
  });
};

/**
 * Find account by ID recursively
 */
export const findAccountById = (accounts, targetId) => {
  for (const account of accounts) {
    if (account.id === targetId) {
      return account;
    }
    
    if (account.SubAccounts && account.SubAccounts.length > 0) {
      const found = findAccountById(account.SubAccounts, targetId);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Get account hierarchy path (breadcrumb)
 */
export const getAccountPath = (accounts, targetId) => {
  const findPath = (accountsList, targetId, currentPath = []) => {
    for (const account of accountsList) {
      const newPath = [...currentPath, account];
      
      if (account.id === targetId) {
        return newPath;
      }
      
      if (account.SubAccounts && account.SubAccounts.length > 0) {
        const foundPath = findPath(account.SubAccounts, targetId, newPath);
        if (foundPath) return foundPath;
      }
    }
    return null;
  };

  return findPath(accounts, targetId);
};

/**
 * Check if account has sub accounts
 */
export const hasSubAccounts = (account) => {
  return account.SubAccounts && account.SubAccounts.length > 0;
};

/**
 * Get eligible parent accounts (level < 4)
 */
export const getEligibleParentAccounts = (accounts, maxLevel = 4) => {
  const eligibleAccounts = [];
  
  const processAccounts = (accountsList) => {
    accountsList.forEach(account => {
      if (account.level < maxLevel) {
        eligibleAccounts.push(account);
      }
      
      if (account.SubAccounts && account.SubAccounts.length > 0) {
        processAccounts(account.SubAccounts);
      }
    });
  };

  processAccounts(accounts);
  return eligibleAccounts;
};

/**
 * Validate account code uniqueness
 */
export const isAccountCodeUnique = (accounts, accountCode, excludeId = null) => {
  const checkCodeInAccounts = (accountsList) => {
    for (const account of accountsList) {
      if (account.id !== excludeId && account.accountCode === accountCode) {
        return false;
      }
      
      if (account.SubAccounts && account.SubAccounts.length > 0) {
        if (!checkCodeInAccounts(account.SubAccounts)) {
          return false;
        }
      }
    }
    return true;
  };

  return checkCodeInAccounts(accounts);
};

/**
 * Sort accounts by account code
 */
export const sortAccountsByCode = (accounts) => {
  return [...accounts].sort((a, b) => {
    // Extract numeric part from account code for proper sorting
    const aCode = a.accountCode.replace(/\D/g, '');
    const bCode = b.accountCode.replace(/\D/g, '');
    
    if (aCode && bCode) {
      return parseInt(aCode) - parseInt(bCode);
    }
    
    // Fallback to string comparison
    return a.accountCode.localeCompare(b.accountCode);
  });
};

/**
 * Generate next account code suggestion
 */
export const generateNextAccountCode = (accounts, parentAccountCode) => {
  if (!parentAccountCode) {
    // Find the highest root-level code
    const rootCodes = accounts
      .map(account => parseInt(account.accountCode.replace(/\D/g, '')))
      .filter(code => !isNaN(code))
      .sort((a, b) => b - a);
    
    const nextCode = rootCodes.length > 0 ? rootCodes[0] + 1 : 1000;
    return nextCode.toString();
  }
  
  // Find the highest sub-account code under the parent
  const parent = findAccountById(accounts, parentAccountCode);
  if (!parent || !parent.SubAccounts) {
    return `${parentAccountCode}01`;
  }
  
  const subCodes = parent.SubAccounts
    .map(account => {
      const code = account.accountCode.replace(parentAccountCode, '');
      return parseInt(code);
    })
    .filter(code => !isNaN(code))
    .sort((a, b) => b - a);
  
  const nextSubCode = subCodes.length > 0 ? subCodes[0] + 1 : 1;
  return `${parentAccountCode}${nextSubCode.toString().padStart(2, '0')}`;
};