// Utility functions for chart formatting
import { CHART_COLORS } from '../config/chartConfig';

/**
 * Format currency values with IDR
 * @param {number} amount - The amount to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, options = {}) => {
  const {
    locale = 'id-ID',
    currency = 'IDR',
    minimumFractionDigits = 0
  } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits
  }).format(amount);
};

/**
 * Format percentage values
 * @param {number} value - The value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 0) => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Get color for trend values
 * @param {number} value - The value to evaluate
 * @returns {string} CSS color code
 */
export const getTrendColor = (value) => {
  if (value > 0) return CHART_COLORS.success;
  if (value < 0) return CHART_COLORS.danger;
  return CHART_COLORS.secondaryTextColor;
};

/**
 * Calculate percentage change between two values
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Percentage change
 */
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
};

/**
 * Format number with thousand separators
 * @param {number} number - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat('id-ID').format(number);
};

/**
 * Generate chart tooltip formatter
 * @param {object} customFormatters - Custom formatters for specific keys
 * @returns {function} Tooltip formatter function
 */
export const createTooltipFormatter = (customFormatters = {}) => {
  return (value, name) => {
    if (customFormatters[name]) {
      return customFormatters[name](value);
    }
    return [value, name];
  };
};

export default {
  formatCurrency,
  formatPercentage,
  getTrendColor,
  calculatePercentageChange,
  formatNumber,
  createTooltipFormatter
};