const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AttendanceSettings = sequelize.define('AttendanceSettings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  project_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'project_id'
  },
  
  // Working Hours
  work_start_time: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: '08:00:00',
    field: 'work_start_time'
  },
  work_end_time: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: '17:00:00',
    field: 'work_end_time'
  },
  late_tolerance_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 15,
    field: 'late_tolerance_minutes'
  },
  early_leave_tolerance_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 15,
    field: 'early_leave_tolerance_minutes'
  },
  
  // GPS Settings
  require_gps_verification: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'require_gps_verification'
  },
  max_distance_meters: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    field: 'max_distance_meters'
  },
  allow_manual_location: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'allow_manual_location'
  },
  
  // Photo Settings
  require_clock_in_photo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'require_clock_in_photo'
  },
  require_clock_out_photo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'require_clock_out_photo'
  },
  
  // Break Time
  has_break_time: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'has_break_time'
  },
  break_start_time: {
    type: DataTypes.TIME,
    defaultValue: '12:00:00',
    field: 'break_start_time'
  },
  break_end_time: {
    type: DataTypes.TIME,
    defaultValue: '13:00:00',
    field: 'break_end_time'
  },
  
  // Working Days
  work_days: {
    type: DataTypes.JSONB,
    defaultValue: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    field: 'work_days'
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
  tableName: 'attendance_settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['project_id'], unique: true }
  ]
});

// Instance methods
AttendanceSettings.prototype.isLate = function(clockInTime) {
  const clockIn = new Date(clockInTime);
  const [hours, minutes] = this.work_start_time.split(':');
  const startTime = new Date(clockIn);
  startTime.setHours(parseInt(hours), parseInt(minutes), 0);
  
  const toleranceTime = new Date(startTime);
  toleranceTime.setMinutes(toleranceTime.getMinutes() + this.late_tolerance_minutes);
  
  const minutesLate = Math.max(0, Math.floor((clockIn - toleranceTime) / 60000));
  
  return {
    isLate: clockIn > toleranceTime,
    minutesLate,
  };
};

AttendanceSettings.prototype.isEarlyLeave = function(clockOutTime) {
  const clockOut = new Date(clockOutTime);
  const [hours, minutes] = this.work_end_time.split(':');
  const endTime = new Date(clockOut);
  endTime.setHours(parseInt(hours), parseInt(minutes), 0);
  
  const toleranceTime = new Date(endTime);
  toleranceTime.setMinutes(toleranceTime.getMinutes() - this.early_leave_tolerance_minutes);
  
  const minutesEarly = Math.max(0, Math.floor((toleranceTime - clockOut) / 60000));
  
  return {
    isEarlyLeave: clockOut < toleranceTime,
    minutesEarly,
  };
};

module.exports = AttendanceSettings;
