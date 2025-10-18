'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add super_admin and staff to role enum
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'super_admin';
      ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'staff';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Cannot remove enum values in PostgreSQL
    // This is a no-op migration
    console.log('Cannot remove enum values in PostgreSQL. Manual intervention required if rollback needed.');
  }
};
