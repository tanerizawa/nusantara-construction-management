import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  ShoppingCart,
  FileText,
  RefreshCw,
  Filter,
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import ProjectFinanceIntegrationService from '../../services/ProjectFinanceIntegrationService';

const ProjectFinanceIntegrationDashboard = ({ selectedSubsidiary, selectedProject, compact = false }) => {
  const [integrationData, setIntegrationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch integrated data
  const fetchIntegratedData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters = {};
      
      if (selectedSubsidiary && selectedSubsidiary !== 'all') {
        filters.subsidiaryId = selectedSubsidiary;
      }
      
      if (selectedProject && selectedProject !== 'all') {
        filters.projectId = selectedProject;
      }
      
      const response = await ProjectFinanceIntegrationService.getIntegratedFinancialData(filters);
      
      if (response.success) {
        setIntegrationData(response.data);
        setLastUpdate(new Date().toLocaleTimeString('id-ID'));
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching integrated data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh setup
  useEffect(() => {
    fetchIntegratedData();
  }, [selectedSubsidiary, selectedProject]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchIntegratedData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, selectedSubsidiary, selectedProject]);

  // Manual refresh
  const handleManualRefresh = () => {
    fetchIntegratedData();
  };

  // Format currency
  const formatCurrency = ProjectFinanceIntegrationService.formatCurrency;

  if (loading && !integrationData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
          <span className="text-gray-600">Loading integrated financial data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 font-medium">Error loading data</span>
        </div>
        <p className="text-red-600 text-sm mt-2">{error}</p>
        <button
          onClick={handleManualRefresh}
          className="mt-3 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!integrationData) {
    return (
      <div className="text-center p-8 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No integrated financial data available</p>
      </div>
    );
  }

  const { metrics, projects, transactions, poTransactions } = integrationData;

  return (
    <div className="space-y-6">
      {/* Header with refresh controls */}
      {!compact && (
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Project Finance Integration</h3>
            <p className="text-sm text-gray-600">
              Real-time synchronization between project transactions and finance data
            </p>
            {lastUpdate && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {lastUpdate}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-600">Auto-refresh</span>
            </label>
            
            <button
              onClick={handleManualRefresh}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-1"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      )}

      {/* Overview Metrics */}
      <div className={`grid grid-cols-1 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'} gap-6`}>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.overview.activeProjects}</p>
              <p className="text-xs text-gray-500">of {metrics.overview.totalProjects} total</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(metrics.overview.totalIncome)}</p>
              <p className="text-xs text-gray-500">{metrics.overview.totalTransactions} transactions</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(metrics.overview.totalExpense)}</p>
              <p className="text-xs text-gray-500">including PO commitments</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">PO Transactions</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.overview.poTransactions}</p>
              <p className="text-xs text-gray-500">{formatCurrency(metrics.overview.totalPOAmount)}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Net Income Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Financial Summary</h4>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            metrics.overview.netIncome >= 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            Net Income: {formatCurrency(metrics.overview.netIncome)}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Income</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(metrics.overview.totalIncome)}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600">Expenses</p>
            <p className="text-xl font-bold text-red-600">{formatCurrency(metrics.overview.totalExpense)}</p>
          </div>
          <div className={`p-4 rounded-lg ${
            metrics.overview.netIncome >= 0 ? 'bg-blue-50' : 'bg-orange-50'
          }`}>
            <p className="text-sm text-gray-600">Net Result</p>
            <p className={`text-xl font-bold ${
              metrics.overview.netIncome >= 0 ? 'text-blue-600' : 'text-orange-600'
            }`}>
              {formatCurrency(metrics.overview.netIncome)}
            </p>
          </div>
        </div>
      </div>

      {/* Project Breakdown */}
      {!compact && metrics.projectBreakdown.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h4 className="text-lg font-semibold text-gray-900">Project Breakdown</h4>
            <p className="text-sm text-gray-600">Financial performance by project</p>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Income</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expenses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Income</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PO Count</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transactions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {metrics.projectBreakdown.map((project, index) => (
                    <tr key={project.projectId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{project.projectName}</div>
                            <div className="text-xs text-gray-500">{project.projectId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {formatCurrency(project.income)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                        {formatCurrency(project.expense)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          project.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(project.netIncome)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {project.poCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.transactionCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {!compact && metrics.recentActivity.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h4 className="text-lg font-semibold text-gray-900">Recent Financial Activity</h4>
            <p className="text-sm text-gray-600">Latest transactions across all projects</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-3">
              {metrics.recentActivity.slice(0, 5).map((transaction, index) => (
                <div key={transaction.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <Activity className={`w-4 h-4 ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.description || transaction.desc || 'No description'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.date ? new Date(transaction.date).toLocaleDateString('id-ID') : 'No date'}
                        {transaction.category && ` • ${transaction.category}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    {transaction.purchaseOrderId && (
                      <p className="text-xs text-blue-600">PO Linked</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectFinanceIntegrationDashboard;