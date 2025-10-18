/**
 * User Notification Service
 * 
 * Multi-channel notification delivery system for User Management
 * Supports: Push (FCM), Email (SMTP), SMS (Twilio), In-App
 * 
 * @module services/UserNotificationService
 */

const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

class UserNotificationService {
  constructor() {
    this.firebaseInitialized = false;
    this.emailTransporter = null;
    this.twilioClient = null;
  }

  /**
   * Initialize Firebase Admin SDK for Push Notifications
   */
  initializeFirebase() {
    try {
      if (this.firebaseInitialized) return true;

      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
      
      if (!serviceAccountPath) {
        console.warn('⚠️  Firebase not configured. Push notifications disabled.');
        return false;
      }

      admin.initializeApp({
        credential: admin.credential.cert(require(serviceAccountPath)),
        projectId: process.env.FIREBASE_PROJECT_ID
      });

      this.firebaseInitialized = true;
      console.log('✅ Firebase Cloud Messaging initialized');
      return true;
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error.message);
      return false;
    }
  }

  /**
   * Initialize Email transporter
   */
  initializeEmail() {
    try {
      if (this.emailTransporter) return true;

      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️  SMTP not configured. Email notifications disabled.');
        return false;
      }

      this.emailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      console.log('✅ Email service initialized');
      return true;
    } catch (error) {
      console.error('❌ Email initialization failed:', error.message);
      return false;
    }
  }

  /**
   * Initialize Twilio SMS (optional)
   */
  initializeSMS() {
    try {
      if (this.twilioClient) return true;

      if (!process.env.TWILIO_ACCOUNT_SID) {
        console.warn('⚠️  Twilio not configured. SMS notifications disabled.');
        return false;
      }

      const twilio = require('twilio');
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      console.log('✅ Twilio SMS initialized');
      return true;
    } catch (error) {
      console.error('❌ Twilio initialization failed:', error.message);
      return false;
    }
  }

  /**
   * Send notification to specific user
   * 
   * @param {Object} params
   * @param {string} params.userId - Target user ID
   * @param {string} params.title - Notification title
   * @param {string} params.message - Notification message
   * @param {string} params.type - Type: 'info', 'success', 'warning', 'error'
   * @param {Array<string>} params.channels - ['push', 'email', 'sms']
   * @param {Object} params.data - Additional data
   */
  async sendToUser({ userId, title, message, type = 'info', channels = ['push'], data = {} }) {
    const { User, NotificationPreference, Notification } = require('../models');
    
    try {
      const user = await User.findByPk(userId);
      if (!user || !user.isActive) {
        throw new Error(`User ${userId} not found or inactive`);
      }

      // Get user preferences
      const preferences = await NotificationPreference.findOne({ where: { userId } });

      // Create in-app notification
      const notification = await Notification.create({
        userId,
        type,
        category: data.category || 'general',
        title,
        message,
        priority: data.priority || 'normal',
        channels,
        metadata: data,
        sentAt: new Date()
      });

      const results = {
        notificationId: notification.id,
        userId,
        channels: { in_app: { success: true, id: notification.id } }
      };

      // Send via requested channels
      if (channels.includes('push') && preferences?.pushEnabled !== false) {
        results.channels.push = await this.sendPush(preferences, { title, message, data });
      }

      if (channels.includes('email') && preferences?.emailEnabled !== false) {
        results.channels.email = await this.sendEmail(user, { title, message, data });
      }

      if (channels.includes('sms') && preferences?.smsEnabled !== false) {
        results.channels.sms = await this.sendSMS(user, { title, message });
      }

      return results;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Send notification to users with specific roles
   */
  async sendToRoles({ roles, title, message, type = 'info', channels = ['push'], data = {} }) {
    const { User } = require('../models');
    
    try {
      const users = await User.findAll({
        where: {
          role: { [Op.in]: roles },
          isActive: true
        }
      });

      console.log(`📢 Sending to ${users.length} users with roles: ${roles.join(', ')}`);

      const results = await Promise.allSettled(
        users.map(user => 
          this.sendToUser({ userId: user.id, title, message, type, channels, data })
        )
      );

      const summary = {
        total: users.length,
        successful: results.filter(r => r.status === 'fulfilled').length,
        failed: results.filter(r => r.status === 'rejected').length
      };

      console.log(`✅ Sent: ${summary.successful}/${summary.total}`);
      return summary;
    } catch (error) {
      console.error('Error sending to roles:', error);
      throw error;
    }
  }

  /**
   * Send push notification via Firebase
   */
  async sendPush(preferences, { title, message, data }) {
    try {
      if (!this.initializeFirebase()) {
        return { success: false, error: 'Firebase not initialized' };
      }

      const tokens = preferences?.deviceTokens || [];
      if (tokens.length === 0) {
        return { success: false, error: 'No device tokens' };
      }

      const response = await admin.messaging().sendMulticast({
        notification: { title, body: message },
        data: { ...data, timestamp: Date.now().toString() },
        tokens
      });

      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Send email notification
   */
  async sendEmail(user, { title, message, data }) {
    try {
      if (!this.initializeEmail()) {
        return { success: false, error: 'Email not initialized' };
      }

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3B82F6; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #F9FAFB; padding: 30px; }
            .footer { text-align: center; color: #6B7280; font-size: 12px; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h2>${title}</h2></div>
            <div class="content"><p>${message}</p></div>
            <div class="footer">
              <p>${process.env.APP_NAME || 'Nusantara YK'}</p>
              <p>This is an automated message. Do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const info = await this.emailTransporter.sendMail({
        from: `"${process.env.APP_NAME}" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: title,
        html
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Send SMS notification
   */
  async sendSMS(user, { title, message }) {
    try {
      if (!this.initializeSMS()) {
        return { success: false, error: 'SMS not initialized' };
      }

      const phone = user.profile?.phone;
      if (!phone) {
        return { success: false, error: 'No phone number' };
      }

      const sms = await this.twilioClient.messages.create({
        body: `${title}\n\n${message}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });

      return { success: true, messageSid: sms.sid };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Register device token for push
   */
  async registerToken(userId, token) {
    const { NotificationPreference } = require('../models');
    
    try {
      let prefs = await NotificationPreference.findOne({ where: { userId } });

      if (!prefs) {
        prefs = await NotificationPreference.create({
          userId,
          deviceTokens: [token]
        });
      } else {
        const tokens = prefs.deviceTokens || [];
        if (!tokens.includes(token)) {
          tokens.push(token);
          await prefs.update({ deviceTokens: tokens });
        }
      }

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Unregister device token
   */
  async unregisterToken(userId, token) {
    const { NotificationPreference } = require('../models');
    
    try {
      const prefs = await NotificationPreference.findOne({ where: { userId } });
      if (!prefs) return { success: true };

      const tokens = (prefs.deviceTokens || []).filter(t => t !== token);
      await prefs.update({ deviceTokens: tokens });

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId, { limit = 20, page = 1, unreadOnly = false }) {
    const { Notification } = require('../models');
    
    try {
      const offset = (page - 1) * limit;
      const where = { userId };
      
      if (unreadOnly) {
        where.readAt = null;
      }

      const { count, rows } = await Notification.findAndCountAll({
        where,
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      return {
        notifications: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    const { Notification } = require('../models');
    
    try {
      const notification = await Notification.findOne({
        where: { id: notificationId, userId }
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      await notification.update({ readAt: new Date() });
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark all as read
   */
  async markAllAsRead(userId) {
    const { Notification } = require('../models');
    
    try {
      await Notification.update(
        { readAt: new Date() },
        { where: { userId, readAt: null } }
      );
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton
module.exports = new UserNotificationService();
