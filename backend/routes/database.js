const express = require('express');
const router = express.Router();
const databaseController = require('../controllers/databaseController');

// Generic database query endpoint (untuk development)
router.post('/query', databaseController.executeQuery);

// RAB specific endpoints
router.get('/projects/:projectId/rab-items', databaseController.getRABItems);
router.post('/projects/:projectId/rab-items', databaseController.createRABItem);
router.put('/projects/:projectId/rab-items/:itemId', databaseController.updateRABItem);
router.delete('/projects/:projectId/rab-items/:itemId', databaseController.deleteRABItem);
router.post('/projects/:projectId/rab-items/:itemId/approve', databaseController.approveRABItem);
router.post('/projects/:projectId/rab-items/bulk-approve', databaseController.bulkApproveRABItems);

module.exports = router;
