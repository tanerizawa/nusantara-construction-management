/**
 * Purchase Order API Service
 * Handles all PO-related API calls
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

/**
 * Get authentication token
 */
const getAuthToken = () => localStorage.getItem('token');

/**
 * Get common headers for API requests
 */
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

/**
 * Fetch all purchase orders
 */
export const fetchPurchaseOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/purchase-orders`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch purchase orders');
    }

    const data = await response.json();
    return { success: true, data: data.data || [] };
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Fetch all projects
 */
export const fetchProjects = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    const data = await response.json();
    return { success: true, data: data.data || [] };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Fetch RAB items for a project
 */
export const fetchRABItems = async (projectId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/rab`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch RAB items');
    }

    const data = await response.json();
    // Filter for approved items only
    const approvedItems = data.data?.filter(item => item.isApproved) || [];
    return { success: true, data: approvedItems };
  } catch (error) {
    console.error('Error fetching RAB items:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Create a new purchase order
 */
export const createPurchaseOrder = async (poData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/purchase-orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(poData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create purchase order');
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error creating purchase order:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update purchase order status
 */
export const updatePurchaseOrderStatus = async (poId, status, notes = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/purchase-orders/${poId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, notes })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update purchase order status');
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error updating purchase order status:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete purchase order
 */
export const deletePurchaseOrder = async (poId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/purchase-orders/${poId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete purchase order');
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting purchase order:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get purchase order by ID
 */
export const getPurchaseOrderById = async (poId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/purchase-orders/${poId}`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch purchase order details');
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error fetching purchase order details:', error);
    return { success: false, error: error.message, data: null };
  }
};