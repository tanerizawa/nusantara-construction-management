// Approval Actions Service
// Handles approve, reject, and other approval-related actions

import apiService from '../services/api';
import { getApprovalRequirements, calculateApprovalProgress } from './approvalMatrix';

export class ApprovalActionService {
  constructor() {
    this.notificationCallbacks = [];
  }

  // Subscribe to approval notifications
  subscribe(callback) {
    this.notificationCallbacks.push(callback);
  }

  // Unsubscribe from notifications
  unsubscribe(callback) {
    this.notificationCallbacks = this.notificationCallbacks.filter(cb => cb !== callback);
  }

  // Notify all subscribers
  notify(notification) {
    this.notificationCallbacks.forEach(callback => callback(notification));
  }

  // Approve an item
  async approveItem(approvalData) {
    const {
      approvalId,
      approvalType,
      amount,
      userRole,
      userId,
      userName,
      comments = '',
      conditions = []
    } = approvalData;

    try {
      console.log('=== APPROVING ITEM ===');
      console.log('Approval Data:', approvalData);

      // Validate approval authority
      const requirements = getApprovalRequirements(approvalType, amount);
      if (!requirements.requiredRoles.includes(userRole)) {
        throw new Error(`User role '${userRole}' does not have authority to approve this item`);
      }

      // Create approval record
      const approvalRecord = {
        approvalId,
        approvalType,
        amount,
        approverRole: userRole,
        approverId: userId,
        approverName: userName,
        status: 'approved',
        comments,
        conditions,
        approvedAt: new Date().toISOString(),
        timeToApprove: this.calculateTimeToApprove(approvalData.createdAt)
      };

      // Save to database
      const response = await apiService.post('/database/query', {
        query: `
          INSERT INTO approval_history (
            approval_id, approval_type, approver_role, approver_id, approver_name,
            status, comments, conditions, approved_at, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
          RETURNING *
        `,
        params: [
          approvalId,
          approvalType,
          userRole,
          userId,
          userName,
          'approved',
          comments,
          JSON.stringify(conditions),
          approvalRecord.approvedAt
        ]
      });

      // Update the main record status
      await this.updateMainRecordStatus(approvalType, approvalId, 'approved', userId);

      // Check if all required approvals are complete
      const currentApprovals = await this.getApprovalHistory(approvalId);
      const progress = calculateApprovalProgress(approvalType, amount, currentApprovals);

      if (progress.isComplete) {
        await this.handleCompleteApproval(approvalType, approvalId);
        this.notify({
          type: 'approval_complete',
          approvalId,
          approvalType,
          message: `All required approvals completed for ${approvalType} ${approvalId}`
        });
      } else {
        this.notify({
          type: 'approval_progress',
          approvalId,
          approvalType,
          progress,
          message: `Approval progress: ${progress.percentage}% (${progress.approvedCount}/${progress.totalRequired})`
        });
      }

      return {
        success: true,
        approvalRecord,
        progress,
        message: 'Item successfully approved'
      };

    } catch (error) {
      console.error('Error approving item:', error);
      this.notify({
        type: 'approval_error',
        approvalId,
        message: `Error approving item: ${error.message}`
      });
      throw error;
    }
  }

  // Reject an item
  async rejectItem(approvalData) {
    const {
      approvalId,
      approvalType,
      userRole,
      userId,
      userName,
      reason,
      comments = ''
    } = approvalData;

    try {
      console.log('=== REJECTING ITEM ===');
      console.log('Rejection Data:', approvalData);

      if (!reason || reason.trim().length < 10) {
        throw new Error('Rejection reason must be at least 10 characters long');
      }

      // Create rejection record
      const rejectionRecord = {
        approvalId,
        approvalType,
        approverRole: userRole,
        approverId: userId,
        approverName: userName,
        status: 'rejected',
        reason,
        comments,
        rejectedAt: new Date().toISOString()
      };

      // Save to database
      await apiService.post('/database/query', {
        query: `
          INSERT INTO approval_history (
            approval_id, approval_type, approver_role, approver_id, approver_name,
            status, comments, approved_at, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
          RETURNING *
        `,
        params: [
          approvalId,
          approvalType,
          userRole,
          userId,
          userName,
          'rejected',
          `REJECTED: ${reason}. ${comments}`,
          rejectionRecord.rejectedAt
        ]
      });

      // Update the main record status
      await this.updateMainRecordStatus(approvalType, approvalId, 'rejected', userId);

      this.notify({
        type: 'approval_rejected',
        approvalId,
        approvalType,
        reason,
        message: `Item ${approvalId} has been rejected`
      });

      return {
        success: true,
        rejectionRecord,
        message: 'Item successfully rejected'
      };

    } catch (error) {
      console.error('Error rejecting item:', error);
      this.notify({
        type: 'rejection_error',
        approvalId,
        message: `Error rejecting item: ${error.message}`
      });
      throw error;
    }
  }

  // Request revision
  async requestRevision(approvalData) {
    const {
      approvalId,
      approvalType,
      userRole,
      userId,
      userName,
      revisionRequests,
      comments = ''
    } = approvalData;

    try {
      console.log('=== REQUESTING REVISION ===');
      console.log('Revision Data:', approvalData);

      if (!revisionRequests || revisionRequests.length === 0) {
        throw new Error('At least one revision request must be specified');
      }

      // Create revision record
      const revisionRecord = {
        approvalId,
        approvalType,
        approverRole: userRole,
        approverId: userId,
        approverName: userName,
        status: 'revision_required',
        revisionRequests,
        comments,
        requestedAt: new Date().toISOString()
      };

      // Save to database
      await apiService.post('/database/query', {
        query: `
          INSERT INTO approval_history (
            approval_id, approval_type, approver_role, approver_id, approver_name,
            status, comments, approved_at, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
          RETURNING *
        `,
        params: [
          approvalId,
          approvalType,
          userRole,
          userId,
          userName,
          'revision_required',
          `REVISION REQUESTED: ${revisionRequests.join(', ')}. ${comments}`,
          revisionRecord.requestedAt
        ]
      });

      // Update the main record status
      await this.updateMainRecordStatus(approvalType, approvalId, 'revision_required', userId);

      this.notify({
        type: 'revision_requested',
        approvalId,
        approvalType,
        revisionRequests,
        message: `Revision requested for ${approvalId}`
      });

      return {
        success: true,
        revisionRecord,
        message: 'Revision successfully requested'
      };

    } catch (error) {
      console.error('Error requesting revision:', error);
      this.notify({
        type: 'revision_error',
        approvalId,
        message: `Error requesting revision: ${error.message}`
      });
      throw error;
    }
  }

  // Delegate approval to another user
  async delegateApproval(approvalData) {
    const {
      approvalId,
      approvalType,
      fromUserId,
      fromUserName,
      toUserId,
      toUserName,
      toUserRole,
      reason,
      timeLimit = 48 // hours
    } = approvalData;

    try {
      console.log('=== DELEGATING APPROVAL ===');
      console.log('Delegation Data:', approvalData);

      // Create delegation record
      const delegationRecord = {
        approvalId,
        approvalType,
        fromUserId,
        fromUserName,
        toUserId,
        toUserName,
        toUserRole,
        reason,
        timeLimit,
        delegatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + timeLimit * 60 * 60 * 1000).toISOString()
      };

      // Save to database
      await apiService.post('/database/query', {
        query: `
          INSERT INTO approval_delegations (
            approval_id, approval_type, from_user_id, from_user_name,
            to_user_id, to_user_name, to_user_role, reason, time_limit,
            delegated_at, expires_at, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
          RETURNING *
        `,
        params: [
          approvalId, approvalType, fromUserId, fromUserName,
          toUserId, toUserName, toUserRole, reason, timeLimit,
          delegationRecord.delegatedAt, delegationRecord.expiresAt
        ]
      });

      this.notify({
        type: 'approval_delegated',
        approvalId,
        approvalType,
        fromUser: fromUserName,
        toUser: toUserName,
        message: `Approval for ${approvalId} delegated to ${toUserName}`
      });

      return {
        success: true,
        delegationRecord,
        message: 'Approval successfully delegated'
      };

    } catch (error) {
      console.error('Error delegating approval:', error);
      this.notify({
        type: 'delegation_error',
        approvalId,
        message: `Error delegating approval: ${error.message}`
      });
      throw error;
    }
  }

  // Update main record status based on approval type
  async updateMainRecordStatus(approvalType, approvalId, status, userId) {
    const recordId = approvalId.split('-').slice(1).join('-'); // Remove prefix

    switch (approvalType) {
      case 'rab':
        await apiService.post('/database/query', {
          query: `
            UPDATE project_rab 
            SET "isApproved" = $1, "approvedBy" = $2, "approvedAt" = NOW(), "updatedAt" = NOW()
            WHERE id = $3
          `,
          params: [status === 'approved', userId, recordId]
        });
        break;

      case 'purchaseOrders':
        await apiService.post('/database/query', {
          query: `
            UPDATE purchase_orders 
            SET status = $1, approved_by = $2, approved_at = NOW(), "updatedAt" = NOW()
            WHERE id = $3
          `,
          params: [status, userId, recordId]
        });
        break;

      // Add other approval types as needed
      default:
        console.log(`No status update handler for approval type: ${approvalType}`);
    }
  }

  // Handle completion of all required approvals
  async handleCompleteApproval(approvalType, approvalId) {
    console.log(`All approvals complete for ${approvalType} ${approvalId}`);
    
    // Trigger next workflow step based on approval type
    switch (approvalType) {
      case 'rab':
        await this.triggerPOCreation(approvalId);
        break;
      case 'purchaseOrders':
        await this.triggerDeliveryScheduling(approvalId);
        break;
      case 'changeOrders':
        await this.triggerContractAmendment(approvalId);
        break;
      // Add other workflow triggers
    }
  }

  // Get approval history for an item
  async getApprovalHistory(approvalId) {
    try {
      const response = await apiService.post('/database/query', {
        query: `
          SELECT * FROM approval_history 
          WHERE approval_id = $1 
          ORDER BY created_at ASC
        `,
        params: [approvalId]
      });

      return response.data.data || [];
    } catch (error) {
      console.error('Error getting approval history:', error);
      return [];
    }
  }

  // Calculate time taken to approve
  calculateTimeToApprove(createdAt) {
    if (!createdAt) return null;
    
    const created = new Date(createdAt);
    const now = new Date();
    const diffHours = (now - created) / (1000 * 60 * 60);
    
    return {
      hours: Math.round(diffHours * 10) / 10,
      businessHours: this.calculateBusinessHours(created, now)
    };
  }

  // Calculate business hours between two dates
  calculateBusinessHours(startDate, endDate) {
    // Simplified business hours calculation (Mon-Fri, 8AM-5PM)
    let businessHours = 0;
    let current = new Date(startDate);
    
    while (current < endDate) {
      const day = current.getDay();
      const hour = current.getHours();
      
      // Monday = 1, Friday = 5, Saturday = 6, Sunday = 0
      if (day >= 1 && day <= 5 && hour >= 8 && hour < 17) {
        businessHours++;
      }
      
      current.setHours(current.getHours() + 1);
    }
    
    return businessHours;
  }

  // Workflow triggers
  async triggerPOCreation(rabId) {
    console.log(`Triggering PO creation for approved RAB: ${rabId}`);
    // Implementation for automatic PO creation
  }

  async triggerDeliveryScheduling(poId) {
    console.log(`Triggering delivery scheduling for approved PO: ${poId}`);
    // Implementation for delivery scheduling
  }

  async triggerContractAmendment(coId) {
    console.log(`Triggering contract amendment for approved Change Order: ${coId}`);
    // Implementation for contract amendment process
  }
}

// Create and export singleton instance
export const approvalActionService = new ApprovalActionService();

// Export approval action functions
export const approveItem = (approvalData) => approvalActionService.approveItem(approvalData);
export const rejectItem = (approvalData) => approvalActionService.rejectItem(approvalData);
export const requestRevision = (approvalData) => approvalActionService.requestRevision(approvalData);
export const delegateApproval = (approvalData) => approvalActionService.delegateApproval(approvalData);

export default approvalActionService;