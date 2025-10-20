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
  accountFrom: Joi.string().allow('').optional(),  // COA account ID for expense/transfer
  accountTo: Joi.string().allow('').optional(),    // COA account ID for income/transfer
  paymentMethod: Joi.string().valid('cash', 'bank_transfer', 'check', 'credit_card', 'debit_card', 'other').optional(),  // Legacy field, now optional
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
  const t = await FinanceTransaction.sequelize.transaction();
  
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

    console.log('[Finance] Creating transaction:', value);

    // Validate required accounts based on transaction type
    if (value.type === 'income' && !value.accountTo) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'accountTo (bank/cash account) is required for income transactions'
      });
    }

    if (value.type === 'expense' && !value.accountFrom) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'accountFrom (bank/cash account) is required for expense transactions'
      });
    }

    if (value.type === 'transfer' && (!value.accountFrom || !value.accountTo)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'Both accountFrom and accountTo are required for transfer transactions'
      });
    }

    // Load Chart of Accounts model
    const ChartOfAccounts = require('../models/ChartOfAccounts');

    // Generate transaction ID
    const transactionCount = await FinanceTransaction.count();
    const transactionId = `FIN-${String(transactionCount + 1).padStart(4, '0')}`;

    // Create transaction record
    const transaction = await FinanceTransaction.create({
      id: transactionId,
      ...value
    }, { transaction: t });

    console.log('[Finance] Transaction record created:', transactionId);

    // Update account balances based on transaction type
    const amount = parseFloat(value.amount);

    if (value.type === 'income') {
      // Income: DEBIT bank account (increase), CREDIT revenue account (automatic)
      const bankAccount = await ChartOfAccounts.findByPk(value.accountTo, { transaction: t });
      
      if (bankAccount) {
        const currentBalance = parseFloat(bankAccount.currentBalance || 0);
        const newBalance = currentBalance + amount;
        
        await bankAccount.update({
          currentBalance: newBalance
        }, { transaction: t });
        
        console.log('[Finance] ✅ Bank account updated:', {
          accountId: bankAccount.id,
          accountCode: bankAccount.accountCode,
          accountName: bankAccount.accountName,
          oldBalance: currentBalance,
          newBalance: newBalance,
          change: `+${amount}`
        });
      } else {
        console.warn('[Finance] ⚠️ Bank account not found:', value.accountTo);
      }
    } else if (value.type === 'expense') {
      // Expense: CREDIT bank account (decrease), DEBIT expense account (automatic)
      const bankAccount = await ChartOfAccounts.findByPk(value.accountFrom, { transaction: t });
      
      if (bankAccount) {
        const currentBalance = parseFloat(bankAccount.currentBalance || 0);
        const newBalance = currentBalance - amount;
        
        if (newBalance < 0) {
          await t.rollback();
          return res.status(400).json({
            success: false,
            error: 'Insufficient balance',
            details: `Account ${bankAccount.accountCode} - ${bankAccount.accountName} has insufficient balance`
          });
        }
        
        await bankAccount.update({
          currentBalance: newBalance
        }, { transaction: t });
        
        console.log('[Finance] ✅ Bank account updated:', {
          accountId: bankAccount.id,
          accountCode: bankAccount.accountCode,
          accountName: bankAccount.accountName,
          oldBalance: currentBalance,
          newBalance: newBalance,
          change: `-${amount}`
        });
      } else {
        console.warn('[Finance] ⚠️ Bank account not found:', value.accountFrom);
      }
    } else if (value.type === 'transfer') {
      // Transfer: CREDIT source account (decrease), DEBIT destination account (increase)
      const sourceAccount = await ChartOfAccounts.findByPk(value.accountFrom, { transaction: t });
      const destAccount = await ChartOfAccounts.findByPk(value.accountTo, { transaction: t });
      
      if (sourceAccount && destAccount) {
        const sourceBalance = parseFloat(sourceAccount.currentBalance || 0);
        const destBalance = parseFloat(destAccount.currentBalance || 0);
        
        if (sourceBalance < amount) {
          await t.rollback();
          return res.status(400).json({
            success: false,
            error: 'Insufficient balance',
            details: `Source account ${sourceAccount.accountCode} has insufficient balance`
          });
        }
        
        await sourceAccount.update({
          currentBalance: sourceBalance - amount
        }, { transaction: t });
        
        await destAccount.update({
          currentBalance: destBalance + amount
        }, { transaction: t });
        
        console.log('[Finance] ✅ Transfer completed:', {
          from: `${sourceAccount.accountCode} - ${sourceAccount.accountName}`,
          to: `${destAccount.accountCode} - ${destAccount.accountName}`,
          amount: amount,
          sourceNewBalance: sourceBalance - amount,
          destNewBalance: destBalance + amount
        });
      } else {
        console.warn('[Finance] ⚠️ Transfer accounts not found:', {
          from: value.accountFrom,
          to: value.accountTo
        });
      }
    }

    // Commit transaction
    await t.commit();

    console.log('[Finance] ✅ Transaction completed successfully:', transactionId);

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction created successfully and account balances updated'
    });
  } catch (error) {
    await t.rollback();
    console.error('[Finance] ❌ Error creating transaction:', error);
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
  const t = await FinanceTransaction.sequelize.transaction();
  
  try {
    const { id } = req.params;

    // Find transaction
    const transaction = await FinanceTransaction.findByPk(id, { transaction: t });
    if (!transaction) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // ✅ VALIDATION: Only DRAFT/PENDING can be edited
    if (!transaction.canEdit()) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: `Cannot edit transaction with status: ${transaction.status}`,
        hint: 'Only DRAFT or PENDING transactions can be edited. Use VOID or REVERSE for posted transactions.',
        allowedActions: transaction.canVoid() ? ['void', 'reverse'] : []
      });
    }

    // Validate input (make fields optional for update)
    const updateSchema = transactionSchema.fork(
      ['type', 'category', 'amount'],
      (schema) => schema.optional()
    );
    
    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details
      });
    }

    console.log('[Finance] Updating transaction:', id, value);

    const ChartOfAccounts = require('../models/ChartOfAccounts');
    
    // Reverse old balance changes
    const oldAmount = parseFloat(transaction.amount);
    const oldType = transaction.type;
    const oldAccountFrom = transaction.accountFrom;
    const oldAccountTo = transaction.accountTo;

    if (oldType === 'income' && oldAccountTo) {
      const account = await ChartOfAccounts.findByPk(oldAccountTo, { transaction: t });
      if (account) {
        await account.update({
          currentBalance: parseFloat(account.currentBalance) - oldAmount
        }, { transaction: t });
        console.log('[Finance] Reversed income balance:', oldAccountTo);
      }
    } else if (oldType === 'expense' && oldAccountFrom) {
      const account = await ChartOfAccounts.findByPk(oldAccountFrom, { transaction: t });
      if (account) {
        await account.update({
          currentBalance: parseFloat(account.currentBalance) + oldAmount
        }, { transaction: t });
        console.log('[Finance] Reversed expense balance:', oldAccountFrom);
      }
    } else if (oldType === 'transfer' && oldAccountFrom && oldAccountTo) {
      const sourceAccount = await ChartOfAccounts.findByPk(oldAccountFrom, { transaction: t });
      const destAccount = await ChartOfAccounts.findByPk(oldAccountTo, { transaction: t });
      if (sourceAccount && destAccount) {
        await sourceAccount.update({
          currentBalance: parseFloat(sourceAccount.currentBalance) + oldAmount
        }, { transaction: t });
        await destAccount.update({
          currentBalance: parseFloat(destAccount.currentBalance) - oldAmount
        }, { transaction: t });
        console.log('[Finance] Reversed transfer balance');
      }
    }

    // Update transaction
    await transaction.update(value, { transaction: t });

    // Apply new balance changes
    const newAmount = parseFloat(value.amount || transaction.amount);
    const newType = value.type || transaction.type;
    const newAccountFrom = value.accountFrom || transaction.accountFrom;
    const newAccountTo = value.accountTo || transaction.accountTo;

    if (newType === 'income' && newAccountTo) {
      const account = await ChartOfAccounts.findByPk(newAccountTo, { transaction: t });
      if (account) {
        await account.update({
          currentBalance: parseFloat(account.currentBalance) + newAmount
        }, { transaction: t });
        console.log('[Finance] Applied new income balance:', newAccountTo);
      }
    } else if (newType === 'expense' && newAccountFrom) {
      const account = await ChartOfAccounts.findByPk(newAccountFrom, { transaction: t });
      if (account) {
        const newBalance = parseFloat(account.currentBalance) - newAmount;
        if (newBalance < 0) {
          await t.rollback();
          return res.status(400).json({
            success: false,
            error: 'Insufficient balance after update'
          });
        }
        await account.update({
          currentBalance: newBalance
        }, { transaction: t });
        console.log('[Finance] Applied new expense balance:', newAccountFrom);
      }
    } else if (newType === 'transfer' && newAccountFrom && newAccountTo) {
      const sourceAccount = await ChartOfAccounts.findByPk(newAccountFrom, { transaction: t });
      const destAccount = await ChartOfAccounts.findByPk(newAccountTo, { transaction: t });
      if (sourceAccount && destAccount) {
        const newSourceBalance = parseFloat(sourceAccount.currentBalance) - newAmount;
        if (newSourceBalance < 0) {
          await t.rollback();
          return res.status(400).json({
            success: false,
            error: 'Insufficient balance in source account'
          });
        }
        await sourceAccount.update({
          currentBalance: newSourceBalance
        }, { transaction: t });
        await destAccount.update({
          currentBalance: parseFloat(destAccount.currentBalance) + newAmount
        }, { transaction: t });
        console.log('[Finance] Applied new transfer balance');
      }
    }

    await t.commit();

    res.json({
      success: true,
      data: transaction,
      message: 'Transaction updated successfully and balances adjusted'
    });
  } catch (error) {
    await t.rollback();
    console.error('[Finance] Error updating transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update transaction',
      details: error.message
    });
  }
});

// @route   DELETE /api/finance/:id
// @desc    Delete transaction (only DRAFT/PENDING)
// @access  Private
router.delete('/:id', async (req, res) => {
  const t = await FinanceTransaction.sequelize.transaction();
  
  try {
    const { id } = req.params;

    const transaction = await FinanceTransaction.findByPk(id, { transaction: t });
    if (!transaction) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // ✅ VALIDATION: Only DRAFT/PENDING can be deleted
    if (!transaction.canDelete()) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: `Cannot delete transaction with status: ${transaction.status}`,
        hint: 'Only DRAFT or PENDING transactions can be deleted. Use VOID for posted transactions.',
        allowedActions: transaction.canVoid() ? ['void'] : []
      });
    }

    console.log('[Finance] Deleting transaction:', id);

    const ChartOfAccounts = require('../models/ChartOfAccounts');
    
    // Reverse balance changes before deleting
    const amount = parseFloat(transaction.amount);
    const type = transaction.type;
    const accountFrom = transaction.accountFrom;
    const accountTo = transaction.accountTo;

    if (type === 'income' && accountTo) {
      // Reverse income: decrease bank balance
      const account = await ChartOfAccounts.findByPk(accountTo, { transaction: t });
      if (account) {
        await account.update({
          currentBalance: parseFloat(account.currentBalance) - amount
        }, { transaction: t });
        console.log('[Finance] Reversed income balance on delete:', accountTo);
      }
    } else if (type === 'expense' && accountFrom) {
      // Reverse expense: increase bank balance
      const account = await ChartOfAccounts.findByPk(accountFrom, { transaction: t });
      if (account) {
        await account.update({
          currentBalance: parseFloat(account.currentBalance) + amount
        }, { transaction: t });
        console.log('[Finance] Reversed expense balance on delete:', accountFrom);
      }
    } else if (type === 'transfer' && accountFrom && accountTo) {
      // Reverse transfer
      const sourceAccount = await ChartOfAccounts.findByPk(accountFrom, { transaction: t });
      const destAccount = await ChartOfAccounts.findByPk(accountTo, { transaction: t });
      if (sourceAccount && destAccount) {
        await sourceAccount.update({
          currentBalance: parseFloat(sourceAccount.currentBalance) + amount
        }, { transaction: t });
        await destAccount.update({
          currentBalance: parseFloat(destAccount.currentBalance) - amount
        }, { transaction: t });
        console.log('[Finance] Reversed transfer balance on delete');
      }
    }

    await transaction.destroy({ transaction: t });
    await t.commit();

    console.log('[Finance] ✅ Transaction deleted and balances reversed');

    res.json({
      success: true,
      message: 'Transaction deleted successfully and balances reversed'
    });
  } catch (error) {
    await t.rollback();
    console.error('[Finance] Error deleting transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete transaction',
      details: error.message
    });
  }
});

// @route   POST /api/finance/:id/void
// @desc    Void a posted transaction (cancels it, reverses balance)
// @access  Private
router.post('/:id/void', async (req, res) => {
  const t = await FinanceTransaction.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { reason, voidedBy } = req.body;

    // Validate reason is provided
    if (!reason || reason.trim() === '') {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'Void reason is required for audit trail'
      });
    }

    // Find transaction
    const transaction = await FinanceTransaction.findByPk(id, { transaction: t });
    if (!transaction) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // ✅ VALIDATION: Check if can be voided
    if (!transaction.canVoid()) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: `Cannot void transaction with status: ${transaction.status}`,
        hint: transaction.isReversed ? 
          'Transaction has already been reversed' : 
          'Only APPROVED/POSTED/COMPLETED transactions can be voided'
      });
    }

    console.log('[Finance] Voiding transaction:', id, '- Reason:', reason);

    const ChartOfAccounts = require('../models/ChartOfAccounts');
    const amount = parseFloat(transaction.amount);
    const type = transaction.type;
    const accountFrom = transaction.accountFrom;
    const accountTo = transaction.accountTo;

    // Reverse balance changes
    if (type === 'income' && accountTo) {
      const account = await ChartOfAccounts.findByPk(accountTo, { transaction: t });
      if (account) {
        await account.update({
          currentBalance: parseFloat(account.currentBalance) - amount
        }, { transaction: t });
        console.log('[Finance] Reversed income balance on void:', accountTo);
      }
    } else if (type === 'expense' && accountFrom) {
      const account = await ChartOfAccounts.findByPk(accountFrom, { transaction: t });
      if (account) {
        await account.update({
          currentBalance: parseFloat(account.currentBalance) + amount
        }, { transaction: t });
        console.log('[Finance] Reversed expense balance on void:', accountFrom);
      }
    } else if (type === 'transfer' && accountFrom && accountTo) {
      const sourceAccount = await ChartOfAccounts.findByPk(accountFrom, { transaction: t });
      const destAccount = await ChartOfAccounts.findByPk(accountTo, { transaction: t });
      if (sourceAccount && destAccount) {
        await sourceAccount.update({
          currentBalance: parseFloat(sourceAccount.currentBalance) + amount
        }, { transaction: t });
        await destAccount.update({
          currentBalance: parseFloat(destAccount.currentBalance) - amount
        }, { transaction: t });
        console.log('[Finance] Reversed transfer balance on void');
      }
    }

    // Update transaction status to VOIDED
    await transaction.update({
      status: 'voided',
      voidDate: new Date(),
      voidBy: voidedBy || 'system',
      voidReason: reason
    }, { transaction: t });

    await t.commit();

    console.log('[Finance] ✅ Transaction voided successfully');

    res.json({
      success: true,
      message: 'Transaction voided successfully and balances reversed',
      data: transaction
    });
  } catch (error) {
    await t.rollback();
    console.error('[Finance] Error voiding transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to void transaction',
      details: error.message
    });
  }
});

// @route   POST /api/finance/:id/reverse
// @desc    Reverse a posted transaction and create corrected entry
// @access  Private
router.post('/:id/reverse', async (req, res) => {
  const t = await FinanceTransaction.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { reason, correctedData, reversedBy } = req.body;

    // Validate inputs
    if (!reason || reason.trim() === '') {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'Reversal reason is required for audit trail'
      });
    }

    if (!correctedData) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'Corrected transaction data is required'
      });
    }

    // Find original transaction
    const originalTransaction = await FinanceTransaction.findByPk(id, { transaction: t });
    if (!originalTransaction) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'Original transaction not found'
      });
    }

    // ✅ VALIDATION: Check if can be reversed
    if (!originalTransaction.canReverse()) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: `Cannot reverse transaction with status: ${originalTransaction.status}`,
        hint: originalTransaction.isReversed ? 
          'Transaction has already been reversed' : 
          'Only POSTED transactions can be reversed'
      });
    }

    console.log('[Finance] Reversing transaction:', id, '- Reason:', reason);

    const ChartOfAccounts = require('../models/ChartOfAccounts');
    const amount = parseFloat(originalTransaction.amount);
    const type = originalTransaction.type;
    const accountFrom = originalTransaction.accountFrom;
    const accountTo = originalTransaction.accountTo;

    // STEP 1: Create reversal entry (opposite of original)
    const reversalId = `FIN-REV-${Date.now()}`;
    let reversalData = {
      id: reversalId,
      type: type,
      category: originalTransaction.category,
      subcategory: originalTransaction.subcategory,
      amount: amount,
      description: `REVERSAL: ${originalTransaction.description} (Reason: ${reason})`,
      date: new Date(),
      projectId: originalTransaction.projectId,
      status: 'posted',
      reversalOfTransactionId: originalTransaction.id
    };

    // Swap accounts for reversal
    if (type === 'income') {
      reversalData.accountFrom = accountTo;  // Reverse: debit from where it was credited
      reversalData.accountTo = null;
    } else if (type === 'expense') {
      reversalData.accountFrom = null;
      reversalData.accountTo = accountFrom;  // Reverse: credit back to where it was debited
    } else if (type === 'transfer') {
      reversalData.accountFrom = accountTo;   // Swap source and destination
      reversalData.accountTo = accountFrom;
    }

    const reversalTransaction = await FinanceTransaction.create(reversalData, { transaction: t });

    // Apply reversal balance changes
    if (type === 'income' && accountTo) {
      const account = await ChartOfAccounts.findByPk(accountTo, { transaction: t });
      if (account) {
        await account.update({
          currentBalance: parseFloat(account.currentBalance) - amount
        }, { transaction: t });
      }
    } else if (type === 'expense' && accountFrom) {
      const account = await ChartOfAccounts.findByPk(accountFrom, { transaction: t });
      if (account) {
        await account.update({
          currentBalance: parseFloat(account.currentBalance) + amount
        }, { transaction: t });
      }
    } else if (type === 'transfer' && accountFrom && accountTo) {
      const sourceAccount = await ChartOfAccounts.findByPk(accountFrom, { transaction: t });
      const destAccount = await ChartOfAccounts.findByPk(accountTo, { transaction: t });
      if (sourceAccount && destAccount) {
        await sourceAccount.update({
          currentBalance: parseFloat(sourceAccount.currentBalance) + amount
        }, { transaction: t });
        await destAccount.update({
          currentBalance: parseFloat(destAccount.currentBalance) - amount
        }, { transaction: t });
      }
    }

    // STEP 2: Mark original as reversed
    await originalTransaction.update({
      isReversed: true,
      reversedByTransactionId: reversalTransaction.id,
      status: 'reversed'
    }, { transaction: t });

    // STEP 3: Create new corrected transaction
    const correctedId = `FIN-${Date.now()}`;
    const correctedTransaction = await FinanceTransaction.create({
      ...correctedData,
      id: correctedId,
      description: `CORRECTED: ${correctedData.description || originalTransaction.description} (Original: ${originalTransaction.id})`,
      status: 'posted',
      date: new Date()
    }, { transaction: t });

    // Apply corrected transaction balance changes
    const newAmount = parseFloat(correctedTransaction.amount);
    const newType = correctedTransaction.type;
    const newAccountFrom = correctedTransaction.accountFrom;
    const newAccountTo = correctedTransaction.accountTo;

    if (newType === 'income' && newAccountTo) {
      const account = await ChartOfAccounts.findByPk(newAccountTo, { transaction: t });
      if (account) {
        await account.update({
          currentBalance: parseFloat(account.currentBalance) + newAmount
        }, { transaction: t });
      }
    } else if (newType === 'expense' && newAccountFrom) {
      const account = await ChartOfAccounts.findByPk(newAccountFrom, { transaction: t });
      if (account) {
        const newBalance = parseFloat(account.currentBalance) - newAmount;
        if (newBalance < 0) {
          await t.rollback();
          return res.status(400).json({
            success: false,
            error: 'Insufficient balance',
            details: `Account ${account.accountName} would have negative balance: ${newBalance}`
          });
        }
        await account.update({ currentBalance: newBalance }, { transaction: t });
      }
    } else if (newType === 'transfer' && newAccountFrom && newAccountTo) {
      const sourceAccount = await ChartOfAccounts.findByPk(newAccountFrom, { transaction: t });
      const destAccount = await ChartOfAccounts.findByPk(newAccountTo, { transaction: t });
      if (sourceAccount && destAccount) {
        const newSourceBalance = parseFloat(sourceAccount.currentBalance) - newAmount;
        if (newSourceBalance < 0) {
          await t.rollback();
          return res.status(400).json({
            success: false,
            error: 'Insufficient balance in source account',
            details: `Account ${sourceAccount.accountName} would have negative balance: ${newSourceBalance}`
          });
        }
        await sourceAccount.update({ currentBalance: newSourceBalance }, { transaction: t });
        await destAccount.update({
          currentBalance: parseFloat(destAccount.currentBalance) + newAmount
        }, { transaction: t });
      }
    }

    await t.commit();

    console.log('[Finance] ✅ Transaction reversed and corrected successfully');

    res.json({
      success: true,
      message: 'Transaction reversed and corrected successfully',
      data: {
        original: originalTransaction,
        reversal: reversalTransaction,
        corrected: correctedTransaction
      }
    });
  } catch (error) {
    await t.rollback();
    console.error('[Finance] Error reversing transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reverse transaction',
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
