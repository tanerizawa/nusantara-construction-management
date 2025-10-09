const express = require('express');
const Joi = require('joi');
const { Op, DataTypes } = require('sequelize');
const PurchaseOrder = require('../models/PurchaseOrder');
const { verifyToken } = require('../middleware/auth');
const POFinanceSyncService = require('../services/poFinanceSync');
const { sequelize } = require('../config/database');

const router = express.Router();

// Define RABPurchaseTracking model for quantity tracking
const RABPurchaseTracking = sequelize.define(
  "RABPurchaseTracking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    projectId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rabItemId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    poNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "rab_purchase_tracking",
    timestamps: true,
  }
);

// Validation schema
const purchaseOrderSchema = Joi.object({
  id: Joi.string().optional(),
  poNumber: Joi.string().required(),
  supplierId: Joi.string().required(),
  supplierName: Joi.string().required(),
  orderDate: Joi.date().required(),
  expectedDeliveryDate: Joi.date().optional(),
  status: Joi.string().valid('draft', 'pending', 'approved', 'received', 'cancelled').default('draft'),
  items: Joi.array().items(
    Joi.object({
      inventoryId: Joi.string().required(),
      itemName: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
      unitPrice: Joi.number().min(0).required(),
      totalPrice: Joi.number().min(0).required(),
      description: Joi.string().allow('').optional()
    })
  ).min(1).required(),
  subtotal: Joi.number().min(0).required(),
  taxAmount: Joi.number().min(0).default(0),
  totalAmount: Joi.number().min(0).required(),
  notes: Joi.string().allow('').optional(),
  deliveryAddress: Joi.string().allow('').optional(),
  terms: Joi.string().allow('').optional(),
  projectId: Joi.string().optional()
});

// @route   GET /api/purchase-orders
// @desc    Get all purchase orders
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      status,
      supplier,
      projectId,
      startDate,
      endDate,
      q,
      sort = 'orderDate',
      order = 'desc',
      limit = 50,
      page = 1
    } = req.query;

    const limitNum = Math.max(1, parseInt(limit));
    const pageNum = Math.max(1, parseInt(page));
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const whereClause = {};
    
    if (projectId) {
      whereClause.projectId = projectId;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (supplier) {
      whereClause.supplierId = supplier;
    }
    
    if (startDate && endDate) {
      whereClause.orderDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.orderDate = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      whereClause.orderDate = {
        [Op.lte]: new Date(endDate)
      };
    }
    
    if (q) {
      whereClause[Op.or] = [
        { poNumber: { [Op.iLike]: `%${q}%` } },
        { supplierName: { [Op.iLike]: `%${q}%` } },
        { notes: { [Op.iLike]: `%${q}%` } }
      ];
    }

    const { count, rows: orders } = await PurchaseOrder.findAndCountAll({
      where: whereClause,
      order: [[sort, order.toUpperCase()]],
      limit: limitNum,
      offset: offset
    });

    res.json({
      success: true,
      data: orders,
      pagination: {
        current: pageNum,
        total: Math.ceil(count / limitNum),
        count: count,
        perPage: limitNum
      }
    });
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch purchase orders',
      details: error.message
    });
  }
});

// @route   GET /api/purchase-orders/stats
// @desc    Get purchase order statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const { period } = req.query;
    const whereClause = {};
    
    if (period) {
      const currentDate = new Date();
      let startDate;
      
      switch (period) {
        case 'today':
          startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
          break;
        case 'week':
          startDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(currentDate.getFullYear(), 0, 1);
          break;
      }
      
      if (startDate) {
        whereClause.orderDate = {
          [Op.gte]: startDate
        };
      }
    }

    const stats = await PurchaseOrder.findAll({
      where: whereClause,
      attributes: [
        'status',
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalAmount'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('AVG', sequelize.col('totalAmount')), 'avgAmount']
      ],
      group: ['status'],
      raw: true
    });

    // Calculate overall totals
    const totals = await PurchaseOrder.findOne({
      where: whereClause,
      attributes: [
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'grandTotal'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders']
      ],
      raw: true
    });

    res.json({
      success: true,
      data: {
        byStatus: stats,
        totals: {
          grandTotal: parseFloat(totals.grandTotal) || 0,
          totalOrders: parseInt(totals.totalOrders) || 0
        }
      }
    });
  } catch (error) {
    console.error('Error getting purchase order statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get purchase order statistics',
      details: error.message
    });
  }
});

// @route   GET /api/purchase-orders/:id
// @desc    Get single purchase order
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await PurchaseOrder.findByPk(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Purchase order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching purchase order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch purchase order',
      details: error.message
    });
  }
});

// @route   POST /api/purchase-orders
// @desc    Create new purchase order
// @access  Private
router.post('/', verifyToken, async (req, res) => {
  try {
    const { error, value } = purchaseOrderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details
      });
    }

    // Generate ID if not provided
    if (!value.id) {
      value.id = value.poNumber;
    }

    // Generate PO Number if needed
    if (!value.poNumber.startsWith('PO')) {
      const orderCount = await PurchaseOrder.count();
      value.poNumber = `PO${String(orderCount + 1).padStart(4, '0')}`;
      value.id = value.poNumber;
    }

    // Set user who created this PO
    value.createdBy = req.user.id;

    const order = await PurchaseOrder.create(value);

    // ✅ CREATE TRACKING RECORDS for RAB quantity tracking
    try {
      const trackingRecords = value.items.map((item) => ({
        projectId: value.projectId,
        rabItemId: item.inventoryId, // inventoryId is the RAB item UUID
        poNumber: value.poNumber,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalAmount: item.totalPrice,
        purchaseDate: value.orderDate,
        status: value.status || "pending",
      }));
      
      if (trackingRecords.length > 0) {
        await RABPurchaseTracking.bulkCreate(trackingRecords);
      }
    } catch (trackingError) {
      console.error('Failed to create tracking records:', trackingError.message);
      // Don't fail the main PO creation
    }

    res.status(201).json({
      success: true,
      data: order,
      message: 'Purchase order created successfully'
    });
  } catch (error) {
    console.error('Error creating purchase order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create purchase order',
      details: error.message
    });
  }
});

// @route   PUT /api/purchase-orders/:id
// @desc    Update purchase order
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const order = await PurchaseOrder.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Purchase order not found'
      });
    }

    const updateSchema = purchaseOrderSchema.fork(
      ['poNumber', 'supplierId', 'supplierName', 'orderDate', 'items', 'subtotal', 'totalAmount'],
      (schema) => schema.optional()
    );
    
    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details
      });
    }

    // Store previous status for sync logic
    const previousStatus = order.status;
    
    await order.update(value);

    // ✅ UPDATE TRACKING RECORDS if status changed
    if (value.status && value.status !== previousStatus) {
      try {
        await RABPurchaseTracking.update(
          { status: value.status },
          { where: { poNumber: order.poNumber } }
        );
      } catch (trackingError) {
        console.error('Failed to update tracking:', trackingError.message);
      }
    }

    // Auto-sync to finance if status changed
    if (value.status && value.status !== previousStatus) {
      try {
        await POFinanceSyncService.syncPOToFinance(order.toJSON(), previousStatus);
      } catch (syncError) {
        console.error('Finance sync warning:', syncError.message);
        // Don't fail the main operation, just log the warning
      }
    }

    res.json({
      success: true,
      data: order,
      message: 'Purchase order updated successfully'
    });
  } catch (error) {
    console.error('Error updating purchase order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update purchase order',
      details: error.message
    });
  }
});

// @route   DELETE /api/purchase-orders/:id
// @desc    Delete purchase order
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const order = await PurchaseOrder.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Purchase order not found'
      });
    }

    const poNumber = order.poNumber;
    
    await order.destroy();

    // ✅ DELETE TRACKING RECORDS
    try {
      await RABPurchaseTracking.destroy({
        where: { poNumber: poNumber }
      });
    } catch (trackingError) {
      console.error('Failed to delete tracking:', trackingError.message);
    }

    res.json({
      success: true,
      message: 'Purchase order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting purchase order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete purchase order',
      details: error.message
    });
  }
});

// @route   PUT /api/purchase-orders/:id/status
// @desc    Update purchase order status
// @access  Private
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['draft', 'pending', 'approved', 'received', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const order = await PurchaseOrder.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Purchase order not found'
      });
    }

    await order.update({ status });

    // Auto-sync to finance when status changes
    try {
      await POFinanceSyncService.syncPOToFinance(order.toJSON());
    } catch (syncError) {
      console.error('Finance sync warning:', syncError.message);
    }

    res.json({
      success: true,
      data: order,
      message: `Purchase order status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating purchase order status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update purchase order status',
      details: error.message
    });
  }
});

// @route   GET /api/purchase-orders/project/:projectId/financial-summary
// @desc    Get financial summary for POs in a project
// @access  Private
router.get('/project/:projectId/financial-summary', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const summary = await POFinanceSyncService.getPOFinancialSummary(projectId);
    
    res.json({
      success: true,
      data: summary,
      message: 'PO financial summary retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting PO financial summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get PO financial summary',
      details: error.message
    });
  }
});

// @route   POST /api/purchase-orders/sync-finance
// @desc    Manual sync PO to finance (for bulk operations)
// @access  Private
router.post('/sync-finance', async (req, res) => {
  try {
    const { purchaseOrderIds } = req.body;
    
    if (!purchaseOrderIds || !Array.isArray(purchaseOrderIds)) {
      return res.status(400).json({
        success: false,
        error: 'purchaseOrderIds array is required'
      });
    }
    
    const results = await POFinanceSyncService.syncMultiplePOs(purchaseOrderIds);
    
    const summary = {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
    
    res.json({
      success: true,
      data: summary,
      message: 'Bulk PO finance sync completed'
    });
  } catch (error) {
    console.error('Error syncing POs to finance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync POs to finance',
      details: error.message
    });
  }
});

module.exports = router;
