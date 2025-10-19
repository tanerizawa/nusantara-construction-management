const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LeaveRequest = sequelize.define('LeaveRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'user_id'
  },
  project_id: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'project_id'
  },
  leave_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'leave_type',
    validate: {
      isIn: [['sick', 'annual', 'unpaid', 'emergency', 'maternity', 'paternity']],
    },
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'start_date'
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'end_date'
  },
  total_days: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'total_days',
    validate: {
      min: 1,
    },
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  attachment_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'attachment_url'
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'approved', 'rejected', 'cancelled']],
    },
  },
  approved_by: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'approved_by'
  },
  approved_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'approved_at'
  },
  rejection_reason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'rejection_reason'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'leave_requests',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['project_id'] },
    { fields: ['status'] },
    { fields: ['start_date', 'end_date'] }
  ]
});

module.exports = LeaveRequest;
