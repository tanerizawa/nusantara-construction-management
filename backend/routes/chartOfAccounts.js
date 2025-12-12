/**
 * Chart of Accounts Routes
 * Handles PSAK-compliant Chart of Accounts management
 */

const express = require('express');
const router = express.Router();
const { models } = require('../models');
const { ChartOfAccounts } = models;
const { Op } = require('sequelize');
const AccountCodeGenerator = require('../services/accountCodeGenerator');
const {
  getAllTemplates,
  getTemplateById,
  getTemplatesByType,
  getQuickStartTemplates
} = require('../config/accountTemplates');

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
      search,
      transactional_only  // NEW: Filter untuk hanya akun transaksional
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
    
    // Filter by parent account ID
    if (parent_code) {
      whereClause.parentAccountId = parent_code;
    }
    
    // Search in account name or code
    if (search) {
      whereClause[Op.or] = [
        { account_code: { [Op.iLike]: `%${search}%` } },
        { account_name: { [Op.iLike]: `%${search}%` } }
      ];
    }

    let accounts = await ChartOfAccounts.findAll({
      where: whereClause,
      order: [['account_code', 'ASC']]
    });

    // NEW: Filter untuk hanya akun transaksional (yang tidak memiliki child)
    // Ini dilakukan setelah query karena perlu cek relasi parent-child
    if (transactional_only === 'true') {
      const accountIds = accounts.map(acc => acc.id);
      
      // Cari semua akun yang menjadi parent (memiliki child)
      const parentsWithChildren = await ChartOfAccounts.findAll({
        where: {
          parentAccountId: {  // FIXED: Gunakan camelCase seperti di model
            [Op.in]: accountIds
          }
        },
        attributes: ['parentAccountId'],
        raw: true
      });
      
      const parentIds = parentsWithChildren.map(p => p.parentAccountId);
      
      console.log('[COA] Transactional filter - Found parent accounts:', parentIds.length);
      
      // Filter out akun yang memiliki child
      accounts = accounts.filter(acc => !parentIds.includes(acc.id));
    }

    console.log(`[COA] GET accounts - Filters:`, {
      account_type,
      transactional_only,
      level,
      total: accounts.length
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
    const { include_balances } = req.query;
    
    const accounts = await ChartOfAccounts.findAll({
      where: { is_active: true },
      order: [['account_code', 'ASC']]
    });

    // Get account balances if requested
    let accountBalances = {};
    if (include_balances === 'true') {
      try {
        const { JournalEntryLine, JournalEntry } = models;
        
        const balanceResults = await JournalEntryLine.findAll({
          attributes: [
            'accountId',
            [models.sequelize.fn('SUM', models.sequelize.col('debit_amount')), 'totalDebit'],
            [models.sequelize.fn('SUM', models.sequelize.col('credit_amount')), 'totalCredit']
          ],
          include: [{
            model: JournalEntry,
            attributes: [],
            where: { status: 'posted' }
          }],
          group: ['accountId'],
          raw: true
        });

        balanceResults.forEach(result => {
          const debit = parseFloat(result.totalDebit) || 0;
          const credit = parseFloat(result.totalCredit) || 0;
          accountBalances[result.accountId] = {
            debit,
            credit,
            balance: debit - credit
          };
        });
      } catch (balanceError) {
        console.warn('Could not fetch balances:', balanceError.message);
      }
    }

    // Build hierarchy
    const accountMap = {};
    const rootAccounts = [];

    // First pass: create map with balances
    accounts.forEach(account => {
      const balance = accountBalances[account.id] || { debit: 0, credit: 0, balance: 0 };
      accountMap[account.accountCode] = {
        ...account.toJSON(),
        ...balance,
        children: []
      };
    });

    // Second pass: build hierarchy
    accounts.forEach(account => {
      const parentId = account.parentAccountId;
      if (parentId) {
        // Find parent by ID
        const parent = accounts.find(acc => acc.id === parentId);
        if (parent && accountMap[parent.accountCode]) {
          accountMap[parent.accountCode].children.push(accountMap[account.accountCode]);
        }
      } else {
        rootAccounts.push(accountMap[account.accountCode]);
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
 * GET /api/chart-of-accounts/transactional
 * Get only transactional accounts (non-control accounts) for forms/dropdowns
 * This excludes parent/control accounts like "Kas & Bank" and only shows actual accounts like "Bank BCA", "Kas Kecil"
 */
router.get('/transactional', async (req, res) => {
  try {
    const { account_type, account_sub_type } = req.query;

    let whereClause = {
      is_active: true,
      is_control_account: false,
      level: {
        [Op.gte]: 3  // Only level 3 and above (transactional accounts)
      }
    };

    // Filter by account type if provided
    if (account_type) {
      whereClause.account_type = account_type;
    }

    // Filter by sub-type if provided
    if (account_sub_type) {
      whereClause.account_sub_type = account_sub_type;
    }

    const accounts = await ChartOfAccounts.findAll({
      where: whereClause,
      order: [['account_code', 'ASC']]
    });

    console.log(`[COA] GET transactional accounts:`, {
      filters: { account_type, account_sub_type },
      total: accounts.length
    });

    // Format for dropdown display
    const formattedAccounts = accounts.map(account => ({
      id: account.id,
      accountCode: account.accountCode,
      accountName: account.accountName,
      accountType: account.accountType,
      accountSubType: account.accountSubType,
      level: account.level,
      currentBalance: parseFloat(account.currentBalance || 0),
      normalBalance: account.normalBalance,
      // Display format: "Bank BCA (1101.02) - Rp 1.000.000"
      displayName: `${account.accountName} (${account.accountCode})`,
      displayWithBalance: `${account.accountName} (${account.accountCode}) - ${new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(account.currentBalance || 0)}`
    }));

    res.json({
      success: true,
      data: formattedAccounts,
      count: formattedAccounts.length,
      message: 'Transactional accounts only (excludes control/parent accounts)'
    });

  } catch (error) {
    console.error('Error fetching transactional accounts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transactional accounts',
      error: error.message
    });
  }
});

/**
 * GET /api/chart-of-accounts/cash/accounts
 * Get all cash and bank accounts with balances for transaction form
 */
router.get('/cash/accounts', async (req, res) => {
  try {
    // Get all active cash and bank accounts (only child accounts level 4+, not parent level 3)
    const cashAccounts = await ChartOfAccounts.findAll({
      where: { 
        accountSubType: 'CASH_AND_BANK',
        isActive: true,
        level: { [Op.gt]: 3 } // Only level 4 and above (exclude parent "1101 - Kas & Bank" which is level 3)
      },
      order: [['accountCode', 'ASC']]
    });

    // Format for transaction form dropdown
    const formattedAccounts = cashAccounts.map(account => ({
      id: account.id,
      code: account.accountCode,
      name: account.accountName,
      balance: parseFloat(account.currentBalance || 0),
      type: account.accountType,
      level: account.level,
      // Display format: "Bank BCA (1101.03) - Rp 1.091.000.000"
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
 * PUT /api/chart-of-accounts/:idOrCode
 * Update account
 * Accepts either account ID (COA-xxx) or account code (1000)
 */
router.put('/:idOrCode', async (req, res) => {
  try {
    const { idOrCode } = req.params;
    const updateData = req.body;
    
    console.log('[COA UPDATE] Looking for account:', idOrCode);
    
    // Try to find by ID first, then by account_code
    let account = await ChartOfAccounts.findOne({
      where: { id: idOrCode }
    });
    
    if (!account) {
      account = await ChartOfAccounts.findOne({
        where: { account_code: idOrCode }
      });
    }

    if (!account) {
      console.log('[COA UPDATE] Account not found:', idOrCode);
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    console.log('[COA UPDATE] Found account:', account.id, account.account_code);

    // Prevent changing account code
    delete updateData.account_code;
    delete updateData.id;

    await account.update(updateData);

    console.log('[COA UPDATE] Account updated successfully:', account.account_code);

    res.json({
      success: true,
      data: account,
      message: 'Account updated successfully'
    });

  } catch (error) {
    console.error('[COA UPDATE] Error updating account:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating account',
      error: error.message
    });
  }
});

/**
 * DELETE /api/chart-of-accounts/:idOrCode
 * Soft delete account (set is_active to false)
 * Accepts either account ID (COA-xxx) or account code (1000)
 */
router.delete('/:idOrCode', async (req, res) => {
  try {
    const { idOrCode } = req.params;
    
    console.log('[COA DELETE] Looking for account:', idOrCode);
    
    // Try to find by ID first, then by account_code
    let account = await ChartOfAccounts.findOne({
      where: { id: idOrCode }
    });
    
    if (!account) {
      account = await ChartOfAccounts.findOne({
        where: { account_code: idOrCode }
      });
    }

    if (!account) {
      console.log('[COA DELETE] Account not found:', idOrCode);
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    console.log('[COA DELETE] Found account:', account.id, account.account_code);

    // Check if account has child accounts (by parent_account_id)
    const childAccounts = await ChartOfAccounts.findAll({
      where: { 
        parent_account_id: account.id,
        is_active: true 
      }
    });

    if (childAccounts.length > 0) {
      console.log('[COA DELETE] Account has', childAccounts.length, 'child accounts');
      return res.status(400).json({
        success: false,
        message: `Cannot delete account with ${childAccounts.length} active child accounts`
      });
    }

    // Soft delete
    await account.update({ is_active: false });

    console.log('[COA DELETE] Account deactivated successfully:', account.account_code);

    res.json({
      success: true,
      data: account,
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('[COA DELETE] Error deleting account:', error);
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

/**
 * POST /api/chart-of-accounts/generate-code
 * Generate next available account code
 */
router.post('/generate-code', async (req, res) => {
  try {
    const { accountType, parentId, level } = req.body;

    console.log('[COA] Generate code request:', { accountType, parentId, level });

    // Validate required fields
    if (!accountType || !level) {
      return res.status(400).json({
        success: false,
        error: 'accountType and level are required'
      });
    }

    // Generate code
    const result = await AccountCodeGenerator.generateNextCode({
      accountType,
      parentId,
      level: parseInt(level)
    });

    // Get suggested properties
    const properties = AccountCodeGenerator.suggestAccountProperties(
      result.suggestedCode,
      accountType
    );

    res.json({
      success: true,
      data: {
        ...result,
        suggestedProperties: properties
      }
    });

  } catch (error) {
    console.error('[COA] Error generating code:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/chart-of-accounts/templates
 * Get all account templates
 */
router.get('/templates', async (req, res) => {
  try {
    const { type, quick_start } = req.query;

    let templates;

    if (quick_start === 'true') {
      templates = getQuickStartTemplates();
    } else if (type) {
      templates = getTemplatesByType(type);
    } else {
      templates = getAllTemplates();
    }

    res.json({
      success: true,
      data: templates,
      count: templates.length
    });

  } catch (error) {
    console.error('[COA] Error fetching templates:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/chart-of-accounts/templates/:templateId
 * Get specific template by ID
 */
router.get('/templates/:templateId', async (req, res) => {
  try {
    const { templateId } = req.params;
    const template = getTemplateById(templateId);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    res.json({
      success: true,
      data: template
    });

  } catch (error) {
    console.error('[COA] Error fetching template:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/chart-of-accounts/bulk-create-template
 * Bulk create accounts from template
 */
router.post('/bulk-create-template', async (req, res) => {
  try {
    const { templateId, subsidiaryId } = req.body;

    if (!templateId) {
      return res.status(400).json({
        success: false,
        error: 'templateId is required'
      });
    }

    const template = getTemplateById(templateId);
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    const createdAccounts = [];
    const errors = [];

    // Create each account from template
    for (const accountTemplate of template.accounts) {
      try {
        // Check if account code already exists
        const existing = await ChartOfAccounts.findOne({
          where: { accountCode: accountTemplate.code }
        });

        if (existing) {
          errors.push({
            code: accountTemplate.code,
            name: accountTemplate.name,
            error: 'Account code already exists'
          });
          continue;
        }

        // Create account
        const account = await ChartOfAccounts.create({
          id: `COA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          accountCode: accountTemplate.code,
          accountName: accountTemplate.name,
          accountType: template.category,
          accountSubType: accountTemplate.subType,
          level: accountTemplate.code.includes('.') ? 4 : 3,
          normalBalance: accountTemplate.normalBalance,
          isActive: accountTemplate.isActive !== false,
          isControlAccount: accountTemplate.isControlAccount || false,
          constructionSpecific: accountTemplate.constructionSpecific || false,
          projectCostCenter: accountTemplate.projectCostCenter || false,
          taxDeductible: accountTemplate.taxDeductible || false,
          description: accountTemplate.description,
          subsidiaryId: subsidiaryId || null,
          currentBalance: 0
        });

        createdAccounts.push(account);

      } catch (error) {
        errors.push({
          code: accountTemplate.code,
          name: accountTemplate.name,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      data: {
        created: createdAccounts.length,
        accounts: createdAccounts,
        errors: errors.length > 0 ? errors : undefined
      }
    });

  } catch (error) {
    console.error('[COA] Error bulk creating from template:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/chart-of-accounts/smart-create
 * Smart account creation with auto-code generation
 */
router.post('/smart-create', async (req, res) => {
  try {
    const {
      accountName,
      accountType,
      parentId,
      level,
      openingBalance,
      subsidiaryId,
      description
    } = req.body;

    console.log('[COA] Smart create request:', req.body);

    // Validate required fields
    if (!accountName || !accountType || !level) {
      return res.status(400).json({
        success: false,
        error: 'accountName, accountType, and level are required'
      });
    }

    // Generate code
    const codeResult = await AccountCodeGenerator.generateNextCode({
      accountType,
      parentId,
      level: parseInt(level)
    });

    // Get suggested properties
    const properties = AccountCodeGenerator.suggestAccountProperties(
      codeResult.suggestedCode,
      accountType
    );

    // Determine parent account ID from code
    let finalParentId = parentId;
    if (!finalParentId && level > 1) {
      // Try to find parent by code pattern
      const parentCode = level === 4 
        ? codeResult.suggestedCode.split('.')[0]
        : codeResult.suggestedCode.substring(0, level);
      
      const parent = await ChartOfAccounts.findOne({
        where: { accountCode: parentCode }
      });

      if (parent) {
        finalParentId = parent.id;
      }
    }

    // Create account
    const account = await ChartOfAccounts.create({
      id: `COA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      accountCode: codeResult.suggestedCode,
      accountName: accountName.trim(),
      accountType,
      accountSubType: properties.accountSubType || null,
      parentAccountId: finalParentId || null,
      level: parseInt(level),
      normalBalance: properties.normalBalance,
      isActive: true,
      isControlAccount: properties.isControlAccount,
      constructionSpecific: properties.constructionSpecific,
      projectCostCenter: properties.projectCostCenter,
      vatApplicable: properties.vatApplicable,
      taxDeductible: properties.taxDeductible,
      description: description || null,
      subsidiaryId: subsidiaryId || null,
      currentBalance: parseFloat(openingBalance) || 0
    });

    console.log('[COA] Account created successfully:', account.accountCode);

    res.json({
      success: true,
      data: account,
      message: `Account ${account.accountCode} - ${account.accountName} created successfully`
    });

  } catch (error) {
    console.error('[COA] Error creating account:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/chart-of-accounts/available-parents
 * Get available parent accounts for given type and level
 */
router.get('/available-parents', async (req, res) => {
  try {
    const { accountType, level } = req.query;

    if (!accountType || !level) {
      return res.status(400).json({
        success: false,
        error: 'accountType and level are required'
      });
    }

    const parents = await AccountCodeGenerator.getAvailableParents(
      accountType,
      parseInt(level)
    );

    res.json({
      success: true,
      data: parents,
      count: parents.length
    });

  } catch (error) {
    console.error('[COA] Error fetching available parents:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/chart-of-accounts/:idOrCode
 * Get single account by ID or code
 * Accepts either account ID (COA-xxx) or account code (1000)
 * NOTE: This route must be LAST because it's a catch-all parameter route
 */
router.get('/:idOrCode', async (req, res) => {
  try {
    const { idOrCode } = req.params;
    
    console.log('[COA GET] Looking for account:', idOrCode);
    
    // Try to find by ID first, then by account_code
    let account = await ChartOfAccounts.findOne({
      where: { id: idOrCode }
    });
    
    if (!account) {
      account = await ChartOfAccounts.findOne({
        where: { account_code: idOrCode }
      });
    }

    if (!account) {
      console.log('[COA GET] Account not found:', idOrCode);
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    console.log('[COA GET] Found account:', account.id, account.account_code);

    res.json({
      success: true,
      data: account
    });

  } catch (error) {
    console.error('[COA GET] Error fetching account:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching account',
      error: error.message
    });
  }
});

module.exports = router;
