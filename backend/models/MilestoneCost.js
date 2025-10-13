/**
 * Milestone Cost Model
 * Tracks costs associated with milestones
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MilestoneCost = sequelize.define('MilestoneCost', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  milestoneId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'milestone_id'
  },
  costCategory: {
    type: DataTypes.ENUM('materials', 'labor', 'equipment', 'subcontractor', 'contingency', 'indirect', 'other'),
    allowNull: false,
    field: 'cost_category'
  },
  costType: {
    type: DataTypes.ENUM('planned', 'actual', 'change_order', 'unforeseen'),
    defaultValue: 'actual',
    field: 'cost_type'
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  referenceNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'reference_number'
  },
  recordedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'recorded_by'
  },
  recordedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'recorded_at'
  },
  approvedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'approved_by'
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'approved_at'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'milestone_costs',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = MilestoneCost;
