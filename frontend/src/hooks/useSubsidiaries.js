import { useState, useEffect, useCallback, useMemo } from 'react';
import { subsidiaryAPI } from '../services/api';

/**
 * Professional Subsidiary Data Hook
 * Provides cached and optimized subsidiary data management
 */
const useSubsidiaries = (options = {}) => {
  const {
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000, // 5 minutes
    includeStats = false,
    filterBy = null // { specialization: 'commercial', status: 'active' }
  } = options;

  // State management
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [stats, setStats] = useState(null);

  // Fetch subsidiaries with error handling and retries
  const fetchSubsidiaries = useCallback(async (retryCount = 0) => {
    const maxRetries = 3;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await subsidiaryAPI.getAll();
      
      if (response.success) {
        setSubsidiaries(response.data || []);
        setLastRefresh(new Date());
        
        // Fetch stats if requested
        if (includeStats) {
          try {
            const statsResponse = await subsidiaryAPI.getStats();
            if (statsResponse.success) {
              setStats(statsResponse.data);
            }
          } catch (statsError) {
            console.warn('Failed to fetch subsidiary stats:', statsError);
          }
        }
      } else {
        throw new Error(response.message || 'Failed to fetch subsidiaries');
      }
    } catch (err) {
      console.error('Error fetching subsidiaries:', err);
      
      // Retry logic
      if (retryCount < maxRetries) {
        setTimeout(() => {
          fetchSubsidiaries(retryCount + 1);
        }, Math.pow(2, retryCount) * 1000); // Exponential backoff
      } else {
        setError(err.message || 'Failed to load subsidiary data');
        setSubsidiaries([]); // Fallback to empty array
      }
    } finally {
      setLoading(false);
    }
  }, [includeStats]);

  // Initial fetch
  useEffect(() => {
    fetchSubsidiaries();
  }, [fetchSubsidiaries]);

  // Auto refresh removed to save resources
  // Users can manually refresh using the refresh button

  // Filtered subsidiaries
  const filteredSubsidiaries = useMemo(() => {
    if (!filterBy || subsidiaries.length === 0) return subsidiaries;

    return subsidiaries.filter(subsidiary => {
      return Object.entries(filterBy).every(([key, value]) => {
        if (!value) return true;
        
        switch (key) {
          case 'specialization':
            return subsidiary.specialization === value;
          case 'status':
            return subsidiary.status === value;
          case 'city':
            return subsidiary.address?.city?.toLowerCase().includes(value.toLowerCase());
          case 'hasProjects':
            return value ? subsidiary.projectCount > 0 : subsidiary.projectCount === 0;
          default:
            return subsidiary[key] === value;
        }
      });
    });
  }, [subsidiaries, filterBy]);

  // Helper functions
  const getSubsidiaryById = useCallback((id) => {
    return subsidiaries.find(sub => sub.id === id);
  }, [subsidiaries]);

  const getSubsidiaryByCode = useCallback((code) => {
    return subsidiaries.find(sub => sub.code === code);
  }, [subsidiaries]);

  const getSubsidiariesBySpecialization = useCallback((specialization) => {
    return subsidiaries.filter(sub => sub.specialization === specialization);
  }, [subsidiaries]);

  const getActiveSubsidiaries = useCallback(() => {
    return subsidiaries.filter(sub => sub.status === 'active');
  }, [subsidiaries]);

  // Formatted options for selects
  const subsidiaryOptions = useMemo(() => [
    { value: '', label: 'Semua Anak Perusahaan' },
    ...filteredSubsidiaries.map(sub => ({
      value: sub.id,
      code: sub.code,
      label: `${sub.code} - ${sub.name}`,
      specialization: sub.specialization,
      city: sub.address?.city,
      employeeCount: sub.employeeCount
    }))
  ], [filteredSubsidiaries]);

  // Statistics
  const computedStats = useMemo(() => {
    if (subsidiaries.length === 0) return null;

    const bySpecialization = subsidiaries.reduce((acc, sub) => {
      acc[sub.specialization] = (acc[sub.specialization] || 0) + 1;
      return acc;
    }, {});

    const byStatus = subsidiaries.reduce((acc, sub) => {
      acc[sub.status] = (acc[sub.status] || 0) + 1;
      return acc;
    }, {});

    const totalEmployees = subsidiaries.reduce((sum, sub) => sum + (sub.employeeCount || 0), 0);

    return {
      total: subsidiaries.length,
      active: byStatus.active || 0,
      inactive: byStatus.inactive || 0,
      bySpecialization,
      byStatus,
      totalEmployees,
      averageEmployees: subsidiaries.length > 0 ? Math.round(totalEmployees / subsidiaries.length) : 0,
      ...stats // Include API stats if available
    };
  }, [subsidiaries, stats]);

  // Refresh function
  const refresh = useCallback(() => {
    return fetchSubsidiaries();
  }, [fetchSubsidiaries]);

  // Reset function
  const reset = useCallback(() => {
    setSubsidiaries([]);
    setError(null);
    setStats(null);
    setLastRefresh(null);
  }, []);

  return {
    // Data
    subsidiaries: filteredSubsidiaries,
    allSubsidiaries: subsidiaries,
    subsidiaryOptions,
    stats: computedStats,
    
    // State
    loading,
    error,
    lastRefresh,
    
    // Actions
    refresh,
    reset,
    fetchSubsidiaries,
    
    // Helpers
    getSubsidiaryById,
    getSubsidiaryByCode,
    getSubsidiariesBySpecialization,
    getActiveSubsidiaries,
    
    // Computed
    isEmpty: subsidiaries.length === 0,
    hasError: !!error,
    isStale: lastRefresh && (Date.now() - lastRefresh.getTime()) > refreshInterval
  };
};

export default useSubsidiaries;
