const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AttendanceRecord = sequelize.define('AttendanceRecord', {
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
    allowNull: false,
    field: 'project_id'
  },
  project_location_id: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'project_location_id'
  },
  
  // Clock In Data
  clock_in_time: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'clock_in_time'
  },
  clock_in_latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
    field: 'clock_in_latitude'
  },
  clock_in_longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
    field: 'clock_in_longitude'
  },
  clock_in_address: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'clock_in_address'
  },
  clock_in_photo_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'clock_in_photo_url'
  },
  clock_in_device_info: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'clock_in_device_info'
  },
  clock_in_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'clock_in_notes'
  },
  clock_in_distance_meters: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'clock_in_distance_meters'
  },
  clock_in_is_valid: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'clock_in_is_valid'
  },
  
  // Clock Out Data
  clock_out_time: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'clock_out_time'
  },
  clock_out_latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
    field: 'clock_out_latitude'
  },
  clock_out_longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
    field: 'clock_out_longitude'
  },
  clock_out_address: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'clock_out_address'
  },
  clock_out_photo_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'clock_out_photo_url'
  },
  clock_out_device_info: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'clock_out_device_info'
  },
  clock_out_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'clock_out_notes'
  },
  clock_out_distance_meters: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'clock_out_distance_meters'
  },
  clock_out_is_valid: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    field: 'clock_out_is_valid'
  },
  
  // Calculated Fields
  work_duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'work_duration_minutes'
  },
  attendance_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'attendance_date'
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'clocked_in',
    validate: {
      isIn: [['clocked_in', 'clocked_out', 'incomplete', 'late', 'early_leave']],
    },
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
  tableName: 'attendance_records',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['project_id'] },
    { fields: ['attendance_date'] },
    { fields: ['status'] },
    { fields: ['user_id', 'attendance_date'] },
    { 
      unique: true, 
      fields: ['user_id', 'project_id', 'attendance_date'],
      name: 'idx_attendance_unique_daily'
    }
  ]
});

module.exports = AttendanceRecord;
