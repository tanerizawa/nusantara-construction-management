/**
 * Migration: Add status_history field to berita_acara table
 * Date: 2025-01-27
 * Purpose: Enable audit trail tracking for all BA status changes and actions
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('berita_acara', 'status_history', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Audit trail of all status changes and actions'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('berita_acara', 'status_history');
  }
};
