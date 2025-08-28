const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const Joi = require('joi');

const router = express.Router();

// Load projects data
const loadProjects = async () => {
  try {
    const projectsPath = path.join(__dirname, '../../data/projects.json');
    const data = await fs.readFile(projectsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading projects:', error);
    return { projects: [] };
  }
};

// Save projects data
const saveProjects = async (data) => {
  try {
    const projectsPath = path.join(__dirname, '../../data/projects.json');
    await fs.writeFile(projectsPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving projects:', error);
  }
};

// Validation schema
const projectSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  client: Joi.object({
    company: Joi.string().required(),
    contactPerson: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string().required()
  }).required(),
  location: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    province: Joi.string().required()
  }).required(),
  timeline: Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    duration: Joi.number().required(),
    unit: Joi.string().valid('days', 'weeks', 'months').required()
  }).required(),
  budget: Joi.object({
    total: Joi.number().required(),
    currency: Joi.string().default('IDR')
  }).required()
});

// @route   GET /api/projects
// @desc    Get all projects
// @access  Private
router.get('/', async (req, res) => {
  try {
    const projectsData = await loadProjects();
    const {
      q,
      status,
      sort = 'name',
      order = 'asc',
      limit = 10,
      page = 1
    } = req.query;

    const limitNum = Math.max(1, parseInt(limit));
    const pageNum = Math.max(1, parseInt(page));

    let projects = projectsData.projects || [];

    // Filter by status if provided
    if (status) {
      projects = projects.filter(p => p.status === status);
    }

    // Text search
    if (q) {
      const needle = String(q).toLowerCase();
      projects = projects.filter(p => {
        const name = (p.name || '').toLowerCase();
        const client = (p.client?.company || '').toLowerCase();
        const city = (p.location?.city || '').toLowerCase();
        const province = (p.location?.province || '').toLowerCase();
        const code = (p.projectCode || '').toLowerCase();
        return (
          name.includes(needle) ||
          client.includes(needle) ||
          city.includes(needle) ||
          province.includes(needle) ||
          code.includes(needle)
        );
      });
    }

    // Sorting
    const safeOrder = String(order).toLowerCase() === 'desc' ? 'desc' : 'asc';
    const safeSort = ['name', 'startDate', 'budget'].includes(sort) ? sort : 'name';
    projects.sort((a, b) => {
      let aVal;
      let bVal;
      if (safeSort === 'budget') {
        aVal = a.budget?.contractValue || a.budget?.approvedBudget || a.budget?.total || 0;
        bVal = b.budget?.contractValue || b.budget?.approvedBudget || b.budget?.total || 0;
      } else if (safeSort === 'startDate') {
        aVal = new Date(a.timeline?.startDate || 0).getTime();
        bVal = new Date(b.timeline?.startDate || 0).getTime();
      } else {
        aVal = (a.name || '').toLowerCase();
        bVal = (b.name || '').toLowerCase();
      }
      if (aVal === bVal) return 0;
      if (safeOrder === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    // Pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    const totalCount = projects.length;
    const paginatedProjects = projects.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedProjects,
      pagination: {
        current: pageNum,
        total: Math.ceil(totalCount / limitNum) || 1,
        count: totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const projectsData = await loadProjects();
    const project = projectsData.projects.find(p => p.id === req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      success: true,
      data: project
    });

  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Project Manager, Admin)
router.post('/', async (req, res) => {
  try {
    const { error } = projectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const projectsData = await loadProjects();
    const projects = projectsData.projects || [];

    // Generate new project ID
    const newId = `PRJ${String(projects.length + 1).padStart(3, '0')}`;
    const projectCode = `YK-${new Date().getFullYear()}-${String(projects.length + 1).padStart(3, '0')}`;

    const newProject = {
      id: newId,
      projectCode,
      ...req.body,
      status: 'planning',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: req.user?.id || 'USR001' // Default for mockup
    };

    projects.push(newProject);
    await saveProjects({ projects });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProject
    });

  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Project Manager, Admin)
router.put('/:id', async (req, res) => {
  try {
    const projectsData = await loadProjects();
    const projectIndex = projectsData.projects.findIndex(p => p.id === req.params.id);

    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update project
    projectsData.projects[projectIndex] = {
      ...projectsData.projects[projectIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await saveProjects(projectsData);

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: projectsData.projects[projectIndex]
    });

  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const projectsData = await loadProjects();
    const projectIndex = projectsData.projects.findIndex(p => p.id === req.params.id);

    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Remove project
    const deletedProject = projectsData.projects.splice(projectIndex, 1)[0];
    await saveProjects(projectsData);

    res.json({
      success: true,
      message: 'Project deleted successfully',
      data: deletedProject
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/projects/stats/overview
// @desc    Get projects statistics
// @access  Private
router.get('/stats/overview', async (req, res) => {
  try {
    const projectsData = await loadProjects();
    const projects = projectsData.projects || [];

    const stats = {
      total: projects.length,
      active: projects.filter(p => p.status === 'in_progress').length,
      completed: projects.filter(p => p.status === 'completed').length,
      planning: projects.filter(p => p.status === 'planning').length,
      totalBudget: projects.reduce((sum, p) => sum + (p.budget?.total || 0), 0),
      averageProgress: projects.length > 0 
        ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
        : 0
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching project stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
