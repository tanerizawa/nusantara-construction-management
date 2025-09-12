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
  Target
} from 'lucide-react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    projects: { total: 0, active: 0, completed: 0 },
    purchaseOrders: { total: 0, pending: 0, approved: 0 },
    budget: { total: 0, used: 0, remaining: 0 },
    materials: { total: 0, inStock: 0, lowStock: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchRecentActivities();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch dashboard statistics
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await fetch('/api/dashboard/activities', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecentActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount || 0);
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend }) => (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600">{trend}</span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Memuat dashboard...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Ringkasan aktivitas dan statistik proyek</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Proyek"
          value={dashboardData.projects.total}
          subtitle={`${dashboardData.projects.active} aktif`}
          icon={Building}
          color="blue"
          trend="+12% dari bulan lalu"
        />
        
        <StatCard
          title="Purchase Orders"
          value={dashboardData.purchaseOrders.total}
          subtitle={`${dashboardData.purchaseOrders.pending} pending`}
          icon={ShoppingCart}
          color="green"
          trend="+8% dari bulan lalu"
        />
        
        <StatCard
          title="Total Budget"
          value={formatCurrency(dashboardData.budget.total)}
          subtitle={`${formatCurrency(dashboardData.budget.remaining)} tersisa`}
          icon={DollarSign}
          color="purple"
        />
        
        <StatCard
          title="Material Items"
          value={dashboardData.materials.total}
          subtitle={`${dashboardData.materials.lowStock} stok rendah`}
          icon={Package}
          color="orange"
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Building className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium">Buat Proyek Baru</span>
              </div>
              <div className="text-gray-400">→</div>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 text-green-600 mr-3" />
                <span className="font-medium">Buat Purchase Order</span>
              </div>
              <div className="text-gray-400">→</div>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-purple-600 mr-3" />
                <span className="font-medium">Lihat Laporan</span>
              </div>
              <div className="text-gray-400">→</div>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-orange-600 mr-3" />
                <span className="font-medium">Kelola Inventory</span>
              </div>
              <div className="text-gray-400">→</div>
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>Belum ada aktivitas terbaru</p>
              </div>
            ) : (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-shrink-0">
                    {activity.type === 'project' && <Building className="h-5 w-5 text-blue-600" />}
                    {activity.type === 'purchase_order' && <ShoppingCart className="h-5 w-5 text-green-600" />}
                    {activity.type === 'approval' && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {activity.type === 'alert' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Project Status Overview */}
      <div className="mt-8 bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Proyek</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{dashboardData.projects.active}</p>
            <p className="text-sm text-gray-600">Proyek Aktif</p>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{dashboardData.projects.total - dashboardData.projects.active - dashboardData.projects.completed}</p>
            <p className="text-sm text-gray-600">Dalam Perencanaan</p>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{dashboardData.projects.completed}</p>
            <p className="text-sm text-gray-600">Selesai</p>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600">Bermasalah</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
