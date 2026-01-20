import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook untuk mengelola data budget monitoring
 */
export const useBudgetData = (projectId, timeframe) => {
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBudgetData = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `/api/projects/${projectId}/budget-monitoring?timeframe=${timeframe}`, 
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBudgetData(data.data);
      } else {
        throw new Error('Failed to fetch budget data');
      }
    } catch (error) {
      console.error('Error fetching budget data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, timeframe]);

  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  const refreshData = useCallback(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  return {
    budgetData,
    loading,
    error,
    refreshData
  };
};
