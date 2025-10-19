import React from 'react';
import './ErrorBoundary.css';

/**
 * ErrorBoundary Component
 * 
 * React error boundary that catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 * 
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * 
 * Features:
 * - Catches React component errors
 * - Displays user-friendly error message
 * - Shows error details in development mode
 * - Provides retry mechanism
 * - Logs errors for debugging
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error details
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Send error to logging service (optional)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to backend if needed
    if (process.env.REACT_APP_ERROR_LOGGING_ENABLED === 'true') {
      this.logErrorToBackend(error, errorInfo);
    }
  }

  logErrorToBackend = async (error, errorInfo) => {
    try {
      await fetch('/api/logs/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: error.toString(),
          errorInfo: errorInfo.componentStack,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {
      console.error('Failed to log error to backend:', err);
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    // Reload page if retry fails multiple times
    if (this.state.errorCount >= 3) {
      window.location.reload();
    }

    // Call custom reset handler if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-icon">⚠️</div>
            
            <h1 className="error-title">Oops! Something went wrong</h1>
            
            <p className="error-message">
              {this.props.message || 'An unexpected error occurred. Please try again.'}
            </p>

            {/* Show error details in development mode */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development Mode)</summary>
                <div className="error-stack">
                  <h3>Error:</h3>
                  <pre>{this.state.error.toString()}</pre>
                  
                  {this.state.errorInfo && (
                    <>
                      <h3>Component Stack:</h3>
                      <pre>{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}

            <div className="error-actions">
              <button 
                className="btn-retry" 
                onClick={this.handleReset}
              >
                🔄 Try Again
              </button>
              
              <button 
                className="btn-home" 
                onClick={() => window.location.href = '/'}
              >
                🏠 Go to Home
              </button>
            </div>

            {this.state.errorCount >= 3 && (
              <div className="error-persistent">
                <p>⚠️ This error keeps occurring. The page will reload.</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Functional ErrorBoundary wrapper for hooks support
 */
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  return (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
};

/**
 * Custom error fallback component
 */
export const ErrorFallback = ({ error, resetError, message }) => (
  <div className="error-fallback">
    <div className="error-fallback-content">
      <div className="error-icon">😕</div>
      <h2>Something went wrong</h2>
      <p>{message || 'We encountered an error while loading this component.'}</p>
      
      {error && process.env.NODE_ENV === 'development' && (
        <details>
          <summary>Error details</summary>
          <pre>{error.message}</pre>
        </details>
      )}
      
      <button onClick={resetError} className="btn-retry">
        Try again
      </button>
    </div>
  </div>
);

export default ErrorBoundary;
