'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create audit_logs table
    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'User who performed the action'
      },
      username: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Username for quick reference'
      },
      action: {
        type: Sequelize.ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW', 'EXPORT', 'IMPORT'),
        allowNull: false,
        comment: 'Type of action performed'
      },
      entity_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Type of entity affected'
      },
      entity_id: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'ID of the affected entity'
      },
      entity_name: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Name/title of the entity'
      },
      before: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'State before change'
      },
      after: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'State after change'
      },
      changes: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'Specific fields that changed'
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
        comment: 'IP address of the user'
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'User agent string'
      },
      method: {
        type: Sequelize.STRING(10),
        allowNull: true,
        comment: 'HTTP method'
      },
      endpoint: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'API endpoint accessed'
      },
      status_code: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'HTTP status code'
      },
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Error message if action failed'
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Duration in milliseconds'
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'Additional metadata'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('audit_logs', ['user_id']);
    await queryInterface.addIndex('audit_logs', ['action']);
    await queryInterface.addIndex('audit_logs', ['entity_type']);
    await queryInterface.addIndex('audit_logs', ['entity_id']);
    await queryInterface.addIndex('audit_logs', ['created_at']);
    await queryInterface.addIndex('audit_logs', ['entity_type', 'entity_id'], {
      name: 'audit_logs_entity_idx'
    });
    await queryInterface.addIndex('audit_logs', ['user_id', 'created_at'], {
      name: 'audit_logs_user_time_idx'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop table
    await queryInterface.dropTable('audit_logs');
  }
};
