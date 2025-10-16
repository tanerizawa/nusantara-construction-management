import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * Custom hook for managing tax data, filtering, sorting, and pagination
 * @returns {Object} Tax data and functions for managing it
 */
export const useTaxData = () => {
  const [taxes, setTaxes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [compact, setCompact] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [serverPagination, setServerPagination] = useState({ current: 1, total: 1, count: 0 });

  // Fetch tax data based on current filters, sorting, and pagination
  const fetchTaxData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/tax', {
        params: {
          q: searchTerm || undefined,
          status: statusFilter || undefined,
          sort: sortBy,
          order: sortOrder,
          limit: pageSize,
          page
        }
      });
      const data = response.data?.data || [];
      const pagination = response.data?.pagination || { current: page, total: 1, count: data.length };
      
      setTaxes(data);
      setServerPagination({
        current: parseInt(pagination.current || 1, 10),
        total: parseInt(pagination.total || 1, 10),
        count: parseInt(pagination.count || data.length || 0, 10)
      });
    } catch (error) {
      console.error('Error fetching tax data:', error);
      setTaxes([]);
      setServerPagination({ current: 1, total: 1, count: 0 });
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchTerm, sortBy, sortOrder]);

  // Fetch tax stats separately
  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get('/tax/stats/overview');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching tax stats:', error);
    }
  }, []);

  // Update tax data when filters, sorting, or pagination change
  useEffect(() => {
    fetchTaxData();
  }, [fetchTaxData]);

  // Reset page when filters/search change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, searchTerm, sortBy, sortOrder]);

  // Fetch stats only once when the component mounts
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Handle sort change from UI
  const handleSortChange = (val) => {
    const [key, ord] = val.split(':');
    setSortBy(key);
    setSortOrder(ord);
  };

  return {
    taxes,
    stats,
    loading,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder,
    handleSortChange,
    compact,
    setCompact,
    page,
    setPage,
    serverPagination,
    pageSize,
    refreshData: fetchTaxData
  };
};

export default useTaxData;