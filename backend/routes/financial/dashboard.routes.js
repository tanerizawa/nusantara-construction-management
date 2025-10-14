/**
 * Financial Dashboard Routes
 * 
 * Provides real-time financial data for the Financial Workspace dashboard
 * Data sources:
 * - Revenue: progress_payments (paid invoices)
 * - Expenses: milestone_costs
 * - Balances: chart_of_accounts (CASH_AND_BANK)
 */

const express = require('express');
const router = express.Router();
const FinancialIntegrationService = require('../../services/FinancialIntegrationService');

/**
 * @route   GET /api/financial/dashboard/overview
 * @desc    Get comprehensive financial dashboard overview
 * @access  Private
 * @query   startDate, endDate, subsidiaryId
 */
router.get('/overview', async (req, res) => {
  try {
    const { startDate, endDate, subsidiaryId } = req.query;
    
    const result = await FinancialIntegrationService.getDashboardOverview({
      startDate: startDate || null,
      endDate: endDate || null,
      subsidiaryId: subsidiaryId || null
    });

    res.json(result);
  } catch (error) {
    console.error('[Financial Dashboard] Error getting overview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch financial dashboard overview',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/financial/dashboard/income-statement
 * @desc    Get income statement (Laporan Laba Rugi)
 * @access  Private
 * @query   startDate, endDate
 */
router.get('/income-statement', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'startDate and endDate are required'
      });
    }

    const result = await FinancialIntegrationService.getIncomeStatement(
      startDate,
      endDate
    );

    res.json(result);
  } catch (error) {
    console.error('[Financial Dashboard] Error getting income statement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch income statement',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/financial/dashboard/cash-flow
 * @desc    Get cash flow statement (Laporan Arus Kas)
 * @access  Private
 * @query   startDate, endDate
 */
router.get('/cash-flow', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'startDate and endDate are required'
      });
    }

    const result = await FinancialIntegrationService.getCashFlow(
      startDate,
      endDate
    );

    res.json(result);
  } catch (error) {
    console.error('[Financial Dashboard] Error getting cash flow:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cash flow statement',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/financial/dashboard/balance-sheet
 * @desc    Get balance sheet (Neraca)
 * @access  Private
 * @query   asOfDate
 */
router.get('/balance-sheet', async (req, res) => {
  try {
    const { asOfDate } = req.query;
    
    if (!asOfDate) {
      return res.status(400).json({
        success: false,
        error: 'asOfDate is required'
      });
    }

    const result = await FinancialIntegrationService.getBalanceSheet(asOfDate);

    res.json(result);
  } catch (error) {
    console.error('[Financial Dashboard] Error getting balance sheet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch balance sheet',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/financial/dashboard/revenue-details
 * @desc    Get detailed revenue breakdown
 * @access  Private
 * @query   startDate, endDate
 */
router.get('/revenue-details', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const result = await FinancialIntegrationService.getTotalRevenue({
      startDate: startDate || null,
      endDate: endDate || null
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[Financial Dashboard] Error getting revenue details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch revenue details',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/financial/dashboard/expense-details
 * @desc    Get detailed expense breakdown
 * @access  Private
 * @query   startDate, endDate
 */
router.get('/expense-details', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const result = await FinancialIntegrationService.getTotalExpenses({
      startDate: startDate || null,
      endDate: endDate || null
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[Financial Dashboard] Error getting expense details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch expense details',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/financial/dashboard/cash-balances
 * @desc    Get all cash and bank account balances
 * @access  Private
 */
router.get('/cash-balances', async (req, res) => {
  try {
    const result = await FinancialIntegrationService.getCashBalances();

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[Financial Dashboard] Error getting cash balances:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cash balances',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/financial/dashboard/trends
 * @desc    Get financial trends data (monthly, quarterly, yearly)
 * @access  Private
 * @query   startDate, endDate, periodType (monthly|quarterly|yearly)
 */
router.get('/trends', async (req, res) => {
  try {
    const { startDate, endDate, periodType = 'monthly' } = req.query;
    
    const result = await FinancialIntegrationService.getFinancialTrends({
      startDate: startDate || null,
      endDate: endDate || null,
      periodType: periodType
    });

    res.json(result);
  } catch (error) {
    console.error('[Financial Dashboard] Error getting trends:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch financial trends',
      details: error.message
    });
  }
});

module.exports = router;
