'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create Inventory Items table
    await queryInterface.createTable('inventory_items', {
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
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subcategory: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pcs'
      },
      current_stock: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      minimum_stock: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      maximum_stock: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      unit_price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true
      },
      total_value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      warehouse: {
        type: Sequelize.STRING,
        allowNull: true
      },
      supplier: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {}
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      last_stock_update: {
        type: Sequelize.DATE,
        allowNull: true
      },
      specifications: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {}
      },
      images: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
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

    // Create indexes for inventory_items
    await queryInterface.addIndex('inventory_items', ['category']);
    await queryInterface.addIndex('inventory_items', ['sku']);
    await queryInterface.addIndex('inventory_items', ['warehouse']);
    await queryInterface.addIndex('inventory_items', ['is_active']);

    // Create Finance Transactions table
    await queryInterface.createTable('finance_transactions', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('income', 'expense', 'transfer'),
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subcategory: {
        type: Sequelize.STRING,
        allowNull: true
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      project_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'projects',
          key: 'id'
        }
      },
      account_from: {
        type: Sequelize.STRING,
        allowNull: true
      },
      account_to: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payment_method: {
        type: Sequelize.ENUM('cash', 'bank_transfer', 'check', 'credit_card', 'debit_card', 'other'),
        allowNull: false,
        defaultValue: 'cash'
      },
      reference_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'cancelled', 'failed'),
        allowNull: false,
        defaultValue: 'completed'
      },
      is_recurring: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      recurring_pattern: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: null
      },
      attachments: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
      },
      tags: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tax_info: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {}
      },
      approved_by: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      approved_at: {
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

    // Create indexes for finance_transactions
    await queryInterface.addIndex('finance_transactions', ['type']);
    await queryInterface.addIndex('finance_transactions', ['category']);
    await queryInterface.addIndex('finance_transactions', ['date']);
    await queryInterface.addIndex('finance_transactions', ['project_id']);
    await queryInterface.addIndex('finance_transactions', ['status']);
    await queryInterface.addIndex('finance_transactions', ['payment_method']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('finance_transactions');
    await queryInterface.dropTable('inventory_items');
  }
};
