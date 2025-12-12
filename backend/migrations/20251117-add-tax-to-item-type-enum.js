'use strict';

/**
 * Migration: Add 'tax' to item_type ENUM in project_rab table
 * Date: 2025-11-17
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // PostgreSQL: Alter ENUM type to add 'tax'
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_project_rab_item_type" ADD VALUE IF NOT EXISTS 'tax';
    `);
    
    console.log('✅ Added "tax" to item_type ENUM');
  },

  down: async (queryInterface, Sequelize) => {
    // Note: PostgreSQL doesn't support removing values from ENUM easily
    // This would require recreating the ENUM type and updating all rows
    // For now, we'll just log a warning
    console.log('⚠️  Warning: Cannot easily remove "tax" from ENUM in PostgreSQL');
    console.log('⚠️  Manual intervention required if rollback is needed');
  }
};
