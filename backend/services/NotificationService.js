const { sequelize } = require('../config/database');
const ApprovalNotification = require('../models/ApprovalNotification');
const User = require('../models/User');
const ApprovalInstance = require('../models/ApprovalInstance');
const ApprovalStep = require('../models/ApprovalStep');

class NotificationService {
  
  /**
   * Create a new notification
   */
  static async createNotification(data) {
    try {
      const notification = await ApprovalNotification.create({
        instanceId: data.instanceId,
        stepId: data.stepId,
        recipientUserId: data.userId,
        notificationType: data.type || 'general',
        subject: data.title,
        message: data.message,
        status: 'pending'
      });

      // Emit real-time notification if WebSocket is available
      if (global.io) {
        global.io.to(data.userId).emit('notification', {
          ...notification.toJSON(),
          timestamp: new Date()
        });
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Send approval request notification
   */
  static async sendApprovalRequestNotification(instanceId, stepId) {
    try {
      const step = await ApprovalStep.findByPk(stepId, {
        include: [{
          model: ApprovalInstance,
          as: 'ApprovalInstance',
          include: [{
            model: User,
            as: 'submitter'
          }]
        }]
      });

      if (!step) {
        throw new Error('Approval step not found');
      }

      // Find users with the required role
      const approvers = await User.findAll({
        where: { role: step.requiredRole, isActive: true }
      });

      const notifications = [];
      for (const approver of approvers) {
        const notification = await this.createNotification({
          userId: approver.id,
          instanceId: instanceId,
          stepId: stepId,
          type: 'approval_request',
          title: 'New Approval Request',
          message: `${step.stepName} required for ${step.ApprovalInstance.entityType.toUpperCase()} worth ${this.formatCurrency(step.ApprovalInstance.totalAmount)}`,
          priority: 'high',
          metadata: {
            entityType: step.ApprovalInstance.entityType,
            entityId: step.ApprovalInstance.entityId,
            amount: step.ApprovalInstance.totalAmount,
            submittedBy: step.ApprovalInstance.submittedBy,
            dueDate: step.dueDate
          }
        });
        notifications.push(notification);
      }

      return notifications;
    } catch (error) {
      console.error('Error sending approval request notification:', error);
      throw error;
    }
  }

  /**
   * Send approval decision notification
   */
  static async sendApprovalDecisionNotification(instanceId, stepId, decision, approverId) {
    try {
      const step = await ApprovalStep.findByPk(stepId, {
        include: [{
          model: ApprovalInstance,
          as: 'ApprovalInstance'
        }, {
          model: User,
          as: 'approver'
        }]
      });

      if (!step) {
        throw new Error('Approval step not found');
      }

      // Notify the submitter
      const submitterNotification = await this.createNotification({
        userId: step.ApprovalInstance.submittedBy,
        instanceId: instanceId,
        stepId: stepId,
        type: 'approval_decision',
        title: `Approval ${decision}`,
        message: `Your ${step.ApprovalInstance.entityType.toUpperCase()} request has been ${decision} by ${step.approver?.profile?.fullName || 'approver'}`,
        priority: decision === 'approved' ? 'medium' : 'high',
        metadata: {
          decision: decision,
          stepName: step.stepName,
          approverName: step.approver?.profile?.fullName,
          approvedAt: step.approvedAt,
          comments: step.comments
        }
      });

      return submitterNotification;
    } catch (error) {
      console.error('Error sending approval decision notification:', error);
      throw error;
    }
  }

  /**
   * Send completion notification
   */
  static async sendCompletionNotification(instanceId) {
    try {
      const instance = await ApprovalInstance.findByPk(instanceId, {
        include: [{
          model: User,
          as: 'submitter'
        }]
      });

      if (!instance) {
        throw new Error('Approval instance not found');
      }

      const notification = await this.createNotification({
        userId: instance.submittedBy,
        instanceId: instanceId,
        stepId: null,
        type: 'approval_completed',
        title: 'Approval Process Completed',
        message: `Your ${instance.entityType.toUpperCase()} request worth ${this.formatCurrency(instance.totalAmount)} has been ${instance.overallStatus}`,
        priority: 'medium',
        metadata: {
          entityType: instance.entityType,
          entityId: instance.entityId,
          overallStatus: instance.overallStatus,
          totalAmount: instance.totalAmount,
          completedAt: instance.completedAt
        }
      });

      return notification;
    } catch (error) {
      console.error('Error sending completion notification:', error);
      throw error;
    }
  }

  /**
   * Send escalation notification
   */
  static async sendEscalationNotification(stepId) {
    try {
      const step = await ApprovalStep.findByPk(stepId, {
        include: [{
          model: ApprovalInstance,
          as: 'ApprovalInstance'
        }]
      });

      if (!step) {
        throw new Error('Approval step not found');
      }

      // Find managers or escalation users
      const managers = await User.findAll({
        where: { role: 'admin', isActive: true }
      });

      const notifications = [];
      for (const manager of managers) {
        const notification = await this.createNotification({
          userId: manager.id,
          instanceId: step.instanceId,
          stepId: stepId,
          type: 'escalation',
          title: 'Approval Escalation',
          message: `${step.stepName} has been pending for more than the allowed time limit`,
          priority: 'urgent',
          metadata: {
            stepName: step.stepName,
            dueDate: step.dueDate,
            daysPending: Math.floor((new Date() - new Date(step.createdAt)) / (1000 * 60 * 60 * 24)),
            entityType: step.ApprovalInstance.entityType,
            amount: step.ApprovalInstance.totalAmount
          }
        });
        notifications.push(notification);
      }

      return notifications;
    } catch (error) {
      console.error('Error sending escalation notification:', error);
      throw error;
    }
  }

  /**
   * Get user notifications
   */
  static async getUserNotifications(userId, options = {}) {
    try {
      const { limit = 20, offset = 0, unreadOnly = false } = options;
      
      let whereClause = `recipient_user_id = '${userId}'`;
      if (unreadOnly) {
        whereClause += ` AND status = 'pending'`;
      }

      const notifications = await sequelize.query(`
        SELECT *
        FROM approval_notifications
        WHERE ${whereClause}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `, { type: sequelize.QueryTypes.SELECT });

      const total = await sequelize.query(`
        SELECT COUNT(*) as count
        FROM approval_notifications
        WHERE ${whereClause}
      `, { type: sequelize.QueryTypes.SELECT });

      return {
        notifications,
        total: parseInt(total[0].count),
        unreadCount: unreadOnly ? notifications.length : await this.getUnreadCount(userId)
      };
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId, userId) {
    try {
      const [affectedRows] = await ApprovalNotification.update(
        { status: 'read', readAt: new Date() },
        { 
          where: { 
            id: notificationId, 
            recipientUserId: userId 
          } 
        }
      );

      return affectedRows > 0;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId) {
    try {
      const [affectedRows] = await ApprovalNotification.update(
        { status: 'read', readAt: new Date() },
        { 
          where: { 
            recipientUserId: userId,
            status: 'pending'
          } 
        }
      );

      return affectedRows;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Get unread count
   */
  static async getUnreadCount(userId) {
    try {
      const count = await ApprovalNotification.count({
        where: { 
          recipientUserId: userId,
          status: 'pending'
        }
      });

      return count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  /**
   * Delete old notifications
   */
  static async cleanupOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const deletedCount = await ApprovalNotification.destroy({
        where: {
          createdAt: {
            [sequelize.Sequelize.Op.lt]: cutoffDate
          },
          isRead: true
        }
      });

      console.log(`Cleaned up ${deletedCount} old notifications`);
      return deletedCount;
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
      throw error;
    }
  }

  /**
   * Helper method to format currency
   */
  static formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}

module.exports = NotificationService;
