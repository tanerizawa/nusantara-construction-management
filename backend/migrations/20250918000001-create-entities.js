'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('entities', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      entity_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true
      },
      entity_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      entity_type: {
        type: Sequelize.ENUM('subsidiary', 'branch', 'project', 'division'),
        allowNull: false
      },
      parent_entity_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'entities',
          key: 'id'
        }
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('entities', ['entity_code']);
    await queryInterface.addIndex('entities', ['entity_type']);
    await queryInterface.addIndex('entities', ['parent_entity_id']);
    await queryInterface.addIndex('entities', ['is_active']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('entities');
  }
};