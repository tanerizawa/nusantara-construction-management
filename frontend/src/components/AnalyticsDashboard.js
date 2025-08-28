import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUpRight,
  Plus
} from 'lucide-react';
// import { useAuth } from '../context/AuthContext'; // Will be used for API integration

/**
 * Comprehensive Analytics Dashboard - Phase 3 Enhancement
 * Advanced business intelligence and KPI monitoring
 */

const AnalyticsDashboard = () => {
  // const { token } = useAuth(); // Will be used when integrating with API
  const [dashboardData] = useState({
    revenue: {
      current: 4567000000,
      previous: 4234000000,
      growth: 7.9
    },
    projects: {
      active: 23,
      completed: 45,
      totalValue: 12500000000
    },
    inventory: {
      totalItems: 1247,
      totalValue: 8900000000,
      lowStock: 23,
      topMoving: 'Semen Portland'
    },
    suppliers: {
      active: 28,
      performance: 94.2,
      onTimeDelivery: 89.5
    },
    finance: {
      cashFlow: 2100000000,
      pendingInvoices: 890000000,
      profit: 15.7
    }
  });

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual API
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const getGrowthIcon = (growth) => {
    return growth > 0 ? <TrendingUp size={16} className="text-green-600" /> : <TrendingDown size={16} className="text-red-600" />;
  };

  // const getGrowthColor = (growth) => {
  //   return growth > 0 ? 'text-green-600' : 'text-red-600';
  // }; // Will be used for additional styling

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive business intelligence & performance monitoring</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">7 Hari</option>
            <option value="month">30 Hari</option>
            <option value="quarter">90 Hari</option>
            <option value="year">1 Tahun</option>
          </select>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(dashboardData.revenue.current)}</p>
              <div className="flex items-center mt-2">
                {getGrowthIcon(dashboardData.revenue.growth)}
                <span className="ml-1 text-sm">
                  {dashboardData.revenue.growth > 0 ? '+' : ''}{dashboardData.revenue.growth}% vs last period
                </span>
              </div>
            </div>
            <DollarSign className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Projects</p>
              <p className="text-2xl font-bold">{dashboardData.projects.active}</p>
              <p className="text-sm text-green-100 mt-2">
                {formatCurrency(dashboardData.projects.totalValue)} total value
              </p>
            </div>
            <Activity className="h-12 w-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Inventory Value</p>
              <p className="text-2xl font-bold">{formatCurrency(dashboardData.inventory.totalValue)}</p>
              <p className="text-sm text-purple-100 mt-2">
                {formatNumber(dashboardData.inventory.totalItems)} items tracked
              </p>
            </div>
            <Package className="h-12 w-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Profit Margin</p>
              <p className="text-2xl font-bold">{dashboardData.finance.profit}%</p>
              <p className="text-sm text-orange-100 mt-2">
                {formatCurrency(dashboardData.finance.cashFlow)} cash flow
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-xs text-gray-600">Suppliers</p>
              <p className="font-bold">{dashboardData.suppliers.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-xs text-gray-600">Performance</p>
              <p className="font-bold">{dashboardData.suppliers.performance}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-xs text-gray-600">On-Time</p>
              <p className="font-bold">{dashboardData.suppliers.onTimeDelivery}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-xs text-gray-600">Low Stock</p>
              <p className="font-bold">{dashboardData.inventory.lowStock}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-xs text-gray-600">Deliveries</p>
              <p className="font-bold">47</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-indigo-600" />
            <div className="ml-3">
              <p className="text-xs text-gray-600">Due Tasks</p>
              <p className="font-bold">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Area Chart - Monthly Revenue</p>
              <p className="text-sm text-gray-500">Interactive charts coming soon</p>
            </div>
          </div>
        </div>

        {/* Project Status */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Project Status Distribution</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Pie Chart - Project Status</p>
              <p className="text-sm text-gray-500">Status breakdown visualization</p>
            </div>
          </div>
        </div>

        {/* Inventory Analysis */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Inventory Insights</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium text-green-900">Top Moving Item</div>
                <div className="text-sm text-green-700">{dashboardData.inventory.topMoving}</div>
              </div>
              <ArrowUpRight className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <div>
                <div className="font-medium text-red-900">Low Stock Alert</div>
                <div className="text-sm text-red-700">{dashboardData.inventory.lowStock} items below minimum</div>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium text-blue-900">Total Value</div>
                <div className="text-sm text-blue-700">{formatCurrency(dashboardData.inventory.totalValue)}</div>
              </div>
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cash Flow</span>
              <span className="font-medium text-green-600">
                {formatCurrency(dashboardData.finance.cashFlow)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Invoices</span>
              <span className="font-medium text-orange-600">
                {formatCurrency(dashboardData.finance.pendingInvoices)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Profit Margin</span>
              <span className="font-medium text-blue-600">
                {dashboardData.finance.profit}%
              </span>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Net Revenue</span>
                <span className="font-bold text-lg text-gray-900">
                  {formatCurrency(dashboardData.revenue.current)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <Plus className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Add New Project</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors">
            <Package className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Stock Adjustment</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors">
            <Users className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Add Supplier</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors">
            <BarChart3 className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
