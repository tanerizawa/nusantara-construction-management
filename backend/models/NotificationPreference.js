const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NotificationPreference = sequelize.define('NotificationPreference', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
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
  // Channel preferences
  emailEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'email_enabled'
  },
  pushEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'push_enabled'
  },
  smsEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'sms_enabled'
  },
  // Category preferences
  categories: {
    type: DataTypes.JSONB,
    defaultValue: {
      approval_requests: true,
      project_updates: true,
      budget_alerts: true,
      team_assignments: true,
      system_announcements: true,
      payment_reminders: true
    }
  },
  // Schedule preferences
  quietHoursStart: {
    type: DataTypes.TIME,
    defaultValue: '22:00:00',
    field: 'quiet_hours_start'
  },
  quietHoursEnd: {
    type: DataTypes.TIME,
    defaultValue: '07:00:00',
    field: 'quiet_hours_end'
  },
  weekendNotifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'weekend_notifications'
  },
  // Device tokens for FCM
  deviceTokens: {
    type: DataTypes.JSONB,
    defaultValue: [],
    field: 'device_tokens'
  }
}, {
  tableName: 'notification_preferences',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = NotificationPreference;
