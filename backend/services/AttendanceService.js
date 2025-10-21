const { models } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs').promises;

class AttendanceService {
  /**
   * Clock in for attendance
   * @param {Object} data - Clock in data
   * @returns {Promise<Object>} Created attendance record
   */
  async clockIn(data) {
    const {
      userId,
      projectId,
      latitude,
      longitude,
      address,
      photoUrl,
      deviceInfo,
      notes,
    } = data;

    // Check if already clocked in today
    const today = new Date().toISOString().split('T')[0];
    const existingAttendance = await models.AttendanceRecord.findOne({
      where: {
        user_id: userId,
        project_id: projectId,
        attendance_date: today,
      },
    });

    if (existingAttendance) {
      throw new Error('Already clocked in today for this project');
    }

    // Get attendance settings
    const settings = await models.AttendanceSettings.findOne({
      where: { project_id: projectId },
    });

    if (!settings) {
      throw new Error('Attendance settings not configured for this project');
    }

    // Verify GPS location if required
    let locationValid = true;
    let distanceMeters = null;
    let projectLocationId = null;

    if (settings.require_gps_verification && latitude && longitude) {
      const projectLocations = await models.ProjectLocation.findAll({
        where: {
          project_id: projectId,
          is_active: true,
        },
      });

      if (projectLocations.length === 0) {
        throw new Error('No active project locations configured');
      }

      // Find nearest location
      let minDistance = Infinity;
      let nearestLocation = null;

      for (const location of projectLocations) {
        const result = location.isWithinRadius(latitude, longitude);
        if (result.distance < minDistance) {
          minDistance = result.distance;
          nearestLocation = location;
          locationValid = result.isValid;
        }
      }

      distanceMeters = minDistance;
      projectLocationId = nearestLocation.id;

      if (!locationValid && !settings.allow_manual_location) {
        throw new Error(
          `You are ${Math.round(minDistance)}m away from project location. Maximum allowed distance is ${settings.max_distance_meters}m`
        );
      }
    }

    // Verify photo if required
    if (settings.require_clock_in_photo && !photoUrl) {
      throw new Error('Clock in photo is required');
    }

    // Check if late
    const clockInTime = new Date();
    const lateCheck = settings.isLate(clockInTime);
    let status = 'clocked_in';
    if (lateCheck.isLate) {
      status = 'late';
    }

    // Create attendance record
    const attendance = await models.AttendanceRecord.create({
      user_id: userId,
      project_id: projectId,
      project_location_id: projectLocationId,
      clock_in_time: clockInTime,
      clock_in_latitude: latitude,
      clock_in_longitude: longitude,
      clock_in_address: address,
      clock_in_photo_url: photoUrl,
      clock_in_device_info: deviceInfo,
      clock_in_notes: notes,
      clock_in_distance_meters: distanceMeters,
      clock_in_is_valid: locationValid,
      attendance_date: today,
      status,
    });

    // Include project and user info
    const fullAttendance = await models.AttendanceRecord.findByPk(attendance.id, {
      include: [
        {
          model: models.User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: models.Project,
          as: 'project',
          attributes: ['id', 'name', 'location'],
        },
      ],
    });

    return {
      success: true,
      message: lateCheck.isLate
        ? `Clocked in successfully. You are ${lateCheck.minutesLate} minutes late.`
        : 'Clocked in successfully',
      data: fullAttendance,
      warning: !locationValid ? `Location verification failed. Distance: ${Math.round(distanceMeters)}m` : null,
    };
  }

  /**
   * Clock out for attendance
   * @param {Object} data - Clock out data
   * @returns {Promise<Object>} Updated attendance record
   */
  async clockOut(data) {
    const {
      userId,
      projectId,
      latitude,
      longitude,
      address,
      photoUrl,
      deviceInfo,
      notes,
    } = data;

    // Find today's attendance
    const today = new Date().toISOString().split('T')[0];
    const attendance = await models.AttendanceRecord.findOne({
      where: {
        user_id: userId,
        project_id: projectId,
        attendance_date: today,
        clock_out_time: null,
      },
    });

    if (!attendance) {
      throw new Error('No active clock-in found for today');
    }

    // Get attendance settings
    const settings = await models.AttendanceSettings.findOne({
      where: { project_id: projectId },
    });

    // Verify GPS location if required
    let locationValid = true;
    let distanceMeters = null;

    if (settings.require_gps_verification && latitude && longitude) {
      const projectLocation = await models.ProjectLocation.findByPk(
        attendance.project_location_id
      );

      if (projectLocation) {
        const result = projectLocation.isWithinRadius(latitude, longitude);
        locationValid = result.isValid;
        distanceMeters = result.distance;

        if (!locationValid && !settings.allow_manual_location) {
          throw new Error(
            `You are ${Math.round(distanceMeters)}m away from project location. Maximum allowed distance is ${settings.max_distance_meters}m`
          );
        }
      }
    }

    // Verify photo if required
    if (settings.require_clock_out_photo && !photoUrl) {
      throw new Error('Clock out photo is required');
    }

    // Check if early leave
    const clockOutTime = new Date();
    const earlyLeaveCheck = settings.isEarlyLeave(clockOutTime);
    let status = 'clocked_out';
    if (attendance.status === 'late') {
      status = 'late'; // Keep late status
    } else if (earlyLeaveCheck.isEarlyLeave) {
      status = 'early_leave';
    }

    // Update attendance record
    await attendance.update({
      clock_out_time: clockOutTime,
      clock_out_latitude: latitude,
      clock_out_longitude: longitude,
      clock_out_address: address,
      clock_out_photo_url: photoUrl,
      clock_out_device_info: deviceInfo,
      clock_out_notes: notes,
      clock_out_distance_meters: distanceMeters,
      clock_out_is_valid: locationValid,
      status,
    });

    // Calculate work duration (already done by trigger, but double check)
    const durationMs = attendance.clock_out_time - attendance.clock_in_time;
    attendance.work_duration_minutes = Math.floor(durationMs / 60000);
    await attendance.save();

    // Include project and user info
    const fullAttendance = await models.AttendanceRecord.findByPk(attendance.id, {
      include: [
        {
          model: models.User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: models.Project,
          as: 'project',
          attributes: ['id', 'name', 'location'],
        },
      ],
    });

    return {
      success: true,
      message: earlyLeaveCheck.isEarlyLeave
        ? `Clocked out successfully. You left ${earlyLeaveCheck.minutesEarly} minutes early.`
        : 'Clocked out successfully',
      data: fullAttendance,
      warning: !locationValid ? `Location verification failed. Distance: ${Math.round(distanceMeters)}m` : null,
    };
  }

  /**
   * Get today's attendance for user
   * @param {UUID} userId - User ID
   * @param {UUID|null} projectId - Project ID (optional - if null, gets first today's attendance)
   * @returns {Promise<Object>} Today's attendance or null
   */
  async getTodayAttendance(userId, projectId = null) {
    const today = new Date().toISOString().split('T')[0];
    
    // Build where clause
    const where = {
      user_id: userId,
      attendance_date: today,
    };
    
    // Only filter by projectId if provided
    if (projectId) {
      where.project_id = projectId;
    }
    
    const attendance = await models.AttendanceRecord.findOne({
      where,
      include: [
        {
          model: models.Project,
          as: 'project',
          attributes: ['id', 'name', 'location'],
        },
        {
          model: models.ProjectLocation,
          as: 'projectLocation',
          attributes: ['id', 'location_name', 'latitude', 'longitude', 'radius_meters'],
        },
      ],
      order: [['clock_in_time', 'DESC']], // Get most recent if multiple
    });

    return attendance;
  }

  /**
   * Get attendance history for user
   * @param {UUID} userId - User ID
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Attendance records
   */
  async getAttendanceHistory(userId, filters = {}) {
    const { projectId, startDate, endDate, status, limit = 30, offset = 0 } = filters;

    const where = { user_id: userId };

    if (projectId) {
      where.project_id = projectId;
    }

    if (startDate || endDate) {
      where.attendance_date = {};
      if (startDate) where.attendance_date[Op.gte] = startDate;
      if (endDate) where.attendance_date[Op.lte] = endDate;
    }

    if (status) {
      where.status = status;
    }

    const { count, rows } = await models.AttendanceRecord.findAndCountAll({
      where,
      include: [
        {
          model: models.Project,
          as: 'project',
          attributes: ['id', 'name', 'location'],
        },
        {
          model: models.ProjectLocation,
          as: 'projectLocation',
          attributes: ['id', 'location_name'],
        },
      ],
      order: [['attendance_date', 'DESC'], ['clock_in_time', 'DESC']],
      limit,
      offset,
    });

    return {
      total: count,
      data: rows,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(count / limit),
    };
  }

  /**
   * Get attendance summary for user
   * @param {UUID} userId - User ID
   * @param {UUID} projectId - Project ID
   * @param {string} month - Month in YYYY-MM format
   * @returns {Promise<Object>} Attendance summary
   */
  async getAttendanceSummary(userId, projectId, month) {
    const startDate = `${month}-01`;
    const endDate = new Date(month + '-01');
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    const endDateStr = endDate.toISOString().split('T')[0];

    const records = await models.AttendanceRecord.findAll({
      where: {
        user_id: userId,
        project_id: projectId,
        attendance_date: {
          [Op.between]: [startDate, endDateStr],
        },
      },
    });

    const summary = {
      month,
      total_days_present: records.length,
      total_days_late: records.filter((r) => r.status === 'late').length,
      total_days_early_leave: records.filter((r) => r.status === 'early_leave').length,
      total_days_incomplete: records.filter((r) => r.status === 'incomplete').length,
      total_work_minutes: records.reduce((sum, r) => sum + (r.work_duration_minutes || 0), 0),
      average_work_minutes: 0,
    };

    const completedDays = records.filter((r) => r.work_duration_minutes);
    if (completedDays.length > 0) {
      summary.average_work_minutes = Math.round(
        summary.total_work_minutes / completedDays.length
      );
    }

    // Convert to hours
    summary.total_work_hours = (summary.total_work_minutes / 60).toFixed(1);
    summary.average_work_hours = (summary.average_work_minutes / 60).toFixed(1);

    return summary;
  }

  /**
   * Create or update project location
   * @param {Object} data - Location data
   * @returns {Promise<Object>} Project location
   */
  async createProjectLocation(data) {
    const location = await models.ProjectLocation.create(data);
    return location;
  }

  /**
   * Get project locations
   * @param {UUID} projectId - Project ID
   * @returns {Promise<Array>} Project locations
   */
  async getProjectLocations(projectId) {
    const locations = await models.ProjectLocation.findAll({
      where: { project_id: projectId },
      order: [['is_active', 'DESC'], ['location_name', 'ASC']],
    });
    return locations;
  }

  /**
   * Create or update attendance settings
   * @param {UUID} projectId - Project ID
   * @param {Object} settingsData - Settings data
   * @returns {Promise<Object>} Attendance settings
   */
  async updateAttendanceSettings(projectId, settingsData) {
    const [settings, created] = await models.AttendanceSettings.findOrCreate({
      where: { project_id: projectId },
      defaults: { ...settingsData, project_id: projectId },
    });

    if (!created) {
      await settings.update(settingsData);
    }

    return settings;
  }

  /**
   * Get attendance settings
   * @param {UUID} projectId - Project ID
   * @returns {Promise<Object>} Attendance settings
   */
  async getAttendanceSettings(projectId) {
    let settings = await models.AttendanceSettings.findOne({
      where: { project_id: projectId },
    });

    // Create default settings if not exists
    if (!settings) {
      settings = await models.AttendanceSettings.create({
        project_id: projectId,
      });
    }

    return settings;
  }
}

module.exports = new AttendanceService();
