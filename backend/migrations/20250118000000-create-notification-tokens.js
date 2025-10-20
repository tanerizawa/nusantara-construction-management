'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notification_tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      token: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
      },
      device_type: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'web'
      },
      browser_info: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {}
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      last_used_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create indexes
    await queryInterface.addIndex('notification_tokens', ['user_id'], {
      name: 'idx_notification_tokens_user_id'
    });

    await queryInterface.addIndex('notification_tokens', ['token'], {
      name: 'idx_notification_tokens_token'
    });

    await queryInterface.addIndex('notification_tokens', ['is_active'], {
      name: 'idx_notification_tokens_is_active'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notification_tokens');
  }
};
