import axios from 'axios';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';

const { endpoints } = CHART_OF_ACCOUNTS_CONFIG;

/**
 * Fetch all accounts from the API
 */
export const fetchAccounts = async (forceRefresh = false) => {
  try {
    const params = forceRefresh ? { refresh: 'true' } : {};
    const response = await axios.get(endpoints.accounts, { params });
    return {
      success: true,
      data: response.data.accounts || [],
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
    const response = await axios.put(`${endpoints.accounts}/${accountId}`, accountData);
    return {
      success: true,
      data: response.data,
      message: 'Account updated successfully'
    };
  } catch (error) {
    console.error('Error updating account:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to update account'
    };
  }
};

/**
 * Delete an account
 */
export const deleteAccount = async (accountId) => {
  try {
    const response = await axios.delete(`${endpoints.accounts}/${accountId}`);
    return {
      success: true,
      data: response.data,
      message: 'Account deleted successfully'
    };
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
    return {
      success: true,
      data: response.data,
      message: 'Account retrieved successfully'
    };
  } catch (error) {
    console.error('Error fetching account:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to fetch account'
    };
  }
};