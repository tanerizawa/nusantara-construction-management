const express = require('express');
const { Op } = require('sequelize');
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
    // Generate unique ID for new account
    const generateAccountId = async () => {
      const lastAccount = await ChartOfAccounts.findOne({
        order: [['id', 'DESC']],
        where: {
          id: {
            [Op.like]: 'COA-%'
          }
        }
      });
      
      let nextNumber = 1001;
      if (lastAccount && lastAccount.id) {
        const lastNumber = parseInt(lastAccount.id.replace('COA-', ''));
        nextNumber = lastNumber + 1;
      }
      
      return `COA-${nextNumber}`;
    };

    // Calculate level based on parent
    let level = 1;
    if (req.body.parentAccountId) {
      const parent = await ChartOfAccounts.findByPk(req.body.parentAccountId);
      if (parent) {
        level = parent.level + 1;
      }
    }

    const accountData = {
      ...req.body,
      id: await generateAccountId(),
      level: level,
      isActive: true,
      isControlAccount: false
    };

    const account = await ChartOfAccounts.create(accountData);
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

// @route   DELETE /api/coa/:id
// @desc    Delete account (soft delete)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const account = await ChartOfAccounts.findByPk(req.params.id);
    
    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found'
      });
    }

    // Check if account has sub-accounts
    const hasSubAccounts = await ChartOfAccounts.findOne({
      where: { parentAccountId: req.params.id, isActive: true }
    });

    if (hasSubAccounts) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete account with active sub-accounts'
      });
    }

    // Soft delete by setting isActive to false
    await account.update({ isActive: false });

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete account'
    });
  }
});

// @route   GET /api/coa/cash/accounts
// @desc    Get all cash and bank accounts with balances for transaction form
// @access  Private
router.get('/cash/accounts', async (req, res) => {
  try {
    // Get all active cash and bank accounts
    const cashAccounts = await ChartOfAccounts.findAll({
      where: { 
        accountSubType: 'CASH_AND_BANK',
        isActive: true,
        level: {
          [Op.gte]: 3  // Level 3 or higher (detail accounts)
        }
      },
      order: [['accountCode', 'ASC']]
    });

    // Format for transaction form dropdown
    const formattedAccounts = cashAccounts.map(account => ({
      id: account.id,
      code: account.accountCode,
      name: account.accountName,
      balance: parseFloat(account.currentBalance || 0),
      type: account.accountSubType,
      // Display format: "Bank BCA (1101.01) - Rp 1.091.000.000"
      displayName: `${account.accountName} (${account.accountCode})`,
      formattedBalance: new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(account.currentBalance || 0)
    }));

    res.json({
      success: true,
      data: formattedAccounts,
      count: formattedAccounts.length
    });

  } catch (error) {
    console.error('Error fetching cash accounts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cash accounts',
      error: error.message
    });
  }
});

// @route   PUT /api/coa/:id
// @desc    Update account
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const account = await ChartOfAccounts.findByPk(req.params.id);
    
    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found'
      });
    }

    // Update account with new data
    await account.update(req.body);

    res.json({
      success: true,
      data: account
    });
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update account'
    });
  }
});

module.exports = router;
