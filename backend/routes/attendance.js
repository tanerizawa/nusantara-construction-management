const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const AttendanceService = require('../services/AttendanceService');
const { verifyToken } = require('../middleware/auth');

// Configure multer for photo uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/attendance');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG and PNG images are allowed'));
    }
  },
});

/**
 * @route   POST /api/attendance/clock-in
 * @desc    Clock in for attendance
 * @access  Private
 */
router.post('/clock-in', verifyToken, upload.single('photo'), async (req, res) => {
  try {
    const {
      projectId,
      latitude,
      longitude,
      address,
      deviceInfo,
      notes,
    } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required',
      });
    }

    const photoUrl = req.file ? `/uploads/attendance/${req.file.filename}` : null;

    const result = await AttendanceService.clockIn({
      userId: req.user.id,
      projectId,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      address,
      photoUrl,
      deviceInfo: deviceInfo ? JSON.parse(deviceInfo) : null,
      notes,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Clock in error:', error);
    
    // Delete uploaded file if error occurs
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Failed to clock in',
    });
  }
});

/**
 * @route   POST /api/attendance/clock-out
 * @desc    Clock out for attendance
 * @access  Private
 */
router.post('/clock-out', verifyToken, upload.single('photo'), async (req, res) => {
  try {
    const {
      projectId,
      latitude,
      longitude,
      address,
      deviceInfo,
      notes,
    } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required',
      });
    }

    const photoUrl = req.file ? `/uploads/attendance/${req.file.filename}` : null;

    const result = await AttendanceService.clockOut({
      userId: req.user.id,
      projectId,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      address,
      photoUrl,
      deviceInfo: deviceInfo ? JSON.parse(deviceInfo) : null,
      notes,
    });

    res.json(result);
  } catch (error) {
    console.error('Clock out error:', error);
    
    // Delete uploaded file if error occurs
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Failed to clock out',
    });
  }
});

/**
 * @route   GET /api/attendance/today
 * @desc    Get today's attendance (projectId optional)
 * @access  Private
 */
router.get('/today', verifyToken, async (req, res) => {
  try {
    const { projectId } = req.query;

    // If no projectId provided, try to get today's attendance for any project
    const attendance = await AttendanceService.getTodayAttendance(
      req.user.id,
      projectId || null
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'No attendance record found for today',
        data: null
      });
    }

    res.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error('Get today attendance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get today\'s attendance',
    });
  }
});

/**
 * @route   GET /api/attendance/history
 * @desc    Get attendance history
 * @access  Private
 */
router.get('/history', verifyToken, async (req, res) => {
  try {
    const {
      projectId,
      startDate,
      endDate,
      status,
      limit,
      page = 1,
    } = req.query;

    const offset = (parseInt(page) - 1) * (parseInt(limit) || 30);

    const result = await AttendanceService.getAttendanceHistory(req.user.id, {
      projectId,
      startDate,
      endDate,
      status,
      limit: parseInt(limit) || 30,
      offset,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Get attendance history error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get attendance history',
    });
  }
});

/**
 * @route   GET /api/attendance/summary
 * @desc    Get monthly attendance summary
 * @access  Private
 */
router.get('/summary', verifyToken, async (req, res) => {
  try {
    const { projectId, month } = req.query;

    if (!projectId || !month) {
      return res.status(400).json({
        success: false,
        message: 'Project ID and month (YYYY-MM) are required',
      });
    }

    const summary = await AttendanceService.getAttendanceSummary(
      req.user.id,
      projectId,
      month
    );

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Get attendance summary error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get attendance summary',
    });
  }
});

/**
 * @route   GET /api/attendance/locations/:projectId
 * @desc    Get project locations for GPS verification
 * @access  Private
 */
router.get('/locations/:projectId', verifyToken, async (req, res) => {
  try {
    const { projectId } = req.params;

    const locations = await AttendanceService.getProjectLocations(projectId);

    res.json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.error('Get project locations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get project locations',
    });
  }
});

/**
 * @route   POST /api/attendance/locations
 * @desc    Create project location (Admin only)
 * @access  Private (Admin)
 */
router.post('/locations', verifyToken, async (req, res) => {
  try {
    // Check if user is admin or project manager
    if (req.user.role !== 'admin' && req.user.role !== 'project_manager') {
      return res.status(403).json({
        success: false,
        message: 'Only admins and project managers can create locations',
      });
    }

    const locationData = {
      ...req.body,
      created_by: req.user.id,
    };

    const location = await AttendanceService.createProjectLocation(locationData);

    res.status(201).json({
      success: true,
      message: 'Project location created successfully',
      data: location,
    });
  } catch (error) {
    console.error('Create project location error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create project location',
    });
  }
});

/**
 * @route   GET /api/attendance/settings
 * @desc    Get attendance settings for user's current project
 * @access  Private
 */
router.get('/settings', verifyToken, async (req, res) => {
  try {
    // For now, use a default project ID
    // In production, this should come from user's assigned project in database
    // Since we're in fallback mode, we'll use the first available project
    
    const defaultProjectId = 'PRJ-001'; // Default project for development
    
    try {
      const settings = await AttendanceService.getAttendanceSettings(defaultProjectId);
      
      res.json({
        success: true,
        data: settings,
      });
    } catch (serviceError) {
      // If AttendanceService fails, return default settings
      console.warn('AttendanceService unavailable, returning defaults:', serviceError.message);
      
      res.json({
        success: true,
        data: {
          latitude: -6.2088,
          longitude: 106.8456,
          radius: 100,
          work_start_time: '08:00',
          work_end_time: '17:00',
          late_threshold_minutes: 15,
          location_name: 'Default Project Location',
          message: 'Using default settings (database unavailable)'
        },
      });
    }
  } catch (error) {
    console.error('Get attendance settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get attendance settings',
    });
  }
});

/**
 * @route   GET /api/attendance/settings/:projectId
 * @desc    Get attendance settings for specific project (Admin/PM)
 * @access  Private
 */
router.get('/settings/:projectId', verifyToken, async (req, res) => {
  try {
    const { projectId } = req.params;

    const settings = await AttendanceService.getAttendanceSettings(projectId);

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Get attendance settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get attendance settings',
    });
  }
});

/**
 * @route   PUT /api/attendance/settings
 * @desc    Update attendance settings for user's current project (Admin/PM only)
 * @access  Private (Admin/PM)
 */
router.put('/settings', verifyToken, async (req, res) => {
  try {
    // Check if user is admin or project manager
    if (req.user.role !== 'admin' && req.user.role !== 'project_manager') {
      return res.status(403).json({
        success: false,
        message: 'Only admins and project managers can update settings',
      });
    }

    // For now, use a default project ID
    // In production, get from user's assigned project in database
    const defaultProjectId = 'PRJ-001';

    const settings = await AttendanceService.updateAttendanceSettings(
      defaultProjectId,
      req.body
    );

    res.json({
      success: true,
      message: 'Attendance settings updated successfully',
      data: settings,
    });
  } catch (error) {
    console.error('Update attendance settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update attendance settings',
    });
  }
});

/**
 * @route   PUT /api/attendance/settings/:projectId
 * @desc    Update attendance settings for specific project (Admin only)
 * @access  Private (Admin)
 */
router.put('/settings/:projectId', verifyToken, async (req, res) => {
  try {
    // Check if user is admin or project manager
    if (req.user.role !== 'admin' && req.user.role !== 'project_manager') {
      return res.status(403).json({
        success: false,
        message: 'Only admins and project managers can update settings',
      });
    }

    const { projectId } = req.params;

    const settings = await AttendanceService.updateAttendanceSettings(
      projectId,
      req.body
    );

    res.json({
      success: true,
      message: 'Attendance settings updated successfully',
      data: settings,
    });
  } catch (error) {
    console.error('Update attendance settings error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update attendance settings',
    });
  }
});

/**
 * @route   POST /api/attendance/leave-request
 * @desc    Submit leave request
 * @access  Private
 */
router.post('/leave-request', verifyToken, upload.single('attachment'), async (req, res) => {
  try {
    const {
      leaveType,
      startDate,
      endDate,
      reason,
      contactNumber,
    } = req.body;

    // Validation
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Leave type, dates, and reason are required',
      });
    }

    const attachmentUrl = req.file ? `/uploads/attendance/${req.file.filename}` : null;

    const leaveRequest = await AttendanceService.createLeaveRequest({
      userId: req.user.id,
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      reason,
      contact_number: contactNumber,
      attachment_url: attachmentUrl,
      status: 'pending',
    });

    // Send FCM notification to admins
    try {
      const fcmNotificationService = require('../services/FCMNotificationService');
      const User = require('../models/User');
      
      // Find all admins
      const admins = await User.findAll({
        where: { role: 'admin', is_active: true }
      });

      // Send notification to each admin
      for (const admin of admins) {
        await fcmNotificationService.sendLeaveApprovalRequest({
          adminId: admin.id,
          employee: req.user,
          leaveRequest
        });
      }
    } catch (fcmError) {
      console.warn('Failed to send FCM notification:', fcmError.message);
      // Don't fail the request if notification fails
    }

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      data: leaveRequest,
    });
  } catch (error) {
    console.error('Submit leave request error:', error);
    
    // Delete uploaded file if error occurs
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit leave request',
    });
  }
});

/**
 * @route   GET /api/attendance/leave-requests
 * @desc    Get leave requests (admin sees all, employee sees own)
 * @access  Private
 */
router.get('/leave-requests', verifyToken, async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereClause = {};
    
    // Non-admins can only see their own requests
    if (req.user.role !== 'admin') {
      whereClause.user_id = req.user.id;
    }

    if (status) {
      whereClause.status = status;
    }

    const leaveRequests = await AttendanceService.getLeaveRequests({
      where: whereClause,
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      ...leaveRequests,
    });
  } catch (error) {
    console.error('Get leave requests error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get leave requests',
    });
  }
});

/**
 * @route   PUT /api/attendance/leave-request/:id
 * @desc    Update leave request status (approve/reject)
 * @access  Private (Admin)
 */
router.put('/leave-request/:id', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can approve or reject leave requests',
      });
    }

    const { id } = req.params;
    const { status, rejection_reason } = req.body;

    // Validation
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status (approved/rejected) is required',
      });
    }

    if (status === 'rejected' && !rejection_reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required when rejecting',
      });
    }

    const leaveRequest = await AttendanceService.updateLeaveRequest(id, {
      status,
      rejection_reason: status === 'rejected' ? rejection_reason : null,
      reviewed_by: req.user.id,
      reviewed_at: new Date(),
    });

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
      });
    }

    // Send FCM notification to employee
    try {
      const fcmNotificationService = require('../services/FCMNotificationService');
      
      if (status === 'approved') {
        await fcmNotificationService.sendLeaveApproved({
          employeeId: leaveRequest.user_id,
          leaveRequest,
          approver: req.user,
        });
      } else if (status === 'rejected') {
        await fcmNotificationService.sendLeaveRejected({
          employeeId: leaveRequest.user_id,
          leaveRequest,
          rejector: req.user,
          reason: rejection_reason,
        });
      }
    } catch (fcmError) {
      console.warn('Failed to send FCM notification:', fcmError.message);
      // Don't fail the request if notification fails
    }

    res.json({
      success: true,
      message: `Leave request ${status} successfully`,
      data: leaveRequest,
    });
  } catch (error) {
    console.error('Update leave request error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update leave request',
    });
  }
});

module.exports = router;

