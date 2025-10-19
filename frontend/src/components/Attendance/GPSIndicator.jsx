import React from 'react';
import './GPSIndicator.css';

/**
 * GPS Accuracy Indicator Component
 * Shows GPS accuracy level with visual feedback
 * 
 * @param {Object} props
 * @param {number} props.accuracy - GPS accuracy in meters
 * @param {boolean} props.isLoading - GPS is loading
 * @param {string} props.error - Error message if any
 * @param {number} props.latitude - Current latitude
 * @param {number} props.longitude - Current longitude
 * @param {string} props.size - Size variant: 'small', 'medium', 'large'
 * @param {boolean} props.showCoordinates - Show lat/lon
 * @param {boolean} props.showDetails - Show detailed info
 */
const GPSIndicator = ({
  accuracy,
  isLoading = false,
  error = null,
  latitude = null,
  longitude = null,
  size = 'medium',
  showCoordinates = false,
  showDetails = false,
}) => {
  // Determine accuracy level
  const getAccuracyLevel = () => {
    if (!accuracy) return null;
    
    if (accuracy <= 10) return { 
      level: 'excellent', 
      color: '#10b981', 
      text: 'Excellent',
      icon: '🎯',
      description: 'Pinpoint accuracy'
    };
    if (accuracy <= 20) return { 
      level: 'good', 
      color: '#3b82f6', 
      text: 'Good',
      icon: '✓',
      description: 'High accuracy'
    };
    if (accuracy <= 50) return { 
      level: 'fair', 
      color: '#f59e0b', 
      text: 'Fair',
      icon: '~',
      description: 'Moderate accuracy'
    };
    return { 
      level: 'poor', 
      color: '#ef4444', 
      text: 'Poor',
      icon: '!',
      description: 'Low accuracy'
    };
  };

  const accuracyLevel = getAccuracyLevel();

  // Loading state
  if (isLoading) {
    return (
      <div className={`gps-indicator gps-indicator-${size} gps-loading`}>
        <div className="gps-spinner"></div>
        <span className="gps-text">Getting location...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`gps-indicator gps-indicator-${size} gps-error`}>
        <span className="gps-icon">⚠️</span>
        <div className="gps-content">
          <span className="gps-text">GPS Error</span>
          {showDetails && <span className="gps-error-text">{error}</span>}
        </div>
      </div>
    );
  }

  // No GPS data
  if (!accuracy || !latitude || !longitude) {
    return (
      <div className={`gps-indicator gps-indicator-${size} gps-inactive`}>
        <span className="gps-icon">📍</span>
        <span className="gps-text">GPS inactive</span>
      </div>
    );
  }

  // Active GPS with accuracy info
  return (
    <div className={`gps-indicator gps-indicator-${size} gps-active gps-${accuracyLevel.level}`}>
      <span className="gps-icon">{accuracyLevel.icon}</span>
      
      <div className="gps-content">
        <div className="gps-main">
          <span className="gps-text">{accuracyLevel.text}</span>
          <span className="gps-accuracy">±{accuracy.toFixed(1)}m</span>
        </div>
        
        {showDetails && (
          <div className="gps-details">
            <span className="gps-description">{accuracyLevel.description}</span>
          </div>
        )}
        
        {showCoordinates && (
          <div className="gps-coordinates">
            <span className="gps-coord-label">Lat:</span>
            <span className="gps-coord-value">{latitude.toFixed(6)}</span>
            <span className="gps-coord-label">Lon:</span>
            <span className="gps-coord-value">{longitude.toFixed(6)}</span>
          </div>
        )}
      </div>
      
      <div 
        className="gps-signal-strength"
        style={{ 
          '--strength': `${Math.max(0, 100 - accuracy * 2)}%`,
          '--color': accuracyLevel.color 
        }}
      >
        <div className="signal-bar"></div>
        <div className="signal-bar"></div>
        <div className="signal-bar"></div>
        <div className="signal-bar"></div>
      </div>
    </div>
  );
};

/**
 * Compact GPS Badge (minimal version)
 */
export const GPSBadge = ({ accuracy, latitude, longitude }) => {
  if (!accuracy || !latitude || !longitude) {
    return <span className="gps-badge gps-badge-inactive">GPS Off</span>;
  }

  const getLevel = () => {
    if (accuracy <= 10) return 'excellent';
    if (accuracy <= 20) return 'good';
    if (accuracy <= 50) return 'fair';
    return 'poor';
  };

  return (
    <span className={`gps-badge gps-badge-${getLevel()}`}>
      GPS ±{accuracy.toFixed(0)}m
    </span>
  );
};

/**
 * GPS Status Icon (icon only)
 */
export const GPSStatusIcon = ({ accuracy, size = 24 }) => {
  if (!accuracy) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="gps-status-icon gps-inactive">
        <circle cx="12" cy="12" r="10" stroke="#9ca3af" strokeWidth="2" />
        <path d="M12 8v4l3 3" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  const getColor = () => {
    if (accuracy <= 10) return '#10b981';
    if (accuracy <= 20) return '#3b82f6';
    if (accuracy <= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="gps-status-icon gps-active">
      <circle cx="12" cy="12" r="10" stroke={getColor()} strokeWidth="2" />
      <circle cx="12" cy="12" r="3" fill={getColor()} />
      <circle cx="12" cy="12" r="6" stroke={getColor()} strokeWidth="1" opacity="0.5" />
    </svg>
  );
};

export default GPSIndicator;
