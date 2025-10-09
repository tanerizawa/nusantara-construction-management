/**
 * Subsidiaries Module - Statistics Routes
 * Handles: Statistics, Overview, Analytics
 */

const express = require('express');
const { Op } = require('sequelize');
const Subsidiary = require('../../models/Subsidiary');
const Project = require('../../models/Project');
const { sequelize } = require('../../config/database');

const router = express.Router();

// @route   GET /api/subsidiaries/statistics
// @desc    Get comprehensive subsidiary statistics (specific to subsidiaries)
// @access  Private
router.get('/statistics', async (req, res) => {
  try {
    // Get total counts
    const totalSubsidiaries = await Subsidiary.count();
    const activeSubsidiaries = await Subsidiary.count({ where: { status: 'active' } });
    const inactiveSubsidiaries = await Subsidiary.count({ where: { status: 'inactive' } });

    // Get total employees across all subsidiaries
    const totalEmployees = await Subsidiary.sum('employee_count') || 0;

    // Get count by specialization
    const bySpecialization = await Subsidiary.findAll({
      attributes: [
        'specialization',
        [sequelize.fn('count', sequelize.col('id')), 'count'],
        [sequelize.fn('sum', sequelize.col('employee_count')), 'totalEmployees']
      ],
      group: ['specialization'],
      raw: true
    });

    // Get count by established year ranges
    const currentYear = new Date().getFullYear();
    const yearRanges = [
      { label: 'Baru (< 5 tahun)', min: currentYear - 5, max: currentYear },
      { label: 'Menengah (5-15 tahun)', min: currentYear - 15, max: currentYear - 5 },
      { label: 'Senior (> 15 tahun)', min: 1900, max: currentYear - 15 }
    ];

    const byAge = await Promise.all(
      yearRanges.map(async range => {
        const count = await Subsidiary.count({
          where: {
            established_year: {
              [Op.gte]: range.min,
              [Op.lte]: range.max
            }
          }
        });
        return { ...range, count };
      })
    );

    // Get top performers by employee count
    const topByEmployees = await Subsidiary.findAll({
      attributes: ['id', 'name', 'code', 'specialization', 'employee_count'],
      where: {
        employee_count: { [Op.not]: null }
      },
      order: [['employee_count', 'DESC']],
      limit: 5
    });

    // Recent subsidiaries (last 3 years)
    const recentSubsidiaries = await Subsidiary.count({
      where: {
        established_year: {
          [Op.gte]: currentYear - 3
        }
      }
    });

    // Get subsidiaries with certifications
    const withCertifications = await Subsidiary.count({
      where: {
        certification: {
          [Op.not]: null,
          [Op.ne]: []
        }
      }
    });

    res.json({
      success: true,
      data: {
        overview: {
          total: totalSubsidiaries,
          active: activeSubsidiaries,
          inactive: inactiveSubsidiaries,
          totalEmployees: totalEmployees,
          averageEmployees: totalSubsidiaries > 0 ? Math.round(totalEmployees / totalSubsidiaries) : 0
        },
        specializations: bySpecialization.map(item => ({
          specialization: item.specialization,
          count: parseInt(item.count),
          totalEmployees: parseInt(item.totalEmployees) || 0
        })),
        ageDistribution: byAge,
        topPerformers: topByEmployees,
        insights: {
          recentlyEstablished: recentSubsidiaries,
          withCertifications: withCertifications,
          certificationRate: totalSubsidiaries > 0 ? Math.round((withCertifications / totalSubsidiaries) * 100) : 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching subsidiary statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching subsidiary statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/subsidiaries/stats/overview
// @desc    Get subsidiaries statistics with real project counts  
// @access  Private
router.get('/stats/overview', async (req, res) => {
  try {
    // Get total subsidiaries count
    const totalSubsidiaries = await Subsidiary.count();
    
    // Get active subsidiaries count
    const activeSubsidiaries = await Subsidiary.count({
      where: { status: 'active' }
    });
    
    // Get total projects count - fallback to 0 if Project model not available
    let totalProjects = 0;
    let activeProjects = 0;
    
    try {
      if (Project) {
        totalProjects = await Project.count();
        activeProjects = await Project.count({
          where: { status: 'active' }
        });
      }
    } catch (projectError) {
      console.warn('Project model not available, using fallback values');
    }

    // Get count by specialization
    const stats = await Subsidiary.findAll({
      attributes: [
        'specialization',
        [sequelize.fn('count', sequelize.col('id')), 'count']
      ],
      group: ['specialization'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        totalSubsidiaries,
        activeSubsidiaries,
        inactiveSubsidiaries: totalSubsidiaries - activeSubsidiaries,
        totalProjects,
        activeProjects,
        bySpecialization: stats
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
