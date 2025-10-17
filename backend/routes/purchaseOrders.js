const express = require('express');
const Joi = require('joi');
const { Op, DataTypes } = require('sequelize');
const PurchaseOrder = require('../models/PurchaseOrder');
const Project = require('../models/Project');
const Subsidiary = require('../models/Subsidiary');
const { verifyToken } = require('../middleware/auth');
const POFinanceSyncService = require('../services/poFinanceSync');
const { sequelize } = require('../config/database');
const purchaseOrderPdfGenerator = require('../utils/purchaseOrderPdfGenerator');

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
    underscored: true,
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
      
      console.log('📊 [CREATE PO] Creating tracking records:', {
        count: trackingRecords.length,
        records: trackingRecords.map(r => ({
          rabItemId: r.rabItemId,
          quantity: r.quantity,
          status: r.status
        }))
      });
      
      if (trackingRecords.length > 0) {
        const created = await RABPurchaseTracking.bulkCreate(trackingRecords);
        console.log(`✅ [CREATE PO] Successfully created ${created.length} tracking records`);
      }
    } catch (trackingError) {
      console.error('❌ [CREATE PO] Failed to create tracking records:', trackingError.message);
      console.error('❌ [CREATE PO] Tracking error stack:', trackingError.stack);
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

// @route   POST /api/purchase-orders/:id/approve
// @desc    Approve a Purchase Order
// @access  Private
// @route   PUT /api/purchase-orders/:id/approve
// @desc    Approve a Purchase Order
// @access  Private
router.put('/:id/approve', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy, notes, approval_date } = req.body;

    // Validate approvedBy (can come from request body or token)
    const approverId = approvedBy || req.user.id;
    
    if (!approverId) {
      return res.status(400).json({
        success: false,
        error: 'approvedBy is required'
      });
    }

    // Find PO
    const po = await PurchaseOrder.findOne({ where: { id } });
    if (!po) {
      return res.status(404).json({
        success: false,
        error: 'Purchase Order tidak ditemukan'
      });
    }

    // Update approval fields
    po.status = 'approved';
    po.approvedBy = approverId;
    po.approvedAt = approval_date || new Date();
    if (notes) po.notes = notes;

    await po.save();

    res.json({
      success: true,
      message: 'Purchase Order berhasil diapprove',
      data: po
    });
  } catch (error) {
    console.error('Error approving PO:', error);
    res.status(500).json({
      success: false,
      error: 'Gagal approve Purchase Order',
      details: error.message
    });
  }
});

// @route   PUT /api/purchase-orders/:id/reject
// @desc    Reject a Purchase Order
// @access  Private
router.put('/:id/reject', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectedBy, rejectionReason, reason, rejection_date } = req.body;

    // Support both rejectionReason and reason for backward compatibility
    const rejectReason = rejectionReason || reason;
    
    if (!rejectReason || !rejectReason.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Alasan penolakan wajib diisi'
      });
    }

    // Validate rejectedBy (can come from request body or token)
    const rejecterId = rejectedBy || req.user.id;
    
    if (!rejecterId) {
      return res.status(400).json({
        success: false,
        error: 'rejectedBy is required'
      });
    }

    // Find PO
    const po = await PurchaseOrder.findOne({ where: { id } });
    if (!po) {
      return res.status(404).json({
        success: false,
        error: 'Purchase Order tidak ditemukan'
      });
    }

    // Update rejection fields
    po.status = 'rejected';
    po.notes = rejectReason;
    po.rejectedBy = rejecterId;
    po.rejectedAt = rejection_date || new Date();

    await po.save();

    res.json({
      success: true,
      message: 'Purchase Order ditolak',
      data: po
    });
  } catch (error) {
    console.error('Error rejecting PO:', error);
    res.status(500).json({
      success: false,
      error: 'Gagal reject Purchase Order',
      details: error.message
    });
  }
});

// @route   PATCH /api/purchase-orders/:id/status
// @desc    Update Purchase Order approval status
// @access  Private
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { approval_status, notes } = req.body;

    // Validate status
    const validStatuses = ['draft', 'pending', 'approved', 'rejected', 'received', 'cancelled'];
    if (!validStatuses.includes(approval_status)) {
      return res.status(400).json({
        success: false,
        error: 'Status tidak valid'
      });
    }

    // Find PO
    const po = await PurchaseOrder.findOne({ where: { id } });
    if (!po) {
      return res.status(404).json({
        success: false,
        error: 'Purchase Order tidak ditemukan'
      });
    }

    // Update status
    po.status = approval_status;
    if (notes) po.notes = notes;

    // Set approval fields if approved
    if (approval_status === 'approved') {
      po.approvedBy = req.user.id;
      po.approvedAt = new Date();
    }

    await po.save();

    res.json({
      success: true,
      message: `Status Purchase Order diubah menjadi ${approval_status}`,
      data: po
    });
  } catch (error) {
    console.error('Error updating PO status:', error);
    res.status(500).json({
      success: false,
      error: 'Gagal update status Purchase Order',
      details: error.message
    });
  }
});

/**
 * Generate PO PDF
 * GET /api/purchase-orders/:id/pdf
 */
router.get('/:id/pdf', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Find PO by ID or PO number
    const po = await PurchaseOrder.findOne({ 
      where: {
        [Op.or]: [
          { id: id },
          { poNumber: id },
          { po_number: id }
        ]
      },
      raw: true
    });

    if (!po) {
      console.error('PO not found for id:', id);
      return res.status(404).json({
        success: false,
        error: 'Purchase Order tidak ditemukan'
      });
    }

    console.log('Generating PDF for PO:', po.po_number || po.poNumber);

    // Check if we need to fetch items for PO
    if (!po.items) {
      console.log('⚠ No items found in PO, attempting to fetch items...');
      
      try {
        // Fetch PO items based on your data model
        // Adjust this query based on your actual database structure
        const poItems = await sequelize.query(
          `SELECT * FROM purchase_order_items WHERE po_id = :poId`,
          {
            replacements: { poId: id },
            type: sequelize.QueryTypes.SELECT
          }
        );
        
        if (poItems && poItems.length > 0) {
          console.log(`✓ Found ${poItems.length} items for PO`);
          po.items = poItems;
        } else {
          console.log('⚠ No items found for PO in database');
          po.items = []; // Ensure items is at least an empty array
        }
      } catch (itemError) {
        console.error('❌ Error fetching PO items:', itemError);
        po.items = []; // Ensure items is at least an empty array
      }
    }

    // Fetch project to get subsidiary
    const project = await Project.findOne({
      where: { id: po.project_id || po.projectId },
      raw: true
    });

    console.log('📊 Project data:', {
      id: project?.id,
      name: project?.name,
      subsidiary_id_snake: project?.subsidiary_id,
      subsidiaryId_camel: project?.subsidiaryId
    });

    // Fetch subsidiary data with proper data
    let subsidiaryData = null;
    // Handle both snake_case and camelCase for subsidiary_id
    const subsidiaryId = project?.subsidiary_id || project?.subsidiaryId;
    
    if (project && subsidiaryId) {
      console.log('🔍 Fetching subsidiary with ID:', subsidiaryId);
      
      try {
        const subsidiaryRaw = await Subsidiary.findOne({
          where: { id: subsidiaryId },
          raw: true
        });
        
        // Parse JSONB fields if they are strings (raw query returns JSON as string)
        if (subsidiaryRaw) {
          subsidiaryData = {
            ...subsidiaryRaw,
            address: typeof subsidiaryRaw.address === 'string' 
              ? JSON.parse(subsidiaryRaw.address) 
              : subsidiaryRaw.address,
            contact_info: typeof subsidiaryRaw.contact_info === 'string' 
              ? JSON.parse(subsidiaryRaw.contact_info) 
              : subsidiaryRaw.contact_info,
            board_of_directors: typeof subsidiaryRaw.board_of_directors === 'string' 
              ? JSON.parse(subsidiaryRaw.board_of_directors) 
              : subsidiaryRaw.board_of_directors,
            legal_info: typeof subsidiaryRaw.legal_info === 'string' 
              ? JSON.parse(subsidiaryRaw.legal_info) 
              : subsidiaryRaw.legal_info
          };
          
          console.log('✅ Subsidiary data loaded:', subsidiaryData.name);
          console.log('✅ Subsidiary status:', subsidiaryData.status);
          console.log('✅ Board of directors type:', typeof subsidiaryData.board_of_directors);
          console.log('✅ Board of directors array?:', Array.isArray(subsidiaryData.board_of_directors));
        } else {
          console.error('❌ Subsidiary not found in database for ID:', subsidiaryId);
        }
      } catch (subsidiaryError) {
        console.error('❌ Error fetching subsidiary:', subsidiaryError.message);
        console.error('❌ Subsidiary error stack:', subsidiaryError.stack);
      }
    } else {
      console.log('⚠ No project or subsidiary_id found');
      console.log('⚠ Project exists:', !!project);
      console.log('⚠ Subsidiary ID (snake_case):', project?.subsidiary_id);
      console.log('⚠ Subsidiary ID (camelCase):', project?.subsidiaryId);
    }

    // Extract director name from board_of_directors
    // Handle both snake_case and camelCase
    const boardData = subsidiaryData?.board_of_directors || subsidiaryData?.boardOfDirectors;
    // Default director name - use company name jika tidak ada board data
    let directorName = "Direktur " + (subsidiaryData?.name || "Perusahaan").split(/\s+/)[1];
    let directorPosition = 'Direktur'; // Default position
    
    if (boardData && Array.isArray(boardData) && boardData.length > 0) {
      console.log('✓ Extracting director from board data...');
      // Find Director or Director Utama
      const director = boardData.find(d => 
        d.position?.toLowerCase().includes('direktur utama') || 
        d.position?.toLowerCase() === 'direktur'
      );
      
      if (director) {
        directorName = director.name;
        directorPosition = director.position || 'Direktur';
        console.log('✓ Director found:', directorName, '(', director.position, ')');
      } else if (boardData.length > 0) {
        // Fallback to first director in list
        directorName = boardData[0].name;
        directorPosition = boardData[0].position || 'Direktur';
        console.log('✓ Using first board member:', directorName);
      }
    } else {
      console.log('⚠ No board_of_directors data found, using fallback director name');
    }

    // Handle both snake_case and camelCase for subsidiary data
    const address = subsidiaryData?.address || {};
    const contactInfo = subsidiaryData?.contact_info || subsidiaryData?.contactInfo || {};
    const legalInfo = subsidiaryData?.legal_info || subsidiaryData?.legalInfo || {};
    
    // Periksa apakah data subsidiary ditemukan
    if (!subsidiaryData) {
      console.error('❌ CRITICAL: No subsidiary data found for PDF generation');
      
      // Fetch default subsidiary if available
      try {
        console.log('🔍 Attempting to find default subsidiary...');
        const subsidiaryRaw = await Subsidiary.findOne({
          where: { 
            status: 'active' // Only valid enum value
          },
          order: [['created_at', 'ASC']],
          raw: true
        });
        
        // Parse JSONB fields for fallback subsidiary too
        if (subsidiaryRaw) {
          subsidiaryData = {
            ...subsidiaryRaw,
            address: typeof subsidiaryRaw.address === 'string' 
              ? JSON.parse(subsidiaryRaw.address) 
              : subsidiaryRaw.address,
            contact_info: typeof subsidiaryRaw.contact_info === 'string' 
              ? JSON.parse(subsidiaryRaw.contact_info) 
              : subsidiaryRaw.contact_info,
            board_of_directors: typeof subsidiaryRaw.board_of_directors === 'string' 
              ? JSON.parse(subsidiaryRaw.board_of_directors) 
              : subsidiaryRaw.board_of_directors,
            legal_info: typeof subsidiaryRaw.legal_info === 'string' 
              ? JSON.parse(subsidiaryRaw.legal_info) 
              : subsidiaryRaw.legal_info
          };
          
          console.log('✅ Found default subsidiary:', subsidiaryData.name);
        } else {
          return res.status(400).json({
            success: false,
            message: 'Cannot generate PDF: Subsidiary data not found. Please ensure the project is linked to a valid subsidiary.'
          });
        }
      } catch (err) {
        console.error('❌ Error finding default subsidiary:', err);
        console.error('❌ Error details:', err.message);
        return res.status(400).json({
          success: false,
          message: 'Cannot generate PDF: Subsidiary data not found. Please ensure the project is linked to a valid subsidiary.'
        });
      }
    }
    
    // Company info from subsidiary dengan fallback yang aman
    const companyInfo = {
      name: subsidiaryData.name || 'PT. Nusantara Group',
      address: address.street || address.full || subsidiaryData.address?.street || subsidiaryData.location?.street || 'Jl. Utama No. 123',
      city: address.city || subsidiaryData.address?.city || subsidiaryData.location?.city || 'Jakarta',
      phone: contactInfo.phone || subsidiaryData.contact?.phone || subsidiaryData.phone || '+62-21-555-1234',
      email: contactInfo.email || subsidiaryData.contact?.email || subsidiaryData.email || 'info@nusantaragroup.co.id',
      npwp: legalInfo.npwp || legalInfo.taxIdentificationNumber || subsidiaryData.npwp || '01.123.456.7-123.000',
      logo: subsidiaryData.logo || null,
      director: directorName || 'Direktur',
      directorPosition: directorPosition || 'Direktur Utama'
    };
    
    console.log('✓ Company info for PDF (with fallbacks if needed):', {
      name: companyInfo.name,
      address: companyInfo.address,
      city: companyInfo.city,
      phone: companyInfo.phone,
      email: companyInfo.email,
      npwp: companyInfo.npwp,
      logo: companyInfo.logo,
      director: companyInfo.director,
      position: companyInfo.directorPosition
    });

    // Supplier info from PO dengan fallback yang lebih baik
    const supplierInfo = {
      name: po.supplier_name || po.supplierName || 'Supplier',
      address: po.supplier_address || po.supplierAddress || po.address || 'Alamat Supplier',
      contact: po.supplier_contact || po.supplierContact || po.contact || 'Kontak Supplier',
      deliveryDate: po.delivery_date || po.deliveryDate || po.expectedDeliveryDate || new Date(),
      contactPerson: po.supplier_contact_person || po.contactPerson || 'Purchasing Manager' // For signature
    };

    // Generate PDF with current timestamp
    const printDate = new Date();
    const pdfBuffer = await purchaseOrderPdfGenerator.generatePO(
      po,
      companyInfo,
      supplierInfo,
      printDate // Pass print date for footer
    );

    // Set response headers for PDF - PREVENT CACHING
    const timestamp = Date.now();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="PO-${po.po_number || po.poNumber}-${timestamp}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Prevent caching to ensure fresh PDF every time
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('X-PDF-Generated-At', printDate.toISOString());

    // Send PDF
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating PO PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Gagal generate PDF Purchase Order',
      details: error.message
    });
  }
});

module.exports = router;
