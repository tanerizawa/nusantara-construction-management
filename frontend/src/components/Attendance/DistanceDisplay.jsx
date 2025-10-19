import React from 'react';
import './DistanceDisplay.css';

/**
 * Distance Display Component
 * Shows distance to target location with visual feedback
 * 
 * @param {Object} props
 * @param {number} props.distance - Distance in meters
 * @param {number} props.maxDistance - Maximum allowed distance (radius)
 * @param {boolean} props.isValid - Whether distance is within allowed radius
 * @param {string} props.targetName - Name of target location
 * @param {boolean} props.showStatus - Show validation status
 * @param {string} props.size - Size variant: 'small', 'medium', 'large'
 */
const DistanceDisplay = ({
  distance,
  maxDistance = 100,
  isValid = null,
  targetName = 'Project site',
  showStatus = true,
  size = 'medium',
}) => {
  // Format distance for display
  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${meters.toFixed(1)} m`;
    } else {
      return `${(meters / 1000).toFixed(2)} km`;
    }
  };

  // Calculate percentage of max distance
  const getPercentage = () => {
    if (!distance || !maxDistance) return 0;
    return Math.min(100, (distance / maxDistance) * 100);
  };

  // Determine status
  const getStatus = () => {
    if (isValid === null && distance === null) {
      return {
        level: 'unknown',
        icon: '📍',
        text: 'Calculating...',
        color: '#9ca3af',
      };
    }

    if (isValid === false || (distance && distance > maxDistance)) {
      return {
        level: 'invalid',
        icon: '❌',
        text: 'Too far',
        color: '#ef4444',
      };
    }

    if (distance <= maxDistance * 0.5) {
      return {
        level: 'excellent',
        icon: '✅',
        text: 'Perfect',
        color: '#10b981',
      };
    }

    if (distance <= maxDistance * 0.8) {
      return {
        level: 'good',
        icon: '✓',
        text: 'Good',
        color: '#3b82f6',
      };
    }

    return {
      level: 'warning',
      icon: '⚠️',
      text: 'Close to limit',
      color: '#f59e0b',
    };
  };

  const status = getStatus();
  const percentage = getPercentage();

  // No distance data
  if (distance === null || distance === undefined) {
    return (
      <div className={`distance-display distance-display-${size} distance-unknown`}>
        <div className="distance-icon">📍</div>
        <div className="distance-content">
          <span className="distance-text">Distance unknown</span>
          <span className="distance-hint">Enable GPS to check distance</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`distance-display distance-display-${size} distance-${status.level}`}>
      {showStatus && (
        <div className="distance-icon">
          {status.icon}
        </div>
      )}

      <div className="distance-content">
        <div className="distance-main">
          <span className="distance-value">{formatDistance(distance)}</span>
          <span className="distance-label">to {targetName}</span>
        </div>

        {showStatus && (
          <div className="distance-status">
            <span className="status-text">{status.text}</span>
            <span className="status-limit">
              Limit: {formatDistance(maxDistance)}
            </span>
          </div>
        )}

        {/* Progress bar */}
        <div className="distance-progress">
          <div 
            className="distance-progress-bar"
            style={{ 
              width: `${Math.min(100, percentage)}%`,
              backgroundColor: status.color
            }}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Compact Distance Badge
 */
export const DistanceBadge = ({ distance, isValid }) => {
  if (distance === null) {
    return <span className="distance-badge distance-badge-unknown">—</span>;
  }

  const formatDistance = (meters) => {
    if (meters < 1000) return `${meters.toFixed(0)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const className = isValid ? 'distance-badge-valid' : 'distance-badge-invalid';

  return (
    <span className={`distance-badge ${className}`}>
      {formatDistance(distance)}
    </span>
  );
};

/**
 * Distance Status Icon (icon only)
 */
export const DistanceStatusIcon = ({ distance, maxDistance, size = 24 }) => {
  if (!distance) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#9ca3af" strokeWidth="2" />
        <text x="12" y="16" textAnchor="middle" fill="#9ca3af" fontSize="12">?</text>
      </svg>
    );
  }

  const isValid = distance <= maxDistance;
  const color = isValid ? '#10b981' : '#ef4444';

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <path 
        d="M12 8v4l3 3" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      {isValid ? (
        <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" />
      ) : (
        <>
          <line x1="8" y1="8" x2="16" y2="16" stroke={color} strokeWidth="2" />
          <line x1="16" y1="8" x2="8" y2="16" stroke={color} strokeWidth="2" />
        </>
      )}
    </svg>
  );
};

/**
 * Distance Indicator with Map Preview
 */
export const DistanceWithMap = ({ 
  distance, 
  maxDistance, 
  targetName,
  currentLat,
  currentLon,
  targetLat,
  targetLon,
}) => {
  const isValid = distance <= maxDistance;

  return (
    <div className="distance-with-map">
      <div className="distance-map-preview">
        {/* Simple visual representation */}
        <div className="map-center">
          <div className="map-target">📍</div>
          <div 
            className={`map-radius ${isValid ? 'map-radius-valid' : 'map-radius-invalid'}`}
            style={{ width: '100px', height: '100px' }}
          />
          <div 
            className="map-user"
            style={{
              transform: `translate(${(currentLon - targetLon) * 500}px, ${(targetLat - currentLat) * 500}px)`
            }}
          >
            👤
          </div>
        </div>
      </div>

      <DistanceDisplay
        distance={distance}
        maxDistance={maxDistance}
        isValid={isValid}
        targetName={targetName}
        showStatus={true}
      />
    </div>
  );
};

export default DistanceDisplay;
