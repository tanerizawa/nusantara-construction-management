'use strict';

/**
 * Migration: Add RAB integration fields to milestone_costs
 * 
 * This migration adds support for linking milestone costs to RAB (Rencana Anggaran Biaya) items,
 * enabling tracking of planned vs actual costs at the item level.
 * 
 * New Fields:
 * - rab_item_id: Links cost entry to specific RAB item (NULL for non-RAB costs)
 * - is_rab_linked: Boolean flag for quick filtering (auto-set via trigger)
 * - rab_item_progress: Percentage of RAB item completion (0-100)
 * 
 * Date: October 20, 2025
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      console.log('🔄 Adding RAB integration fields to milestone_costs...');

      // 1. Add rab_item_id column with foreign key reference
      await queryInterface.addColumn(
        'milestone_costs',
        'rab_item_id',
        {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'project_rab',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          comment: 'Links to project_rab.id for RAB-based costs'
        },
        { transaction }
      );

      console.log('✅ Added rab_item_id column');

      // 2. Add is_rab_linked boolean flag
      await queryInterface.addColumn(
        'milestone_costs',
        'is_rab_linked',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          comment: 'TRUE if cost is linked to RAB item, FALSE for additional costs'
        },
        { transaction }
      );

      console.log('✅ Added is_rab_linked column');

      // 3. Add rab_item_progress for tracking completion
      await queryInterface.addColumn(
        'milestone_costs',
        'rab_item_progress',
        {
          type: Sequelize.DECIMAL(5, 2),
          allowNull: false,
          defaultValue: 0,
          comment: 'Percentage of RAB item completion (0-100)'
        },
        { transaction }
      );

      console.log('✅ Added rab_item_progress column');

      // 4. Add check constraint for progress range
      await queryInterface.sequelize.query(
        `ALTER TABLE milestone_costs 
         ADD CONSTRAINT chk_rab_item_progress_range 
         CHECK (rab_item_progress >= 0 AND rab_item_progress <= 100)`,
        { transaction }
      );

      console.log('✅ Added progress range constraint');

      // 5. Create index on rab_item_id for faster queries
      await queryInterface.addIndex(
        'milestone_costs',
        ['rab_item_id'],
        {
          name: 'idx_milestone_costs_rab_item',
          transaction
        }
      );

      console.log('✅ Added index on rab_item_id');

      // 6. Create composite index for milestone + rab queries
      await queryInterface.addIndex(
        'milestone_costs',
        ['milestone_id', 'rab_item_id'],
        {
          name: 'idx_milestone_costs_milestone_rab',
          transaction
        }
      );

      console.log('✅ Added composite index (milestone_id, rab_item_id)');

      // 7. Create index on is_rab_linked for filtering
      await queryInterface.addIndex(
        'milestone_costs',
        ['is_rab_linked'],
        {
          name: 'idx_milestone_costs_rab_linked',
          transaction
        }
      );

      console.log('✅ Added index on is_rab_linked');

      // 8. Create trigger to auto-set is_rab_linked based on rab_item_id
      await queryInterface.sequelize.query(
        `CREATE OR REPLACE FUNCTION set_rab_linked()
         RETURNS TRIGGER AS $$
         BEGIN
           NEW.is_rab_linked := (NEW.rab_item_id IS NOT NULL);
           RETURN NEW;
         END;
         $$ LANGUAGE plpgsql;`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `CREATE TRIGGER trigger_set_rab_linked
         BEFORE INSERT OR UPDATE ON milestone_costs
         FOR EACH ROW
         EXECUTE FUNCTION set_rab_linked();`,
        { transaction }
      );

      console.log('✅ Added trigger for auto-setting is_rab_linked');

      // 9. Update existing records (all non-linked costs remain NULL)
      await queryInterface.sequelize.query(
        `UPDATE milestone_costs 
         SET is_rab_linked = false 
         WHERE rab_item_id IS NULL`,
        { transaction }
      );

      console.log('✅ Updated existing records');

      await transaction.commit();
      console.log('🎉 Migration completed successfully!');

      // Display summary
      const result = await queryInterface.sequelize.query(
        `SELECT 
           COUNT(*) as total_costs,
           COUNT(rab_item_id) as rab_linked_costs,
           COUNT(*) - COUNT(rab_item_id) as additional_costs
         FROM milestone_costs`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      console.log('\n📊 Migration Summary:');
      console.log(`   Total costs: ${result[0].total_costs}`);
      console.log(`   RAB-linked: ${result[0].rab_linked_costs}`);
      console.log(`   Additional: ${result[0].additional_costs}`);

    } catch (error) {
      await transaction.rollback();
      console.error('❌ Migration failed:', error.message);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      console.log('🔄 Rolling back RAB integration...');

      // Drop trigger first
      await queryInterface.sequelize.query(
        'DROP TRIGGER IF EXISTS trigger_set_rab_linked ON milestone_costs',
        { transaction }
      );

      await queryInterface.sequelize.query(
        'DROP FUNCTION IF EXISTS set_rab_linked()',
        { transaction }
      );

      console.log('✅ Dropped trigger and function');

      // Drop indexes
      await queryInterface.removeIndex(
        'milestone_costs',
        'idx_milestone_costs_rab_linked',
        { transaction }
      );

      await queryInterface.removeIndex(
        'milestone_costs',
        'idx_milestone_costs_milestone_rab',
        { transaction }
      );

      await queryInterface.removeIndex(
        'milestone_costs',
        'idx_milestone_costs_rab_item',
        { transaction }
      );

      console.log('✅ Dropped indexes');

      // Drop constraint
      await queryInterface.sequelize.query(
        'ALTER TABLE milestone_costs DROP CONSTRAINT IF EXISTS chk_rab_item_progress_range',
        { transaction }
      );

      console.log('✅ Dropped constraint');

      // Drop columns
      await queryInterface.removeColumn('milestone_costs', 'rab_item_progress', { transaction });
      await queryInterface.removeColumn('milestone_costs', 'is_rab_linked', { transaction });
      await queryInterface.removeColumn('milestone_costs', 'rab_item_id', { transaction });

      console.log('✅ Dropped columns');

      await transaction.commit();
      console.log('🎉 Rollback completed successfully!');

    } catch (error) {
      await transaction.rollback();
      console.error('❌ Rollback failed:', error.message);
      throw error;
    }
  }
};
