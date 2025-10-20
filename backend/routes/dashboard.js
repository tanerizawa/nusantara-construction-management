const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/auth');

/**
 * Dashboard Routes
 * All routes require authentication
 */

/**
 * @route   GET /api/dashboard/summary
 * @desc    Get dashboard summary statistics
 * @access  Private
 */
router.get('/summary', verifyToken, dashboardController.getDashboardSummary);

/**
 * @route   GET /api/dashboard/pending-approvals
 * @desc    Get all pending approvals
 * @query   type - Filter by type (rab, progress_payment, delivery, leave)
 * @query   limit - Limit results (default: 10)
 * @access  Private
 */
router.get('/pending-approvals', verifyToken, dashboardController.getPendingApprovals);

/**
 * @route   POST /api/dashboard/approve/:type/:id
 * @desc    Quick approve/reject an item
 * @param   type - Approval type (rab, progress_payment, delivery, leave)
 * @param   id - Item ID
 * @body    action - 'approve' or 'reject'
 * @body    comments - Optional comments
 * @access  Private
 */
router.post('/approve/:type/:id', verifyToken, dashboardController.quickApproval);

module.exports = router;
