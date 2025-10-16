// Chart utility functions
import { CHART_FORMAT_OPTIONS } from '../config/chartConfig';

/**
 * Format currency values
 * @param {number} amount - Amount to format
 * @param {object} options - Format options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, options = {}) => {
  const formatOptions = {
    ...CHART_FORMAT_OPTIONS.currency,
    ...options
  };
  
  return new Intl.NumberFormat(formatOptions.locale, {
    style: 'currency',
    currency: formatOptions.currency,
    minimumFractionDigits: formatOptions.minimumFractionDigits,
    maximumFractionDigits: formatOptions.maximumFractionDigits
  }).format(amount);
};

/**
 * Format percentage values
 * @param {number} value - Value to format as percentage
 * @param {object} options - Format options
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, options = {}) => {
  const formatOptions = {
    ...CHART_FORMAT_OPTIONS.percent,
    ...options
  };
  
  return `${value.toFixed(formatOptions.maximumFractionDigits)}%`;
};

/**
 * Format date values
 * @param {string|Date} date - Date to format
 * @param {object} options - Format options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const formatOptions = {
    ...CHART_FORMAT_OPTIONS.date,
    ...options
  };
  
  return new Date(date).toLocaleDateString(
    formatOptions.locale,
    options.short ? CHART_FORMAT_OPTIONS.shortDate : formatOptions
  );
};

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage value
 */
export const calculatePercentage = (value, total) => {
  if (!total) return 0;
  return (value / total) * 100;
};

/**
 * Format number with thousand separators
 * @param {number} number - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat(CHART_FORMAT_OPTIONS.currency.locale).format(number);
};

/**
 * Calculate days between two dates
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {number} Number of days
 */
export const calculateDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Calculate progress percentage based on dates
 * @param {string|Date} startDate - Project start date
 * @param {string|Date} endDate - Project end date
 * @returns {number} Progress percentage
 */
export const calculateTimeProgress = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  
  if (today < start) return 0;
  if (today > end) return 100;
  
  const totalDuration = end - start;
  const elapsedDuration = today - start;
  
  return Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
};

export default {
  formatCurrency,
  formatPercentage,
  formatDate,
  calculatePercentage,
  formatNumber,
  calculateDaysBetween,
  calculateTimeProgress
};