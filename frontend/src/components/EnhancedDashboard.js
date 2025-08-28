import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FolderOpen, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  ArrowUpRight,
  Eye
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const EnhancedDashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [timeRange, setTimeRange] = useState('monthly');

  useEffect(() => {
    // Mock comprehensive dashboard data
    const mockDashboardData = {
      overview: {
        totalProjects: 23,
        activeProjects: 15,
        completedProjects: 8,
        totalManpower: 185,
        totalInventory: 1250,
        monthlyRevenue: 8500000000, // 8.5B
        profitMargin: 18.5
      },
      projectMetrics: {
        onTime: 12,
        delayed: 3,
        onBudget: 10,
        overBudget: 5,
        avgProgress: 67
      },
      financialMetrics: {
        revenue: [
          { month: 'Jan', amount: 7800000000 },
          { month: 'Feb', amount: 8200000000 },
          { month: 'Mar', amount: 8500000000 }
        ],
        expenses: [
          { category: 'Material', amount: 4200000000 },
          { category: 'Manpower', amount: 2100000000 },
          { category: 'Equipment', amount: 850000000 },
          { category: 'Overhead', amount: 450000000 }
        ],
        profitTrend: [
          { month: 'Jan', profit: 1400000000 },
          { month: 'Feb', profit: 1600000000 },
          { month: 'Mar', profit: 1750000000 }
        ]
      },
      inventoryStatus: {
        lowStock: 12,
        outOfStock: 3,
        overStock: 5,
        optimal: 85
      },
      manpowerMetrics: {
        totalEmployees: 185,
        activeWorkers: 156,
        onLeave: 12,
        trainingPrograms: 8,
        performanceRating: 4.3
      },
      recentActivities: [
        {
          id: 1,
          type: 'project',
          title: 'Proyek Jalan Raya Sidoarjo dimulai',
          timestamp: '2 jam lalu',
          status: 'success'
        },
        {
          id: 2,
          type: 'finance',
          title: 'Pembayaran supplier material approved',
          timestamp: '4 jam lalu',
          status: 'info'
        },
        {
          id: 3,
          type: 'inventory',
          title: 'Stock semen portland menipis',
          timestamp: '6 jam lalu',
          status: 'warning'
        }
      ]
    };

    // Simulate API call
    setTimeout(() => {
      setDashboardData(mockDashboardData);
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const formatCurrency = (amount) => `Rp ${(amount / 1000000000).toFixed(1)}B`;

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track': return 'text-blue-600 bg-blue-50';
      case 'ahead': return 'text-green-600 bg-green-50';
      case 'delayed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'info': return <Clock className="h-5 w-5 text-blue-600" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const totalRevenue = useMemo(() => 
    dashboardData.financialMetrics?.revenue?.reduce((sum, item) => sum + item.amount, 0) || 0,
    [dashboardData.financialMetrics]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Welcome back! Here's what's happening with your construction projects.
            {isDarkMode && <span className="ml-2 px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">🌙 Dark Mode</span>}
          </p>
        </div>
        <div className="flex gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-blue-600">{dashboardData.overview?.activeProjects}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+{dashboardData.overview?.monthlyGrowth}%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-purple-600">{dashboardData.overview?.totalEmployees}</p>
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-sm text-purple-600">{dashboardData.overview?.efficiency}% efficient</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Profit Margin</p>
              <p className="text-2xl font-bold text-orange-600">{dashboardData.overview?.profitMargin}%</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-orange-600 mr-1" />
                <span className="text-sm text-orange-600">Healthy</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Projects</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            {dashboardData.recentProjects?.map((project) => (
              <div key={project.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-600">Manager: {project.manager}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status.replace('-', ' ')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full ${
                      project.status === 'ahead' ? 'bg-green-600' :
                      project.status === 'delayed' ? 'bg-red-600' : 'bg-blue-600'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-gray-600">Budget: </span>
                    <span className="font-medium">{formatCurrency(project.budget)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Due: </span>
                    <span className="font-medium">{project.dueDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Alerts</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            {dashboardData.alerts?.map((alert) => (
              <div key={alert.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex-shrink-0 mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Team Performance</h3>
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
            <Eye className="h-4 w-4" />
            View Details
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardData.teamPerformance?.map((team, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <h4 className="font-medium text-gray-900 mb-2">{team.department}</h4>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">Efficiency</span>
                <span className="text-lg font-bold text-blue-600">{team.efficiency}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${team.efficiency}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{team.projects} active projects</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
