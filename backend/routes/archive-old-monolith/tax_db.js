const express = require('express');
const Joi = require('joi');
const { Op } = require('sequelize');
const TaxRecord = require('../models/TaxRecord');

const router = express.Router();

// Validation schema
const taxSchema = Joi.object({
  type: Joi.string().valid('pajak_penghasilan', 'ppn', 'pph21', 'pph23', 'pph4_ayat2', 'other').required(),
  amount: Joi.number().min(0).required(),
  period: Joi.string().required(), // Format: YYYY-MM
  description: Joi.string().allow('').optional(),
  status: Joi.string().valid('pending', 'paid', 'overdue').default('pending'),
  dueDate: Joi.date().optional(),
  paymentDate: Joi.date().optional(),
  taxRate: Joi.number().min(0).max(100).optional(),
  reference: Joi.string().allow('').optional()
});

// @route   GET /api/tax
// @desc    Get all tax records
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      type,
      status,
      period,
      startDate,
      endDate,
      sort = 'period',
      order = 'desc',
      limit = 50,
      page = 1
    } = req.query;

    const limitNum = Math.max(1, parseInt(limit));
    const pageNum = Math.max(1, parseInt(page));
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const whereClause = {};
    
    if (type) {
      whereClause.type = type;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (period) {
      whereClause.period = period;
    }
    
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.createdAt = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      whereClause.createdAt = {
        [Op.lte]: new Date(endDate)
      };
    }

    const { count, rows: taxes } = await TaxRecord.findAndCountAll({
      where: whereClause,
      order: [[sort, order.toUpperCase()]],
      limit: limitNum,
      offset: offset
    });

    res.json({
      success: true,
      data: taxes,
      pagination: {
        current: pageNum,
        total: Math.ceil(count / limitNum),
        count: count,
        perPage: limitNum
      }
    });
  } catch (error) {
    console.error('Error fetching tax records:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tax records',
      details: error.message
    });
  }
});

// @route   GET /api/tax/stats
// @desc    Get tax statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const { period } = req.query;
    const whereClause = period ? { period } : {};

    const stats = await TaxRecord.findAll({
      where: whereClause,
      attributes: [
        'type',
        'status',
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['type', 'status'],
      raw: true
    });

    // Calculate summary
    const summary = {
      totalAmount: 0,
      totalRecords: 0,
      byType: {},
      byStatus: {
        pending: 0,
        paid: 0,
        overdue: 0
      }
    };

    stats.forEach(stat => {
      const amount = parseFloat(stat.totalAmount) || 0;
      const count = parseInt(stat.count) || 0;
      
      summary.totalAmount += amount;
      summary.totalRecords += count;
      
      if (!summary.byType[stat.type]) {
        summary.byType[stat.type] = { amount: 0, count: 0 };
      }
      summary.byType[stat.type].amount += amount;
      summary.byType[stat.type].count += count;
      
      summary.byStatus[stat.status] += amount;
    });

    res.json({
      success: true,
      data: {
        summary,
        details: stats
      }
    });
  } catch (error) {
    console.error('Error getting tax statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get tax statistics',
      details: error.message
    });
  }
});

// @route   GET /api/tax/:id
// @desc    Get single tax record
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tax = await TaxRecord.findByPk(id);
    
    if (!tax) {
      return res.status(404).json({
        success: false,
        error: 'Tax record not found'
      });
    }

    res.json({
      success: true,
      data: tax
    });
  } catch (error) {
    console.error('Error fetching tax record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tax record',
      details: error.message
    });
  }
});

// @route   POST /api/tax
// @desc    Create new tax record
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { error, value } = taxSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details
      });
    }

    // Generate ID
    const taxCount = await TaxRecord.count();
    const taxId = `TAX${String(taxCount + 1).padStart(3, '0')}`;

    const tax = await TaxRecord.create({
      id: taxId,
      ...value
    });

    res.status(201).json({
      success: true,
      data: tax,
      message: 'Tax record created successfully'
    });
  } catch (error) {
    console.error('Error creating tax record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create tax record',
      details: error.message
    });
  }
});

// @route   PUT /api/tax/:id
// @desc    Update tax record
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const tax = await TaxRecord.findByPk(id);
    if (!tax) {
      return res.status(404).json({
        success: false,
        error: 'Tax record not found'
      });
    }

    const updateSchema = taxSchema.fork(
      ['type', 'amount', 'period'],
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

    await tax.update(value);

    res.json({
      success: true,
      data: tax,
      message: 'Tax record updated successfully'
    });
  } catch (error) {
    console.error('Error updating tax record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update tax record',
      details: error.message
    });
  }
});

// @route   DELETE /api/tax/:id
// @desc    Delete tax record
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const tax = await TaxRecord.findByPk(id);
    if (!tax) {
      return res.status(404).json({
        success: false,
        error: 'Tax record not found'
      });
    }

    await tax.destroy();

    res.json({
      success: true,
      message: 'Tax record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tax record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete tax record',
      details: error.message
    });
  }
});

module.exports = router;
