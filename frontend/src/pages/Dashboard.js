import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building, 
  DollarSign, 
  Package, 
  ShoppingCart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  RefreshCw
} from 'lucide-react';
import { LoadingSpinner, ErrorDisplay, StatsCard, formatCurrency } from '../components/common/DashboardComponents';
import DashboardAPIService from '../services/DashboardAPIService';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    projects: { total: 0, active: 0, completed: 0 },
    purchaseOrders: { total: 0, pending: 0, approved: 0 },
    budget: { total: 0, used: 0, remaining: 0 },
    materials: { total: 0, inStock: 0, lowStock: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const data = await DashboardAPIService.getDashboardOverview('month');
      
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
  };

  const fetchRecentActivities = async () => {
    // This is now handled in fetchDashboardData through DashboardAPIService
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard data..." />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchDashboardData} title="Dashboard Error" />;
  }

  return (
    <div className="p-6 bg-[#1C1C1E] min-h-screen">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-[#98989D]">Ringkasan aktivitas dan statistik proyek</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          disabled={loading}
          className="px-5 py-2.5 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0970DD] transition-colors duration-150 flex items-center gap-2 text-sm font-medium disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Proyek"
          value={dashboardData.projects.total}
          subtitle={`${dashboardData.projects.active} aktif`}
          icon={Building}
          color="blue"
          trend="+12% dari bulan lalu"
        />
        
        <StatsCard
          title="Purchase Orders"
          value={dashboardData.purchaseOrders.total}
          subtitle={`${dashboardData.purchaseOrders.pending} pending`}
          icon={ShoppingCart}
          color="green"
          trend="+8% dari bulan lalu"
        />
        
        <StatsCard
          title="Total Budget"
          value={formatCurrency(dashboardData.budget.total)}
          subtitle={`${formatCurrency(dashboardData.budget.remaining)} tersisa`}
          icon={DollarSign}
          color="purple"
        />
        
        <StatsCard
          title="Material Items"
          value={dashboardData.materials.total}
          subtitle={`${dashboardData.materials.lowStock} stok rendah`}
          icon={Package}
          color="yellow"
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-[#2C2C2E] border border-[#38383A] p-6 rounded-xl hover:border-[#48484A] transition-colors">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 text-left border border-[#38383A] rounded-lg hover:bg-[#3A3A3C] hover:border-[#48484A] transition-colors duration-150">
              <div className="flex items-center">
                <Building className="h-5 w-5 text-[#0A84FF] mr-3" />
                <span className="font-medium text-white">Buat Proyek Baru</span>
              </div>
              <div className="text-[#98989D]">→</div>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 text-left border border-[#38383A] rounded-lg hover:bg-[#3A3A3C] hover:border-[#48484A] transition-colors duration-150">
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 text-[#30D158] mr-3" />
                <span className="font-medium text-white">Buat Purchase Order</span>
              </div>
              <div className="text-[#98989D]">→</div>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 text-left border border-[#38383A] rounded-lg hover:bg-[#3A3A3C] hover:border-[#48484A] transition-colors duration-150">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-[#64D2FF] mr-3" />
                <span className="font-medium text-white">Lihat Laporan</span>
              </div>
              <div className="text-[#98989D]">→</div>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 text-left border border-[#38383A] rounded-lg hover:bg-[#3A3A3C] hover:border-[#48484A] transition-colors duration-150">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-[#FF9F0A] mr-3" />
                <span className="font-medium text-white">Kelola Inventory</span>
              </div>
              <div className="text-[#98989D]">→</div>
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-[#2C2C2E] border border-[#38383A] p-6 rounded-xl hover:border-[#48484A] transition-colors">
          <h3 className="text-lg font-semibold text-white mb-4">Aktivitas Terbaru</h3>
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-[#636366]">
                <Activity className="h-8 w-8 mx-auto mb-2 text-[#636366]" />
                <p>Belum ada aktivitas terbaru</p>
              </div>
            ) : (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 py-3 border-b border-[#38383A] last:border-b-0">
                  <div className="flex-shrink-0">
                    {activity.type === 'project' && <Building className="h-5 w-5 text-[#0A84FF]" />}
                    {activity.type === 'purchase_order' && <ShoppingCart className="h-5 w-5 text-[#30D158]" />}
                    {activity.type === 'approval' && <CheckCircle className="h-5 w-5 text-[#30D158]" />}
                    {activity.type === 'alert' && <AlertTriangle className="h-5 w-5 text-[#FF9F0A]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{activity.title}</p>
                    <p className="text-sm text-[#98989D]">{activity.description}</p>
                    <p className="text-xs text-[#636366] mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Project Status Overview */}
      <div className="mt-8 bg-[#2C2C2E] border border-[#38383A] p-6 rounded-xl hover:border-[#48484A] transition-colors">
        <h3 className="text-lg font-semibold text-white mb-4">Status Proyek</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-[#38383A] rounded-lg hover:bg-[#3A3A3C] transition-colors">
            <Target className="h-8 w-8 text-[#0A84FF] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{dashboardData.projects.active}</p>
            <p className="text-sm text-[#98989D]">Proyek Aktif</p>
          </div>
          
          <div className="text-center p-4 border border-[#38383A] rounded-lg hover:bg-[#3A3A3C] transition-colors">
            <Clock className="h-8 w-8 text-[#FF9F0A] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{dashboardData.projects.total - dashboardData.projects.active - dashboardData.projects.completed}</p>
            <p className="text-sm text-[#98989D]">Dalam Perencanaan</p>
          </div>
          
          <div className="text-center p-4 border border-[#38383A] rounded-lg hover:bg-[#3A3A3C] transition-colors">
            <CheckCircle className="h-8 w-8 text-[#30D158] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{dashboardData.projects.completed}</p>
            <p className="text-sm text-[#98989D]">Selesai</p>
          </div>
          
          <div className="text-center p-4 border border-[#38383A] rounded-lg hover:bg-[#3A3A3C] transition-colors">
            <AlertTriangle className="h-8 w-8 text-[#FF453A] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-sm text-[#98989D]">Bermasalah</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
