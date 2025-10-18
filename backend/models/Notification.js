const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  // Recipient
  userId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  roleFilter: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    field: 'role_filter'
  },
  // Content
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['approval', 'alert', 'info', 'warning', 'success']]
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'image_url'
  },
  // Action
  actionUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'action_url'
  },
  actionLabel: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'action_label'
  },
  // Priority
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'normal',
    validate: {
      isIn: [['low', 'normal', 'high', 'urgent']]
    }
  },
  // Delivery
  channels: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: ['push', 'email']
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'sent_at'
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'delivered_at'
  },
  // Status
  readAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'read_at'
  },
  clickedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'clicked_at'
  },
  dismissedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'dismissed_at'
  },
  // Metadata
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expires_at'
  }
}, {
  tableName: 'notifications',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id', 'created_at']
    },
    {
      fields: ['type', 'category']
    },
    {
      fields: ['read_at']
    }
  ]
});

module.exports = Notification;
