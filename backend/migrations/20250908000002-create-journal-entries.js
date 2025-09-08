'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create journal_entries table
    await queryInterface.createTable('journal_entries', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      entry_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'Auto-generated journal entry number'
      },
      entry_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      entry_type: {
        type: Sequelize.ENUM(
          'GENERAL', 'ADJUSTMENT', 'CLOSING', 'OPENING', 
          'CASH_RECEIPT', 'CASH_PAYMENT', 'PURCHASE', 'SALES'
        ),
        allowNull: false,
        defaultValue: 'GENERAL'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      reference_type: {
        type: Sequelize.ENUM(
          'INVOICE', 'RECEIPT', 'VOUCHER', 'PROJECT', 
          'PURCHASE_ORDER', 'CONTRACT', 'OTHER'
        ),
        allowNull: true
      },
      reference_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      project_id: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Link to specific project'
      },
      subsidiary_id: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Link to subsidiary company'
      },
      total_debit: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },
      total_credit: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },
      is_balanced: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'True if total_debit equals total_credit'
      },
      status: {
        type: Sequelize.ENUM('DRAFT', 'POSTED', 'APPROVED', 'REJECTED'),
        allowNull: false,
        defaultValue: 'DRAFT'
      },
      posted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      posted_by: {
        type: Sequelize.UUID,
        allowNull: true,
        comment: 'User who posted the entry'
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      approved_by: {
        type: Sequelize.UUID,
        allowNull: true,
        comment: 'User who approved the entry'
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        comment: 'User who created the entry'
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

    // Create journal_entry_lines table
    await queryInterface.createTable('journal_entry_lines', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      journal_entry_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'journal_entries',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      account_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'chart_of_accounts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      line_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Line sequence within the journal entry'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      debit_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },
      credit_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },
      project_id: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Project allocation for this line'
      },
      cost_center: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Cost center code'
      },
      department: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Department allocation'
      },
      tax_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0,
        comment: 'VAT or other tax amount'
      },
      tax_type: {
        type: Sequelize.ENUM('PPN_IN', 'PPN_OUT', 'PPH_21', 'PPH_23', 'PPH_4_2', 'PPH_FINAL', 'OTHER'),
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

    // Add indexes for performance
    await queryInterface.addIndex('journal_entries', ['entry_number']);
    await queryInterface.addIndex('journal_entries', ['entry_date']);
    await queryInterface.addIndex('journal_entries', ['entry_type']);
    await queryInterface.addIndex('journal_entries', ['status']);
    await queryInterface.addIndex('journal_entries', ['project_id']);
    await queryInterface.addIndex('journal_entries', ['subsidiary_id']);
    
    await queryInterface.addIndex('journal_entry_lines', ['journal_entry_id']);
    await queryInterface.addIndex('journal_entry_lines', ['account_id']);
    await queryInterface.addIndex('journal_entry_lines', ['project_id']);
    
    // Composite index for journal entry lines ordering
    await queryInterface.addIndex('journal_entry_lines', ['journal_entry_id', 'line_number']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('journal_entry_lines');
    await queryInterface.dropTable('journal_entries');
  }
};
