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
import ProjectFinanceIntegrationService from '../../services/ProjectFinanceIntegrationService';

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

      // Fetch both original dashboard data and integrated project data
      const [originalResult, integratedResult] = await Promise.all([
        FinancialAPIService.getFinancialDashboardData(params),
        ProjectFinanceIntegrationService.getIntegratedFinancialData(params)
      ]);
      
      if (originalResult && originalResult.success) {
        console.log('✅ [FINANCIAL WORKSPACE] API data loaded successfully');
        
        // Merge with real-time integrated data if available
        let dashboardData = {
          incomeStatement: originalResult.incomeStatement?.data || {},
          balanceSheet: originalResult.balanceSheet?.data || {},
          cashFlow: originalResult.cashFlow?.data || {},
          dashboard: originalResult.dashboard?.data || {},
          compliance: originalResult.compliance?.data || {},
          monthlyTrends: originalResult.monthlyTrends?.data || [],
          categoryBreakdown: originalResult.expenseBreakdown?.data || [],
          lastUpdated: originalResult.lastUpdated
        };

        // Enhance with real-time project data if available
        if (integratedResult && integratedResult.success) {
          const metrics = integratedResult.data.metrics;
          
          // Update dashboard overview with real-time metrics
          dashboardData.dashboard = {
            ...dashboardData.dashboard,
            totalRevenue: metrics.overview.totalIncome || dashboardData.dashboard.totalRevenue,
            totalExpenses: metrics.overview.totalExpense || dashboardData.dashboard.totalExpenses,
            netProfit: metrics.overview.netIncome || dashboardData.dashboard.netProfit,
            activeProjects: metrics.overview.activeProjects || dashboardData.dashboard.activeProjects,
            poTransactions: metrics.overview.poTransactions,
            totalPOAmount: metrics.overview.totalPOAmount,
            realTimeData: true // Flag to indicate real-time data
          };

          console.log('✅ [FINANCIAL WORKSPACE] Enhanced with real-time project data');
        }
        
        setFinancialData(dashboardData);
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
            total: 6970000000
          },
          fixed: {
            equipment: 15200000000,
            buildings: 8900000000,
            land: 12400000000,
            total: 36500000000
          },
          total: 43470000000
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
      <div className="rounded-xl p-8 shadow-lg" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#0A84FF' }}></div>
          <span className="ml-3" style={{ color: '#98989D' }}>Loading Financial Data...</span>
        </div>
      </div>
    );
  }

  const { incomeStatement, balanceSheet, cashFlow, dashboard, compliance, monthlyTrends, categoryBreakdown } = financialData;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center" style={{ color: '#FFFFFF' }}>
              <Banknote className="w-8 h-8 mr-3" style={{ color: '#0A84FF' }} />
              Financial Workspace Dashboard
            </h2>
            <p className="mt-1" style={{ color: '#98989D' }}>
              Comprehensive financial analysis & PSAK compliance monitoring
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{
                backgroundColor: '#1C1C1E',
                color: '#FFFFFF',
                border: '1px solid #38383A'
              }}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 disabled:opacity-50"
              style={{
                backgroundColor: 'rgba(10, 132, 255, 0.15)',
                color: '#0A84FF',
                border: '1px solid rgba(10, 132, 255, 0.3)'
              }}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button 
              className="flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200"
              style={{
                backgroundColor: 'rgba(10, 132, 255, 0.15)',
                color: '#0A84FF',
                border: '1px solid rgba(10, 132, 255, 0.3)'
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="rounded-xl p-6 shadow-lg transition-transform hover:scale-105" style={{
          background: 'linear-gradient(135deg, rgba(48, 209, 88, 0.15), rgba(48, 209, 88, 0.05))',
          border: '1px solid rgba(48, 209, 88, 0.3)'
        }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: '#98989D' }}>Total Revenue</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#30D158' }}>
                {formatCurrency(incomeStatement?.statement?.revenues?.total)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1" style={{ color: '#30D158' }} />
                <span className="text-sm" style={{ color: '#30D158' }}>+12.5% from last period</span>
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(48, 209, 88, 0.2)' }}>
              <DollarSign className="w-6 h-6" style={{ color: '#30D158' }} />
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="rounded-xl p-6 shadow-lg transition-transform hover:scale-105" style={{
          background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.15), rgba(10, 132, 255, 0.05))',
          border: '1px solid rgba(10, 132, 255, 0.3)'
        }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: '#98989D' }}>Net Profit</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#0A84FF' }}>
                {formatCurrency(incomeStatement?.statement?.netIncome)}
              </p>
              <div className="flex items-center mt-2">
                <Target className="w-4 h-4 mr-1" style={{ color: '#0A84FF' }} />
                <span className="text-sm" style={{ color: '#0A84FF' }}>
                  {incomeStatement?.statement?.netProfitMargin?.toFixed(1)}% margin
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(10, 132, 255, 0.2)' }}>
              <TrendingUp className="w-6 h-6" style={{ color: '#0A84FF' }} />
            </div>
          </div>
        </div>

        {/* Cash Position */}
        <div className="rounded-xl p-6 shadow-lg transition-transform hover:scale-105" style={{
          background: 'linear-gradient(135deg, rgba(175, 82, 222, 0.15), rgba(175, 82, 222, 0.05))',
          border: '1px solid rgba(175, 82, 222, 0.3)'
        }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: '#98989D' }}>Cash Position</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#AF52DE' }}>
                {formatCurrency(balanceSheet?.assets?.current?.cash)}
              </p>
              <div className="flex items-center mt-2">
                <Activity className="w-4 h-4 mr-1" style={{ color: '#AF52DE' }} />
                <span className="text-sm" style={{ color: '#AF52DE' }}>Strong liquidity</span>
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(175, 82, 222, 0.2)' }}>
              <Wallet className="w-6 h-6" style={{ color: '#AF52DE' }} />
            </div>
          </div>
        </div>

        {/* PSAK Compliance */}
        <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "#98989D" }}>PSAK Compliance</p>
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
        <div className="lg:col-span-2 rounded-xl p-6 shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold" style={{ color: "#FFFFFF" }}>Revenue & Profit Trends</h3>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs" style={{ backgroundColor: "rgba(10, 132, 255, 0.15)", color: "#0A84FF" }}>
                <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: "#0A84FF" }}></div>
                Revenue
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs" style={{ backgroundColor: "rgba(48, 209, 88, 0.15)", color: "#30D158" }}>
                <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: "#30D158" }}></div>
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
        <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold" style={{ color: "#FFFFFF" }}>Cost Breakdown</h3>
            <Eye className="w-5 h-5 cursor-pointer" style={{ color: "#98989D" }} />
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
                  <span style={{ color: "#98989D" }}>{item.name}</span>
                </div>
                <span className="font-medium" style={{ color: "#FFFFFF" }}>
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
        <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: "#FFFFFF" }}>Income Statement</h3>
            <Receipt className="w-5 h-5" style={{ color: "#98989D" }} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "#98989D" }}>Revenue</span>
              <span className="font-semibold" style={{ color: "#30D158" }}>
                {formatCurrency(incomeStatement?.statement?.revenues?.total)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "#98989D" }}>Direct Costs</span>
              <span className="font-semibold" style={{ color: "#FF453A" }}>
                ({formatCurrency(incomeStatement?.statement?.directCosts?.total)})
              </span>
            </div>
            <div className="flex justify-between items-center pt-3" style={{ borderTop: "1px solid #38383A" }}>
              <span className="text-sm" style={{ color: "#98989D" }}>Gross Profit</span>
              <span className="font-semibold" style={{ color: "#0A84FF" }}>
                {formatCurrency(incomeStatement?.statement?.grossProfit)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "#98989D" }}>Indirect Costs</span>
              <span className="font-semibold" style={{ color: "#FF453A" }}>
                ({formatCurrency(incomeStatement?.statement?.indirectCosts?.total)})
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 font-bold" style={{ borderTop: "1px solid #38383A" }}>
              <span style={{ color: "#FFFFFF" }}>Net Income</span>
              <span style={{ color: "#30D158" }}>
                {formatCurrency(incomeStatement?.statement?.netIncome)}
              </span>
            </div>
          </div>
        </div>

        {/* Balance Sheet Summary */}
        <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: "#FFFFFF" }}>Balance Sheet</h3>
            <Building2 className="w-5 h-5" style={{ color: "#98989D" }} />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium" style={{ color: "#FFFFFF" }}>Assets</span>
                <span className="font-semibold" style={{ color: "#0A84FF" }}>
                  {formatCurrency(balanceSheet?.assets?.total)}
                </span>
              </div>
              <div className="ml-2 space-y-1">
                <div className="flex justify-between text-xs" style={{ color: "#98989D" }}>
                  <span>• Current Assets</span>
                  <span>{formatCurrency(balanceSheet?.assets?.current?.total)}</span>
                </div>
                <div className="flex justify-between text-xs" style={{ color: "#98989D" }}>
                  <span>• Fixed Assets</span>
                  <span>{formatCurrency(balanceSheet?.assets?.fixed?.total)}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium" style={{ color: "#FFFFFF" }}>Liabilities</span>
                <span className="font-semibold" style={{ color: "#FF453A" }}>
                  {formatCurrency(balanceSheet?.liabilities?.total)}
                </span>
              </div>
            </div>
            <div className="pt-3" style={{ borderTop: "1px solid #38383A" }}>
              <div className="flex justify-between items-center font-bold">
                <span style={{ color: "#FFFFFF" }}>Equity</span>
                <span style={{ color: "#30D158" }}>
                  {formatCurrency(balanceSheet?.equity?.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cash Flow Summary */}
        <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: "#FFFFFF" }}>Cash Flow</h3>
            <Activity className="w-5 h-5" style={{ color: "#98989D" }} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "#98989D" }}>Operating</span>
              <span className="font-semibold" style={{ color: "#30D158" }}>
                {formatCurrency(cashFlow?.operating?.total)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "#98989D" }}>Investing</span>
              <span className="font-semibold" style={{ color: "#FF453A" }}>
                {formatCurrency(cashFlow?.investing?.total)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "#98989D" }}>Financing</span>
              <span className="font-semibold" style={{ color: "#0A84FF" }}>
                {formatCurrency(cashFlow?.financing?.total)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 font-bold" style={{ borderTop: "1px solid #38383A" }}>
              <span style={{ color: "#FFFFFF" }}>Net Change</span>
              <span style={{ color: cashFlow?.netChange >= 0 ? '#30D158' : '#FF453A' }}>
                {formatCurrency(cashFlow?.netChange)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance & Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PSAK Compliance Details */}
        <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: "#FFFFFF" }}>PSAK Compliance Status</h3>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" style={{ color: "#30D158" }} />
              <span className="text-sm" style={{ color: "#30D158" }}>{compliance?.complianceLevel}</span>
            </div>
          </div>
          <div className="space-y-3">
            {Object.entries(compliance?.detailedChecks || {}).map(([key, check]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center">
                  {check.passed ? 
                    <CheckCircle className="w-4 h-4 mr-2" style={{ color: "#30D158" }} /> :
                    <AlertTriangle className="w-4 h-4 mr-2" style={{ color: "#FF9F0A" }} />
                  }
                  <span className="text-sm capitalize" style={{ color: "#FFFFFF" }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <span className="text-sm font-medium" style={{ color: check.passed ? '#30D158' : '#FF9F0A' }}>
                  {check.score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Actions & Alerts */}
        <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: "#FFFFFF" }}>Action Items</h3>
            <Clock className="w-5 h-5" style={{ color: "#98989D" }} />
          </div>
          <div className="space-y-3">
            <div className="flex items-center p-3 rounded-lg" style={{ backgroundColor: "rgba(255, 159, 10, 0.15)", border: "1px solid rgba(255, 159, 10, 0.3)" }}>
              <AlertTriangle className="w-4 h-4 mr-3" style={{ color: "#FF9F0A" }} />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "#FF9F0A" }}>Review Construction Accounting</p>
                <p className="text-xs" style={{ color: "#98989D" }}>PSAK compliance needs attention</p>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: "#FF9F0A" }} />
            </div>
            <div className="flex items-center p-3 rounded-lg" style={{ backgroundColor: "rgba(10, 132, 255, 0.15)", border: "1px solid rgba(10, 132, 255, 0.3)" }}>
              <Info className="w-4 h-4 mr-3" style={{ color: "#0A84FF" }} />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "#0A84FF" }}>Monthly Tax Filing Due</p>
                <p className="text-xs" style={{ color: "#98989D" }}>Due in 5 days</p>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: "#0A84FF" }} />
            </div>
            <div className="flex items-center p-3 rounded-lg" style={{ backgroundColor: "rgba(48, 209, 88, 0.15)", border: "1px solid rgba(48, 209, 88, 0.3)" }}>
              <CheckCircle className="w-4 h-4 mr-3" style={{ color: "#30D158" }} />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "#30D158" }}>All invoices processed</p>
                <p className="text-xs" style={{ color: "#98989D" }}>Financial records up to date</p>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: "#30D158" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialWorkspaceDashboard;