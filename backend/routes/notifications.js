const express = require('express');
const { verifyToken } = require('../middleware/auth');
const NotificationService = require('../services/NotificationService');
const { Notification } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// ========== UNIFIED NOTIFICATION API ENDPOINTS ==========

/**
 * @route   GET /api/notifications
 * @desc    Get user notifications (combined from all sources)
 * @access  Private
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0, unreadOnly = 'false', category } = req.query;
    
    const options = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      unreadOnly: unreadOnly === 'true',
      category: category || null
    };

    // Get approval notifications
    let approvalNotifications = [];
    try {
      const approvalResult = await NotificationService.getUserNotifications(userId, options);
      approvalNotifications = (approvalResult.notifications || []).map(n => ({
        ...n,
        source: 'approval',
        notificationType: n.notification_type || n.notificationType || 'approval_request',
        createdAt: n.created_at || n.createdAt
      }));
    } catch (err) {
      console.warn('Error fetching approval notifications:', err.message);
    }

    // Get general notifications from Notification table
    let generalNotifications = [];
    try {
      const whereClause = { userId };
      if (options.unreadOnly) {
        whereClause.readAt = null;
      }
      if (options.category && options.category !== 'all') {
        whereClause.category = options.category;
      }

      const generalResult = await Notification.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit: options.limit,
        offset: options.offset
      });

      generalNotifications = generalResult.map(n => ({
        id: n.id,
        subject: n.title,
        message: n.message,
        notificationType: n.type || 'info',
        category: n.category || 'system',
        status: n.readAt ? 'read' : 'pending',
        priority: n.priority || 'normal',
        createdAt: n.createdAt,
        readAt: n.readAt,
        actionUrl: n.actionUrl,
        source: 'general'
      }));
    } catch (err) {
      console.warn('Error fetching general notifications:', err.message);
    }

    // Combine and sort by date
    let allNotifications = [...approvalNotifications, ...generalNotifications];
    allNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply limit after combining
    allNotifications = allNotifications.slice(0, options.limit);

    // Calculate counts
    const unreadCount = allNotifications.filter(n => n.status === 'pending' || !n.readAt).length;
    const total = approvalNotifications.length + generalNotifications.length;

    res.json({
      success: true,
      data: {
        notifications: allNotifications,
        total,
        unreadCount
      },
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

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get unread notification count
 * @access  Private
 */
router.get('/unread-count', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get counts from both sources
    let approvalCount = 0;
    let generalCount = 0;

    try {
      approvalCount = await NotificationService.getUnreadCount(userId);
    } catch (err) {
      console.warn('Error getting approval unread count:', err.message);
    }

    try {
      generalCount = await Notification.count({
        where: {
          userId,
          readAt: null
        }
      });
    } catch (err) {
      console.warn('Error getting general unread count:', err.message);
    }

    const count = approvalCount + generalCount;

    res.json({
      success: true,
      data: { 
        count,
        breakdown: {
          approval: approvalCount,
          general: generalCount
        }
      },
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

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    let success = false;

    // Try to mark in approval notifications
    try {
      success = await NotificationService.markAsRead(id, userId);
    } catch (err) {
      // Not found in approval notifications, continue
    }

    // If not found, try general notifications
    if (!success) {
      try {
        const [affectedRows] = await Notification.update(
          { readAt: new Date() },
          { where: { id, userId } }
        );
        success = affectedRows > 0;
      } catch (err) {
        console.warn('Error marking general notification as read:', err.message);
      }
    }

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

/**
 * @route   PUT /api/notifications/mark-all-read
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/mark-all-read', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    let totalMarked = 0;

    // Mark approval notifications as read
    try {
      const approvalMarked = await NotificationService.markAllAsRead(userId);
      totalMarked += approvalMarked;
    } catch (err) {
      console.warn('Error marking approval notifications:', err.message);
    }

    // Mark general notifications as read
    try {
      const [generalMarked] = await Notification.update(
        { readAt: new Date() },
        { where: { userId, readAt: null } }
      );
      totalMarked += generalMarked;
    } catch (err) {
      console.warn('Error marking general notifications:', err.message);
    }

    res.json({
      success: true,
      data: { markedCount: totalMarked },
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

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete a notification
 * @access  Private
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    let deleted = false;

    // Try to delete from general notifications first
    try {
      const result = await Notification.destroy({
        where: { id, userId }
      });
      deleted = result > 0;
    } catch (err) {
      console.warn('Error deleting general notification:', err.message);
    }

    // If not found, try approval notifications (soft delete by marking as read)
    if (!deleted) {
      try {
        // For approval notifications, we just mark as read since deleting might affect audit
        const success = await NotificationService.markAsRead(id, userId);
        deleted = success;
      } catch (err) {
        console.warn('Error soft-deleting approval notification:', err.message);
      }
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found or access denied'
      });
    }

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

/**
 * @route   POST /api/notifications/create-system
 * @desc    Create a system notification (internal use)
 * @access  Private (Admin only)
 */
router.post('/create-system', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const { userId, title, message, type = 'info', category = 'system', priority = 'normal', actionUrl } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({
        success: false,
        error: 'userId, title, and message are required'
      });
    }

    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      category,
      priority,
      actionUrl,
      channels: ['push', 'in_app'],
      sentAt: new Date()
    });

    res.json({
      success: true,
      data: notification,
      message: 'System notification created successfully'
    });
  } catch (error) {
    console.error('Error creating system notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create notification',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/notifications/test
 * @desc    Create test notification (development only)
 * @access  Private
 */
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
    const { 
      type = 'info', 
      title = 'Test Notification', 
      message = 'This is a test notification',
      category = 'system'
    } = req.body;
    
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      category,
      priority: 'normal',
      channels: ['in_app'],
      sentAt: new Date()
    });

    // Emit real-time notification if WebSocket is available
    if (global.io) {
      global.io.to(userId).emit('notification', {
        ...notification.toJSON(),
        timestamp: new Date()
      });
    }

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
