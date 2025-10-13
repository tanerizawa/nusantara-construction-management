/**
 * Projects Module - Milestones Routes
 * Handles: Project milestone CRUD operations
 * Lines: ~220 (extracted from 3,031 line monolith)
 */

const express = require('express');
const Joi = require('joi');
const ProjectMilestone = require('../../models/ProjectMilestone');
const Project = require('../../models/Project');
const User = require('../../models/User');
const milestoneIntegrationService = require('../../services/milestone/milestoneIntegrationService');

const router = express.Router();

// Validation schema for milestone
const milestoneSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  targetDate: Joi.date().required(),
  completedDate: Joi.date().optional(),
  assignedTo: Joi.string().optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
  status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').default('pending'),
  progress: Joi.number().min(0).max(100).default(0),
  budget: Joi.number().min(0).optional(),
  actualCost: Joi.number().min(0).optional(),
  deliverables: Joi.array().items(Joi.string()).optional(),
  dependencies: Joi.array().items(Joi.string()).optional(),
  notes: Joi.string().allow('').optional(),
  // RAB link (new field to replace category_link)
  rab_link: Joi.object({
    enabled: Joi.boolean().required(),
    totalValue: Joi.number().min(0).required(),
    totalItems: Joi.number().integer().min(0).required(),
    approvedDate: Joi.date().allow(null).optional(),
    linkedAt: Joi.date().required()
  }).optional()
});

/**
 * @route   GET /api/projects/:id/milestones
 * @desc    Get all milestones for a project
 * @access  Private
 */
router.get('/:id/milestones', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, sortBy = 'targetDate', sortOrder = 'ASC' } = req.query;

    // Check if project exists
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Build where clause
    const where = { projectId: id };
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const milestones = await ProjectMilestone.findAll({
      where,
      order: [[sortBy, sortOrder]],
      include: [{
        model: User,
        as: 'assignedUser',
        attributes: ['id', 'username', 'email', 'profile'],
        required: false
      }]
    });

    // Calculate statistics
    const stats = {
      total: milestones.length,
      completed: milestones.filter(m => m.status === 'completed').length,
      inProgress: milestones.filter(m => m.status === 'in_progress').length,
      pending: milestones.filter(m => m.status === 'pending').length,
      overdue: milestones.filter(m => 
        m.status !== 'completed' && 
        new Date(m.targetDate) < new Date()
      ).length,
      avgProgress: milestones.length > 0 
        ? (milestones.reduce((sum, m) => sum + (m.progress || 0), 0) / milestones.length).toFixed(1)
        : 0
    };

    res.json({
      success: true,
      data: milestones,
      stats
    });
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch milestones',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/projects/:id/milestones/rab-categories
 * @desc    Get available RAB categories for milestone linking
 * @access  Private
 * NOTE: Must be BEFORE /:milestoneId route to avoid treating 'rab-categories' as an ID
 */
router.get('/:id/milestones/rab-categories', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if project exists
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const categories = await milestoneIntegrationService.getAvailableRABCategories(id);

    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error getting RAB categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get RAB categories',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/projects/:id/milestones/rab-summary
 * @desc    Get COMPLETE RAB summary for milestone linking (NOT per-category!)
 * @access  Private
 * NOTE: Must be BEFORE /:milestoneId route to avoid treating 'rab-summary' as an ID
 */
router.get('/:id/milestones/rab-summary', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if project exists
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const summary = await milestoneIntegrationService.getProjectRABSummary(id);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error getting RAB summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get RAB summary',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/projects/:id/milestones/suggest
 * @desc    Auto-suggest feature (DISABLED - Use manual creation with category selector)
 * @access  Private
 * NOTE: Must be BEFORE /:milestoneId route to avoid treating 'suggest' as an ID
 */
router.get('/:id/milestones/suggest', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if project exists
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Feature disabled - return empty suggestions with helpful message
    res.json({
      success: true,
      data: [],
      count: 0,
      message: 'Auto-suggestion feature is disabled. Please create milestones manually using the form.',
      hint: 'Use the "Link ke Kategori RAB" dropdown to connect your milestone to work categories.'
    });
  } catch (error) {
    console.error('Error in suggest endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process request',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/projects/:id/milestones/:milestoneId
 * @desc    Get single milestone details
 * @access  Private
 */
router.get('/:id/milestones/:milestoneId', async (req, res) => {
  try {
    const { id, milestoneId } = req.params;

    const milestone = await ProjectMilestone.findOne({
      where: { id: milestoneId, projectId: id },
      include: [{
        model: User,
        as: 'assignedUser',
        attributes: ['id', 'username', 'email', 'profile'],
        required: false
      }]
    });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }

    res.json({
      success: true,
      data: milestone
    });
  } catch (error) {
    console.error('Error fetching milestone:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch milestone',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:id/milestones
 * @desc    Create new milestone for a project
 * @access  Private
 */
router.post('/:id/milestones', async (req, res) => {
  try {
    const { id } = req.params;

    console.log('[POST /milestones] Received request body:', JSON.stringify(req.body, null, 2));
    console.log('[POST /milestones] Budget value:', req.body.budget, 'Type:', typeof req.body.budget);

    // Check if project exists
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Validate request body
    const { error, value } = milestoneSchema.validate(req.body);
    if (error) {
      console.error('[POST /milestones] Validation error:', error.details);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }

    console.log('[POST /milestones] Validated value:', JSON.stringify(value, null, 2));
    console.log('[POST /milestones] Validated budget:', value.budget, 'Type:', typeof value.budget);

    const milestone = await ProjectMilestone.create({
      projectId: id,
      ...value,
      createdBy: req.body.createdBy
    });

    console.log('[POST /milestones] Created milestone:', JSON.stringify(milestone.toJSON(), null, 2));

    res.status(201).json({
      success: true,
      data: milestone,
      message: 'Milestone created successfully'
    });
  } catch (error) {
    console.error('Error creating milestone:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create milestone',
      details: error.message
    });
  }
});

/**
 * @route   PUT /api/projects/:id/milestones/:milestoneId
 * @desc    Update milestone
 * @access  Private
 */
router.put('/:id/milestones/:milestoneId', async (req, res) => {
  try {
    const { id, milestoneId } = req.params;

    const milestone = await ProjectMilestone.findOne({
      where: { id: milestoneId, projectId: id }
    });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }

    // Validate request body
    const { error, value } = milestoneSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }

    // Auto-complete logic
    if (value.status === 'completed' && !value.completedDate) {
      value.completedDate = new Date();
    }
    if (value.status === 'completed' && value.progress !== 100) {
      value.progress = 100;
    }

    await milestone.update({
      ...value,
      updatedBy: req.body.updatedBy
    });

    res.json({
      success: true,
      data: milestone,
      message: 'Milestone updated successfully'
    });
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update milestone',
      details: error.message
    });
  }
});

/**
 * @route   PUT /api/projects/:id/milestones/:milestoneId/complete
 * @desc    Mark milestone as completed
 * @access  Private
 */
router.put('/:id/milestones/:milestoneId/complete', async (req, res) => {
  try {
    const { id, milestoneId } = req.params;
    const { completedBy, notes } = req.body;

    const milestone = await ProjectMilestone.findOne({
      where: { id: milestoneId, projectId: id }
    });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }

    await milestone.update({
      status: 'completed',
      progress: 100,
      completedDate: new Date(),
      notes: notes || milestone.notes,
      updatedBy: completedBy
    });

    res.json({
      success: true,
      data: milestone,
      message: 'Milestone marked as completed'
    });
  } catch (error) {
    console.error('Error completing milestone:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete milestone',
      details: error.message
    });
  }
});

/**
 * @route   PUT /api/projects/:id/milestones/:milestoneId/approve
 * @desc    Approve pending milestone
 * @access  Private
 */
router.put('/:id/milestones/:milestoneId/approve', async (req, res) => {
  try {
    const { id, milestoneId } = req.params;
    const { approvedBy, notes } = req.body;

    const milestone = await ProjectMilestone.findOne({
      where: { id: milestoneId, projectId: id }
    });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }

    if (milestone.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Only pending milestones can be approved'
      });
    }

    await milestone.update({
      status: 'in_progress',
      notes: notes || milestone.notes,
      updatedBy: approvedBy
    });

    res.json({
      success: true,
      data: milestone,
      message: 'Milestone approved successfully'
    });
  } catch (error) {
    console.error('Error approving milestone:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve milestone',
      details: error.message
    });
  }
});

/**
 * @route   DELETE /api/projects/:id/milestones/:milestoneId
 * @desc    Delete milestone
 * @access  Private
 */
router.delete('/:id/milestones/:milestoneId', async (req, res) => {
  try {
    const { id, milestoneId } = req.params;

    const milestone = await ProjectMilestone.findOne({
      where: { id: milestoneId, projectId: id }
    });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }

    // Prevent deletion of completed milestones (optional business rule)
    if (milestone.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete completed milestone. Please cancel it first.'
      });
    }

    await milestone.destroy();

    res.json({
      success: true,
      message: 'Milestone deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting milestone:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete milestone',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/projects/:projectId/milestones/:milestoneId/progress
 * @desc    Get detailed workflow progress for a milestone
 * @access  Private
 */
router.get('/:projectId/milestones/:milestoneId/progress', async (req, res) => {
  try {
    const { milestoneId } = req.params;

    // Check if milestone exists
    const milestone = await ProjectMilestone.findByPk(milestoneId);
    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }

    const progressData = await milestoneIntegrationService.calculateWorkflowProgress(milestoneId);

    if (!progressData) {
      return res.json({
        success: true,
        data: null,
        message: 'Milestone is not linked to RAB category'
      });
    }

    res.json({
      success: true,
      data: progressData
    });
  } catch (error) {
    console.error('Error getting milestone progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get milestone progress',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:projectId/milestones/:milestoneId/sync
 * @desc    Manually trigger workflow sync for a milestone
 * @access  Private
 */
router.post('/:projectId/milestones/:milestoneId/sync', async (req, res) => {
  try {
    const { milestoneId } = req.params;

    // Check if milestone exists
    const milestone = await ProjectMilestone.findByPk(milestoneId);
    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found'
      });
    }

    // Check if milestone is linked to RAB
    if (!milestone.category_link || !milestone.category_link.enabled) {
      return res.status(400).json({
        success: false,
        error: 'Milestone is not linked to RAB category'
      });
    }

    const progressData = await milestoneIntegrationService.calculateWorkflowProgress(milestoneId);

    res.json({
      success: true,
      data: progressData,
      message: 'Milestone synced successfully'
    });
  } catch (error) {
    console.error('Error syncing milestone:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync milestone',
      details: error.message
    });
  }
});

module.exports = router;
