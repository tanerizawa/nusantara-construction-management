const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * ActiveSession Model
 * Tracks currently active user sessions
 */
const ActiveSession = sequelize.define('ActiveSession', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'JWT token hash for identification'
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
    field: 'ip_address'
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'user_agent'
  },
  browser: {
    type: DataTypes.STRING,
    allowNull: true
  },
  os: {
    type: DataTypes.STRING,
    allowNull: true
  },
  device: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(2),
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  lastActive: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'last_active'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expires_at',
    comment: 'When the JWT token expires'
  }
}, {
  tableName: 'active_sessions',
  timestamps: false,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['token'],
      unique: true
    },
    {
      fields: ['expires_at']
    },
    {
      fields: ['last_active']
    }
  ]
});

module.exports = ActiveSession;
