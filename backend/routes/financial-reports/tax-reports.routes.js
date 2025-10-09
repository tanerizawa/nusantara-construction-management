/**
 * ============================================================================
 * TAX REPORTS ROUTES - Indonesian Tax Compliance
 * ============================================================================
 * 
 * Module: tax-reports.routes.js
 * Purpose: Generate Indonesian tax compliance reports
 * 
 * ENDPOINTS: 4 total
 * - GET /tax/pph21                  - PPh 21 (Income Tax) Report
 * - GET /tax/ppn                    - PPN (Value Added Tax) Report
 * - GET /tax/pph23                  - PPh 23 (Withholding Tax) Report
 * - GET /tax/construction-summary   - Comprehensive Tax Summary
 * 
 * EXTRACTED FROM: financialReports.js (lines 575-695)
 * DEPENDENCIES: IndonesianTaxService
 * COMPLIANCE: Indonesian Tax Regulations (DJP)
 * 
 * ============================================================================
 */

const express = require('express');
const router = express.Router();

// Import Indonesian tax service
const IndonesianTaxService = require('../../services/IndonesianTaxService');

// ============================================================================
// PPh 21 - INCOME TAX REPORT
// ============================================================================

/**
 * @route   GET /api/reports/tax/pph21
 * @desc    Generate PPh 21 (Income Tax) monthly report
 * @access  Private (Requires authentication)
 * @query   month - Month (1-12, REQUIRED)
 * @query   year - Year (optional, default: current year)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/pph21', async (req, res) => {
  try {
    const { month, year, subsidiary_id } = req.query;
    
    if (!month) {
      return res.status(400).json({
        success: false,
        message: 'Month parameter is required',
        format: '1-12'
      });
    }
    
    const result = await IndonesianTaxService.generatePPh21Report({
      month: parseInt(month),
      year: year ? parseInt(year) : undefined,
      subsidiaryId: subsidiary_id
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error in PPh 21 report endpoint:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error generating PPh 21 report',
      error: error.message 
    });
  }
});

// ============================================================================
// PPN - VALUE ADDED TAX REPORT
// ============================================================================

/**
 * @route   GET /api/reports/tax/ppn
 * @desc    Generate PPN (Value Added Tax) monthly report
 * @access  Private (Requires authentication)
 * @query   month - Month (1-12, REQUIRED)
 * @query   year - Year (optional, default: current year)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/ppn', async (req, res) => {
  try {
    const { month, year, subsidiary_id } = req.query;
    
    if (!month) {
      return res.status(400).json({
        success: false,
        message: 'Month parameter is required',
        format: '1-12'
      });
    }
    
    const result = await IndonesianTaxService.generatePPNReport({
      month: parseInt(month),
      year: year ? parseInt(year) : undefined,
      subsidiaryId: subsidiary_id
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error in PPN report endpoint:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error generating PPN report',
      error: error.message 
    });
  }
});

// ============================================================================
// PPh 23 - WITHHOLDING TAX REPORT
// ============================================================================

/**
 * @route   GET /api/reports/tax/pph23
 * @desc    Generate PPh 23 (Withholding Tax on Services) monthly report
 * @access  Private (Requires authentication)
 * @query   month - Month (1-12, REQUIRED)
 * @query   year - Year (optional, default: current year)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/pph23', async (req, res) => {
  try {
    const { month, year, subsidiary_id } = req.query;
    
    if (!month) {
      return res.status(400).json({
        success: false,
        message: 'Month parameter is required',
        format: '1-12'
      });
    }
    
    const result = await IndonesianTaxService.generatePPh23Report({
      month: parseInt(month),
      year: year ? parseInt(year) : undefined,
      subsidiaryId: subsidiary_id
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error in PPh 23 report endpoint:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error generating PPh 23 report',
      error: error.message 
    });
  }
});

// ============================================================================
// CONSTRUCTION TAX SUMMARY - COMPREHENSIVE REPORT
// ============================================================================

/**
 * @route   GET /api/reports/tax/construction-summary
 * @desc    Generate comprehensive construction tax summary (all tax types)
 * @access  Private (Requires authentication)
 * @query   month - Month (1-12, REQUIRED)
 * @query   year - Year (optional, default: current year)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/construction-summary', async (req, res) => {
  try {
    const { month, year, subsidiary_id } = req.query;
    
    if (!month) {
      return res.status(400).json({
        success: false,
        message: 'Month parameter is required',
        format: '1-12'
      });
    }
    
    const result = await IndonesianTaxService.generateTaxSummary({
      month: parseInt(month),
      year: year ? parseInt(year) : undefined,
      subsidiaryId: subsidiary_id
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error in construction tax summary endpoint:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error generating construction tax summary',
      error: error.message 
    });
  }
});

// ============================================================================
// EXPORT
// ============================================================================

module.exports = router;
