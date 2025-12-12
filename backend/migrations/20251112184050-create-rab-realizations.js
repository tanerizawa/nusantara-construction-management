'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rab_realizations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      project_id: {
        type: Sequelize.STRING(255), // VARCHAR to match projects.id
        allowNull: false,
        references: {
          model: 'projects',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      rab_item_id: {
        type: Sequelize.UUID, // UUID to match project_rab.id
        allowNull: false,
        references: {
          model: 'project_rab',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      transaction_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      quantity: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: false,
        defaultValue: 0
      },
      unit_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },
      total_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },
      vendor_name: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      invoice_number: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      payment_method: {
        type: Sequelize.ENUM('cash', 'transfer', 'check', 'giro', 'credit_card', 'other'),
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      budget_unit_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      variance_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      variance_percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('draft', 'pending_review', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'draft'
      },
      approved_by: {
        type: Sequelize.STRING(255), // VARCHAR to match users.id
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_by: {
        type: Sequelize.STRING(255), // VARCHAR to match users.id
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      updated_by: {
        type: Sequelize.STRING(255), // VARCHAR to match users.id
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Add indexes for performance
    await queryInterface.addIndex('rab_realizations', ['project_id'], {
      name: 'idx_rab_realizations_project_id'
    });
    await queryInterface.addIndex('rab_realizations', ['rab_item_id'], {
      name: 'idx_rab_realizations_rab_item_id'
    });
    await queryInterface.addIndex('rab_realizations', ['transaction_date'], {
      name: 'idx_rab_realizations_transaction_date'
    });
    await queryInterface.addIndex('rab_realizations', ['status'], {
      name: 'idx_rab_realizations_status'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rab_realizations');
  }
};
