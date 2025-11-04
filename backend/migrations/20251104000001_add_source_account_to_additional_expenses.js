/**
 * Migration: Add source_account_id to project_additional_expenses
 * 
 * Purpose: Link kasbon/additional expenses to Chart of Accounts for payment source tracking
 * 
 * Use Cases:
 * - Bank Transfer: sourceAccountId = COA-110101 (Bank BCA) → Track balance
 * - Personal Cash: sourceAccountId = NULL → No tracking, personal money
 * - Petty Cash: sourceAccountId = COA-110108 (Kas Kecil) → Track balance
 * 
 * Created: 2025-11-04
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add source_account_id column
    await queryInterface.addColumn('project_additional_expenses', 'source_account_id', {
      type: Sequelize.STRING(50),
      allowNull: true,
      comment: 'Chart of Accounts ID for payment source (bank/cash). NULL for personal cash not tracked in system.',
      references: {
        model: 'chart_of_accounts',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Add index for performance
    await queryInterface.addIndex('project_additional_expenses', ['source_account_id'], {
      name: 'idx_additional_expense_source_account'
    });

    console.log('✅ Migration: Added source_account_id to project_additional_expenses');
  },

  down: async (queryInterface, Sequelize) => {
    // Remove index first
    await queryInterface.removeIndex('project_additional_expenses', 'idx_additional_expense_source_account');
    
    // Remove column
    await queryInterface.removeColumn('project_additional_expenses', 'source_account_id');

    console.log('✅ Migration: Removed source_account_id from project_additional_expenses');
  }
};
