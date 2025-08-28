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
  Receipt
} from 'lucide-react';

const FinanceManagement = () => {
  const [financeData, setFinanceData] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock financial data
    const mockFinanceData = {
      totalRevenue: 15750000000,
      totalExpenses: 12320000000,
      netProfit: 3430000000,
      cashFlow: 8520000000,
      monthlyGrowth: 12.5,
      yearlyGrowth: 28.3,
      activeProjects: 15,
      completedProjects: 8,
      pendingInvoices: 25,
      paidInvoices: 142
    };

    const mockTransactions = [
    {
      id: 1,
      date: '2025-08-25',
      description: 'Project Payment - Mall Construction',
      category: 'Revenue',
      type: 'income',
      amount: 2500000000,
      status: 'completed',
      projectId: 'PRJ-001',
      reference: 'INV-2025-0825-001'
    },
    {
      id: 2,
      date: '2025-08-24',
      description: 'Material Purchase - Cement & Steel',
      category: 'Materials',
      type: 'expense',
      amount: 850000000,
      status: 'completed',
      projectId: 'PRJ-002',
      reference: 'PO-2025-0824-001'
    },
    {
      id: 3,
      date: '2025-08-23',
      description: 'Equipment Rental - Heavy Machinery',
      category: 'Equipment',
      type: 'expense',
      amount: 425000000,
      status: 'pending',
      projectId: 'PRJ-003',
      reference: 'RNT-2025-0823-001'
    },
    {
      id: 4,
      date: '2025-08-22',
      description: 'Contractor Payment - Electrical Works',
      category: 'Subcontractor',
      type: 'expense',
      amount: 675000000,
      status: 'completed',
      projectId: 'PRJ-001',
      reference: 'PAY-2025-0822-001'
    },
    {
      id: 5,
      date: '2025-08-21',
      description: 'Project Payment - Office Building',
      category: 'Revenue',
      type: 'income',
      amount: 1850000000,
      status: 'completed',
      projectId: 'PRJ-004',
      reference: 'INV-2025-0821-001'
    }
    ];

    const mockBudgets = [
    {
      id: 1,
      projectId: 'PRJ-001',
      projectName: 'Mall Construction',
      budgetAllocated: 15000000000,
      budgetUsed: 12500000000,
      budgetRemaining: 2500000000,
      utilizationRate: 83.3,
      status: 'on-track',
      categories: {
        materials: { allocated: 6000000000, used: 5200000000 },
        labor: { allocated: 4500000000, used: 3800000000 },
        equipment: { allocated: 2500000000, used: 2100000000 },
        overhead: { allocated: 2000000000, used: 1400000000 }
      }
    },
    {
      id: 2,
      projectId: 'PRJ-002',
      projectName: 'Office Building',
      budgetAllocated: 12000000000,
      budgetUsed: 8500000000,
      budgetRemaining: 3500000000,
      utilizationRate: 70.8,
      status: 'under-budget',
      categories: {
        materials: { allocated: 4800000000, used: 3600000000 },
        labor: { allocated: 3600000000, used: 2800000000 },
        equipment: { allocated: 2000000000, used: 1400000000 },
        overhead: { allocated: 1600000000, used: 700000000 }
      }
    },
    {
      id: 3,
      projectId: 'PRJ-003',
      projectName: 'Residential Complex',
      budgetAllocated: 8500000000,
      budgetUsed: 8200000000,
      budgetRemaining: 300000000,
      utilizationRate: 96.5,
      status: 'over-budget',
      categories: {
        materials: { allocated: 3400000000, used: 3500000000 },
        labor: { allocated: 2550000000, used: 2600000000 },
        equipment: { allocated: 1700000000, used: 1650000000 },
        overhead: { allocated: 850000000, used: 450000000 }
      }
    }
    ];

    // Simulate API call
    setTimeout(() => {
      setFinanceData(mockFinanceData);
      setTransactions(mockTransactions);
      setBudgets(mockBudgets);
      setLoading(false);
    }, 1000);
  }, []);

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
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || transaction.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (amount) => {
    return `Rp ${(amount / 1000000000).toFixed(1)}B`;
  };

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
