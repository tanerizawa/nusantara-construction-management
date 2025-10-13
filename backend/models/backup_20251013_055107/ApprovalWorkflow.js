const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ApprovalWorkflow = sequelize.define('ApprovalWorkflow', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  entityType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'entity_type'
  },
  workflowSteps: {
    type: DataTypes.JSON,
    allowNull: false,
    field: 'workflow_steps'
  },
  approvalLimits: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'approval_limits'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'created_by'
  }
}, {
  tableName: 'approval_workflows',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ApprovalWorkflow;
