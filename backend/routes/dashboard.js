const express = require('express');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Import Sequelize models (Database-only mode)
const { models } = require('../models');
const Project = models.Project;
const Finance = models.FinanceTransaction;
const Manpower = models.Manpower;
const Inventory = models.InventoryItem;
const Tax = models.TaxRecord;

// Load all data for dashboard (Database only - no fallback)
const loadAllData = async () => {
  try {
    const [projectsData, financeData, manpowerData, inventoryData, taxData] = await Promise.all([
      Project.findAll().catch(err => {
        console.error('Error loading projects:', err.message);
        return [];
      }),
      Finance.findAll().catch(err => {
        console.error('Error loading finance data:', err.message);
        return [];
      }),
      Manpower.findAll().catch(err => {
        console.error('❌ Manpower.findAll error:', err.message);
        return [];
      }),
      Inventory.findAll().catch(err => {
        console.error('❌ Inventory.findAll error:', err.message);
        return [];
      }),
      Tax.findAll().catch(err => {
        console.error('Error loading tax data:', err.message);
        return [];
      })
    ]);

    return {
      projects: projectsData || [],
      finance: financeData || [],
      manpower: manpowerData || [],
      inventory: inventoryData || [],
      tax: taxData || []
    };
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    // Return empty data instead of fallback to JSON
    return {
      projects: [],
      finance: [],
      manpower: [],
      inventory: [],
      tax: []
    };
  }
};

// @route   GET /api/dashboard/overview
// @desc    Get dashboard overview statistics
// @access  Private
router.get('/overview', verifyToken, async (req, res) => {
  try {
    const data = await loadAllData();

    // Project Statistics
    const projectStats = {
      total: data.projects.length,
      active: data.projects.filter(p => p.status === 'in_progress').length,
      completed: data.projects.filter(p => p.status === 'completed').length,
      planning: data.projects.filter(p => p.status === 'planning').length,
      totalBudget: data.projects.reduce((sum, p) => sum + (p.budget?.total || 0), 0),
      avgProgress: data.projects.length > 0 
        ? Math.round(data.projects.reduce((sum, p) => sum + (p.progress || 0), 0) / data.projects.length)
        : 0
    };

    // Financial Statistics
    const income = data.finance
      .filter(t => t.type === 'Pemasukan')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = data.finance
      .filter(t => t.type === 'Pengeluaran')
      .reduce((sum, t) => sum + t.amount, 0);

    const financeStats = {
      totalIncome: income,
      totalExpense: expense,
      netIncome: income - expense,
      transactions: data.finance.length
    };

    // Manpower Statistics
    const manpowerStats = {
      total: data.manpower.length,
      active: data.manpower.filter(m => m.status === 'active').length,
      byRole: data.manpower.reduce((acc, worker) => {
        acc[worker.role] = (acc[worker.role] || 0) + 1;
        return acc;
      }, {})
    };

    // Inventory Statistics
    const inventoryStats = {
      totalItems: data.inventory.length,
      lowStock: data.inventory.filter(item => 
        item.stock && item.stock.available <= item.stock.minimum
      ).length,
      outOfStock: data.inventory.filter(item => 
        item.stock && item.stock.available === 0
      ).length,
      totalValue: data.inventory.reduce((sum, item) => 
        sum + ((item.stock?.available || 0) * (item.pricing?.averagePrice || 0)), 0
      )
    };

    // Tax Statistics
    const taxStats = {
      total: data.tax.reduce((sum, t) => sum + t.amount, 0),
      paid: data.tax.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0),
      pending: data.tax.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0),
      records: data.tax.length
    };

    // Recent Activities
    const recentActivities = [
      ...data.finance.slice(-5).map(t => ({
        type: 'finance',
        title: `${t.type}: ${t.desc}`,
        amount: t.amount,
        date: t.date
      })),
      ...data.projects.slice(-3).map(p => ({
        type: 'project',
        title: `Project: ${p.name}`,
        status: p.status,
        date: p.createdAt ? (p.createdAt instanceof Date ? p.createdAt.toISOString().split('T')[0] : p.createdAt.split('T')[0]) : p.timeline?.startDate
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

    res.json({
      success: true,
      data: {
        projects: projectStats,
        finance: financeStats,
        manpower: manpowerStats,
        inventory: inventoryStats,
        tax: taxStats,
        recentActivities
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/dashboard/charts/finance
// @desc    Get financial chart data
// @access  Private
router.get('/charts/finance', async (req, res) => {
  try {
    const data = await loadAllData();
    const { period = 'monthly' } = req.query;

    let chartData = [];

    if (period === 'monthly') {
      // Group by month for current year
      const currentYear = new Date().getFullYear();
      const monthlyData = {};

      // Initialize months
      for (let month = 1; month <= 12; month++) {
        monthlyData[month] = {
          month: new Date(currentYear, month - 1).toLocaleString('default', { month: 'short' }),
          income: 0,
          expense: 0
        };
      }

      // Process transactions
      data.finance
        .filter(t => new Date(t.date).getFullYear() === currentYear)
        .forEach(transaction => {
          const month = new Date(transaction.date).getMonth() + 1;
          if (transaction.type === 'Pemasukan') {
            monthlyData[month].income += transaction.amount;
          } else {
            monthlyData[month].expense += transaction.amount;
          }
        });

      chartData = Object.values(monthlyData);
    }

    res.json({
      success: true,
      data: chartData
    });

  } catch (error) {
    console.error('Error fetching finance chart data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/dashboard/charts/projects
// @desc    Get project chart data
// @access  Private
router.get('/charts/projects', async (req, res) => {
  try {
    const data = await loadAllData();

    const statusData = [
      { name: 'Planning', value: data.projects.filter(p => p.status === 'planning').length },
      { name: 'In Progress', value: data.projects.filter(p => p.status === 'in_progress').length },
      { name: 'Completed', value: data.projects.filter(p => p.status === 'completed').length },
      { name: 'On Hold', value: data.projects.filter(p => p.status === 'on_hold').length }
    ];

    const progressData = data.projects.map(project => ({
      name: project.name.substring(0, 20) + (project.name.length > 20 ? '...' : ''),
      progress: project.progress || 0,
      budget: project.budget?.total || 0
    })).slice(0, 10);

    res.json({
      success: true,
      data: {
        status: statusData,
        progress: progressData
      }
    });

  } catch (error) {
    console.error('Error fetching project chart data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/dashboard/alerts
// @desc    Get dashboard alerts and notifications
// @access  Private
router.get('/alerts', async (req, res) => {
  try {
    const data = await loadAllData();
    const alerts = [];

    // Low stock alerts
    data.inventory.forEach(item => {
      if (item.stock && item.stock.available <= item.stock.minimum) {
        alerts.push({
          type: 'warning',
          category: 'inventory',
          title: 'Low Stock Alert',
          message: `${item.name} is running low (${item.stock.available} remaining)`,
          date: new Date().toISOString()
        });
      }
    });

    // Overdue tax alerts
    const today = new Date();
    data.tax.forEach(tax => {
      if (tax.dueDate && new Date(tax.dueDate) < today && tax.status !== 'paid') {
        alerts.push({
          type: 'error',
          category: 'tax',
          title: 'Overdue Tax',
          message: `${tax.type} payment is overdue (Due: ${tax.dueDate})`,
          date: tax.dueDate
        });
      }
    });

    // Project deadline alerts
    data.projects.forEach(project => {
      if (project.timeline && project.timeline.endDate) {
        const endDate = new Date(project.timeline.endDate);
        const daysUntilDeadline = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDeadline <= 7 && daysUntilDeadline > 0 && project.status === 'in_progress') {
          alerts.push({
            type: 'warning',
            category: 'project',
            title: 'Project Deadline Approaching',
            message: `${project.name} deadline in ${daysUntilDeadline} days`,
            date: project.timeline.endDate
          });
        }
      }
    });

    // Sort alerts by priority and date
    alerts.sort((a, b) => {
      const priorityOrder = { error: 3, warning: 2, info: 1 };
      return priorityOrder[b.type] - priorityOrder[a.type] || new Date(b.date) - new Date(a.date);
    });

    res.json({
      success: true,
      data: alerts.slice(0, 20) // Limit to 20 most important alerts
    });

  } catch (error) {
    console.error('Error fetching dashboard alerts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/dashboard/statistics
 * Get financial dashboard statistics
 */
router.get('/statistics', async (req, res) => {
  try {
    // Mock statistics data - replace with actual database queries
    const statistics = {
      success: true,
      data: {
        totalRevenue: 15750000000, // 15.75 Billion
        totalExpenses: 12600000000, // 12.6 Billion
        netProfit: 3150000000, // 3.15 Billion
        totalProjects: 28,
        activeProjects: 18,
        completedProjects: 10,
        totalEmployees: 342,
        cashFlow: 2850000000, // 2.85 Billion
        assets: 45000000000, // 45 Billion
        liabilities: 18500000000, // 18.5 Billion
        equity: 26500000000, // 26.5 Billion
        profitMargin: 20.0,
        growthRate: 12.5
      }
    };
    
    res.json(statistics);
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
});

module.exports = router;
