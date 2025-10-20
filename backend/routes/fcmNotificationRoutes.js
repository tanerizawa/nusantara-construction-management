const express = require('express');
const router = express.Router();
const fcmNotificationService = require('../services/FCMNotificationService');
const { verifyToken } = require('../middleware/auth');

/**
 * @route   POST /api/fcm-notifications/register-token
 * @desc    Register FCM token for push notifications
 * @access  Private
 */
router.post('/register-token', verifyToken, async (req, res) => {
  try {
    const { token, deviceType, browserInfo } = req.body;
    const userId = req.user.id;

    // Validation
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'FCM token is required'
      });
    }

    // Register token
    const notificationToken = await fcmNotificationService.registerToken(
      userId,
      token,
      deviceType || 'web',
      browserInfo || {}
    );

    res.json({
      success: true,
      message: 'FCM token registered successfully',
      data: {
        id: notificationToken.id,
        deviceType: notificationToken.device_type,
        registeredAt: notificationToken.created_at
      }
    });
  } catch (error) {
    console.error('Error registering FCM token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register FCM token',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/fcm-notifications/unregister-token
 * @desc    Unregister FCM token
 * @access  Private
 */
router.delete('/unregister-token', verifyToken, async (req, res) => {
  try {
    const { token } = req.body;

    // Validation
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'FCM token is required'
      });
    }

    // Unregister token
    const success = await fcmNotificationService.unregisterToken(token);

    if (success) {
      res.json({
        success: true,
        message: 'FCM token unregistered successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'FCM token not found'
      });
    }
  } catch (error) {
    console.error('Error unregistering FCM token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unregister FCM token',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/fcm-notifications/unregister-all
 * @desc    Unregister all FCM tokens for current user
 * @access  Private
 */
router.delete('/unregister-all', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Unregister all tokens
    const count = await fcmNotificationService.unregisterUserTokens(userId);

    res.json({
      success: true,
      message: `${count} FCM token(s) unregistered successfully`,
      count
    });
  } catch (error) {
    console.error('Error unregistering all FCM tokens:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unregister FCM tokens',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/fcm-notifications/test
 * @desc    Send test notification (development only)
 * @access  Private
 */
router.post('/test', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if FCM is initialized
    if (!fcmNotificationService.isInitialized()) {
      return res.status(503).json({
        success: false,
        message: 'FCM service is not initialized. Please check Firebase configuration.'
      });
    }

    // Send test notification
    const result = await fcmNotificationService.sendTestNotification(userId);

    if (result.success) {
      res.json({
        success: true,
        message: 'Test notification sent successfully',
        data: {
          successCount: result.successCount,
          failureCount: result.failureCount
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message || 'Failed to send test notification'
      });
    }
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test notification',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/fcm-notifications/status
 * @desc    Get FCM service status
 * @access  Private
 */
router.get('/status', verifyToken, async (req, res) => {
  try {
    const NotificationToken = require('../models/NotificationToken');
    const userId = req.user.id;

    // Get user's active tokens
    const activeTokens = await NotificationToken.findActiveByUser(userId);

    res.json({
      success: true,
      data: {
        fcmInitialized: fcmNotificationService.isInitialized(),
        activeTokensCount: activeTokens.length,
        tokens: activeTokens.map(t => ({
          id: t.id,
          deviceType: t.device_type,
          lastUsed: t.last_used_at,
          registeredAt: t.created_at
        }))
      }
    });
  } catch (error) {
    console.error('Error getting FCM status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get FCM status',
      error: error.message
    });
  }
});

module.exports = router;
