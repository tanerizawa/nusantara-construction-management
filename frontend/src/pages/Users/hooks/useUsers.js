import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Custom hook for managing users data and operations
 * @returns {Object} Users state and handler functions
 */
export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy] = useState('name');
  const [sortOrder] = useState('asc');
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [serverPagination, setServerPagination] = useState({ current: 1, total: 1, count: 0 });

  // Fetch users when filters, pagination, or sorting changes
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, roleFilter, searchTerm, sortBy, sortOrder]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [roleFilter, searchTerm, sortBy, sortOrder]);

  // Fetch stats once
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/users/stats/overview');
        setStats(res.data.data);
      } catch (e) {
        // noop
      }
    };
    fetchStats();
  }, []);

  /**
   * Fetch users from API
   */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users', {
        params: {
          q: searchTerm || undefined,
          role: roleFilter || undefined,
          sort: sortBy,
          order: sortOrder,
          limit: pageSize,
          page
        }
      });
      const data = response.data?.data || [];
      const pagination = response.data?.pagination || { current: page, total: 1, count: data.length };
      
      setUsers(data);
      setServerPagination({
        current: parseInt(pagination.current || 1, 10),
        total: parseInt(pagination.total || 1, 10),
        count: parseInt(pagination.count || data.length || 0, 10)
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setServerPagination({ current: 1, total: 1, count: 0 });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle edit user action
   * @param {Object} user - User to edit
   */
  const handleEditUser = (user) => {
    console.log('Edit user:', user);
  };

  /**
   * Handle reset password action
   * @param {Object} user - User to reset password for
   */
  const handleResetPassword = (user) => {
    console.log('Reset password:', user);
  };

  /**
   * Handle toggle status action
   * @param {Object} user - User to toggle status for
   */
  const handleToggleStatus = (user) => {
    console.log('Toggle status:', user);
  };

  return {
    users,
    loading,
    searchTerm,
    roleFilter,
    sortBy,
    sortOrder,
    stats,
    page,
    pageSize,
    serverPagination,
    setSearchTerm,
    setRoleFilter,
    setPage,
    handleEditUser,
    handleResetPassword,
    handleToggleStatus
  };
};