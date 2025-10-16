const express = require('express');
const router = express.Router();
const { models } = require('../models');
const { Project } = models;
const { Op } = require('sequelize');

/**
 * @route   GET /api/stats/overview
 * @desc    Get landing page statistics overview
 * @access  Public
 */
router.get('/overview', async (req, res) => {
  try {
    // Get project statistics
    const totalProjects = await Project.count();
    const activeProjects = await Project.count({
      where: {
        status: 'active'
      }
    });
    const completedProjects = await Project.count({
      where: {
        status: 'completed'
      }
    });

    // Calculate total project value (for public display, can be masked)
    const projectsWithBudget = await Project.findAll({
      attributes: ['budget'],
      where: {
        budget: {
          [Op.not]: null
        }
      }
    });

    const totalValue = projectsWithBudget.reduce((sum, project) => {
      return sum + (parseFloat(project.budget) || 0);
    }, 0);

    res.json({
      success: true,
      data: {
        totalProjects,
        activeProjects,
        completedProjects,
        totalValue: Math.round(totalValue),
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching stats overview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/stats/recent-projects
 * @desc    Get recent projects for landing page
 * @access  Public
 */
router.get('/recent-projects', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const recentProjects = await Project.findAll({
      attributes: ['id', 'name', 'description', 'status', 'progress', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: limit,
      where: {
        status: {
          [Op.in]: ['active', 'completed']
        }
      }
    });

    res.json({
      success: true,
      data: recentProjects
    });
  } catch (error) {
    console.error('Error fetching recent projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent projects',
      message: error.message
    });
  }
});

module.exports = router;