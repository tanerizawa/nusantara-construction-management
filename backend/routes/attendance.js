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
 * @desc    Get today's attendance
 * @access  Private
 */
router.get('/today', verifyToken, async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required',
      });
    }

    const attendance = await AttendanceService.getTodayAttendance(
      req.user.id,
      projectId
    );

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
 * @route   GET /api/attendance/settings/:projectId
 * @desc    Get attendance settings
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
 * @route   PUT /api/attendance/settings/:projectId
 * @desc    Update attendance settings (Admin only)
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

module.exports = router;
