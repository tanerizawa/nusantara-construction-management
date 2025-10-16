/**
 * Approval status constants
 */
export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DELEGATED: 'delegated'
};

/**
 * Workflow type constants
 */
export const WORKFLOW_TYPES = {
  PURCHASE_ORDER: 'Purchase Order',
  MATERIAL_REQUISITION: 'Material Requisition',
  CONTRACT: 'Contract',
  CHANGE_ORDER: 'Change Order',
  TIME_SHEET: 'Time Sheet',
  EXPENSE_REPORT: 'Expense Report'
};

/**
 * Action type constants
 */
export const ACTION_TYPES = {
  CREATED: 'created',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DELEGATED: 'delegated',
  UPDATED: 'updated',
  COMMENTED: 'commented'
};

/**
 * Format timestamp to locale string
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted date string
 */
export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};