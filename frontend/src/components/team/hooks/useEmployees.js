import { useState, useEffect } from 'react';
import { employeeAPI } from '../../../services/api';

export const useEmployees = () => {
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeAPI.getAll();
        setAvailableEmployees(response.data || []);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  return { availableEmployees, loading };
};
