import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AttendanceSuccess.css';

/**
 * AttendanceSuccess Component
 * 
 * Success screen shown after clock in/out
 * Shows celebration animation and summary
 */
const AttendanceSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);

  // Get data from navigation state
  const { type, data, timestamp } = location.state || {};

  // Auto-redirect after 5 seconds
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate('/attendance');
    }
  }, [countdown, navigate]);

  // Handle immediate redirect
  const handleGoToDashboard = () => {
    navigate('/attendance');
  };

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // If no data, redirect immediately
  if (!type || !data) {
    navigate('/attendance');
    return null;
  }

  return (
    <div className="attendance-success">
      {/* Celebration Animation */}
      <div className="celebration-container">
        <div className="confetti">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 1}s`,
                backgroundColor: ['#667eea', '#764ba2', '#ffc107', '#28a745', '#dc3545'][i % 5]
              }}
            />
          ))}
        </div>
      </div>

      {/* Success Content */}
      <div className="success-content">
        {/* Icon */}
        <div className="success-icon">
          {type === 'clock-in' ? '👍' : '✅'}
        </div>

        {/* Title */}
        <h1 className="success-title">
          {type === 'clock-in' ? 'Clock In Successful!' : 'Clock Out Successful!'}
        </h1>

        {/* Message */}
        <p className="success-message">
          {type === 'clock-in' 
            ? 'Your attendance has been recorded. Have a productive day!' 
            : 'Great work today! Your attendance has been completed.'}
        </p>

        {/* Summary Card */}
        <div className="summary-card">
          <div className="summary-header">
            <h2>
              {type === 'clock-in' ? '📅 Clock In Details' : '📊 Work Summary'}
            </h2>
          </div>
          <div className="summary-body">
            {/* Date */}
            <div className="summary-row">
              <span className="summary-label">Date</span>
              <span className="summary-value">
                {formatDate(timestamp || data.clock_in_time)}
              </span>
            </div>

            {/* Clock In Time */}
            {type === 'clock-in' && (
              <div className="summary-row">
                <span className="summary-label">Clock In Time</span>
                <span className="summary-value highlight">
                  {formatTime(data.clock_in_time)}
                </span>
              </div>
            )}

            {/* Clock Out Time */}
            {type === 'clock-out' && (
              <>
                <div className="summary-row">
                  <span className="summary-label">Clock In Time</span>
                  <span className="summary-value">
                    {formatTime(data.clock_in_time)}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Clock Out Time</span>
                  <span className="summary-value highlight">
                    {formatTime(data.clock_out_time)}
                  </span>
                </div>
              </>
            )}

            {/* Location */}
            {data.location_name && (
              <div className="summary-row">
                <span className="summary-label">Location</span>
                <span className="summary-value">
                  {data.location_name}
                </span>
              </div>
            )}

            {/* Verification Status */}
            {data.is_valid_location !== undefined && (
              <div className="summary-row">
                <span className="summary-label">Verification</span>
                <span className={`summary-value ${data.is_valid_location ? 'verified' : 'unverified'}`}>
                  {data.is_valid_location ? '✓ Verified' : '✗ Not Verified'}
                </span>
              </div>
            )}

            {/* Work Duration (Clock Out) */}
            {type === 'clock-out' && data.total_duration_hours !== undefined && (
              <div className="summary-row duration-row">
                <span className="summary-label">Total Work Time</span>
                <span className="summary-value duration-value">
                  {data.total_duration_hours}h {data.total_duration_minutes}m
                </span>
              </div>
            )}

            {/* Notes (if any) */}
            {data.notes && (
              <div className="summary-row notes-row">
                <span className="summary-label">Notes</span>
                <span className="summary-value notes-value">
                  {data.notes}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats (Clock Out) */}
        {type === 'clock-out' && (
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">⏱️</div>
              <div className="stat-content">
                <div className="stat-value">
                  {data.total_duration_hours || 0}h
                </div>
                <div className="stat-label">Hours Worked</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">✓</div>
              <div className="stat-content">
                <div className="stat-value">Complete</div>
                <div className="stat-label">Status</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn-dashboard" onClick={handleGoToDashboard}>
            Go to Dashboard
          </button>
          <p className="auto-redirect">
            Auto-redirecting in <strong>{countdown}</strong> seconds...
          </p>
        </div>

        {/* Tips */}
        <div className="tips-section">
          <p className="tip-icon">💡</p>
          <p className="tip-text">
            {type === 'clock-in' 
              ? 'Remember to clock out when you finish your work!' 
              : 'You can view your attendance history in the dashboard.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSuccess;
