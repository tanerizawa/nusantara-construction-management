/**
 * Date and Time Utilities with WIB/Asia Jakarta Timezone Support
 * 
 * All functions automatically use Asia/Jakarta timezone (WIB/UTC+7)
 */

const TIMEZONE = 'Asia/Jakarta'; // WIB

/**
 * Format date to Indonesian locale with WIB timezone
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type: 'short', 'medium', 'long', 'full'
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'medium') => {
  if (!date) return '-';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const options = {
    timeZone: TIMEZONE,
  };

  switch (format) {
    case 'short':
      // 09/10/2025
      options.day = '2-digit';
      options.month = '2-digit';
      options.year = 'numeric';
      return d.toLocaleDateString('id-ID', options);
      
    case 'medium':
      // 9 Okt 2025
      options.day = 'numeric';
      options.month = 'short';
      options.year = 'numeric';
      return d.toLocaleDateString('id-ID', options);
      
    case 'long':
      // 9 Oktober 2025
      options.day = 'numeric';
      options.month = 'long';
      options.year = 'numeric';
      return d.toLocaleDateString('id-ID', options);
      
    case 'full':
      // Senin, 9 Oktober 2025
      options.weekday = 'long';
      options.day = 'numeric';
      options.month = 'long';
      options.year = 'numeric';
      return d.toLocaleDateString('id-ID', options);
      
    default:
      return d.toLocaleDateString('id-ID', { timeZone: TIMEZONE });
  }
};

/**
 * Format time to WIB timezone
 * @param {Date|string} date - Date to format
 * @param {boolean} withSeconds - Include seconds
 * @returns {string} Formatted time string (e.g., "14:30 WIB" or "14:30:45 WIB")
 */
export const formatTime = (date, withSeconds = false) => {
  if (!date) return '-';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const options = {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  if (withSeconds) {
    options.second = '2-digit';
  }

  const time = d.toLocaleTimeString('id-ID', options);
  return `${time} WIB`;
};

/**
 * Format datetime to WIB timezone
 * @param {Date|string} date - Date to format
 * @param {string} dateFormat - Date format: 'short', 'medium', 'long', 'full'
 * @param {boolean} withSeconds - Include seconds in time
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (date, dateFormat = 'medium', withSeconds = false) => {
  if (!date) return '-';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const formattedDate = formatDate(d, dateFormat);
  const formattedTime = formatTime(d, withSeconds);

  return `${formattedDate}, ${formattedTime}`;
};

/**
 * Format relative time (e.g., "2 jam yang lalu", "3 hari yang lalu")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  // Get current time in WIB
  const now = new Date();
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit yang lalu`;
  if (diffHour < 24) return `${diffHour} jam yang lalu`;
  if (diffDay < 30) return `${diffDay} hari yang lalu`;
  if (diffMonth < 12) return `${diffMonth} bulan yang lalu`;
  return `${diffYear} tahun yang lalu`;
};

/**
 * Get current date/time in WIB
 * @returns {Date} Current date in WIB
 */
export const getCurrentWIB = () => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: TIMEZONE }));
};

/**
 * Convert date to WIB timezone
 * @param {Date|string} date - Date to convert
 * @returns {Date} Date in WIB timezone
 */
export const toWIB = (date) => {
  const d = new Date(date);
  return new Date(d.toLocaleString('en-US', { timeZone: TIMEZONE }));
};

/**
 * Format date for input fields (YYYY-MM-DD)
 * @param {Date|string} date - Date to format
 * @returns {string} Date in YYYY-MM-DD format
 */
export const formatDateInput = (date) => {
  if (!date) return '';
  
  const d = toWIB(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Format datetime for input fields (YYYY-MM-DDTHH:mm)
 * @param {Date|string} date - Date to format
 * @returns {string} Datetime in YYYY-MM-DDTHH:mm format
 */
export const formatDateTimeInput = (date) => {
  if (!date) return '';
  
  const d = toWIB(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Format time for display in tables (HH:mm WIB)
 * @param {Date|string} date - Date to format
 * @returns {string} Time in HH:mm WIB format
 */
export const formatTimeShort = (date) => {
  return formatTime(date, false);
};

/**
 * Format datetime for display in tables (DD/MM/YYYY HH:mm WIB)
 * @param {Date|string} date - Date to format
 * @returns {string} Datetime in compact format
 */
export const formatDateTimeShort = (date) => {
  if (!date) return '-';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const dateStr = formatDate(d, 'short');
  const time = d.toLocaleTimeString('id-ID', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `${dateStr} ${time} WIB`;
};

/**
 * Parse date string to Date object in WIB
 * @param {string} dateStr - Date string to parse
 * @returns {Date|null} Parsed date or null if invalid
 */
export const parseDateWIB = (dateStr) => {
  if (!dateStr) return null;
  
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  
  return toWIB(d);
};

/**
 * Check if date is today (in WIB)
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  const d = toWIB(date);
  const today = getCurrentWIB();
  
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear();
};

/**
 * Get day name in Indonesian
 * @param {Date|string} date - Date to get day name
 * @returns {string} Day name (e.g., "Senin", "Selasa")
 */
export const getDayName = (date) => {
  if (!date) return '-';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  return d.toLocaleDateString('id-ID', {
    timeZone: TIMEZONE,
    weekday: 'long'
  });
};

/**
 * Get month name in Indonesian
 * @param {Date|string} date - Date to get month name
 * @returns {string} Month name (e.g., "Januari", "Februari")
 */
export const getMonthName = (date) => {
  if (!date) return '-';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  return d.toLocaleDateString('id-ID', {
    timeZone: TIMEZONE,
    month: 'long'
  });
};

// Export timezone constant
export { TIMEZONE };

// Default export
export default {
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  getCurrentWIB,
  toWIB,
  formatDateInput,
  formatDateTimeInput,
  formatTimeShort,
  formatDateTimeShort,
  parseDateWIB,
  isToday,
  getDayName,
  getMonthName,
  TIMEZONE,
};
