import { useState, useCallback } from 'react';
import { fetchSubsidiaries } from '../services/subsidiaryService';

export const useSubsidiaryModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Open modal and fetch subsidiaries
  const openModal = useCallback(async () => {
    setIsOpen(true);
    setLoading(true);
    setError(null);

    try {
      const result = await fetchSubsidiaries();
      
      if (result.success) {
        setSubsidiaries(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error fetching subsidiaries:', err);
      setError('Failed to load subsidiaries');
    } finally {
      setLoading(false);
    }
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setError(null);
  }, []);

  // Refresh subsidiaries data
  const refreshSubsidiaries = useCallback(async () => {
    if (!isOpen) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchSubsidiaries();
      
      if (result.success) {
        setSubsidiaries(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error refreshing subsidiaries:', err);
      setError('Failed to refresh subsidiaries');
    } finally {
      setLoading(false);
    }
  }, [isOpen]);

  // Filter subsidiaries by status
  const getActiveSubsidiaries = useCallback(() => {
    return subsidiaries.filter(subsidiary => subsidiary.status === 'active');
  }, [subsidiaries]);

  const getInactiveSubsidiaries = useCallback(() => {
    return subsidiaries.filter(subsidiary => subsidiary.status !== 'active');
  }, [subsidiaries]);

  // Get subsidiaries by specialization
  const getSubsidiariesBySpecialization = useCallback((specialization) => {
    return subsidiaries.filter(subsidiary => 
      subsidiary.specialization?.toLowerCase() === specialization?.toLowerCase()
    );
  }, [subsidiaries]);

  // Get subsidiaries stats
  const getSubsidiaryStats = useCallback(() => {
    const totalCount = subsidiaries.length;
    const activeCount = getActiveSubsidiaries().length;
    const inactiveCount = getInactiveSubsidiaries().length;
    
    const specializations = {};
    subsidiaries.forEach(subsidiary => {
      const spec = subsidiary.specialization || 'Other';
      specializations[spec] = (specializations[spec] || 0) + 1;
    });

    const totalEmployees = subsidiaries.reduce((sum, subsidiary) => 
      sum + (subsidiary.employeeCount || 0), 0
    );

    return {
      totalCount,
      activeCount,
      inactiveCount,
      specializations,
      totalEmployees
    };
  }, [subsidiaries, getActiveSubsidiaries, getInactiveSubsidiaries]);

  return {
    isOpen,
    subsidiaries,
    loading,
    error,
    openModal,
    closeModal,
    refreshSubsidiaries,
    getActiveSubsidiaries,
    getInactiveSubsidiaries,
    getSubsidiariesBySpecialization,
    getSubsidiaryStats
  };
};