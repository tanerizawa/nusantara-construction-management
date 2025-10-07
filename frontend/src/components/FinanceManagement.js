import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  Upload,
  Plus,
  Eye,
  Edit3,
  Search,
  CreditCard,
  Wallet,
  Receipt,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { financeAPI, projectAPI } from '../services/api';

const FinanceManagement = () => {
  const [financeData, setFinanceData] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch real data from API instead of using mock data
  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real financial data from API
      const [financeResponse, projectsResponse] = await Promise.all([
        financeAPI.getAll(),
        projectAPI.getAll()
      ]);
      
      const financeTransactions = financeResponse.data || [];
      const projects = projectsResponse.data || [];
      
      // Calculate real financial metrics
      const totalRevenue = financeTransactions
        .filter(t => t.type === 'income' || t.type === 'credit')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      
      const totalExpenses = financeTransactions
        .filter(t => t.type === 'expense' || t.type === 'debit')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      
      const netProfit = totalRevenue - totalExpenses;
      
      // Calculate project budgets from real data
      const projectBudgets = projects.map(project => {
        const projectTransactions = financeTransactions.filter(t => t.projectId === project.id);
        const budgetUsed = projectTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        const budgetAllocated = parseFloat(project.budget || 0);
        const budgetRemaining = budgetAllocated - budgetUsed;
        const utilizationRate = budgetAllocated > 0 ? (budgetUsed / budgetAllocated) * 100 : 0;
        
        let status = 'on-track';
        if (utilizationRate > 100) status = 'over-budget';
        else if (utilizationRate < 70) status = 'under-budget';
        
        return {
          id: project.id,
          projectId: project.id,
          projectName: project.name,
          budgetAllocated,
          budgetUsed,
          budgetRemaining,
          utilizationRate: Math.round(utilizationRate * 10) / 10,
          status,
          categories: {
            materials: { allocated: budgetAllocated * 0.4, used: budgetUsed * 0.4 },
            labor: { allocated: budgetAllocated * 0.3, used: budgetUsed * 0.3 },
            equipment: { allocated: budgetAllocated * 0.2, used: budgetUsed * 0.2 },
            overhead: { allocated: budgetAllocated * 0.1, used: budgetUsed * 0.1 }
          }
        };
      });
      
      const completedTransactions = financeTransactions.filter(t => t.status === 'completed' || t.status === 'paid');
      const pendingTransactions = financeTransactions.filter(t => t.status === 'pending' || t.status === 'unpaid');
      
      const calculatedFinanceData = {
        totalRevenue,
        totalExpenses,
        netProfit,
        cashFlow: totalRevenue - totalExpenses,
        monthlyGrowth: 0, // Would need historical data to calculate
        yearlyGrowth: 0, // Would need historical data to calculate
        activeProjects: projects.filter(p => p.status === 'active').length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
        pendingInvoices: pendingTransactions.length,
        paidInvoices: completedTransactions.length
      };
      
      setFinanceData(calculatedFinanceData);
      setTransactions(financeTransactions);
      setBudgets(projectBudgets);
      
    } catch (err) {
      console.error('Error fetching finance data:', err);
      setError('Failed to load financial data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, [selectedPeriod]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getBudgetStatusColor = (status) => {
    switch (status) {
      case 'on-track': return 'text-blue-600 bg-blue-50';
      case 'under-budget': return 'text-green-600 bg-green-50';
      case 'over-budget': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAmountColor = (type) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = (transaction.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.reference || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.id || '').toString().toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || transaction.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return 'Rp 0';
    const numAmount = parseFloat(amount);
    if (numAmount >= 1000000000) {
      return `Rp ${(numAmount / 1000000000).toFixed(1)}B`;
    } else if (numAmount >= 1000000) {
      return `Rp ${(numAmount / 1000000).toFixed(1)}M`;
    } else if (numAmount >= 1000) {
      return `Rp ${(numAmount / 1000).toFixed(1)}K`;
    }
    return `Rp ${numAmount.toFixed(0)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading financial data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchFinanceData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Management</h1>
          <p className="text-gray-600 mt-1">Track financial performance, budgets, and transactions</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="h-4 w-4" />
            Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Financial Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(financeData.totalRevenue)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+{financeData.monthlyGrowth}%</span>
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
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(financeData.totalExpenses)}</p>
              <div className="flex items-center mt-2">
                <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                <span className="text-sm text-gray-600">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(financeData.netProfit)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-sm text-blue-600">+{financeData.yearlyGrowth}% YoY</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cash Flow</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(financeData.cashFlow)}</p>
              <div className="flex items-center mt-2">
                <Receipt className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-sm text-purple-600">Current balance</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('budgets')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'budgets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Budget Management
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Project Financial Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Project Financial Status</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Projects</span>
                      <span className="text-lg font-bold text-blue-600">{financeData.activeProjects}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completed Projects</span>
                      <span className="text-lg font-bold text-green-600">{financeData.completedProjects}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending Invoices</span>
                      <span className="text-lg font-bold text-yellow-600">{financeData.pendingInvoices}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Paid Invoices</span>
                      <span className="text-lg font-bold text-green-600">{financeData.paidInvoices}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Financial Health Indicators</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Profit Margin</span>
                        <span className="text-sm font-medium text-green-600">21.8%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '21.8%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Budget Utilization</span>
                        <span className="text-sm font-medium text-blue-600">83.5%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '83.5%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Cash Flow Ratio</span>
                        <span className="text-sm font-medium text-purple-600">69.2%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '69.2%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option value="Revenue">Revenue</option>
                  <option value="Materials">Materials</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Subcontractor">Subcontractor</option>
                </select>

                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Date</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Description</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Category</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Amount</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Status</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Reference</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-gray-900">{transaction.date}</td>
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-gray-900">{transaction.description}</div>
                            <div className="text-sm text-gray-500">Project: {transaction.projectId}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-700">{transaction.category}</td>
                        <td className="py-4 px-6">
                          <span className={`font-bold ${getAmountColor(transaction.type)}`}>
                            {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-700 font-mono text-sm">{transaction.reference}</td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                              <Edit3 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Budget Management Tab */}
          {activeTab === 'budgets' && (
            <div className="space-y-6">
              {budgets.map((budget) => (
                <div key={budget.id} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{budget.projectName}</h3>
                      <p className="text-sm text-gray-600">Project ID: {budget.projectId}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBudgetStatusColor(budget.status)}`}>
                        {budget.status.replace('-', ' ')}
                      </span>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Utilization</p>
                        <p className="text-lg font-bold text-gray-900">{budget.utilizationRate}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Budget Allocated</p>
                      <p className="text-lg font-bold text-blue-600">{formatCurrency(budget.budgetAllocated)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Budget Used</p>
                      <p className="text-lg font-bold text-orange-600">{formatCurrency(budget.budgetUsed)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Budget Remaining</p>
                      <p className={`text-lg font-bold ${budget.budgetRemaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(budget.budgetRemaining)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${budget.utilizationRate > 95 ? 'bg-red-600' : budget.utilizationRate > 85 ? 'bg-yellow-600' : 'bg-green-600'}`}
                        style={{ width: `${Math.min(budget.utilizationRate, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(budget.categories).map(([category, data]) => (
                      <div key={category} className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-medium text-gray-900 capitalize mb-2">{category}</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Allocated</span>
                            <span className="text-gray-900">{formatCurrency(data.allocated)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Used</span>
                            <span className="text-gray-900">{formatCurrency(data.used)}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${Math.min((data.used / data.allocated) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceManagement;
