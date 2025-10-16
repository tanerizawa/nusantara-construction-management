/**
 * Formatter utility functions
 */

/**
 * Format the establishment year
 * @param {string|number} year - Year value 
 * @returns {string} Formatted year
 */
export const formatYear = (year) => {
  return year ? `Est. ${year}` : '-';
};

/**
 * Format employee count with appropriate suffix
 * @param {number} count - Employee count
 * @returns {string} Formatted employee count
 */
export const formatEmployeeCount = (count) => {
  if (!count && count !== 0) return '-';
  return `${count} karyawan`;
};

/**
 * Format the status badge
 * @param {string} status - Status value
 * @returns {Object} Status configuration for badge
 */
export const getStatusConfig = (status) => {
  switch (status) {
    case 'active':
      return {
        label: 'Aktif',
        bgColor: 'rgba(52, 199, 89, 0.2)',
        borderColor: 'rgba(52, 199, 89, 0.4)',
        textColor: '#34C759',
        icon: 'CheckCircle'
      };
    case 'inactive':
      return {
        label: 'Tidak Aktif',
        bgColor: 'rgba(255, 69, 58, 0.2)',
        borderColor: 'rgba(255, 69, 58, 0.4)',
        textColor: '#FF453A',
        icon: 'XCircle'
      };
    default:
      return {
        label: 'Tidak Diketahui',
        bgColor: 'rgba(142, 142, 147, 0.2)',
        borderColor: 'rgba(142, 142, 147, 0.4)',
        textColor: '#8E8E93',
        icon: 'HelpCircle'
      };
  }
};