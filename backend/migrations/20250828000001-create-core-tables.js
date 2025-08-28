'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create Users table
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('admin', 'project_manager', 'finance_manager', 'inventory_manager', 'hr_manager', 'supervisor'),
        allowNull: false,
        defaultValue: 'supervisor'
      },
      profile: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {}
      },
      permissions: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      lastLogin: {
        type: Sequelize.DATE,
        allowNull: true
      },
      loginAttempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      lockUntil: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create indexes for users
    await queryInterface.addIndex('users', ['username'], { unique: true });
    await queryInterface.addIndex('users', ['email'], { unique: true });
    await queryInterface.addIndex('users', ['role']);
    await queryInterface.addIndex('users', ['isActive']);

    // Create Projects table
    await queryInterface.createTable('projects', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      client_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      client_contact: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {}
      },
      location: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {}
      },
      budget: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      actual_cost: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM('planning', 'active', 'on_hold', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'planning'
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'urgent'),
        allowNull: false,
        defaultValue: 'medium'
      },
      progress: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      estimated_duration: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      project_manager_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      team: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
      },
      milestones: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
      },
      documents: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tags: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create indexes for projects
    await queryInterface.addIndex('projects', ['status']);
    await queryInterface.addIndex('projects', ['priority']);
    await queryInterface.addIndex('projects', ['project_manager_id']);
    await queryInterface.addIndex('projects', ['start_date']);
    await queryInterface.addIndex('projects', ['end_date']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('projects');
    await queryInterface.dropTable('users');
  }
};
