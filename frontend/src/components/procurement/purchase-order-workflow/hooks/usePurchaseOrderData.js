import { useState, useEffect } from 'react';
import { fetchPurchaseOrders, fetchProjects } from '../services/poAPI';

/**
 * Custom hook for managing purchase order data
 */
export const usePurchaseOrderData = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPurchaseOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchPurchaseOrders();
      
      if (result.success) {
        setPurchaseOrders(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error loading purchase orders:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const result = await fetchProjects();
      
      if (result.success) {
        setProjects(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadPurchaseOrders(),
        loadProjects()
      ]);
    };

    loadData();
  }, []);

  const refreshPurchaseOrders = () => {
    loadPurchaseOrders();
  };

  const refreshProjects = () => {
    loadProjects();
  };

  return {
    purchaseOrders,
    projects,
    loading,
    error,
    refreshPurchaseOrders,
    refreshProjects,
    setPurchaseOrders
  };
};