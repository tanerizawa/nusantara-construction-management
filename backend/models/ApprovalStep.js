const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ApprovalStep = sequelize.define('ApprovalStep', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  instanceId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'instance_id',
    references: {
      model: 'approval_instances',
      key: 'id'
    }
  },
  stepNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'step_number'
  },
  stepName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'step_name'
  },
  approverRole: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'approver_role'
  },
  approverUserId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'approver_user_id'
  },
  requiredRole: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'required_role'
  },
  status: {
    type: DataTypes.ENUM,
    values: ['pending', 'approved', 'rejected', 'skipped'],
    defaultValue: 'pending'
  },
  decision: {
    type: DataTypes.ENUM,
    values: ['approve', 'reject', 'approve_with_conditions'],
    allowNull: true
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  conditions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'approved_at'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'due_date'
  },
  escalatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'escalated_at'
  }
}, {
  tableName: 'approval_steps',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ApprovalStep;
