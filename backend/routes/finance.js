const express = require('express');
const Joi = require('joi');
const { Op } = require('sequelize');
const FinanceTransaction = require('../models/FinanceTransaction');
const Project = require('../models/Project');
const PurchaseOrder = require('../models/PurchaseOrder');
const FinancialIntegrationService = require('../services/FinancialIntegrationService');

const router = express.Router();

// Validation schemas
const transactionSchema = Joi.object({
  type: Joi.string().valid('income', 'expense', 'transfer').required(),
  category: Joi.string().required(),
  subcategory: Joi.string().allow('').optional(),
  amount: Joi.number().min(0).required(),
  description: Joi.string().allow('').optional(),
  date: Joi.date().default(new Date()),
  projectId: Joi.string().allow('').optional(),
  accountFrom: Joi.string().allow('').optional(),
  accountTo: Joi.string().allow('').optional(),
  paymentMethod: Joi.string().valid('cash', 'bank_transfer', 'check', 'credit_card', 'other').default('bank_transfer'),
  referenceNumber: Joi.string().allow('').optional(),
  notes: Joi.string().allow('').optional()
});

// @route   GET /api/finance
// @desc    Get all financial transactions
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      type,
      category,
      startDate,
      endDate,
      projectId,
      subsidiaryId,
      sort = 'date',
      order = 'desc',
      limit = 50,
      page = 1
    } = req.query;

    const limitNum = Math.max(1, parseInt(limit));
    const pageNum = Math.max(1, parseInt(page));
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const whereClause = {};
    const includeOptions = [];
    
    if (type) {
      whereClause.type = type;
    }
    
    if (category) {
      whereClause.category = category;
    }
    
    if (projectId) {
      whereClause.projectId = projectId;
    }
    
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) {
        whereClause.date[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.date[Op.lte] = new Date(endDate);
      }
    }

    // Handle subsidiary filter through project relationship
    if (subsidiaryId) {
      includeOptions.push({
        model: Project,
        as: 'project',
        where: {
          subsidiaryId: subsidiaryId
        },
        required: true, // Only transactions with projects from this subsidiary
        attributes: ['id', 'name', 'subsidiaryId']
      });
    } else {
      // Include project info for response when no subsidiary filter
      includeOptions.push({
        model: Project,
        as: 'project',
        required: false,
        attributes: ['id', 'name', 'subsidiaryId']
      });
    }

    // Always include PurchaseOrder data if linked
    includeOptions.push({
      model: PurchaseOrder,
      as: 'purchaseOrder',
      required: false,
      attributes: ['id', 'poNumber', 'supplierName', 'status', 'totalAmount']
    });

    // Build order clause
    const validSortFields = ['date', 'amount', 'type', 'category'];
    const sortField = validSortFields.includes(sort) ? sort : 'date';
    const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    // Get transactions from database
    const { count, rows: transactions } = await FinanceTransaction.findAndCountAll({
      where: whereClause,
      include: includeOptions,
      order: [[sortField, sortOrder]],
      limit: limitNum,
      offset: offset
    });

    // Calculate totals with same filters
    const totals = await FinanceTransaction.findAll({
      where: whereClause,
      include: subsidiaryId ? [{
        model: Project,
        as: 'project',
        where: {
          subsidiaryId: subsidiaryId
        },
        required: true,
        attributes: []
      }] : [],
      attributes: [
        'type',
        [FinanceTransaction.sequelize.fn('SUM', FinanceTransaction.sequelize.col('amount')), 'total']
      ],
      group: ['type']
    });

    const summary = totals.reduce((acc, item) => {
      acc[item.type] = parseFloat(item.dataValues.total || 0);
      return acc;
    }, { income: 0, expense: 0, transfer: 0 });

    summary.balance = summary.income - summary.expense;

    // Transform data for API response
    const transformedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      type: transaction.type,
      amount: parseFloat(transaction.amount),
      desc: transaction.description,
      date: transaction.date,
      category: transaction.category,
      subcategory: transaction.subcategory,
      projectId: transaction.projectId,
      paymentMethod: transaction.paymentMethod,
      referenceNumber: transaction.referenceNumber,
      status: transaction.status,
      notes: transaction.notes,
      metadata: transaction.metadata,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      // Include project and purchaseOrder data for subsidiary info
      project: transaction.project ? {
        id: transaction.project.id,
        name: transaction.project.name,
        subsidiaryId: transaction.project.subsidiaryId,
        status: transaction.project.status
      } : null,
      purchaseOrder: transaction.purchaseOrder ? {
        id: transaction.purchaseOrder.id,
        poNumber: transaction.purchaseOrder.poNumber,
        supplierName: transaction.purchaseOrder.supplierName,
        status: transaction.purchaseOrder.status,
        totalAmount: parseFloat(transaction.purchaseOrder.totalAmount)
      } : null
    }));

    const totalPages = Math.ceil(count / limitNum);

    res.json({
      success: true,
      data: transformedTransactions,
      summary,
      pagination: {
        current: pageNum,
        total: totalPages,
        count: count,
        perPage: limitNum
      }
    });
  } catch (error) {
    console.error('Error fetching finance transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch finance transactions',
      details: error.message
    });
  }
});

// @route   GET /api/finance/reports
// @desc    Get comprehensive financial reports (Income Statement, Balance Sheet, Cash Flow) with REAL data integration
// @access  Private
router.get('/reports', async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      projectId,
      subsidiary_id
    } = req.query;

    // Use FinancialIntegrationService to get REAL data from progress_payments, milestone_costs, and COA
    const filters = {
      startDate: startDate || null,
      endDate: endDate || null,
      subsidiaryId: subsidiary_id && subsidiary_id !== 'all' ? subsidiary_id : null,
      projectId: projectId && projectId !== 'all' ? projectId : null
    };

    const realFinancialData = await FinancialIntegrationService.getDashboardOverview(filters);
    
    // Extract data from service response
    const realData = realFinancialData.success ? realFinancialData.data : {
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      totalCash: 0,
      cashAccounts: []
    };

    // Also get manual transactions from finance_transactions table
    const whereClause = {};
    
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) {
        whereClause.date[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.date[Op.lte] = new Date(endDate);
      }
    }

    if (projectId && projectId !== 'all') {
      whereClause.projectId = projectId;
    }

    // Get manual transactions
    const manualTransactions = await FinanceTransaction.findAll({
      where: whereClause,
      include: [
        {
          model: Project,
          as: 'project',
          required: false,
          attributes: ['id', 'name', 'subsidiaryId', 'status']
        },
        {
          model: PurchaseOrder,
          as: 'purchaseOrder',
          required: false,
          attributes: ['id', 'poNumber', 'status', 'totalAmount']
        }
      ],
      order: [['date', 'DESC']]
    });

    // Filter manual transactions by subsidiary if specified
    let filteredManualTransactions = manualTransactions;
    if (subsidiary_id && subsidiary_id !== 'all') {
      filteredManualTransactions = manualTransactions.filter(transaction => 
        transaction.project && transaction.project.subsidiaryId === subsidiary_id
      );
    }

    // Calculate manual transaction totals
    const manualTotals = filteredManualTransactions.reduce((acc, transaction) => {
      const type = transaction.type;
      const amount = parseFloat(transaction.amount);

      if (!acc[type]) {
        acc[type] = { total: 0, count: 0 };
      }

      acc[type].total += amount;
      acc[type].count += 1;

      return acc;
    }, {});

    // ✅ REAL Income Statement from project data + manual transactions
    const incomeStatement = {
      revenue: realData.totalRevenue + (manualTotals.income?.total || 0),
      directCosts: realData.totalExpenses,
      grossProfit: 0,
      indirectCosts: manualTotals.expense?.total || 0, // Manual expenses as indirect costs
      netIncome: 0,
      breakdown: {
        projectRevenue: realData.totalRevenue,
        manualRevenue: manualTotals.income?.total || 0,
        projectExpenses: realData.totalExpenses,
        manualExpenses: manualTotals.expense?.total || 0
      }
    };

    incomeStatement.grossProfit = incomeStatement.revenue - incomeStatement.directCosts;
    incomeStatement.netIncome = incomeStatement.grossProfit - incomeStatement.indirectCosts;

    // ✅ REAL Balance Sheet from COA data
    const balanceSheet = {
      totalAssets: realData.totalCash, // Current assets from COA
      currentAssets: realData.totalCash,
      fixedAssets: 0, // Can be extended with fixed asset tracking
      totalLiabilities: 0, // Can be extended with liability tracking
      totalEquity: realData.totalCash, // Simplified: Assets - Liabilities
      cashAccounts: realData.cashAccounts || []
    };

    // ✅ REAL Cash Flow from actual transactions
    const operatingCashFlow = incomeStatement.netIncome;
    const investingCashFlow = 0; // Can be extended with investment tracking
    const financingCashFlow = 0; // Can be extended with financing tracking
    const netCashChange = operatingCashFlow + investingCashFlow + financingCashFlow;

    const cashFlow = {
      // Standard format
      operatingCashFlow,
      investingCashFlow,
      financingCashFlow,
      netCashChange,
      beginningCash: realData.totalCash,
      endingCash: realData.totalCash + netCashChange,
      // Frontend aliases (for compatibility)
      operating: operatingCashFlow,
      investing: investingCashFlow,
      financing: financingCashFlow,
      netCashFlow: netCashChange,
      endingBalance: realData.totalCash + netCashChange
    };

    // Summary statistics
    const summary = {
      totalTransactions: filteredManualTransactions.length,
      totalIncome: incomeStatement.revenue,
      totalExpense: incomeStatement.directCosts + incomeStatement.indirectCosts,
      netBalance: incomeStatement.netIncome,
      balance: incomeStatement.netIncome, // Alias for frontend
      projectTransactions: filteredManualTransactions.filter(t => t.project).length,
      poTransactions: filteredManualTransactions.filter(t => t.purchaseOrder).length,
      realDataSource: {
        progressPayments: 'progress_payments table',
        milestoneCosts: 'milestone_costs table',
        chartOfAccounts: 'chart_of_accounts table',
        manualTransactions: 'finance_transactions table'
      },
      period: {
        start: startDate || 'Beginning',
        end: endDate || 'Current'
      }
    };

    res.json({
      success: true,
      data: {
        incomeStatement,
        balanceSheet,
        cashFlow,
        summary,
        realData: true, // Flag indicating this uses real data
        dataSource: 'integrated' // Uses FinancialIntegrationService
      }
    });
  } catch (error) {
    console.error('Error generating financial reports:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate financial reports',
      details: error.message
    });
  }
});

// @route   GET /api/finance/reports/income-statement
// @desc    Get detailed income statement
// @access  Private  
router.get('/reports/income-statement', async (req, res) => {
  try {
    const { startDate, endDate, projectId } = req.query;
    
    const whereClause = {};
    
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date[Op.gte] = new Date(startDate);
      if (endDate) whereClause.date[Op.lte] = new Date(endDate);
    }
    
    if (projectId) whereClause.projectId = projectId;

    const transactions = await FinanceTransaction.findAll({
      where: whereClause,
      order: [['date', 'DESC']]
    });

    // Group by category for detailed breakdown
    const breakdown = transactions.reduce((acc, transaction) => {
      const type = transaction.type;
      const category = transaction.category;
      const amount = parseFloat(transaction.amount);

      if (!acc[type]) acc[type] = {};
      if (!acc[type][category]) acc[type][category] = 0;
      acc[type][category] += amount;

      return acc;
    }, {});

    const revenue = Object.values(breakdown.income || {}).reduce((sum, val) => sum + val, 0);
    const expenses = Object.values(breakdown.expense || {}).reduce((sum, val) => sum + val, 0);

    res.json({
      success: true,
      data: {
        revenue,
        expenses,
        netIncome: revenue - expenses,
        breakdown,
        transactions: transactions.length
      }
    });
  } catch (error) {
    console.error('Error generating income statement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate income statement'
    });
  }
});

// @route   GET /api/finance/project-integration
// @desc    Get integrated project finance data
// @access  Private
router.get('/project-integration', async (req, res) => {
  try {
    const { subsidiaryId, projectId } = req.query;

    // Build project filter
    const projectWhereClause = {};
    if (subsidiaryId && subsidiaryId !== 'all') {
      projectWhereClause.subsidiaryId = subsidiaryId;
    }
    if (projectId && projectId !== 'all') {
      projectWhereClause.id = projectId;
    }

    // Fetch projects with their transactions
    const projects = await Project.findAll({
      where: projectWhereClause,
      include: [
        {
          model: FinanceTransaction,
          as: 'transactions',
          include: [
            {
              model: PurchaseOrder,
              as: 'purchaseOrder',
              required: false,
              attributes: ['id', 'poNumber', 'supplierName', 'status', 'totalAmount']
            }
          ]
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    // Build transaction filter for non-project transactions
    const transactionWhereClause = {};
    if (subsidiaryId && subsidiaryId !== 'all') {
      // Include project transactions via join
    } else {
      // Get all transactions
    }

    // Fetch all relevant transactions
    const allTransactions = await FinanceTransaction.findAll({
      where: projectId && projectId !== 'all' ? { projectId } : {},
      include: [
        {
          model: Project,
          as: 'project',
          required: false,
          where: subsidiaryId && subsidiaryId !== 'all' ? { subsidiaryId } : {},
          attributes: ['id', 'name', 'subsidiaryId']
        },
        {
          model: PurchaseOrder,
          as: 'purchaseOrder',
          required: false,
          attributes: ['id', 'poNumber', 'supplierName', 'status', 'totalAmount']
        }
      ],
      order: [['date', 'DESC']],
      limit: 1000
    });

    // Calculate project summaries
    const projectSummaries = projects.map(project => {
      const projectTransactions = project.transactions || [];
      
      const totalIncome = projectTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const totalExpense = projectTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const poTransactions = projectTransactions.filter(t => t.purchaseOrderId);

      return {
        projectId: project.id,
        projectName: project.name,
        subsidiaryId: project.subsidiaryId,
        totalIncome,
        totalExpense,
        netIncome: totalIncome - totalExpense,
        poCount: poTransactions.length, // Changed from poTransactions to poCount
        poTransactions: poTransactions.length, // Keep both for compatibility
        transactionCount: projectTransactions.length,
        lastTransaction: projectTransactions[0]?.date || null
      };
    });

    // Calculate overall metrics
    const totalIncome = allTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const totalExpense = allTransactions
      .filter(t => t.type === 'expense')  
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const poTransactions = allTransactions.filter(t => t.purchaseOrderId);
    const totalPOAmount = poTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // Group by subsidiary
    const subsidiaryBreakdown = {};
    projects.forEach(project => {
      const subsidiaryId = project.subsidiaryId || 'general';
      if (!subsidiaryBreakdown[subsidiaryId]) {
        subsidiaryBreakdown[subsidiaryId] = {
          projects: 0,
          income: 0,
          expense: 0,
          transactions: 0
        };
      }
      
      const summary = projectSummaries.find(s => s.projectId === project.id);
      if (summary) {
        subsidiaryBreakdown[subsidiaryId].projects += 1;
        subsidiaryBreakdown[subsidiaryId].income += summary.totalIncome;
        subsidiaryBreakdown[subsidiaryId].expense += summary.totalExpense;
        subsidiaryBreakdown[subsidiaryId].transactions += summary.transactionCount;
      }
    });

    const response = {
      success: true,
      data: {
        projects: projects.map(p => ({
          id: p.id,
          name: p.name,
          status: p.status,
          subsidiaryId: p.subsidiaryId,
          transactionCount: p.transactions?.length || 0
        })),
        transactions: allTransactions.map(t => ({
          id: t.id,
          type: t.type,
          category: t.category,
          amount: t.amount,
          description: t.description,
          date: t.date,
          projectId: t.projectId,
          purchaseOrderId: t.purchaseOrderId,
          purchaseOrder: t.purchaseOrder,
          project: t.project
        })),
        projectSummaries,
        metrics: {
          overview: {
            totalProjects: projects.length,
            activeProjects: projects.filter(p => p.status === 'active').length,
            totalIncome,
            totalExpense,
            netIncome: totalIncome - totalExpense,
            totalTransactions: allTransactions.length,
            poTransactions: poTransactions.length,
            totalPOAmount
          },
          projectBreakdown: projectSummaries,
          subsidiaryBreakdown,
          recentActivity: allTransactions.slice(0, 10)
        }
      },
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching integrated project finance data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch integrated project finance data',
      details: error.message
    });
  }
});

// @route   GET /api/finance/:id
// @desc    Get single transaction by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await FinanceTransaction.findByPk(id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction',
      details: error.message
    });
  }
});

// @route   POST /api/finance
// @desc    Create new transaction
// @access  Private
router.post('/', async (req, res) => {
  try {
    // Validate input
    const { error, value } = transactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details
      });
    }

    // Generate transaction ID
    const transactionCount = await FinanceTransaction.count();
    const transactionId = `FIN-${String(transactionCount + 1).padStart(4, '0')}`;

    // Create transaction
    const transaction = await FinanceTransaction.create({
      id: transactionId,
      ...value
    });

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction created successfully'
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create transaction',
      details: error.message
    });
  }
});

// @route   PUT /api/finance/:id
// @desc    Update transaction
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find transaction
    const transaction = await FinanceTransaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // Validate input (make fields optional for update)
    const updateSchema = transactionSchema.fork(
      ['type', 'category', 'amount'],
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

    // Update transaction
    await transaction.update(value);

    res.json({
      success: true,
      data: transaction,
      message: 'Transaction updated successfully'
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update transaction',
      details: error.message
    });
  }
});

// @route   DELETE /api/finance/:id
// @desc    Delete transaction
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await FinanceTransaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    await transaction.destroy();

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete transaction',
      details: error.message
    });
  }
});

// @route   GET /api/finance/stats/summary
// @desc    Get financial summary statistics
// @access  Private
router.get('/stats/summary', async (req, res) => {
  try {
    const { startDate, endDate, projectId } = req.query;

    // Build where clause
    const whereClause = {};
    if (projectId) {
      whereClause.projectId = projectId;
    }
    
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) {
        whereClause.date[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.date[Op.lte] = new Date(endDate);
      }
    }

    // Get totals by type
    const totals = await FinanceTransaction.findAll({
      where: whereClause,
      attributes: [
        'type',
        [FinanceTransaction.sequelize.fn('SUM', FinanceTransaction.sequelize.col('amount')), 'total'],
        [FinanceTransaction.sequelize.fn('COUNT', FinanceTransaction.sequelize.col('id')), 'count']
      ],
      group: ['type']
    });

    // Get totals by category
    const categories = await FinanceTransaction.findAll({
      where: whereClause,
      attributes: [
        'category',
        'type',
        [FinanceTransaction.sequelize.fn('SUM', FinanceTransaction.sequelize.col('amount')), 'total']
      ],
      group: ['category', 'type']
    });

    const summary = {
      totals: totals.reduce((acc, item) => {
        acc[item.type] = {
          total: parseFloat(item.dataValues.total || 0),
          count: parseInt(item.dataValues.count || 0)
        };
        return acc;
      }, { income: { total: 0, count: 0 }, expense: { total: 0, count: 0 }, transfer: { total: 0, count: 0 } }),
      categories: categories.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = {};
        }
        acc[item.category][item.type] = parseFloat(item.dataValues.total || 0);
        return acc;
      }, {}),
      balance: 0
    };

    summary.balance = summary.totals.income.total - summary.totals.expense.total;

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching finance stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch finance statistics',
      details: error.message
    });
  }
});

module.exports = router;
