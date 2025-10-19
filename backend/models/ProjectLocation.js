const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProjectLocation = sequelize.define('ProjectLocation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  project_id: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'project_id'
  },
  location_name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'location_name'
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
    validate: {
      min: -90,
      max: 90,
    },
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
    validate: {
      min: -180,
      max: 180,
    },
  },
  radius_meters: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100,
    field: 'radius_meters',
    validate: {
      min: 1,
      max: 5000,
    },
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'created_by'
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
  tableName: 'project_locations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['project_id'] },
    { fields: ['is_active'] }
  ]
});

// Instance method for distance calculation using Haversine formula
ProjectLocation.prototype.isWithinRadius = function(lat, lon) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (parseFloat(this.latitude) * Math.PI) / 180;
  const φ2 = (parseFloat(lat) * Math.PI) / 180;
  const Δφ = ((parseFloat(lat) - parseFloat(this.latitude)) * Math.PI) / 180;
  const Δλ = ((parseFloat(lon) - parseFloat(this.longitude)) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  
  return {
    isValid: distance <= this.radius_meters,
    distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
  };
};

module.exports = ProjectLocation;
