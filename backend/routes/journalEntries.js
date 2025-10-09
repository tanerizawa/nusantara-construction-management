/**
 * Journal Entry Routes
 * Handles double-entry bookkeeping transactions
 */

const express = require('express');
const router = express.Router();
const { models } = require('../models');
const { JournalEntry, JournalEntryLine, ChartOfAccounts } = models;
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * GET /api/journal-entries
 * Get all journal entries with pagination and filtering
 */
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      entry_type,
      project_id,
      from_date,
      to_date,
      search 
    } = req.query;

    const offset = (page - 1) * limit;
    let whereClause = {};
    
    // Filter by status
    if (status) {
      whereClause.status = status;
    }
    
    // Filter by entry type
    if (entry_type) {
      whereClause.entry_type = entry_type;
    }
    
    // Filter by project
    if (project_id) {
      whereClause.project_id = project_id;
    }
    
    // Date range filter
    if (from_date || to_date) {
      whereClause.entry_date = {};
      if (from_date) whereClause.entry_date[Op.gte] = from_date;
      if (to_date) whereClause.entry_date[Op.lte] = to_date;
    }
    
    // Search in description or entry number
    if (search) {
      whereClause[Op.or] = [
        { entry_number: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: journalEntries } = await JournalEntry.findAndCountAll({
      where: whereClause,
      order: [['entry_date', 'DESC'], ['entry_number', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      success: true,
      data: journalEntries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching journal entries',
      error: error.message
    });
  }
});

/**
 * GET /api/journal-entries/:id
 * Get single journal entry with lines
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const journalEntry = await JournalEntry.findByPk(id, {
      include: [
        {
          model: JournalEntryLine,
          as: 'lines',
          include: [
            {
              model: ChartOfAccounts,
              as: 'account',
              attributes: ['id', 'account_code', 'account_name', 'account_type', 'normal_balance']
            }
          ],
          order: [['line_number', 'ASC']]
        }
      ]
    });

    if (!journalEntry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    res.json({
      success: true,
      data: journalEntry
    });

  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching journal entry',
      error: error.message
    });
  }
});

/**
 * POST /api/journal-entries
 * Create new journal entry with lines
 */
router.post('/', async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { 
      entry_date,
      entry_type = 'GENERAL',
      description,
      reference_type,
      reference_number,
      project_id,
      subsidiary_id,
      lines,
      created_by
    } = req.body;

    // Validate required fields
    if (!entry_date || !description || !lines || !Array.isArray(lines) || lines.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: entry_date, description, and lines array'
      });
    }

    // Validate lines have debit/credit balance
    let totalDebit = 0;
    let totalCredit = 0;
    
    for (const line of lines) {
      if (!line.account_id || (!line.debit_amount && !line.credit_amount)) {
        return res.status(400).json({
          success: false,
          message: 'Each line must have account_id and either debit_amount or credit_amount'
        });
      }
      
      totalDebit += parseFloat(line.debit_amount || 0);
      totalCredit += parseFloat(line.credit_amount || 0);
    }

    // Check if entry is balanced
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;
    
    if (!isBalanced) {
      return res.status(400).json({
        success: false,
        message: `Journal entry is not balanced. Total Debit: ${totalDebit}, Total Credit: ${totalCredit}`
      });
    }

    // Generate entry number
    const today = new Date();
    const yearMonth = today.toISOString().slice(0, 7).replace('-', '');
    const sequenceResult = await sequelize.query(
      `SELECT COUNT(*) + 1 as next_seq FROM journal_entries WHERE entry_number LIKE 'JE${yearMonth}%'`,
      { type: sequelize.QueryTypes.SELECT, transaction }
    );
    const sequence = sequenceResult[0].next_seq.toString().padStart(4, '0');
    const entry_number = `JE${yearMonth}${sequence}`;

    // Create journal entry
    const journalEntry = await JournalEntry.create({
      entry_number,
      entry_date,
      entry_type,
      description,
      reference_type,
      reference_number,
      project_id,
      subsidiary_id,
      total_debit: totalDebit,
      total_credit: totalCredit,
      is_balanced: isBalanced,
      status: 'DRAFT',
      created_by
    }, { transaction });

    // Create journal entry lines
    const journalLines = await Promise.all(
      lines.map((line, index) => 
        JournalEntryLine.create({
          journal_entry_id: journalEntry.id,
          account_id: line.account_id,
          line_number: index + 1,
          description: line.description || description,
          debit_amount: parseFloat(line.debit_amount || 0),
          credit_amount: parseFloat(line.credit_amount || 0),
          project_id: line.project_id || project_id,
          cost_center: line.cost_center,
          department: line.department,
          tax_amount: parseFloat(line.tax_amount || 0),
          tax_type: line.tax_type
        }, { transaction })
      )
    );

    await transaction.commit();

    // Fetch complete entry with lines
    const completeEntry = await JournalEntry.findByPk(journalEntry.id, {
      include: [
        {
          model: JournalEntryLine,
          as: 'lines',
          include: [
            {
              model: ChartOfAccounts,
              as: 'account',
              attributes: ['id', 'account_code', 'account_name', 'account_type']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: completeEntry,
      message: 'Journal entry created successfully'
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error creating journal entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating journal entry',
      error: error.message
    });
  }
});

/**
 * PUT /api/journal-entries/:id/post
 * Post journal entry (change status to POSTED)
 */
router.put('/:id/post', async (req, res) => {
  try {
    const { id } = req.params;
    const { posted_by } = req.body;
    
    const journalEntry = await JournalEntry.findByPk(id);

    if (!journalEntry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    if (journalEntry.status !== 'DRAFT') {
      return res.status(400).json({
        success: false,
        message: 'Only draft journal entries can be posted'
      });
    }

    if (!journalEntry.is_balanced) {
      return res.status(400).json({
        success: false,
        message: 'Cannot post unbalanced journal entry'
      });
    }

    await journalEntry.update({
      status: 'POSTED',
      posted_at: new Date(),
      posted_by
    });

    res.json({
      success: true,
      data: journalEntry,
      message: 'Journal entry posted successfully'
    });

  } catch (error) {
    console.error('Error posting journal entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error posting journal entry',
      error: error.message
    });
  }
});

/**
 * DELETE /api/journal-entries/:id
 * Delete journal entry (only if status is DRAFT)
 */
router.delete('/:id', async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    const journalEntry = await JournalEntry.findByPk(id, { transaction });

    if (!journalEntry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    if (journalEntry.status === 'POSTED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete posted journal entry'
      });
    }

    // Delete lines first
    await JournalEntryLine.destroy({
      where: { journal_entry_id: id },
      transaction
    });

    // Delete journal entry
    await journalEntry.destroy({ transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Journal entry deleted successfully'
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting journal entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting journal entry',
      error: error.message
    });
  }
});

/**
 * GET /api/journal-entries/reports/trial-balance
 * Generate trial balance report
 */
router.get('/reports/trial-balance', async (req, res) => {
  try {
    const { as_of_date = new Date() } = req.query;

    const trialBalance = await sequelize.query(`
      SELECT 
        coa.account_code,
        coa.account_name,
        coa.account_type,
        coa.normal_balance,
        COALESCE(SUM(jel.debit_amount), 0) as total_debit,
        COALESCE(SUM(jel.credit_amount), 0) as total_credit,
        CASE 
          WHEN coa.normal_balance = 'DEBIT' THEN 
            COALESCE(SUM(jel.debit_amount), 0) - COALESCE(SUM(jel.credit_amount), 0)
          ELSE 
            COALESCE(SUM(jel.credit_amount), 0) - COALESCE(SUM(jel.debit_amount), 0)
        END as balance
      FROM chart_of_accounts coa
      LEFT JOIN journal_entry_lines jel ON coa.id = jel.account_id
      LEFT JOIN journal_entries je ON jel.journal_entry_id = je.id
      WHERE coa.is_active = true 
        AND (je.status = 'POSTED' OR je.id IS NULL)
        AND (je.entry_date <= :as_of_date OR je.id IS NULL)
      GROUP BY coa.id, coa.account_code, coa.account_name, coa.account_type, coa.normal_balance
      HAVING COALESCE(SUM(jel.debit_amount), 0) != 0 OR COALESCE(SUM(jel.credit_amount), 0) != 0
      ORDER BY coa.account_code
    `, {
      replacements: { as_of_date },
      type: sequelize.QueryTypes.SELECT
    });

    const summary = {
      total_debits: trialBalance.reduce((sum, row) => sum + parseFloat(row.total_debit), 0),
      total_credits: trialBalance.reduce((sum, row) => sum + parseFloat(row.total_credit), 0),
      is_balanced: true
    };
    
    summary.is_balanced = Math.abs(summary.total_debits - summary.total_credits) < 0.01;

    res.json({
      success: true,
      data: {
        as_of_date,
        accounts: trialBalance,
        summary
      }
    });

  } catch (error) {
    console.error('Error generating trial balance:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating trial balance',
      error: error.message
    });
  }
});

module.exports = router;
