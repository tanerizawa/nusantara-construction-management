import React from 'react';
import './TodayStatusCard.css';

/**
 * TodayStatusCard Component
 * 
 * Displays current day's attendance status including:
 * - Clock in/out status
 * - Work duration
 * - Location information
 * - Status badge
 * 
 * @param {Object} props
 * @param {Object} props.todayRecord - Today's attendance record
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message
 */
const TodayStatusCard = ({ todayRecord, isLoading, error }) => {
  // Calculate work duration
  const calculateDuration = () => {
    if (!todayRecord?.clock_in_time) return '0h 0m';
    
    const clockIn = new Date(todayRecord.clock_in_time);
    const clockOut = todayRecord.clock_out_time 
      ? new Date(todayRecord.clock_out_time)
      : new Date();
    
    const diffMs = clockOut - clockIn;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours}h ${diffMinutes}m`;
  };

  // Get status badge
  const getStatusBadge = () => {
    if (!todayRecord) {
      return { text: 'Not Clocked In', color: 'gray' };
    }
    
    if (todayRecord.clock_out_time) {
      return { text: 'Completed', color: 'green' };
    }
    
    return { text: 'Active', color: 'blue' };
  };

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status for styling
  const status = getStatusBadge();

  if (isLoading) {
    return (
      <div className="today-status-card loading">
        <div className="status-card-header">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-badge"></div>
        </div>
        <div className="status-card-body">
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="today-status-card error">
        <div className="error-icon">⚠️</div>
        <h3>Failed to Load Status</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={`today-status-card ${status.color}`}>
      {/* Header */}
      <div className="status-card-header">
        <div className="status-card-title">
          <h2>Today's Attendance</h2>
          <p className="status-date">{formatDate(new Date())}</p>
        </div>
        <div className={`status-badge ${status.color}`}>
          {status.text}
        </div>
      </div>

      {/* Body */}
      <div className="status-card-body">
        {todayRecord ? (
          <>
            {/* Clock In Info */}
            <div className="status-info-row">
              <div className="status-info-item">
                <div className="info-icon clock-in">🕐</div>
                <div className="info-content">
                  <span className="info-label">Clock In</span>
                  <span className="info-value">
                    {formatTime(todayRecord.clock_in_time)}
                  </span>
                </div>
              </div>

              {/* Clock Out Info */}
              <div className="status-info-item">
                <div className="info-icon clock-out">🕔</div>
                <div className="info-content">
                  <span className="info-label">Clock Out</span>
                  <span className="info-value">
                    {formatTime(todayRecord.clock_out_time) || '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Work Duration */}
            <div className="status-duration">
              <div className="duration-icon">⏱️</div>
              <div className="duration-content">
                <span className="duration-label">Work Duration</span>
                <span className="duration-value">{calculateDuration()}</span>
              </div>
            </div>

            {/* Location Info */}
            {todayRecord.location_name && (
              <div className="status-location">
                <div className="location-icon">📍</div>
                <div className="location-content">
                  <span className="location-label">Location</span>
                  <span className="location-value">
                    {todayRecord.location_name}
                  </span>
                  <span className="location-coords">
                    {todayRecord.latitude?.toFixed(6)}, {todayRecord.longitude?.toFixed(6)}
                  </span>
                </div>
              </div>
            )}

            {/* Status Info */}
            {todayRecord.status && todayRecord.status !== 'present' && (
              <div className={`status-alert ${todayRecord.status}`}>
                <div className="alert-icon">
                  {todayRecord.status === 'late' ? '⚠️' : 'ℹ️'}
                </div>
                <div className="alert-content">
                  <span className="alert-label">Status</span>
                  <span className="alert-value">
                    {todayRecord.status === 'late' ? 'Late' : todayRecord.status}
                  </span>
                  {todayRecord.notes && (
                    <p className="alert-notes">{todayRecord.notes}</p>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="status-empty">
            <div className="empty-icon">📋</div>
            <h3>No Attendance Record</h3>
            <p>You haven't clocked in today</p>
            <p className="empty-hint">Tap "Clock In" button below to start</p>
          </div>
        )}
      </div>

      {/* Footer - Quick Stats */}
      {todayRecord && (
        <div className="status-card-footer">
          <div className="quick-stat">
            <span className="stat-icon">📷</span>
            <span className="stat-label">Photo</span>
            <span className="stat-value">
              {todayRecord.photo_url ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="quick-stat">
            <span className="stat-icon">🎯</span>
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">
              ±{todayRecord.accuracy || 0}m
            </span>
          </div>
          <div className="quick-stat">
            <span className="stat-icon">✓</span>
            <span className="stat-label">Verified</span>
            <span className="stat-value">
              {todayRecord.is_valid_location ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayStatusCard;
