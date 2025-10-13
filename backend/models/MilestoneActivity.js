/**
 * Milestone Activity Model
 * Logs all activities related to a milestone
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MilestoneActivity = sequelize.define('MilestoneActivity', {
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
  activityType: {
    type: DataTypes.ENUM(
      'created',
      'updated',
      'status_change',
      'progress_update',
      'photo_upload',
      'cost_added',
      'cost_updated',
      'issue_reported',
      'issue_resolved',
      'approved',
      'rejected',
      'comment',
      'other'
    ),
    allowNull: false,
    field: 'activity_type'
  },
  activityTitle: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'activity_title'
  },
  activityDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'activity_description'
  },
  performedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'performed_by'
  },
  performedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'performed_at'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  relatedPhotoId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'related_photo_id'
  },
  relatedCostId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'related_cost_id'
  }
}, {
  tableName: 'milestone_activities',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false // Only created_at, no updated_at for logs
});

module.exports = MilestoneActivity;
