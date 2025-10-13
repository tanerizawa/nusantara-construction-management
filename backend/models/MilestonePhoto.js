/**
 * Milestone Photo Model
 * Stores photos for milestone documentation
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MilestonePhoto = sequelize.define('MilestonePhoto', {
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
  photoUrl: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'photo_url'
  },
  thumbnailUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'thumbnail_url'
  },
  photoType: {
    type: DataTypes.ENUM('progress', 'issue', 'inspection', 'quality', 'before', 'after', 'general'),
    defaultValue: 'progress',
    field: 'photo_type'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  takenAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'taken_at'
  },
  uploadedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'uploaded_by'
  },
  locationLat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
    field: 'location_lat'
  },
  locationLng: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
    field: 'location_lng'
  },
  weatherCondition: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'weather_condition'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'milestone_photos',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = MilestonePhoto;
