import { useState, useEffect, useCallback, useMemo } from 'react';
import { projectAPI } from '../services/api';

/**
 * Custom hook for       progress: { percentage: 40 },
      budget: { 
        contractValue: 8500000000,
        spent: 3400000000,
        remaining: 5100000000
      },
      timeline: { 
        startDate: "2024-03-01", 
        endDate: "2024-09-30",
        estimatedCompletion: "2024-09-15"
      },
      team: {
        projectManager: "Eng. Mariana",
        contractor: "PT. Perumahan Sejahtera",
        workers: 35
      },
      createdAt: "2024-05-15T13:20:00Z",
      updatedAt: "2024-08-10T16:10:00Z"
    },
    {
      id: "PRJ003",
      projectCode: "YK-2024-003",
      name: "Proyek Infrastruktur Jalan Raya",
      description: "Pembangunan jalan raya sepanjang 15 km dengan jembatan dan fasilitas pendukung",
      client: { 
        company: "Dinas Pekerjaan Umum",
        contact: "Ir. Ahmad Fauzi",
        email: "ahmad@pu.go.id",
        phone: "+62 21 5556789"
      },
      location: { 
        city: "Bandung", 
        province: "Jawa Barat",
        address: "Jalur Utama Bandung-Cimahi"
      },
      status: "planning",
      priority: "high",
      progress: { percentage: 10 },
      budget: { 
        contractValue: 25000000000,
        spent: 2500000000,
        remaining: 22500000000
      },
      timeline: { 
        startDate: "2024-10-01", 
        endDate: "2025-06-30",
        estimatedCompletion: "2025-06-15"
      },
      team: {
        projectManager: "Eng. Bambang",
        contractor: "PT. Infrastruktur Nusantara",
        workers: 120
      },
      createdAt: "2024-08-01T09:15:00Z",
      updatedAt: "2024-08-20T11:45:00Z"
    },
    {
      id: "PRJ004",
      projectCode: "YK-2024-004",
      name: "Renovasi Gedung Sekolah Dasar",
      description: "Renovasi total 3 gedung sekolah dasar termasuk penambahan fasilitas modern",
      client: { 
        company: "Dinas Pendidikan Kota",
        contact: "Dra. Siti Nurhaliza",
        email: "siti@diknas.go.id",
        phone: "+62 21 4445678"
      },
      location: { 
        city: "Bekasi", 
        province: "Jawa Barat",
        address: "Komplek Sekolah Terpadu Bekasi"
      },
      status: "completed",
      priority: "medium", * Handles data fetching, caching, and state management following React best practices
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

  // Mock data fallback - Updated to match database structure
  const mockProjects = useMemo(() => [
    {
      id: "PRJ001",
      projectCode: "YK-2024-001",
      name: "Pembangunan Gedung Perkantoran PT. Maju Bersama",
      description: "Pembangunan gedung perkantoran 10 lantai dengan luas total 5000 m² di Jakarta Selatan",
      client: { 
        company: "PT. Maju Bersama",
        contact: "Budi Santoso",
        email: "budi@majubersama.com",
        phone: "+62 21 1234567"
      },
      location: { 
        city: "Jakarta Selatan", 
        province: "DKI Jakarta",
        address: "Jl. Sudirman No. 123"
      },
      status: "active",
      priority: "high",
      progress: { percentage: 65 },
      budget: { 
        contractValue: 15000000000,
        spent: 9750000000,
        remaining: 5250000000
      },
      timeline: { 
        startDate: "2024-01-15", 
        endDate: "2024-12-15",
        estimatedCompletion: "2024-11-30"
      },
      team: {
        projectManager: "Eng. Suryanto",
        contractor: "PT. Bangun Jaya",
        workers: 45
      },
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2024-08-15T14:30:00Z"
    },
    {
      id: "PRJ002",
      projectCode: "YK-2024-002",
      name: "Renovasi Pabrik PT. Industri Jaya",
      description: "Renovasi dan ekspansi pabrik tekstil dengan penambahan area produksi seluas 2000 m²",
      client: { 
        company: "PT. Industri Jaya",
        contact: "Sari Dewi",
        email: "sari@industrijaya.com",
        phone: "+62 251 987654"
      },
      location: { 
        city: "Bogor", 
        province: "Jawa Barat",
        address: "Kawasan Industri Bogor, Blok A-15"
      },
      status: "active",
      priority: "medium",
      progress: { percentage: 45 },
      budget: { 
        contractValue: 8500000000,
        spent: 3825000000,
        remaining: 4675000000
      },
      timeline: { 
        startDate: "2024-03-01", 
        endDate: "2024-10-31",
        estimatedCompletion: "2024-10-15"
      },
      team: {
        projectManager: "Eng. Wahyudi",
        contractor: "PT. Renovasi Prima",
        workers: 28
      },
      createdAt: "2024-02-20T09:15:00Z",
      updatedAt: "2024-08-12T11:45:00Z"
    },
    {
      id: "PRJ003",
      projectCode: "YK-2024-003",
      name: "Pembangunan Perumahan Green Valley",
      description: "Pembangunan kompleks perumahan eksklusif dengan 50 unit rumah dan fasilitas lengkap",
      client: { 
        company: "PT. Green Valley Developer",
        contact: "Ahmad Hidayat",
        email: "ahmad@greenvalley.com",
        phone: "+62 21 5551234"
      },
      location: { 
        city: "Tangerang", 
        province: "Banten",
        address: "Serpong, Tangerang Selatan"
      },
      status: "planning",
      priority: "high",
      progress: { percentage: 15 },
      budget: { 
        contractValue: 25000000000,
        spent: 3750000000,
        remaining: 21250000000
      },
      timeline: { 
        startDate: "2024-06-01", 
        endDate: "2025-06-01",
        estimatedCompletion: "2025-05-15"
      },
      team: {
        projectManager: "Eng. Mariana",
        contractor: "PT. Perumahan Sejahtera",
        workers: 35
      },
      createdAt: "2024-05-15T13:20:00Z",
      updatedAt: "2024-08-10T16:10:00Z"
    }
  ], []);

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

  // Auto-refresh effect
  useEffect(() => {
    if (enableAutoRefresh) {
      const interval = setInterval(fetchProjects, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [enableAutoRefresh, refreshInterval, fetchProjects]);

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
