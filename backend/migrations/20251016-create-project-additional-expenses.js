/**
 * Migration: Create project_additional_expenses table
 * Purpose: Track kasbon, overtime, emergency expenses, and other costs outside RAB
 * Date: October 16, 2025
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create expense_type enum
    await queryInterface.sequelize.query(`
      CREATE TYPE expense_type AS ENUM (
        'kasbon',
        'overtime',
        'emergency',
        'transportation',
        'accommodation',
        'meals',
        'equipment_rental',
        'repair',
        'miscellaneous',
        'other'
      );
    `);

    // Create approval_status enum for expenses
    await queryInterface.sequelize.query(`
      CREATE TYPE expense_approval_status AS ENUM (
        'pending',
        'approved',
        'rejected',
        'cancelled'
      );
    `);

    // Create payment_method enum
    await queryInterface.sequelize.query(`
      CREATE TYPE payment_method AS ENUM (
        'cash',
        'transfer',
        'check',
        'giro',
        'other'
      );
    `);

    // Create project_additional_expenses table
    await queryInterface.createTable('project_additional_expenses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      project_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: 'projects',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      
      // Expense Details
      expense_type: {
        type: 'expense_type',
        allowNull: false,
        defaultValue: 'other'
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Optional category for grouping (e.g., Labor, Material, Equipment)'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },
      
      // Related Information
      related_milestone_id: {
        type: Sequelize.UUID,
        allowNull: true,
        comment: 'Link to milestone if applicable'
      },
      related_rab_item_id: {
        type: Sequelize.UUID,
        allowNull: true,
        comment: 'Link to RAB item if applicable'
      },
      recipient_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'For kasbon - name of person receiving advance'
      },
      payment_method: {
        type: 'payment_method',
        allowNull: true,
        defaultValue: 'cash'
      },
      
      // Documentation
      receipt_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'URL to receipt/proof of payment'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      
      // Approval
      approved_by: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      approval_status: {
        type: 'expense_approval_status',
        allowNull: false,
        defaultValue: 'pending'
      },
      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      
      // Timestamps
      expense_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      created_by: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      updated_by: {
        type: Sequelize.STRING(255),
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
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Soft delete timestamp'
      }
    });

    // Create indexes for better query performance
    await queryInterface.addIndex('project_additional_expenses', ['project_id'], {
      name: 'idx_additional_expenses_project'
    });

    await queryInterface.addIndex('project_additional_expenses', ['expense_type'], {
      name: 'idx_additional_expenses_type'
    });

    await queryInterface.addIndex('project_additional_expenses', ['expense_date'], {
      name: 'idx_additional_expenses_date'
    });

    await queryInterface.addIndex('project_additional_expenses', ['approval_status'], {
      name: 'idx_additional_expenses_status'
    });

    await queryInterface.addIndex('project_additional_expenses', ['created_by'], {
      name: 'idx_additional_expenses_created_by'
    });

    await queryInterface.addIndex('project_additional_expenses', ['deleted_at'], {
      name: 'idx_additional_expenses_deleted_at'
    });

    console.log('✅ Table project_additional_expenses created successfully');
  },

  down: async (queryInterface, Sequelize) => {
    // Drop table
    await queryInterface.dropTable('project_additional_expenses');

    // Drop enums
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS expense_type;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS expense_approval_status;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS payment_method;');

    console.log('✅ Table project_additional_expenses dropped successfully');
  }
};
