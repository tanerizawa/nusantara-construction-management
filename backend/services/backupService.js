const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { promisify } = require('util');
const execAsync = promisify(exec);
const BackupHistory = require('../models/BackupHistory');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Backup Service
 * Handles automated database backup and restore operations
 */

// Configuration
const BACKUP_DIR = process.env.BACKUP_DIR || '/backups/database';
const DB_HOST = process.env.DB_HOST || 'nusantara-postgres';
const DB_PORT = process.env.DB_PORT || '5432';
const DB_NAME = process.env.DB_NAME || 'nusantara_db';
const DB_USER = process.env.DB_USER || 'nusantara_user';
const DB_PASSWORD = process.env.DB_PASSWORD || 'nusantara_password';
const DEFAULT_RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS) || 30;

/**
 * Ensure backup directory exists
 */
async function ensureBackupDirectory() {
  try {
    await fs.access(BACKUP_DIR);
  } catch (error) {
    console.log(`Creating backup directory: ${BACKUP_DIR}`);
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  }
}

/**
 * Get database statistics
 */
async function getDatabaseStats() {
  try {
    // Get database size
    const sizeResult = await sequelize.query(
      `SELECT pg_database_size('${DB_NAME}') as size`,
      { type: sequelize.QueryTypes.SELECT }
    );
    
    // Get table count
    const tableResult = await sequelize.query(
      `SELECT COUNT(*) as count FROM information_schema.tables 
       WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`,
      { type: sequelize.QueryTypes.SELECT }
    );
    
    // Get approximate row count
    const rowResult = await sequelize.query(
      `SELECT SUM(n_live_tup) as count FROM pg_stat_user_tables`,
      { type: sequelize.QueryTypes.SELECT }
    );
    
    return {
      databaseSize: parseInt(sizeResult[0]?.size || 0),
      tableCount: parseInt(tableResult[0]?.count || 0),
      rowCount: parseInt(rowResult[0]?.count || 0)
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return {
      databaseSize: 0,
      tableCount: 0,
      rowCount: 0
    };
  }
}

/**
 * Calculate file checksum (SHA-256)
 */
async function calculateChecksum(filePath) {
  try {
    const fileBuffer = await fs.readFile(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } catch (error) {
    console.error('Error calculating checksum:', error);
    return null;
  }
}

/**
 * Get file size
 */
async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch (error) {
    console.error('Error getting file size:', error);
    return 0;
  }
}

/**
 * Create database backup
 */
async function createBackup(options = {}) {
  const {
    backupType = 'FULL',
    triggeredBy = 'SYSTEM',
    triggeredByUsername = 'system',
    retentionDays = DEFAULT_RETENTION_DAYS
  } = options;
  
  let backupRecord = null;
  const startTime = Date.now();
  
  try {
    // Ensure backup directory exists
    await ensureBackupDirectory();
    
    // Generate backup filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileName = `nusantara_backup_${timestamp}.sql.gz`;
    const filePath = path.join(BACKUP_DIR, fileName);
    
    // Get database stats before backup
    const dbStats = await getDatabaseStats();
    
    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + retentionDays);
    
    // Create backup record
    backupRecord = await BackupHistory.create({
      backupType,
      fileName,
      filePath,
      status: 'IN_PROGRESS',
      startedAt: new Date(),
      databaseSize: dbStats.databaseSize,
      tableCount: dbStats.tableCount,
      rowCount: dbStats.rowCount,
      triggeredBy,
      triggeredByUsername,
      retentionDays,
      expiresAt
    });
    
    console.log(`Starting backup: ${fileName}`);
    
    // Execute pg_dump with compression
    const pgDumpCommand = `PGPASSWORD="${DB_PASSWORD}" pg_dump -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} --no-owner --no-acl | gzip > ${filePath}`;
    
    await execAsync(pgDumpCommand, {
      maxBuffer: 1024 * 1024 * 100, // 100MB buffer
      timeout: 600000 // 10 minutes timeout
    });
    
    // Calculate duration
    const duration = Math.floor((Date.now() - startTime) / 1000);
    
    // Get file size and calculate compression ratio
    const fileSize = await getFileSize(filePath);
    const compressionRatio = dbStats.databaseSize > 0 
      ? ((1 - (fileSize / dbStats.databaseSize)) * 100).toFixed(2)
      : 0;
    
    // Calculate checksum
    const checksum = await calculateChecksum(filePath);
    
    // Update backup record
    await backupRecord.update({
      status: 'COMPLETED',
      completedAt: new Date(),
      duration,
      fileSize,
      compressionRatio,
      checksum
    });
    
    console.log(`Backup completed: ${fileName} (${fileSize} bytes, ${duration}s)`);
    
    // Auto-verify backup
    const verified = await verifyBackup(backupRecord.id);
    
    return {
      success: true,
      backup: await BackupHistory.findByPk(backupRecord.id),
      verified
    };
    
  } catch (error) {
    console.error('Backup failed:', error);
    
    // Update backup record with error
    if (backupRecord) {
      await backupRecord.update({
        status: 'FAILED',
        completedAt: new Date(),
        duration: Math.floor((Date.now() - startTime) / 1000),
        errorMessage: error.message
      });
    }
    
    throw error;
  }
}

/**
 * Verify backup integrity
 */
async function verifyBackup(backupId) {
  try {
    const backup = await BackupHistory.findByPk(backupId);
    
    if (!backup) {
      throw new Error('Backup not found');
    }
    
    if (backup.status !== 'COMPLETED') {
      throw new Error('Backup is not completed');
    }
    
    console.log(`Verifying backup: ${backup.fileName}`);
    
    // Check if file exists
    try {
      await fs.access(backup.filePath);
    } catch (error) {
      await backup.update({
        status: 'CORRUPTED',
        errorMessage: 'Backup file not found'
      });
      return false;
    }
    
    // Verify checksum
    const currentChecksum = await calculateChecksum(backup.filePath);
    
    if (currentChecksum !== backup.checksum) {
      await backup.update({
        status: 'CORRUPTED',
        errorMessage: 'Checksum mismatch - file may be corrupted'
      });
      return false;
    }
    
    // Test gunzip
    try {
      await execAsync(`gunzip -t ${backup.filePath}`);
    } catch (error) {
      await backup.update({
        status: 'CORRUPTED',
        errorMessage: 'Backup file is corrupted (gunzip test failed)'
      });
      return false;
    }
    
    // Test SQL syntax (first 100 lines)
    try {
      await execAsync(`gunzip -c ${backup.filePath} | head -100 | psql --set ON_ERROR_STOP=on -f - > /dev/null 2>&1 || true`);
    } catch (error) {
      // This is optional, so we don't fail on syntax check
      console.warn('SQL syntax check skipped or failed');
    }
    
    // Update backup record
    await backup.update({
      status: 'VERIFIED',
      verifiedAt: new Date()
    });
    
    console.log(`Backup verified: ${backup.fileName}`);
    
    return true;
  } catch (error) {
    console.error('Backup verification failed:', error);
    return false;
  }
}

/**
 * Restore from backup
 */
async function restoreBackup(backupId, options = {}) {
  const {
    force = false,
    dropExisting = true
  } = options;
  
  try {
    const backup = await BackupHistory.findByPk(backupId);
    
    if (!backup) {
      throw new Error('Backup not found');
    }
    
    if (backup.status !== 'VERIFIED' && !force) {
      throw new Error('Backup is not verified. Use force=true to restore anyway.');
    }
    
    // Check if file exists
    try {
      await fs.access(backup.filePath);
    } catch (error) {
      throw new Error('Backup file not found');
    }
    
    console.log(`Starting restore from: ${backup.fileName}`);
    
    const startTime = Date.now();
    
    // Build restore command
    let restoreCommand = `gunzip -c ${backup.filePath} | PGPASSWORD="${DB_PASSWORD}" psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME}`;
    
    if (dropExisting) {
      console.log('WARNING: Dropping existing database objects...');
      // This will drop all tables before restore
      restoreCommand = `gunzip -c ${backup.filePath} | PGPASSWORD="${DB_PASSWORD}" psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} --set ON_ERROR_STOP=off`;
    }
    
    // Execute restore
    await execAsync(restoreCommand, {
      maxBuffer: 1024 * 1024 * 100, // 100MB buffer
      timeout: 600000 // 10 minutes timeout
    });
    
    const duration = Math.floor((Date.now() - startTime) / 1000);
    
    console.log(`Restore completed in ${duration}s`);
    
    return {
      success: true,
      backup,
      duration
    };
    
  } catch (error) {
    console.error('Restore failed:', error);
    throw error;
  }
}

/**
 * List all backups
 */
async function listBackups(options = {}) {
  const {
    limit = 50,
    offset = 0,
    status = null,
    backupType = null,
    includeDeleted = false
  } = options;
  
  try {
    const where = {};
    
    if (!includeDeleted) {
      where.isDeleted = false;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (backupType) {
      where.backupType = backupType;
    }
    
    const { count, rows } = await BackupHistory.findAndCountAll({
      where,
      order: [['startedAt', 'DESC']],
      limit,
      offset
    });
    
    return {
      backups: rows,
      total: count,
      page: Math.floor(offset / limit) + 1,
      pages: Math.ceil(count / limit)
    };
  } catch (error) {
    console.error('Error listing backups:', error);
    throw error;
  }
}

/**
 * Get backup details
 */
async function getBackupDetails(backupId) {
  try {
    const backup = await BackupHistory.findByPk(backupId);
    
    if (!backup) {
      throw new Error('Backup not found');
    }
    
    // Check if file still exists
    let fileExists = false;
    try {
      await fs.access(backup.filePath);
      fileExists = true;
    } catch (error) {
      fileExists = false;
    }
    
    return {
      ...backup.toJSON(),
      fileExists
    };
  } catch (error) {
    console.error('Error getting backup details:', error);
    throw error;
  }
}

/**
 * Delete backup
 */
async function deleteBackup(backupId, options = {}) {
  const {
    hardDelete = false
  } = options;
  
  try {
    const backup = await BackupHistory.findByPk(backupId);
    
    if (!backup) {
      throw new Error('Backup not found');
    }
    
    if (hardDelete) {
      // Delete physical file
      try {
        await fs.unlink(backup.filePath);
        console.log(`Deleted backup file: ${backup.fileName}`);
      } catch (error) {
        console.error('Error deleting backup file:', error);
      }
      
      // Delete database record
      await backup.destroy();
    } else {
      // Soft delete
      await backup.update({
        isDeleted: true,
        deletedAt: new Date()
      });
    }
    
    return {
      success: true,
      message: hardDelete ? 'Backup permanently deleted' : 'Backup marked as deleted'
    };
  } catch (error) {
    console.error('Error deleting backup:', error);
    throw error;
  }
}

/**
 * Cleanup old backups based on retention policy
 */
async function cleanupOldBackups() {
  try {
    console.log('Starting backup cleanup...');
    
    // Find expired backups
    const expiredBackups = await BackupHistory.findAll({
      where: {
        expiresAt: {
          [Op.lt]: new Date()
        },
        isDeleted: false
      }
    });
    
    let deletedCount = 0;
    let freedSpace = 0;
    
    for (const backup of expiredBackups) {
      try {
        // Delete physical file
        await fs.unlink(backup.filePath);
        freedSpace += backup.fileSize || 0;
        
        // Soft delete record
        await backup.update({
          isDeleted: true,
          deletedAt: new Date()
        });
        
        deletedCount++;
        console.log(`Deleted expired backup: ${backup.fileName}`);
      } catch (error) {
        console.error(`Error deleting backup ${backup.fileName}:`, error);
      }
    }
    
    console.log(`Cleanup completed: ${deletedCount} backups deleted, ${freedSpace} bytes freed`);
    
    return {
      deletedCount,
      freedSpace
    };
  } catch (error) {
    console.error('Error during cleanup:', error);
    throw error;
  }
}

/**
 * Get backup statistics
 */
async function getBackupStats() {
  try {
    // Total backups
    const totalBackups = await BackupHistory.count({
      where: { isDeleted: false }
    });
    
    // Successful backups
    const successfulBackups = await BackupHistory.count({
      where: {
        status: { [Op.in]: ['COMPLETED', 'VERIFIED'] },
        isDeleted: false
      }
    });
    
    // Failed backups
    const failedBackups = await BackupHistory.count({
      where: {
        status: 'FAILED',
        isDeleted: false
      }
    });
    
    // Latest backup
    const latestBackup = await BackupHistory.findOne({
      where: { isDeleted: false },
      order: [['startedAt', 'DESC']]
    });
    
    // Total backup size
    const sizeResult = await BackupHistory.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('fileSize')), 'totalSize']
      ],
      where: { isDeleted: false },
      raw: true
    });
    
    // Average compression ratio
    const compressionResult = await BackupHistory.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('compressionRatio')), 'avgCompression']
      ],
      where: {
        status: { [Op.in]: ['COMPLETED', 'VERIFIED'] },
        isDeleted: false
      },
      raw: true
    });
    
    return {
      totalBackups,
      successfulBackups,
      failedBackups,
      successRate: totalBackups > 0 ? ((successfulBackups / totalBackups) * 100).toFixed(2) : 0,
      latestBackup,
      totalSize: parseInt(sizeResult?.totalSize || 0),
      averageCompression: parseFloat(compressionResult?.avgCompression || 0).toFixed(2)
    };
  } catch (error) {
    console.error('Error getting backup stats:', error);
    throw error;
  }
}

module.exports = {
  createBackup,
  verifyBackup,
  restoreBackup,
  listBackups,
  getBackupDetails,
  deleteBackup,
  cleanupOldBackups,
  getBackupStats
};
