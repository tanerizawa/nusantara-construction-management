const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const NotificationToken = require('../models/NotificationToken');
const User = require('../models/User');

/**
 * FCM Notification Service for Push Notifications
 * Handles Firebase Cloud Messaging untuk web push notifications
 */
class FCMNotificationService {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize Firebase Admin SDK
   */
  async initialize() {
    if (this.initialized) {
      console.log('✓ FCM already initialized');
      return;
    }

    try {
      const serviceAccountPath = path.join(__dirname, '../config/firebase-service-account.json');
      
      // Use fs.readFileSync instead of require() to avoid caching issues
      const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8');
      const serviceAccount = JSON.parse(serviceAccountData);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
      });

      this.initialized = true;
      console.log('✓ Firebase Cloud Messaging initialized');
    } catch (error) {
      console.error('✗ Failed to initialize FCM:', error.message);
      console.warn('⚠ App will continue without push notifications');
      // Don't throw - allow app to run without notifications
    }
  }

  /**
   * Check if FCM is initialized
   */
  isInitialized() {
    return this.initialized;
  }

  /**
   * Register FCM token for user
   */
  async registerToken(userId, token, deviceType = 'web', browserInfo = {}) {
    try {
      // Check if token already exists
      const existingToken = await NotificationToken.findByToken(token);

      if (existingToken) {
        // Update existing token
        existingToken.user_id = userId;
        existingToken.device_type = deviceType;
        existingToken.browser_info = browserInfo;
        existingToken.is_active = true;
        existingToken.last_used_at = new Date();
        await existingToken.save();

        console.log(`✓ FCM token updated for user ${userId}`);
        return existingToken;
      }

      // Create new token
      const newToken = await NotificationToken.create({
        user_id: userId,
        token: token,
        device_type: deviceType,
        browser_info: browserInfo,
        is_active: true,
        last_used_at: new Date()
      });

      // Deactivate old tokens (older than 90 days)
      await NotificationToken.deactivateOldTokens(userId, token);

      console.log(`✓ FCM token registered for user ${userId}`);
      return newToken;
    } catch (error) {
      console.error('Error registering FCM token:', error);
      throw error;
    }
  }

  /**
   * Unregister specific FCM token
   */
  async unregisterToken(token) {
    try {
      const notificationToken = await NotificationToken.findByToken(token);
      
      if (notificationToken) {
        await notificationToken.deactivate();
        console.log(`✓ FCM token unregistered`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error unregistering FCM token:', error);
      throw error;
    }
  }

  /**
   * Unregister all tokens for a user
   */
  async unregisterUserTokens(userId) {
    try {
      const tokens = await NotificationToken.findActiveByUser(userId);
      
      for (const token of tokens) {
        await token.deactivate();
      }

      console.log(`✓ Unregistered ${tokens.length} tokens for user ${userId}`);
      return tokens.length;
    } catch (error) {
      console.error('Error unregistering user tokens:', error);
      throw error;
    }
  }

  /**
   * Send notification to specific user
   */
  async sendToUser({ 
    userId, 
    title, 
    body, 
    data = {}, 
    icon = '/icons/icon-192x192.png',
    image = null,
    clickAction = null
  }) {
    console.log(`📬 [FCM] sendToUser called for userId: ${userId}`);
    
    if (!this.initialized) {
      console.warn('⚠ FCM not initialized, skipping notification');
      return { success: false, message: 'FCM not initialized' };
    }

    try {
      // Get all active tokens for user
      const userTokens = await NotificationToken.findActiveByUser(userId);
      
      console.log(`🔑 [FCM] Found ${userTokens.length} active tokens for user ${userId}`);
      
      if (userTokens.length === 0) {
        console.log(`⚠ No active tokens for user ${userId}`);
        return { success: false, message: 'No active tokens' };
      }

      const tokens = userTokens.map(t => t.token);
      console.log(`🎯 [FCM] Tokens:`, tokens.map(t => t.substring(0, 20) + '...'));

      // Build notification payload
      const message = {
        notification: {
          title,
          body,
          icon,
        },
        data: {
          ...data,
          timestamp: new Date().toISOString()
        },
        tokens
      };

      // Add optional fields
      if (image) {
        message.notification.image = image;
      }

      if (clickAction) {
        message.webpush = {
          fcmOptions: {
            link: clickAction
          }
        };
      }

      console.log(`📨 [FCM] Sending message:`, { title, body, tokenCount: tokens.length });

      // Send multicast message
      const response = await admin.messaging().sendEachForMulticast(message);

      console.log(`✅ [FCM] Response: ${response.successCount}/${tokens.length} delivered`);
      
      if (response.failureCount > 0) {
        console.warn(`⚠️ [FCM] ${response.failureCount} failures:`, response.responses.filter(r => !r.success).map(r => r.error?.code));
      }

      console.log(`✓ Sent notification to user ${userId}: ${response.successCount}/${tokens.length} delivered`);

      // Handle failed tokens
      if (response.failureCount > 0) {
        await this.handleFailedTokens(tokens, response.responses);
      }

      // Update last_used_at for all tokens
      for (const token of userTokens) {
        await token.markAsUsed();
      }

      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount
      };
    } catch (error) {
      console.error('Error sending notification to user:', error);
      throw error;
    }
  }

  /**
   * Send notification to multiple users
   */
  async sendToMultipleUsers({ userIds, title, body, data = {}, icon, image, clickAction }) {
    console.log(`📤 [FCM] sendToMultipleUsers called for ${userIds.length} users:`, userIds);
    
    const results = [];

    for (const userId of userIds) {
      try {
        console.log(`📤 [FCM] Sending to user ${userId}...`);
        const result = await this.sendToUser({
          userId,
          title,
          body,
          data,
          icon,
          image,
          clickAction
        });
        console.log(`✅ [FCM] Result for ${userId}:`, result);
        results.push({ userId, ...result });
      } catch (error) {
        console.error(`❌ [FCM] Error sending to user ${userId}:`, error.message);
        results.push({ userId, success: false, error: error.message });
      }
    }

    console.log(`📊 [FCM] sendToMultipleUsers completed. Total: ${results.length}, Success: ${results.filter(r => r.success).length}`);
    return results;
  }

  /**
   * Send leave approval request notification to admin
   */
  async sendLeaveApprovalRequest({ adminId, employee, leaveRequest }) {
    const title = '📝 New Leave Request';
    const body = `${employee.profile?.full_name || employee.username} requested ${leaveRequest.leave_type} leave`;
    
    const data = {
      type: 'leave_approval_request',
      leaveRequestId: leaveRequest.id.toString(),
      employeeId: employee.id.toString(),
      employeeName: employee.profile?.full_name || employee.username,
      leaveType: leaveRequest.leave_type,
      startDate: leaveRequest.start_date,
      endDate: leaveRequest.end_date
    };

    const clickAction = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/attendance/leave-request?id=${leaveRequest.id}`;

    return await this.sendToUser({
      userId: adminId,
      title,
      body,
      data,
      clickAction
    });
  }

  /**
   * Send leave approved notification to employee
   */
  async sendLeaveApproved({ employeeId, leaveRequest, approver }) {
    const title = '✅ Leave Request Approved';
    const body = `Your ${leaveRequest.leave_type} leave from ${leaveRequest.start_date} to ${leaveRequest.end_date} has been approved`;
    
    const data = {
      type: 'leave_approved',
      leaveRequestId: leaveRequest.id.toString(),
      leaveType: leaveRequest.leave_type,
      startDate: leaveRequest.start_date,
      endDate: leaveRequest.end_date,
      approverName: approver.profile?.full_name || approver.username
    };

    const clickAction = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/attendance/leave-request`;

    return await this.sendToUser({
      userId: employeeId,
      title,
      body,
      data,
      clickAction
    });
  }

  /**
   * Send leave rejected notification to employee
   */
  async sendLeaveRejected({ employeeId, leaveRequest, rejector, reason }) {
    const title = '❌ Leave Request Rejected';
    const body = reason 
      ? `Your leave request was rejected: ${reason}`
      : `Your ${leaveRequest.leave_type} leave request was rejected`;
    
    const data = {
      type: 'leave_rejected',
      leaveRequestId: leaveRequest.id.toString(),
      leaveType: leaveRequest.leave_type,
      startDate: leaveRequest.start_date,
      endDate: leaveRequest.end_date,
      rejectorName: rejector.profile?.full_name || rejector.username,
      reason: reason || 'No reason provided'
    };

    const clickAction = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/attendance/leave-request`;

    return await this.sendToUser({
      userId: employeeId,
      title,
      body,
      data,
      clickAction
    });
  }

  /**
   * Send attendance clock-in reminder
   */
  async sendAttendanceReminder(userId) {
    const title = '⏰ Time to Clock In!';
    const body = 'Don\'t forget to clock in for today\'s attendance';
    
    const data = {
      type: 'attendance_reminder',
      timestamp: new Date().toISOString()
    };

    const clickAction = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/attendance/clock-in`;

    return await this.sendToUser({
      userId,
      title,
      body,
      data,
      clickAction
    });
  }

  /**
   * Send clock-out reminder
   */
  async sendClockOutReminder(userId) {
    const title = '🔔 Remember to Clock Out';
    const body = 'Your work day is ending. Don\'t forget to clock out!';
    
    const data = {
      type: 'clockout_reminder',
      timestamp: new Date().toISOString()
    };

    const clickAction = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/attendance/clock-out`;

    return await this.sendToUser({
      userId,
      title,
      body,
      data,
      clickAction
    });
  }

  /**
   * Handle failed tokens (invalid or unregistered)
   */
  async handleFailedTokens(tokens, responses) {
    try {
      for (let i = 0; i < responses.length; i++) {
        const response = responses[i];
        
        if (!response.success) {
          const errorCode = response.error?.code;
          
          // Deactivate invalid tokens
          if (
            errorCode === 'messaging/invalid-registration-token' ||
            errorCode === 'messaging/registration-token-not-registered'
          ) {
            const token = tokens[i];
            const notificationToken = await NotificationToken.findByToken(token);
            
            if (notificationToken) {
              await notificationToken.deactivate();
              console.warn(`⚠ Deactivated invalid token: ${errorCode}`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error handling failed tokens:', error);
    }
  }

  /**
   * Send test notification (for development)
   */
  async sendTestNotification(userId) {
    const title = '🧪 Test Notification';
    const body = 'This is a test notification from Nusantara Attendance System';
    
    const data = {
      type: 'test',
      timestamp: new Date().toISOString()
    };

    return await this.sendToUser({
      userId,
      title,
      body,
      data
    });
  }
}

// Export singleton instance
const fcmNotificationService = new FCMNotificationService();
module.exports = fcmNotificationService;
