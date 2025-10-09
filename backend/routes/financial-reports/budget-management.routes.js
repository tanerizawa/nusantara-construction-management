/**
 * ============================================================================
 * BUDGET MANAGEMENT ROUTES - Budget Planning & Variance Analysis
 * ============================================================================
 * 
 * Module: budget-management.routes.js
 * Purpose: Budget creation, variance analysis, forecasting, and performance tracking
 * 
 * ENDPOINTS: 4 total
 * - POST /create                  - Create comprehensive project budget
 * - GET /variance-analysis        - Budget vs actual variance analysis
 * - GET /forecast                 - Budget forecasting with risk analysis
 * - GET /dashboard                - Budget performance dashboard
 * 
 * EXTRACTED FROM: financialReports.js (lines 1050-1240)
 * DEPENDENCIES: BudgetPlanningService
 * 
 * ============================================================================
 */

const express = require('express');
const router = express.Router();

// Import budget planning service class
const BudgetPlanningService = require('../../services/BudgetPlanningService');
// Get sequelize instance
const { sequelize } = require('../../models');

// ============================================================================
// CREATE PROJECT BUDGET
// ============================================================================

/**
 * @route   POST /api/reports/budget/create
 * @desc    Create comprehensive project budget with categories and quarterly breakdown
 * @access  Private (Project Manager / Finance)
 * @body    project_id - Project ID (REQUIRED)
 * @body    budget_year - Budget year (REQUIRED)
 * @body    total_budget - Total budget amount (REQUIRED)
 * @body    categories - Budget categories breakdown (optional)
 * @body    quarters - Quarterly budget allocation (optional)
 * @body    subsidiary_id - Subsidiary ID (optional)
 */
router.post('/create', async (req, res) => {
  try {
    const budgetData = req.body;

    // Initialize service with sequelize
    const budgetPlanningService = new BudgetPlanningService(sequelize);

    const result = await budgetPlanningService.createProjectBudget(budgetData);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in create budget endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating project budget',
      error: error.message
    });
  }
});

// ============================================================================
// VARIANCE ANALYSIS
// ============================================================================

/**
 * @route   GET /api/reports/budget/variance-analysis
 * @desc    Generate comprehensive budget vs actual variance analysis
 * @access  Private (Finance / Management)
 * @query   project_id - Project ID (optional, if not provided shows all projects)
 * @query   budget_year - Budget year (default: current year)
 * @query   period - Analysis period (QUARTERLY, MONTHLY, ANNUAL, default: QUARTERLY)
 * @query   start_date - Start date for analysis (optional)
 * @query   end_date - End date for analysis (optional)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/variance-analysis', async (req, res) => {
  try {
    const { projectId, startDate, endDate, period, subsidiaryId } = req.query;

    // Initialize service with sequelize
    const budgetPlanningService = new BudgetPlanningService(sequelize);

    const result = await budgetPlanningService.generateVarianceAnalysis({
      projectId,
      startDate,
      endDate,
      period: period || 'QUARTERLY',
      subsidiaryId
    });
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error in variance analysis endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating variance analysis',
      error: error.message
    });
  }
});

// ============================================================================
// BUDGET FORECAST
// ============================================================================

/**
 * @route   GET /api/reports/budget/forecast
 * @desc    Generate budget forecasting with risk analysis and projections
 * @access  Private (Finance / Management)
 * @query   project_id - Project ID (optional)
 * @query   forecast_period - Number of months to forecast (default: 12)
 * @query   base_budget - Base budget amount for forecasting (optional)
 * @query   growth_assumptions - Growth assumptions JSON (optional)
 * @query   risk_factors - Risk factors JSON (optional)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/forecast', async (req, res) => {
  try {
    const {
      project_id,
      forecast_period = 12,
      base_budget,
      growth_assumptions,
      risk_factors,
      subsidiary_id
    } = req.query;

    // Initialize service with sequelize
    const budgetPlanningService = new BudgetPlanningService(sequelize);

    const params = {
      projectId: project_id,
      forecastPeriod: parseInt(forecast_period),
      baseBudget: base_budget ? parseFloat(base_budget) : undefined,
      growthAssumptions: growth_assumptions ? JSON.parse(growth_assumptions) : undefined,
      riskFactors: risk_factors ? JSON.parse(risk_factors) : undefined,
      subsidiaryId: subsidiary_id
    };

    const result = await budgetPlanningService.generateBudgetForecast(params);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error in budget forecast endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating budget forecast',
      error: error.message
    });
  }
});

// ============================================================================
// BUDGET DASHBOARD
// ============================================================================

/**
 * @route   GET /api/reports/budget/dashboard
 * @desc    Generate comprehensive budget performance dashboard
 * @access  Private (Finance / Management)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 * @query   period - Time period (CURRENT_QUARTER, CURRENT_YEAR, CURRENT_MONTH, default: CURRENT_QUARTER)
 * @query   project_ids - Comma-separated project IDs to include (optional)
 */
router.get('/dashboard', async (req, res) => {
  try {
    const {
      subsidiary_id,
      period = 'CURRENT_QUARTER',
      project_ids
    } = req.query;

    // Initialize service with sequelize
    const budgetPlanningService = new BudgetPlanningService(sequelize);

    const params = {
      subsidiaryId: subsidiary_id,
      period,
      projectIds: project_ids ? project_ids.split(',') : []
    };

    const result = await budgetPlanningService.generateBudgetDashboard(params);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error in budget dashboard endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating budget dashboard',
      error: error.message
    });
  }
});

// ============================================================================
// EXPORT
// ============================================================================

module.exports = router;
