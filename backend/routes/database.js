const express = require('express');
const router = express.Router();
const databaseController = require('../controllers/databaseController');

// Database Management endpoints
router.get('/status', databaseController.getDatabaseStatus);
router.post('/create', databaseController.createDatabase);
router.post('/drop', databaseController.dropDatabase);
router.post('/switch', databaseController.switchDatabase);
router.post('/backup', databaseController.backupDatabase);
router.post('/restore', databaseController.restoreDatabase);
router.get('/list', databaseController.listDatabases);
router.post('/query', databaseController.executeQuery);

module.exports = router;
