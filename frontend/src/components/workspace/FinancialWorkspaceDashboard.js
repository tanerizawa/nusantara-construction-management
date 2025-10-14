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
import api from '../../services/api';

const FinancialWorkspaceDashboard = ({ userDetails }) => {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch comprehensive financial data
  const fetchFinancialData = useCallback(async () => {
    try {
      setLoading(true);
      
      console.log('📊 [FINANCIAL WORKSPACE] Starting data fetch...');
      
      // ✨ NEW: Direct API call to real-data endpoint
      const response = await api.get('/financial/dashboard/overview', {
        params: {
          startDate: null,
          endDate: null,
          subsidiaryId: selectedSubsidiary === 'all' ? null : selectedSubsidiary
        }
      });

      console.log('📊 [FINANCIAL WORKSPACE] Overview API response:', response);

      // Fetch trends data based on selected period
      let trendsResponse;
      try {
        trendsResponse = await api.get('/financial/dashboard/trends', {
          params: {
            startDate: null,
            endDate: null,
            periodType: selectedPeriod // monthly, quarterly, yearly
          }
        });
        console.log('📊 [FINANCIAL WORKSPACE] Trends API response:', trendsResponse);
      } catch (trendsError) {
        console.warn('⚠️ [FINANCIAL WORKSPACE] Trends API failed:', trendsError);
        trendsResponse = { success: false, data: { trends: [] } };
      }
      
      // api.get() returns response.data directly, so response = {success: true, data: {...}}
      if (response && response.success) {
        const realData = response.data;
        const trendsData = trendsResponse?.success ? trendsResponse.data : null;
        
        console.log('📊 [FINANCIAL WORKSPACE] Real data extracted:', {
          totalRevenue: realData.totalRevenue,
          totalExpenses: realData.totalExpenses,
          netProfit: realData.netProfit,
          totalCash: realData.totalCash
        });
        
        // Transform API response to dashboard format
        const dashboardData = {
          dashboard: {
            totalRevenue: realData.totalRevenue || 0,
            totalExpenses: realData.totalExpenses || 0,
            netProfit: realData.netProfit || 0,
            profitMargin: parseFloat(realData.profitMargin) || 0,
            totalCash: realData.totalCash || 0,
            activeProjects: realData.activeProjects || 0,
            cashAccounts: realData.cashAccounts || []
          },
          incomeStatement: {
            statement: {
              revenues: { 
                total: realData.totalRevenue,
                accounts: realData.revenueByBank || []
              },
              directCosts: { 
                total: realData.totalExpenses,
                accounts: realData.expenseByCategory || []
              },
              grossProfit: realData.netProfit,
              netIncome: realData.netProfit,
              netProfitMargin: parseFloat(realData.profitMargin)
            }
          },
          balanceSheet: {
            assets: {
              current: {
                cash: realData.totalCash,
                accountsReceivable: 0,
                total: realData.totalCash
              },
              fixed: {
                equipment: 0,
                buildings: 0,
                land: 0,
                total: 0
              },
              total: realData.totalCash
            },
            liabilities: {
              current: {
                accountsPayable: 0,
                shortTermDebt: 0,
                total: 0
              },
              longTerm: {
                longTermDebt: 0,
                total: 0
              },
              total: 0
            },
            equity: {
              total: realData.totalCash
            }
          },
          cashFlow: {
            operating: {
              netIncome: realData.netProfit,
              adjustments: 0,
              workingCapital: 0,
              total: realData.netProfit
            },
            investing: {
              equipmentPurchases: 0,
              total: 0
            },
            financing: {
              debtProceeds: 0,
              dividends: 0,
              total: 0
            },
            netChange: realData.netProfit
          },
          // ✨ NEW: Real trends data from API
          monthlyTrends: trendsData?.trends?.map(item => ({
            month: item.displayLabel || item.monthName,
            revenue: item.revenue,
            expense: item.expense,
            profit: item.profit
          })) || [],
          // Real expense breakdown
          categoryBreakdown: realData.expenseByCategory?.map((item, index) => ({
            name: item.cost_category || item.account_name || 'Unknown',
            value: parseFloat(item.amount),
            color: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'][index % 5]
          })) || [],
          // Compliance data (to be implemented from backend)
          compliance: {
            overallScore: 0,
            totalChecks: 0,
            passedChecks: 0,
            complianceLevel: 'N/A'
          },
          lastUpdated: new Date()
        };
        
        setFinancialData(dashboardData);
        console.log('✅ [FINANCIAL WORKSPACE] Dashboard data successfully set!');
        console.log('✅ [FINANCIAL WORKSPACE] Dashboard object:', dashboardData.dashboard);
        console.log('✅ [FINANCIAL WORKSPACE] Data verification:', {
          hasRevenue: !!dashboardData.dashboard.totalRevenue,
          hasExpenses: !!dashboardData.dashboard.totalExpenses,
          hasCash: !!dashboardData.dashboard.totalCash,
          hasTrends: !!dashboardData.monthlyTrends.length,
          hasCategoryBreakdown: !!dashboardData.categoryBreakdown.length
        });
      } else {
        // API returned no data - show empty state
        console.warn('⚠️ [FINANCIAL WORKSPACE] API returned success:false or no data');
        console.warn('⚠️ [FINANCIAL WORKSPACE] Response:', response);
        setFinancialData(getEmptyFinancialData());
      }
    } catch (error) {
      console.error('❌ [FINANCIAL WORKSPACE] Error fetching data:', error);
      console.error('❌ [FINANCIAL WORKSPACE] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      // Show error state with empty data
      setFinancialData(getEmptyFinancialData());
    } finally {
      setLoading(false);
      console.log('📊 [FINANCIAL WORKSPACE] Loading complete, financialData state updated');
    }
  }, [selectedSubsidiary, selectedPeriod]);

  // Get empty financial data structure (no mock/dummy data)
  const getEmptyFinancialData = () => {
    return {
      dashboard: {
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        profitMargin: 0,
        totalCash: 0,
        activeProjects: 0,
        cashAccounts: []
      },
      incomeStatement: {
        statement: {
          revenues: { total: 0, accounts: [] },
          directCosts: { total: 0, accounts: [] },
          grossProfit: 0,
          netIncome: 0,
          netProfitMargin: 0
        }
      },
      balanceSheet: {
        assets: {
          current: { cash: 0, accountsReceivable: 0, total: 0 },
          fixed: { equipment: 0, buildings: 0, land: 0, total: 0 },
          total: 0
        },
        liabilities: {
          current: { accountsPayable: 0, shortTermDebt: 0, total: 0 },
          longTerm: { longTermDebt: 0, total: 0 },
          total: 0
        },
        equity: { total: 0 }
      },
      cashFlow: {
        operating: { netIncome: 0, adjustments: 0, workingCapital: 0, total: 0 },
        investing: { equipmentPurchases: 0, total: 0 },
        financing: { debtProceeds: 0, dividends: 0, total: 0 },
        netChange: 0
      },
      monthlyTrends: [],
      categoryBreakdown: [],
      compliance: {
        overallScore: 0,
        totalChecks: 0,
        passedChecks: 0,
        complianceLevel: 'N/A'
      },
      lastUpdated: new Date()
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

  // Safety check for financialData
  if (!financialData) {
    console.warn('⚠️ [FINANCIAL WORKSPACE RENDER] financialData is null/undefined');
    return (
      <div className="rounded-xl p-8 shadow-lg" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
        <div className="flex flex-col justify-center items-center h-64">
          <AlertTriangle className="w-12 h-12 mb-4" style={{ color: '#FF9F0A' }} />
          <div className="text-center">
            <p className="text-lg mb-2" style={{ color: '#FFFFFF' }}>No financial data available</p>
            <p className="text-sm mb-4" style={{ color: '#98989D' }}>Unable to load financial data. Please try refreshing.</p>
            <button 
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 rounded-lg"
              style={{ backgroundColor: '#0A84FF', color: '#FFFFFF' }}
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { incomeStatement, balanceSheet, cashFlow, dashboard, compliance, monthlyTrends, categoryBreakdown } = financialData;

  console.log('📊 [FINANCIAL WORKSPACE RENDER] Rendering with data:', {
    hasDashboard: !!dashboard,
    hasIncomeStatement: !!incomeStatement,
    revenue: dashboard?.totalRevenue,
    expenses: dashboard?.totalExpenses,
    cash: dashboard?.totalCash
  });

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
              Real-time financial analysis & reporting
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
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: '#98989D' }}>Total Revenue</p>
              <p className="text-lg font-bold mt-1 truncate" style={{ color: '#30D158' }}>
                {formatCurrency(dashboard?.totalRevenue || incomeStatement?.statement?.revenues?.total)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1 flex-shrink-0" style={{ color: '#30D158' }} />
                <span className="text-xs truncate" style={{ color: '#30D158' }}>
                  {dashboard?.profitMargin || incomeStatement?.statement?.netProfitMargin?.toFixed(1)}% margin
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg flex-shrink-0 ml-2" style={{ backgroundColor: 'rgba(48, 209, 88, 0.2)' }}>
              <DollarSign className="w-6 h-6" style={{ color: '#30D158' }} />
            </div>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="rounded-xl p-6 shadow-lg transition-transform hover:scale-105" style={{
          background: 'linear-gradient(135deg, rgba(255, 159, 10, 0.15), rgba(255, 159, 10, 0.05))',
          border: '1px solid rgba(255, 159, 10, 0.3)'
        }}>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: '#98989D' }}>Total Expenses</p>
              <p className="text-lg font-bold mt-1 truncate" style={{ color: '#FF9F0A' }}>
                {formatCurrency(dashboard?.totalExpenses || incomeStatement?.statement?.directCosts?.total)}
              </p>
              <div className="flex items-center mt-2">
                <Activity className="w-4 h-4 mr-1 flex-shrink-0" style={{ color: '#FF9F0A' }} />
                <span className="text-xs truncate" style={{ color: '#FF9F0A' }}>Operating costs</span>
              </div>
            </div>
            <div className="p-3 rounded-lg flex-shrink-0 ml-2" style={{ backgroundColor: 'rgba(255, 159, 10, 0.2)' }}>
              <TrendingDown className="w-6 h-6" style={{ color: '#FF9F0A' }} />
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="rounded-xl p-6 shadow-lg transition-transform hover:scale-105" style={{
          background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.15), rgba(10, 132, 255, 0.05))',
          border: '1px solid rgba(10, 132, 255, 0.3)'
        }}>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: '#98989D' }}>Net Profit</p>
              <p className="text-lg font-bold mt-1 truncate" style={{ color: '#0A84FF' }}>
                {formatCurrency(dashboard?.netProfit || incomeStatement?.statement?.netIncome)}
              </p>
              <div className="flex items-center mt-2">
                <Target className="w-4 h-4 mr-1 flex-shrink-0" style={{ color: '#0A84FF' }} />
                <span className="text-xs truncate" style={{ color: '#0A84FF' }}>
                  {(dashboard?.profitMargin || incomeStatement?.statement?.netProfitMargin)?.toFixed(1)}% margin
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg flex-shrink-0 ml-2" style={{ backgroundColor: 'rgba(10, 132, 255, 0.2)' }}>
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
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: '#98989D' }}>Cash & Bank</p>
              <p className="text-lg font-bold mt-1 truncate" style={{ color: '#AF52DE' }}>
                {formatCurrency(dashboard?.totalCash || balanceSheet?.assets?.current?.cash)}
              </p>
              <div className="flex items-center mt-2">
                <Wallet className="w-4 h-4 mr-1 flex-shrink-0" style={{ color: '#AF52DE' }} />
                <span className="text-xs truncate" style={{ color: '#AF52DE' }}>
                  {dashboard?.cashAccounts?.length || 0} accounts
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg flex-shrink-0 ml-2" style={{ backgroundColor: 'rgba(175, 82, 222, 0.2)' }}>
              <Banknote className="w-6 h-6" style={{ color: '#AF52DE' }} />
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

      {/* Compliance & Action Items - Hidden until backend implementation */}
      {/* Feature will be implemented when PSAK compliance monitoring is ready */}
    </div>
  );
};

export default FinancialWorkspaceDashboard;