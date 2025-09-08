module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('projects', 'created_by', {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'User ID who created this project'
    });

    await queryInterface.addColumn('projects', 'updated_by', {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'User ID who last updated this project'
    });

    // Add indexes for better performance
    await queryInterface.addIndex('projects', ['created_by']);
    await queryInterface.addIndex('projects', ['updated_by']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('projects', ['created_by']);
    await queryInterface.removeIndex('projects', ['updated_by']);
    await queryInterface.removeColumn('projects', 'created_by');
    await queryInterface.removeColumn('projects', 'updated_by');
  }
};
