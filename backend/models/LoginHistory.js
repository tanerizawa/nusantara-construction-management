const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * LoginHistory Model
 * Tracks all login attempts (successful and failed)
 */
const LoginHistory = sequelize.define('LoginHistory', {
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
  ipAddress: {
    type: DataTypes.STRING(45), // Support IPv6
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
    allowNull: true,
    comment: 'City, Country from IP geolocation'
  },
  country: {
    type: DataTypes.STRING(2),
    allowNull: true,
    comment: 'ISO country code'
  },
  success: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  failureReason: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'failure_reason',
    comment: 'Reason for failed login: invalid_password, user_not_found, etc.'
  },
  loginAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'login_at'
  }
}, {
  tableName: 'login_history',
  timestamps: false,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['login_at']
    },
    {
      fields: ['success']
    },
    {
      fields: ['user_id', 'login_at']
    }
  ]
});

module.exports = LoginHistory;
