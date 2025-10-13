// Hook for managing milestone activities
import { useState, useEffect, useCallback } from 'react';
import { milestoneDetailAPI } from '../services/milestoneDetailAPI';

export const useMilestoneActivities = (projectId, milestoneId) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Load activities
  const loadActivities = useCallback(async (filter = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await milestoneDetailAPI.getActivities(projectId, milestoneId, {
        limit: 20,
        ...filter
      });
      setActivities(response.data || []);
      setHasMore(response.data?.length >= 20);
    } catch (err) {
      console.error('Error loading activities:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, milestoneId]);

  // Load more activities (pagination)
  const loadMore = async (offset) => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    try {
      const response = await milestoneDetailAPI.getActivities(projectId, milestoneId, {
        limit: 20,
        offset
      });
      const newActivities = response.data || [];
      setActivities(prev => [...prev, ...newActivities]);
      setHasMore(newActivities.length >= 20);
    } catch (err) {
      console.error('Error loading more activities:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add manual activity
  const addActivity = async (activityData) => {
    setError(null);
    try {
      const response = await milestoneDetailAPI.addActivity(projectId, milestoneId, activityData);
      await loadActivities(); // Reload activities
      return response.data;
    } catch (err) {
      console.error('Error adding activity:', err);
      setError(err.message);
      throw err;
    }
  };

  // Initial load
  useEffect(() => {
    if (projectId && milestoneId) {
      loadActivities();
    }
  }, [projectId, milestoneId, loadActivities]);

  return {
    activities,
    loading,
    error,
    hasMore,
    loadActivities,
    loadMore,
    addActivity
  };
};
