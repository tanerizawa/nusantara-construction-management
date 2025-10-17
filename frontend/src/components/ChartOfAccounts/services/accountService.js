import axios from 'axios';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';

const { endpoints } = CHART_OF_ACCOUNTS_CONFIG;

/**
 * Fetch all accounts from the API in hierarchical structure
 */
export const fetchAccounts = async (forceRefresh = false, subsidiaryId = null) => {
  try {
    const params = {};
    if (forceRefresh) params.refresh = 'true';
    if (subsidiaryId) params.subsidiaryId = subsidiaryId;
    
    // Use hierarchy endpoint to get properly nested structure
    const response = await axios.get(endpoints.hierarchy, { params });
    return {
      success: true,
      data: response.data.data || response.data.accounts || [],
      message: response.data.message
    };
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.message || error.message || 'Failed to fetch accounts'
    };
  }
};

/**
 * Create a new account
 */
export const createAccount = async (accountData) => {
  try {
    const payload = {
      ...accountData,
      id: `COA-${Date.now()}` // Generate unique ID
    };
    
    const response = await axios.post(endpoints.accounts, payload);
    return {
      success: true,
      data: response.data,
      message: 'Account created successfully'
    };
  } catch (error) {
    console.error('Error creating account:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to create account'
    };
  }
};

/**
 * Update an existing account
 */
export const updateAccount = async (accountId, accountData) => {
  try {
    // Filter only allowed fields for update (exclude system fields)
    const allowedFields = {
      accountName: accountData.accountName,
      accountType: accountData.accountType,
      accountSubType: accountData.accountSubType,
      parentAccountId: accountData.parentAccountId || null,
      subsidiaryId: accountData.subsidiaryId || null,
      level: accountData.level,
      normalBalance: accountData.normalBalance,
      description: accountData.description || null,
      notes: accountData.notes || null,
      constructionSpecific: accountData.constructionSpecific || false,
      taxDeductible: accountData.taxDeductible || null,
      vatApplicable: accountData.vatApplicable || false,
      projectCostCenter: accountData.projectCostCenter || false
    };
    
    const response = await axios.put(`${endpoints.accounts}/${accountId}`, allowedFields);
    
    // Backend returns {success: true, data: {...updated account...}}
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data || response.data,  // Handle both response formats
        message: 'Account updated successfully'
      };
    } else {
      return {
        success: false,
        error: response.data?.error || 'Failed to update account'
      };
    }
  } catch (error) {
    console.error('Error updating account:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to update account'
    };
  }
};

/**
 * Delete an account
 */
export const deleteAccount = async (accountId) => {
  try {
    const response = await axios.delete(`${endpoints.accounts}/${accountId}`);
    
    // Backend returns {success: true, data: {...}}
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Account deleted successfully'
      };
    } else {
      return {
        success: false,
        error: response.data?.error || 'Failed to delete account'
      };
    }
  } catch (error) {
    console.error('Error deleting account:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to delete account'
    };
  }
};

/**
 * Get account by ID
 */
export const getAccountById = async (accountId) => {
  try {
    const response = await axios.get(`${endpoints.accounts}/${accountId}`);
    
    // Backend returns {success: true, data: {...account...}}
    // axios wraps it in response.data
    // So response.data = {success: true, data: {...account...}}
    
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data,  // Extract nested data
        message: 'Account retrieved successfully'
      };
    } else {
      return {
        success: false,
        error: response.data?.error || 'Failed to fetch account'
      };
    }
  } catch (error) {
    console.error('Error fetching account:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to fetch account'
    };
  }
};