const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ApprovalInstance = sequelize.define('ApprovalInstance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  workflowId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'workflow_id',
    references: {
      model: 'approval_workflows',
      key: 'id'
    }
  },
  entityId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'entity_id'
  },
  entityType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'entity_type'
  },
  entityData: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'entity_data'
  },
  currentStep: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    field: 'current_step'
  },
  overallStatus: {
    type: DataTypes.ENUM,
    values: ['pending', 'approved', 'rejected', 'cancelled'],
    defaultValue: 'pending',
    field: 'overall_status'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    field: 'total_amount'
  },
  submittedBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'submitted_by'
  },
  submittedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'submitted_at'
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'completed_at'
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'approval_instances',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ApprovalInstance;
