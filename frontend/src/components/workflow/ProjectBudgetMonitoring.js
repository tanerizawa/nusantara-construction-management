import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  PieChart,
  Calculator,
  Target,
  Activity,
  RefreshCw,
  Download,
  Filter,
  Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';

const ProjectBudgetMonitoring = ({ projectId, project, onDataChange }) => {
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchBudgetData();
  }, [projectId, timeframe]);

  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/projects/${projectId}/budget-monitoring?timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBudgetData(data.data);
      }
    } catch (error) {
      console.error('Error fetching budget data:', error);
    } finally {
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

  const calculateVariancePercentage = (budgeted, actual) => {
    if (budgeted === 0) return 0;
    return ((actual - budgeted) / budgeted) * 100;
  };

  const getVarianceColor = (percentage) => {
    if (percentage <= 5) return 'text-green-600';
    if (percentage <= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (percentage) => {
    if (percentage <= 5) return CheckCircle;
    if (percentage <= 15) return AlertTriangle;
    return AlertCircle;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!budgetData) {
    return (
      <div className="text-center py-12">
        <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Data Budget Tidak Tersedia</h3>
        <p className="text-gray-600">Pastikan RAB sudah dibuat dan diapprove</p>
      </div>
    );
  }

  const summary = budgetData.summary || {};
  const categories = budgetData.categories || [];
  const timeline = budgetData.timeline || [];
  const alerts = budgetData.alerts || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Budget Monitoring</h2>
          <p className="text-gray-600">Real-time budget tracking untuk {project.name}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Mingguan</option>
            <option value="month">Bulanan</option>
            <option value="quarter">Kuartal</option>
          </select>
          
          <button
            onClick={fetchBudgetData}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-red-900 font-medium">Budget Alerts</h3>
          </div>
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div key={index} className="text-sm text-red-800">
                • {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalBudget || 0)}</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Committed</p>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(summary.committedAmount || 0)}</p>
              <p className="text-xs text-gray-500">
                {((summary.committedAmount || 0) / (summary.totalBudget || 1) * 100).toFixed(1)}% of budget
              </p>
            </div>
            <Activity className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Actual Spent</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.actualSpent || 0)}</p>
              <p className="text-xs text-gray-500">
                {((summary.actualSpent || 0) / (summary.totalBudget || 1) * 100).toFixed(1)}% of budget
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(summary.remainingBudget || 0)}</p>
              <div className="flex items-center mt-1">
                {summary.variancePercentage > 0 ? (
                  <TrendingUp className={`h-4 w-4 mr-1 ${getVarianceColor(Math.abs(summary.variancePercentage))}`} />
                ) : (
                  <TrendingDown className={`h-4 w-4 mr-1 ${getVarianceColor(Math.abs(summary.variancePercentage))}`} />
                )}
                <span className={`text-xs ${getVarianceColor(Math.abs(summary.variancePercentage))}`}>
                  {Math.abs(summary.variancePercentage || 0).toFixed(1)}% variance
                </span>
              </div>
            </div>
            <Calculator className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Budget Progress Bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Utilization</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Committed ({formatCurrency(summary.committedAmount || 0)})</span>
              <span>{((summary.committedAmount || 0) / (summary.totalBudget || 1) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${(summary.committedAmount || 0) / (summary.totalBudget || 1) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Actual Spent ({formatCurrency(summary.actualSpent || 0)})</span>
              <span>{((summary.actualSpent || 0) / (summary.totalBudget || 1) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${(summary.actualSpent || 0) / (summary.totalBudget || 1) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Budget by Category</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category, index) => {
                  const variance = calculateVariancePercentage(category.budgetAmount, category.actualAmount);
                  const StatusIcon = getStatusIcon(Math.abs(variance));
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(category.budgetAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(category.actualAmount)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getVarianceColor(Math.abs(variance))}`}>
                        {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusIcon className={`h-4 w-4 ${getVarianceColor(Math.abs(variance))}`} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="budgetAmount"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 360 / categories.length}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Budget Timeline */}
      {timeline.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Budget vs Actual Timeline</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="budgetAmount" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Budget"
                />
                <Line 
                  type="monotone" 
                  dataKey="actualAmount" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Actual"
                />
                <Line 
                  type="monotone" 
                  dataKey="committedAmount" 
                  stroke="#ffc658" 
                  strokeWidth={2}
                  name="Committed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Cash Flow Forecast */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Cash Flow Forecast</h3>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Next 3 months</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {budgetData.forecast?.map((month, index) => (
            <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">{month.month}</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(month.plannedExpenses)}</p>
              <p className="text-xs text-gray-500">Planned expenses</p>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Control Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <span>Set Budget Alert</span>
          </button>
          
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Calculator className="h-5 w-5 text-blue-600 mr-2" />
            <span>Budget Reallocation</span>
          </button>
          
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
            <span>Generate Report</span>
          </button>
          
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Target className="h-5 w-5 text-purple-600 mr-2" />
            <span>Set Milestone Budget</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectBudgetMonitoring;
