/**
 * Projects Module - Delivery Receipt Routes
 * Handles: Delivery receipt CRUD, inspection, approval workflow
 * Lines: ~480 (extracted from 3,031 line monolith)
 */

const express = require('express');
const Joi = require('joi');
const DeliveryReceipt = require('../../models/DeliveryReceipt');
const PurchaseOrder = require('../../models/PurchaseOrder');
const Project = require('../../models/Project');
const User = require('../../models/User');

const router = express.Router();

// Validation schema for Delivery Receipt
const deliveryReceiptSchema = Joi.object({
  purchaseOrderId: Joi.string().required(),
  receiptNumber: Joi.string().optional(),
  receiptType: Joi.string().valid('full_delivery', 'partial_delivery').default('partial_delivery'),
  receivedDate: Joi.date().required(),
  deliveryNoteNumber: Joi.string().optional(),
  vehicleInfo: Joi.object({
    plateNumber: Joi.string().optional(),
    driverName: Joi.string().optional(),
    driverPhone: Joi.string().optional()
  }).optional(),
  items: Joi.array().items(Joi.object({
    itemName: Joi.string().required(),
    orderedQty: Joi.number().min(0).required(),
    receivedQty: Joi.number().min(0).required(),
    unit: Joi.string().required(),
    condition: Joi.string().valid('good', 'damaged', 'partial').default('good'),
    notes: Joi.string().allow('').optional()
  })).required(),
  receivedBy: Joi.string().optional(),
  location: Joi.string().optional(),
  storageLocation: Joi.string().optional(),
  notes: Joi.string().allow('').optional(),
  status: Joi.string().valid('draft', 'received', 'inspected', 'completed', 'rejected').default('draft'),
  createdBy: Joi.string().optional() // Optional, will use req.user.id if not provided
});

/**
 * @route   GET /api/projects/:id/delivery-receipts
 * @desc    Get all delivery receipts for a project
 * @access  Private
 */
router.get('/:id/delivery-receipts', async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { status, po_id, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Build where clause
    const where = { projectId };
    if (status) where.status = status;
    if (po_id) where.purchaseOrderId = po_id;

    const deliveryReceipts = await DeliveryReceipt.findAll({
      where,
      include: [
        {
          model: PurchaseOrder,
          as: 'purchaseOrder',
          attributes: ['id', 'poNumber', 'supplierName', 'totalAmount', 'status'],
          required: false
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'username', 'email', 'profile'],
          required: false
        },
        {
          model: User,
          as: 'inspector',
          attributes: ['id', 'username', 'email', 'profile'],
          required: false
        },
        {
          model: User,
          as: 'approver',
          attributes: ['id', 'username', 'email', 'profile'],
          required: false
        }
      ],
      order: [[sortBy, sortOrder]]
    });

    // Calculate statistics
    const stats = {
      total: deliveryReceipts.length,
      draft: deliveryReceipts.filter(dr => dr.status === 'draft').length,
      received: deliveryReceipts.filter(dr => dr.status === 'received').length,
      inspected: deliveryReceipts.filter(dr => dr.status === 'inspected').length,
      completed: deliveryReceipts.filter(dr => dr.status === 'completed').length,
      rejected: deliveryReceipts.filter(dr => dr.status === 'rejected').length,
      fullDeliveries: deliveryReceipts.filter(dr => dr.receiptType === 'full_delivery').length,
      partialDeliveries: deliveryReceipts.filter(dr => dr.receiptType === 'partial_delivery').length
    };

    res.json({
      success: true,
      data: deliveryReceipts,
      stats
    });
  } catch (error) {
    console.error('Error fetching delivery receipts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch delivery receipts',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/projects/:id/delivery-receipts/available-pos
 * @desc    Get approved POs available for delivery receipt creation
 * @access  Private
 * @note    IMPORTANT: This must come BEFORE /:id/delivery-receipts/:receiptId route
 */
router.get('/:id/delivery-receipts/available-pos', async (req, res) => {
  try {
    const { id: projectId } = req.params;

    // Get all approved POs for this project
    const approvedPOs = await PurchaseOrder.findAll({
      where: {
        projectId,
        status: 'approved'
      },
      attributes: ['id', 'poNumber', 'supplierName', 'totalAmount', 'orderDate', 'expectedDeliveryDate', 'items', 'status'],
      order: [['orderDate', 'DESC']]
    });

    // Get delivery receipts for these POs to check completion status
    const deliveryReceipts = await DeliveryReceipt.findAll({
      where: {
        projectId,
        purchaseOrderId: approvedPOs.map(po => po.id)
      },
      attributes: ['purchaseOrderId', 'status', 'receiptType', 'items']
    });

    // Map delivery status to POs
    const posWithDeliveryStatus = approvedPOs.map(po => {
      const receipts = deliveryReceipts.filter(dr => dr.purchaseOrderId === po.id);
      const completedReceipts = receipts.filter(dr => dr.status === 'completed');
      const hasFullDelivery = receipts.some(dr => dr.receiptType === 'full_delivery' && dr.status === 'completed');

      return {
        ...po.toJSON(),
        deliveryStatus: hasFullDelivery ? 'fully_delivered' :
                       completedReceipts.length > 0 ? 'partial_delivered' : 'pending_delivery',
        deliveryReceipts: receipts.length,
        canCreateReceipt: !hasFullDelivery
      };
    });

    res.json({
      success: true,
      data: posWithDeliveryStatus,
      summary: {
        total: posWithDeliveryStatus.length,
        pendingDelivery: posWithDeliveryStatus.filter(po => po.deliveryStatus === 'pending_delivery').length,
        partialDelivered: posWithDeliveryStatus.filter(po => po.deliveryStatus === 'partial_delivered').length,
        fullyDelivered: posWithDeliveryStatus.filter(po => po.deliveryStatus === 'fully_delivered').length
      }
    });
  } catch (error) {
    console.error('Error fetching available POs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available POs',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/projects/:id/delivery-receipts/:receiptId
 * @desc    Get single delivery receipt details
 * @access  Private
 */
router.get('/:id/delivery-receipts/:receiptId', async (req, res) => {
  try {
    const { id: projectId, receiptId } = req.params;

    const deliveryReceipt = await DeliveryReceipt.findOne({
      where: {
        id: receiptId,
        projectId
      },
      include: [
        {
          model: PurchaseOrder,
          as: 'purchaseOrder',
          attributes: ['id', 'poNumber', 'supplierName', 'totalAmount', 'status', 'items'],
          required: false
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'username', 'email', 'profile'],
          required: false
        },
        {
          model: User,
          as: 'inspector',
          attributes: ['id', 'username', 'email', 'profile'],
          required: false
        },
        {
          model: User,
          as: 'approver',
          attributes: ['id', 'username', 'email', 'profile'],
          required: false
        }
      ]
    });

    if (!deliveryReceipt) {
      return res.status(404).json({
        success: false,
        error: 'Delivery Receipt not found'
      });
    }

    res.json({
      success: true,
      data: deliveryReceipt
    });
  } catch (error) {
    console.error('Error fetching delivery receipt:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch delivery receipt',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:id/delivery-receipts
 * @desc    Create new delivery receipt
 * @access  Private
 */
router.post('/:id/delivery-receipts', async (req, res) => {
  try {
    const { id: projectId } = req.params;

    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Validate request body
    const { error, value } = deliveryReceiptSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }

    // Verify PO exists and is approved
    const purchaseOrder = await PurchaseOrder.findOne({
      where: {
        id: value.purchaseOrderId,
        projectId
      }
    });

    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        error: 'Purchase Order not found'
      });
    }

    if (purchaseOrder.status !== 'approved') {
      return res.status(400).json({
        success: false,
        error: 'Purchase Order must be approved before creating delivery receipt'
      });
    }

    // Generate receipt number if not provided
    let receiptNumber = value.receiptNumber;
    if (!receiptNumber) {
      const drCount = await DeliveryReceipt.count({ where: { projectId } });
      receiptNumber = `DR-${projectId.substring(0, 8)}-${String(drCount + 1).padStart(4, '0')}`;
    }

    // Generate unique ID
    const receiptId = `DR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Get createdBy from request body or authenticated user
    const createdBy = value.createdBy || (req.user && req.user.id) || 'system';

    // Map items to match model schema (orderedQty → orderedQuantity, receivedQty → deliveredQuantity)
    const mappedItems = value.items.map(item => ({
      itemName: item.itemName,
      orderedQuantity: item.orderedQty,
      deliveredQuantity: item.receivedQty,
      unit: item.unit,
      condition: item.condition || 'good',
      notes: item.notes || ''
    }));

    // Prepare data with correct field mapping for model
    const receiptData = {
      id: receiptId,
      projectId,
      receiptNumber,
      purchaseOrderId: value.purchaseOrderId,
      deliveryDate: value.receivedDate, // Map receivedDate → deliveryDate
      receivedDate: value.receivedDate,
      deliveryLocation: value.location || value.storageLocation, // Map location → deliveryLocation
      receivedBy: value.receivedBy || createdBy,
      receiverName: value.receivedBy || 'System', // REQUIRED field
      receiverPosition: null,
      receiverPhone: value.vehicleInfo?.driverPhone || null,
      supplierDeliveryPerson: value.vehicleInfo?.driverName || null,
      supplierDeliveryPhone: value.vehicleInfo?.driverPhone || null,
      vehicleNumber: value.vehicleInfo?.plateNumber || null,
      deliveryMethod: 'truck',
      status: value.status || 'received',
      receiptType: value.receiptType || 'full_delivery',
      items: mappedItems, // Use mapped items with correct field names
      deliveryNotes: value.notes || '',
      qualityNotes: null,
      conditionNotes: null,
      inspectionResult: 'pending',
      createdBy
    };

    const deliveryReceipt = await DeliveryReceipt.create(receiptData);

    // Fetch with relations
    const receiptWithRelations = await DeliveryReceipt.findByPk(deliveryReceipt.id, {
      include: [
        {
          model: PurchaseOrder,
          as: 'purchaseOrder',
          attributes: ['id', 'poNumber', 'supplierName', 'totalAmount', 'status']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: receiptWithRelations,
      message: 'Delivery Receipt created successfully'
    });
  } catch (error) {
    console.error('Error creating delivery receipt:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create delivery receipt',
      details: error.message
    });
  }
});

/**
 * @route   PATCH /api/projects/:id/delivery-receipts/:receiptId
 * @desc    Update delivery receipt
 * @access  Private
 */
router.patch('/:id/delivery-receipts/:receiptId', async (req, res) => {
  try {
    const { id: projectId, receiptId } = req.params;

    const deliveryReceipt = await DeliveryReceipt.findOne({
      where: {
        id: receiptId,
        projectId
      }
    });

    if (!deliveryReceipt) {
      return res.status(404).json({
        success: false,
        error: 'Delivery Receipt not found'
      });
    }

    const updateData = { ...req.body };

    // Update the delivery receipt
    await deliveryReceipt.update({
      ...updateData,
      updatedBy: req.body.updatedBy
    });

    // If status changed to completed, update PO status
    if (updateData.status === 'completed') {
      const purchaseOrder = await PurchaseOrder.findByPk(deliveryReceipt.purchaseOrderId);
      if (purchaseOrder && purchaseOrder.status === 'approved') {
        await purchaseOrder.update({ status: 'received' });
      }
    }

    // Fetch with relations
    const updatedReceipt = await DeliveryReceipt.findByPk(deliveryReceipt.id, {
      include: [
        {
          model: PurchaseOrder,
          as: 'purchaseOrder',
          attributes: ['id', 'poNumber', 'supplierName', 'totalAmount', 'status']
        }
      ]
    });

    res.json({
      success: true,
      data: updatedReceipt,
      message: 'Delivery Receipt updated successfully'
    });
  } catch (error) {
    console.error('Error updating delivery receipt:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update delivery receipt',
      details: error.message
    });
  }
});

/**
 * @route   PATCH /api/projects/:id/delivery-receipts/:receiptId/approve
 * @desc    Approve delivery receipt (after inspection)
 * @access  Private
 */
router.patch('/:id/delivery-receipts/:receiptId/approve', async (req, res) => {
  try {
    const { id: projectId, receiptId } = req.params;
    const { inspectionResult, qualityNotes, conditionNotes, approvedBy } = req.body;

    const deliveryReceipt = await DeliveryReceipt.findOne({
      where: {
        id: receiptId,
        projectId
      }
    });

    if (!deliveryReceipt) {
      return res.status(404).json({
        success: false,
        error: 'Delivery Receipt not found'
      });
    }

    if (deliveryReceipt.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Delivery Receipt is already approved'
      });
    }

    // Update inspection and approval details
    const updateData = {
      inspectionResult: inspectionResult || 'passed',
      inspectedBy: req.user?.id || approvedBy || 'SYSTEM',
      inspectedAt: new Date(),
      approvedBy: req.user?.id || approvedBy || 'SYSTEM',
      approvedAt: new Date(),
      status: 'completed'
    };

    if (qualityNotes) updateData.qualityNotes = qualityNotes;
    if (conditionNotes) updateData.conditionNotes = conditionNotes;

    await deliveryReceipt.update(updateData);

    // Update PO status to received/completed
    const purchaseOrder = await PurchaseOrder.findByPk(deliveryReceipt.purchaseOrderId);
    if (purchaseOrder && purchaseOrder.status === 'approved') {
      await purchaseOrder.update({ status: 'received' });
    }

    res.json({
      success: true,
      data: deliveryReceipt,
      message: 'Delivery Receipt approved successfully'
    });
  } catch (error) {
    console.error('Error approving delivery receipt:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve delivery receipt',
      details: error.message
    });
  }
});

/**
 * @route   PATCH /api/projects/:id/delivery-receipts/:receiptId/reject
 * @desc    Reject delivery receipt
 * @access  Private
 */
router.patch('/:id/delivery-receipts/:receiptId/reject', async (req, res) => {
  try {
    const { id: projectId, receiptId } = req.params;
    const { rejectedReason, inspectionResult, rejectedBy } = req.body;

    if (!rejectedReason) {
      return res.status(400).json({
        success: false,
        error: 'rejectedReason is required'
      });
    }

    const deliveryReceipt = await DeliveryReceipt.findOne({
      where: {
        id: receiptId,
        projectId
      }
    });

    if (!deliveryReceipt) {
      return res.status(404).json({
        success: false,
        error: 'Delivery Receipt not found'
      });
    }

    // Update rejection details
    await deliveryReceipt.update({
      status: 'rejected',
      rejectedReason,
      inspectionResult: inspectionResult || 'rejected',
      inspectedBy: req.user?.id || rejectedBy || 'SYSTEM',
      inspectedAt: new Date()
    });

    res.json({
      success: true,
      data: deliveryReceipt,
      message: 'Delivery Receipt rejected successfully'
    });
  } catch (error) {
    console.error('Error rejecting delivery receipt:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject delivery receipt',
      details: error.message
    });
  }
});

/**
 * @route   DELETE /api/projects/:id/delivery-receipts/:receiptId
 * @desc    Delete delivery receipt
 * @access  Private
 */
router.delete('/:id/delivery-receipts/:receiptId', async (req, res) => {
  try {
    const { id: projectId, receiptId } = req.params;

    const deliveryReceipt = await DeliveryReceipt.findOne({
      where: {
        id: receiptId,
        projectId
      }
    });

    if (!deliveryReceipt) {
      return res.status(404).json({
        success: false,
        error: 'Delivery Receipt not found'
      });
    }

    // Prevent deletion of completed receipts
    if (deliveryReceipt.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete completed Delivery Receipt'
      });
    }

    await deliveryReceipt.destroy();

    res.json({
      success: true,
      message: 'Delivery Receipt deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting delivery receipt:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete delivery receipt',
      details: error.message
    });
  }
});

module.exports = router;
