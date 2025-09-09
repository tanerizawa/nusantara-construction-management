const express = require('express');
const { verifyToken } = require('../middleware/auth');
const AnalyticsService = require('../services/AnalyticsService');

const router = express.Router();

// ========== ANALYTICS API ENDPOINTS ==========

// @route   GET /api/analytics/financial
// @desc    Get comprehensive financial analytics
// @access  Private
router.get('/financial', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const analytics = await AnalyticsService.getFinancialAnalytics({
      startDate,
      endDate
    });

    res.json({
      success: true,
      data: analytics,
      message: 'Financial analytics retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching financial analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve financial analytics',
      details: error.message
    });
  }
});

// @route   GET /api/analytics/project/:projectId
// @desc    Get project-specific analytics
// @access  Private
router.get('/project/:projectId', verifyToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const analytics = await AnalyticsService.getProjectAnalytics(projectId);

    if (!analytics.project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found or no data available'
      });
    }

    res.json({
      success: true,
      data: analytics,
      message: 'Project analytics retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching project analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve project analytics',
      details: error.message
    });
  }
});

// @route   GET /api/analytics/efficiency
// @desc    Get approval efficiency metrics
// @access  Private
router.get('/efficiency', verifyToken, async (req, res) => {
  try {
    const metrics = await AnalyticsService.getApprovalEfficiencyMetrics();

    res.json({
      success: true,
      data: metrics,
      message: 'Efficiency metrics retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching efficiency metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve efficiency metrics',
      details: error.message
    });
  }
});

// @route   GET /api/analytics/dashboard
// @desc    Get real-time dashboard metrics
// @access  Private
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const metrics = await AnalyticsService.getDashboardMetrics();

    res.json({
      success: true,
      data: metrics,
      message: 'Dashboard metrics retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve dashboard metrics',
      details: error.message
    });
  }
});

// @route   GET /api/analytics/summary
// @desc    Get comprehensive analytics summary
// @access  Private
router.get('/summary', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Get all analytics data in parallel
    const [
      financialAnalytics,
      efficiencyMetrics,
      dashboardMetrics
    ] = await Promise.all([
      AnalyticsService.getFinancialAnalytics({ startDate, endDate }),
      AnalyticsService.getApprovalEfficiencyMetrics(),
      AnalyticsService.getDashboardMetrics()
    ]);

    res.json({
      success: true,
      data: {
        financial: financialAnalytics,
        efficiency: efficiencyMetrics,
        dashboard: dashboardMetrics,
        generatedAt: new Date()
      },
      message: 'Analytics summary retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analytics summary',
      details: error.message
    });
  }
});

// @route   POST /api/analytics/export
// @desc    Export analytics data to CSV/PDF
// @access  Private
router.post('/export', verifyToken, async (req, res) => {
  try {
    const { format, type, dateRange } = req.body;
    
    // Validate format
    if (!['csv', 'pdf', 'excel'].includes(format)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid export format. Supported formats: csv, pdf, excel'
      });
    }

    // Get analytics data based on type
    let data;
    switch (type) {
      case 'financial':
        data = await AnalyticsService.getFinancialAnalytics(dateRange);
        break;
      case 'efficiency':
        data = await AnalyticsService.getApprovalEfficiencyMetrics();
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid export type'
        });
    }

    // For now, return the data - export functionality can be enhanced later
    res.json({
      success: true,
      data: {
        exportData: data,
        format,
        type,
        exportedAt: new Date()
      },
      message: 'Analytics data prepared for export'
    });
  } catch (error) {
    console.error('Error exporting analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export analytics data',
      details: error.message
    });
  }
});

module.exports = router;
