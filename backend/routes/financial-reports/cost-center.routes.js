/**
 * ============================================================================
 * COST CENTER ROUTES - Cost Center Management & Allocation
 * ============================================================================
 * 
 * Module: cost-center.routes.js
 * Purpose: Cost center performance tracking, cost allocation, and reporting
 * 
 * ENDPOINTS: 3 total
 * - GET /performance             - Cost center performance analysis
 * - GET /allocation-report       - Cost allocation report
 * - POST /allocate               - Allocate costs to cost centers (bonus)
 * 
 * EXTRACTED FROM: financialReports.js (lines 1250-1370)
 * DEPENDENCIES: CostCenterService
 * 
 * ============================================================================
 */

const express = require('express');
const router = express.Router();

// Import Sequelize for CostCenterService initialization
const { sequelize } = require('../../models');

// Import and initialize cost center service
const CostCenterService = require('../../services/CostCenterService');
const costCenterService = new CostCenterService(sequelize);

// ============================================================================
// COST CENTER PERFORMANCE
// ============================================================================

/**
 * @route   GET /api/reports/cost-center/performance
 * @desc    Get cost center performance analysis with budget vs actual comparison
 * @access  Private (Finance / Management)
 * @query   cost_center_id - Cost center ID (optional, if not provided shows all)
 * @query   start_date - Start date for analysis (optional)
 * @query   end_date - End date for analysis (optional)
 * @query   include_allocations - Include cost allocations (default: true)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/performance', async (req, res) => {
  try {
    const {
      cost_center_id,
      start_date,
      end_date,
      include_allocations = 'true',
      subsidiary_id
    } = req.query;

    const params = {
      costCenterId: cost_center_id,
      startDate: start_date,
      endDate: end_date,
      includeAllocations: include_allocations === 'true',
      subsidiaryId: subsidiary_id
    };

    const result = await costCenterService.getCostCenterPerformance(params);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error in cost center performance endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating cost center performance analysis',
      error: error.message
    });
  }
});

// ============================================================================
// COST ALLOCATION REPORT
// ============================================================================

/**
 * @route   GET /api/reports/cost-center/allocation-report
 * @desc    Generate detailed cost allocation report across cost centers
 * @access  Private (Finance / Management)
 * @query   project_id - Filter by project ID (optional)
 * @query   cost_center_id - Filter by cost center ID (optional)
 * @query   start_date - Start date for report (optional)
 * @query   end_date - End date for report (optional)
 * @query   allocation_type - Type of allocation (DIRECT, INDIRECT, OVERHEAD, optional)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 */
router.get('/allocation-report', async (req, res) => {
  try {
    const {
      project_id,
      cost_center_id,
      start_date,
      end_date,
      allocation_type,
      subsidiary_id
    } = req.query;

    const params = {
      projectId: project_id,
      costCenterId: cost_center_id,
      startDate: start_date,
      endDate: end_date,
      allocationType: allocation_type,
      subsidiaryId: subsidiary_id
    };

    const result = await costCenterService.getCostAllocationReport(params);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error in cost allocation report endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating cost allocation report',
      error: error.message
    });
  }
});

// ============================================================================
// ALLOCATE COSTS (POST - Bonus endpoint for completeness)
// ============================================================================

/**
 * @route   POST /api/reports/cost-center/allocate
 * @desc    Allocate costs to cost centers
 * @access  Private (Finance)
 * @body    cost_center_id - Cost center ID (REQUIRED)
 * @body    project_id - Project ID (optional)
 * @body    allocation_amount - Amount to allocate (REQUIRED)
 * @body    allocation_type - Type (DIRECT, INDIRECT, OVERHEAD)
 * @body    allocation_basis - Basis for allocation (optional)
 * @body    description - Allocation description (optional)
 * @body    effective_date - Effective date (optional)
 * @body    journal_entry_id - Related journal entry ID (optional)
 */
router.post('/allocate', async (req, res) => {
  try {
    const params = {
      costCenterId: req.body.cost_center_id,
      projectId: req.body.project_id,
      allocationAmount: req.body.allocation_amount,
      allocationType: req.body.allocation_type,
      allocationBasis: req.body.allocation_basis,
      description: req.body.description,
      effectiveDate: req.body.effective_date,
      journalEntryId: req.body.journal_entry_id
    };

    const result = await costCenterService.allocateCosts(params);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in cost allocation endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error allocating costs',
      error: error.message
    });
  }
});

// ============================================================================
// EXPORT
// ============================================================================

module.exports = router;
