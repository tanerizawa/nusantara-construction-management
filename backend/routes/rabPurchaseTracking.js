const express = require('express');
const router = express.Router();
const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');

// Model for RAB Purchase Tracking
const RABPurchaseTracking = sequelize.define('RABPurchaseTracking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  projectId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rabItemId: {
    type: DataTypes.STRING, // Changed to STRING to support UUID from RAB items
    allowNull: false
  },
  poNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  unitPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  purchaseDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'rab_purchase_tracking',
  timestamps: true,
  underscored: true  // ✅ Convert camelCase to snake_case for DB columns
});

// Initialize the table (disabled to prevent conflicts with views)
// RABPurchaseTracking.sync({ alter: true });

/**
 * GET /api/database/projects/:projectId/rab-items/:rabItemId/purchase-summary
 * Get purchase summary for a specific RAB item
 */
router.get('/projects/:projectId/rab-items/:rabItemId/purchase-summary', async (req, res) => {
  try {
    const { projectId, rabItemId } = req.params;

    // Get all purchase records for this RAB item
    const purchaseRecords = await RABPurchaseTracking.findAll({
      where: {
        projectId,
        rabItemId: rabItemId // No parseInt needed, support UUID
      },
      order: [['purchaseDate', 'DESC']]
    });

    // ✅ Filter active purchases (pending, approved, received - exclude draft and cancelled)
    // This ensures quantity is reserved as soon as PO is submitted (pending status)
    const activePurchases = purchaseRecords.filter(record => 
      ['pending', 'approved', 'received'].includes(record.status)
    );

    // Calculate totals from active purchases only
    const totalPurchased = activePurchases.reduce((sum, record) => {
      return sum + parseFloat(record.quantity || 0);
    }, 0);

    const totalAmount = activePurchases.reduce((sum, record) => {
      return sum + parseFloat(record.totalAmount || 0);
    }, 0);

    // Count active POs
    const activePOCount = activePurchases.length;

    // Get last purchase date
    const lastPurchaseDate = purchaseRecords.length > 0 ? 
      purchaseRecords[0].purchaseDate : null;

    // Format history
    const history = purchaseRecords.map(record => ({
      id: record.id,
      poNumber: record.poNumber,
      quantity: parseFloat(record.quantity),
      unitPrice: parseFloat(record.unitPrice),
      totalAmount: parseFloat(record.totalAmount),
      purchaseDate: record.purchaseDate,
      status: record.status,
      notes: record.notes
    }));

    res.json({
      success: true,
      data: {
        totalPurchased,
        totalAmount,
        activePOCount,
        lastPurchaseDate,
        history
      }
    });

  } catch (error) {
    console.error('Error fetching purchase summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch purchase summary',
      error: error.message
    });
  }
});

/**
 * POST /api/database/projects/:projectId/rab-items/:rabItemId/purchase-tracking
 * Add new purchase tracking record
 */
router.post('/projects/:projectId/rab-items/:rabItemId/purchase-tracking', async (req, res) => {
  try {
    const { projectId, rabItemId } = req.params;
    const { 
      quantity, 
      unitPrice, 
      totalAmount, 
      poReference, 
      purchaseDate, 
      status = 'pending',
      notes 
    } = req.body;

    // Validate required fields
    if (!quantity || !unitPrice || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Quantity, unitPrice, and totalAmount are required'
      });
    }

    // Create new tracking record
    const newRecord = await RABPurchaseTracking.create({
      projectId,
      rabItemId: rabItemId, // Support UUID without parseInt
      poNumber: poReference,
      quantity: parseFloat(quantity),
      unitPrice: parseFloat(unitPrice),
      totalAmount: parseFloat(totalAmount),
      purchaseDate: purchaseDate || new Date(),
      status,
      notes
    });

    res.json({
      success: true,
      data: newRecord,
      message: 'Purchase tracking record created successfully'
    });

  } catch (error) {
    console.error('Error creating purchase tracking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create purchase tracking record',
      error: error.message
    });
  }
});

/**
 * PUT /api/database/projects/:projectId/rab-items/:rabItemId/purchase-tracking/:trackingId
 * Update purchase tracking record (e.g., when PO number is assigned)
 */
router.put('/projects/:projectId/rab-items/:rabItemId/purchase-tracking/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;
    const updateData = req.body;

    const [updatedRowsCount] = await RABPurchaseTracking.update(updateData, {
      where: { id: parseInt(trackingId) }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Purchase tracking record not found'
      });
    }

    const updatedRecord = await RABPurchaseTracking.findByPk(parseInt(trackingId));

    res.json({
      success: true,
      data: updatedRecord,
      message: 'Purchase tracking record updated successfully'
    });

  } catch (error) {
    console.error('Error updating purchase tracking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update purchase tracking record',
      error: error.message
    });
  }
});

/**
 * GET /api/database/projects/:projectId/purchase-summary
 * Get purchase summary for all RAB items in a project
 */
router.get('/projects/:projectId/purchase-summary', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    console.log(`📊 [PURCHASE SUMMARY] Fetching for project: ${projectId}`);

    // Get all purchase records for this project
    const purchaseRecords = await RABPurchaseTracking.findAll({
      where: { projectId },
      order: [['rabItemId', 'ASC'], ['purchaseDate', 'DESC']]
    });
    
    console.log(`📊 [PURCHASE SUMMARY] Found ${purchaseRecords.length} purchase records`);

    // Group by RAB item ID
    const groupedByRABItem = purchaseRecords.reduce((acc, record) => {
      const rabItemId = record.rabItemId;
      if (!acc[rabItemId]) {
        acc[rabItemId] = [];
      }
      acc[rabItemId].push(record);
      return acc;
    }, {});
    
    console.log(`📊 [PURCHASE SUMMARY] Grouped into ${Object.keys(groupedByRABItem).length} RAB items`);

    // Calculate summary for each RAB item
    const summary = Object.keys(groupedByRABItem).map(rabItemId => {
      const records = groupedByRABItem[rabItemId];
      
      // ✅ Count pending, approved, and received POs (exclude draft and cancelled)
      // This ensures quantity is reserved as soon as PO is submitted (pending status)
      const activePurchases = records.filter(record => 
        ['pending', 'approved', 'received'].includes(record.status)
      );
      
      const totalPurchased = activePurchases.reduce((sum, record) => 
        sum + parseFloat(record.quantity), 0
      );
      const totalAmount = activePurchases.reduce((sum, record) => 
        sum + parseFloat(record.totalAmount), 0
      );
      const activePOCount = activePurchases.length;
      
      console.log(`📊 [PURCHASE SUMMARY] RAB ${rabItemId}: ${activePurchases.length} active POs, total qty: ${totalPurchased}`);

      return {
        rabItemId: rabItemId, // Keep as string (UUID)
        totalPurchased,
        totalAmount,
        activePOCount,
        lastPurchaseDate: records[0].purchaseDate,
        recordCount: records.length
      };
    });
    
    console.log(`✅ [PURCHASE SUMMARY] Returning ${summary.length} RAB item summaries`);

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Error fetching project purchase summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project purchase summary',
      error: error.message
    });
  }
});

module.exports = router;