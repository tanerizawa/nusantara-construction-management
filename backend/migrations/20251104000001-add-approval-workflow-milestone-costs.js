'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      console.log('🔧 Starting migration: Add approval workflow to milestone_costs...');

      // 1. Add status column
      await queryInterface.addColumn('milestone_costs', 'status', {
        type: Sequelize.STRING(20),
        defaultValue: 'draft',
        allowNull: false
      }, { transaction });
      console.log('✅ Added column: status');

      // 2. Add submission tracking
      await queryInterface.addColumn('milestone_costs', 'submitted_by', {
        type: Sequelize.STRING(255),
        allowNull: true
      }, { transaction });
      console.log('✅ Added column: submitted_by');

      await queryInterface.addColumn('milestone_costs', 'submitted_at', {
        type: Sequelize.DATE,
        allowNull: true
      }, { transaction });
      console.log('✅ Added column: submitted_at');

      // 3. Add rejection tracking
      await queryInterface.addColumn('milestone_costs', 'rejection_reason', {
        type: Sequelize.TEXT,
        allowNull: true
      }, { transaction });
      console.log('✅ Added column: rejection_reason');

      await queryInterface.addColumn('milestone_costs', 'rejected_by', {
        type: Sequelize.STRING(255),
        allowNull: true
      }, { transaction });
      console.log('✅ Added column: rejected_by');

      await queryInterface.addColumn('milestone_costs', 'rejected_at', {
        type: Sequelize.DATE,
        allowNull: true
      }, { transaction });
      console.log('✅ Added column: rejected_at');

      // 4. Add link to finance transaction
      await queryInterface.addColumn('milestone_costs', 'finance_transaction_id', {
        type: Sequelize.STRING(255),
        allowNull: true
      }, { transaction });
      console.log('✅ Added column: finance_transaction_id');

      // 5. Create indexes
      await queryInterface.addIndex('milestone_costs', ['status'], {
        name: 'idx_milestone_costs_status',
        transaction
      });
      console.log('✅ Created index: idx_milestone_costs_status');

      await queryInterface.addIndex('milestone_costs', ['submitted_at'], {
        name: 'idx_milestone_costs_submitted',
        transaction
      });
      console.log('✅ Created index: idx_milestone_costs_submitted');

      await queryInterface.addIndex('milestone_costs', ['finance_transaction_id'], {
        name: 'idx_milestone_costs_finance_txn',
        transaction
      });
      console.log('✅ Created index: idx_milestone_costs_finance_txn');

      // 6. Migrate existing data (set to 'approved' untuk backward compatibility)
      const result = await queryInterface.sequelize.query(`
        UPDATE milestone_costs
        SET status = 'approved',
            submitted_by = recorded_by,
            submitted_at = recorded_at,
            approved_at = recorded_at
        WHERE recorded_at IS NOT NULL;
      `, { transaction });
      console.log(`✅ Migrated ${result[1]?.rowCount || 0} existing records to 'approved' status`);

      await transaction.commit();
      console.log('✅ Migration completed successfully: approval workflow added to milestone_costs');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      console.log('🔧 Rolling back migration: Remove approval workflow...');

      // Remove indexes
      await queryInterface.removeIndex('milestone_costs', 'idx_milestone_costs_status', { transaction });
      await queryInterface.removeIndex('milestone_costs', 'idx_milestone_costs_submitted', { transaction });
      await queryInterface.removeIndex('milestone_costs', 'idx_milestone_costs_finance_txn', { transaction });
      console.log('✅ Removed indexes');

      // Remove columns
      await queryInterface.removeColumn('milestone_costs', 'status', { transaction });
      await queryInterface.removeColumn('milestone_costs', 'submitted_by', { transaction });
      await queryInterface.removeColumn('milestone_costs', 'submitted_at', { transaction });
      await queryInterface.removeColumn('milestone_costs', 'rejection_reason', { transaction });
      await queryInterface.removeColumn('milestone_costs', 'rejected_by', { transaction });
      await queryInterface.removeColumn('milestone_costs', 'rejected_at', { transaction });
      await queryInterface.removeColumn('milestone_costs', 'finance_transaction_id', { transaction });
      console.log('✅ Removed columns');

      await transaction.commit();
      console.log('✅ Rollback completed: approval workflow removed');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Rollback failed:', error);
      throw error;
    }
  }
};
