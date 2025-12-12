'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('realization_documents', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      realization_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'rab_realizations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      file_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      file_path: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      file_type: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      file_size: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'File size in bytes'
      },
      mime_type: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      document_type: {
        type: Sequelize.ENUM('invoice', 'receipt', 'photo', 'contract', 'delivery_note', 'other'),
        allowNull: false,
        defaultValue: 'other'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      uploaded_by: {
        type: Sequelize.STRING(255), // VARCHAR to match users.id
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      uploaded_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Add index for realization_id
    await queryInterface.addIndex('realization_documents', ['realization_id'], {
      name: 'idx_realization_documents_realization_id'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('realization_documents');
  }
};
