const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Project = require('./Project');
const InventoryItem = require('./InventoryItem');
const FinanceTransaction = require('./FinanceTransaction');

// Define relationships
const setupAssociations = () => {
  // User - Project relationships
  User.hasMany(Project, {
    foreignKey: 'projectManagerId',
    as: 'managedProjects'
  });
  
  Project.belongsTo(User, {
    foreignKey: 'projectManagerId',
    as: 'projectManager'
  });

  // Project - FinanceTransaction relationships
  Project.hasMany(FinanceTransaction, {
    foreignKey: 'projectId',
    as: 'transactions'
  });
  
  FinanceTransaction.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
  });

  // User - FinanceTransaction relationships (for approval)
  User.hasMany(FinanceTransaction, {
    foreignKey: 'approvedBy',
    as: 'approvedTransactions'
  });
  
  FinanceTransaction.belongsTo(User, {
    foreignKey: 'approvedBy',
    as: 'approver'
  });
};

// Initialize associations
setupAssociations();

// Database sync function
const syncDatabase = async (options = {}) => {
  try {
    console.log('🔄 Syncing database...');
    await sequelize.sync(options);
    console.log('✅ Database synced successfully');
    return true;
  } catch (error) {
    console.error('❌ Database sync failed:', error);
    throw error;
  }
};

// Drop and recreate all tables (for development)
const resetDatabase = async () => {
  try {
    console.log('⚠️  Resetting database...');
    await sequelize.sync({ force: true });
    console.log('✅ Database reset completed');
    return true;
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    throw error;
  }
};

// Export models and utilities
module.exports = {
  sequelize,
  models: {
    User,
    Project,
    InventoryItem,
    FinanceTransaction
  },
  syncDatabase,
  resetDatabase
};
