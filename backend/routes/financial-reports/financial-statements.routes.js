/**
 * ============================================================================
 * FINANCIAL STATEMENTS ROUTES - Core Financial Reports
 * ============================================================================
 * 
 * Module: financial-statements.routes.js
 * Purpose: Generate PSAK-compliant core financial statements
 * 
 * ENDPOINTS: 5 total
 * - GET /trial-balance          - Trial Balance report
 * - GET /income-statement        - Income Statement (P&L)
 * - GET /balance-sheet           - Balance Sheet (Neraca)
 * - GET /cash-flow               - Cash Flow Statement (PSAK 2)
 * - GET /equity-changes          - Statement of Changes in Equity
 * 
 * EXTRACTED FROM: financialReports.js (lines 36-279)
 * DEPENDENCIES: FinancialStatementService, CashFlowService, EquityChangesService
 * STANDARDS: PSAK (Indonesian Accounting Standards)
 * 
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const { sequelize } = require('../../models');

// Import financial services
const FinancialStatementService = require('../../services/FinancialStatementService');
const CashFlowService = require('../../services/CashFlowService');
const EquityChangesService = require('../../services/EquityChangesService');

// ============================================================================
// TRIAL BALANCE
// ============================================================================

/**
 * @route   GET /api/reports/trial-balance
 * @desc    Generate Trial Balance report
 * @access  Private (Requires authentication)
 * @query   as_of_date - Date for balance calculation (default: today)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 * @query   project_id - Filter by project (optional)
 * @query   include_inactive - Include inactive accounts (default: false)
 */
router.get('/trial-balance', async (req, res) => {
  try {
    const {
      as_of_date = new Date(),
      subsidiary_id,
      project_id,
      include_inactive = false
    } = req.query;

    const params = {
      asOfDate: new Date(as_of_date),
      subsidiaryId: subsidiary_id,
      projectId: project_id,
      includeInactive: include_inactive === 'true'
    };

    const result = await FinancialStatementService.generateTrialBalance(params);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error in trial balance endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating trial balance',
      error: error.message
    });
  }
});

// ============================================================================
// INCOME STATEMENT (LAPORAN LABA RUGI)
// ============================================================================

/**
 * @route   GET /api/reports/income-statement
 * @desc    Generate Income Statement (Laporan Laba Rugi)
 * @access  Private (Requires authentication)
 * @query   start_date - Start date (REQUIRED, format: YYYY-MM-DD)
 * @query   end_date - End date (default: today)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 * @query   project_id - Filter by project (optional)
 * @query   format - Report format: SINGLE_STEP or MULTI_STEP (default: SINGLE_STEP)
 */
router.get('/income-statement', async (req, res) => {
  try {
    const {
      start_date,
      end_date = new Date(),
      subsidiary_id,
      project_id,
      format = 'SINGLE_STEP'
    } = req.query;

    if (!start_date) {
      return res.status(400).json({
        success: false,
        message: 'start_date parameter is required',
        format: 'YYYY-MM-DD'
      });
    }

    const params = {
      startDate: new Date(start_date),
      endDate: new Date(end_date),
      subsidiaryId: subsidiary_id,
      projectId: project_id,
      format
    };

    const result = await FinancialStatementService.generateIncomeStatement(params);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error in income statement endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating income statement',
      error: error.message
    });
  }
});

// ============================================================================
// BALANCE SHEET (NERACA)
// ============================================================================

/**
 * @route   GET /api/reports/balance-sheet
 * @desc    Generate Balance Sheet (Neraca)
 * @access  Private (Requires authentication)
 * @query   as_of_date - Date for balance calculation (default: today)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/balance-sheet', async (req, res) => {
  try {
    const {
      as_of_date = new Date(),
      subsidiary_id
    } = req.query;

    const params = {
      asOfDate: new Date(as_of_date),
      subsidiaryId: subsidiary_id
    };

    const result = await FinancialStatementService.generateBalanceSheet(params);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error in balance sheet endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating balance sheet',
      error: error.message
    });
  }
});

// ============================================================================
// CASH FLOW STATEMENT (LAPORAN ARUS KAS) - PSAK 2 Compliant
// ============================================================================

/**
 * @route   GET /api/reports/cash-flow
 * @desc    Generate Cash Flow Statement (Laporan Arus Kas) - PSAK 2 Compliant
 * @access  Private (Requires authentication)
 * @query   start_date - Start date (optional, default: 1 year ago)
 * @query   end_date - End date (default: today)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 * @query   method - Calculation method: DIRECT or INDIRECT (default: INDIRECT)
 */
router.get('/cash-flow', async (req, res) => {
  try {
    const {
      start_date,
      end_date = new Date().toISOString().split('T')[0],
      subsidiary_id,
      project_id,
      method = 'INDIRECT' // direct or indirect
    } = req.query;

    // Calculate start date (default: 1 year ago)
    const startDate = start_date || new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0];
    const endDate = end_date;

    // Query all completed finance transactions in the date range
    let whereConditions = `
      status = 'completed' 
      AND date BETWEEN :startDate AND :endDate
    `;
    
    const replacements = { startDate, endDate };

    if (project_id) {
      whereConditions += ' AND project_id = :projectId';
      replacements.projectId = project_id;
    }

    const transactions = await sequelize.query(`
      SELECT 
        id,
        type,
        category,
        subcategory,
        amount,
        description,
        date,
        project_id,
        payment_method,
        reference_number
      FROM finance_transactions
      WHERE ${whereConditions}
      ORDER BY date ASC
    `, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    });

    // Helper function to categorize transactions
    const categorizeTransactions = (transactions) => {
      const operating = [];
      const investing = [];
      const financing = [];

      transactions.forEach(txn => {
        const amount = parseFloat(txn.amount);
        const displayAmount = txn.type === 'expense' ? -amount : amount;
        
        const item = {
          item: txn.description || `${txn.category} - ${txn.subcategory || 'Other'}`,
          amount: displayAmount,
          date: txn.date,
          reference: txn.reference_number
        };

        // Categorize based on transaction category
        const category = (txn.category || '').toLowerCase();
        const subcategory = (txn.subcategory || '').toLowerCase();

        // OPERATING ACTIVITIES - Day-to-day business operations
        if (
          category.includes('operational') ||
          category.includes('salary') ||
          category.includes('expense') ||
          category.includes('income') ||
          category.includes('revenue') ||
          subcategory.includes('actual') ||
          subcategory.includes('upah') ||
          subcategory.includes('material')
        ) {
          operating.push(item);
        }
        // INVESTING ACTIVITIES - Long-term assets
        else if (
          category.includes('asset') ||
          category.includes('equipment') ||
          category.includes('property') ||
          category.includes('investment') ||
          subcategory.includes('capital')
        ) {
          investing.push(item);
        }
        // FINANCING ACTIVITIES - Loans, equity, dividends
        else if (
          category.includes('loan') ||
          category.includes('debt') ||
          category.includes('equity') ||
          category.includes('dividend') ||
          category.includes('financing')
        ) {
          financing.push(item);
        }
        // Default to operating for unclassified
        else {
          operating.push(item);
        }
      });

      return { operating, investing, financing };
    };

    const categorized = categorizeTransactions(transactions);

    // Calculate totals
    const operatingTotal = categorized.operating.reduce((sum, item) => sum + item.amount, 0);
    const investingTotal = categorized.investing.reduce((sum, item) => sum + item.amount, 0);
    const financingTotal = categorized.financing.reduce((sum, item) => sum + item.amount, 0);
    const netCashFlow = operatingTotal + investingTotal + financingTotal;

    // Get opening cash balance (cash/bank accounts at start date)
    const openingCashResult = await sequelize.query(`
      SELECT COALESCE(SUM(current_balance), 0) as opening_cash
      FROM chart_of_accounts
      WHERE (account_code LIKE '1-1%' OR account_name ILIKE '%kas%' OR account_name ILIKE '%bank%')
        AND is_active = true
    `, {
      type: sequelize.QueryTypes.SELECT
    });
    
    const openingCash = parseFloat(openingCashResult[0]?.opening_cash || 0) - netCashFlow;
    const closingCash = openingCash + netCashFlow;

    // Return data structure matching frontend expectations
    const cashFlowData = {
      success: true,
      data: {
        period: {
          startDate,
          endDate,
          method
        },
        operatingActivities: {
          items: categorized.operating,
          netIncome: categorized.operating
            .filter(item => item.amount > 0)
            .reduce((sum, item) => sum + item.amount, 0),
          adjustments: [],
          workingCapitalChanges: [],
          total: operatingTotal
        },
        investingActivities: {
          purchases: categorized.investing.filter(item => item.amount < 0),
          disposals: categorized.investing.filter(item => item.amount > 0),
          total: investingTotal
        },
        financingActivities: {
          loans: categorized.financing.filter(item => item.amount > 0),
          repayments: categorized.financing.filter(item => item.amount < 0 && !item.item.toLowerCase().includes('dividend')),
          dividends: categorized.financing.filter(item => item.amount < 0 && item.item.toLowerCase().includes('dividend')),
          total: financingTotal
        },
        summary: {
          netCashFlow,
          openingCash,
          closingCash
        }
      }
    };
    
    res.json(cashFlowData);
  } catch (error) {
    console.error('Error in cash flow endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating cash flow statement',
      error: error.message
    });
  }
});

// ============================================================================
// STATEMENT OF CHANGES IN EQUITY (LAPORAN PERUBAHAN EKUITAS)
// ============================================================================

/**
 * @route   GET /api/reports/equity-changes
 * @desc    Generate Statement of Changes in Equity (Laporan Perubahan Ekuitas) - PSAK Compliant
 * @access  Private (Requires authentication)
 * @query   start_date - Start date (REQUIRED, format: YYYY-MM-DD)
 * @query   end_date - End date (default: today)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/equity-changes', async (req, res) => {
  try {
    const {
      start_date,
      end_date = new Date(),
      subsidiary_id
    } = req.query;

    if (!start_date) {
      return res.status(400).json({
        success: false,
        message: 'start_date parameter is required',
        format: 'YYYY-MM-DD'
      });
    }

    const params = {
      startDate: new Date(start_date),
      endDate: new Date(end_date),
      subsidiaryId: subsidiary_id
    };

    const result = await EquityChangesService.generateEquityChanges(params);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error in equity changes endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating statement of changes in equity',
      error: error.message
    });
  }
});

// ============================================================================
// EXPORT
// ============================================================================

module.exports = router;
