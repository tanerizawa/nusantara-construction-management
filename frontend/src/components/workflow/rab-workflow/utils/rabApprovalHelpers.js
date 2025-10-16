/**
 * Utility to handle RAB workflow operations
 * 
 * This module provides functions for handling RAB approval workflow
 * and differentiates between rejection and deletion operations.
 */

/**
 * Rejection operation - Used when an approver rejects an item
 * This is a workflow action that indicates the item didn't meet approval criteria
 * but keeps the item in the system with rejected status for audit purposes
 * 
 * @param {Object} item - The RAB item to reject
 * @param {String} reason - Optional reason for rejection
 * @returns {Promise} - Promise resolving to the updated item
 */
export const rejectRABItem = async (item, reason = '') => {
  try {
    // In a real implementation, this would call an API endpoint
    console.log(`Rejecting item ${item.id} with reason: ${reason}`);
    
    // Update item status to rejected
    const updatedItem = {
      ...item,
      isApproved: false,
      status: 'rejected',
      rejectionReason: reason,
      rejectedAt: new Date().toISOString(),
      approvalHistory: [
        ...(item.approvalHistory || []),
        {
          action: 'reject',
          timestamp: new Date().toISOString(),
          reason: reason || 'No reason provided'
        }
      ]
    };
    
    return updatedItem;
  } catch (error) {
    console.error('Error rejecting RAB item:', error);
    throw error;
  }
};

/**
 * Delete operation - Used to completely remove an item from the system
 * This is a data management action rather than a workflow action
 * Only draft items that haven't entered the approval process should be deletable
 * 
 * @param {String|Number} itemId - The ID of the item to delete
 * @returns {Promise} - Promise resolving when the item is deleted
 */
export const deleteRABItem = async (itemId) => {
  try {
    // In a real implementation, this would call an API endpoint
    console.log(`Deleting item with ID: ${itemId}`);
    
    // Return success indicator
    return { success: true, deletedId: itemId };
  } catch (error) {
    console.error('Error deleting RAB item:', error);
    throw error;
  }
};

/**
 * Compares the differences between rejection and deletion
 * @returns {Object} - Object containing the differences
 */
export const getRejectVsDeleteDifference = () => {
  return {
    reject: {
      purpose: "Workflow action - indicates item didn't meet approval criteria",
      dataImpact: "Item remains in system with rejected status",
      auditTrail: "Creates an audit trail of the rejection with reason",
      reversible: "Can be re-submitted or re-approved",
      permissions: "Usually limited to approvers/reviewers"
    },
    delete: {
      purpose: "Data management action - removes unwanted/incorrect entries",
      dataImpact: "Item is permanently removed from the system",
      auditTrail: "May not create an audit trail unless separately logged",
      reversible: "Cannot be restored without backup",
      permissions: "Usually limited to data owners/creators and admins"
    }
  };
};