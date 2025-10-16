/**
 * Work Orders Routes - Project-scoped
 * Handles all work order operations for a specific project
 * Route: /api/projects/:projectId/work-orders
 */

const express = require('express');
const router = express.Router();

// Import the main workOrders route handler
const workOrdersHandler = require('../workOrders');

// Mount work orders routes under /:projectId/work-orders
// Middleware to set projectId in params for nested routes
router.use('/:projectId/work-orders', (req, res, next) => {
  // Store projectId for use in nested handler
  req.projectId = req.params.projectId;
  next();
}, workOrdersHandler);

module.exports = router;
