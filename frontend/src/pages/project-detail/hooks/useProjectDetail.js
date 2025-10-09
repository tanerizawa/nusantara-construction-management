import { useEffect, useState, useCallback } from 'react';
import { projectAPI } from '../../../services/api';

/**
 * Custom hook untuk mengelola project detail data
 * Handles: fetching, loading, error states, data refresh
 */
export const useProjectDetail = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch project data with workflow information
  const fetchProject = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      console.log('=== FETCH PROJECT ===');
      console.log('Project ID from params:', projectId);

      // Fetch project data using correct method name
      const projectResponse = await projectAPI.getById(projectId);
      console.log('Project API Response:', projectResponse);
      const projectData = projectResponse.data;
      console.log('Project Data:', projectData);
      setProject(projectData);

    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Gagal memuat detail proyek');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Load on mount and when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId, fetchProject]);

  return {
    project,
    setProject,
    loading,
    error,
    fetchProject
  };
};
