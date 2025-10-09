/**
 * Projects Module - Team Management Routes
 * Handles: Team member CRUD operations and role management
 * Lines: ~280 (extracted from 3,031 line monolith)
 */

const express = require('express');
const Joi = require('joi');
const ProjectTeamMember = require('../../models/ProjectTeamMember');
const Project = require('../../models/Project');
const User = require('../../models/User');

const router = express.Router();

// Validation schema for team member
const teamMemberSchema = Joi.object({
  userId: Joi.string().optional(),
  name: Joi.string().required(),
  role: Joi.string().required(),
  position: Joi.string().optional(),
  employeeId: Joi.string().optional(),
  department: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  skills: Joi.array().items(Joi.string()).optional(),
  responsibilities: Joi.array().items(Joi.string()).optional(),
  allocation: Joi.number().min(0).max(100).default(100),
  hourlyRate: Joi.number().min(0).optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  status: Joi.string().valid('active', 'inactive', 'on_leave').default('active'),
  contact: Joi.object({
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    address: Joi.string().optional()
  }).optional(),
  notes: Joi.string().allow('').optional()
});

/**
 * @route   GET /api/projects/:id/team
 * @desc    Get all team members for a project
 * @access  Private
 */
router.get('/:id/team', async (req, res) => {
  try {
    const { id } = req.params;
    const { role, status, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

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
    if (role) where.role = role;
    if (status) where.status = status;

    const teamMembers = await ProjectTeamMember.findAll({
      where,
      order: [[sortBy, sortOrder]],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email', 'profile'],
        required: false
      }]
    });

    // Calculate statistics
    const stats = {
      total: teamMembers.length,
      active: teamMembers.filter(m => m.status === 'active').length,
      inactive: teamMembers.filter(m => m.status === 'inactive').length,
      byRole: teamMembers.reduce((acc, member) => {
        acc[member.role] = (acc[member.role] || 0) + 1;
        return acc;
      }, {}),
      totalAllocation: teamMembers
        .filter(m => m.status === 'active')
        .reduce((sum, m) => sum + (m.allocation || 0), 0)
    };

    res.json({
      success: true,
      data: teamMembers,
      stats
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch team members',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/projects/:id/team/:memberId
 * @desc    Get single team member details
 * @access  Private
 */
router.get('/:id/team/:memberId', async (req, res) => {
  try {
    const { id, memberId } = req.params;

    const teamMember = await ProjectTeamMember.findOne({
      where: { id: memberId, projectId: id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email', 'profile'],
        required: false
      }]
    });

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        error: 'Team member not found'
      });
    }

    res.json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch team member',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:id/team
 * @desc    Add team member to project
 * @access  Private
 */
router.post('/:id/team', async (req, res) => {
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
    const { error, value } = teamMemberSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }

    // Check if user already in team
    if (value.userId) {
      const existing = await ProjectTeamMember.findOne({
        where: { projectId: id, userId: value.userId }
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'User is already a team member of this project'
        });
      }
    }

    const teamMember = await ProjectTeamMember.create({
      projectId: id,
      ...value,
      createdBy: req.body.createdBy
    });

    // Fetch with relations
    const memberWithUser = await ProjectTeamMember.findByPk(teamMember.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email', 'profile'],
        required: false
      }]
    });

    res.status(201).json({
      success: true,
      data: memberWithUser,
      message: 'Team member added successfully'
    });
  } catch (error) {
    console.error('Error adding team member:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add team member',
      details: error.message
    });
  }
});

/**
 * @route   PUT /api/projects/:id/team/:memberId
 * @desc    Update team member
 * @access  Private
 */
router.put('/:id/team/:memberId', async (req, res) => {
  try {
    const { id, memberId } = req.params;

    const teamMember = await ProjectTeamMember.findOne({
      where: { id: memberId, projectId: id }
    });

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        error: 'Team member not found'
      });
    }

    // Validate request body
    const { error, value } = teamMemberSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }

    await teamMember.update({
      ...value,
      updatedBy: req.body.updatedBy
    });

    // Fetch with relations
    const updatedMember = await ProjectTeamMember.findByPk(teamMember.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email', 'profile'],
        required: false
      }]
    });

    res.json({
      success: true,
      data: updatedMember,
      message: 'Team member updated successfully'
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update team member',
      details: error.message
    });
  }
});

/**
 * @route   PUT /api/projects/:id/team/:memberId/deactivate
 * @desc    Deactivate team member
 * @access  Private
 */
router.put('/:id/team/:memberId/deactivate', async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const { reason, updatedBy } = req.body;

    const teamMember = await ProjectTeamMember.findOne({
      where: { id: memberId, projectId: id }
    });

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        error: 'Team member not found'
      });
    }

    await teamMember.update({
      status: 'inactive',
      endDate: new Date(),
      notes: reason || teamMember.notes,
      updatedBy
    });

    res.json({
      success: true,
      data: teamMember,
      message: 'Team member deactivated successfully'
    });
  } catch (error) {
    console.error('Error deactivating team member:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to deactivate team member',
      details: error.message
    });
  }
});

/**
 * @route   DELETE /api/projects/:id/team/:memberId
 * @desc    Remove team member from project
 * @access  Private
 */
router.delete('/:id/team/:memberId', async (req, res) => {
  try {
    const { id, memberId } = req.params;

    const teamMember = await ProjectTeamMember.findOne({
      where: { id: memberId, projectId: id }
    });

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        error: 'Team member not found'
      });
    }

    await teamMember.destroy();

    res.json({
      success: true,
      message: 'Team member removed successfully'
    });
  } catch (error) {
    console.error('Error removing team member:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove team member',
      details: error.message
    });
  }
});

module.exports = router;
