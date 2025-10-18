const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * BackupHistory Model
 * Tracks all database backup operations
 */
const BackupHistory = sequelize.define('BackupHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  backupType: {
    type: DataTypes.ENUM('FULL', 'INCREMENTAL', 'MANUAL'),
    allowNull: false,
    defaultValue: 'FULL',
    comment: 'Type of backup performed'
  },
  fileName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Backup file name'
  },
  filePath: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Full path to backup file'
  },
  fileSize: {
    type: DataTypes.BIGINT,
    comment: 'Backup file size in bytes'
  },
  status: {
    type: DataTypes.ENUM('IN_PROGRESS', 'COMPLETED', 'FAILED', 'VERIFIED', 'CORRUPTED'),
    allowNull: false,
    defaultValue: 'IN_PROGRESS',
    comment: 'Current status of backup'
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'When backup started'
  },
  completedAt: {
    type: DataTypes.DATE,
    comment: 'When backup completed'
  },
  duration: {
    type: DataTypes.INTEGER,
    comment: 'Backup duration in seconds'
  },
  databaseSize: {
    type: DataTypes.BIGINT,
    comment: 'Database size at backup time in bytes'
  },
  tableCount: {
    type: DataTypes.INTEGER,
    comment: 'Number of tables backed up'
  },
  rowCount: {
    type: DataTypes.BIGINT,
    comment: 'Total number of rows backed up'
  },
  compressionRatio: {
    type: DataTypes.DECIMAL(5, 2),
    comment: 'Compression ratio (percentage)'
  },
  checksum: {
    type: DataTypes.STRING(64),
    comment: 'SHA-256 checksum for verification'
  },
  verifiedAt: {
    type: DataTypes.DATE,
    comment: 'When backup was verified'
  },
  isEncrypted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether backup is encrypted'
  },
  triggeredBy: {
    type: DataTypes.STRING(50),
    comment: 'User ID or SYSTEM for scheduled backups'
  },
  triggeredByUsername: {
    type: DataTypes.STRING(100),
    comment: 'Username who triggered backup'
  },
  errorMessage: {
    type: DataTypes.TEXT,
    comment: 'Error message if backup failed'
  },
  metadata: {
    type: DataTypes.JSONB,
    comment: 'Additional backup metadata'
  },
  retentionDays: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
    comment: 'Number of days to retain this backup'
  },
  expiresAt: {
    type: DataTypes.DATE,
    comment: 'When backup will be deleted'
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Soft delete flag'
  },
  deletedAt: {
    type: DataTypes.DATE,
    comment: 'When backup was deleted'
  }
}, {
  tableName: 'backup_history',
  timestamps: true,
  indexes: [
    {
      name: 'idx_backup_history_status',
      fields: ['status']
    },
    {
      name: 'idx_backup_history_type',
      fields: ['backupType']
    },
    {
      name: 'idx_backup_history_started_at',
      fields: ['startedAt']
    },
    {
      name: 'idx_backup_history_completed_at',
      fields: ['completedAt']
    },
    {
      name: 'idx_backup_history_expires_at',
      fields: ['expiresAt']
    },
    {
      name: 'idx_backup_history_deleted',
      fields: ['isDeleted']
    }
  ]
});

module.exports = BackupHistory;
