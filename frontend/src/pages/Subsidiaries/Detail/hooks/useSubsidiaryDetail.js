import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subsidiaryAPI } from '../../../../services/api';

/**
 * Custom hook for fetching and managing subsidiary detail data
 * Handles loading, error states, and data fetching
 */
export const useSubsidiaryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [subsidiary, setSubsidiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState(null);

  const fetchSubsidiaryDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [subsidiaryResponse, statsResponse] = await Promise.allSettled([
        subsidiaryAPI.getById(id),
        subsidiaryAPI.getStats()
      ]);

      // Handle subsidiary data
      if (subsidiaryResponse.status === 'fulfilled' && subsidiaryResponse.value.success) {
        setSubsidiary(subsidiaryResponse.value.data);
      } else {
        throw new Error('Subsidiary not found');
      }

      // Handle statistics data
      if (statsResponse.status === 'fulfilled' && statsResponse.value.success) {
        setStatistics(statsResponse.value.data);
      }
    } catch (error) {
      console.error('Error fetching subsidiary:', error);
      setError(error.message || 'Gagal memuat data anak usaha');
      alert('Gagal memuat data anak usaha');
      navigate('/subsidiaries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSubsidiaryDetail();
    }
  }, [id]);

  const refreshData = () => {
    fetchSubsidiaryDetail();
  };

  return {
    id,
    subsidiary,
    loading,
    statistics,
    error,
    setSubsidiary,
    refreshData
  };
};
