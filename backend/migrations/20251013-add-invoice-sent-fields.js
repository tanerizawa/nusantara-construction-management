'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('progress_payments', 'invoice_sent', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    await queryInterface.addColumn('progress_payments', 'invoice_sent_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('progress_payments', 'invoice_sent_by', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('progress_payments', 'invoice_sent_notes', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('progress_payments', 'invoice_recipient', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('progress_payments', 'invoice_sent');
    await queryInterface.removeColumn('progress_payments', 'invoice_sent_at');
    await queryInterface.removeColumn('progress_payments', 'invoice_sent_by');
    await queryInterface.removeColumn('progress_payments', 'invoice_sent_notes');
    await queryInterface.removeColumn('progress_payments', 'invoice_recipient');
  }
};
