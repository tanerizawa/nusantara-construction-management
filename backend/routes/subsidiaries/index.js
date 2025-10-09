/**
 * Subsidiaries Module - Route Aggregator
 * Central hub for all subsidiary-related routes
 * Modular architecture: Each feature in separate file (<500 lines)
 */

const express = require('express');
const router = express.Router();

// Import modular routes
const basicRoutes = require('./basic.routes');
const statisticsRoutes = require('./statistics.routes');
const attachmentsRoutes = require('./attachments.routes');
const seedRoutes = require('./seed.routes');

// Mount routes in correct order (specific routes BEFORE parameterized routes)

// Statistics and analytics: GET /statistics, GET /stats/overview
router.use('/', statisticsRoutes);

// Seed data: POST /seed-nusantara
router.use('/', seedRoutes);

// Basic CRUD operations: GET /, GET /:id, POST /, PUT /:id, DELETE /:id
router.use('/', basicRoutes);

// File management: POST /:id/upload, DELETE /:id/attachments/:attachmentId, GET /:id/attachments/:attachmentId/download
router.use('/', attachmentsRoutes);

module.exports = router;
