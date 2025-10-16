/**
 * Format utilities for Manpower module
 */

/**
 * Get CSS class based on employee status
 * @param {string} status - employee status ('active', 'inactive', or 'terminated')
 * @returns {string} CSS class for the status badge
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'bg-[#30D158]/20 text-[#30D158] border-[#30D158]/30';
    case 'inactive': return 'bg-[#98989D]/20 text-[#98989D] border-[#98989D]/30';
    case 'terminated': return 'bg-[#FF453A]/20 text-[#FF453A] border-[#FF453A]/30';
    default: return 'bg-[#98989D]/20 text-[#98989D] border-[#98989D]/30';
  }
};

/**
 * Format status label
 * @param {string} status - employee status ('active', 'inactive', or 'terminated')
 * @returns {string} Formatted status text
 */
export const formatStatus = (status) => {
  switch(status) {
    case 'active': return 'Aktif';
    case 'inactive': return 'Non-Aktif';
    case 'terminated': return 'Terminated';
    default: return status;
  }
};

/**
 * Format currency to IDR
 * @param {number} value - Number to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
  if (!value && value !== 0) return '-';
  return `Rp ${parseInt(value).toLocaleString('id-ID')}`;
};

/**
 * Format date to Indonesian format
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date or '-' if not available
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID');
};