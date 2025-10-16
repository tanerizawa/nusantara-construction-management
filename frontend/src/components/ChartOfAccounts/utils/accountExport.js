import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';

/**
 * Flatten hierarchical accounts into a single array
 */
const flattenAccounts = (accounts, level = 0) => {
  let result = [];
  accounts.forEach(account => {
    result.push({
      ...account,
      level: level + 1
    });
    if (account.SubAccounts && account.SubAccounts.length > 0) {
      result = result.concat(flattenAccounts(account.SubAccounts, level + 1));
    }
  });
  return result;
};

/**
 * Generate CSV content from accounts data
 */
const generateCSVContent = (accounts) => {
  const { csvHeaders } = CHART_OF_ACCOUNTS_CONFIG.export;
  const allAccounts = flattenAccounts(accounts);
  
  const csvRows = allAccounts.map(account => [
    account.accountCode,
    `"${account.accountName}"`,
    account.accountType,
    account.accountSubType || '',
    account.level,
    account.normalBalance,
    account.constructionSpecific ? 'Yes' : 'No',
    account.projectCostCenter ? 'Yes' : 'No',
    account.vatApplicable ? 'Yes' : 'No',
    account.taxDeductible ? 'Yes' : 'No',
    `"${account.description || ''}"`,
    account.isActive ? 'Active' : 'Inactive'
  ].join(','));

  return [csvHeaders.join(','), ...csvRows].join('\n');
};

/**
 * Generate filename for export
 */
const generateFilename = (template) => {
  const date = new Date().toISOString().split('T')[0];
  return template.replace('{date}', date);
};

/**
 * Create and download CSV file
 */
const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Export Chart of Accounts to CSV
 */
export const exportAccountsToCSV = (accounts) => {
  try {
    const csvContent = generateCSVContent(accounts);
    const filename = generateFilename(CHART_OF_ACCOUNTS_CONFIG.export.filenameTemplate);
    
    downloadCSV(csvContent, filename);
    
    const allAccounts = flattenAccounts(accounts);
    console.log(`Exported ${allAccounts.length} accounts to CSV`);
    
    return {
      success: true,
      message: `Successfully exported ${allAccounts.length} accounts`,
      filename
    };
  } catch (error) {
    console.error('Error exporting COA:', error);
    return {
      success: false,
      error: 'Failed to export Chart of Accounts. Please try again.'
    };
  }
};

/**
 * Export selected accounts to CSV
 */
export const exportSelectedAccountsToCSV = (accounts, selectedAccountIds) => {
  try {
    const selectedAccounts = accounts.filter(account => 
      selectedAccountIds.includes(account.id)
    );
    
    if (selectedAccounts.length === 0) {
      return {
        success: false,
        error: 'No accounts selected for export'
      };
    }
    
    return exportAccountsToCSV(selectedAccounts);
  } catch (error) {
    console.error('Error exporting selected accounts:', error);
    return {
      success: false,
      error: 'Failed to export selected accounts. Please try again.'
    };
  }
};

/**
 * Export accounts by type to CSV
 */
export const exportAccountsByTypeToCSV = (accounts, accountType) => {
  try {
    const filteredAccounts = accounts.filter(account => 
      account.accountType === accountType
    );
    
    if (filteredAccounts.length === 0) {
      return {
        success: false,
        error: `No ${accountType} accounts found for export`
      };
    }
    
    const csvContent = generateCSVContent(filteredAccounts);
    const filename = `${accountType.toLowerCase()}-accounts-${new Date().toISOString().split('T')[0]}.csv`;
    
    downloadCSV(csvContent, filename);
    
    const allAccounts = flattenAccounts(filteredAccounts);
    console.log(`Exported ${allAccounts.length} ${accountType} accounts to CSV`);
    
    return {
      success: true,
      message: `Successfully exported ${allAccounts.length} ${accountType} accounts`,
      filename
    };
  } catch (error) {
    console.error('Error exporting accounts by type:', error);
    return {
      success: false,
      error: 'Failed to export accounts by type. Please try again.'
    };
  }
};