import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for managing employee filters
 * @param {Array} employees - List of employees 
 * @returns {Object} Filter state and filtered employees
 */
const useManpowerFilters = (employees) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  /**
   * Reset all filters
   */
  const resetFilters = useCallback(() => {
    setDepartmentFilter('');
    setStatusFilter('');
  }, []);

  /**
   * Filter employees based on search and filter criteria
   */
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.position?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === '' || emp.department === departmentFilter;
      const matchesStatus = statusFilter === '' || emp.status === statusFilter;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, searchTerm, departmentFilter, statusFilter]);

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = useMemo(() => {
    return departmentFilter !== '' || statusFilter !== '';
  }, [departmentFilter, statusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    showFilters,
    setShowFilters,
    filteredEmployees,
    resetFilters,
    hasActiveFilters
  };
};

export default useManpowerFilters;