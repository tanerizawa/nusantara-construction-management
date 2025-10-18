'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create login_history table
    await queryInterface.createTable('login_history', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
      ip_address: {
        type: Sequelize.STRING(45), // Support IPv6
        allowNull: true
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      browser: {
        type: Sequelize.STRING,
        allowNull: true
      },
      os: {
        type: Sequelize.STRING,
        allowNull: true
      },
      device: {
        type: Sequelize.STRING,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'City, Country from IP geolocation'
      },
      country: {
        type: Sequelize.STRING(2),
        allowNull: true,
        comment: 'ISO country code'
      },
      success: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      failure_reason: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Reason for failed login: invalid_password, user_not_found, etc.'
      },
      login_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes for login_history
    await queryInterface.addIndex('login_history', ['user_id']);
    await queryInterface.addIndex('login_history', ['login_at']);
    await queryInterface.addIndex('login_history', ['success']);

    // Create active_sessions table
    await queryInterface.createTable('active_sessions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
        comment: 'JWT token hash for identification'
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      browser: {
        type: Sequelize.STRING,
        allowNull: true
      },
      os: {
        type: Sequelize.STRING,
        allowNull: true
      },
      device: {
        type: Sequelize.STRING,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      country: {
        type: Sequelize.STRING(2),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      last_active: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'When the JWT token expires'
      }
    });

    // Add indexes for active_sessions
    await queryInterface.addIndex('active_sessions', ['user_id']);
    await queryInterface.addIndex('active_sessions', ['token'], {
      name: 'active_sessions_token_idx',
      type: 'HASH'
    });
    await queryInterface.addIndex('active_sessions', ['expires_at']);
    await queryInterface.addIndex('active_sessions', ['last_active']);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order
    await queryInterface.dropTable('active_sessions');
    await queryInterface.dropTable('login_history');
  }
};
