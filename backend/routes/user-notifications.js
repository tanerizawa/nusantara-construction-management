const express = require('express');
const router = express.Router();
const UserNotificationService = require('../services/UserNotificationService');
const { Notification, NotificationPreference } = require('../models');
const { verifyToken } = require('../middleware/auth');

// ====================================================================
// NOTIFICATION DELIVERY ROUTES (Admin only - no auth middleware needed here as they're internal)
// ====================================================================

/**
 * @route   POST /api/notifications/send
 * @desc    Send notification to specific user
 * @access  Private (Admin, Super Admin)
 */
router.post('/send', async (req, res) => {
  try {
    const { userId, title, message, type, channels, data } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({
        success: false,
        error: 'userId, title, and message are required'
      });
    }

    const result = await UserNotificationService.sendToUser({
      userId,
      title,
      message,
      type: type || 'info',
      channels: channels || ['push', 'email'],
      data: data || {}
    });

    res.json({
      success: true,
      data: result,
      message: 'Notification sent successfully'
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send notification',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/notifications/send-to-roles
 * @desc    Send notification to users with specific roles
 * @access  Private (Admin, Super Admin)
 */
router.post('/send-to-roles', async (req, res) => {
  try {
    const { roles, title, message, type, channels, data } = req.body;

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'roles array is required'
      });
    }

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: 'title and message are required'
      });
    }

    const result = await UserNotificationService.sendToRoles({
      roles,
      title,
      message,
      type: type || 'info',
      channels: channels || ['push', 'email'],
      data: data || {}
    });

    res.json({
      success: true,
      data: result,
      message: `Notification sent to ${result.successful}/${result.total} users`
    });
  } catch (error) {
    console.error('Error sending notification to roles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send notification',
      details: error.message
    });
  }
});

// ====================================================================
// USER NOTIFICATION ROUTES (Protected - requires authentication)
// ====================================================================

/**
 * @route   GET /api/notifications/my
 * @desc    Get current user's notifications
 * @access  Private
 */
router.get('/my', verifyToken, async (req, res) => {
  try {
    // Get userId from JWT token (set by verifyToken middleware)
    const userId = req.user.id;

    const {
      limit = 20,
      page = 1,
      unreadOnly = false
    } = req.query;

    const result = await UserNotificationService.getUserNotifications(userId, {
      limit: parseInt(limit),
      page: parseInt(page),
      unreadOnly: unreadOnly === 'true'
    });

    res.json({
      success: true,
      data: result.notifications,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/notifications/my/unread-count
 * @desc    Get unread notification count
 * @access  Private
 */
router.get('/my/unread-count', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.count({
      where: {
        userId,
        readAt: null
      }
    });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch unread count',
      details: error.message
    });
  }
});

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await UserNotificationService.markAsRead(id, userId);

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark as read',
      details: error.message
    });
  }
});

/**
 * @route   PATCH /api/notifications/mark-all-read
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.patch('/mark-all-read', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    await UserNotificationService.markAllAsRead(userId);

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark all as read',
      details: error.message
    });
  }
});

// ====================================================================
// DEVICE TOKEN MANAGEMENT
// ====================================================================

/**
 * @route   POST /api/notifications/register-device
 * @desc    Register device token for push notifications
 * @access  Private
 */
router.post('/register-device', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'token is required'
      });
    }

    await UserNotificationService.registerToken(userId, token);

    res.json({
      success: true,
      message: 'Device token registered successfully'
    });
  } catch (error) {
    console.error('Error registering device token:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register device token',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/notifications/unregister-device
 * @desc    Unregister device token
 * @access  Private
 */
router.post('/unregister-device', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'token is required'
      });
    }

    await UserNotificationService.unregisterToken(userId, token);

    res.json({
      success: true,
      message: 'Device token unregistered successfully'
    });
  } catch (error) {
    console.error('Error unregistering device token:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unregister device token',
      details: error.message
    });
  }
});

// ====================================================================
// NOTIFICATION PREFERENCES
// ====================================================================

/**
 * @route   GET /api/notifications/preferences
 * @desc    Get user notification preferences
 * @access  Private
 */
router.get('/preferences', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    let preferences = await NotificationPreference.findOne({
      where: { userId }
    });

    if (!preferences) {
      // Create default preferences
      preferences = await NotificationPreference.create({
        userId,
        emailEnabled: true,
        pushEnabled: true,
        smsEnabled: false,
        categories: {
          user_management: true,
          project_updates: true,
          approvals: true,
          budget_alerts: true,
          system: true
        }
      });
    }

    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch preferences',
      details: error.message
    });
  }
});

/**
 * @route   PUT /api/notifications/preferences
 * @desc    Update notification preferences
 * @access  Private
 */
router.put('/preferences', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { emailEnabled, pushEnabled, smsEnabled, categories, quietHours } = req.body;

    let preferences = await NotificationPreference.findOne({
      where: { userId }
    });

    if (!preferences) {
      preferences = await NotificationPreference.create({
        userId,
        emailEnabled,
        pushEnabled,
        smsEnabled,
        categories,
        quietHours
      });
    } else {
      await preferences.update({
        emailEnabled,
        pushEnabled,
        smsEnabled,
        categories,
        quietHours
      });
    }

    res.json({
      success: true,
      data: preferences,
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update preferences',
      details: error.message
    });
  }
});

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id, userId }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    await notification.destroy();

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete notification',
      details: error.message
    });
  }
});

module.exports = router;
