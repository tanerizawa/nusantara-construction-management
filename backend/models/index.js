const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Project = require('./Project');
const InventoryItem = require('./InventoryItem');
const FinanceTransaction = require('./FinanceTransaction');
const Manpower = require('./Manpower');
const PurchaseOrder = require('./PurchaseOrder');
const TaxRecord = require('./TaxRecord');
const ProjectRAB = require('./ProjectRAB');
const ProjectMilestone = require('./ProjectMilestone');
const ProjectTeamMember = require('./ProjectTeamMember');
const ProjectDocument = require('./ProjectDocument');
const Subsidiary = require('./Subsidiary');
const ChartOfAccounts = require('./ChartOfAccounts');
const JournalEntry = require('./JournalEntry');
const JournalEntryLine = require('./JournalEntryLine');
const ApprovalWorkflow = require('./ApprovalWorkflow');
const ApprovalInstance = require('./ApprovalInstance');
const ApprovalStep = require('./ApprovalStep');
const ApprovalNotification = require('./ApprovalNotification');

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

  // Project user tracking relationships
  User.hasMany(Project, {
    foreignKey: 'createdBy',
    as: 'createdProjects'
  });
  
  User.hasMany(Project, {
    foreignKey: 'updatedBy',
    as: 'updatedProjects'
  });
  
  Project.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'creator'
  });
  
  Project.belongsTo(User, {
    foreignKey: 'updatedBy',
    as: 'updater'
  });

  // FinanceTransaction - Project relationships
  FinanceTransaction.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
  });
  
  Project.hasMany(FinanceTransaction, {
    foreignKey: 'projectId',
    as: 'transactions'
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

  // Manpower - Project relationships (via currentProject field)
  Manpower.belongsTo(Project, {
    foreignKey: 'currentProject',
    as: 'project'
  });
  
  Project.hasMany(Manpower, {
    foreignKey: 'currentProject',
    as: 'manpower'
  });

  // PurchaseOrder - Project relationships
  PurchaseOrder.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
  });
  
  Project.hasMany(PurchaseOrder, {
    foreignKey: 'projectId',
    as: 'purchaseOrders'
  });

  // PurchaseOrder - User relationships
  PurchaseOrder.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'creator'
  });

  PurchaseOrder.belongsTo(User, {
    foreignKey: 'approvedBy',
    as: 'approver'
  });

  // TaxRecord - Project relationships
  TaxRecord.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
  });
  
  Project.hasMany(TaxRecord, {
    foreignKey: 'projectId',
    as: 'taxRecords'
  });

  // TaxRecord - User relationships
  TaxRecord.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'creator'
  });

  // Project - ProjectRAB relationships
  Project.hasMany(ProjectRAB, {
    foreignKey: 'projectId',
    as: 'rabItemsList'
  });
  
  ProjectRAB.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
  });

  // Project - ProjectMilestone relationships
  Project.hasMany(ProjectMilestone, {
    foreignKey: 'projectId',
    as: 'milestonesList'
  });
  
  ProjectMilestone.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
  });

  // Project - ProjectTeamMember relationships
  Project.hasMany(ProjectTeamMember, {
    foreignKey: 'projectId',
    as: 'teamMembersList'
  });
  
  ProjectTeamMember.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
  });

  // Project - ProjectDocument relationships
  Project.hasMany(ProjectDocument, {
    foreignKey: 'projectId',
    as: 'documentsList'
  });
  
  ProjectDocument.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
  });

  // Journal Entry associations
  JournalEntry.hasMany(JournalEntryLine, {
    foreignKey: 'journalEntryId',
    as: 'lines'
  });
  
  JournalEntryLine.belongsTo(JournalEntry, {
    foreignKey: 'journalEntryId',
    as: 'journalEntry'
  });

  // Journal Entry Line - Chart of Accounts associations
  JournalEntryLine.belongsTo(ChartOfAccounts, {
    foreignKey: 'accountId',
    as: 'account'
  });
  
  ChartOfAccounts.hasMany(JournalEntryLine, {
    foreignKey: 'accountId',
    as: 'journalEntryLines'
  });

  // Approval Workflow associations
  ApprovalWorkflow.hasMany(ApprovalInstance, {
    foreignKey: 'workflowId',
    as: 'instances'
  });
  
  ApprovalInstance.belongsTo(ApprovalWorkflow, {
    foreignKey: 'workflowId',
    as: 'ApprovalWorkflow'
  });

  // Approval Instance - Approval Step associations
  ApprovalInstance.hasMany(ApprovalStep, {
    foreignKey: 'instanceId',
    as: 'ApprovalSteps'
  });
  
  ApprovalStep.belongsTo(ApprovalInstance, {
    foreignKey: 'instanceId',
    as: 'ApprovalInstance'
  });

  // User - Approval Step associations (approver)
  User.hasMany(ApprovalStep, {
    foreignKey: 'approverUserId',
    as: 'approvalSteps'
  });
  
  ApprovalStep.belongsTo(User, {
    foreignKey: 'approverUserId',
    as: 'approver'
  });

  // User - Approval Notification associations
  User.hasMany(ApprovalNotification, {
    foreignKey: 'userId',
    as: 'notifications'
  });
  
  ApprovalNotification.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  // Approval Step - Approval Notification associations
  ApprovalStep.hasMany(ApprovalNotification, {
    foreignKey: 'stepId',
    as: 'notifications'
  });
  
  ApprovalNotification.belongsTo(ApprovalStep, {
    foreignKey: 'stepId',
    as: 'step'
  });

  console.log('✅ Model associations established');
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
    FinanceTransaction,
    Manpower,
    PurchaseOrder,
    TaxRecord,
    ProjectRAB,
    ProjectMilestone,
    ProjectTeamMember,
    ProjectDocument,
    Subsidiary,
    ChartOfAccounts,
    JournalEntry,
    JournalEntryLine,
    ApprovalWorkflow,
    ApprovalInstance,
    ApprovalStep,
    ApprovalNotification
  },
  setupAssociations,
  syncDatabase,
  resetDatabase
};
