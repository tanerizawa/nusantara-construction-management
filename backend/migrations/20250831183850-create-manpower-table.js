'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('manpower', {
      id: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false
      },
      employee_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      position: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      department: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      join_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      birth_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'active'
      },
      employment_type: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      salary: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      current_project: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      skills: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSONB,
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

    // Add indexes
    await queryInterface.addIndex('manpower', ['status']);
    await queryInterface.addIndex('manpower', ['department']);
    await queryInterface.addIndex('manpower', ['current_project']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('manpower');
  }
};
