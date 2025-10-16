const express = require('express');
const Joi = require('joi');
const { Op, DataTypes } = require('sequelize');
const WorkOrder = require('../models/WorkOrder');
const Project = require('../models/Project');
const Subsidiary = require('../models/Subsidiary');
const { verifyToken } = require('../middleware/auth');
const { sequelize } = require('../config/database');
const workOrderPdfGenerator = require('../utils/workOrderPdfGenerator');

const router = express.Router();

// Define RABWorkOrderTracking model for quantity tracking
const RABWorkOrderTracking = sequelize.define(
  "RABWorkOrderTracking",
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
    woNumber: {
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
    workDate: {
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
    tableName: "rab_work_order_tracking",
    timestamps: true,
    underscored: true,
  }
);

// Validation schema
const workOrderSchema = Joi.object({
  id: Joi.string().optional(),
  woNumber: Joi.string().optional(), // Will be auto-generated if not provided
  contractorId: Joi.string().optional(),
  contractorName: Joi.string().required(),
  contractorContact: Joi.string().required(),
  contractorAddress: Joi.string().allow('').optional(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  status: Joi.string().valid('draft', 'pending', 'approved', 'in_progress', 'completed', 'cancelled').default('draft'),
  items: Joi.array().items(
    Joi.object({
      rabItemId: Joi.string().required(),
      itemName: Joi.string().required(),
      itemType: Joi.string().valid('service', 'labor', 'equipment', 'overhead').required(),
      quantity: Joi.number().min(0).required(),
      unit: Joi.string().required(),
      unitPrice: Joi.number().min(0).required(),
      totalPrice: Joi.number().min(0).optional(), // Can be calculated
      description: Joi.string().allow('').optional()
    })
  ).min(1).required(),
  notes: Joi.string().allow('').optional(),
  totalAmount: Joi.number().min(0).required()
});

/**
 * Generate unique WO number
 * Format: WO-YYYYMMDD-XXX
 */
async function generateWONumber(projectId) {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  
  // Find existing WOs for today
  const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);
  
  const count = await WorkOrder.count({
    where: {
      projectId,
      createdAt: {
        [Op.gte]: todayStart,
        [Op.lt]: todayEnd
      }
    }
  });
  
  const sequence = String(count + 1).padStart(3, '0');
  return `WO-${dateStr}-${sequence}`;
}

/**
 * GET /api/projects/:projectId/work-orders
 * Get all work orders for a project
 */
router.get('/', async (req, res) => {
  try {
    const projectId = req.projectId || req.params.projectId;
    console.log(`[WO API] Fetching work orders for project: ${projectId}`);

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }

    const workOrders = await WorkOrder.findAll({
      where: { 
        projectId,
        deleted: false 
      },
      order: [['createdAt', 'DESC']],
    });

    console.log(`[WO API] Found ${workOrders.length} work orders`);

    res.json({
      success: true,
      data: workOrders,
      count: workOrders.length
    });
  } catch (error) {
    console.error('[WO API] Error fetching work orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch work orders',
      error: error.message
    });
  }
});

/**
 * GET /api/projects/:projectId/work-orders/stats
 * Get work order statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const projectId = req.projectId || req.params.projectId;
    console.log(`[WO API] Fetching stats for project: ${projectId}`);

    const workOrders = await WorkOrder.findAll({
      where: { 
        projectId,
        deleted: false 
      }
    });

    const stats = {
      total: workOrders.length,
      byStatus: {
        draft: 0,
        pending: 0,
        approved: 0,
        in_progress: 0,
        completed: 0,
        cancelled: 0
      },
      totalAmount: 0
    };

    workOrders.forEach(wo => {
      const status = wo.status || 'draft';
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
      stats.totalAmount += parseFloat(wo.totalAmount || 0);
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('[WO API] Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch work order stats',
      error: error.message
    });
  }
});

/**
 * GET /api/projects/:projectId/work-orders/available-rab
 * Get available RAB items with remaining quantity after WO tracking
 */
router.get('/available-rab', async (req, res) => {
  try {
    const projectId = req.projectId || req.params.projectId;
    console.log(`[WO API] Fetching available RAB items for project: ${projectId}`);

    const ProjectRAB = require('../models/ProjectRAB');

    // Get all approved RAB items for WO (service, labor, equipment, overhead)
    const rabItems = await ProjectRAB.findAll({
      where: { 
        projectId,
        item_type: {
          [Op.in]: ['service', 'labor', 'equipment', 'overhead']
        },
        status: 'approved'
      }
    });

    console.log(`[WO API] Found ${rabItems.length} approved WO RAB items`);

    // Get used quantities from tracking
    const tracking = await RABWorkOrderTracking.findAll({
      where: { projectId },
      attributes: [
        'rabItemId',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'usedQuantity']
      ],
      group: ['rabItemId']
    });

    const usedQuantities = {};
    tracking.forEach(t => {
      usedQuantities[t.rabItemId] = parseFloat(t.dataValues.usedQuantity || 0);
    });

    console.log('[WO API] Used quantities:', usedQuantities);

    // Calculate available quantities
    const availableRAB = rabItems.map(item => {
      const totalQty = parseFloat(item.quantity || 0);
      const usedQty = usedQuantities[item.id] || 0;
      const availableQty = totalQty - usedQty;

      return {
        ...item.toJSON(),
        totalQuantity: totalQty,
        usedQuantity: usedQty,
        availableQuantity: availableQty,
        isFullyUsed: availableQty <= 0
      };
    });

    // Filter out fully used items
    const available = availableRAB.filter(item => item.availableQuantity > 0);

    console.log(`[WO API] Available RAB items: ${available.length} (filtered out ${availableRAB.length - available.length} fully used)`);

    res.json({
      success: true,
      data: available,
      count: available.length,
      summary: {
        totalItems: rabItems.length,
        availableItems: available.length,
        fullyUsedItems: availableRAB.length - available.length
      }
    });
  } catch (error) {
    console.error('[WO API] Error fetching available RAB:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available RAB items',
      error: error.message
    });
  }
});

/**
 * Generate WO PDF - Perintah Kerja
 * GET /api/projects/:projectId/work-orders/:id/pdf
 * IMPORTANT: Must be before /:id route to avoid route conflict
 */
router.get('/:id/pdf', verifyToken, async (req, res) => {
  try {
    const projectId = req.projectId || req.params.projectId;
    const { id } = req.params;

    // Find WO by ID or WO number
    const wo = await WorkOrder.findOne({
      where: {
        projectId,
        deleted: false,
        [Op.or]: [
          { id: id },
          { woNumber: id },
          { wo_number: id }
        ]
      },
      raw: true
    });

    if (!wo) {
      console.error('WO not found for id:', id);
      return res.status(404).json({
        success: false,
        error: 'Work Order tidak ditemukan'
      });
    }

    console.log('Generating Perintah Kerja PDF for WO:', wo.wo_number || wo.woNumber);

    // Fetch project to get subsidiary
    const project = await Project.findOne({
      where: { id: projectId },
      raw: true
    });

    // Fetch subsidiary data
    let subsidiaryData = null;
    if (project && project.subsidiary_id) {
      subsidiaryData = await Subsidiary.findOne({
        where: { id: project.subsidiary_id },
        raw: true
      });
    }

    // Company info from subsidiary or default
    const companyInfo = {
      name: subsidiaryData?.name || process.env.COMPANY_NAME || 'PT Nusantara Construction',
      address: subsidiaryData?.address?.street || subsidiaryData?.address?.full || process.env.COMPANY_ADDRESS || 'Jakarta, Indonesia',
      city: subsidiaryData?.address?.city || process.env.COMPANY_CITY || 'Jakarta',
      phone: subsidiaryData?.contact_info?.phone || process.env.COMPANY_PHONE || '021-12345678',
      email: subsidiaryData?.contact_info?.email || process.env.COMPANY_EMAIL || 'info@nusantara.co.id',
      npwp: subsidiaryData?.contact_info?.npwp || process.env.COMPANY_NPWP || '00.000.000.0-000.000',
      director: subsidiaryData?.contact_info?.director || null // For signature
    };

    // Contractor info from WO
    const contractorInfo = {
      name: wo.contractor_name || wo.contractorName || 'Kontraktor',
      address: wo.contractor_address || wo.contractorAddress || '-',
      contact: wo.contractor_contact || wo.contractorContact || '-',
      startDate: wo.start_date || wo.startDate,
      endDate: wo.end_date || wo.endDate,
      contactPerson: wo.contractor_contact_person || null // For signature
    };

    // Generate PDF
    const pdfBuffer = await workOrderPdfGenerator.generateWO(
      wo,
      companyInfo,
      contractorInfo
    );

    // Set response headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="Perintah-Kerja-${wo.wo_number || wo.woNumber}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating WO PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Gagal generate PDF Perintah Kerja',
      details: error.message
    });
  }
});

/**
 * GET /api/projects/:projectId/work-orders/:id
 * Get single work order by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const projectId = req.projectId || req.params.projectId;
    const { id } = req.params;
    console.log(`[WO API] Fetching WO ${id} for project ${projectId}`);

    const workOrder = await WorkOrder.findOne({
      where: { 
        id,
        projectId,
        deleted: false 
      }
    });

    if (!workOrder) {
      return res.status(404).json({
        success: false,
        message: 'Work order not found'
      });
    }

    res.json({
      success: true,
      data: workOrder
    });
  } catch (error) {
    console.error('[WO API] Error fetching work order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch work order',
      error: error.message
    });
  }
});

/**
 * POST /api/projects/:projectId/work-orders
 * Create new work order
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const projectId = req.projectId || req.params.projectId;
    console.log(`[WO API] Creating work order for project: ${projectId}`);
    console.log('[WO API] Request body:', JSON.stringify(req.body, null, 2));

    // Validate request
    const { error, value } = workOrderSchema.validate(req.body);
    if (error) {
      console.error('[WO API] Validation error:', error.details);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(d => d.message)
      });
    }

    // Generate WO number if not provided
    if (!value.woNumber) {
      value.woNumber = await generateWONumber(projectId);
      console.log(`[WO API] Generated WO number: ${value.woNumber}`);
    }

    // Generate unique ID if not provided
    if (!value.id) {
      value.id = `WO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Calculate totalPrice for each item if not provided
    value.items = value.items.map(item => ({
      ...item,
      totalPrice: item.totalPrice || (item.quantity * item.unitPrice)
    }));

    // Create work order
    const workOrder = await WorkOrder.create({
      ...value,
      projectId,
      createdBy: req.user?.id || 'system',
      deleted: false
    });

    console.log(`[WO API] Work order created: ${workOrder.woNumber}`);

    // Create tracking entries for RAB items
    console.log('[WO API] ProjectId for tracking:', projectId);
    console.log('[WO API] Items to track:', value.items);
    
    const trackingEntries = value.items.map(item => ({
      projectId: projectId,
      rabItemId: item.rabItemId,
      woNumber: value.woNumber,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalAmount: item.totalPrice,
      workDate: value.startDate,
      status: value.status
    }));
    
    console.log('[WO API] Tracking entries to insert:', JSON.stringify(trackingEntries, null, 2));

    if (trackingEntries.length > 0) {
      await RABWorkOrderTracking.bulkCreate(trackingEntries);
      console.log(`[WO API] Created ${trackingEntries.length} tracking entries`);
    }

    res.status(201).json({
      success: true,
      message: 'Work order created successfully',
      data: workOrder
    });
  } catch (error) {
    console.error('[WO API] Error creating work order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create work order',
      error: error.message
    });
  }
});

/**
 * PUT /api/projects/:projectId/work-orders/:id
 * Update work order
 */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const projectId = req.projectId || req.params.projectId;
    const { id } = req.params;
    console.log(`[WO API] Updating WO ${id} for project ${projectId}`);

    const workOrder = await WorkOrder.findOne({
      where: { 
        id,
        projectId,
        deleted: false 
      }
    });

    if (!workOrder) {
      return res.status(404).json({
        success: false,
        message: 'Work order not found'
      });
    }

    // Validate update data
    const { error, value } = workOrderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(d => d.message)
      });
    }

    // Update work order
    await workOrder.update({
      ...value,
      updatedBy: req.user?.id || 'system'
    });

    console.log(`[WO API] Work order updated: ${workOrder.woNumber}`);

    res.json({
      success: true,
      message: 'Work order updated successfully',
      data: workOrder
    });
  } catch (error) {
    console.error('[WO API] Error updating work order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update work order',
      error: error.message
    });
  }
});

/**
 * DELETE /api/projects/:projectId/work-orders/:id
 * Soft delete work order
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const projectId = req.projectId || req.params.projectId;
    const { id } = req.params;
    console.log(`[WO API] Deleting WO ${id} for project ${projectId}`);

    const workOrder = await WorkOrder.findOne({
      where: { 
        id,
        projectId,
        deleted: false 
      }
    });

    if (!workOrder) {
      return res.status(404).json({
        success: false,
        message: 'Work order not found'
      });
    }

    // Soft delete
    await workOrder.update({
      deleted: true,
      deletedAt: new Date(),
      deletedBy: req.user?.id || 'system'
    });

    console.log(`[WO API] Work order deleted: ${workOrder.woNumber}`);

    res.json({
      success: true,
      message: 'Work order deleted successfully'
    });
  } catch (error) {
    console.error('[WO API] Error deleting work order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete work order',
      error: error.message
    });
  }
});

/**
 * PUT /api/projects/:projectId/work-orders/:id/status
 * Update work order status
 */
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const projectId = req.projectId || req.params.projectId;
    const { id } = req.params;
    const { status } = req.body;

    console.log(`[WO API] Updating status for WO ${id} to: ${status}`);

    if (!['draft', 'pending', 'approved', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const workOrder = await WorkOrder.findOne({
      where: { 
        id,
        projectId,
        deleted: false 
      }
    });

    if (!workOrder) {
      return res.status(404).json({
        success: false,
        message: 'Work order not found'
      });
    }

    await workOrder.update({
      status,
      updatedBy: req.user?.id || 'system'
    });

    console.log(`[WO API] Status updated: ${workOrder.woNumber} -> ${status}`);

    res.json({
      success: true,
      message: 'Work order status updated successfully',
      data: workOrder
    });
  } catch (error) {
    console.error('[WO API] Error updating status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update work order status',
      error: error.message
    });
  }
});

/**
 * PUT /api/projects/:projectId/work-orders/:id/approve
 * Approve work order
 */
router.put('/:id/approve', verifyToken, async (req, res) => {
  try {
    const projectId = req.projectId || req.params.projectId;
    const { id } = req.params;
    const { notes } = req.body;

    console.log(`[WO API] Approving WO ${id}`);

    const workOrder = await WorkOrder.findOne({
      where: { 
        id,
        projectId,
        deleted: false 
      }
    });

    if (!workOrder) {
      return res.status(404).json({
        success: false,
        message: 'Work order not found'
      });
    }

    await workOrder.update({
      status: 'approved',
      approvedBy: req.user?.id || 'system',
      approvedAt: new Date(),
      approvalNotes: notes || '',
      updatedBy: req.user?.id || 'system'
    });

    console.log(`[WO API] Work order approved: ${workOrder.woNumber}`);

    res.json({
      success: true,
      message: 'Work order approved successfully',
      data: workOrder
    });
  } catch (error) {
    console.error('[WO API] Error approving work order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve work order',
      error: error.message
    });
  }
});

/**
 * PUT /api/projects/:projectId/work-orders/:id/reject
 * Reject work order
 */
router.put('/:id/reject', verifyToken, async (req, res) => {
  try {
    const projectId = req.projectId || req.params.projectId;
    const { id } = req.params;
    const { reason } = req.body;

    console.log(`[WO API] Rejecting WO ${id}`);

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const workOrder = await WorkOrder.findOne({
      where: { 
        id,
        projectId,
        deleted: false 
      }
    });

    if (!workOrder) {
      return res.status(404).json({
        success: false,
        message: 'Work order not found'
      });
    }

    await workOrder.update({
      status: 'cancelled',
      rejectedBy: req.user?.id || 'system',
      rejectedAt: new Date(),
      rejectionReason: reason,
      updatedBy: req.user?.id || 'system'
    });

    console.log(`[WO API] Work order rejected: ${workOrder.woNumber}`);

    res.json({
      success: true,
      message: 'Work order rejected successfully',
      data: workOrder
    });
  } catch (error) {
    console.error('[WO API] Error rejecting work order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject work order',
      error: error.message
    });
  }
});

module.exports = router;
