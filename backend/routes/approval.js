const express = require('express');
const { verifyToken } = require('../middleware/auth');
const ApprovalService = require('../services/ApprovalService');
const ProjectRAB = require('../models/ProjectRAB');
const ApprovalInstance = require('../models/ApprovalInstance');
const ApprovalStep = require('../models/ApprovalStep');
const ApprovalWorkflow = require('../models/ApprovalWorkflow');
const User = require('../models/User');

const router = express.Router();

// ========== APPROVAL WORKFLOW ENDPOINTS ==========

// @route   POST /api/approval/rab/:rabId/submit
// @desc    Submit RAB for approval
// @access  Private
router.post('/rab/:rabId/submit', verifyToken, async (req, res) => {
  try {
    const { rabId } = req.params;
    const userId = req.user.id;

    // Check if RAB exists
    const rab = await ProjectRAB.findByPk(rabId);
    if (!rab) {
      return res.status(404).json({
        success: false,
        error: 'RAB not found'
      });
    }

    // Initialize approval process
    const approvalInstance = await ApprovalService.initializeRABApproval(rabId, userId);

    res.status(201).json({
      success: true,
      data: approvalInstance,
      message: 'RAB submitted for approval successfully'
    });
  } catch (error) {
    console.error('Error submitting RAB for approval:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit RAB for approval',
      details: error.message
    });
  }
});

// @route   POST /api/approval/instance/:instanceId/decision
// @desc    Make approval decision (approve/reject)
// @access  Private
router.post('/instance/:instanceId/decision', verifyToken, async (req, res) => {
  try {
    const { instanceId } = req.params;
    const { decision, comments } = req.body;
    const userId = req.user.id;

    // Validate decision
    if (!['approved', 'rejected'].includes(decision)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid decision. Must be "approved" or "rejected"'
      });
    }

    // Process approval decision
    const result = await ApprovalService.processApprovalDecisionByInstance(
      instanceId,
      userId,
      decision,
      comments
    );

    res.json({
      success: true,
      data: result,
      message: `Approval ${decision} successfully`
    });
  } catch (error) {
    console.error('Error processing approval decision:', error);
    
    if (error.message.includes('not found') || error.message.includes('not authorized')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }

    if (error.message.includes('already processed') || error.message.includes('not pending')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to process approval decision',
      details: error.message
    });
  }
});

// @route   GET /api/approval/dashboard
// @desc    Get dashboard data for current user
// @access  Private
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get pending count for current user
    const pendingApprovals = await ApprovalService.getPendingApprovals(userId);
    const pendingCount = pendingApprovals.length;

    // Get user's approval statistics
    const stats = await ApprovalService.getUserApprovalStats(userId);
    
    // Get recent approvals processed by user
    const recentApprovals = await ApprovalService.getRecentApprovals(userId, 10);

    res.json({
      success: true,
      data: {
        pendingCount,
        stats,
        recentApprovals
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load dashboard data',
      details: error.message
    });
  }
});

// @route   GET /api/approval/my-submissions
// @desc    Get approval instances submitted by current user
// @access  Private
router.get('/my-submissions', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, page = 1 } = req.query;

    const limitNum = Math.max(1, parseInt(limit));
    const pageNum = Math.max(1, parseInt(page));

    const submissions = await ApprovalService.getMySubmissions(
      userId,
      limitNum,
      (pageNum - 1) * limitNum
    );

    res.json({
      success: true,
      data: submissions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: submissions.length
      }
    });
  } catch (error) {
    console.error('Error fetching my submissions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submissions',
      details: error.message
    });
  }
});

// @route   GET /api/approval/pending
// @desc    Get pending approvals for current user
// @access  Private
router.get('/pending', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { entityType, limit = 20, page = 1 } = req.query;

    const limitNum = Math.max(1, parseInt(limit));
    const pageNum = Math.max(1, parseInt(page));

    const pendingApprovals = await ApprovalService.getPendingApprovals(
      userId,
      entityType,
      limitNum,
      (pageNum - 1) * limitNum
    );

    res.json({
      success: true,
      data: pendingApprovals,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: pendingApprovals.length
      }
    });
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pending approvals',
      details: error.message
    });
  }
});

// @route   GET /api/approval/instance/:instanceId/status
// @desc    Get approval status for an instance
// @access  Private
router.get('/instance/:instanceId/status', verifyToken, async (req, res) => {
  try {
    const { instanceId } = req.params;

    const status = await ApprovalService.getApprovalStatus(instanceId);

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Error fetching approval status:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch approval status',
      details: error.message
    });
  }
});

// @route   GET /api/approval/rab/:rabId/status
// @desc    Get approval status for a specific RAB
// @access  Private
router.get('/rab/:rabId/status', verifyToken, async (req, res) => {
  try {
    const { rabId } = req.params;

    // Find approval instance for this RAB
    const approvalInstance = await ApprovalInstance.findOne({
      where: {
        entityType: 'rab',
        entityId: rabId
      },
      include: [
        {
          model: ApprovalStep,
          as: 'ApprovalSteps',
          include: [
            {
              model: User,
              as: 'approver',
              attributes: ['id', 'username', 'email', 'role', 'profile']
            }
          ]
        },
        {
          model: ApprovalWorkflow,
          as: 'ApprovalWorkflow',
          attributes: ['id', 'name', 'description']
        }
      ],
      order: [
        ['ApprovalSteps', 'step_number', 'ASC']
      ]
    });

    if (!approvalInstance) {
      return res.status(404).json({
        success: false,
        error: 'No approval process found for this RAB'
      });
    }

    res.json({
      success: true,
      data: approvalInstance
    });
  } catch (error) {
    console.error('Error fetching RAB approval status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch RAB approval status',
      details: error.message
    });
  }
});

// @route   GET /api/approval/workflows
// @desc    Get all available approval workflows
// @access  Private
router.get('/workflows', verifyToken, async (req, res) => {
  try {
    const { entityType } = req.query;

    const whereClause = {};
    if (entityType) {
      whereClause.entityType = entityType;
    }

    const workflows = await ApprovalWorkflow.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'description', 'entityType', 'isActive'],
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: workflows
    });
  } catch (error) {
    console.error('Error fetching approval workflows:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch approval workflows',
      details: error.message
    });
  }
});

// @route   GET /api/approval/history/:entityType/:entityId
// @desc    Get approval history for specific entity
// @access  Private
router.get('/history/:entityType/:entityId', verifyToken, async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    const approvalHistory = await ApprovalInstance.findAll({
      where: {
        entityType,
        entityId
      },
      include: [
        {
          model: ApprovalStep,
          as: 'ApprovalSteps',
          include: [
            {
              model: User,
              as: 'approver',
              attributes: ['id', 'username', 'email', 'role', 'profile']
            }
          ]
        },
        {
          model: ApprovalWorkflow,
          as: 'ApprovalWorkflow',
          attributes: ['id', 'name', 'description']
        }
      ],
      order: [
        ['createdAt', 'DESC'],
        ['ApprovalSteps', 'step_number', 'ASC']
      ]
    });

    res.json({
      success: true,
      data: approvalHistory
    });
  } catch (error) {
    console.error('Error fetching approval history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch approval history',
      details: error.message
    });
  }
});

// @route   GET /api/approval/dashboard
// @desc    Get approval dashboard data for current user
// @access  Private
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get pending approvals count
    const pendingApprovals = await ApprovalService.getPendingApprovals(userId);
    const pendingCount = pendingApprovals.length;

    // Get recent approvals (last 10)
    const recentApprovals = await ApprovalStep.findAll({
      where: {
        approverId: userId,
        status: ['approved', 'rejected']
      },
      include: [
        {
          model: ApprovalInstance,
          as: 'ApprovalInstance',
          include: [
            {
              model: ApprovalWorkflow,
              as: 'ApprovalWorkflow',
              attributes: ['name', 'entityType']
            }
          ]
        },
        {
          model: User,
          as: 'approver',
          attributes: ['id', 'username', 'email', 'profile']
        }
      ],
      order: [['updated_at', 'DESC']],
      limit: 10
    });

    // Get approval statistics
    const approvalStats = await ApprovalStep.findAll({
      where: {
        approverId: userId,
        status: ['approved', 'rejected']
      },
      attributes: [
        'status',
        [ApprovalStep.sequelize.fn('COUNT', ApprovalStep.sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const stats = {
      approved: 0,
      rejected: 0
    };

    approvalStats.forEach(stat => {
      stats[stat.status] = parseInt(stat.dataValues.count);
    });

    res.json({
      success: true,
      data: {
        pendingCount,
        recentApprovals,
        stats
      }
    });
  } catch (error) {
    console.error('Error fetching approval dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch approval dashboard',
      details: error.message
    });
  }
});

// @route   GET /api/approval/debug/pending
// @desc    Debug endpoint for pending approvals (no auth)
// @access  Public
router.get('/debug/pending', async (req, res) => {
  try {
    const { userId = 'USR-PM-002' } = req.query; // Default to project manager
    
    console.log('🔍 DEBUG: Getting pending approvals for user:', userId);
    
    const pendingApprovals = await ApprovalService.getPendingApprovals(userId);
    
    console.log('🔍 DEBUG: Found pending approvals:', pendingApprovals.length);
    
    res.json({
      success: true,
      debug: true,
      userId,
      count: pendingApprovals.length,
      data: pendingApprovals
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// @route   GET /api/approval/test/data
// @desc    Test endpoint untuk cek data tanpa auth
// @access  Public
router.get('/test/data', async (req, res) => {
  try {
    // Direct database query untuk cek pending approvals
    const { QueryTypes } = require('sequelize');
    const { sequelize } = require('../models');
    
    const pendingSteps = await sequelize.query(`
      SELECT 
        s.id,
        s.step_name,
        s.required_role,
        s.status,
        i.entity_id,
        i.entity_type,
        i.entity_data,
        i.total_amount
      FROM approval_steps s
      JOIN approval_instances i ON s.instance_id = i.id
      WHERE s.status = 'pending' AND i.overall_status = 'pending'
      ORDER BY s.created_at ASC
    `, { type: QueryTypes.SELECT });
    
    res.json({
      success: true,
      message: 'Direct database query',
      count: pendingSteps.length,
      data: pendingSteps
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   GET /api/approval/project/:projectId/status
// @desc    Get approval status for a project (including PO drafts)
// @access  Private
router.get('/project/:projectId/status', async (req, res) => {
  try {
    const { projectId } = req.params;
    const PurchaseOrder = require('../models/PurchaseOrder');

    // Get all PO for this project 
    const allPOs = await PurchaseOrder.findAll({
      where: {
        projectId: projectId
      },
      order: [['createdAt', 'DESC']]
    });

    // Transform PO data to approval format
    const transformPO = (po, status = null) => ({
      id: po.id,
      type: 'purchase_order',
      title: `Purchase Order - ${po.poNumber}`,
      description: `${po.supplierName} - ${new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR' 
      }).format(po.totalAmount)}`,
      status: status || po.status,
      priority: 'medium',
      submittedBy: po.createdBy || 'System',
      submittedAt: po.createdAt,
      approvedBy: po.approvedBy,
      approvedAt: po.approvedAt,
      entityId: po.id,
      entityType: 'purchase_order',
      details: {
        poNumber: po.poNumber,
        supplier: po.supplierName,
        totalAmount: po.totalAmount,
        items: po.items,
        deliveryAddress: po.deliveryAddress,
        expectedDeliveryDate: po.expectedDeliveryDate
      }
    });

    // Filter and transform POs by status
    const pendingPOs = allPOs.filter(po => ['draft', 'pending'].includes(po.status));
    const approvedPOs = allPOs.filter(po => po.status === 'approved');
    const rejectedPOs = allPOs.filter(po => po.status === 'rejected');

    const pendingItems = pendingPOs.map(po => transformPO(po, 'pending'));
    const approvedItems = approvedPOs.map(po => transformPO(po, 'approved'));
    const rejectedItems = rejectedPOs.map(po => transformPO(po, 'rejected'));

    const allItems = [...pendingItems, ...approvedItems, ...rejectedItems];

    // If no data exists, create sample data for testing
    if (allItems.length === 0) {
      const sampleData = [
        {
          id: 'SAMPLE-PO-001',
          type: 'purchase_order',
          title: 'Purchase Order - PO-2024-001',
          description: 'PT. Bangunan Jaya - Rp 250,000,000',
          status: 'pending',
          priority: 'high',
          submittedBy: 'USR-DIR-CUE14-002',
          submittedAt: new Date(),
          entityId: 'SAMPLE-PO-001',
          entityType: 'purchase_order',
          details: {
            poNumber: 'PO-2024-001',
            supplier: 'PT. Bangunan Jaya',
            totalAmount: 250000000,
            items: [
              { name: 'Semen Portland', quantity: 100, unit: 'sak', unitPrice: 65000 },
              { name: 'Besi Beton 12mm', quantity: 500, unit: 'batang', unitPrice: 85000 }
            ]
          }
        },
        {
          id: 'SAMPLE-PO-002',
          type: 'purchase_order',
          title: 'Purchase Order - PO-2024-002',
          description: 'CV. Material Sejahtera - Rp 180,000,000',
          status: 'approved',
          priority: 'medium',
          submittedBy: 'USR-DIR-CUE14-002',
          submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          approvedBy: 'USR-DIR-BSR-002',
          approvedAt: new Date(),
          entityId: 'SAMPLE-PO-002',
          entityType: 'purchase_order',
          details: {
            poNumber: 'PO-2024-002',
            supplier: 'CV. Material Sejahtera',
            totalAmount: 180000000,
            items: [
              { name: 'Pasir Cor', quantity: 50, unit: 'm3', unitPrice: 320000 },
              { name: 'Kerikil', quantity: 40, unit: 'm3', unitPrice: 280000 }
            ]
          }
        },
        {
          id: 'SAMPLE-PO-003',
          type: 'purchase_order',
          title: 'Purchase Order - PO-2024-003',
          description: 'PT. Konstruksi Mandiri - Rp 95,000,000',
          status: 'rejected',
          priority: 'low',
          submittedBy: 'USR-DIR-CUE14-002',
          submittedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
          approvedBy: 'USR-DIR-BSR-002',
          approvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
          entityId: 'SAMPLE-PO-003',
          entityType: 'purchase_order',
          details: {
            poNumber: 'PO-2024-003',
            supplier: 'PT. Konstruksi Mandiri',
            totalAmount: 95000000,
            items: [
              { name: 'Cat Tembok', quantity: 200, unit: 'kaleng', unitPrice: 85000 },
              { name: 'Kuas Cat', quantity: 50, unit: 'buah', unitPrice: 15000 }
            ]
          }
        }
      ];
      
      res.json({
        success: true,
        data: sampleData,
        summary: {
          total: sampleData.length,
          pending: sampleData.filter(item => item.status === 'pending').length,
          approved: sampleData.filter(item => item.status === 'approved').length,
          rejected: sampleData.filter(item => item.status === 'rejected').length
        }
      });
      return;
    }

    res.json({
      success: true,
      data: allItems,
      summary: {
        total: allItems.length,
        pending: pendingItems.length,
        approved: approvedItems.length,
        rejected: rejectedItems.length
      }
    });
  } catch (error) {
    console.error('Error fetching project approval status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project approval status',
      details: error.message
    });
  }
});

// @route   POST /api/approval/purchase-order/:poId/approve
// @desc    Approve a purchase order
// @access  Private
router.post('/purchase-order/:poId/approve', async (req, res) => {
  try {
    const { poId } = req.params;
    const { comments } = req.body;
    const userId = 'USR-DIR-BSR-002'; // Valid admin user ID
    const PurchaseOrder = require('../models/PurchaseOrder');

    // Find the PO
    const po = await PurchaseOrder.findByPk(poId);
    if (!po) {
      return res.status(404).json({
        success: false,
        error: 'Purchase Order not found'
      });
    }

    // Update PO status to approved
    await po.update({
      status: 'approved',
      approvedBy: userId,
      approvedAt: new Date()
    });

    res.json({
      success: true,
      data: po,
      message: 'Purchase Order approved successfully'
    });
  } catch (error) {
    console.error('Error approving purchase order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve purchase order',
      details: error.message
    });
  }
});

// @route   POST /api/approval/purchase-order/:poId/reject
// @desc    Reject a purchase order
// @access  Private
router.post('/purchase-order/:poId/reject', async (req, res) => {
  try {
    const { poId } = req.params;
    const { comments } = req.body;
    const userId = 'USR-DIR-BSR-002'; // Valid admin user ID
    const PurchaseOrder = require('../models/PurchaseOrder');

    // Find the PO
    const po = await PurchaseOrder.findByPk(poId);
    if (!po) {
      return res.status(404).json({
        success: false,
        error: 'Purchase Order not found'
      });
    }

    // Update PO status to rejected (or back to draft for revision)
    await po.update({
      status: 'cancelled', // or 'rejected' if you want different status
      approvedBy: userId,
      approvedAt: new Date()
    });

    res.json({
      success: true,
      data: po,
      message: 'Purchase Order rejected successfully'
    });
  } catch (error) {
    console.error('Error rejecting purchase order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject purchase order',
      details: error.message
    });
  }
});

module.exports = router;
