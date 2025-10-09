import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook untuk mengambil Berita Acara yang sudah disetujui
 */
export const useApprovedBA = (projectId) => {
  const [beritaAcaraList, setBeritaAcaraList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovedBeritaAcara = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/berita-acara?status=approved`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBeritaAcaraList(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching approved BA:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchApprovedBeritaAcara();
  }, [fetchApprovedBeritaAcara]);

  return {
    beritaAcaraList,
    loading,
    refreshBA: fetchApprovedBeritaAcara
  };
};
