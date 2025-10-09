/**
 * ============================================================================
 * FIXED ASSET MANAGEMENT ROUTES - Asset Tracking & Depreciation
 * ============================================================================
 * 
 * Module: fixed-assets.routes.js
 * Purpose: Fixed asset registration, depreciation, maintenance, and valuation
 * 
 * ENDPOINTS: 9 total
 * - GET /list                     - List all fixed assets with filtering
 * - GET /depreciation             - Calculate asset depreciation
 * - GET /valuation                - Current asset valuation report
 * - GET /maintenance-schedule     - Maintenance schedule and history
 * - GET /analytics                - Comprehensive asset analytics
 * - POST /register                - Register new fixed asset
 * - POST /dispose                 - Process asset disposal
 * - PUT /:id                      - Update existing asset
 * - DELETE /:id                   - Delete asset record
 * 
 * EXTRACTED FROM: financialReports.js (lines 1500-2010)
 * DEPENDENCIES: FixedAssetService
 * 
 * ============================================================================
 */

const express = require('express');
const router = express.Router();

// Import fixed asset service
const FixedAssetService = require('../../services/FixedAssetService');
const fixedAssetService = new FixedAssetService();

// ============================================================================
// ASSET LIST & FILTERING
// ============================================================================

/**
 * @route   GET /api/reports/fixed-asset/list
 * @desc    Get list of all fixed assets with optional filtering
 * @access  Private (Requires authentication)
 * @query   category - Asset category filter (optional)
 * @query   status - Asset status filter (optional)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 * @query   location - Filter by location (optional)
 * @query   search - Search term (optional)
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 50)
 */
router.get('/list', async (req, res) => {
  try {
    const {
      category,
      status,
      subsidiary_id,
      location,
      search,
      page = 1,
      limit = 50
    } = req.query;

    const filters = {
      category: category,
      status: status,
      subsidiaryId: subsidiary_id,
      location: location,
      search: search
    };

    const result = await fixedAssetService.getAssetList(filters, parseInt(page), parseInt(limit));
    
    res.json({
      success: true,
      message: 'Assets retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Error retrieving asset list:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving asset list',
      error: error.message
    });
  }
});

// ============================================================================
// ASSET REGISTRATION
// ============================================================================

/**
 * @route   POST /api/reports/fixed-asset/register
 * @desc    Register new fixed asset
 * @access  Private (Requires authentication)
 * @body    Asset details (assetCode, assetName, category, purchasePrice, etc.)
 */
router.post('/register', async (req, res) => {
  try {
    const result = await fixedAssetService.registerAsset(req.body);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error registering fixed asset:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering fixed asset',
      error: error.message
    });
  }
});

// ============================================================================
// DEPRECIATION CALCULATION
// ============================================================================

/**
 * @route   GET /api/reports/fixed-asset/depreciation
 * @desc    Calculate depreciation for specific asset or all assets
 * @access  Private (Requires authentication)
 * @query   asset_id - Asset ID (optional, if not provided shows all)
 * @query   as_of_date - Calculation date (default: current date)
 * @query   depreciation_method - Method (STRAIGHT_LINE, DECLINING_BALANCE, etc.)
 * @query   category - Filter by category (optional)
 */
router.get('/depreciation', async (req, res) => {
  try {
    const {
      asset_id,
      as_of_date = new Date(),
      depreciation_method,
      category
    } = req.query;

    // Mock asset data for demonstration
    const mockAsset = {
      id: asset_id || 'ASSET-1694175600001',
      assetCode: 'EXC-001',
      assetName: 'Excavator CAT 320D',
      assetCategory: 'HEAVY_EQUIPMENT',
      purchasePrice: 2500000000,
      purchaseDate: new Date('2023-01-15'),
      depreciationStartDate: new Date('2023-01-15'),
      usefulLife: 10,
      salvageValue: 250000000,
      depreciationMethod: depreciation_method || 'STRAIGHT_LINE',
      accumulatedDepreciation: 0
    };

    const depreciation = fixedAssetService.calculateDepreciation(mockAsset, new Date(as_of_date));
    const schedule = fixedAssetService.generateDepreciationSchedule(mockAsset);

    res.json({
      success: true,
      message: 'Depreciation calculated successfully',
      data: {
        asset: {
          assetId: mockAsset.id,
          assetCode: mockAsset.assetCode,
          assetName: mockAsset.assetName,
          category: mockAsset.assetCategory
        },
        depreciation: depreciation,
        depreciationSchedule: schedule.slice(0, 5), // First 5 years
        summary: {
          originalCost: mockAsset.purchasePrice,
          salvageValue: mockAsset.salvageValue,
          depreciableAmount: mockAsset.purchasePrice - mockAsset.salvageValue,
          currentNetBookValue: depreciation.netBookValue,
          depreciationMethod: mockAsset.depreciationMethod
        }
      }
    });

  } catch (error) {
    console.error('Error calculating depreciation:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating depreciation',
      error: error.message
    });
  }
});

// ============================================================================
// ASSET VALUATION REPORT
// ============================================================================

/**
 * @route   GET /api/reports/fixed-asset/valuation
 * @desc    Get current asset valuation report
 * @access  Private (Requires authentication)
 * @query   as_of_date - Valuation date (default: current date)
 * @query   category - Filter by category (optional)
 * @query   valuation_method - NET_BOOK_VALUE, FAIR_VALUE, REPLACEMENT_COST (default: NET_BOOK_VALUE)
 */
router.get('/valuation', async (req, res) => {
  try {
    const {
      as_of_date = new Date(),
      category,
      valuation_method = 'NET_BOOK_VALUE'
    } = req.query;

    const asOfDate = new Date(as_of_date);

    // Mock asset valuation data
    const assetValuation = [
      {
        assetId: 'ASSET-001',
        assetCode: 'EXC-001',
        assetName: 'Excavator CAT 320D',
        category: 'HEAVY_EQUIPMENT',
        purchaseDate: new Date('2023-01-15'),
        originalCost: 2500000000,
        accumulatedDepreciation: 520833333,
        netBookValue: 1979166667,
        fairValue: 2100000000,
        replacementCost: 2800000000,
        marketValue: 1950000000,
        insuranceValue: 2200000000,
        condition: 'GOOD',
        location: 'Site A - Jakarta'
      },
      {
        assetId: 'ASSET-002',
        assetCode: 'CRN-001',
        assetName: 'Tower Crane Liebherr',
        category: 'HEAVY_EQUIPMENT',
        purchaseDate: new Date('2022-06-10'),
        originalCost: 5000000000,
        accumulatedDepreciation: 1166666667,
        netBookValue: 3833333333,
        fairValue: 4200000000,
        replacementCost: 5800000000,
        marketValue: 3900000000,
        insuranceValue: 4500000000,
        condition: 'GOOD',
        location: 'Site B - Bekasi'
      },
      {
        assetId: 'ASSET-003',
        assetCode: 'TRK-001',
        assetName: 'Dump Truck Mitsubishi',
        category: 'VEHICLES',
        purchaseDate: new Date('2021-03-20'),
        originalCost: 1500000000,
        accumulatedDepreciation: 937500000,
        netBookValue: 562500000,
        fairValue: 680000000,
        replacementCost: 1800000000,
        marketValue: 650000000,
        insuranceValue: 750000000,
        condition: 'FAIR',
        location: 'Head Office - Jakarta'
      }
    ];

    const filteredAssets = category ? 
      assetValuation.filter(a => a.category === category) : assetValuation;

    const summary = {
      totalAssets: filteredAssets.length,
      totalOriginalCost: filteredAssets.reduce((sum, asset) => sum + asset.originalCost, 0),
      totalAccumulatedDepreciation: filteredAssets.reduce((sum, asset) => sum + asset.accumulatedDepreciation, 0),
      totalNetBookValue: filteredAssets.reduce((sum, asset) => sum + asset.netBookValue, 0),
      totalFairValue: filteredAssets.reduce((sum, asset) => sum + asset.fairValue, 0),
      totalReplacementCost: filteredAssets.reduce((sum, asset) => sum + asset.replacementCost, 0),
      averageAge: 2.5,
      averageDepreciationRate: 35.2
    };

    const categoryBreakdown = {};
    filteredAssets.forEach(asset => {
      if (!categoryBreakdown[asset.category]) {
        categoryBreakdown[asset.category] = {
          count: 0,
          totalOriginalCost: 0,
          totalNetBookValue: 0,
          totalFairValue: 0
        };
      }
      categoryBreakdown[asset.category].count++;
      categoryBreakdown[asset.category].totalOriginalCost += asset.originalCost;
      categoryBreakdown[asset.category].totalNetBookValue += asset.netBookValue;
      categoryBreakdown[asset.category].totalFairValue += asset.fairValue;
    });

    res.json({
      success: true,
      message: 'Asset valuation report generated successfully',
      data: {
        reportType: 'Asset Valuation Report',
        asOfDate: asOfDate,
        valuationMethod: valuation_method,
        summary: summary,
        categoryBreakdown: categoryBreakdown,
        assets: filteredAssets,
        valuationNotes: [
          'Net Book Value calculated using straight-line depreciation method',
          'Fair values estimated based on current market conditions',
          'Replacement costs include current market prices plus installation',
          'Market values based on recent comparable sales'
        ],
        revaluationRecommendations: [
          {
            assetCode: 'CRN-001',
            recommendation: 'Consider revaluation - fair value significantly higher than NBV',
            potentialImpact: 366666667
          }
        ]
      }
    });

  } catch (error) {
    console.error('Error generating asset valuation:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating asset valuation',
      error: error.message
    });
  }
});

// ============================================================================
// MAINTENANCE SCHEDULE
// ============================================================================

/**
 * @route   GET /api/reports/fixed-asset/maintenance-schedule
 * @desc    Get maintenance schedule for assets
 * @access  Private (Requires authentication)
 * @query   asset_id - Specific asset ID (optional)
 * @query   category - Filter by category (default: HEAVY_EQUIPMENT)
 * @query   upcoming_months - Number of months to forecast (default: 12)
 */
router.get('/maintenance-schedule', async (req, res) => {
  try {
    const {
      asset_id,
      category = 'HEAVY_EQUIPMENT',
      upcoming_months = 12
    } = req.query;

    // Mock asset data
    const assets = [
      {
        id: 'ASSET-001',
        assetCode: 'EXC-001',
        assetName: 'Excavator CAT 320D',
        assetCategory: 'HEAVY_EQUIPMENT',
        purchasePrice: 2500000000,
        purchaseDate: new Date('2023-01-15'),
        lastMaintenanceDate: new Date('2025-06-15'),
        nextMaintenanceDate: new Date('2025-12-15'),
        maintenanceInterval: 180, // days
        location: 'Site A - Jakarta',
        condition: 'GOOD'
      },
      {
        id: 'ASSET-002',
        assetCode: 'CRN-001',
        assetName: 'Tower Crane Liebherr',
        assetCategory: 'HEAVY_EQUIPMENT',
        purchasePrice: 5000000000,
        purchaseDate: new Date('2022-06-10'),
        lastMaintenanceDate: new Date('2025-08-01'),
        nextMaintenanceDate: new Date('2025-11-01'),
        maintenanceInterval: 90, // days
        location: 'Site B - Bekasi',
        condition: 'GOOD'
      }
    ];

    const filteredAssets = asset_id ? 
      assets.filter(a => a.id === asset_id) : 
      assets.filter(a => a.assetCategory === category);

    const maintenanceSchedule = filteredAssets.map(asset => {
      const schedule = fixedAssetService.generateMaintenanceSchedule(asset);
      return {
        assetInfo: {
          assetId: asset.id,
          assetCode: asset.assetCode,
          assetName: asset.assetName,
          category: asset.assetCategory,
          location: asset.location,
          condition: asset.condition
        },
        currentStatus: {
          lastMaintenance: asset.lastMaintenanceDate,
          nextMaintenance: asset.nextMaintenanceDate,
          daysSinceLastMaintenance: Math.floor((new Date() - asset.lastMaintenanceDate) / (1000 * 60 * 60 * 24)),
          daysUntilNextMaintenance: Math.floor((asset.nextMaintenanceDate - new Date()) / (1000 * 60 * 60 * 24))
        },
        upcomingMaintenance: schedule,
        maintenanceHistory: [
          {
            date: new Date('2025-06-15'),
            type: 'ROUTINE',
            cost: 25000000,
            description: 'Regular maintenance and oil change',
            technician: 'Ahmad Sudirman'
          },
          {
            date: new Date('2025-03-15'),
            type: 'MAJOR',
            cost: 75000000,
            description: 'Engine overhaul and parts replacement',
            technician: 'Budi Santoso'
          }
        ]
      };
    });

    res.json({
      success: true,
      message: 'Maintenance schedule generated successfully',
      data: {
        reportType: 'Asset Maintenance Schedule',
        generatedDate: new Date(),
        filters: {
          assetId: asset_id,
          category: category,
          upcomingMonths: parseInt(upcoming_months)
        },
        summary: {
          totalAssets: maintenanceSchedule.length,
          assetsRequiringMaintenance: maintenanceSchedule.filter(m => 
            m.currentStatus.daysUntilNextMaintenance <= 30).length,
          overdueMaintenance: maintenanceSchedule.filter(m => 
            m.currentStatus.daysUntilNextMaintenance < 0).length,
          estimatedMaintenanceCosts: maintenanceSchedule.reduce((sum, m) => 
            sum + m.upcomingMaintenance.reduce((subSum, sched) => subSum + sched.estimatedCost, 0), 0)
        },
        maintenanceSchedule: maintenanceSchedule
      }
    });

  } catch (error) {
    console.error('Error generating maintenance schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating maintenance schedule',
      error: error.message
    });
  }
});

// ============================================================================
// ASSET ANALYTICS
// ============================================================================

/**
 * @route   GET /api/reports/fixed-asset/analytics
 * @desc    Generate comprehensive asset analytics and performance metrics
 * @access  Private (Requires authentication)
 * @query   category - Filter by category (optional)
 * @query   subsidiary_id - Filter by subsidiary (optional)
 * @query   date_from - Start date for analysis (optional)
 * @query   date_to - End date for analysis (optional)
 * @query   include_disposed - Include disposed assets (default: false)
 */
router.get('/analytics', async (req, res) => {
  try {
    const {
      category,
      subsidiary_id,
      date_from,
      date_to,
      include_disposed = false
    } = req.query;

    const filters = {
      category: category,
      subsidiaryId: subsidiary_id,
      dateFrom: date_from ? new Date(date_from) : null,
      dateTo: date_to ? new Date(date_to) : null,
      includeDisposed: include_disposed === 'true'
    };

    const result = await fixedAssetService.generateAssetAnalytics(filters);
    
    res.json({
      success: true,
      message: 'Asset analytics generated successfully',
      data: {
        reportType: 'Fixed Asset Analytics',
        period: {
          startDate: filters.dateFrom || new Date(new Date().getFullYear(), 0, 1),
          endDate: filters.dateTo || new Date()
        },
        filters: filters,
        analytics: result.data
      }
    });

  } catch (error) {
    console.error('Error generating asset analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating asset analytics',
      error: error.message
    });
  }
});

// ============================================================================
// UPDATE ASSET
// ============================================================================

/**
 * @route   PUT /api/reports/fixed-asset/:id
 * @desc    Update existing fixed asset
 * @access  Private (Requires authentication)
 * @param   id - Asset ID
 * @body    Updated asset details
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await fixedAssetService.updateAsset(id, req.body);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error updating fixed asset:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating fixed asset',
      error: error.message
    });
  }
});

// ============================================================================
// DELETE ASSET
// ============================================================================

/**
 * @route   DELETE /api/reports/fixed-asset/:id
 * @desc    Delete fixed asset record
 * @access  Private (Requires authentication)
 * @param   id - Asset ID
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await fixedAssetService.deleteAsset(id);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error deleting fixed asset:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting fixed asset',
      error: error.message
    });
  }
});

// ============================================================================
// ASSET DISPOSAL
// ============================================================================

/**
 * @route   POST /api/reports/fixed-asset/dispose
 * @desc    Process asset disposal
 * @access  Private (Requires authentication)
 * @body    asset_id, disposal_date, disposal_method, disposal_value, etc.
 */
router.post('/dispose', async (req, res) => {
  try {
    const { asset_id } = req.body;
    
    // Mock asset for disposal
    const mockAsset = {
      id: asset_id,
      assetCode: req.body.asset_code || 'TRK-001',
      assetName: req.body.asset_name || 'Dump Truck Mitsubishi',
      purchasePrice: 1500000000,
      purchaseDate: new Date('2020-06-01'),
      depreciationStartDate: new Date('2020-06-01'),
      usefulLife: 8,
      salvageValue: 150000000,
      depreciationMethod: 'STRAIGHT_LINE',
      accumulatedDepreciation: 0
    };

    const disposalData = {
      ...req.body,
      asset: mockAsset
    };

    const result = await fixedAssetService.disposeAsset(asset_id, disposalData);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error processing asset disposal:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing asset disposal',
      error: error.message
    });
  }
});

// ============================================================================
// EXPORT
// ============================================================================

module.exports = router;
