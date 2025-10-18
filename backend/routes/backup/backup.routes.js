const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const backupService = require('../../services/backupService');

/**
 * Middleware to check admin role
 */
function requireAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Check if user is admin
    if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
}

/**
 * GET /api/backup/stats
 * Get backup statistics
 */
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const stats = await backupService.getBackupStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting backup stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get backup statistics',
      details: error.message
    });
  }
});

/**
 * POST /api/backup/create
 * Create a new backup
 */
router.post('/create', requireAdmin, async (req, res) => {
  try {
    const {
      backupType = 'MANUAL',
      retentionDays = 30
    } = req.body;
    
    const result = await backupService.createBackup({
      backupType,
      triggeredBy: req.user.id,
      triggeredByUsername: req.user.username,
      retentionDays
    });
    
    res.json({
      success: true,
      data: result.backup,
      verified: result.verified
    });
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create backup',
      details: error.message
    });
  }
});

/**
 * GET /api/backup/list
 * List all backups with pagination
 */
router.get('/list', requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      status = null,
      backupType = null,
      includeDeleted = false
    } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const result = await backupService.listBackups({
      limit: parseInt(limit),
      offset,
      status,
      backupType,
      includeDeleted: includeDeleted === 'true'
    });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error listing backups:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list backups',
      details: error.message
    });
  }
});

/**
 * GET /api/backup/:id
 * Get backup details by ID
 */
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const backup = await backupService.getBackupDetails(req.params.id);
    
    res.json({
      success: true,
      data: backup
    });
  } catch (error) {
    console.error('Error getting backup details:', error);
    res.status(404).json({
      success: false,
      error: 'Backup not found',
      details: error.message
    });
  }
});

/**
 * POST /api/backup/:id/verify
 * Verify backup integrity
 */
router.post('/:id/verify', requireAdmin, async (req, res) => {
  try {
    const verified = await backupService.verifyBackup(req.params.id);
    
    res.json({
      success: true,
      verified,
      message: verified ? 'Backup verified successfully' : 'Backup verification failed'
    });
  } catch (error) {
    console.error('Error verifying backup:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify backup',
      details: error.message
    });
  }
});

/**
 * POST /api/backup/:id/restore
 * Restore from backup
 * DANGER: This will overwrite current database
 */
router.post('/:id/restore', requireAdmin, async (req, res) => {
  try {
    const {
      force = false,
      dropExisting = true,
      confirmRestore = false
    } = req.body;
    
    // Require explicit confirmation
    if (!confirmRestore) {
      return res.status(400).json({
        success: false,
        error: 'Restore operation requires explicit confirmation',
        message: 'Set confirmRestore=true to proceed. WARNING: This will overwrite the current database!'
      });
    }
    
    const result = await backupService.restoreBackup(req.params.id, {
      force,
      dropExisting
    });
    
    res.json({
      success: true,
      data: result,
      message: 'Database restored successfully'
    });
  } catch (error) {
    console.error('Error restoring backup:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to restore backup',
      details: error.message
    });
  }
});

/**
 * DELETE /api/backup/:id
 * Delete backup
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { hardDelete = false } = req.query;
    
    const result = await backupService.deleteBackup(req.params.id, {
      hardDelete: hardDelete === 'true'
    });
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Error deleting backup:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete backup',
      details: error.message
    });
  }
});

/**
 * POST /api/backup/cleanup
 * Cleanup old backups based on retention policy
 */
router.post('/cleanup', requireAdmin, async (req, res) => {
  try {
    const result = await backupService.cleanupOldBackups();
    
    res.json({
      success: true,
      data: result,
      message: `Deleted ${result.deletedCount} expired backups, freed ${result.freedSpace} bytes`
    });
  } catch (error) {
    console.error('Error cleaning up backups:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup backups',
      details: error.message
    });
  }
});

/**
 * GET /api/backup/download/:id
 * Download backup file
 */
router.get('/download/:id', requireAdmin, async (req, res) => {
  try {
    const backup = await backupService.getBackupDetails(req.params.id);
    
    if (!backup.fileExists) {
      return res.status(404).json({
        success: false,
        error: 'Backup file not found'
      });
    }
    
    res.download(backup.filePath, backup.fileName);
  } catch (error) {
    console.error('Error downloading backup:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download backup',
      details: error.message
    });
  }
});

module.exports = router;
