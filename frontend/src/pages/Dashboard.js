import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, 
  Package, 
  Users, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  BarChart3,
  PieChart
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Import Phase 1 UI Components
import Button from '../components/ui/Button';
import Card, { KPICard, DataCard } from '../components/ui/Card';
import PageLoader from '../components/ui/PageLoader';
import { Alert } from '../components/ui/Alert';
import { ProgressBudgetChart, BudgetChart } from '../components/ui/Chart';
import { 
  RevenueChart, 
  ProjectProgressChart, 
  FinancialOverviewChart, 
  InventoryStatusChart 
} from '../components/ui/Chart';
import { Badge } from '../components/ui/Badge';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [financeChart, setFinanceChart] = useState([]);
  const [financePeriod, setFinancePeriod] = useState('monthly');
  const [projectCharts, setProjectCharts] = useState({ status: [], progress: [] });
  const [alerts, setAlerts] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);

  useEffect(() => {
    // Initial load for dashboard data (lint: intentional single-run)
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Refetch only finance chart when period changes
    const fetchFinance = async () => {
      try {
        setChartsLoading(true);
        const financeRes = await axios.get('/dashboard/charts/finance', { params: { period: financePeriod } });
        const rawData = financeRes.data.data || [];
        
        // Transform data to match RevenueChart expected format
        const transformedData = rawData.map(item => ({
          label: item.month || item.label || 'Unknown',
          value: (item.income || 0) - (item.expense || 0) // Net revenue
        }));
        
        setFinanceChart(transformedData);
      } catch (e) {
        console.error('Error fetching finance chart:', e);
        setFinanceChart([]); // Set empty array on error
      } finally {
        setChartsLoading(false);
      }
    };
    fetchFinance();
  }, [financePeriod]);

  const fetchDashboardData = async () => {
    try {
      const [overviewRes, projChartsRes, alertsRes, projectsRes] = await Promise.all([
        axios.get('/dashboard/overview'),
        axios.get('/dashboard/charts/projects'),
        axios.get('/dashboard/alerts'),
        axios.get('/projects', { params: { limit: 5, page: 1 } })
      ]);

      setDashboardData(overviewRes.data.data);
      setProjectCharts(projChartsRes.data.data || { status: [], progress: [] });
      setAlerts(alertsRes.data.data || []);
      setRecentProjects((projectsRes.data.data || projectsRes.data || []).slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Proyek',
      value: dashboardData?.projects?.total || 0,
      icon: FolderOpen,
      color: 'blue',
      subtitle: `${dashboardData?.projects?.active || 0} aktif`
    },
    {
      title: 'Total Item Inventory',
      value: dashboardData?.inventory?.totalItems || 0,
      icon: Package,
      color: 'green',
      subtitle: `${dashboardData?.inventory?.lowStock || 0} stok rendah`
    },
    {
      title: 'Total Manpower',
      value: dashboardData?.manpower?.total || 0,
      icon: Users,
      color: 'purple',
      subtitle: `${dashboardData?.manpower?.active || 0} aktif`
    },
    {
      title: 'Saldo Bersih',
      value: formatCurrency(dashboardData?.finance?.netIncome || 0),
      icon: DollarSign,
      color: 'yellow',
      subtitle: `${dashboardData?.finance?.transactions || 0} transaksi`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-600">Ringkasan operasional YK Construction Karawang</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-sm text-gray-500">
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <KPICard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            trend={stat.trend}
            color={stat.color}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Finance Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Trend Keuangan</h3>
            <div className="inline-flex border border-gray-300 rounded-lg overflow-hidden text-sm">
              {['monthly','quarterly','yearly'].map((p) => (
                <button
                  key={p}
                  onClick={() => setFinancePeriod(p)}
                  aria-label={`Tampilkan tren keuangan secara ${p === 'monthly' ? 'bulanan' : p === 'quarterly' ? 'triwulan' : 'tahunan'}`}
                  className={`px-3 py-1.5 capitalize ${financePeriod === p ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {p === 'monthly' ? 'Bulanan' : p === 'quarterly' ? 'Triwulan' : 'Tahunan'}
                </button>
              ))}
            </div>
          </div>
          {chartsLoading ? (
            <PageLoader size="lg" />
          ) : (
            <RevenueChart data={financeChart} height={288} />
          )}
        </Card>

        {/* Project Status Pie */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Status Proyek</h3>
          {chartsLoading ? (
            <PageLoader size="lg" />
          ) : (
            <ProjectProgressChart data={projectCharts.status} height={288} />
          )}
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Proyek Terbaru</h3>
            <Button
              variant="ghost"
              size="sm"
              as={Link}
              to="/admin/projects"
            >
              Lihat semua
            </Button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentProjects.length > 0 ? recentProjects.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500 truncate">{p.location?.city}, {p.location?.province}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge 
                    variant={
                      p.status === 'completed' ? 'success' :
                      p.status === 'in_progress' ? 'primary' :
                      'warning'
                    }
                  >
                    {p.status === 'completed' ? 'Selesai' : p.status === 'in_progress' ? 'Progres' : 'Planning'}
                  </Badge>
                  <span className="text-sm font-semibold text-blue-600">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p.budget?.contractValue || p.budget?.approvedBudget || p.budget?.total || 0)}
                  </span>
                </div>
              </div>
            )) : (
              <DataCard
                title="Belum ada data proyek"
                description="Mulai dengan menambahkan proyek pertama Anda"
                isEmpty
              />
            )}
          </div>
        </Card>

        {/* Financial Overview */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Keuangan</h3>
          <FinancialOverviewChart 
            data={{
              totalIncome: dashboardData?.finance?.totalIncome || 0,
              totalExpense: dashboardData?.finance?.totalExpense || 0,
              netIncome: dashboardData?.finance?.netIncome || 0
            }}
          />
        </Card>

        {/* Alerts */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Peringatan</h3>
          <div className="space-y-2">
            {alerts.length > 0 ? alerts.slice(0, 6).map((al, idx) => (
              <Alert
                key={idx}
                type={al.type}
                title={al.title}
                message={al.message}
                variant="subtle"
                onDismiss={() => {
                  // Handle alert dismissal
                }}
              />
            )) : (
              <DataCard
                title="Tidak ada peringatan"
                description="Semua sistem berjalan normal"
                isEmpty
              />
            )}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
          <div className="space-y-3">
            {dashboardData?.recentActivities && dashboardData.recentActivities.length > 0 ? (
              dashboardData.recentActivities.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-medium">
                      {formatCurrency(activity.amount)}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <DataCard
                title="Belum ada aktivitas terbaru"
                description="Aktivitas akan muncul di sini setelah ada transaksi"
                isEmpty
              />
            )}
          </div>
        </Card>

        {/* Inventory Summary */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Inventory</h3>
          <InventoryStatusChart
            data={{
              lowStock: dashboardData?.inventory?.lowStock || 0,
              outOfStock: dashboardData?.inventory?.outOfStock || 0,
              totalValue: dashboardData?.inventory?.totalValue || 0
            }}
          />
        </Card>
      </div>

      {/* Enhanced Reporting Section - Phase 2 Week 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Budget Analysis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Analisis Budget Proyek</h3>
            <BarChart3 size={20} className="text-gray-400" />
          </div>
          {dashboardData?.projects?.budgetAnalysis ? (
            <BudgetChart
              contractValue={dashboardData.projects.budgetAnalysis.totalContract}
              actualCost={dashboardData.projects.budgetAnalysis.totalSpent}
              costBreakdown={dashboardData.projects.budgetAnalysis.breakdown}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <PieChart size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Data budget belum tersedia</p>
              </div>
            </div>
          )}
        </div>

        {/* Progress vs Budget Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Progress vs Budget</h3>
            <TrendingUp size={20} className="text-gray-400" />
          </div>
          {dashboardData?.projects?.progressAnalysis ? (
            <ProgressBudgetChart
              progress={dashboardData.projects.progressAnalysis.avgProgress}
              budgetUsed={dashboardData.projects.progressAnalysis.avgBudgetUsed}
              contractValue={100}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BarChart3 size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Data progress belum tersedia</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alerts and Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Peringatan & Notifikasi</h3>
          <AlertTriangle size={20} className="text-gray-400" />
        </div>
        <div className="space-y-3">
          {/* Sample alerts based on dashboard data */}
          {dashboardData?.alerts && dashboardData.alerts.length > 0 ? (
            dashboardData.alerts.map((alert, index) => (
              <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg border ${
                alert.type === 'error' ? 'bg-red-50 border-red-200' :
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <AlertTriangle size={16} className={`mt-0.5 ${
                  alert.type === 'error' ? 'text-red-600' :
                  alert.type === 'warning' ? 'text-yellow-600' :
                  'text-blue-600'
                }`} />
                <div>
                  <p className={`text-sm font-medium ${
                    alert.type === 'error' ? 'text-red-800' :
                    alert.type === 'warning' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {alert.title}
                  </p>
                  <p className={`text-xs ${
                    alert.type === 'error' ? 'text-red-700' :
                    alert.type === 'warning' ? 'text-yellow-700' :
                    'text-blue-700'
                  }`}>
                    {alert.message}
                  </p>
                </div>
                <div className="ml-auto">
                  <button className="text-xs text-gray-500 hover:text-gray-700">
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle size={16} className="text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Semua Sistem Normal</p>
                <p className="text-xs text-green-700">Tidak ada peringatan yang memerlukan perhatian</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Button
            variant="outline"
            className="flex flex-col items-center py-4 h-auto"
            as={Link}
            to="/admin/projects/new"
          >
            <FolderOpen size={24} className="mb-2" />
            <span className="text-sm font-medium">Proyek Baru</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center py-4 h-auto"
            as={Link}
            to="/admin/inventory"
          >
            <Package size={24} className="mb-2" />
            <span className="text-sm font-medium">Inventory</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center py-4 h-auto"
            as={Link}
            to="/admin/analytics"
          >
            <BarChart3 size={24} className="mb-2" />
            <span className="text-sm font-medium">Analytics</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center py-4 h-auto"
            as={Link}
            to="/admin/finance/transaction"
          >
            <DollarSign size={24} className="mb-2" />
            <span className="text-sm font-medium">Finance</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center py-4 h-auto"
            as={Link}
            to="/admin/manpower"
          >
            <Users size={24} className="mb-2" />
            <span className="text-sm font-medium">Manpower</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center py-4 h-auto"
            as={Link}
            to="/admin/users"
          >
            <CheckCircle size={24} className="mb-2" />
            <span className="text-sm font-medium">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
