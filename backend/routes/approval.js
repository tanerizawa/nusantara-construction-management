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

module.exports = router;
