import { useState, useEffect, useCallback } from 'react';
import DashboardAPIService from '../../../services/DashboardAPIService';

/**
 * Custom hook untuk mengelola data dashboard
 * @returns {Object} Data dashboard dan fungsi terkait
 */
const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState({
    projects: { total: 0, active: 0, completed: 0 },
    purchaseOrders: { total: 0, pending: 0, approved: 0 },
    budget: { total: 0, used: 0, remaining: 0 },
    materials: { total: 0, inStock: 0, lowStock: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  /**
   * Mengambil data dashboard dari API
   * @param {string} period - Periode waktu ('day', 'week', 'month')
   */
  const fetchDashboardData = useCallback(async (period = 'month') => {
    try {
      setLoading(true);
      
      const data = await DashboardAPIService.getDashboardOverview(period);
      
      // Transform data to match component expectations
      const transformedData = {
        projects: {
          total: data.overview?.totalProjects || 0,
          active: data.overview?.activeProjects || 0,
          completed: data.projects?.completed || 0
        },
        purchaseOrders: {
          total: data.financial?.pendingInvoices + data.financial?.paidInvoices || 0,
          pending: data.financial?.pendingInvoices || 0,
          approved: data.financial?.paidInvoices || 0
        },
        budget: {
          total: data.overview?.totalRevenue || 0,
          used: data.financial?.expenses || 0,
          remaining: data.financial?.profit || 0
        },
        materials: {
          total: data.overview?.totalInventoryItems || 0,
          inStock: (data.overview?.totalInventoryItems || 0) - (data.overview?.lowStockItems || 0),
          lowStock: data.overview?.lowStockItems || 0
        }
      };
      
      setDashboardData(transformedData);
      setRecentActivities(data.recentActivities || []);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    dashboardData,
    recentActivities,
    loading,
    error,
    fetchDashboardData
  };
};

export default useDashboardData;