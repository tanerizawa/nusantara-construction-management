import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../../../../../utils/toast';

/**
 * Custom hook for fetching comprehensive budget validation data
 * @param {string} projectId - Project ID
 * @param {object} options - Configuration options
 * @returns {object} Budget data and state
 */
const useBudgetData = (projectId, options = {}) => {
  const {
    autoRefresh = false,
    refreshInterval = 30000, // 30 seconds
    onSuccess = null,
    onError = null
  } = options;

  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  /**
   * Fetch comprehensive budget data from API
   */
  const fetchBudgetData = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError(null);

      const response = await axios.get(
        `/api/projects/${projectId}/budget-validation`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setBudgetData(response.data.data);
        setLastUpdated(new Date());
        
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    } catch (err) {
      console.error('Error fetching budget data:', err);
      const errorMessage = err.response?.data?.message || 'Gagal mengambil data validasi anggaran';
      setError(errorMessage);
      
      if (!silent) {
        showErrorToast(errorMessage);
      }

      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [projectId, onSuccess, onError]);

  /**
   * Fetch quick summary only (lighter request)
   */
  const fetchSummary = useCallback(async () => {
    try {
      const response = await axios.get(
        `/api/projects/${projectId}/budget-validation/summary`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        // Update only the summary part
        setBudgetData(prev => ({
          ...prev,
          summary: response.data.data.summary
        }));
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Error fetching budget summary:', err);
    }
  }, [projectId]);

  /**
   * Refresh data manually
   */
  const refresh = useCallback(() => {
    fetchBudgetData(false);
  }, [fetchBudgetData]);

  /**
   * Refresh data silently (no loading state)
   */
  const refreshSilent = useCallback(() => {
    fetchBudgetData(true);
  }, [fetchBudgetData]);

  // Initial fetch
  useEffect(() => {
    if (projectId) {
      fetchBudgetData();
    }
  }, [projectId, fetchBudgetData]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !projectId) return;

    const intervalId = setInterval(() => {
      fetchSummary(); // Use lighter summary endpoint for auto-refresh
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, projectId, fetchSummary]);

  return {
    budgetData,
    loading,
    error,
    lastUpdated,
    refresh,
    refreshSilent,
    fetchSummary,
    
    // Computed properties for easy access
    summary: budgetData?.summary || null,
    rabItems: budgetData?.rabItems || [],
    categoryBreakdown: budgetData?.categoryBreakdown || [],
    additionalExpenses: budgetData?.additionalExpenses || [],
    timeSeriesData: budgetData?.timeSeriesData || [],
    
    // Helper functions
    isOverBudget: budgetData?.summary?.variance > 0,
    isHealthy: budgetData?.summary?.budgetHealth?.status === 'healthy',
    progressPercent: budgetData?.summary?.progress || 0,
  };
};

export default useBudgetData;
