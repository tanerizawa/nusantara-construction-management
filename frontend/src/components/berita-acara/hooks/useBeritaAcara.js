import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook untuk mengelola data Berita Acara
 * Handles: fetching, creating, updating, deleting BA data
 */
export const useBeritaAcara = (projectId, onBAChange) => {
  const [baList, setBaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Berita Acara list
  const fetchBeritaAcaraList = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/berita-acara`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBaList(data.data || []);
      } else {
        throw new Error('Failed to load Berita Acara data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching Berita Acara:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Submit BA for review
  const submitBA = useCallback(async (baId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/berita-acara/${baId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          submittedBy: localStorage.getItem('username') || 'current_user'
        })
      });

      if (response.ok) {
        await fetchBeritaAcaraList();
        if (onBAChange) onBAChange();
        return { success: true, message: 'Berita Acara berhasil diajukan untuk review!' };
      } else {
        throw new Error('Failed to submit BA');
      }
    } catch (error) {
      console.error('Error submitting BA:', error);
      return { success: false, message: 'Gagal mengajukan Berita Acara' };
    }
  }, [projectId, fetchBeritaAcaraList, onBAChange]);

  // Delete BA
  const deleteBA = useCallback(async (baId) => {
    if (!window.confirm('Yakin ingin menghapus Berita Acara ini?')) {
      return { success: false, cancelled: true };
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/berita-acara/${baId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await fetchBeritaAcaraList();
        if (onBAChange) onBAChange();
        return { success: true, message: 'Berita Acara berhasil dihapus' };
      } else {
        throw new Error('Failed to delete BA');
      }
    } catch (error) {
      console.error('Error deleting BA:', error);
      return { success: false, message: 'Gagal menghapus Berita Acara' };
    }
  }, [projectId, fetchBeritaAcaraList, onBAChange]);

  // Refresh data
  const refreshData = useCallback(() => {
    fetchBeritaAcaraList();
  }, [fetchBeritaAcaraList]);

  // Initial fetch
  useEffect(() => {
    fetchBeritaAcaraList();
  }, [fetchBeritaAcaraList]);

  return {
    baList,
    loading,
    error,
    fetchBeritaAcaraList,
    submitBA,
    deleteBA,
    refreshData
  };
};
