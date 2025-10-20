import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';

/**
 * Custom hook for fetching dashboard summary data
 * @returns {Object} Dashboard summary data, loading state, error, and refresh function
 */
export const useDashboardSummary = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // api.get() already returns response.data, not the full axios response
      const response = await api.get('/dashboard/summary');
      
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard summary');
      }
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchSummary, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchSummary]);

  return {
    data,
    loading,
    error,
    refresh: fetchSummary
  };
};

export default useDashboardSummary;
