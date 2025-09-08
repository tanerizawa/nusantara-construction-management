const express = require('express');
const ChartOfAccounts = require('../models/ChartOfAccounts');

const router = express.Router();

// @route   GET /api/coa
// @desc    Get all chart of accounts with hierarchy
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { level, type, constructionOnly } = req.query;
    
    let whereClause = { isActive: true };
    
    if (level) {
      whereClause.level = level;
    }
    
    if (type) {
      whereClause.accountType = type.toUpperCase();
    }
    
    if (constructionOnly === 'true') {
      whereClause.constructionSpecific = true;
    }

    const accounts = await ChartOfAccounts.findAll({
      where: whereClause,
      order: [['accountCode', 'ASC']],
      include: [
        {
          model: ChartOfAccounts,
          as: 'SubAccounts',
          where: { isActive: true },
          required: false
        },
        {
          model: ChartOfAccounts,
          as: 'ParentAccount',
          required: false
        }
      ]
    });

    res.json({
      success: true,
      data: accounts
    });
  } catch (error) {
    console.error('Error fetching chart of accounts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chart of accounts'
    });
  }
});

// @route   GET /api/coa/hierarchy
// @desc    Get COA in hierarchical structure
// @access  Private
router.get('/hierarchy', async (req, res) => {
  try {
    const accounts = await ChartOfAccounts.findAll({
      where: { isActive: true, level: 1 },
      order: [['accountCode', 'ASC']],
      include: [
        {
          model: ChartOfAccounts,
          as: 'SubAccounts',
          where: { isActive: true },
          required: false,
          include: [
            {
              model: ChartOfAccounts,
              as: 'SubAccounts',
              where: { isActive: true },
              required: false,
              include: [
                {
                  model: ChartOfAccounts,
                  as: 'SubAccounts',
                  where: { isActive: true },
                  required: false
                }
              ]
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      data: accounts
    });
  } catch (error) {
    console.error('Error fetching COA hierarchy:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch COA hierarchy'
    });
  }
});

// @route   POST /api/coa
// @desc    Create new account
// @access  Private
router.post('/', async (req, res) => {
  try {
    const account = await ChartOfAccounts.create(req.body);
    res.status(201).json({
      success: true,
      data: account
    });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create account'
    });
  }
});

module.exports = router;
