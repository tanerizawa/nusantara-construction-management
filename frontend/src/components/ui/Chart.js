import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

/**
 * Chart Wrapper Components - Apple HIG Compliant
 * 
 * Wrapper components for chart libraries with consistent styling and UX
 * Following Apple Human Interface Guidelines for data visualization
 */

// Budget Tracking Chart Component
export const BudgetChart = ({ 
  projectId, 
  contractValue = 0, 
  actualCost = 0, 
  estimatedCost = 0,
  costBreakdown = [],
  showProjections = true 
}) => {
  const remaining = contractValue - actualCost;
  const percentage = contractValue > 0 ? (actualCost / contractValue) * 100 : 0;
  const isOverBudget = actualCost > contractValue;
  
  return (
    <ChartContainer 
      title="Budget Tracking" 
      subtitle={`Contract: ${formatCurrency(contractValue)} • Spent: ${formatCurrency(actualCost)}`}
      height="h-80"
    >
      <div className="p-6">
        {/* Budget Overview Bars */}
        <div className="space-y-4 mb-6">
          {/* Contract vs Actual */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Biaya Aktual</span>
              <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  isOverBudget 
                    ? 'bg-red-500' 
                    : percentage > 80 
                    ? 'bg-orange-500' 
                    : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
          </div>
          
          {/* Estimated vs Contract */}
          {showProjections && estimatedCost > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Proyeksi Total</span>
                <span className="text-sm font-medium">
                  {((estimatedCost / contractValue) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((estimatedCost / contractValue) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Cost Breakdown */}
        {costBreakdown.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Rincian Biaya</h4>
            <div className="space-y-2">
              {costBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">{item.category}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">{formatCurrency(item.amount)}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({((item.amount / actualCost) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budget Status Alert */}
        {isOverBudget && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center">
              <TrendingDown size={16} className="text-red-600 mr-2" />
              <span className="text-sm font-medium text-red-800">
                Anggaran terlampaui sebesar {formatCurrency(Math.abs(remaining))}
              </span>
            </div>
          </div>
        )}
      </div>
    </ChartContainer>
  );
};

// Project Milestone Chart
export const MilestoneChart = ({ milestones = [], projectTimeline = {} }) => {
  const today = new Date();
  const startDate = new Date(projectTimeline.startDate);
  const endDate = new Date(projectTimeline.endDate);
  const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
  
  return (
    <ChartContainer title="Milestone Timeline" height="h-64">
      <div className="p-6">
        {milestones.length > 0 ? (
          <div className="space-y-4">
            {milestones.map((milestone, index) => {
              const milestoneDate = new Date(milestone.dueDate);
              const daysFromStart = (milestoneDate - startDate) / (1000 * 60 * 60 * 24);
              const position = (daysFromStart / totalDays) * 100;
              const isPast = milestoneDate < today;
              const isCompleted = milestone.completed;
              
              return (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {milestone.title}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(milestone.dueDate)}
                    </span>
                  </div>
                  
                  {/* Timeline Bar */}
                  <div className="relative w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`absolute h-2 rounded-full ${
                        isCompleted 
                          ? 'bg-green-500' 
                          : isPast 
                          ? 'bg-red-500' 
                          : 'bg-blue-500'
                      }`}
                      style={{ 
                        left: `${Math.max(0, position - 1)}%`,
                        width: '2%'
                      }}
                    ></div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mt-1">
                    {milestone.description}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Belum ada milestone</p>
          </div>
        )}
      </div>
    </ChartContainer>
  );
};

// Progress vs Budget Chart
export const ProgressBudgetChart = ({ 
  progress = 0, 
  budgetUsed = 0, 
  contractValue = 0,
  timeline = {} 
}) => {
  const budgetPercentage = contractValue > 0 ? (budgetUsed / contractValue) * 100 : 0;
  const isOnTrack = Math.abs(progress - budgetPercentage) <= 10;
  
  return (
    <ChartContainer 
      title="Progress vs Budget" 
      subtitle="Perbandingan kemajuan proyek dengan penggunaan anggaran"
      height="h-72"
    >
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Progress Circle */}
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${
                    progress >= budgetPercentage ? 'text-green-500' : 'text-blue-500'
                  }`}
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${progress}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">{progress}%</span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-700">Progress Fisik</p>
          </div>
          
          {/* Budget Circle */}
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${
                    budgetPercentage > 80 ? 'text-red-500' : 
                    budgetPercentage > 60 ? 'text-orange-500' : 'text-blue-500'
                  }`}
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${budgetPercentage}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">{budgetPercentage.toFixed(0)}%</span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-700">Budget Terpakai</p>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="mt-6 p-3 rounded-lg border">
          <div className="flex items-center justify-center">
            {isOnTrack ? (
              <>
                <TrendingUp size={16} className="text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">Proyek On Track</span>
              </>
            ) : progress > budgetPercentage ? (
              <>
                <TrendingUp size={16} className="text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">
                  Progress Lebih Cepat dari Budget
                </span>
              </>
            ) : (
              <>
                <TrendingDown size={16} className="text-red-600 mr-2" />
                <span className="text-sm font-medium text-red-800">
                  Budget Lebih Cepat dari Progress
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </ChartContainer>
  );
};

// Helper function for currency formatting
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper function for date formatting  
const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return '-';
  }
};

// Base Chart Container
export const ChartContainer = ({
  children,
  title,
  subtitle,
  actions,
  loading = false,
  error = null,
  height = 'h-64',
  className = '',
  ...props
}) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${className}`} {...props}>
      {/* Chart Header */}
      {(title || subtitle || actions) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            
            {actions && (
              <div className="flex items-center space-x-2">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Chart Content */}
      <div className={`relative ${height} p-6`}>
        {loading ? (
          <ChartSkeleton />
        ) : error ? (
          <ChartError error={error} />
        ) : (
          children
        )}
      </div>
    </div>
  );
};

// Chart Loading Skeleton
export const ChartSkeleton = ({ type = 'bar' }) => {
  const renderBarSkeleton = () => (
    <div className="flex items-end justify-center space-x-2 h-full">
      {[40, 70, 45, 80, 60, 55, 75].map((height, index) => (
        <div
          key={index}
          className="bg-gray-200 rounded-t animate-pulse"
          style={{ 
            height: `${height}%`, 
            width: '12%',
            minHeight: '20px'
          }}
        />
      ))}
    </div>
  );
  
  const renderLineSkeleton = () => (
    <div className="relative h-full">
      <div className="absolute inset-0 flex items-center">
        <svg className="w-full h-32" viewBox="0 0 400 120">
          <path
            d="M10,80 Q50,20 100,40 T200,30 Q250,10 300,25 T390,40"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="3"
            className="animate-pulse"
          />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="w-8 h-2 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
  
  const renderPieSkeleton = () => (
    <div className="flex items-center justify-center h-full">
      <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
    </div>
  );
  
  const skeletons = {
    bar: renderBarSkeleton,
    line: renderLineSkeleton,
    pie: renderPieSkeleton
  };
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      {skeletons[type]?.() || renderBarSkeleton()}
    </div>
  );
};

// Chart Error State
export const ChartError = ({ error = 'Gagal memuat data chart' }) => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <BarChart3 size={48} className="text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 text-sm">{error}</p>
    </div>
  </div>
);

// Chart Empty State
export const ChartEmpty = ({ message = 'Tidak ada data untuk ditampilkan' }) => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <PieChart size={48} className="text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  </div>
);

// KPI Chart Card
export const KPIChart = ({
  title,
  value,
  previousValue,
  unit = '',
  format = 'number',
  trend = 'neutral',
  trendPercentage,
  icon: Icon = TrendingUp,
  color = 'blue',
  chart,
  className = '',
  ...props
}) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    purple: 'text-purple-600 bg-purple-100'
  };
  
  const trends = {
    up: { icon: TrendingUp, color: 'text-green-600' },
    down: { icon: TrendingDown, color: 'text-red-600' },
    neutral: { icon: TrendingUp, color: 'text-gray-600' }
  };
  
  const formatValue = (val) => {
    if (format === 'currency') {
      return `Rp ${val.toLocaleString('id-ID')}`;
    }
    if (format === 'percentage') {
      return `${val}%`;
    }
    return val.toLocaleString('id-ID');
  };
  
  const TrendIcon = trends[trend].icon;
  
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`} {...props}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon size={24} />
        </div>
        
        {trendPercentage && (
          <div className={`flex items-center space-x-1 ${trends[trend].color}`}>
            <TrendIcon size={16} />
            <span className="text-sm font-medium">{trendPercentage}%</span>
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-1">
          {title}
        </h3>
        <p className="text-2xl font-bold text-gray-900">
          {formatValue(value)} {unit}
        </p>
        
        {previousValue && (
          <p className="text-sm text-gray-500">
            Sebelumnya: {formatValue(previousValue)} {unit}
          </p>
        )}
      </div>
      
      {chart && (
        <div className="h-16">
          {chart}
        </div>
      )}
    </div>
  );
};

// Revenue Chart
export const RevenueChart = ({
  data = [],
  title = 'Pendapatan',
  timeframe = 'monthly',
  className = '',
  ...props
}) => {
  // Filter and sanitize data
  const validData = data.filter(item => item && typeof item.value === 'number' && !isNaN(item.value));
  const total = validData.reduce((sum, item) => sum + (item.value || 0), 0);
  
  return (
    <ChartContainer
      title={title}
      subtitle={`Total: Rp ${total.toLocaleString('id-ID')}`}
      className={className}
      {...props}
    >
      {validData.length > 0 ? (
        <div className="space-y-4">
          {/* Simple bar visualization */}
          <div className="flex items-end justify-between h-32 space-x-2">
            {validData.map((item, index) => {
              const maxValue = Math.max(...validData.map(d => d.value || 0));
              const percentage = maxValue > 0 ? ((item.value || 0) / maxValue) * 100 : 0;
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-blue-500 rounded-t transition-all duration-500 min-h-[4px]"
                    style={{ height: `${percentage}%` }}
                  />
                  <span className="text-xs text-gray-500 mt-2 truncate">
                    {item.label || 'No Label'}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Data summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            {validData.slice(0, 4).map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-sm font-medium text-gray-900">
                  Rp {(item.value || 0).toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-gray-500">{item.label || 'No Label'}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ChartEmpty message="Belum ada data pendapatan" />
      )}
    </ChartContainer>
  );
};

// Project Progress Chart
export const ProjectProgressChart = ({
  projects = [],
  title = 'Progress Proyek',
  className = '',
  ...props
}) => {
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'in-progress').length;
  const pendingProjects = totalProjects - completedProjects - inProgressProjects;
  
  const stats = [
    { label: 'Selesai', value: completedProjects, color: 'bg-green-500' },
    { label: 'Berjalan', value: inProgressProjects, color: 'bg-blue-500' },
    { label: 'Pending', value: pendingProjects, color: 'bg-gray-300' }
  ];
  
  return (
    <ChartContainer
      title={title}
      subtitle={`Total ${totalProjects} proyek`}
      className={className}
      {...props}
    >
      {totalProjects > 0 ? (
        <div className="space-y-6">
          {/* Progress bars */}
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                  <span className="text-sm font-medium text-gray-700">
                    {stat.label}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${stat.color}`}
                      style={{ width: `${(stat.value / totalProjects) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 min-w-[2rem]">
                    {stat.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Recent projects */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Proyek Terbaru</h4>
            <div className="space-y-2">
              {projects.slice(0, 3).map((project, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate">{project.name}</span>
                  <span className="text-xs text-gray-500">{project.progress}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <ChartEmpty message="Belum ada data proyek" />
      )}
    </ChartContainer>
  );
};

// Financial Overview Chart
export const FinancialOverviewChart = ({
  income = 0,
  expense = 0,
  profit = 0,
  title = 'Ringkasan Keuangan',
  period = 'Bulan ini',
  className = '',
  ...props
}) => {
  // Ensure values are numbers and not null/undefined
  const safeIncome = typeof income === 'number' && !isNaN(income) ? income : 0;
  const safeExpense = typeof expense === 'number' && !isNaN(expense) ? expense : 0;
  const safeProfit = typeof profit === 'number' && !isNaN(profit) ? profit : 0;
  
  const data = [
    { label: 'Pemasukan', value: safeIncome, color: 'bg-green-500', icon: DollarSign },
    { label: 'Pengeluaran', value: safeExpense, color: 'bg-red-500', icon: DollarSign },
    { label: 'Keuntungan', value: safeProfit, color: 'bg-blue-500', icon: TrendingUp }
  ];
  
  return (
    <ChartContainer
      title={title}
      subtitle={period}
      className={className}
      {...props}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 h-full">
        {data.map((item, index) => (
          <div key={index} className="text-center">
            <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-3 ${item.color.replace('bg-', 'bg-').replace('-500', '-100')} text-${item.color.split('-')[1]}-600`}>
              <item.icon size={24} />
            </div>
            
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              {item.label}
            </h4>
            <p className="text-lg font-bold text-gray-900">
              Rp {Math.abs(item.value || 0).toLocaleString('id-ID')}
            </p>
          </div>
        ))}
      </div>
    </ChartContainer>
  );
};

const ChartComponents = {
  ChartContainer,
  ChartSkeleton,
  ChartError,
  ChartEmpty,
  KPIChart,
  RevenueChart,
  ProjectProgressChart,
  FinancialOverviewChart
};

export default ChartComponents;
