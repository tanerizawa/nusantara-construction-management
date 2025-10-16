import { useState, useEffect, useCallback } from 'react';
import { employeeAPI } from '../../../services/api';

/**
 * Custom hook for managing employee data
 * @returns {Object} Employee data, loading state, and management functions
 */
const useManpowerData = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch employee data
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const employeeResponse = await employeeAPI.getAll();
      const employeeData = employeeResponse.data || employeeResponse;
      setEmployees(Array.isArray(employeeData) ? employeeData : []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to fetch data');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete employee
   * @param {string} id - Employee ID
   */
  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) return;
    
    try {
      await employeeAPI.delete(id);
      await fetchData();
      setError(null);
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError(error.message);
    }
  };

  /**
   * Calculate stats from employee data
   */
  const getStats = useCallback(() => {
    return {
      total: employees.length,
      active: employees.filter(e => e.status === 'active').length,
      inactive: employees.filter(e => e.status === 'inactive').length,
      departments: [...new Set(employees.map(e => e.department))].length
    };
  }, [employees]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    employees,
    loading,
    error,
    setError,
    fetchData,
    handleDeleteEmployee,
    stats: getStats()
  };
};

export default useManpowerData;