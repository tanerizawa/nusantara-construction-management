/**
 * Migration: Add contractor_signature field to berita_acara table
 * Date: 2025-01-26
 * Purpose: Support digital signature capture for formal handover documents
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('berita_acara', 'contractor_signature', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Base64 encoded contractor signature image for handover document'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('berita_acara', 'contractor_signature');
  }
};
