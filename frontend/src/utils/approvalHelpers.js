/**
 * Approval Helper Utilities
 * 
 * Shared utility functions for approval system
 */

/**
 * Get items that need approval (draft, pending, reviewed status)
 * @param {Array} items - All items
 * @returns {Array} Items needing approval
 */
export const getPendingApprovalItems = (items) => {
  if (!Array.isArray(items)) return [];
  
  return items.filter(item => 
    item.approval_status === 'draft' ||
    item.approval_status === 'pending_approval' ||
    item.approval_status === 'reviewed'
  );
};

/**
 * Group items by approval status
 * @param {Array} items - All items
 * @returns {Object} Grouped items
 */
export const groupItemsByApprovalStatus = (items) => {
  if (!Array.isArray(items)) {
    return {
      draft: [],
      pending_approval: [],
      reviewed: [],
      approved: [],
      rejected: []
    };
  }

  return items.reduce((acc, item) => {
    const status = item.approval_status || 'draft';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(item);
    return acc;
  }, {
    draft: [],
    pending_approval: [],
    reviewed: [],
    approved: [],
    rejected: []
  });
};

/**
 * Calculate approval statistics
 * @param {Array} items - All items
 * @returns {Object} Statistics
 */
export const calculateApprovalStats = (items) => {
  if (!Array.isArray(items)) {
    return {
      total: 0,
      draft: 0,
      pending: 0,
      reviewed: 0,
      approved: 0,
      rejected: 0,
      pendingCount: 0,
      approvalRate: 0
    };
  }

  const stats = {
    total: items.length,
    draft: 0,
    pending: 0,
    reviewed: 0,
    approved: 0,
    rejected: 0
  };

  items.forEach(item => {
    const status = item.approval_status || 'draft';
    if (status === 'draft') stats.draft++;
    else if (status === 'pending_approval') stats.pending++;
    else if (status === 'reviewed') stats.reviewed++;
    else if (status === 'approved') stats.approved++;
    else if (status === 'rejected') stats.rejected++;
  });

  stats.pendingCount = stats.draft + stats.pending + stats.reviewed;
  stats.approvalRate = stats.total > 0 
    ? Math.round((stats.approved / stats.total) * 100) 
    : 0;

  return stats;
};

/**
 * Check if user can approve item
 * @param {Object} item - Item to check
 * @param {Object} user - Current user
 * @returns {boolean} Can approve
 */
export const canApproveItem = (item, user) => {
  if (!item || !user) return false;

  // Can't approve own items
  if (item.created_by === user.id) return false;

  // Can only approve items in pending or reviewed status
  const approvableStatuses = ['pending_approval', 'reviewed'];
  if (!approvableStatuses.includes(item.approval_status)) return false;

  // Check user role permissions
  const approverRoles = ['project_manager', 'finance_manager', 'director', 'admin'];
  if (!approverRoles.includes(user.role)) return false;

  return true;
};

/**
 * Get approval status badge config
 * @param {string} status - Approval status
 * @returns {Object} Badge configuration
 */
export const getApprovalStatusBadge = (status) => {
  const configs = {
    draft: {
      label: 'Draft',
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      icon: '📝'
    },
    pending_approval: {
      label: 'Pending',
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      icon: '⏳'
    },
    reviewed: {
      label: 'Reviewed',
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      icon: '👁️'
    },
    approved: {
      label: 'Approved',
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      icon: '✅'
    },
    rejected: {
      label: 'Rejected',
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      icon: '❌'
    }
  };

  return configs[status] || configs.draft;
};

/**
 * Format approval history for display
 * @param {Array} history - Approval history
 * @returns {Array} Formatted history
 */
export const formatApprovalHistory = (history) => {
  if (!Array.isArray(history)) return [];

  return history.map(entry => ({
    ...entry,
    formattedDate: new Date(entry.created_at).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    actionLabel: getActionLabel(entry.action),
    statusBadge: getApprovalStatusBadge(entry.new_status)
  }));
};

/**
 * Get action label
 * @param {string} action - Action type
 * @returns {string} Label
 */
const getActionLabel = (action) => {
  const labels = {
    created: 'membuat',
    reviewed: 'mereview',
    approved: 'menyetujui',
    rejected: 'menolak',
    updated: 'memperbarui'
  };

  return labels[action] || action;
};

/**
 * Sort items by priority for approval
 * Prioritizes: oldest first, highest value first
 * @param {Array} items - Items to sort
 * @returns {Array} Sorted items
 */
export const sortItemsByApprovalPriority = (items) => {
  if (!Array.isArray(items)) return [];

  return [...items].sort((a, b) => {
    // First priority: older items first
    const dateA = new Date(a.created_at || 0);
    const dateB = new Date(b.created_at || 0);
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;

    // Second priority: higher value first
    const amountA = a.total_amount || 0;
    const amountB = b.total_amount || 0;
    return amountB - amountA;
  });
};

/**
 * Get approval workflow progress percentage
 * @param {string} status - Current status
 * @returns {number} Progress percentage
 */
export const getApprovalProgress = (status) => {
  const progressMap = {
    draft: 0,
    pending_approval: 33,
    reviewed: 66,
    approved: 100,
    rejected: 0
  };

  return progressMap[status] || 0;
};

/**
 * Validate approval action
 * @param {Object} item - Item to approve
 * @param {string} action - Action type (approve, reject, review)
 * @returns {Object} Validation result
 */
export const validateApprovalAction = (item, action) => {
  if (!item) {
    return { valid: false, error: 'Item tidak ditemukan' };
  }

  const status = item.approval_status;

  switch (action) {
    case 'review':
      if (status !== 'draft') {
        return { valid: false, error: 'Hanya item dengan status draft yang bisa direview' };
      }
      break;

    case 'approve':
      if (status !== 'pending_approval' && status !== 'reviewed') {
        return { valid: false, error: 'Item harus dalam status pending atau reviewed untuk diapprove' };
      }
      break;

    case 'reject':
      if (status !== 'pending_approval' && status !== 'reviewed') {
        return { valid: false, error: 'Item harus dalam status pending atau reviewed untuk direject' };
      }
      break;

    default:
      return { valid: false, error: 'Aksi tidak valid' };
  }

  return { valid: true };
};

export default {
  getPendingApprovalItems,
  groupItemsByApprovalStatus,
  calculateApprovalStats,
  canApproveItem,
  getApprovalStatusBadge,
  formatApprovalHistory,
  sortItemsByApprovalPriority,
  getApprovalProgress,
  validateApprovalAction
};
