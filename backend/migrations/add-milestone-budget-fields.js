/**
 * Migration: Add budget and actualCost to project_milestones
 * Date: 2025-10-12
 * Purpose: Add budget tracking fields to milestone table for weighted progress calculation
 */

const { sequelize } = require('../config/database');

async function addBudgetFieldsToMilestones() {
  const queryInterface = sequelize.getQueryInterface();
  
  try {
    console.log('🔄 Starting migration: Add budget fields to project_milestones...');
    
    // Check if columns already exist
    const tableDescription = await queryInterface.describeTable('project_milestones');
    
    // Add budget column if not exists
    if (!tableDescription.budget) {
      await queryInterface.addColumn('project_milestones', 'budget', {
        type: sequelize.Sequelize.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0,
        comment: 'Budget allocated for this milestone'
      });
      console.log('✅ Added column: budget');
    } else {
      console.log('⏭️  Column budget already exists');
    }
    
    // Add actualCost column if not exists
    if (!tableDescription.actualCost) {
      await queryInterface.addColumn('project_milestones', 'actualCost', {
        type: sequelize.Sequelize.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0,
        comment: 'Actual cost spent on this milestone'
      });
      console.log('✅ Added column: actualCost');
    } else {
      console.log('⏭️  Column actualCost already exists');
    }
    
    console.log('✅ Migration completed successfully!');
    console.log('📝 Note: All existing milestones will have budget = 0 and actualCost = 0');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration if executed directly
if (require.main === module) {
  addBudgetFieldsToMilestones()
    .then(() => {
      console.log('🎉 Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = addBudgetFieldsToMilestones;

