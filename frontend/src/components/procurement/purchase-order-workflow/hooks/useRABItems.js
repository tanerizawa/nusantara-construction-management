import { useState, useEffect } from 'react';
import { fetchRABItems } from '../services/poAPI';

/**
 * Custom hook for managing RAB items
 */
export const useRABItems = () => {
  const [rabItems, setRABItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRABItems = async (projectId) => {
    if (!projectId) {
      setRABItems([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchRABItems(projectId);
      
      if (result.success) {
        setRABItems(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error loading RAB items:', error);
      setError(error.message);
      setRABItems([]);
    } finally {
      setLoading(false);
    }
  };

  const clearRABItems = () => {
    setRABItems([]);
    setError(null);
  };

  return {
    rabItems,
    loading,
    error,
    loadRABItems,
    clearRABItems
  };
};