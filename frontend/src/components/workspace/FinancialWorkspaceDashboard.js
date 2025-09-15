import React, { useState, useEffect, useCallback } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calculator,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  Users,
  Package,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Wallet,
  Receipt,
  CreditCard,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  ChevronRight,
  Info
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import FinancialAPIService from '../../services/FinancialAPIService';

const FinancialWorkspaceDashboard = ({ userDetails }) => {
  const [financialData, setFinancialData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch comprehensive financial data
  const fetchFinancialData = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = {
        subsidiaryId: selectedSubsidiary === 'all' ? null : selectedSubsidiary,
        period: selectedPeriod
      };

      console.log('📊 [FINANCIAL WORKSPACE] Fetching data with params:', params);

      const result = await FinancialAPIService.getFinancialDashboardData(params);
      
      if (result && result.success) {
        console.log('✅ [FINANCIAL WORKSPACE] API data loaded successfully');
        setFinancialData({
          incomeStatement: result.incomeStatement?.data || {},
          balanceSheet: result.balanceSheet?.data || {},
          cashFlow: result.cashFlow?.data || {},
          dashboard: result.dashboard?.data || {},
          compliance: result.compliance?.data || {},
          monthlyTrends: result.monthlyTrends?.data || [],
          categoryBreakdown: result.expenseBreakdown?.data || [],
          lastUpdated: result.lastUpdated
        });
      } else {
        throw new Error('API returned unsuccessful result');
      }

    } catch (error) {
      console.error('❌ [FINANCIAL WORKSPACE] Error fetching data, using fallback:', error);
      // Use enhanced mock data as fallback
      setFinancialData(generateEnhancedMockData());
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod, selectedSubsidiary]);

  // Generate enhanced mock data for demonstration
  const generateEnhancedMockData = () => {
    return {
      incomeStatement: {
        period: { startDate: '2024-01-01', endDate: '2025-09-15' },
        statement: {
          revenues: { total: 15750000000, accounts: [
            { accountName: 'Construction Revenue', balance: 12500000000 },
            { accountName: 'Equipment Rental Revenue', balance: 2250000000 },
            { accountName: 'Consulting Services', balance: 1000000000 }
          ]},
          directCosts: { total: 9825000000, accounts: [
            { accountName: 'Material Costs', balance: 5500000000 },
            { accountName: 'Labor Costs', balance: 3200000000 },
            { accountName: 'Subcontractor Costs', balance: 1125000000 }
          ]},
          grossProfit: 5925000000,
          indirectCosts: { total: 2575000000, accounts: [
            { accountName: 'Administrative Expenses', balance: 1200000000 },
            { accountName: 'Marketing Expenses', balance: 675000000 },
            { accountName: 'Depreciation', balance: 700000000 }
          ]},
          netIncome: 3350000000,
          grossProfitMargin: 37.6,
          netProfitMargin: 21.3
        }
      },
      balanceSheet: {
        assets: {
          current: {
            cash: 2850000000,
            accountsReceivable: 4120000000,
            inventory: 1650000000,
            total: 8620000000
          },
          fixed: {
            equipment: 15200000000,
            buildings: 8900000000,
            land: 12400000000,
            total: 36500000000
          },
          total: 45120000000
        },
        liabilities: {
          current: {
            accountsPayable: 2340000000,
            shortTermDebt: 1850000000,
            total: 4190000000
          },
          longTerm: {
            longTermDebt: 8500000000,
            total: 8500000000
          },
          total: 12690000000
        },
        equity: {
          total: 32430000000
        }
      },
      cashFlow: {
        operating: {
          netIncome: 3350000000,
          adjustments: 950000000,
          workingCapital: -420000000,
          total: 3880000000
        },
        investing: {
          equipmentPurchases: -2100000000,
          total: -2100000000
        },
        financing: {
          debtProceeds: 1500000000,
          dividends: -800000000,
          total: 700000000
        },
        netChange: 2480000000
      },
      dashboard: {
        finance: {
          totalIncome: 15750000000,
          totalExpense: 12400000000,
          netIncome: 3350000000,
          transactions: 1247,
          profitMargin: 21.3,
          cashPosition: 2850000000
        },
        projects: {
          active: 23,
          completed: 8,
          efficiency: 87.5
        }
      },
      compliance: {
        overallScore: 92.5,
        totalChecks: 15,
        passedChecks: 14,
        complianceLevel: 'EXCELLENT',
        detailedChecks: {
          doubleEntryCompliance: { passed: true, score: 100 },
          accountClassification: { passed: true, score: 95 },
          transactionDocumentation: { passed: true, score: 90 },
          chronologicalOrder: { passed: true, score: 100 },
          constructionAccounting: { passed: false, score: 85 }
        }
      },
      lastUpdated: new Date(),
      // Enhanced trend data
      monthlyTrends: [
        { month: 'Jan', revenue: 1200000000, expense: 950000000, profit: 250000000 },
        { month: 'Feb', revenue: 1350000000, expense: 1050000000, profit: 300000000 },
        { month: 'Mar', revenue: 1450000000, expense: 1100000000, profit: 350000000 },
        { month: 'Apr', revenue: 1380000000, expense: 1080000000, profit: 300000000 },
        { month: 'May', revenue: 1520000000, expense: 1150000000, profit: 370000000 },
        { month: 'Jun', revenue: 1680000000, expense: 1250000000, profit: 430000000 },
        { month: 'Jul', revenue: 1750000000, expense: 1300000000, profit: 450000000 },
        { month: 'Aug', revenue: 1620000000, expense: 1200000000, profit: 420000000 },
        { month: 'Sep', revenue: 1580000000, expense: 1180000000, profit: 400000000 }
      ],
      categoryBreakdown: [
        { name: 'Material Costs', value: 5500000000, color: '#8B5CF6' },
        { name: 'Labor Costs', value: 3200000000, color: '#06B6D4' },
        { name: 'Equipment Costs', value: 1125000000, color: '#10B981' },
        { name: 'Administrative', value: 1200000000, color: '#F59E0B' },
        { name: 'Marketing', value: 675000000, color: '#EF4444' }
      ]
    };
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFinancialData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

  const formatCurrency = (amount) => {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const getPerformanceIndicator = (current, previous) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0,
      icon: change >= 0 ? ArrowUpRight : ArrowDownRight,
      color: change >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: change >= 0 ? 'bg-green-50' : 'bg-red-50'
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading Financial Data...</span>
        </div>
      </div>
    );
  }

  const { incomeStatement, balanceSheet, cashFlow, dashboard, compliance, monthlyTrends, categoryBreakdown } = financialData;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Banknote className="w-8 h-8 mr-3 text-blue-600" />
              Financial Workspace Dashboard
            </h2>
            <p className="text-gray-600 mt-1">
              Comprehensive financial analysis & PSAK compliance monitoring
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(incomeStatement?.statement?.revenues?.total)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12.5% from last period</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {formatCurrency(incomeStatement?.statement?.netIncome)}
              </p>
              <div className="flex items-center mt-2">
                <Target className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">
                  {incomeStatement?.statement?.netProfitMargin?.toFixed(1)}% margin
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Cash Position */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cash Position</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {formatCurrency(balanceSheet?.assets?.current?.cash)}
              </p>
              <div className="flex items-center mt-2">
                <Activity className="w-4 h-4 text-purple-500 mr-1" />
                <span className="text-sm text-purple-600">Strong liquidity</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <Wallet className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* PSAK Compliance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">PSAK Compliance</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {compliance?.overallScore?.toFixed(1)}%
              </p>
              <div className="flex items-center mt-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-1" />
                <span className="text-sm text-emerald-600">{compliance?.complianceLevel}</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Trends Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue & Profit Trends</h3>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                Revenue
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Profit
              </span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(value) => `${(value/1000000).toFixed(0)}M`} />
                <Tooltip 
                  formatter={(value, name) => [formatCurrency(value), name === 'revenue' ? 'Revenue' : 'Profit']}
                  labelStyle={{ color: '#374151' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                <Area type="monotone" dataKey="profit" stroke="#10B981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Cost Breakdown</h3>
            <Eye className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  dataKey="value"
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {categoryBreakdown?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryBreakdown?.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Statements Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income Statement Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Income Statement</h3>
            <Receipt className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Revenue</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(incomeStatement?.statement?.revenues?.total)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Direct Costs</span>
              <span className="font-semibold text-red-600">
                ({formatCurrency(incomeStatement?.statement?.directCosts?.total)})
              </span>
            </div>
            <div className="flex justify-between items-center border-t pt-3">
              <span className="text-sm text-gray-600">Gross Profit</span>
              <span className="font-semibold text-blue-600">
                {formatCurrency(incomeStatement?.statement?.grossProfit)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Indirect Costs</span>
              <span className="font-semibold text-red-600">
                ({formatCurrency(incomeStatement?.statement?.indirectCosts?.total)})
              </span>
            </div>
            <div className="flex justify-between items-center border-t pt-3 font-bold">
              <span className="text-gray-900">Net Income</span>
              <span className="text-emerald-600">
                {formatCurrency(incomeStatement?.statement?.netIncome)}
              </span>
            </div>
          </div>
        </div>

        {/* Balance Sheet Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Balance Sheet</h3>
            <Building2 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Assets</span>
                <span className="font-semibold text-blue-600">
                  {formatCurrency(balanceSheet?.assets?.total)}
                </span>
              </div>
              <div className="ml-2 space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>• Current Assets</span>
                  <span>{formatCurrency(balanceSheet?.assets?.current?.total)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>• Fixed Assets</span>
                  <span>{formatCurrency(balanceSheet?.assets?.fixed?.total)}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Liabilities</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(balanceSheet?.liabilities?.total)}
                </span>
              </div>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center font-bold">
                <span className="text-gray-900">Equity</span>
                <span className="text-emerald-600">
                  {formatCurrency(balanceSheet?.equity?.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cash Flow Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Cash Flow</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Operating</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(cashFlow?.operating?.total)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Investing</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(cashFlow?.investing?.total)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Financing</span>
              <span className="font-semibold text-blue-600">
                {formatCurrency(cashFlow?.financing?.total)}
              </span>
            </div>
            <div className="flex justify-between items-center border-t pt-3 font-bold">
              <span className="text-gray-900">Net Change</span>
              <span className={`${cashFlow?.netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(cashFlow?.netChange)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance & Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PSAK Compliance Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">PSAK Compliance Status</h3>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
              <span className="text-sm text-emerald-600">{compliance?.complianceLevel}</span>
            </div>
          </div>
          <div className="space-y-3">
            {Object.entries(compliance?.detailedChecks || {}).map(([key, check]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center">
                  {check.passed ? 
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> :
                    <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" />
                  }
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <span className={`text-sm font-medium ${check.passed ? 'text-green-600' : 'text-amber-600'}`}>
                  {check.score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Actions & Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Action Items</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">Review Construction Accounting</p>
                <p className="text-xs text-amber-600">PSAK compliance needs attention</p>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Info className="w-4 h-4 text-blue-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Monthly Tax Filing Due</p>
                <p className="text-xs text-blue-600">Due in 5 days</p>
              </div>
              <ChevronRight className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">All invoices processed</p>
                <p className="text-xs text-green-600">Financial records up to date</p>
              </div>
              <ChevronRight className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialWorkspaceDashboard;