import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';

/**
 * Custom Hook: useRABItems
 * 
 * Fetches and manages RAB (Rencana Anggaran Biaya) items linked to a milestone,
 * with actual cost summary and variance tracking.
 * 
 * @param {string} projectId - Project ID
 * @param {string} milestoneId - Milestone ID
 * @returns {Object} RAB items data and control functions
 */
export const useRABItems = (projectId, milestoneId) => {
  const [rabItems, setRABItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load RAB items with actual cost summary
   */
  const loadRABItems = useCallback(async () => {
    if (!projectId || !milestoneId) {
      console.log('[useRABItems] Missing projectId or milestoneId');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`[useRABItems] Fetching RAB items for milestone ${milestoneId}...`);
      
      const response = await api.get(
        `/projects/${projectId}/milestones/${milestoneId}/rab-items`
      );

      if (response.data.success) {
        console.log(`[useRABItems] Loaded ${response.data.data.length} RAB items`);
        setRABItems(response.data.data);
        setSummary(response.data.summary);
      } else {
        throw new Error(response.data.error || 'Failed to load RAB items');
      }
    } catch (err) {
      console.error('[useRABItems] Error loading RAB items:', err);
      setError(err.response?.data?.error || err.message);
      setRABItems([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [projectId, milestoneId]);

  /**
   * Get realization entries for specific RAB item
   * 
   * @param {string} rabItemId - RAB item ID
   * @returns {Promise<Array>} Array of realization cost entries
   */
  const getRealizations = useCallback(async (rabItemId) => {
    if (!projectId || !milestoneId || !rabItemId) {
      return [];
    }

    try {
      console.log(`[useRABItems] Fetching realizations for RAB item ${rabItemId}...`);
      
      const response = await api.get(
        `/projects/${projectId}/milestones/${milestoneId}/rab-items/${rabItemId}/realizations`
      );

      if (response.data.success) {
        console.log(`[useRABItems] Loaded ${response.data.count} realizations`);
        return response.data.data;
      }
      
      return [];
    } catch (err) {
      console.error('[useRABItems] Error loading realizations:', err);
      return [];
    }
  }, [projectId, milestoneId]);

  /**
   * Get single RAB item by ID from current loaded items
   * 
   * @param {string} rabItemId - RAB item ID
   * @returns {Object|null} RAB item or null
   */
  const getRABItem = useCallback((rabItemId) => {
    return rabItems.find(item => item.id === rabItemId) || null;
  }, [rabItems]);

  /**
   * Get RAB items by status
   * 
   * @param {string} status - Status: 'not_started', 'in_progress', 'completed', 'over_budget'
   * @returns {Array} Filtered RAB items
   */
  const getItemsByStatus = useCallback((status) => {
    return rabItems.filter(item => item.realization_status === status);
  }, [rabItems]);

  /**
   * Calculate completion percentage across all RAB items
   * 
   * @returns {number} Overall completion percentage (0-100)
   */
  const getOverallProgress = useCallback(() => {
    if (rabItems.length === 0) return 0;
    
    const totalProgress = rabItems.reduce((sum, item) => sum + item.progress_percentage, 0);
    return (totalProgress / rabItems.length).toFixed(2);
  }, [rabItems]);

  // Auto-load on mount and when dependencies change
  useEffect(() => {
    loadRABItems();
  }, [loadRABItems]);

  return {
    // Data
    rabItems,
    summary,
    
    // State
    loading,
    error,
    
    // Functions
    refresh: loadRABItems,
    getRealizations,
    getRABItem,
    getItemsByStatus,
    getOverallProgress
  };
};

export default useRABItems;
