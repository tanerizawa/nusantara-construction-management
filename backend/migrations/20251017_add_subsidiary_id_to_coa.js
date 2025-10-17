module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add subsidiary_id column to chart_of_accounts table
    await queryInterface.addColumn('chart_of_accounts', 'subsidiary_id', {
      type: Sequelize.STRING(50),
      allowNull: true,
      references: {
        model: 'subsidiaries',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'Reference to subsidiary for multi-entity accounting'
    });

    // Add index for better query performance
    await queryInterface.addIndex('chart_of_accounts', ['subsidiary_id'], {
      name: 'idx_chart_of_accounts_subsidiary_id'
    });

    console.log('✅ Added subsidiary_id column to chart_of_accounts');
  },

  down: async (queryInterface) => {
    // Remove index first
    await queryInterface.removeIndex('chart_of_accounts', 'idx_chart_of_accounts_subsidiary_id');
    
    // Remove column
    await queryInterface.removeColumn('chart_of_accounts', 'subsidiary_id');

    console.log('✅ Removed subsidiary_id column from chart_of_accounts');
  }
};
