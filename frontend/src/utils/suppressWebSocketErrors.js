/**
 * Suppress WebSocket Errors in Production
 * 
 * Prevents non-critical WebSocket connection errors from polluting console
 * in production-like environments where HMR is disabled.
 */

const SUPPRESSED_ERRORS = [
  'WebSocket connection to',
  'sockjs-node',
  '/ws failed',
  'WebSocketClient',
  'initSocket'
];

/**
 * Check if error should be suppressed
 */
const shouldSuppressError = (message) => {
  if (typeof message !== 'string') return false;
  return SUPPRESSED_ERRORS.some(pattern => message.includes(pattern));
};

/**
 * Initialize error suppression
 */
export const initErrorSuppression = () => {
  // Only suppress in production-like environments
  if (process.env.NODE_ENV === 'production' || process.env.FAST_REFRESH === 'false') {
    
    // Suppress console.error for WebSocket errors
    const originalError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      if (shouldSuppressError(message)) {
        // Silently ignore WebSocket errors
        return;
      }
      originalError.apply(console, args);
    };

    // Suppress console.warn for WebSocket warnings
    const originalWarn = console.warn;
    console.warn = (...args) => {
      const message = args.join(' ');
      if (shouldSuppressError(message)) {
        // Silently ignore WebSocket warnings
        return;
      }
      originalWarn.apply(console, args);
    };

    // Suppress unhandled promise rejections for WebSocket
    window.addEventListener('unhandledrejection', (event) => {
      const message = event.reason?.message || event.reason?.toString() || '';
      if (shouldSuppressError(message)) {
        event.preventDefault();
        return false;
      }
    });

    console.log('✅ WebSocket error suppression enabled');
  }
};

/**
 * Restore original console methods (for testing)
 */
export const restoreConsole = () => {
  // This would need to store originals, but for production this isn't needed
  console.log('⚠️ Console restoration not implemented (use browser refresh)');
};

export default initErrorSuppression;
