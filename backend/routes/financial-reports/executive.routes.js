/**
 * ============================================================================
 * EXECUTIVE DASHBOARD ROUTES - High-Level Financial Analytics
 * ============================================================================
 * 
 * Module: executive.routes.js
 * Purpose: Executive summaries, trends, and construction industry analytics
 * 
 * ENDPOINTS: 7 total
 * - GET /executive-summary           - Comprehensive executive financial summary
 * - GET /general-ledger              - General ledger transactions
 * - GET /construction-analytics      - Construction industry financial analytics
 * - GET /trends/monthly              - Monthly financial trends
 * - GET /expense-breakdown           - Expense breakdown by category
 * - GET /dashboard/performance       - Overall performance dashboard
 * - GET /kpi                         - Key performance indicators
 * 
 * EXTRACTED FROM: financialReports.js (lines 272-370, 875-1040, 2015-2113)
 * DEPENDENCIES: FinancialStatementService, IndonesianTaxService, ComplianceAuditService, financialService
 * 
 * ============================================================================
 */

const express = require('express');
const router = express.Router();

// Import required services
const FinancialStatementService = require('../../services/FinancialStatementService');
const IndonesianTaxService = require('../../services/IndonesianTaxService');
const ComplianceAuditService = require('../../services/ComplianceAuditService');
// financialService is just an alias
const financialService = FinancialStatementService;

// ============================================================================
// EXECUTIVE SUMMARY
// ============================================================================

/**
 * @route   GET /api/reports/executive-summary
 * @desc    Comprehensive executive financial & compliance summary
 * @access  Private (Executive level)
 * @query   start_date - Start date (default: beginning of year)
 * @query   end_date - End date (default: today)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/executive-summary', async (req, res) => {
  try {
    const { 
      start_date = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      end_date = new Date().toISOString().split('T')[0],
      subsidiary_id 
    } = req.query;
    
    // Get all key financial reports in parallel
    const [
      trialBalance,
      incomeStatement, 
      balanceSheet,
      taxSummary,
      complianceDashboard,
      auditTrail
    ] = await Promise.all([
      FinancialStatementService.generateTrialBalance({ 
        startDate: start_date, 
        endDate: end_date, 
        subsidiaryId: subsidiary_id 
      }),
      FinancialStatementService.generateIncomeStatement({ 
        startDate: start_date, 
        endDate: end_date, 
        subsidiaryId: subsidiary_id 
      }),
      FinancialStatementService.generateBalanceSheet({ 
        asOfDate: end_date, 
        subsidiaryId: subsidiary_id 
      }),
      IndonesianTaxService.generateConstructionTaxSummary({ 
        month: new Date().getMonth() + 1, 
        year: new Date().getFullYear(), 
        subsidiaryId: subsidiary_id 
      }),
      ComplianceAuditService.generateRegulatoryComplianceDashboard({ 
        subsidiaryId: subsidiary_id 
      }),
      ComplianceAuditService.generateAuditTrail({ 
        startDate: start_date, 
        endDate: end_date, 
        subsidiaryId: subsidiary_id 
      })
    ]);

    // Calculate key performance indicators
    const revenue = incomeStatement.success && incomeStatement.data?.revenues ? incomeStatement.data.revenues.total : 0;
    const directCosts = incomeStatement.success && incomeStatement.data?.directCosts ? incomeStatement.data.directCosts.total : 0;
    const operatingExpenses = incomeStatement.success && incomeStatement.data?.operatingExpenses ? incomeStatement.data.operatingExpenses.total : 0;
    const expenses = directCosts + operatingExpenses;
    const grossProfit = revenue - expenses;
    const grossMargin = revenue > 0 ? ((grossProfit / revenue) * 100).toFixed(2) : 0;
    
    const totalAssets = balanceSheet.success && balanceSheet.data?.assets ? balanceSheet.data.assets.total : 0;
    const totalLiabilities = balanceSheet.success && balanceSheet.data?.liabilities ? balanceSheet.data.liabilities.total : 0;
    const totalEquity = balanceSheet.success && balanceSheet.data?.equity ? balanceSheet.data.equity.total : 0;
    
    const totalTaxLiability = taxSummary.success && taxSummary.data?.summary ? taxSummary.data.summary.totalTaxLiability : 0;
    const complianceScore = complianceDashboard.success && complianceDashboard.data?.overallCompliance ? complianceDashboard.data.overallCompliance.score : 0;
    const totalTransactions = auditTrail.success && auditTrail.data?.summary ? auditTrail.data.summary.totalTransactions : 0;

    const executiveSummary = {
      success: true,
      data: {
        reportType: 'Executive Financial & Compliance Summary',
        generatedAt: new Date(),
        period: { startDate: start_date, endDate: end_date },
        subsidiaryId: subsidiary_id,
        
        // Key Financial Metrics
        financialHighlights: {
          totalRevenue: revenue,
          totalExpenses: expenses,
          grossProfit,
          grossMargin: parseFloat(grossMargin),
          totalAssets,
          totalLiabilities,
          totalEquity,
          balanceSheetVerification: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01
        },

        // Tax & Compliance Status
        complianceStatus: {
          overallComplianceScore: complianceScore,
          complianceLevel: complianceScore >= 90 ? 'EXCELLENT' : 
                          complianceScore >= 80 ? 'GOOD' : 
                          complianceScore >= 70 ? 'ACCEPTABLE' : 'NEEDS_IMPROVEMENT',
          totalTaxLiability,
          auditReadiness: complianceDashboard.success ? complianceDashboard.data.complianceAreas.audit_readiness.status : 'UNKNOWN'
        },

        // Operational Metrics
        operationalMetrics: {
          totalTransactions,
          transactionIntegrity: auditTrail.success ? auditTrail.data.summary.balanceVerification : false,
          uniqueUsers: auditTrail.success ? auditTrail.data.summary.uniqueUsers : 0,
          averageTransactionSize: auditTrail.success ? auditTrail.data.summary.averageTransactionSize : 0
        },

        // Risk Assessment
        riskAssessment: {
          financialRisk: grossMargin < 10 ? 'HIGH' : grossMargin < 20 ? 'MEDIUM' : 'LOW',
          complianceRisk: complianceScore < 70 ? 'HIGH' : complianceScore < 85 ? 'MEDIUM' : 'LOW',
          operationalRisk: totalTransactions > 0 && auditTrail.success && auditTrail.data.summary.balanceVerification ? 'LOW' : 'MEDIUM'
        },

        // Action Items
        actionItems: [
          ...(grossMargin < 15 ? [{ 
            priority: 'HIGH', 
            area: 'PROFITABILITY', 
            action: 'Review cost structure and pricing strategy',
            impact: 'Improve gross margin' 
          }] : []),
          ...(complianceScore < 85 ? [{ 
            priority: 'HIGH', 
            area: 'COMPLIANCE', 
            action: 'Address compliance gaps identified in audit',
            impact: 'Reduce regulatory risk' 
          }] : []),
          ...(totalTaxLiability > revenue * 0.1 ? [{ 
            priority: 'MEDIUM', 
            area: 'TAX_PLANNING', 
            action: 'Review tax optimization strategies',
            impact: 'Optimize tax efficiency' 
          }] : [])
        ],

        // Detailed Reports Summary
        reportsSummary: {
          trialBalance: trialBalance.success ? { 
            status: 'AVAILABLE', 
            totalAccounts: trialBalance.data?.accounts?.length || 0,
            balanced: trialBalance.data?.summary?.isBalanced || false
          } : { status: 'ERROR' },
          
          incomeStatement: incomeStatement.success ? { 
            status: 'AVAILABLE',
            revenue: revenue,
            grossMargin: parseFloat(grossMargin)
          } : { status: 'ERROR' },
          
          balanceSheet: balanceSheet.success ? { 
            status: 'AVAILABLE',
            totalAssets: totalAssets,
            balanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01
          } : { status: 'ERROR' },
          
          taxCompliance: taxSummary.success ? { 
            status: 'AVAILABLE',
            totalLiability: totalTaxLiability
          } : { status: 'ERROR' },
          
          auditCompliance: complianceDashboard.success ? { 
            status: 'AVAILABLE',
            score: complianceScore
          } : { status: 'ERROR' }
        }
      }
    };

    res.json(executiveSummary);
  } catch (error) {
    console.error('Error generating executive summary:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error generating executive summary'
    });
  }
});

// ============================================================================
// GENERAL LEDGER
// ============================================================================

/**
 * @route   GET /api/reports/general-ledger
 * @desc    Generate general ledger report with transaction details
 * @access  Private (Accounting level)
 * @query   account_code - Specific account code (optional)
 * @query   start_date - Start date (REQUIRED)
 * @query   end_date - End date (default: today)
 */
router.get('/general-ledger', async (req, res) => {
  try {
    const {
      account_code,
      start_date,
      end_date = new Date()
    } = req.query;

    if (!start_date) {
      return res.status(400).json({
        success: false,
        message: 'start_date parameter is required',
        format: 'YYYY-MM-DD'
      });
    }

    const ledger = await financialService.generateGeneralLedger(account_code, start_date, end_date);
    
    res.json(ledger);
  } catch (error) {
    console.error('Error in general ledger endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating general ledger',
      error: error.message
    });
  }
});

// ============================================================================
// CONSTRUCTION ANALYTICS
// ============================================================================

/**
 * @route   GET /api/reports/construction-analytics
 * @desc    Construction industry-specific financial analytics
 * @access  Private (Executive level)
 * @query   start_date - Start date (REQUIRED)
 * @query   end_date - End date (default: today)
 */
router.get('/construction-analytics', async (req, res) => {
  try {
    const {
      start_date,
      end_date = new Date()
    } = req.query;

    if (!start_date) {
      return res.status(400).json({
        success: false,
        message: 'start_date parameter is required',
        format: 'YYYY-MM-DD'
      });
    }

    const analytics = await financialService.generateConstructionAnalytics(start_date, end_date);
    
    res.json(analytics);
  } catch (error) {
    console.error('Error in construction analytics endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating construction analytics',
      error: error.message
    });
  }
});

// ============================================================================
// MONTHLY TRENDS
// ============================================================================

/**
 * @route   GET /api/reports/trends/monthly
 * @desc    Get monthly financial trends (revenue, expenses, profit)
 * @access  Private
 * @query   start_date - Start date (default: 12 months ago)
 * @query   end_date - End date (default: today)
 */
router.get('/trends/monthly', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    // Default date range if not provided
    const endDate = new Date(end_date || new Date());
    const startDate = new Date(start_date || new Date(endDate.getFullYear(), endDate.getMonth() - 12, 1));
    
    // Mock data for now - replace with actual database queries
    const monthlyTrends = {
      success: true,
      data: {
        revenue: generateMonthlyData(startDate, endDate, 'revenue'),
        expenses: generateMonthlyData(startDate, endDate, 'expenses'),
        profit: generateMonthlyData(startDate, endDate, 'profit')
      }
    };
    
    res.json(monthlyTrends);
  } catch (error) {
    console.error('Error fetching monthly trends:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching monthly trends',
      error: error.message
    });
  }
});

// ============================================================================
// EXPENSE BREAKDOWN
// ============================================================================

/**
 * @route   GET /api/reports/expense-breakdown
 * @desc    Get expense breakdown by category
 * @access  Private
 * @query   start_date - Start date (default: beginning of month)
 * @query   end_date - End date (default: today)
 */
router.get('/expense-breakdown', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    // Default date range if not provided
    const endDate = new Date(end_date || new Date());
    const startDate = new Date(start_date || new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1));
    
    // Mock data for now - replace with actual database queries
    const expenseBreakdown = {
      success: true,
      data: [
        { category: 'Material', amount: 450000000, percentage: 35 },
        { category: 'Labor', amount: 320000000, percentage: 25 },
        { category: 'Equipment', amount: 256000000, percentage: 20 },
        { category: 'Subcontractor', amount: 192000000, percentage: 15 },
        { category: 'Overhead', amount: 64000000, percentage: 5 }
      ]
    };
    
    res.json(expenseBreakdown);
  } catch (error) {
    console.error('Error fetching expense breakdown:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expense breakdown',
      error: error.message
    });
  }
});

// ============================================================================
// PERFORMANCE DASHBOARD
// ============================================================================

/**
 * @route   GET /api/reports/dashboard/performance
 * @desc    Overall financial performance dashboard with key metrics
 * @access  Private (Executive level)
 * @query   period - Time period (CURRENT_MONTH, CURRENT_QUARTER, CURRENT_YEAR, default: CURRENT_MONTH)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/dashboard/performance', async (req, res) => {
  try {
    const { 
      period = 'CURRENT_MONTH',
      subsidiary_id 
    } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let start_date, end_date = now;

    switch (period) {
      case 'CURRENT_QUARTER':
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        start_date = new Date(now.getFullYear(), quarterStart, 1);
        break;
      case 'CURRENT_YEAR':
        start_date = new Date(now.getFullYear(), 0, 1);
        break;
      case 'CURRENT_MONTH':
      default:
        start_date = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Get income statement for the period
    const incomeStatement = await FinancialStatementService.generateIncomeStatement({
      startDate: start_date,
      endDate: end_date,
      subsidiaryId: subsidiary_id
    });

    // Get balance sheet
    const balanceSheet = await FinancialStatementService.generateBalanceSheet({
      asOfDate: end_date,
      subsidiaryId: subsidiary_id
    });

    // Extract key metrics
    const revenue = incomeStatement.success && incomeStatement.data?.revenues ? incomeStatement.data.revenues.total : 0;
    const expenses = incomeStatement.success && incomeStatement.data?.directCosts && incomeStatement.data?.operatingExpenses 
      ? incomeStatement.data.directCosts.total + incomeStatement.data.operatingExpenses.total : 0;
    const netIncome = revenue - expenses;
    const profitMargin = revenue > 0 ? ((netIncome / revenue) * 100).toFixed(2) : 0;

    const totalAssets = balanceSheet.success && balanceSheet.data?.assets ? balanceSheet.data.assets.total : 0;
    const totalLiabilities = balanceSheet.success && balanceSheet.data?.liabilities ? balanceSheet.data.liabilities.total : 0;
    const totalEquity = balanceSheet.success && balanceSheet.data?.equity ? balanceSheet.data.equity.total : 0;

    // Calculate financial ratios
    const currentRatio = totalLiabilities > 0 ? (totalAssets / totalLiabilities).toFixed(2) : 0;
    const debtToEquity = totalEquity > 0 ? (totalLiabilities / totalEquity).toFixed(2) : 0;
    const roe = totalEquity > 0 ? ((netIncome / totalEquity) * 100).toFixed(2) : 0;
    const roa = totalAssets > 0 ? ((netIncome / totalAssets) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        reportType: 'Financial Performance Dashboard',
        period: {
          type: period,
          startDate: start_date,
          endDate: end_date
        },
        subsidiaryId: subsidiary_id,
        
        profitability: {
          revenue: revenue,
          expenses: expenses,
          netIncome: netIncome,
          profitMargin: parseFloat(profitMargin)
        },
        
        financialPosition: {
          totalAssets: totalAssets,
          totalLiabilities: totalLiabilities,
          totalEquity: totalEquity,
          workingCapital: totalAssets - totalLiabilities
        },
        
        financialRatios: {
          currentRatio: parseFloat(currentRatio),
          debtToEquityRatio: parseFloat(debtToEquity),
          returnOnEquity: parseFloat(roe),
          returnOnAssets: parseFloat(roa)
        },
        
        performanceIndicators: {
          revenueGrowth: 'N/A', // Would need historical data
          expenseControl: expenses / revenue < 0.8 ? 'GOOD' : 'NEEDS_ATTENTION',
          liquidityStatus: currentRatio > 1.5 ? 'HEALTHY' : currentRatio > 1 ? 'ADEQUATE' : 'CONCERNING',
          profitabilityStatus: profitMargin > 15 ? 'EXCELLENT' : profitMargin > 10 ? 'GOOD' : profitMargin > 5 ? 'FAIR' : 'POOR'
        }
      }
    });
  } catch (error) {
    console.error('Error generating performance dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating performance dashboard',
      error: error.message
    });
  }
});

// ============================================================================
// KEY PERFORMANCE INDICATORS (KPI)
// ============================================================================

/**
 * @route   GET /api/reports/kpi
 * @desc    Get key performance indicators with targets and actuals
 * @access  Private (Executive level)
 * @query   year - Year for KPI (default: current year)
 * @query   quarter - Specific quarter (optional: 1, 2, 3, 4)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/kpi', async (req, res) => {
  try {
    const {
      year = new Date().getFullYear(),
      quarter,
      subsidiary_id
    } = req.query;

    // Calculate date range
    let start_date, end_date;
    if (quarter) {
      const quarterStart = (parseInt(quarter) - 1) * 3;
      start_date = new Date(year, quarterStart, 1);
      end_date = new Date(year, quarterStart + 3, 0);
    } else {
      start_date = new Date(year, 0, 1);
      end_date = new Date(year, 11, 31);
    }

    // Get financial data
    const incomeStatement = await FinancialStatementService.generateIncomeStatement({
      startDate: start_date,
      endDate: end_date,
      subsidiaryId: subsidiary_id
    });

    const revenue = incomeStatement.success && incomeStatement.data?.revenues ? incomeStatement.data.revenues.total : 0;
    const expenses = incomeStatement.success && incomeStatement.data?.directCosts && incomeStatement.data?.operatingExpenses 
      ? incomeStatement.data.directCosts.total + incomeStatement.data.operatingExpenses.total : 0;
    const netIncome = revenue - expenses;
    const profitMargin = revenue > 0 ? ((netIncome / revenue) * 100).toFixed(2) : 0;

    // Mock KPI data with targets
    const kpiData = {
      success: true,
      data: {
        reportType: 'Key Performance Indicators',
        period: {
          year: parseInt(year),
          quarter: quarter ? parseInt(quarter) : null,
          startDate: start_date,
          endDate: end_date
        },
        subsidiaryId: subsidiary_id,
        
        kpis: [
          {
            category: 'Revenue',
            metric: 'Total Revenue',
            target: 10000000000,
            actual: revenue,
            achievement: revenue > 0 ? ((revenue / 10000000000) * 100).toFixed(1) : 0,
            status: revenue >= 10000000000 ? 'ACHIEVED' : revenue >= 8000000000 ? 'ON_TRACK' : 'BEHIND',
            unit: 'IDR'
          },
          {
            category: 'Profitability',
            metric: 'Profit Margin',
            target: 15,
            actual: parseFloat(profitMargin),
            achievement: profitMargin > 0 ? ((profitMargin / 15) * 100).toFixed(1) : 0,
            status: profitMargin >= 15 ? 'ACHIEVED' : profitMargin >= 12 ? 'ON_TRACK' : 'BEHIND',
            unit: '%'
          },
          {
            category: 'Efficiency',
            metric: 'Expense Ratio',
            target: 80,
            actual: revenue > 0 ? ((expenses / revenue) * 100).toFixed(1) : 0,
            achievement: 100, // Inverse metric
            status: (expenses / revenue) <= 0.8 ? 'ACHIEVED' : 'BEHIND',
            unit: '%'
          },
          {
            category: 'Growth',
            metric: 'Revenue Growth',
            target: 20,
            actual: 0, // Would need historical data
            achievement: 0,
            status: 'PENDING',
            unit: '%'
          }
        ],
        
        summary: {
          totalKPIs: 4,
          achieved: 0,
          onTrack: 0,
          behind: 0,
          overallScore: 0
        }
      }
    };

    // Calculate summary
    kpiData.data.kpis.forEach(kpi => {
      if (kpi.status === 'ACHIEVED') kpiData.data.summary.achieved++;
      else if (kpi.status === 'ON_TRACK') kpiData.data.summary.onTrack++;
      else if (kpi.status === 'BEHIND') kpiData.data.summary.behind++;
    });
    
    kpiData.data.summary.overallScore = 
      ((kpiData.data.summary.achieved + kpiData.data.summary.onTrack * 0.7) / kpiData.data.summary.totalKPIs * 100).toFixed(1);

    res.json(kpiData);
  } catch (error) {
    console.error('Error generating KPI report:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating KPI report',
      error: error.message
    });
  }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate monthly data for trends
 */
function generateMonthlyData(startDate, endDate, type) {
  const data = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const month = current.toISOString().substring(0, 7); // YYYY-MM format
    let value = 0;
    
    switch (type) {
      case 'revenue':
        value = Math.random() * 2000000000 + 500000000; // 500M - 2.5B
        break;
      case 'expenses':
        value = Math.random() * 1500000000 + 400000000; // 400M - 1.9B
        break;
      case 'profit':
        value = Math.random() * 500000000 + 50000000; // 50M - 550M
        break;
    }
    
    data.push({ month, value: Math.round(value) });
    current.setMonth(current.getMonth() + 1);
  }
  
  return data;
}

// ============================================================================
// EXPORT
// ============================================================================

module.exports = router;
