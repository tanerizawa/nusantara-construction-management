import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  FolderOpen, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  ArrowUpRight,
  Eye,
  RefreshCw,
  Calendar,
  Package,
  Minus
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({});
  const [timeRange, setTimeRange] = useState('monthly');
  const [error, setError] = useState(null);

  // Fetch dashboard data based on time range
  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Generate dynamic data based on time range
      const mockDashboardData = {
        overview: {
          totalProjects: 23,
          activeProjects: 15,
          completedProjects: 8,
          totalManpower: 185,
          totalInventory: 1250,
          monthlyRevenue: 8500000000, // 8.5B
          profitMargin: 18.5,
          monthlyGrowth: timeRange === 'daily' ? 2.3 : timeRange === 'weekly' ? 5.1 : timeRange === 'monthly' ? 8.7 : 12.4,
          efficiency: 87.3,
          totalEmployees: 185,
          revenueGrowth: timeRange === 'daily' ? 1.2 : timeRange === 'weekly' ? 3.4 : timeRange === 'monthly' ? 6.8 : 15.2,
          profitGrowth: timeRange === 'daily' ? 0.8 : timeRange === 'weekly' ? 2.1 : timeRange === 'monthly' ? 4.5 : 9.3
        },
        projectMetrics: {
          onTime: 12,
          delayed: 3,
          onBudget: 10,
          overBudget: 5,
          avgProgress: 67,
          criticalProjects: 2,
          upcomingDeadlines: 5
        },
        financialMetrics: {
          revenue: [
            { month: 'Jan', amount: 7800000000, growth: 5.2 },
            { month: 'Feb', amount: 8200000000, growth: 5.1 },
            { month: 'Mar', amount: 8500000000, growth: 3.7 }
          ],
          expenses: [
            { category: 'Material', amount: 4200000000, percentage: 49.4 },
            { category: 'Manpower', amount: 2100000000, percentage: 24.7 },
            { category: 'Equipment', amount: 850000000, percentage: 10.0 },
            { category: 'Overhead', amount: 450000000, percentage: 5.3 },
            { category: 'Others', amount: 900000000, percentage: 10.6 }
          ],
          profitTrend: [
            { month: 'Jan', profit: 1400000000, margin: 17.9 },
            { month: 'Feb', profit: 1600000000, margin: 19.5 },
            { month: 'Mar', profit: 1750000000, margin: 20.6 }
          ]
        },
        inventoryStatus: {
          lowStock: 12,
          outOfStock: 3,
          overStock: 5,
          optimal: 85,
          totalItems: 105,
          criticalItems: 8
        },
        manpowerMetrics: {
          totalEmployees: 185,
          activeWorkers: 156,
          onLeave: 12,
          trainingPrograms: 8,
          performanceRating: 4.3,
          newHires: 7,
          productivity: 92.1
        },
        recentProjects: [
          {
            id: 1,
            name: 'Pembangunan Jalan Tol Surabaya-Sidoarjo',
            manager: 'Ir. Ahmad Susanto',
            status: 'on-track',
            progress: 78,
            budget: 15000000000,
            dueDate: '2024-12-15',
            priority: 'high',
            team: 45
          },
          {
            id: 2,
            name: 'Renovasi Gedung Pemerintahan Kota',
            manager: 'Ir. Siti Rahayu',
            status: 'ahead',
            progress: 92,
            budget: 8500000000,
            dueDate: '2024-10-30',
            priority: 'medium',
            team: 28
          },
          {
            id: 3,
            name: 'Konstruksi Jembatan Mahakam',
            manager: 'Ir. Budi Santoso',
            status: 'delayed',
            progress: 45,
            budget: 25000000000,
            dueDate: '2025-03-20',
            priority: 'critical',
            team: 67
          },
          {
            id: 4,
            name: 'Pembangunan Pelabuhan Tanjung Perak',
            manager: 'Ir. Dewi Kartika',
            status: 'on-track',
            progress: 63,
            budget: 18000000000,
            dueDate: '2024-11-25',
            priority: 'high',
            team: 52
          }
        ],
        recentActivities: [
          {
            id: 1,
            type: 'project',
            title: 'Proyek Jalan Tol Surabaya-Sidoarjo mencapai milestone 80%',
            timestamp: '2 jam lalu',
            status: 'success',
            detail: 'Tim konstruksi berhasil menyelesaikan segmen utama jalan tol'
          },
          {
            id: 2,
            type: 'finance',
            title: 'Pembayaran supplier material senilai Rp 2.5M disetujui',
            timestamp: '4 jam lalu',
            status: 'info',
            detail: 'Pembayaran untuk PT Semen Indonesia telah diproses'
          },
          {
            id: 3,
            type: 'inventory',
            title: 'Stok semen portland mencapai batas minimum',
            timestamp: '6 jam lalu',
            status: 'warning',
            detail: 'Diperlukan reorder segera untuk menghindari keterlambatan'
          },
          {
            id: 4,
            type: 'manpower',
            title: '12 pekerja baru bergabung dalam tim Proyek Sidoarjo',
            timestamp: '1 hari lalu',
            status: 'success',
            detail: 'Penambahan tenaga kerja untuk mempercepat penyelesaian'
          },
          {
            id: 5,
            type: 'safety',
            title: 'Inspeksi keselamatan rutin telah diselesaikan',
            timestamp: '2 hari lalu',
            status: 'info',
            detail: 'Semua protokol keselamatan memenuhi standar'
          }
        ],
        alerts: [
          {
            id: 1,
            type: 'error',
            title: 'Keterlambatan Pengiriman Material',
            message: 'Pengiriman beton ready-mix untuk Proyek Mahakam terlambat 2 hari',
            time: '30 menit lalu',
            priority: 'high',
            actionRequired: true
          },
          {
            id: 2,
            type: 'warning',
            title: 'Budget Alert',
            message: 'Proyek Renovasi Gedung telah menggunakan 85% dari total budget',
            time: '2 jam lalu',
            priority: 'medium',
            actionRequired: true
          },
          {
            id: 3,
            type: 'info',
            title: 'Perubahan Jadwal',
            message: 'Meeting mingguan dipindah ke hari Kamis pukul 14:00',
            time: '5 jam lalu',
            priority: 'low',
            actionRequired: false
          },
          {
            id: 4,
            type: 'success',
            title: 'Sertifikasi Keselamatan',
            message: 'Tim proyek berhasil memperoleh sertifikasi K3 tingkat A',
            time: '1 hari lalu',
            priority: 'low',
            actionRequired: false
          }
        ],
        teamStats: {
          totalEmployees: 154,
          presentToday: 139,
          onLeave: 8,
          avgPerformance: 87
        },
        departmentStats: [
          {
            name: 'Engineering',
            total: 25,
            present: 23,
            absent: 1,
            leave: 1,
            attendanceRate: 92
          },
          {
            name: 'Construction',
            total: 89,
            present: 82,
            absent: 4,
            leave: 3,
            attendanceRate: 92
          },
          {
            name: 'Quality Control', 
            total: 18,
            present: 16,
            absent: 1,
            leave: 1,
            attendanceRate: 89
          },
          {
            name: 'Safety & Security',
            total: 22,
            present: 18,
            absent: 2,
            leave: 2,
            attendanceRate: 82
          }
        ],
        teamPerformance: [
          {
            department: 'Engineering',
            efficiency: 94,
            projects: 8,
            members: 25,
            productivity: 'excellent',
            trend: 'up'
          },
          {
            department: 'Construction',
            efficiency: 87,
            projects: 12,
            members: 89,
            productivity: 'good',
            trend: 'stable'
          },
          {
            department: 'Quality Control',
            efficiency: 91,
            projects: 6,
            members: 18,
            productivity: 'excellent',
            trend: 'up'
          },
          {
            department: 'Safety & Security',
            efficiency: 96,
            projects: 15,
            members: 22,
            productivity: 'excellent',
            trend: 'up'
          }
        ]
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setDashboardData(mockDashboardData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Utility functions
  const formatCurrency = useCallback((amount) => {
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(1)}K`;
    }
    return `Rp ${amount.toLocaleString('id-ID')}`;
  }, []);

  const getStatusColor = useCallback((status) => {
    const colors = {
      'on-track': 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30',
      'ahead': 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30',
      'delayed': 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30',
      'critical': 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/30'
    };
    return colors[status] || 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800';
  }, []);

  const getAlertIcon = useCallback((type) => {
    const icons = {
      'warning': <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
      'success': <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />,
      'info': <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      'error': <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
    };
    return icons[type] || <AlertTriangle className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
  }, []);

  const getPriorityColor = useCallback((priority) => {
    const colors = {
      'critical': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'low': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }, []);

  // Navigation handlers
  const handleNavigation = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  // Calculated values
  const totalRevenue = useMemo(() => 
    dashboardData.financialMetrics?.revenue?.reduce((sum, item) => sum + item.amount, 0) || 0,
    [dashboardData.financialMetrics]
  );

  const totalExpenses = useMemo(() => 
    dashboardData.financialMetrics?.expenses?.reduce((sum, item) => sum + item.amount, 0) || 0,
    [dashboardData.financialMetrics]
  );

  const netProfit = useMemo(() => totalRevenue - totalExpenses, [totalRevenue, totalExpenses]);

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <button 
            onClick={() => { setError(null); fetchDashboardData(); }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-100 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-6"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Selamat datang kembali! Berikut adalah ringkasan proyek konstruksi Anda.
            {isDarkMode && (
              <span className="ml-2 px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">
                🌙 Dark Mode
              </span>
            )}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
          
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="daily">Harian</option>
            <option value="weekly">Mingguan</option>
            <option value="monthly">Bulanan</option>
            <option value="quarterly">Kuartalan</option>
          </select>
          
          <button
            onClick={() => handleNavigation('/admin/analytics')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm font-medium">Analytics</span>
          </button>
        </div>
      </div>

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Projects */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => handleNavigation('/admin/projects')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Proyek Aktif</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {dashboardData.overview?.activeProjects}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  +{dashboardData.overview?.monthlyGrowth}% vs bulan lalu
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Selesai: {dashboardData.overview?.completedProjects}</span>
              <span>Total: {dashboardData.overview?.totalProjects}</span>
            </div>
          </div>
        </div>

        {/* Total Employees */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => handleNavigation('/admin/manpower')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Karyawan</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {dashboardData.overview?.totalEmployees}
              </p>
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-1" />
                <span className="text-sm text-purple-600 dark:text-purple-400">
                  {dashboardData.overview?.efficiency}% produktif
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Aktif: {dashboardData.manpowerMetrics?.activeWorkers}</span>
              <span>Cuti: {dashboardData.manpowerMetrics?.onLeave}</span>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => handleNavigation('/admin/finance')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Pendapatan</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totalRevenue)}
              </p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  +{dashboardData.overview?.revenueGrowth}% vs periode lalu
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Laba: {formatCurrency(netProfit)}</span>
              <span>Margin: {dashboardData.overview?.profitMargin}%</span>
            </div>
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => handleNavigation('/admin/inventory')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status Inventori</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {dashboardData.inventoryStatus?.optimal}
              </p>
              <div className="flex items-center mt-2">
                <Package className="h-4 w-4 text-orange-600 dark:text-orange-400 mr-1" />
                <span className="text-sm text-orange-600 dark:text-orange-400">
                  Item optimal
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Rendah: {dashboardData.inventoryStatus?.lowStock}</span>
              <span>Habis: {dashboardData.inventoryStatus?.outOfStock}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects - Enhanced */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Proyek Terbaru</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {dashboardData.recentProjects?.length || 0} proyek aktif
              </p>
            </div>
            <button 
              onClick={() => handleNavigation('/admin/projects')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
            >
              Lihat Semua <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {dashboardData.recentProjects?.length > 0 ? (
              dashboardData.recentProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                  onClick={() => handleNavigation(`/admin/projects/${project.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">{project.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Manager: {project.manager}</span>
                        <span>•</span>
                        <span>Tim: {project.team} orang</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status === 'on-track' ? 'Sesuai Jadwal' : 
                         project.status === 'ahead' ? 'Lebih Cepat' : 
                         project.status === 'delayed' ? 'Terlambat' : project.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority === 'critical' ? 'Kritis' :
                         project.priority === 'high' ? 'Tinggi' :
                         project.priority === 'medium' ? 'Sedang' : 'Rendah'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        project.status === 'ahead' ? 'bg-green-600' :
                        project.status === 'delayed' ? 'bg-red-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Budget: </span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(project.budget)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Deadline: </span>
                      <span className="font-medium text-gray-900 dark:text-white">{project.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FolderOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Tidak ada proyek tersedia</p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Alerts & Notifications */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notifikasi</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {dashboardData.alerts?.filter(alert => alert.actionRequired).length || 0} perlu tindakan
              </p>
            </div>
            <button 
              onClick={() => handleNavigation('/admin/notifications')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
            >
              Lihat Semua <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {dashboardData.alerts?.length > 0 ? (
              dashboardData.alerts.slice(0, 5).map((alert) => (
                <div 
                  key={alert.id} 
                  className="flex gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                        {alert.title}
                      </h4>
                      {alert.actionRequired && (
                        <span className="ml-2 w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 dark:text-gray-500">{alert.time}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                        {alert.priority === 'high' ? 'Tinggi' : 
                         alert.priority === 'medium' ? 'Sedang' : 'Rendah'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Tidak ada notifikasi</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Team Performance Section */}
      <div className="mt-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Performa Tim</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ringkasan performa dan kehadiran karyawan
              </p>
            </div>
            <button 
              onClick={() => handleNavigation('/admin/manpower')}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
            >
              <Eye className="h-4 w-4" />
              Detail Tim
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Team Stats Grid */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded-full">
                  Total
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {dashboardData.teamStats?.totalEmployees || 0}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Karyawan</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-green-700 dark:text-green-300 bg-green-200 dark:bg-green-800 px-2 py-1 rounded-full">
                  Hadir
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {dashboardData.teamStats?.presentToday || 0}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">Hadir Hari Ini</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-amber-600 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-200 dark:bg-amber-800 px-2 py-1 rounded-full">
                  Cuti
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                  {dashboardData.teamStats?.onLeave || 0}
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-400">Sedang Cuti</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-200 dark:bg-purple-800 px-2 py-1 rounded-full">
                  Avg
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {dashboardData.teamStats?.avgPerformance || 0}%
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-400">Rata-rata Performa</p>
              </div>
            </div>
          </div>

          {/* Department Performance */}
          <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Performa Departemen</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboardData.teamPerformance?.map((team, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                  onClick={() => handleNavigation(`/admin/manpower?department=${team.department.toLowerCase()}`)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900 dark:text-white">{team.department}</h5>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      team.productivity === 'excellent' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      team.productivity === 'good' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {team.productivity === 'excellent' ? 'Sangat Baik' :
                       team.productivity === 'good' ? 'Baik' : 'Cukup'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Efisiensi</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{team.efficiency}%</span>
                      {team.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : team.trend === 'down' ? (
                        <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                      ) : (
                        <Minus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        team.efficiency >= 90 ? 'bg-green-600' :
                        team.efficiency >= 80 ? 'bg-blue-600' : 'bg-yellow-600'
                      }`}
                      style={{ width: `${team.efficiency}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{team.projects} proyek</span>
                    <span>{team.members} anggota</span>
                  </div>
                </div>
              )) || (
                <div className="col-span-full text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Data performa tidak tersedia</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
