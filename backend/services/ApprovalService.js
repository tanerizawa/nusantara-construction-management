const ApprovalWorkflow = require('../models/ApprovalWorkflow');
const ApprovalInstance = require('../models/ApprovalInstance');
const ApprovalStep = require('../models/ApprovalStep');
const ApprovalNotification = require('../models/ApprovalNotification');
const ProjectRAB = require('../models/ProjectRAB');
const User = require('../models/User');

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

      // Send notification to first approver
      await this.sendApprovalNotification(instance.id, steps[0].id);

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
      await this.sendDecisionNotification(instanceId, stepId, decision, approverUserId);

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
        await this.sendCompletionNotification(instanceId);

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
      const whereClause = {
        status: 'pending'
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
        entityType: step.ApprovalInstance.entityType,
        entityId: step.ApprovalInstance.entityId,
        entityData: step.ApprovalInstance.entityData,
        requestedBy: step.ApprovalInstance.requestedBy,
        createdAt: step.ApprovalInstance.createdAt,
        currentStep: step.ApprovalInstance.currentStep
      }));

    } catch (error) {
      console.error('Error getting pending approvals:', error);
      throw error;
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
    console.log(`Sending approval notification for instance ${instanceId}, step ${stepId}`);
  }

  static async sendDecisionNotification(instanceId, stepId, decision, approverUserId) {
    console.log(`Sending decision notification: ${decision} for instance ${instanceId}`);
  }

  static async sendCompletionNotification(instanceId) {
    console.log(`Sending completion notification for instance ${instanceId}`);
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
}

module.exports = ApprovalService;
