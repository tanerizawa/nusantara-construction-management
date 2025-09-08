const express = require('express');
const Joi = require('joi');
const { Op } = require('sequelize');
const Project = require('../models/Project');

const router = express.Router();

// Validation schema for project creation/update
const projectSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  clientName: Joi.string().required(),
  clientContact: Joi.object().optional(),
  location: Joi.object().optional(),
  budget: Joi.number().min(0).optional(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  status: Joi.string().valid('planning', 'active', 'on_hold', 'completed', 'cancelled').default('planning'),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  progress: Joi.number().min(0).max(100).default(0)
});

// @route   GET /api/projects
// @desc    Get all projects with filters and pagination
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      q,
      status,
      priority,
      sort = 'name',
      order = 'asc',
      limit = 10,
      page = 1
    } = req.query;

    const limitNum = Math.max(1, parseInt(limit));
    const pageNum = Math.max(1, parseInt(page));
    const offset = (pageNum - 1) * limitNum;

    // Build where clause for filtering
    const whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (priority) {
      whereClause.priority = priority;
    }

    // Text search
    if (q) {
      const needle = String(q).toLowerCase();
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${needle}%` } },
        { clientName: { [Op.iLike]: `%${needle}%` } },
        { description: { [Op.iLike]: `%${needle}%` } }
      ];
    }

    // Build order clause
    const validSortFields = ['name', 'status', 'startDate', 'endDate', 'budget', 'progress', 'priority'];
    const sortField = validSortFields.includes(sort) ? sort : 'name';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    // Get projects from database
    const { count, rows: projects } = await Project.findAndCountAll({
      where: whereClause,
      order: [[sortField, sortOrder]],
      limit: limitNum,
      offset: offset,
      attributes: [
        'id', 'name', 'description', 'clientName', 'clientContact',
        'location', 'budget', 'actualCost', 'status', 'priority',
        'progress', 'startDate', 'endDate', 'projectManagerId',
        'createdAt', 'updatedAt'
      ]
    });

    // Transform data for API response
    const transformedProjects = projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      client: {
        company: project.clientName,
        ...project.clientContact
      },
      location: project.location,
      budget: {
        total: project.budget,
        currency: 'IDR'
      },
      actualCost: project.actualCost,
      status: project.status,
      priority: project.priority,
      progress: {
        percentage: project.progress,
        status: project.status
      },
      timeline: {
        startDate: project.startDate,
        endDate: project.endDate
      },
      manager: project.projectManagerId ? {
        id: project.projectManagerId
      } : null,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    }));

    // Calculate pagination
    const totalPages = Math.ceil(count / limitNum);

    res.json({
      success: true,
      data: transformedProjects,
      pagination: {
        current: pageNum,
        total: totalPages,
        count: count,
        perPage: limitNum
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
      details: error.message
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Transform data for API response
    const transformedProject = {
      id: project.id,
      name: project.name,
      description: project.description,
      client: {
        company: project.clientName,
        ...project.clientContact
      },
      location: project.location,
      budget: {
        total: project.budget,
        currency: 'IDR'
      },
      actualCost: project.actualCost,
      status: project.status,
      priority: project.priority,
      progress: {
        percentage: project.progress,
        status: project.status
      },
      timeline: {
        startDate: project.startDate,
        endDate: project.endDate
      },
      manager: project.projectManagerId ? {
        id: project.projectManagerId
      } : null,
      metadata: project.metadata || {},
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    };

    res.json({
      success: true,
      data: transformedProject
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project',
      details: error.message
    });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
router.post('/', async (req, res) => {
  try {
    // Validate input
    const { error, value } = projectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details
      });
    }

    // Generate project ID
    const projectCount = await Project.count();
    const projectId = `PRJ${String(projectCount + 1).padStart(3, '0')}`;

    // Create project
    const project = await Project.create({
      id: projectId,
      name: value.name,
      description: value.description,
      clientName: value.clientName,
      clientContact: value.clientContact || {},
      location: value.location || {},
      budget: value.budget,
      startDate: value.startDate,
      endDate: value.endDate,
      status: value.status,
      priority: value.priority,
      progress: value.progress
    });

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully'
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project',
      details: error.message
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find project
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Validate input (make fields optional for update)
    const updateSchema = projectSchema.fork(
      ['name', 'clientName', 'startDate', 'endDate'],
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

    // Update project
    await project.update(value);

    res.json({
      success: true,
      data: project,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project',
      details: error.message
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    await project.destroy();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project',
      details: error.message
    });
  }
});

// @route   GET /api/projects/stats/overview
// @desc    Get project statistics overview
// @access  Private
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Project.findAll({
      attributes: [
        'status',
        [Project.sequelize.fn('COUNT', Project.sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const overview = {
      total: await Project.count(),
      byStatus: stats.reduce((acc, stat) => {
        acc[stat.status] = parseInt(stat.dataValues.count);
        return acc;
      }, {}),
      active: await Project.count({ where: { status: 'active' } }),
      completed: await Project.count({ where: { status: 'completed' } }),
      planning: await Project.count({ where: { status: 'planning' } })
    };

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    console.error('Error fetching project stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project statistics',
      details: error.message
    });
  }
});

module.exports = router;
