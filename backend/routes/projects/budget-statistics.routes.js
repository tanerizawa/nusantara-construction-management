/**
 * Projects Module - Budget Monitoring & Statistics Routes
 * Handles: Comprehensive budget analysis and project statistics
 * Lines: ~350 (extracted from 3,031 line monolith)
 */

const express = require('express');
const { QueryTypes } = require('sequelize');
const Project = require('../../models/Project');
const ProjectRAB = require('../../models/ProjectRAB');
const sequelize = require('../../config/database');

const router = express.Router();

/**
 * @route   GET /api/projects/:id/budget-monitoring
 * @desc    Get comprehensive budget monitoring data
 * @access  Private
 * @query   {string} timeframe - week, month, quarter, year
 */
router.get('/:id/budget-monitoring', async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { timeframe = 'month' } = req.query;

    console.log('🔵 Fetching budget monitoring for project:', projectId, 'timeframe:', timeframe);

    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // 1. Get all approved RAB items (Budget)
    const rabItems = await ProjectRAB.findAll({
      where: {
        projectId,
        status: 'approved'
      },
      attributes: ['id', 'category', 'description', 'quantity', 'unitPrice', 'totalPrice'],
      raw: true
    });

    console.log('📊 RAB Items found:', rabItems.length);

    // 2. Get tracking data (Actual spending) - Optional if table exists
    let trackingResults = [];
    try {
      const trackingQuery = `
        SELECT 
          pr.category,
          SUM(rpt.quantity) as total_quantity,
          SUM(rpt."totalAmount") as total_amount,
          rpt.status,
          DATE_TRUNC('${timeframe}', rpt."purchaseDate") as period
        FROM rab_purchase_tracking rpt
        JOIN project_rab pr ON pr.id::text = rpt."rabItemId"
        WHERE rpt."projectId" = :projectId
        GROUP BY pr.category, rpt.status, DATE_TRUNC('${timeframe}', rpt."purchaseDate")
        ORDER BY period DESC
      `;

      trackingResults = await sequelize.query(trackingQuery, {
        replacements: { projectId },
        type: QueryTypes.SELECT
      });
    } catch (trackingError) {
      console.log('⚠️  Tracking table not available, using estimated data');
      trackingResults = [];
    }

    console.log('💰 Tracking results:', trackingResults.length);

    // 3. Calculate budget by category
    const categoryBudgets = {};
    rabItems.forEach(item => {
      const category = item.category || 'Uncategorized';
      if (!categoryBudgets[category]) {
        categoryBudgets[category] = {
          category,
          budget: 0,
          actual: 0,
          committed: 0,
          items: []
        };
      }
      categoryBudgets[category].budget += parseFloat(item.totalPrice || 0);
      categoryBudgets[category].items.push(item);
    });

    // 4. Add actual spending to categories
    if (Array.isArray(trackingResults) && trackingResults.length > 0) {
      trackingResults.forEach(track => {
        const category = track.category || 'Uncategorized';
        if (categoryBudgets[category]) {
          const amount = parseFloat(track.total_amount || 0);

          if (track.status === 'received' || track.status === 'completed') {
            categoryBudgets[category].actual += amount;
          } else if (track.status === 'pending' || track.status === 'approved') {
            categoryBudgets[category].committed += amount;
          }
        }
      });
    } else {
      // Use estimated spending based on project progress
      const projectProgress = parseFloat(project.progress || 0) / 100;
      Object.values(categoryBudgets).forEach(cat => {
        cat.actual = cat.budget * projectProgress * 0.7; // 70% of proportional budget
        cat.committed = cat.budget * projectProgress * 0.2; // 20% committed
      });
    }

    // 5. Calculate summary and variance
    const categories = Object.values(categoryBudgets).map(cat => {
      const remaining = cat.budget - cat.actual - cat.committed;
      const varianceAmount = cat.budget - cat.actual;
      const variancePercentage = cat.budget > 0
        ? ((varianceAmount / cat.budget) * 100).toFixed(2)
        : 0;
      const utilizationPercentage = cat.budget > 0
        ? (((cat.actual + cat.committed) / cat.budget) * 100).toFixed(2)
        : 0;

      return {
        category: cat.category,
        budget: parseFloat(cat.budget.toFixed(2)),
        actual: parseFloat(cat.actual.toFixed(2)),
        committed: parseFloat(cat.committed.toFixed(2)),
        remaining: parseFloat(remaining.toFixed(2)),
        varianceAmount: parseFloat(varianceAmount.toFixed(2)),
        variancePercentage: parseFloat(variancePercentage),
        utilizationPercentage: parseFloat(utilizationPercentage),
        itemCount: cat.items.length
      };
    });

    // 6. Calculate total summary
    const summary = categories.reduce((acc, cat) => {
      acc.totalBudget += cat.budget;
      acc.totalActual += cat.actual;
      acc.totalCommitted += cat.committed;
      return acc;
    }, {
      totalBudget: 0,
      totalActual: 0,
      totalCommitted: 0
    });

    summary.remainingBudget = summary.totalBudget - summary.totalActual - summary.totalCommitted;
    summary.utilizationPercentage = summary.totalBudget > 0
      ? parseFloat((((summary.totalActual + summary.totalCommitted) / summary.totalBudget) * 100).toFixed(2))
      : 0;
    summary.actualPercentage = summary.totalBudget > 0
      ? parseFloat(((summary.totalActual / summary.totalBudget) * 100).toFixed(2))
      : 0;
    summary.committedPercentage = summary.totalBudget > 0
      ? parseFloat(((summary.totalCommitted / summary.totalBudget) * 100).toFixed(2))
      : 0;

    // 7. Generate budget alerts
    const alerts = [];
    categories.forEach(cat => {
      const utilization = parseFloat(cat.utilizationPercentage);

      if (cat.actual > cat.budget) {
        alerts.push({
          type: 'critical',
          category: cat.category,
          message: `Budget exceeded! Actual spending (Rp ${cat.actual.toLocaleString('id-ID')}) is over budget (Rp ${cat.budget.toLocaleString('id-ID')})`
        });
      } else if (utilization >= 95) {
        alerts.push({
          type: 'critical',
          category: cat.category,
          message: `Critical: ${utilization}% budget utilized for ${cat.category}`
        });
      } else if (utilization >= 80) {
        alerts.push({
          type: 'warning',
          category: cat.category,
          message: `Warning: ${utilization}% budget utilized for ${cat.category}`
        });
      } else if (utilization >= 60) {
        alerts.push({
          type: 'info',
          category: cat.category,
          message: `Info: ${utilization}% budget utilized for ${cat.category}`
        });
      }
    });

    // 8. Build timeline data
    let timeline = [];
    try {
      const timelineQuery = `
        SELECT 
          DATE_TRUNC('${timeframe}', rpt."purchaseDate") as period,
          SUM(rpt."totalAmount") as actual_amount,
          COUNT(*) as transaction_count
        FROM rab_purchase_tracking rpt
        WHERE rpt."projectId" = :projectId
        GROUP BY DATE_TRUNC('${timeframe}', rpt."purchaseDate")
        ORDER BY period ASC
      `;

      const timelineData = await sequelize.query(timelineQuery, {
        replacements: { projectId },
        type: QueryTypes.SELECT
      });

      timeline = Array.isArray(timelineData) ? timelineData.map(item => ({
        date: item.period,
        actualAmount: parseFloat(item.actual_amount || 0),
        budgetAmount: summary.totalBudget / 12, // Distributed evenly (simplified)
        committedAmount: summary.totalCommitted,
        transactionCount: parseInt(item.transaction_count || 0)
      })) : [];
    } catch (timelineError) {
      console.log('⚠️  Timeline data not available');
      timeline = [];
    }

    // 9. Simple forecast (next 3 periods based on avg spending)
    const avgSpending = timeline.length > 0
      ? timeline.reduce((sum, t) => sum + t.actualAmount, 0) / timeline.length
      : summary.totalActual / 3; // Fallback to average

    const forecast = [];
    if (avgSpending > 0 && summary.remainingBudget > 0) {
      const periods = timeframe === 'week' ? ['Week 1', 'Week 2', 'Week 3'] :
                     timeframe === 'month' ? ['Month 1', 'Month 2', 'Month 3'] :
                     ['Q1', 'Q2', 'Q3'];

      periods.forEach((period, index) => {
        const projectedSpend = avgSpending * (1 + index * 0.05); // 5% growth
        forecast.push({
          period,
          projectedSpend: parseFloat(projectedSpend.toFixed(2)),
          confidence: Math.max(50, 90 - (index * 15)), // Decreasing confidence
          remainingAfter: parseFloat((summary.remainingBudget - (projectedSpend * (index + 1))).toFixed(2))
        });
      });
    }

    // 10. Return comprehensive budget data
    const budgetData = {
      summary,
      categories: categories.sort((a, b) => b.budget - a.budget), // Sort by budget desc
      timeline,
      alerts: alerts.sort((a, b) => {
        const priority = { critical: 3, warning: 2, info: 1 };
        return priority[b.type] - priority[a.type];
      }),
      forecast,
      metadata: {
        projectId,
        projectName: project.name,
        projectProgress: project.progress,
        timeframe,
        totalRABItems: rabItems.length,
        categoryCount: categories.length,
        generatedAt: new Date().toISOString()
      }
    };

    console.log('✅ Budget monitoring data generated successfully');

    res.json({
      success: true,
      data: budgetData
    });

  } catch (error) {
    console.error('❌ Error fetching budget monitoring:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch budget monitoring data',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/projects/stats/overview
 * @desc    Get project statistics overview across all projects
 * @access  Private
 */
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Project.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
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
      planning: await Project.count({ where: { status: 'planning' } }),
      onHold: await Project.count({ where: { status: 'on_hold' } }),
      cancelled: await Project.count({ where: { status: 'cancelled' } })
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
