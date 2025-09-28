const express = require('express');
const Joi = require('joi');
const { Op } = require('sequelize');
const FinanceTransaction = require('../models/FinanceTransaction');
const Project = require('../models/Project');

const router = express.Router();

// Validation schema for finance transaction
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

    console.log('DEBUG - Query params:', { type, category, startDate, endDate, projectId, subsidiaryId, sort, order, limit, page });

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
      console.log('DEBUG - Adding subsidiary filter for:', subsidiaryId);
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
      console.log('DEBUG - No subsidiary filter, including project info');
      // Include project info for response when no subsidiary filter
      includeOptions.push({
        model: Project,
        as: 'project',
        required: false,
        attributes: ['id', 'name', 'subsidiaryId']
      });
    }
    
    console.log('DEBUG - Include options:', includeOptions);

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
      updatedAt: transaction.updatedAt
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
