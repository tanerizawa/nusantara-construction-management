import axios from 'axios';
import { CHART_OF_ACCOUNTS_CONFIG } from '../config/chartOfAccountsConfig';

const { endpoints } = CHART_OF_ACCOUNTS_CONFIG;

/**
 * Fetch all subsidiaries from the API
 */
export const fetchSubsidiaries = async () => {
  try {
    const response = await axios.get(endpoints.subsidiaries);
    return {
      success: true,
      data: response.data.subsidiaries || [],
      message: response.data.message
    };
  } catch (error) {
    console.error('Error fetching subsidiaries:', error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.message || error.message || 'Failed to fetch subsidiaries'
    };
  }
};

/**
 * Create a new subsidiary
 */
export const createSubsidiary = async (subsidiaryData) => {
  try {
    const response = await axios.post(endpoints.subsidiaries, subsidiaryData);
    return {
      success: true,
      data: response.data,
      message: 'Subsidiary created successfully'
    };
  } catch (error) {
    console.error('Error creating subsidiary:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to create subsidiary'
    };
  }
};

/**
 * Update an existing subsidiary
 */
export const updateSubsidiary = async (subsidiaryId, subsidiaryData) => {
  try {
    const response = await axios.put(`${endpoints.subsidiaries}/${subsidiaryId}`, subsidiaryData);
    return {
      success: true,
      data: response.data,
      message: 'Subsidiary updated successfully'
    };
  } catch (error) {
    console.error('Error updating subsidiary:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to update subsidiary'
    };
  }
};

/**
 * Delete a subsidiary
 */
export const deleteSubsidiary = async (subsidiaryId) => {
  try {
    const response = await axios.delete(`${endpoints.subsidiaries}/${subsidiaryId}`);
    return {
      success: true,
      data: response.data,
      message: 'Subsidiary deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting subsidiary:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to delete subsidiary'
    };
  }
};

/**
 * Get subsidiary by ID
 */
export const getSubsidiaryById = async (subsidiaryId) => {
  try {
    const response = await axios.get(`${endpoints.subsidiaries}/${subsidiaryId}`);
    return {
      success: true,
      data: response.data,
      message: 'Subsidiary retrieved successfully'
    };
  } catch (error) {
    console.error('Error fetching subsidiary:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to fetch subsidiary'
    };
  }
};