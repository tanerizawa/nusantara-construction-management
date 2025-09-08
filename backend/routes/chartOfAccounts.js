/**
 * Chart of Accounts Routes
 * Handles PSAK-compliant Chart of Accounts management
 */

const express = require('express');
const router = express.Router();
const { models } = require('../models');
const { ChartOfAccounts } = models;
const { Op } = require('sequelize');

/**
 * GET /api/chart-of-accounts
 * Get all accounts with optional filtering
 */
router.get('/', async (req, res) => {
  try {
    const { 
      account_type, 
      level, 
      is_active, 
      parent_code,
      search 
    } = req.query;

    let whereClause = {};
    
    // Filter by account type
    if (account_type) {
      whereClause.account_type = account_type;
    }
    
    // Filter by level
    if (level) {
      whereClause.level = parseInt(level);
    }
    
    // Filter by active status
    if (is_active !== undefined) {
      whereClause.is_active = is_active === 'true';
    }
    
    // Filter by parent code
    if (parent_code) {
      whereClause.parent_code = parent_code;
    }
    
    // Search in account name or code
    if (search) {
      whereClause[Op.or] = [
        { account_code: { [Op.iLike]: `%${search}%` } },
        { account_name: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const accounts = await ChartOfAccounts.findAll({
      where: whereClause,
      order: [['account_code', 'ASC']]
    });

    res.json({
      success: true,
      data: accounts,
      count: accounts.length
    });

  } catch (error) {
    console.error('Error fetching chart of accounts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chart of accounts',
      error: error.message
    });
  }
});

/**
 * GET /api/chart-of-accounts/hierarchy
 * Get accounts in hierarchical structure
 */
router.get('/hierarchy', async (req, res) => {
  try {
    const accounts = await ChartOfAccounts.findAll({
      where: { is_active: true },
      order: [['account_code', 'ASC']]
    });

    // Build hierarchy
    const accountMap = {};
    const rootAccounts = [];

    // First pass: create map
    accounts.forEach(account => {
      accountMap[account.account_code] = {
        ...account.toJSON(),
        children: []
      };
    });

    // Second pass: build hierarchy
    accounts.forEach(account => {
      if (account.parent_code && accountMap[account.parent_code]) {
        accountMap[account.parent_code].children.push(accountMap[account.account_code]);
      } else {
        rootAccounts.push(accountMap[account.account_code]);
      }
    });

    res.json({
      success: true,
      data: rootAccounts
    });

  } catch (error) {
    console.error('Error fetching account hierarchy:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching account hierarchy',
      error: error.message
    });
  }
});

/**
 * GET /api/chart-of-accounts/:code
 * Get single account by code
 */
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const account = await ChartOfAccounts.findOne({
      where: { account_code: code }
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    res.json({
      success: true,
      data: account
    });

  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching account',
      error: error.message
    });
  }
});

/**
 * POST /api/chart-of-accounts
 * Create new account
 */
router.post('/', async (req, res) => {
  try {
    const accountData = req.body;
    
    // Validate required fields
    const requiredFields = ['account_code', 'account_name', 'account_type', 'level'];
    const missingFields = requiredFields.filter(field => !accountData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Check if account code already exists
    const existingAccount = await ChartOfAccounts.findOne({
      where: { account_code: accountData.account_code }
    });

    if (existingAccount) {
      return res.status(409).json({
        success: false,
        message: 'Account code already exists'
      });
    }

    const newAccount = await ChartOfAccounts.create(accountData);

    res.status(201).json({
      success: true,
      data: newAccount,
      message: 'Account created successfully'
    });

  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating account',
      error: error.message
    });
  }
});

/**
 * PUT /api/chart-of-accounts/:code
 * Update account
 */
router.put('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const updateData = req.body;
    
    const account = await ChartOfAccounts.findOne({
      where: { account_code: code }
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    // Prevent changing account code
    delete updateData.account_code;

    await account.update(updateData);

    res.json({
      success: true,
      data: account,
      message: 'Account updated successfully'
    });

  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating account',
      error: error.message
    });
  }
});

/**
 * DELETE /api/chart-of-accounts/:code
 * Soft delete account (set is_active to false)
 */
router.delete('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const account = await ChartOfAccounts.findOne({
      where: { account_code: code }
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    // Check if account has child accounts
    const childAccounts = await ChartOfAccounts.findAll({
      where: { 
        parent_code: code,
        is_active: true 
      }
    });

    if (childAccounts.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete account with active child accounts'
      });
    }

    // Soft delete
    await account.update({ is_active: false });

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
      error: error.message
    });
  }
});

/**
 * GET /api/chart-of-accounts/types/summary
 * Get account count by type
 */
router.get('/types/summary', async (req, res) => {
  try {
    const summary = await ChartOfAccounts.findAll({
      attributes: [
        'account_type',
        [ChartOfAccounts.sequelize.fn('COUNT', ChartOfAccounts.sequelize.col('account_code')), 'count']
      ],
      where: { is_active: true },
      group: ['account_type'],
      order: [['account_type', 'ASC']]
    });

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Error fetching account type summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching account type summary',
      error: error.message
    });
  }
});

module.exports = router;
