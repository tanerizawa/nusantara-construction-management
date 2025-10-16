import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing Work Orders
 * Handles CRUD operations for work orders
 */
export const useWorkOrders = (projectId) => {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all work orders for a project
   */
  const fetchWorkOrders = useCallback(async () => {
    if (!projectId) {
      console.warn('[useWorkOrders] No projectId provided');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('[useWorkOrders] Fetching work orders for project:', projectId);
      
      const response = await fetch(`/api/projects/${projectId}/work-orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('[useWorkOrders] Fetch result:', result);

      if (result.success) {
        setWorkOrders(result.data || []);
      } else {
        throw new Error(result.error || 'Failed to fetch work orders');
      }
    } catch (err) {
      console.error('[useWorkOrders] Fetch error:', err);
      setError(err.message);
      // Set empty array on error to avoid undefined issues
      setWorkOrders([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  /**
   * Create new work order
   */
  const createWorkOrder = useCallback(async (woData) => {
    if (!projectId) {
      return { success: false, error: 'Project ID is required' };
    }

    try {
      setLoading(true);
      
      console.log('[useWorkOrders] Creating work order:', woData);
      
      const response = await fetch(`/api/projects/${projectId}/work-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(woData)
      });

      const result = await response.json();
      console.log('[useWorkOrders] Create result:', result);

      if (result.success) {
        // Add new WO to local state
        setWorkOrders(prev => [result.data, ...prev]);
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error || 'Failed to create work order' };
      }
    } catch (err) {
      console.error('[useWorkOrders] Create error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  /**
   * Update work order
   */
  const updateWorkOrder = useCallback(async (woId, updates) => {
    try {
      setLoading(true);
      
      console.log('[useWorkOrders] Updating work order:', woId, updates);
      
      const response = await fetch(`/api/projects/${projectId}/work-orders/${woId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(updates)
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setWorkOrders(prev => 
          prev.map(wo => wo.id === woId ? { ...wo, ...result.data } : wo)
        );
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error || 'Failed to update work order' };
      }
    } catch (err) {
      console.error('[useWorkOrders] Update error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  /**
   * Delete work order
   */
  const deleteWorkOrder = useCallback(async (woId) => {
    try {
      setLoading(true);
      
      console.log('[useWorkOrders] Deleting work order:', woId);
      
      const response = await fetch(`/api/projects/${projectId}/work-orders/${woId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      const result = await response.json();

      if (result.success) {
        // Remove from local state
        setWorkOrders(prev => prev.filter(wo => wo.id !== woId));
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Failed to delete work order' };
      }
    } catch (err) {
      console.error('[useWorkOrders] Delete error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Fetch work orders on mount
  useEffect(() => {
    if (projectId) {
      fetchWorkOrders();
    }
  }, [projectId, fetchWorkOrders]);

  return {
    workOrders,
    loading,
    error,
    fetchWorkOrders,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder
  };
};
