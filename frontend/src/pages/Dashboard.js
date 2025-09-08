import React, { useState, useEffect, useCallback } from 'react';
import { 
  FolderOpen, 
  Package, 
  Users, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  BarChart3,
  PieChart,
  RefreshCw,
  Target,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Calendar,
  Zap,
  AlertCircle,
  Eye
} from 'lucide-react';
import { projectAPI, financeAPI, employeeAPI, inventoryAPI, dashboardAPI } from '../services/api';
import { Link } from 'react-router-dom';

// Professional CSS Chart Components
const BarChart = ({ data, height = 200, className = "" }) => {
  if (!data || data.length === 0) return null;
  
  // Validate and clean data
  const validData = data.filter(d => d && typeof d.value === 'number' && !isNaN(d.value) && isFinite(d.value));
  if (validData.length === 0) return null;
  
  const maxValue = Math.max(...validData.map(d => d.value));
  
  return (
    <div className={`flex items-end justify-between h-${height} gap-2 ${className}`} style={{ height: `${height}px` }}>
      {validData.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-600 mb-1 truncate w-full text-center">
            {typeof item.value === 'number' ? new Intl.NumberFormat('id-ID').format(item.value) : item.value}
          </div>
          <div 
            className="w-full bg-blue-500 rounded-t-sm transition-all duration-700 ease-out min-h-[4px]"
            style={{ 
              height: `${maxValue > 0 ? (item.value / maxValue) * (height - 40) : 4}px`,
              background: item.color || `linear-gradient(to top, #3b82f6, #60a5fa)`
            }}
          />
          <div className="text-xs text-gray-500 mt-1 truncate w-full text-center">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({ data, size = 120, strokeWidth = 20 }) => {
  if (!data || data.length === 0) return null;
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let currentAngle = 0;
  
  return (
    <div className="flex items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
          />
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${(percentage * circumference) / 100} ${circumference}`;
            const strokeDashoffset = -((currentAngle * circumference) / 100);
            currentAngle += percentage;
            
            return (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 min-w-0 flex-1">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2 min-w-0">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-600 truncate flex-1">{item.label}</span>
            <span className="text-sm font-medium text-gray-900 flex-shrink-0">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LineChart = ({ data, height = 200, className = "" }) => {
  if (!data || data.length === 0) return null;
  
  // Validate and clean data
  const validData = data.filter(d => d && typeof d.value === 'number' && !isNaN(d.value) && isFinite(d.value));
  if (validData.length === 0) return null;
  
  const values = validData.map(d => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;
  const width = 300;
  
  const points = validData.map((item, index) => {
    const x = validData.length > 1 ? (index / (validData.length - 1)) * width : width / 2;
    const y = height - 40 - ((item.value - minValue) / range) * (height - 60);
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className={`${className}`} style={{ height: `${height}px` }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[...Array(5)].map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={40 + (i * (height - 80) / 4)}
            x2={width}
            y2={40 + (i * (height - 80) / 4)}
            stroke="#f3f4f6"
            strokeWidth="1"
          />
        ))}
        
        {/* Area fill */}
        <polygon
          points={`0,${height-40} ${points} ${width},${height-40}`}
          fill="url(#lineGradient)"
        />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          className="transition-all duration-500"
        />
        
        {/* Data points */}
        {validData.map((item, index) => {
          const x = validData.length > 1 ? (index / (validData.length - 1)) * width : width / 2;
          const y = height - 40 - ((item.value - minValue) / range) * (height - 60);
          
          // Additional validation for coordinates
          if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) return null;
          
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
              className="transition-all duration-300 hover:r-6"
            />
          );
        })}
        
        {/* Labels */}
        {validData.map((item, index) => {
          const x = validData.length > 1 ? (index / (validData.length - 1)) * width : width / 2;
          
          // Additional validation for x coordinate
          if (isNaN(x) || !isFinite(x)) return null;
          
          return (
            <text
              key={index}
              x={x}
              y={height - 10}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {item.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// Professional Components with proper overflow handling
const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = 'blue',
  loading = false,
  onClick = null 
}) => {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-600',
    green: 'from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-600',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-600',
    orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-600',
    red: 'from-red-50 to-red-100 border-red-200 text-red-600',
    yellow: 'from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-600'
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-lg ml-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:border-gray-300' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 mr-4">
          <p className="text-sm font-medium text-gray-600 mb-1 truncate">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2 truncate" title={value}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 truncate" title={subtitle}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              {trend.direction === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500 mr-1 flex-shrink-0" />}
              {trend.direction === 'down' && <TrendingDown className="w-4 h-4 text-red-500 mr-1 flex-shrink-0" />}
              {trend.direction === 'neutral' && <Minus className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />}
              <span className={`text-xs font-medium truncate ${
                trend.direction === 'up' ? 'text-emerald-600' : 
                trend.direction === 'down' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {trend.value}% {trend.label}
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center border bg-gradient-to-br flex-shrink-0 ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, children, loading = false, actions = null }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>
        {actions && <div className="flex items-center gap-2 ml-4">{actions}</div>}
      </div>
    </div>
    <div className="p-6">
      {loading ? (
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      ) : (
        children
      )}
    </div>
  </div>
);

const AlertCard = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-amber-500 flex-shrink-0" />
            <span className="truncate">Peringatan Sistem</span>
          </h3>
          <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0">
            {alerts.length}
          </span>
        </div>
      </div>
      <div className="p-4 max-h-64 overflow-y-auto">
        <div className="space-y-3">
          {alerts.slice(0, 5).map((alert, index) => (
            <div key={index} className={`p-3 rounded-lg border-l-4 ${
              alert.type === 'error' ? 'bg-red-50 border-red-400' :
              alert.type === 'warning' ? 'bg-amber-50 border-amber-400' :
              'bg-blue-50 border-blue-400'
            }`}>
              <div className="flex items-start justify-between min-w-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{alert.title}</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{alert.message}</p>
                </div>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ActivityCard = ({ activities }) => {
  if (!activities || activities.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />
            <span className="truncate">Aktivitas Terbaru</span>
          </h3>
          <Link 
            to="/projects" 
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium transition-colors flex-shrink-0"
          >
            <Eye className="w-4 h-4 mr-1" />
            Lihat Semua
          </Link>
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {activities.slice(0, 10).map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate" title={activity.title}>
                    {activity.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2" title={activity.description}>
                    {activity.description}
                  </p>
                  <div className="flex items-center mt-2 gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                      activity.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      activity.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                      activity.status === 'planning' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {activity.status === 'active' ? 'Aktif' :
                       activity.status === 'completed' ? 'Selesai' :
                       activity.status === 'planning' ? 'Perencanaan' : 'On Hold'}
                    </span>
                    <span className="text-xs text-gray-500 truncate">{activity.user}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [chartData, setChartData] = useState({
    revenue: [],
    projects: [],
    expenses: []
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real data from multiple endpoints
      const [projectsRes, financeRes, employeesRes, inventoryRes] = await Promise.all([
        projectAPI.getAll(),
        financeAPI.getAll(),
        employeeAPI.getAll(),
        inventoryAPI.getAll()
      ]);

      const projects = projectsRes.data || [];
      const finance = financeRes.data || [];
      const employees = employeesRes.data || [];
      const inventory = inventoryRes.data || [];

      // Calculate comprehensive statistics
      const projectStats = {
        total: projects.length,
        active: projects.filter(p => p.status === 'active').length,
        completed: projects.filter(p => p.status === 'completed').length,
        planning: projects.filter(p => p.status === 'planning').length,
        onHold: projects.filter(p => p.status === 'on_hold').length
      };

      const totalBudget = projects.reduce((sum, p) => sum + parseFloat(p.budget || 0), 0);
      const totalActualCost = projects.reduce((sum, p) => sum + parseFloat(p.actualCost || 0), 0);

      const financeStats = {
        totalIncome: finance.filter(f => f.transactionType === 'income').reduce((sum, f) => sum + parseFloat(f.amount || 0), 0),
        totalExpense: finance.filter(f => f.transactionType === 'expense').reduce((sum, f) => sum + parseFloat(f.amount || 0), 0),
        transactions: finance.length
      };

      const employeeStats = {
        total: employees.length,
        active: employees.filter(e => e.profile?.isActive).length,
        departments: [...new Set(employees.map(e => e.profile?.department).filter(Boolean))].length
      };

      const inventoryStats = {
        totalItems: inventory.length,
        totalValue: inventory.reduce((sum, i) => sum + (parseFloat(i.price || 0) * parseInt(i.quantity || 0)), 0),
        lowStock: inventory.filter(i => parseInt(i.quantity || 0) < parseInt(i.minStock || 5)).length,
        outOfStock: inventory.filter(i => parseInt(i.quantity || 0) === 0).length
      };

      // Set comprehensive dashboard data
      setDashboardData({
        projects: {
          ...projectStats,
          totalBudget,
          totalActualCost,
          efficiency: totalBudget > 0 ? ((totalBudget - totalActualCost) / totalBudget * 100) : 0
        },
        finance: {
          ...financeStats,
          netIncome: financeStats.totalIncome - financeStats.totalExpense,
          profitMargin: financeStats.totalIncome > 0 ? ((financeStats.totalIncome - financeStats.totalExpense) / financeStats.totalIncome * 100) : 0
        },
        employees: employeeStats,
        inventory: inventoryStats
      });

      // Generate chart data
      console.log('🔍 Preparing chart data...');
      const monthlyRevenue = generateMonthlyData(finance);
      const projectStatusData = [
        { label: 'Aktif', value: projectStats.active || 0, color: '#10b981' },
        { label: 'Selesai', value: projectStats.completed || 0, color: '#6b7280' },
        { label: 'Perencanaan', value: projectStats.planning || 0, color: '#3b82f6' },
        { label: 'On Hold', value: projectStats.onHold || 0, color: '#f59e0b' }
      ];
      
      const expenseCategories = generateExpenseData(finance);

      console.log('🔍 Chart data generated:', {
        revenue: monthlyRevenue,
        projects: projectStatusData,
        expenses: expenseCategories
      });

      setChartData({
        revenue: monthlyRevenue,
        projects: projectStatusData,
        expenses: expenseCategories
      });

      // Set recent activities
      const activities = projects.slice(0, 10).map(project => ({
        id: project.id,
        title: project.name,
        description: project.description || 'Tidak ada deskripsi',
        status: project.status,
        time: new Date(project.updatedAt).toLocaleDateString('id-ID'),
        user: project.updater?.profile?.fullName || 'Unknown'
      }));

      setRecentActivities(activities);

      // Generate alerts
      const alerts = generateAlerts(inventoryStats, projectStats, financeStats);
      setDashboardData(prev => ({ ...prev, alerts }));

      setLastUpdated(new Date());

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setError('Gagal memuat data dashboard. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  const generateMonthlyData = (finance) => {
    console.log('🔍 Generating monthly data from finance:', finance);
    
    if (!finance || !Array.isArray(finance)) {
      console.warn('⚠️ Finance data is not an array:', finance);
      return [];
    }

    const monthlyData = {};
    finance.forEach(transaction => {
      try {
        const date = new Date(transaction.transactionDate || transaction.createdAt);
        
        // Validate date
        if (isNaN(date.getTime())) {
          console.warn('⚠️ Invalid date in transaction:', transaction);
          return;
        }
        
        const monthKey = date.toLocaleDateString('id-ID', { month: 'short' });
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { income: 0, expense: 0 };
        }
        
        const amount = parseFloat(transaction.amount || 0);
        
        // Validate amount
        if (isNaN(amount) || !isFinite(amount)) {
          console.warn('⚠️ Invalid amount in transaction:', transaction);
          return;
        }
        
        if (transaction.transactionType === 'income') {
          monthlyData[monthKey].income += amount;
        } else {
          monthlyData[monthKey].expense += amount;
        }
      } catch (error) {
        console.error('❌ Error processing transaction:', transaction, error);
      }
    });
    
    const result = Object.entries(monthlyData).map(([month, data]) => {
      const value = data.income - data.expense;
      
      // Validate result value
      if (isNaN(value) || !isFinite(value)) {
        console.warn('⚠️ Invalid value calculated:', { month, data, value });
        return { label: month, value: 0 };
      }
      
      return {
        label: month,
        value: value
      };
    });
    
    console.log('✅ Generated monthly data:', result);
    return result;
  };

  const generateExpenseData = (finance) => {
    console.log('🔍 Generating expense data from finance:', finance);
    
    if (!finance || !Array.isArray(finance)) {
      console.warn('⚠️ Finance data is not an array for expenses:', finance);
      return [];
    }

    const expenses = finance.filter(f => f.transactionType === 'expense');
    const categories = {};
    
    expenses.forEach(expense => {
      try {
        const category = expense.category || 'Lainnya';
        const amount = parseFloat(expense.amount || 0);
        
        // Validate amount
        if (isNaN(amount) || !isFinite(amount)) {
          console.warn('⚠️ Invalid expense amount:', expense);
          return;
        }
        
        categories[category] = (categories[category] || 0) + amount;
      } catch (error) {
        console.error('❌ Error processing expense:', expense, error);
      }
    });
    
    const result = Object.entries(categories).map(([category, amount]) => {
      // Validate final amount
      if (isNaN(amount) || !isFinite(amount)) {
        console.warn('⚠️ Invalid category amount:', { category, amount });
        return { label: category, value: 0 };
      }
      
      return {
        label: category,
        value: amount
      };
    });
    
    console.log('✅ Generated expense data:', result);
    return result;
  };

  const generateAlerts = (inventory, projects, finance) => {
    const alerts = [];
    
    if (inventory.lowStock > 0) {
      alerts.push({
        type: 'warning',
        title: 'Stok Inventori Rendah',
        message: `${inventory.lowStock} item memiliki stok di bawah minimum`,
        time: 'Baru saja'
      });
    }
    
    if (projects.onHold > 0) {
      alerts.push({
        type: 'warning',
        title: 'Proyek On Hold',
        message: `${projects.onHold} proyek sedang dalam status on hold`,
        time: '1 jam lalu'
      });
    }
    
    if (finance.netIncome < 0) {
      alerts.push({
        type: 'error',
        title: 'Defisit Keuangan',
        message: 'Total pengeluaran melebihi pendapatan periode ini',
        time: '2 jam lalu'
      });
    }
    
    return alerts;
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <StatCard key={i} loading={true} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">
            Dashboard Analytics
          </h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">
            Ringkasan lengkap performa bisnis realtime
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Update: {lastUpdated.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button 
            onClick={fetchDashboardData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

        {/* Alerts */}
        {dashboardData?.alerts && dashboardData.alerts.length > 0 && (
          <AlertCard alerts={dashboardData.alerts} />
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            title="Total Proyek"
            value={formatNumber(dashboardData?.projects?.total || 0)}
            subtitle={`${dashboardData?.projects?.active || 0} aktif • ${dashboardData?.projects?.completed || 0} selesai`}
            icon={Briefcase}
            color="blue"
            trend={{
              direction: 'up',
              value: 12,
              label: 'bulan ini'
            }}
          />
          <StatCard
            title="Budget Efisiensi"
            value={`${dashboardData?.projects?.efficiency?.toFixed(1) || 0}%`}
            subtitle={`Budget: ${formatRupiah(dashboardData?.projects?.totalBudget || 0)}`}
            icon={Target}
            color="green"
            trend={{
              direction: 'up',
              value: 8,
              label: 'efisiensi'
            }}
          />
          <StatCard
            title="Total SDM"
            value={formatNumber(dashboardData?.employees?.total || 0)}
            subtitle={`${dashboardData?.employees?.active || 0} aktif • ${dashboardData?.employees?.departments || 0} divisi`}
            icon={Users}
            color="purple"
            trend={{
              direction: 'up',
              value: 5,
              label: 'pertumbuhan'
            }}
          />
          <StatCard
            title="Net Revenue"
            value={formatRupiah(dashboardData?.finance?.netIncome || 0)}
            subtitle={`Margin: ${dashboardData?.finance?.profitMargin?.toFixed(1) || 0}%`}
            icon={DollarSign}
            color={dashboardData?.finance?.netIncome >= 0 ? 'green' : 'red'}
            trend={{
              direction: dashboardData?.finance?.netIncome >= 0 ? 'up' : 'down',
              value: 15,
              label: 'periode ini'
            }}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Tren Revenue Bulanan">
            <LineChart 
              data={chartData.revenue} 
              height={250}
              className="w-full"
            />
          </ChartCard>
          
          <ChartCard title="Status Proyek">
            <DonutChart 
              data={chartData.projects}
              size={180}
              strokeWidth={25}
            />
          </ChartCard>
        </div>

        {/* Expense Chart */}
        <ChartCard title="Kategori Pengeluaran">
          <BarChart 
            data={chartData.expenses}
            height={300}
            className="w-full"
          />
        </ChartCard>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Inventori</h3>
              <Package className="w-5 h-5 text-orange-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Item</span>
                <span className="font-semibold">{formatNumber(dashboardData?.inventory?.totalItems || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Nilai Total</span>
                <span className="font-semibold">{formatRupiah(dashboardData?.inventory?.totalValue || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Stok Rendah</span>
                <span className="font-semibold text-amber-600">{dashboardData?.inventory?.lowStock || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Keuangan</h3>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pendapatan</span>
                <span className="font-semibold text-green-600">{formatRupiah(dashboardData?.finance?.totalIncome || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pengeluaran</span>
                <span className="font-semibold text-red-600">{formatRupiah(dashboardData?.finance?.totalExpense || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Transaksi</span>
                <span className="font-semibold">{dashboardData?.finance?.transactions || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Efisiensi Budget</span>
                <span className="font-semibold">{dashboardData?.projects?.efficiency?.toFixed(1) || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profit Margin</span>
                <span className="font-semibold">{dashboardData?.finance?.profitMargin?.toFixed(1) || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Proyek Aktif</span>
                <span className="font-semibold">{dashboardData?.projects?.active || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <ActivityCard activities={recentActivities} />
      </div>
  );
};

export default Dashboard;
