const express = require('express');
const Joi = require('joi');
const { Op } = require('sequelize');
const PurchaseOrder = require('../models/PurchaseOrder');

const router = express.Router();

// Validation schema
const purchaseOrderSchema = Joi.object({
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
    console.log('DEBUG: req.query =', req.query);
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
    
    console.log('DEBUG: projectId =', projectId);

    const limitNum = Math.max(1, parseInt(limit));
    const pageNum = Math.max(1, parseInt(page));
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const whereClause = {};
    
    if (projectId) {
      console.log('DEBUG: Adding projectId filter:', projectId);
      whereClause.projectId = projectId;
    }
    
    console.log('DEBUG: whereClause =', whereClause);
    
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
router.post('/', async (req, res) => {
  try {
    const { error, value } = purchaseOrderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details
      });
    }

    // Generate ID if not provided in poNumber
    if (!value.poNumber.startsWith('PO')) {
      const orderCount = await PurchaseOrder.count();
      value.poNumber = `PO${String(orderCount + 1).padStart(4, '0')}`;
    }

    const order = await PurchaseOrder.create(value);

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

    await order.update(value);

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

    await order.destroy();

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

module.exports = router;
