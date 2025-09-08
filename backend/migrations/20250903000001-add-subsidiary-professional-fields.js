'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new columns to subsidiaries table
    await queryInterface.addColumn('subsidiaries', 'board_of_directors', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: []
    });

    await queryInterface.addColumn('subsidiaries', 'legal_info', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {
        companyRegistrationNumber: null,
        taxIdentificationNumber: null,
        businessLicenseNumber: null,
        articlesOfIncorporation: null,
        vatRegistrationNumber: null
      }
    });

    await queryInterface.addColumn('subsidiaries', 'permits', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: []
    });

    await queryInterface.addColumn('subsidiaries', 'financial_info', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {
        authorizedCapital: null,
        paidUpCapital: null,
        currency: 'IDR',
        fiscalYearEnd: null
      }
    });

    await queryInterface.addColumn('subsidiaries', 'attachments', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: []
    });

    await queryInterface.addColumn('subsidiaries', 'profile_info', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {
        website: null,
        socialMedia: {},
        companySize: null,
        industryClassification: null,
        businessDescription: null
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove columns in reverse order
    await queryInterface.removeColumn('subsidiaries', 'profile_info');
    await queryInterface.removeColumn('subsidiaries', 'attachments');
    await queryInterface.removeColumn('subsidiaries', 'financial_info');
    await queryInterface.removeColumn('subsidiaries', 'permits');
    await queryInterface.removeColumn('subsidiaries', 'legal_info');
    await queryInterface.removeColumn('subsidiaries', 'board_of_directors');
  }
};
