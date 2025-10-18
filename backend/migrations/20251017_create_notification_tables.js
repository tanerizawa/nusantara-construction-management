'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create notification_preferences table
    await queryInterface.createTable('notification_preferences', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      // Channel preferences
      email_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      push_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      sms_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // Category preferences (JSONB)
      categories: {
        type: Sequelize.JSONB,
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
      quiet_hours_start: {
        type: Sequelize.TIME,
        defaultValue: '22:00:00'
      },
      quiet_hours_end: {
        type: Sequelize.TIME,
        defaultValue: '07:00:00'
      },
      weekend_notifications: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // Device tokens for push notifications (array of FCM tokens)
      device_tokens: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Add index for user_id
    await queryInterface.addIndex('notification_preferences', ['user_id'], {
      unique: true,
      name: 'notification_preferences_user_id_unique'
    });

    // Create notifications table (general purpose)
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      // Recipient
      user_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      role_filter: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        comment: 'Send to specific roles'
      },
      // Content
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'approval, alert, info, warning, success'
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'approval_requests, project_updates, etc.'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: true
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Action
      action_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      action_label: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Priority
      priority: {
        type: Sequelize.STRING,
        defaultValue: 'normal',
        comment: 'low, normal, high, urgent'
      },
      // Delivery
      channels: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: ['push', 'email']
      },
      sent_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      delivered_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      // Status
      read_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      clicked_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      dismissed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      // Metadata
      metadata: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes for notifications
    await queryInterface.addIndex('notifications', ['user_id', 'created_at'], {
      name: 'notifications_user_id_created_at_idx'
    });
    await queryInterface.addIndex('notifications', ['type', 'category'], {
      name: 'notifications_type_category_idx'
    });
    await queryInterface.addIndex('notifications', ['read_at'], {
      name: 'notifications_read_at_idx'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notifications');
    await queryInterface.dropTable('notification_preferences');
  }
};
