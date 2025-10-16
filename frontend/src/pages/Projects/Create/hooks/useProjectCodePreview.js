import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../../../../services/api';

/**
 * Custom hook for project code preview
 * @param {string} subsidiaryCode - Selected subsidiary code
 * @returns {Object} Code preview state and functions
 */
const useProjectCodePreview = (subsidiaryCode) => {
  const [projectCodePreview, setProjectCodePreview] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);

  /**
   * Fetch project code preview from API
   */
  const fetchProjectCodePreview = useCallback(async (code) => {
    if (!code || code.length !== 3) {
      setProjectCodePreview('');
      return;
    }

    try {
      setLoadingPreview(true);
      const response = await apiClient.get(`/projects/preview-code/${code}`);
      const data = response.data;
      
      if (data.success) {
        setProjectCodePreview(data.data.nextProjectCode);
      } else {
        console.error('Failed to fetch code preview:', data.error);
        setProjectCodePreview('');
      }
    } catch (error) {
      console.error('Error fetching code preview:', error);
      setProjectCodePreview('');
    } finally {
      setLoadingPreview(false);
    }
  }, []);

  /**
   * Clear code preview
   */
  const clearCodePreview = useCallback(() => {
    setProjectCodePreview('');
  }, []);

  // Auto-fetch when subsidiary code changes
  useEffect(() => {
    if (subsidiaryCode) {
      fetchProjectCodePreview(subsidiaryCode);
    } else {
      clearCodePreview();
    }
  }, [subsidiaryCode, fetchProjectCodePreview, clearCodePreview]);

  return {
    projectCodePreview,
    loadingPreview,
    fetchProjectCodePreview,
    clearCodePreview
  };
};

export default useProjectCodePreview;
