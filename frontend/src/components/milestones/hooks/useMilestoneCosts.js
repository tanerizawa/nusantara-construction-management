// Hook for managing milestone costs
import { useState, useEffect, useCallback } from 'react';
import { milestoneDetailAPI } from '../services/milestoneDetailAPI';

export const useMilestoneCosts = (projectId, milestoneId) => {
  const [costs, setCosts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load costs
  const loadCosts = useCallback(async (filter = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await milestoneDetailAPI.getCosts(projectId, milestoneId, filter);
      setCosts(response.data || []);
    } catch (err) {
      console.error('Error loading costs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, milestoneId]);

  // Load cost summary
  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await milestoneDetailAPI.getCostSummary(projectId, milestoneId);
      setSummary(response.data || null);
    } catch (err) {
      console.error('Error loading cost summary:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, milestoneId]);

  // Add cost
  const addCost = async (costData) => {
    setError(null);
    try {
      const response = await milestoneDetailAPI.addCost(projectId, milestoneId, costData);
      await loadCosts(); // Reload costs
      await loadSummary(); // Reload summary
      return response.data;
    } catch (err) {
      console.error('Error adding cost:', err);
      setError(err.message);
      throw err;
    }
  };

  // Update cost
  const updateCost = async (costId, costData) => {
    setError(null);
    try {
      const response = await milestoneDetailAPI.updateCost(projectId, milestoneId, costId, costData);
      await loadCosts(); // Reload costs
      await loadSummary(); // Reload summary
      return response.data;
    } catch (err) {
      console.error('Error updating cost:', err);
      setError(err.message);
      throw err;
    }
  };

  // Delete cost
  const deleteCost = async (costId) => {
    try {
      await milestoneDetailAPI.deleteCost(projectId, milestoneId, costId);
      setCosts(prev => prev.filter(c => c.id !== costId));
      await loadSummary(); // Reload summary
    } catch (err) {
      console.error('Error deleting cost:', err);
      setError(err.message);
      throw err;
    }
  };

  // Initial load
  useEffect(() => {
    if (projectId && milestoneId) {
      loadCosts();
      loadSummary();
    }
  }, [projectId, milestoneId, loadCosts, loadSummary]);

  return {
    costs,
    summary,
    loading,
    error,
    loadCosts,
    loadSummary,
    addCost,
    updateCost,
    deleteCost
  };
};
