import { useState, useEffect, useCallback, useMemo } from 'react';
import { projectAPI } from '../services/api';

/**
 * useProjects Hook
 * 
 * Professional custom hook for managing project data with React best practices.
 * Handles data fetching, caching, filtering, pagination, and state management.
 * 
 * Features:
 * - Automatic data fetching with loading states
 * - Comprehensive error handling
 * - Optimistic updates for delete/archive operations
 * - Real-time statistics calculation
 * - Advanced filtering and sorting
 * - Pagination support
 * - Auto-refresh capability
 * 
 * @param {Object} options - Hook configuration options
 * @param {number} options.initialPageSize - Initial page size (default: 12)
 * @param {boolean} options.enableAutoRefresh - Enable automatic refresh (default: false)
 * @param {number} options.refreshInterval - Refresh interval in ms (default: 30000)
 * 
 * @returns {Object} Project state and actions
 */
export const useProjects = (options = {}) => {
  const {
    initialPageSize = 12,
    enableAutoRefresh = false,
    refreshInterval = 30000
  } = options;

  // State management
  const [state, setState] = useState({
    projects: [],
    allProjects: [], // Store all projects for stats calculation
    loading: true,
    error: null,
    page: 1,
    pageSize: initialPageSize,
    serverPagination: { current: 1, total: 1, count: 0 },
    category: 'all', // Add category filter
    filters: {
      status: '',
      priority: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    }
  });

  // Optimized state updater
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Update filters with proper state management
  const updateFilters = useCallback((newFilters) => {
    updateState({
      filters: { ...state.filters, ...newFilters },
      page: 1 // Reset to first page when filters change
    });
  }, [state.filters, updateState]);

  // Enhanced fetch function with proper error handling
  const fetchProjects = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });

      const params = {
        status: state.filters.status || undefined,
        priority: state.filters.priority || undefined,
        sort: state.filters.sortBy,
        order: state.filters.sortOrder,
        limit: state.pageSize,
        page: state.page
      };

      console.log('🚀 FETCHING PROJECTS WITH PARAMS:', params);

      // Fetch both filtered projects and all projects for stats
      const [response, allProjectsResponse] = await Promise.all([
        projectAPI.getAll(params),
        projectAPI.getAll({ limit: 1000 }) // Get all projects for stats calculation
      ]);

      console.log('🎯 REAL API RESPONSE:', response);
      console.log('📊 ALL PROJECTS RESPONSE:', allProjectsResponse);

      const data = response.data || response || []; // Handle different response structures
      const allProjects = allProjectsResponse.data || allProjectsResponse || [];
      const pagination = response.pagination || { 
        current: state.page, 
        total: Math.ceil((data.length || 0) / state.pageSize), 
        count: data.length || 0
      };

      updateState({
        projects: data,
        allProjects: allProjects, // Store all projects for stats
        serverPagination: {
          current: parseInt(pagination.current || 1, 10),
          total: parseInt(pagination.total || 1, 10),
          count: parseInt(pagination.count || data.length || 0, 10)
        },
        loading: false
      });

    } catch (error) {
      console.error('❌ API ERROR:', error);
      updateState({
        loading: false,
        error: `Failed to load projects: ${error.message}. Please check your connection and try again.`
      });
    }
  }, [state.filters, state.category, state.page, state.pageSize, updateState]);

  // Delete project with optimistic updates
  const deleteProject = useCallback(async (projectId) => {
    const originalProjects = state.projects;
    
    try {
      // Optimistic update
      updateState({
        projects: state.projects.filter(p => p.id !== projectId)
      });

      await projectAPI.delete(projectId);
      
      // Refresh data to ensure consistency
      await fetchProjects();
      
      return { success: true };
    } catch (error) {
      // Revert optimistic update on error
      updateState({ projects: originalProjects });
      throw error;
    }
  }, [state.projects, updateState, fetchProjects]);

  // Archive project
  const archiveProject = useCallback(async (projectId) => {
    const originalProjects = state.projects;
    
    try {
      // Optimistic update
      updateState({
        projects: state.projects.map(p => 
          p.id === projectId ? { ...p, status: 'archived' } : p
        )
      });

      await projectAPI.update(projectId, { status: 'archived' });
      await fetchProjects();
      
      return { success: true };
    } catch (error) {
      updateState({ projects: originalProjects });
      throw error;
    }
  }, [state.projects, updateState, fetchProjects]);

  // Auto-refresh removed to save resources
  // Users can manually refresh using the refresh button

  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Computed values including stats
  const computedValues = useMemo(() => {
    // Calculate real-time stats from all project data (not filtered)
    const currentDate = new Date();
    const projectsForStats = state.allProjects.length > 0 ? state.allProjects : state.projects;
    
    const stats = {
      total: projectsForStats.length,
      active: projectsForStats.filter(p => p.status === 'active').length,
      completed: projectsForStats.filter(p => p.status === 'completed').length,
      planning: projectsForStats.filter(p => p.status === 'planning').length,
      onHold: projectsForStats.filter(p => p.status === 'on_hold').length,
      cancelled: projectsForStats.filter(p => p.status === 'cancelled').length,
      archived: projectsForStats.filter(p => p.status === 'archived').length,
      overdue: projectsForStats.filter(p => {
        if (p.status === 'completed') return false;
        const endDate = new Date(p.timeline?.endDate || p.endDate);
        return endDate < currentDate;
      }).length
    };

    return {
      hasProjects: state.projects.length > 0,
      totalPages: Math.ceil(state.serverPagination.count / state.pageSize),
      isFirstPage: state.page === 1,
      isLastPage: state.page >= Math.ceil(state.serverPagination.count / state.pageSize),
      hasFilters: state.filters.status || state.filters.priority,
      isEmpty: !state.loading && state.projects.length === 0,
      stats
    };
  }, [state.projects, state.allProjects, state.loading, state.page, state.pageSize, state.serverPagination, state.filters]);

  return {
    // State
    ...state,
    ...computedValues,
    
    // Actions
    updateFilters,
    setPage: (page) => updateState({ page }),
    setPageSize: (pageSize) => updateState({ pageSize, page: 1 }),
    setCategory: (category) => updateState({ category, page: 1 }),
    setSorting: (sortBy, sortOrder) => updateState({ 
      filters: { ...state.filters, sortBy, sortOrder },
      page: 1 
    }),
    refreshProjects: fetchProjects,
    refetch: fetchProjects,
    deleteProject,
    archiveProject,
    
    // Utils
    resetFilters: () => updateFilters({
      status: '',
      priority: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    })
  };
};

export default useProjects;
