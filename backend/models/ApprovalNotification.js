const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ApprovalNotification = sequelize.define('ApprovalNotification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  instanceId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'instance_id',
    references: {
      model: 'approval_instances',
      key: 'id'
    }
  },
  stepId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'step_id',
    references: {
      model: 'approval_steps',
      key: 'id'
    }
  },
  recipientUserId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'recipient_user_id'
  },
  notificationType: {
    type: DataTypes.ENUM,
    values: ['approval_request', 'approved', 'rejected', 'escalation', 'completed'],
    allowNull: false,
    field: 'notification_type'
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM,
    values: ['pending', 'sent', 'read', 'failed'],
    defaultValue: 'pending'
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'sent_at'
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'read_at'
  }
}, {
  tableName: 'approval_notifications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ApprovalNotification;
