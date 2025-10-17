/**
 * Toast notification utilities
 * Uses custom event system for notifications
 */

/**
 * Show success toast notification
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
export const showSuccessToast = (message, duration = 3000) => {
  window.dispatchEvent(new CustomEvent('show-notification', {
    detail: {
      type: 'success',
      message,
      duration
    }
  }));
};

/**
 * Show error toast notification
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds (default: 5000)
 */
export const showErrorToast = (message, duration = 5000) => {
  window.dispatchEvent(new CustomEvent('show-notification', {
    detail: {
      type: 'error',
      message,
      duration
    }
  }));
};

/**
 * Show warning toast notification
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds (default: 4000)
 */
export const showWarningToast = (message, duration = 4000) => {
  window.dispatchEvent(new CustomEvent('show-notification', {
    detail: {
      type: 'warning',
      message,
      duration
    }
  }));
};

/**
 * Show info toast notification
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
export const showInfoToast = (message, duration = 3000) => {
  window.dispatchEvent(new CustomEvent('show-notification', {
    detail: {
      type: 'info',
      message,
      duration
    }
  }));
};
