import { useState, useEffect } from 'react';
import { subsidiaryAPI } from '../../../services/api';

/**
 * Custom hook for fetching subsidiaries data and stats
 * @returns {Object} Data, loading state, and fetch functions
 */
const useSubsidiariesData = () => {
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  // Fetch subsidiaries on mount
  useEffect(() => {
    fetchSubsidiaries();
    fetchStats();
  }, []);

  /**
   * Fetch subsidiaries list
   */
  const fetchSubsidiaries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await subsidiaryAPI.getAll();
      
      if (response.success) {
        setSubsidiaries(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch subsidiaries');
      }
    } catch (error) {
      console.error('Error fetching subsidiaries:', error);
      setError('An error occurred while fetching subsidiaries');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch subsidiary statistics
   */
  const fetchStats = async () => {
    try {
      const response = await subsidiaryAPI.getStats();
      
      if (response.success) {
        // Use new statistics endpoint response structure
        const data = response.data;
        
        if (data.overview) {
          // New comprehensive statistics format
          setStats({
            total: data.overview.total,
            active: data.overview.active,
            totalEmployees: data.overview.totalEmployees,
            specializations: data.specializations?.length || 0
          });
        } else {
          // Fallback to old format
          setStats({
            total: data.total || 0,
            active: data.active || 0,
            totalEmployees: data.totalEmployees || 0,
            specializations: data.bySpecialization?.length || 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching subsidiary statistics:', error);
    }
  };

  /**
   * Handle subsidiary deletion
   * @param {string} id - Subsidiary ID
   */
  const handleDeleteSubsidiary = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus anak usaha ini?')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await subsidiaryAPI.delete(id);
      
      if (response.success) {
        // Re-fetch data after successful deletion
        await fetchSubsidiaries();
        await fetchStats();
      } else {
        alert('Gagal menghapus anak usaha: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting subsidiary:', error);
      alert('Gagal menghapus anak usaha');
    } finally {
      setLoading(false);
    }
  };

  return {
    subsidiaries,
    loading,
    stats,
    error,
    fetchSubsidiaries,
    fetchStats,
    handleDeleteSubsidiary
  };
};

export default useSubsidiariesData;