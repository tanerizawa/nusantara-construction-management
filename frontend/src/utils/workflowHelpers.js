// Re-export formatters from centralized utility
import { formatCurrency as formatCurrencyUtil, formatDate as formatDateUtil } from './formatters';

/**
 * Format currency in Indonesian Rupiah format
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'Rp 0';
  return formatCurrencyUtil(amount);
};

/**
 * Format date in Indonesian locale
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return formatDateUtil(dateString, { format: 'long' });
};

export const getStatusColor = (status) => {
  const statusColors = {
    // Project statuses
    'completed': 'text-green-600 bg-green-100',
    'in_progress': 'text-blue-600 bg-blue-100',
    'pending': 'text-yellow-600 bg-yellow-100',
    'cancelled': 'text-red-600 bg-red-100',
    
    // Approval statuses
    'approved': 'text-green-600 bg-green-100',
    'rejected': 'text-red-600 bg-red-100',
    'draft': 'text-gray-600 bg-gray-100',
    'under_review': 'text-blue-600 bg-blue-100',
    
    // Purchase Order statuses
    'sent': 'text-blue-600 bg-blue-100',
    'received': 'text-purple-600 bg-purple-100',
    
    // Universal fallback
    'default': 'text-gray-600 bg-gray-100'
  };
  
  return statusColors[status] || statusColors['default'];
};

export const getApprovalStatusColor = (status) => {
  switch (status) {
    case 'approved': return 'text-green-600 bg-green-100';
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'rejected': return 'text-red-600 bg-red-100';
    case 'revision_required': return 'text-orange-600 bg-orange-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const calculateBudgetVariance = (budgeted, actual) => {
  if (budgeted === 0) return 0;
  return ((actual - budgeted) / budgeted) * 100;
};

export const getWorkflowStage = (project, rabStatus, approvalStatus, poStatus) => {
  if (!rabStatus || rabStatus.length === 0) return 'planning';
  if (rabStatus.some(rab => rab.status === 'pending_approval')) return 'rab-approval';
  if (rabStatus.every(rab => rab.status === 'approved') && (!poStatus || poStatus.length === 0)) return 'procurement-planning';
  if (poStatus && poStatus.some(po => po.status === 'pending')) return 'po-approval';
  return 'execution';
};

export const getVarianceColor = (percentage) => {
  if (percentage <= 5) return 'text-green-600';
  if (percentage <= 15) return 'text-yellow-600';
  return 'text-red-600';
};
