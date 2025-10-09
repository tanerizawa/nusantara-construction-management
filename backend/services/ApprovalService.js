const ApprovalInstance = require('../models/ApprovalInstance');
const ApprovalStep = require('../models/ApprovalStep');
const ApprovalWorkflow = require('../models/ApprovalWorkflow');
const ProjectRAB = require('../models/ProjectRAB');
const User = require('../models/User');
const NotificationService = require('./NotificationService');

class ApprovalService {
  /**
   * Initialize approval process for RAB
   */
  static async initializeRABApproval(rabId, submittedBy) {
    try {
      // Get RAB item
      const rabItem = await ProjectRAB.findByPk(rabId);
      if (!rabItem) {
        throw new Error('RAB item not found');
      }

      // Get RAB workflow
      const workflow = await ApprovalWorkflow.findOne({
        where: { 
          entityType: 'rab',
          isActive: true 
        }
      });

      if (!workflow) {
        throw new Error('No active RAB approval workflow found');
      }

      // Calculate total RAB amount
      const totalAmount = parseFloat(rabItem.totalPrice || 0);

      // Create approval instance
      const instance = await ApprovalInstance.create({
        workflowId: workflow.id,
        entityId: rabId,
        entityType: 'rab',
        entityData: {
          rabId: rabItem.id,
          projectId: rabItem.projectId,
          category: rabItem.category,
          description: rabItem.description,
          quantity: rabItem.quantity,
          unitPrice: rabItem.unitPrice,
          totalPrice: rabItem.totalPrice,
          unit: rabItem.unit
        },
        totalAmount,
        submittedBy,
        overallStatus: 'pending'
      });

      // Create approval steps based on workflow and amount
      const steps = await this.createApprovalSteps(instance, workflow, totalAmount);

            // Send notification to approvers for the first step
      if (steps.length > 0) {
        await NotificationService.sendApprovalRequestNotification(instance.id, steps[0].id);
      }

      // Update RAB record with approval instance
      await ProjectRAB.update(
        { 
          approvalInstanceId: instance.id,
          approvalStatus: 'pending_approval',
          submittedForApprovalAt: new Date()
        },
        { 
          where: { id: rabId }
        }
      );

      return {
        instanceId: instance.id,
        currentStep: 1,
        totalSteps: steps.length,
        nextApprover: steps[0].requiredRole,
        status: 'pending'
      };

    } catch (error) {
      console.error('Error initializing RAB approval:', error);
      throw error;
    }
  }

  /**
   * Create approval steps based on workflow configuration
   */
  static async createApprovalSteps(instance, workflow, amount) {
    const steps = [];
    const workflowSteps = workflow.workflowSteps;

    for (const stepConfig of workflowSteps) {
      // Check if this step is required based on amount
      const shouldInclude = this.shouldIncludeStep(stepConfig, amount);
      
      if (shouldInclude) {
        const step = await ApprovalStep.create({
          instanceId: instance.id,
          stepNumber: stepConfig.step,
          stepName: stepConfig.name,
          requiredRole: stepConfig.role,
          status: stepConfig.step === 1 ? 'pending' : 'pending',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        });
        steps.push(step);
      }
    }

    return steps;
  }

  /**
   * Process approval decision
   */
  static async processApprovalDecision(instanceId, stepId, decision, comments, conditions, approverUserId) {
    try {
      const instance = await ApprovalInstance.findByPk(instanceId);
      const step = await ApprovalStep.findByPk(stepId);

      if (!instance || !step) {
        throw new Error('Approval instance or step not found');
      }

      // Update the current step
      await step.update({
        status: decision === 'approve' || decision === 'approve_with_conditions' ? 'approved' : 'rejected',
        decision,
        comments,
        conditions,
        approverUserId,
        approvedAt: new Date()
      });

            // Send notification about this decision
      await NotificationService.sendApprovalDecisionNotification(instanceId, currentStep.id, decision, userId);

      if (decision === 'reject') {
        // Reject the entire approval
        await instance.update({
          overallStatus: 'rejected',
          completedAt: new Date()
        });

        // Update RAB status
        await ProjectRAB.update(
          { approvalStatus: 'rejected' },
          { where: { approvalInstanceId: instanceId } }
        );

        return { status: 'rejected', completed: true };
      }

      // Check if this was the last step
      const totalSteps = await ApprovalStep.count({ where: { instanceId } });
      const completedSteps = await ApprovalStep.count({ 
        where: { 
          instanceId,
          status: 'approved'
        }
      });

      if (completedSteps === totalSteps) {
        // All steps approved - complete the approval
        await instance.update({
          overallStatus: 'approved',
          completedAt: new Date()
        });

        // Update RAB status
        await ProjectRAB.update(
          { 
            approvalStatus: 'approved',
            finalApprovedAt: new Date(),
            approvedAmount: instance.totalAmount
          },
          { where: { approvalInstanceId: instanceId } }
        );

        // Send completion notification
        await NotificationService.sendCompletionNotification(instanceId);

        return { status: 'approved', completed: true };
      }

      // Move to next step
      const nextStep = await ApprovalStep.findOne({
        where: {
          instanceId,
          stepNumber: step.stepNumber + 1,
          status: 'pending'
        }
      });

      if (nextStep) {
        await instance.update({ currentStep: nextStep.stepNumber });
        await this.sendApprovalNotification(instanceId, nextStep.id);
      }

      return { 
        status: 'pending', 
        completed: false,
        nextStep: nextStep ? nextStep.stepNumber : null
      };

    } catch (error) {
      console.error('Error processing approval decision:', error);
      throw error;
    }
  }

  /**
   * Get approval status and history
   */
  static async getApprovalStatus(instanceId) {
    try {
      const instance = await ApprovalInstance.findByPk(instanceId, {
        include: [
          {
            model: ApprovalStep,
            as: 'ApprovalSteps',
            order: [['stepNumber', 'ASC']]
          }
        ]
      });

      if (!instance) {
        throw new Error('Approval instance not found');
      }

      const steps = await ApprovalStep.findAll({
        where: { instanceId },
        order: [['stepNumber', 'ASC']]
      });

      return {
        instanceId: instance.id,
        overallStatus: instance.overallStatus,
        currentStep: instance.currentStep,
        totalAmount: instance.totalAmount,
        submittedBy: instance.submittedBy,
        submittedAt: instance.submittedAt,
        completedAt: instance.completedAt,
        steps: steps.map(step => ({
          id: step.id,
          stepNumber: step.stepNumber,
          stepName: step.stepName,
          requiredRole: step.requiredRole,
          approverUserId: step.approverUserId,
          status: step.status,
          decision: step.decision,
          comments: step.comments,
          conditions: step.conditions,
          approvedAt: step.approvedAt,
          dueDate: step.dueDate
        }))
      };

    } catch (error) {
      console.error('Error getting approval status:', error);
      throw error;
    }
  }

  /**
   * Get pending approvals for user
   */
  static async getPendingApprovals(userId, entityType = null, limit = 20, offset = 0) {
    try {
      const { Op } = require('sequelize');
      
      // Find user to get their role
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const whereClause = {
        status: 'pending',
        [Op.or]: [
          { approverUserId: userId },
          { requiredRole: user.role }
        ]
      };

      // Build include for ApprovalInstance
      const instanceInclude = {
        model: ApprovalInstance,
        as: 'ApprovalInstance',
        where: { overallStatus: 'pending' }
      };

      if (entityType) {
        instanceInclude.where.entityType = entityType;
      }

      const pendingSteps = await ApprovalStep.findAll({
        where: whereClause,
        include: [instanceInclude],
        order: [['created_at', 'ASC']],
        limit,
        offset
      });

      return pendingSteps.map(step => ({
        id: step.id,
        instanceId: step.instanceId,
        stepNumber: step.stepNumber,
        stepName: step.stepName,
        requiredRole: step.requiredRole,
        status: step.status,
        dueDate: step.dueDate,
        entityId: step.ApprovalInstance.entityId,
        entityType: step.ApprovalInstance.entityType,
        entityData: step.ApprovalInstance.entityData,
        totalAmount: step.ApprovalInstance.totalAmount,
        submittedBy: step.ApprovalInstance.submittedBy,
        submittedAt: step.ApprovalInstance.submittedAt
      }));

    } catch (error) {
      console.error('Error getting pending approvals:', error);
      return [];
    }
  }

  /**
   * Helper methods
   */
  static shouldIncludeStep(stepConfig, amount) {
    const conditions = stepConfig.conditions || {};
    
    if (conditions.min_amount && amount < conditions.min_amount) {
      return false;
    }
    
    if (conditions.max_amount && amount > conditions.max_amount) {
      return false;
    }
    
    return true;
  }

  static async sendApprovalNotification(instanceId, stepId) {
    // Implementation for sending notifications
    // This will be enhanced with email service integration
  }

  static async sendDecisionNotification(instanceId, stepId, decision, approverUserId) {
    // Notification logic to be implemented
  }

  static async sendCompletionNotification(instanceId) {
    // Notification logic to be implemented
  }

  /**
   * Process approval decision by instance ID (finds current user's pending step)
   */
  static async processApprovalDecisionByInstance(instanceId, userId, decision, comments) {
    try {
      // Find the approval instance
      const instance = await ApprovalInstance.findByPk(instanceId, {
        include: [{
          model: ApprovalStep,
          as: 'ApprovalSteps',
          where: {
            status: 'pending'
          },
          order: [['step_number', 'ASC']]
        }]
      });

      if (!instance) {
        throw new Error('Approval instance not found');
      }

      if (!instance.ApprovalSteps || instance.ApprovalSteps.length === 0) {
        throw new Error('No pending approval steps found');
      }

      // Get the current pending step
      const currentStep = instance.ApprovalSteps[0];

      // Check if user has permission to approve this step
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // For now, allow admin role to approve any step
      // In production, implement proper role-based approval logic
      if (user.role !== 'admin' && user.role !== currentStep.requiredRole) {
        throw new Error('User not authorized to approve this step');
      }

      // Update the current step
      await currentStep.update({
        status: decision === 'approved' ? 'approved' : 'rejected',
        decision: decision === 'approved' ? 'approve' : 'reject',
        comments,
        approverId: userId,
        approvedAt: new Date()
      });

      if (decision === 'rejected') {
        // Reject the entire approval
        await instance.update({
          overallStatus: 'rejected',
          completedAt: new Date()
        });

        return { 
          status: 'rejected', 
          completed: true,
          instanceId,
          stepNumber: currentStep.step_number
        };
      }

      // Check if this was the last step
      const totalSteps = await ApprovalStep.count({ where: { instanceId } });
      const approvedSteps = await ApprovalStep.count({ 
        where: { 
          instanceId,
          status: 'approved'
        }
      });

      if (approvedSteps === totalSteps) {
        // All steps approved - complete the approval
        await instance.update({
          overallStatus: 'approved',
          completedAt: new Date()
        });

        // Update RAB status if it's a RAB approval
        if (instance.entityType === 'rab') {
          await ProjectRAB.update(
            { 
              approvalStatus: 'approved',
              finalApprovedAt: new Date(),
              approvedAmount: instance.totalAmount
            },
            { where: { id: instance.entityId } }
          );
        }

        return { 
          status: 'completed', 
          approved: true,
          instanceId,
          stepNumber: currentStep.step_number,
          totalSteps,
          approvedSteps
        };
      } else {
        // Move to next step
        const nextStepNumber = parseInt(currentStep.step_number) + 1;
        await instance.update({
          currentStep: nextStepNumber
        });

        return { 
          status: 'approved', 
          completed: false,
          instanceId,
          stepNumber: currentStep.step_number,
          nextStep: nextStepNumber,
          totalSteps,
          approvedSteps
        };
      }

    } catch (error) {
      console.error('Error processing approval decision:', error);
      throw error;
    }
  }

  /**
   * Get user approval statistics
   */
  static async getUserApprovalStats(userId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const stats = await ApprovalStep.findAndCountAll({
        where: {
          approverUserId: userId,
          approvedAt: {
            [require('sequelize').Op.gte]: today
          }
        },
        attributes: ['decision'],
        raw: true
      });

      const approved = stats.rows.filter(s => s.decision === 'approve' || s.decision === 'approve_with_conditions').length;
      const rejected = stats.rows.filter(s => s.decision === 'reject').length;

      return {
        approved,
        rejected,
        total: stats.count
      };
    } catch (error) {
      console.error('Error getting user approval stats:', error);
      return { approved: 0, rejected: 0, total: 0 };
    }
  }

  /**
   * Get recent approvals processed by user
   */
  static async getRecentApprovals(userId, limit = 10) {
    try {
      const recentApprovals = await ApprovalStep.findAll({
        where: {
          approverUserId: userId,
          status: ['approved', 'rejected']
        },
        include: [
          {
            model: ApprovalInstance,
            as: 'ApprovalInstance',
            attributes: ['id', 'entityId', 'entityType', 'totalAmount', 'completedAt']
          }
        ],
        order: [['approvedAt', 'DESC']],
        limit,
        raw: false
      });

      return recentApprovals.map(approval => ({
        id: approval.id,
        entityId: approval.ApprovalInstance.entityId,
        entityType: approval.ApprovalInstance.entityType,
        status: approval.decision,
        totalAmount: approval.ApprovalInstance.totalAmount,
        completedAt: approval.approvedAt,
        comments: approval.comments
      }));
    } catch (error) {
      console.error('Error getting recent approvals:', error);
      return [];
    }
  }

  /**
   * Get submissions by user
   */
  static async getMySubmissions(userId, limit = 20, offset = 0) {
    try {
      const submissions = await ApprovalInstance.findAll({
        where: {
          submittedBy: userId
        },
        include: [
          {
            model: ApprovalStep,
            as: 'ApprovalSteps',
            attributes: ['stepNumber', 'stepName', 'status', 'decision'],
            order: [['stepNumber', 'ASC']]
          }
        ],
        order: [['submittedAt', 'DESC']],
        limit,
        offset,
        raw: false
      });

      return submissions.map(instance => ({
        id: instance.id,
        instanceId: instance.id,
        entityId: instance.entityId,
        entityType: instance.entityType,
        entityData: instance.entityData,
        totalAmount: instance.totalAmount,
        overallStatus: instance.overallStatus,
        currentStep: instance.currentStep,
        submittedAt: instance.submittedAt,
        completedAt: instance.completedAt,
        steps: instance.ApprovalSteps || []
      }));
    } catch (error) {
      console.error('Error getting user submissions:', error);
      return [];
    }
  }
}

module.exports = ApprovalService;
