/**
 * Projects Module - Route Aggregator
 * Central hub for all project-related routes
 * Modular architecture: Each feature in separate file (<500 lines)
 */

const express = require('express');
const { verifyToken } = require('../../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all project routes
router.use(verifyToken);

// Import modular routes
const basicRoutes = require('./basic.routes');
const rabRoutes = require('./rab.routes');
const milestoneRoutes = require('./milestone.routes');
const teamRoutes = require('./team.routes');
const documentRoutes = require('./document.routes');
const beritaAcaraRoutes = require('./berita-acara.routes');
const progressPaymentRoutes = require('./progress-payment.routes');
const deliveryReceiptRoutes = require('./delivery-receipt.routes');
const budgetStatisticsRoutes = require('./budget-statistics.routes');

// Mount routes
router.use('/', basicRoutes);              // Basic CRUD: /, /:id
router.use('/', rabRoutes);                 // RAB: /:id/rab
router.use('/', milestoneRoutes);          // Milestones: /:id/milestones
router.use('/', teamRoutes);                // Team: /:id/team
router.use('/', documentRoutes);            // Documents: /:id/documents
router.use('/', beritaAcaraRoutes);        // Berita Acara: /:projectId/berita-acara
router.use('/', progressPaymentRoutes);    // Progress Payments: /:projectId/progress-payments
router.use('/', deliveryReceiptRoutes);    // Delivery Receipts: /:id/delivery-receipts
router.use('/', budgetStatisticsRoutes);   // Budget & Stats: /:id/budget-monitoring, /stats/overview
// const beritaAcaraRoutes = require('./berita-acara.routes');
// const progressPaymentRoutes = require('./progress-payment.routes');
// const deliveryReceiptRoutes = require('./delivery-receipt.routes');
// const budgetMonitoringRoutes = require('./budget-monitoring.routes');

// router.use('/', milestoneRoutes);           // Milestones: /:id/milestones
// router.use('/', teamRoutes);                // Team: /:id/team
// router.use('/', documentRoutes);            // Documents: /:id/documents
// router.use('/', beritaAcaraRoutes);         // Berita Acara: /:id/berita-acara
// router.use('/', progressPaymentRoutes);     // Progress Payments: /:id/progress-payments
// router.use('/', deliveryReceiptRoutes);     // Delivery Receipts: /:id/delivery-receipts
// router.use('/', budgetMonitoringRoutes);    // Budget Monitoring: /:id/budget-monitoring

module.exports = router;
