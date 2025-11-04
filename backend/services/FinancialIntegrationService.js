/**
 * Financial Integration Service
 * 
 * Purpose: Aggregate real financial data from multiple sources:
 * - Revenue from paid invoices (progress_payments)
 * - Expenses from milestone costs (milestone_costs)
 * - Cash balances from chart of accounts (chart_of_accounts)
 * - Manual transactions (finance_transactions)
 * 
 * This service provides real-time financial metrics for the Financial Workspace dashboard
 */

const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

class FinancialIntegrationService {
  /**
   * Get comprehensive dashboard overview data
   * @param {Object} filters - Date range and subsidiary filters
   * @returns {Object} Dashboard metrics
   */
  async getDashboardOverview(filters = {}) {
    const { startDate, endDate, subsidiaryId } = filters;
    
    try {
      // Parallel fetch for performance
      const [
        revenueData,
        expenseData,
        cashBalances,
        projectStats
      ] = await Promise.all([
        this.getTotalRevenue(filters),
        this.getTotalExpenses(filters),
        this.getCashBalances(),
        this.getProjectStatistics(filters)
      ]);

      // Calculate net profit
      const netProfit = revenueData.totalRevenue - expenseData.totalExpenses;
      const profitMargin = revenueData.totalRevenue > 0 
        ? ((netProfit / revenueData.totalRevenue) * 100).toFixed(2)
        : 0;

      return {
        success: true,
        data: {
          // Overview cards
          totalRevenue: revenueData.totalRevenue,
          totalExpenses: expenseData.totalExpenses,
          netProfit: netProfit,
          profitMargin: profitMargin,
          totalCash: cashBalances.totalBalance,
          
          // Revenue breakdown
          revenueBySource: revenueData.breakdown,
          revenueByBank: revenueData.byBank,
          
          // Expense breakdown
          expenseByCategory: expenseData.byCategory,
          expenseByAccount: expenseData.byAccount,
          
          // Cash accounts
          cashAccounts: cashBalances.accounts,
          
          // Project statistics
          activeProjects: projectStats.activeCount,
          completedProjects: projectStats.completedCount,
          totalProjectValue: projectStats.totalValue,
          
          // Metadata
          dateRange: {
            startDate: startDate || 'All time',
            endDate: endDate || 'Present'
          },
          lastUpdated: new Date(),
          dataSource: 'real-time'
        }
      };
    } catch (error) {
      console.error('[FinancialIntegration] Error getting dashboard overview:', error);
      throw error;
    }
  }

  /**
   * Get total revenue from paid invoices
   * @param {Object} filters - Date filters
   * @returns {Object} Revenue data with breakdown
   */
  async getTotalRevenue(filters = {}) {
    const { startDate, endDate } = filters;
    
    let dateFilter = '';
    const replacements = {};
    
    if (startDate && endDate) {
      dateFilter = 'AND pp.paid_at BETWEEN :startDate AND :endDate';
      replacements.startDate = startDate;
      replacements.endDate = endDate;
    } else if (startDate) {
      dateFilter = 'AND pp.paid_at >= :startDate';
      replacements.startDate = startDate;
    }

    // Total revenue from paid invoices
    const [totalResult] = await sequelize.query(`
      SELECT 
        COALESCE(SUM(pp.net_amount), 0) as total_revenue,
        COUNT(pp.id) as invoice_count
      FROM progress_payments pp
      WHERE pp.status = 'paid'
        ${dateFilter}
    `, {
      replacements,
      type: QueryTypes.SELECT
    });

    // Revenue by bank account
    const byBank = await sequelize.query(`
      SELECT 
        pp.payment_received_bank as bank_name,
        COALESCE(SUM(pp.net_amount), 0) as amount,
        COUNT(pp.id) as transaction_count
      FROM progress_payments pp
      WHERE pp.status = 'paid'
        ${dateFilter}
      GROUP BY pp.payment_received_bank
      ORDER BY amount DESC
    `, {
      replacements,
      type: QueryTypes.SELECT
    });

    // Revenue by month (for trends)
    const byMonth = await sequelize.query(`
      SELECT 
        TO_CHAR(pp.paid_at, 'YYYY-MM') as month,
        COALESCE(SUM(pp.net_amount), 0) as amount,
        COUNT(pp.id) as invoice_count
      FROM progress_payments pp
      WHERE pp.status = 'paid'
        ${dateFilter}
      GROUP BY TO_CHAR(pp.paid_at, 'YYYY-MM')
      ORDER BY month DESC
      LIMIT 12
    `, {
      replacements,
      type: QueryTypes.SELECT
    });

    return {
      totalRevenue: parseFloat(totalResult.total_revenue) || 0,
      invoiceCount: parseInt(totalResult.invoice_count) || 0,
      breakdown: {
        invoices: parseFloat(totalResult.total_revenue) || 0,
        manual: 0, // From finance_transactions if needed
        other: 0
      },
      byBank: byBank,
      byMonth: byMonth
    };
  }

  /**
   * Get total expenses from milestone costs
   * @param {Object} filters - Date filters
   * @returns {Object} Expense data with breakdown
   */
  async getTotalExpenses(filters = {}) {
    const { startDate, endDate } = filters;
    
    let dateFilter = '';
    const replacements = {};
    
    if (startDate && endDate) {
      dateFilter = 'AND mc.created_at BETWEEN :startDate AND :endDate';
      replacements.startDate = startDate;
      replacements.endDate = endDate;
    } else if (startDate) {
      dateFilter = 'AND mc.created_at >= :startDate';
      replacements.startDate = startDate;
    }

    // Total expenses from milestone costs (only approved or paid)
    const [totalResult] = await sequelize.query(`
      SELECT 
        COALESCE(SUM(mc.amount), 0) as total_expenses,
        COUNT(mc.id) as cost_count
      FROM milestone_costs mc
      WHERE mc.deleted_at IS NULL
        AND mc.status IN ('approved', 'paid')
        ${dateFilter}
    `, {
      replacements,
      type: QueryTypes.SELECT
    });

    // Expenses by category (only approved or paid)
    const byCategory = await sequelize.query(`
      SELECT 
        mc.cost_category,
        COALESCE(SUM(mc.amount), 0) as amount,
        COUNT(mc.id) as transaction_count
      FROM milestone_costs mc
      WHERE mc.deleted_at IS NULL
        AND mc.status IN ('approved', 'paid')
        ${dateFilter}
      GROUP BY mc.cost_category
      ORDER BY amount DESC
    `, {
      replacements,
      type: QueryTypes.SELECT
    });

    // Expenses by account (expense type) - only approved or paid
    const byAccount = await sequelize.query(`
      SELECT 
        coa.account_code,
        coa.account_name,
        COALESCE(SUM(mc.amount), 0) as amount,
        COUNT(mc.id) as transaction_count
      FROM milestone_costs mc
      LEFT JOIN chart_of_accounts coa ON mc.account_id = coa.id
      WHERE mc.deleted_at IS NULL
        AND mc.status IN ('approved', 'paid')
        AND mc.account_id IS NOT NULL
        ${dateFilter}
      GROUP BY coa.account_code, coa.account_name
      ORDER BY amount DESC
    `, {
      replacements,
      type: QueryTypes.SELECT
    });

    // Expenses by month (for trends) - only approved or paid
    const byMonth = await sequelize.query(`
      SELECT 
        TO_CHAR(mc.created_at, 'YYYY-MM') as month,
        COALESCE(SUM(mc.amount), 0) as amount,
        COUNT(mc.id) as cost_count
      FROM milestone_costs mc
      WHERE mc.deleted_at IS NULL
        AND mc.status IN ('approved', 'paid')
        ${dateFilter}
      GROUP BY TO_CHAR(mc.created_at, 'YYYY-MM')
      ORDER BY month DESC
      LIMIT 12
    `, {
      replacements,
      type: QueryTypes.SELECT
    });

    return {
      totalExpenses: parseFloat(totalResult.total_expenses) || 0,
      costCount: parseInt(totalResult.cost_count) || 0,
      byCategory: byCategory,
      byAccount: byAccount,
      byMonth: byMonth
    };
  }

  /**
   * Get cash and bank account balances
   * @returns {Object} Cash balance data
   */
  async getCashBalances() {
    const accounts = await sequelize.query(`
      SELECT 
        id,
        account_code,
        account_name,
        current_balance,
        account_type,
        account_sub_type
      FROM chart_of_accounts
      WHERE account_sub_type = 'CASH_AND_BANK'
        AND is_active = true
        AND level >= 3
      ORDER BY account_code
    `, {
      type: QueryTypes.SELECT
    });

    const totalBalance = accounts.reduce((sum, acc) => {
      return sum + (parseFloat(acc.current_balance) || 0);
    }, 0);

    return {
      totalBalance: totalBalance,
      accountCount: accounts.length,
      accounts: accounts.map(acc => ({
        id: acc.id,
        code: acc.account_code,
        name: acc.account_name,
        balance: parseFloat(acc.current_balance) || 0,
        type: acc.account_sub_type
      }))
    };
  }

  /**
   * Get project statistics
   * @param {Object} filters - Filters
   * @returns {Object} Project stats
   */
  async getProjectStatistics(filters = {}) {
    const [stats] = await sequelize.query(`
      SELECT 
        COUNT(CASE WHEN p.status IN ('active', 'planning') THEN 1 END) as active_count,
        COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as completed_count,
        COALESCE(SUM(p.budget), 0) as total_value
      FROM projects p
    `, {
      type: QueryTypes.SELECT
    });

    return {
      activeCount: parseInt(stats.active_count) || 0,
      completedCount: parseInt(stats.completed_count) || 0,
      totalValue: parseFloat(stats.total_value) || 0
    };
  }

  /**
   * Get income statement data
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Object} Income statement
   */
  async getIncomeStatement(startDate, endDate) {
    const [revenueData, expenseData] = await Promise.all([
      this.getTotalRevenue({ startDate, endDate }),
      this.getTotalExpenses({ startDate, endDate })
    ]);

    const netIncome = revenueData.totalRevenue - expenseData.totalExpenses;
    const grossMargin = revenueData.totalRevenue > 0
      ? ((revenueData.totalRevenue - expenseData.totalExpenses) / revenueData.totalRevenue * 100).toFixed(2)
      : 0;

    return {
      success: true,
      data: {
        period: {
          startDate,
          endDate
        },
        revenue: {
          projectRevenue: revenueData.totalRevenue,
          otherIncome: 0,
          totalRevenue: revenueData.totalRevenue
        },
        expenses: {
          byCategory: expenseData.byCategory,
          byAccount: expenseData.byAccount,
          totalExpenses: expenseData.totalExpenses
        },
        grossProfit: revenueData.totalRevenue - expenseData.totalExpenses,
        grossMargin: parseFloat(grossMargin),
        netIncome: netIncome,
        ebitda: netIncome // Simplified, no interest/tax/depreciation yet
      }
    };
  }

  /**
   * Get cash flow statement data
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Object} Cash flow statement
   */
  async getCashFlow(startDate, endDate) {
    const [revenueData, expenseData, balances] = await Promise.all([
      this.getTotalRevenue({ startDate, endDate }),
      this.getTotalExpenses({ startDate, endDate }),
      this.getCashBalances()
    ]);

    const netCashFlow = revenueData.totalRevenue - expenseData.totalExpenses;

    return {
      success: true,
      data: {
        period: {
          startDate,
          endDate
        },
        operatingActivities: {
          cashFromCustomers: revenueData.totalRevenue,
          cashToSuppliers: -expenseData.totalExpenses,
          netOperatingCash: netCashFlow
        },
        investingActivities: {
          equipmentPurchases: 0,
          netInvestingCash: 0
        },
        financingActivities: {
          capitalContributions: 0,
          dividends: 0,
          netFinancingCash: 0
        },
        netCashFlow: netCashFlow,
        currentBalance: balances.totalBalance
      }
    };
  }

  /**
   * Get balance sheet data
   * @param {Date} asOfDate - As of date
   * @returns {Object} Balance sheet
   */
  async getBalanceSheet(asOfDate) {
    const balances = await this.getCashBalances();
    
    // Get accounts receivable (unpaid invoices)
    const [receivables] = await sequelize.query(`
      SELECT COALESCE(SUM(net_amount), 0) as total_receivables
      FROM progress_payments
      WHERE status != 'paid' AND status != 'cancelled'
    `, {
      type: QueryTypes.SELECT
    });

    const totalAssets = balances.totalBalance + parseFloat(receivables.total_receivables);

    return {
      success: true,
      data: {
        asOfDate,
        assets: {
          currentAssets: {
            cashAndBank: balances.totalBalance,
            accountsReceivable: parseFloat(receivables.total_receivables),
            totalCurrentAssets: totalAssets
          },
          fixedAssets: {
            equipment: 0,
            totalFixedAssets: 0
          },
          totalAssets: totalAssets
        },
        liabilities: {
          currentLiabilities: {
            accountsPayable: 0,
            totalCurrentLiabilities: 0
          },
          longTermLiabilities: {
            loans: 0,
            totalLongTermLiabilities: 0
          },
          totalLiabilities: 0
        },
        equity: {
          capital: totalAssets, // Simplified
          retainedEarnings: 0,
          totalEquity: totalAssets
        }
      }
    };
  }

  /**
   * Get financial trends data (monthly, quarterly, yearly)
   * @param {Object} filters - Date range and period type
   * @returns {Object} Trends data
   */
  async getFinancialTrends(filters = {}) {
    const { startDate, endDate, periodType = 'monthly' } = filters;
    
    try {
      let dateGrouping = '';
      let dateFormat = '';
      
      // Determine grouping based on period type
      switch (periodType) {
        case 'yearly':
          dateGrouping = "DATE_TRUNC('year', date_column)";
          dateFormat = 'YYYY';
          break;
        case 'quarterly':
          dateGrouping = "DATE_TRUNC('quarter', date_column)";
          dateFormat = 'YYYY-Q';
          break;
        case 'monthly':
        default:
          dateGrouping = "DATE_TRUNC('month', date_column)";
          dateFormat = 'YYYY-MM';
          break;
      }
      
      // Get revenue trends
      const revenueTrends = await sequelize.query(`
        SELECT 
          TO_CHAR(DATE_TRUNC('month', pp.paid_at), '${dateFormat}') as period,
          EXTRACT(YEAR FROM pp.paid_at) as year,
          EXTRACT(MONTH FROM pp.paid_at) as month,
          COALESCE(SUM(pp.net_amount), 0) as revenue,
          COUNT(*) as transaction_count
        FROM progress_payments pp
        WHERE pp.status = 'paid'
          AND pp.paid_at IS NOT NULL
          ${startDate ? "AND pp.paid_at >= :startDate" : ""}
          ${endDate ? "AND pp.paid_at <= :endDate" : ""}
        GROUP BY period, year, month
        ORDER BY year, month
      `, {
        replacements: { startDate, endDate },
        type: QueryTypes.SELECT
      });

      // Get expense trends
      const expenseTrends = await sequelize.query(`
        SELECT 
          TO_CHAR(DATE_TRUNC('month', mc.created_at), '${dateFormat}') as period,
          EXTRACT(YEAR FROM mc.created_at) as year,
          EXTRACT(MONTH FROM mc.created_at) as month,
          COALESCE(SUM(mc.amount), 0) as expense,
          COUNT(*) as transaction_count
        FROM milestone_costs mc
        WHERE mc.deleted_at IS NULL
          ${startDate ? "AND mc.created_at >= :startDate" : ""}
          ${endDate ? "AND mc.created_at <= :endDate" : ""}
        GROUP BY period, year, month
        ORDER BY year, month
      `, {
        replacements: { startDate, endDate },
        type: QueryTypes.SELECT
      });

      // Merge revenue and expense data by period
      const trendsMap = new Map();

      // Add revenue data
      revenueTrends.forEach(item => {
        const key = item.period;
        trendsMap.set(key, {
          period: key,
          year: parseInt(item.year),
          month: parseInt(item.month),
          revenue: parseFloat(item.revenue),
          expense: 0,
          profit: 0
        });
      });

      // Add expense data
      expenseTrends.forEach(item => {
        const key = item.period;
        if (trendsMap.has(key)) {
          const existing = trendsMap.get(key);
          existing.expense = parseFloat(item.expense);
          existing.profit = existing.revenue - existing.expense;
        } else {
          trendsMap.set(key, {
            period: key,
            year: parseInt(item.year),
            month: parseInt(item.month),
            revenue: 0,
            expense: parseFloat(item.expense),
            profit: -parseFloat(item.expense)
          });
        }
      });

      // Convert to array and sort
      const trends = Array.from(trendsMap.values()).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });

      // Format month names for display
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      trends.forEach(item => {
        item.monthName = monthNames[item.month - 1];
        item.displayLabel = periodType === 'yearly' 
          ? `${item.year}` 
          : periodType === 'quarterly'
          ? `Q${Math.ceil(item.month / 3)} ${item.year}`
          : `${item.monthName} ${item.year}`;
      });

      return {
        success: true,
        data: {
          trends,
          periodType,
          dataPoints: trends.length,
          summary: {
            totalRevenue: trends.reduce((sum, item) => sum + item.revenue, 0),
            totalExpense: trends.reduce((sum, item) => sum + item.expense, 0),
            totalProfit: trends.reduce((sum, item) => sum + item.profit, 0),
            averageRevenue: trends.length > 0 
              ? trends.reduce((sum, item) => sum + item.revenue, 0) / trends.length 
              : 0,
            averageExpense: trends.length > 0 
              ? trends.reduce((sum, item) => sum + item.expense, 0) / trends.length 
              : 0
          }
        }
      };
    } catch (error) {
      console.error('[FinancialIntegration] Error getting trends:', error);
      throw error;
    }
  }
}

module.exports = new FinancialIntegrationService();
