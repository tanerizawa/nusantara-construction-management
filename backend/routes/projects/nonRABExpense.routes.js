const express = require('express');
const router = express.Router();
const NonRABExpense = require('../../models/NonRABExpense');

/**
 * @route   GET /api/projects/:projectId/non-rab-expenses
 * @desc    Get all non-RAB expenses for a project
 * @access  Private
 */
router.get('/:projectId/non-rab-expenses', async (req, res) => {
  try {
    const { projectId } = req.params;

    const expenses = await NonRABExpense.findAll({
      where: { projectId },
      order: [['date', 'DESC'], ['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: expenses
    });
  } catch (error) {
    console.error('Error fetching non-RAB expenses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch non-RAB expenses',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:projectId/non-rab-expenses
 * @desc    Create new non-RAB expense
 * @access  Private
 */
router.post('/:projectId/non-rab-expenses', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { date, category, description, amount, vendor, notes } = req.body;

    // Validation
    if (!date || !category || !description || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: date, category, description, amount'
      });
    }

    const expense = await NonRABExpense.create({
      projectId,
      date,
      category,
      description,
      amount: parseFloat(amount),
      vendor,
      notes,
      createdBy: req.user?.id
    });

    res.status(201).json({
      success: true,
      message: 'Pengeluaran berhasil dicatat',
      data: expense
    });
  } catch (error) {
    console.error('Error creating non-RAB expense:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create non-RAB expense',
      details: error.message
    });
  }
});

/**
 * @route   PUT /api/projects/:projectId/non-rab-expenses/:expenseId
 * @desc    Update non-RAB expense
 * @access  Private
 */
router.put('/:projectId/non-rab-expenses/:expenseId', async (req, res) => {
  try {
    const { projectId, expenseId } = req.params;
    const { date, category, description, amount, vendor, notes } = req.body;

    const expense = await NonRABExpense.findOne({
      where: { id: expenseId, projectId }
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    await expense.update({
      date: date || expense.date,
      category: category || expense.category,
      description: description || expense.description,
      amount: amount !== undefined ? parseFloat(amount) : expense.amount,
      vendor: vendor !== undefined ? vendor : expense.vendor,
      notes: notes !== undefined ? notes : expense.notes
    });

    res.json({
      success: true,
      message: 'Pengeluaran berhasil diupdate',
      data: expense
    });
  } catch (error) {
    console.error('Error updating non-RAB expense:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update non-RAB expense',
      details: error.message
    });
  }
});

/**
 * @route   DELETE /api/projects/:projectId/non-rab-expenses/:expenseId
 * @desc    Delete non-RAB expense (soft delete)
 * @access  Private
 */
router.delete('/:projectId/non-rab-expenses/:expenseId', async (req, res) => {
  try {
    const { projectId, expenseId } = req.params;

    const expense = await NonRABExpense.findOne({
      where: { id: expenseId, projectId }
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    await expense.destroy(); // Soft delete

    res.json({
      success: true,
      message: 'Pengeluaran berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting non-RAB expense:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete non-RAB expense',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/projects/:projectId/non-rab-expenses/summary
 * @desc    Get summary of non-RAB expenses
 * @access  Private
 */
router.get('/:projectId/non-rab-expenses/summary', async (req, res) => {
  try {
    const { projectId } = req.params;

    const expenses = await NonRABExpense.findAll({
      where: { projectId },
      attributes: ['category', 'amount']
    });

    const summary = {
      total: 0,
      byCategory: {}
    };

    expenses.forEach(expense => {
      const amount = parseFloat(expense.amount);
      summary.total += amount;
      
      if (!summary.byCategory[expense.category]) {
        summary.byCategory[expense.category] = 0;
      }
      summary.byCategory[expense.category] += amount;
    });

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching non-RAB expenses summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch summary',
      details: error.message
    });
  }
});

module.exports = router;
