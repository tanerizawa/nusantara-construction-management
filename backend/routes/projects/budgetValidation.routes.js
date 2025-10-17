/**
 * Budget Validation Routes
 * 
 * API endpoints for budget validation and monitoring
 * Base path: /api/projects/:id/budget-validation
 */

const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access :id from parent router
const budgetValidationService = require('../../services/budgetValidation.service');
const ProjectAdditionalExpense = require('../../models/ProjectAdditionalExpense');
const { verifyToken } = require('../../middleware/auth');

/**
 * @route   GET /api/projects/:id/budget-validation
 * @desc    Get comprehensive budget validation data
 * @access  Private
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const { id: projectId } = req.params;
    
    console.log(`[Budget Validation] Fetching data for project: ${projectId}`);
    
    const result = await budgetValidationService.getComprehensiveBudgetData(projectId);
    
    res.json(result);
  } catch (error) {
    console.error('[Budget Validation] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch budget validation data',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:id/budget-validation/actual-costs
 * @desc    Record actual spending for a RAB item
 * @access  Private
 */
router.post('/actual-costs', verifyToken, async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { rabItemId, quantity, unitPrice, totalAmount, poNumber, purchaseDate, notes } = req.body;
    
    // Validation
    if (!rabItemId || !quantity || !unitPrice || !totalAmount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: rabItemId, quantity, unitPrice, totalAmount'
      });
    }
    
    console.log(`[Budget Validation] Recording actual cost for RAB item: ${rabItemId}`);
    
    const result = await budgetValidationService.recordActualCost(projectId, {
      rabItemId,
      quantity: parseFloat(quantity),
      unitPrice: parseFloat(unitPrice),
      totalAmount: parseFloat(totalAmount),
      poNumber,
      purchaseDate,
      notes,
      createdBy: req.user?.username || req.user?.email
    });
    
    res.json(result);
  } catch (error) {
    console.error('[Budget Validation] Error recording actual cost:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record actual cost',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:id/budget-validation/additional-expenses
 * @desc    Add additional expense (kasbon, overtime, emergency, etc)
 * @access  Private
 */
router.post('/additional-expenses', verifyToken, async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const expenseData = req.body;
    
    // Validation
    if (!expenseData.expenseType || !expenseData.description || !expenseData.amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: expenseType, description, amount'
      });
    }
    
    console.log(`[Budget Validation] Adding additional expense: ${expenseData.expenseType}`);
    
    const result = await budgetValidationService.addAdditionalExpense(
      projectId,
      expenseData,
      req.user?.username || req.user?.email
    );
    
    res.json(result);
  } catch (error) {
    console.error('[Budget Validation] Error adding expense:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add additional expense',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/projects/:id/budget-validation/additional-expenses
 * @desc    Get all additional expenses for a project
 * @access  Private
 */
router.get('/additional-expenses', verifyToken, async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { status, type, startDate, endDate } = req.query;
    
    const whereClause = { projectId };
    
    if (status) whereClause.approvalStatus = status;
    if (type) whereClause.expenseType = type;
    
    const expenses = await ProjectAdditionalExpense.findAll({
      where: whereClause,
      order: [['expenseDate', 'DESC']]
    });
    
    res.json({
      success: true,
      data: expenses,
      count: expenses.length
    });
  } catch (error) {
    console.error('[Budget Validation] Error fetching expenses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch additional expenses',
      details: error.message
    });
  }
});

/**
 * @route   PUT /api/projects/:id/budget-validation/additional-expenses/:expenseId
 * @desc    Update additional expense
 * @access  Private
 */
router.put('/additional-expenses/:expenseId', verifyToken, async (req, res) => {
  try {
    const { expenseId } = req.params;
    const updateData = req.body;
    
    const expense = await ProjectAdditionalExpense.findByPk(expenseId);
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }
    
    // Don't allow editing approved expenses
    if (expense.approvalStatus === 'approved' && !req.user?.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Cannot edit approved expense'
      });
    }
    
    await expense.update({
      ...updateData,
      updatedBy: req.user?.username || req.user?.email
    });
    
    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    });
  } catch (error) {
    console.error('[Budget Validation] Error updating expense:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update expense',
      details: error.message
    });
  }
});

/**
 * @route   DELETE /api/projects/:id/budget-validation/additional-expenses/:expenseId
 * @desc    Delete (soft delete) additional expense
 * @access  Private
 */
router.delete('/additional-expenses/:expenseId', verifyToken, async (req, res) => {
  try {
    const { expenseId } = req.params;
    
    const expense = await ProjectAdditionalExpense.findByPk(expenseId);
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }
    
    // Don't allow deleting approved expenses
    if (expense.approvalStatus === 'approved' && !req.user?.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Cannot delete approved expense. Please reject it first.'
      });
    }
    
    await expense.destroy(); // Soft delete (paranoid mode)
    
    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    console.error('[Budget Validation] Error deleting expense:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete expense',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:id/budget-validation/additional-expenses/:expenseId/approve
 * @desc    Approve additional expense
 * @access  Private (requires approval permission)
 */
router.post('/additional-expenses/:expenseId/approve', verifyToken, async (req, res) => {
  try {
    const { expenseId } = req.params;
    
    const expense = await ProjectAdditionalExpense.findByPk(expenseId);
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }
    
    if (expense.approvalStatus === 'approved') {
      return res.status(400).json({
        success: false,
        error: 'Expense is already approved'
      });
    }
    
    await expense.approve(req.user?.username || req.user?.email);
    
    res.json({
      success: true,
      message: 'Expense approved successfully',
      data: expense
    });
  } catch (error) {
    console.error('[Budget Validation] Error approving expense:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve expense',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:id/budget-validation/additional-expenses/:expenseId/reject
 * @desc    Reject additional expense
 * @access  Private (requires approval permission)
 */
router.post('/additional-expenses/:expenseId/reject', verifyToken, async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'Rejection reason is required'
      });
    }
    
    const expense = await ProjectAdditionalExpense.findByPk(expenseId);
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }
    
    await expense.reject(req.user?.username || req.user?.email, reason);
    
    res.json({
      success: true,
      message: 'Expense rejected successfully',
      data: expense
    });
  } catch (error) {
    console.error('[Budget Validation] Error rejecting expense:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject expense',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/projects/:id/budget-validation/variance-analysis
 * @desc    Get variance analysis and budget alerts
 * @access  Private
 */
router.get('/variance-analysis', verifyToken, async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { timeframe = 'month', groupBy = 'category' } = req.query;
    
    console.log(`[Budget Validation] Generating variance analysis for project: ${projectId}`);
    
    const result = await budgetValidationService.getVarianceAnalysis(projectId, {
      timeframe,
      groupBy
    });
    
    res.json(result);
  } catch (error) {
    console.error('[Budget Validation] Error generating variance analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate variance analysis',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/projects/:id/budget-validation/summary
 * @desc    Get budget summary (quick overview)
 * @access  Private
 */
router.get('/summary', verifyToken, async (req, res) => {
  try {
    const { id: projectId } = req.params;
    
    const budgetData = await budgetValidationService.getComprehensiveBudgetData(projectId);
    
    res.json({
      success: true,
      data: {
        summary: budgetData.data.summary,
        categoryCount: budgetData.data.categoryBreakdown.length,
        rabItemCount: budgetData.data.rabItems.length,
        additionalExpenseCount: budgetData.data.additionalExpenses.length,
        lastUpdated: budgetData.data.lastUpdated
      }
    });
  } catch (error) {
    console.error('[Budget Validation] Error fetching summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch budget summary',
      details: error.message
    });
  }
});

module.exports = router;
