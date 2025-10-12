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
  notes: Joi.string().allow('').optional()
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
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }

    const milestone = await ProjectMilestone.create({
      projectId: id,
      ...value,
      createdBy: req.body.createdBy
    });

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

module.exports = router;
