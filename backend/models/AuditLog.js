const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * AuditLog Model
 * Tracks all CRUD operations and data changes across the system
 */
const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'user_id',
    comment: 'User who performed the action'
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Username for quick reference'
  },
  action: {
    type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW', 'EXPORT', 'IMPORT'),
    allowNull: false,
    comment: 'Type of action performed'
  },
  entityType: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'entity_type',
    comment: 'Type of entity affected (e.g., user, project, invoice)'
  },
  entityId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'entity_id',
    comment: 'ID of the affected entity'
  },
  entityName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'entity_name',
    comment: 'Name/title of the entity for quick reference'
  },
  before: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'State before change (for UPDATE/DELETE)'
  },
  after: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'State after change (for CREATE/UPDATE)'
  },
  changes: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Specific fields that changed with old/new values'
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
    field: 'ip_address',
    comment: 'IP address of the user'
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'user_agent',
    comment: 'User agent string'
  },
  method: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: 'HTTP method (GET, POST, PUT, DELETE)'
  },
  endpoint: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'API endpoint accessed'
  },
  statusCode: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'status_code',
    comment: 'HTTP status code'
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'error_message',
    comment: 'Error message if action failed'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration of operation in milliseconds'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Additional metadata about the action'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'audit_logs',
  timestamps: false,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['action']
    },
    {
      fields: ['entity_type']
    },
    {
      fields: ['entity_id']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['entity_type', 'entity_id'],
      name: 'audit_logs_entity_idx'
    },
    {
      fields: ['user_id', 'created_at'],
      name: 'audit_logs_user_time_idx'
    }
  ]
});

module.exports = AuditLog;
