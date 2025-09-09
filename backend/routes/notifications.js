const express = require('express');
const { verifyToken } = require('../middleware/auth');
const NotificationService = require('../services/NotificationService');

const router = express.Router();

// ========== NOTIFICATION API ENDPOINTS ==========

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit, offset, unreadOnly } = req.query;
    
    const options = {
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0,
      unreadOnly: unreadOnly === 'true'
    };

    const result = await NotificationService.getUserNotifications(userId, options);

    res.json({
      success: true,
      data: result,
      message: 'Notifications retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve notifications',
      details: error.message
    });
  }
});

// @route   GET /api/notifications/unread-count
// @desc    Get unread notification count
// @access  Private
router.get('/unread-count', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await NotificationService.getUnreadCount(userId);

    res.json({
      success: true,
      data: { count },
      message: 'Unread count retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve unread count',
      details: error.message
    });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const success = await NotificationService.markAsRead(id, userId);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found or access denied'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read',
      details: error.message
    });
  }
});

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.put('/mark-all-read', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const affectedRows = await NotificationService.markAllAsRead(userId);

    res.json({
      success: true,
      data: { markedCount: affectedRows },
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark all notifications as read',
      details: error.message
    });
  }
});

// @route   POST /api/notifications/test
// @desc    Create test notification (development only)
// @access  Private
router.post('/test', verifyToken, async (req, res) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        error: 'Test notifications not allowed in production'
      });
    }

    const userId = req.user.id;
    const { type = 'completed', title = 'Test Notification', message = 'This is a test notification' } = req.body;
    
    const notification = await NotificationService.createNotification({
      userId,
      instanceId: '55fd8f6f-4481-4fbf-9fa1-537d886d7e09', // Use existing instance
      stepId: null,
      type,
      title,
      message,
      priority: 'medium',
      metadata: { isTest: true }
    });

    res.json({
      success: true,
      data: notification,
      message: 'Test notification created successfully'
    });
  } catch (error) {
    console.error('Error creating test notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create test notification',
      details: error.message
    });
  }
});

module.exports = router;
