/**
 * ============================================================================
 * PROJECT ANALYTICS ROUTES - Project Cost & Profitability Analysis
 * ============================================================================
 * 
 * Module: project-analytics.routes.js
 * Purpose: Project cost analysis, profitability tracking, and resource utilization
 * 
 * ENDPOINTS: 5 total
 * - GET /cost-analysis            - Detailed project cost breakdown
 * - GET /profitability            - Project profitability analysis
 * - GET /comparison               - Multi-project comparison
 * - GET /resource-utilization     - Resource usage across projects
 * - GET /track-costs              - Real-time cost tracking
 * 
 * EXTRACTED FROM: financialReports.js (lines 685-800, 1420-1460)
 * DEPENDENCIES: ProjectCostingService
 * 
 * ============================================================================
 */

const express = require('express');
const router = express.Router();

// Import project costing service (already instantiated)
const projectCostingService = require('../../services/ProjectCostingService');

// ============================================================================
// PROJECT COST ANALYSIS
// ============================================================================

/**
 * @route   GET /api/reports/project/cost-analysis
 * @desc    Generate detailed project cost breakdown and analysis
 * @access  Private (Requires authentication)
 * @query   project_id - Project ID (REQUIRED)
 * @query   start_date - Start date for analysis (optional)
 * @query   end_date - End date for analysis (optional)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/cost-analysis', async (req, res) => {
  try {
    const { project_id, start_date, end_date, subsidiary_id } = req.query;
    
    if (!project_id) {
      return res.status(400).json({
        success: false,
        message: 'project_id parameter is required'
      });
    }
    
    const result = await projectCostingService.generateProjectCostAnalysis({
      projectId: project_id,
      startDate: start_date ? new Date(start_date) : undefined,
      endDate: end_date ? new Date(end_date) : undefined,
      subsidiaryId: subsidiary_id
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error in project cost analysis endpoint:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error generating project cost analysis',
      error: error.message 
    });
  }
});

// ============================================================================
// PROJECT PROFITABILITY ANALYSIS
// ============================================================================

/**
 * @route   GET /api/reports/project/profitability
 * @desc    Analyze project profitability with revenue, costs, and margins
 * @access  Private (Requires authentication)
 * @query   project_id - Project ID (REQUIRED)
 * @query   start_date - Start date for analysis (optional)
 * @query   end_date - End date for analysis (optional)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/profitability', async (req, res) => {
  try {
    const { project_id, start_date, end_date, subsidiary_id } = req.query;
    
    if (!project_id) {
      return res.status(400).json({
        success: false,
        message: 'project_id parameter is required'
      });
    }
    
    const result = await projectCostingService.generateProjectProfitabilityAnalysis({
      projectId: project_id,
      startDate: start_date ? new Date(start_date) : undefined,
      endDate: end_date ? new Date(end_date) : undefined,
      subsidiaryId: subsidiary_id
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error in project profitability analysis endpoint:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error analyzing project profitability',
      error: error.message 
    });
  }
});

// ============================================================================
// MULTI-PROJECT COMPARISON
// ============================================================================

/**
 * @route   GET /api/reports/project/comparison
 * @desc    Compare multiple projects side-by-side (costs, timeline, performance)
 * @access  Private (Requires authentication)
 * @query   project_ids - Comma-separated project IDs (REQUIRED, e.g., "PRJ001,PRJ002,PRJ003")
 * @query   start_date - Start date for comparison period (optional)
 * @query   end_date - End date for comparison period (optional)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/comparison', async (req, res) => {
  try {
    const { project_ids, start_date, end_date, subsidiary_id } = req.query;
    
    if (!project_ids) {
      return res.status(400).json({
        success: false,
        message: 'project_ids parameter is required',
        format: 'Comma-separated list (e.g., PRJ001,PRJ002,PRJ003)'
      });
    }
    
    const projectIdArray = project_ids.split(',').map(id => id.trim());
    
    if (projectIdArray.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'At least 2 projects required for comparison'
      });
    }
    
    const result = await projectCostingService.generateMultiProjectComparison({
      projectIds: projectIdArray,
      startDate: start_date ? new Date(start_date) : undefined,
      endDate: end_date ? new Date(end_date) : undefined,
      subsidiaryId: subsidiary_id
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error in multi-project comparison endpoint:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error comparing projects',
      error: error.message 
    });
  }
});

// ============================================================================
// RESOURCE UTILIZATION ANALYSIS
// ============================================================================

/**
 * @route   GET /api/reports/project/resource-utilization
 * @desc    Analyze resource utilization across all projects (manpower, equipment, materials)
 * @access  Private (Requires authentication)
 * @query   start_date - Start date for analysis (optional)
 * @query   end_date - End date for analysis (optional)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/resource-utilization', async (req, res) => {
  try {
    const { start_date, end_date, subsidiary_id } = req.query;
    
    const result = await projectCostingService.generateResourceUtilizationAnalysis({
      startDate: start_date ? new Date(start_date) : undefined,
      endDate: end_date ? new Date(end_date) : undefined,
      subsidiaryId: subsidiary_id
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error in resource utilization analysis endpoint:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error analyzing resource utilization',
      error: error.message 
    });
  }
});

// ============================================================================
// REAL-TIME PROJECT COST TRACKING
// ============================================================================

/**
 * @route   GET /api/reports/project/track-costs
 * @desc    Real-time project cost tracking with forecasting
 * @access  Private (Requires authentication)
 * @query   project_id - Project ID (optional, if not provided shows all projects)
 * @query   start_date - Start date for tracking (optional)
 * @query   end_date - End date for tracking (optional)
 * @query   include_forecasting - Include cost forecasting (default: true)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/track-costs', async (req, res) => {
  try {
    const {
      project_id,
      start_date,
      end_date,
      include_forecasting = 'true',
      subsidiary_id
    } = req.query;

    const params = {
      projectId: project_id,
      startDate: start_date,
      endDate: end_date,
      includeForecasting: include_forecasting === 'true',
      subsidiaryId: subsidiary_id
    };

    const result = await projectCostingService.generateProjectCostAnalysis(params);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error in project cost tracking endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking project costs',
      error: error.message
    });
  }
});

// ============================================================================
// EXPORT
// ============================================================================

module.exports = router;
