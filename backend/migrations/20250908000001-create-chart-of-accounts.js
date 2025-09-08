'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('chart_of_accounts', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      account_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
        comment: 'Standard 4-level account code (e.g., 1101.01)'
      },
      account_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      account_type: {
        type: Sequelize.ENUM('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'),
        allowNull: false
      },
      account_sub_type: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Current Asset, Fixed Asset, Current Liability, etc.'
      },
      parent_account_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'chart_of_accounts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1,
          max: 4
        }
      },
      normal_balance: {
        type: Sequelize.ENUM('DEBIT', 'CREDIT'),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      vat_applicable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Applicable for VAT (PPN) calculations'
      },
      tax_deductible: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: 'Deductible for corporate income tax (PPh Badan)'
      },
      project_cost_center: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Used for project cost center allocation'
      },
      construction_specific: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Specific to construction industry'
      },
      is_control_account: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Control account for subsidiary ledgers'
      },
      psak_reference: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'PSAK standard reference'
      },
      tax_code: {
        type: Sequelize.STRING(10),
        allowNull: true,
        comment: 'Tax reporting code'
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Display order within parent'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Additional notes for the account'
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

    // Add indexes for better performance
    await queryInterface.addIndex('chart_of_accounts', ['account_code']);
    await queryInterface.addIndex('chart_of_accounts', ['account_type']);
    await queryInterface.addIndex('chart_of_accounts', ['parent_account_id']);
    await queryInterface.addIndex('chart_of_accounts', ['level']);
    await queryInterface.addIndex('chart_of_accounts', ['is_active']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('chart_of_accounts');
  }
};
