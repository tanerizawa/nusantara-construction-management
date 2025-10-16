import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for managing project filters, search, and sorting
 * Handles all filtering, searching, and sorting logic for project list
 */
export const useProjectFilters = (projects = []) => {
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter and Sort Projects
  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(project =>
        project.name?.toLowerCase().includes(search) ||
        project.projectCode?.toLowerCase().includes(search) ||
        project.client?.toLowerCase().includes(search) ||
        project.clientName?.toLowerCase().includes(search)
      );
    }

    // Apply filters
    if (filters.status) {
      result = result.filter(project => project.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter(project => project.priority === filters.priority);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle different data types
      if (sortBy === 'budget' || sortBy === 'progress') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortBy === 'startDate' || sortBy === 'endDate' || sortBy === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else {
        aValue = String(aValue || '').toLowerCase();
        bValue = String(bValue || '').toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [projects, searchTerm, filters, sortBy, sortOrder]);

  const hasActiveFilters = filters.status || filters.priority;

  // Handlers
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSortChange = useCallback((field, order) => {
    setSortBy(field);
    setSortOrder(order);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({ status: '', priority: '' });
    setSortBy('createdAt');
    setSortOrder('desc');
  }, []);

  return {
    // State
    searchTerm,
    filters,
    sortBy,
    sortOrder,
    hasActiveFilters,
    
    // Computed
    filteredAndSortedProjects,
    
    // Handlers
    handleSearchChange,
    handleSearchClear,
    handleFilterChange,
    handleSortChange,
    handleClearFilters,
  };
};
