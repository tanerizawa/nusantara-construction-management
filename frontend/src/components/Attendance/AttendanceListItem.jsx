import React from 'react';
import './AttendanceListItem.css';

/**
 * AttendanceListItem Component
 * 
 * Display single attendance record in list view
 */
const AttendanceListItem = ({ record, onViewPhoto }) => {
  // Calculate duration
  const calculateDuration = () => {
    if (!record.total_duration_minutes) {
      if (!record.clock_out_time) return 'In Progress';
      return '0h 0m';
    }
    
    const hours = Math.floor(record.total_duration_minutes / 60);
    const minutes = record.total_duration_minutes % 60;
    return `${hours}h ${minutes}m`;
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
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  // Get status badge
  const getStatusBadge = () => {
    const status = record.status || 'present';
    const badges = {
      present: { text: 'Present', color: 'green' },
      late: { text: 'Late', color: 'yellow' },
      absent: { text: 'Absent', color: 'red' },
      leave: { text: 'Leave', color: 'blue' },
      sick: { text: 'Sick', color: 'orange' }
    };

    return badges[status] || badges.present;
  };

  const statusBadge = getStatusBadge();
  const duration = calculateDuration();
  const hasPhoto = record.photo_url;

  return (
    <div className="attendance-list-item">
      {/* Date Section */}
      <div className="item-date-section">
        <div className="date-badge">
          <span className="date-day">
            {new Date(record.clock_in_time).getDate()}
          </span>
          <span className="date-month">
            {new Date(record.clock_in_time).toLocaleDateString('id-ID', {
              month: 'short'
            })}
          </span>
        </div>
        <div className="date-info">
          <span className="date-text">{formatDate(record.clock_in_time)}</span>
          <span className={`status-badge status-${statusBadge.color}`}>
            {statusBadge.text}
          </span>
        </div>
      </div>

      {/* Time Section */}
      <div className="item-time-section">
        <div className="time-item">
          <span className="time-label">Clock In</span>
          <span className="time-value clock-in">
            {formatTime(record.clock_in_time)}
          </span>
        </div>
        <div className="time-separator">→</div>
        <div className="time-item">
          <span className="time-label">Clock Out</span>
          <span className={`time-value ${record.clock_out_time ? 'clock-out' : 'pending'}`}>
            {record.clock_out_time ? formatTime(record.clock_out_time) : 'Not yet'}
          </span>
        </div>
        <div className="time-duration">
          <span className="duration-label">Duration</span>
          <span className="duration-value">{duration}</span>
        </div>
      </div>

      {/* Details Section */}
      <div className="item-details-section">
        {/* Location */}
        <div className="detail-item">
          <span className="detail-icon">📍</span>
          <div className="detail-content">
            <span className="detail-label">Location</span>
            <span className="detail-value">{record.location_name || 'N/A'}</span>
          </div>
        </div>

        {/* Verification */}
        {record.is_valid_location !== undefined && (
          <div className="detail-item">
            <span className="detail-icon">
              {record.is_valid_location ? '✓' : '✗'}
            </span>
            <div className="detail-content">
              <span className="detail-label">Verification</span>
              <span className={`detail-value ${record.is_valid_location ? 'verified' : 'unverified'}`}>
                {record.is_valid_location ? 'Verified' : 'Not Verified'}
              </span>
            </div>
          </div>
        )}

        {/* GPS Accuracy */}
        {record.gps_accuracy && (
          <div className="detail-item">
            <span className="detail-icon">🎯</span>
            <div className="detail-content">
              <span className="detail-label">GPS Accuracy</span>
              <span className="detail-value">±{record.gps_accuracy}m</span>
            </div>
          </div>
        )}

        {/* Photo */}
        {hasPhoto && (
          <div className="detail-item photo-item">
            <span className="detail-icon">📸</span>
            <div className="detail-content">
              <span className="detail-label">Photo</span>
              <button
                className="view-photo-btn"
                onClick={() => onViewPhoto(record.photo_url)}
              >
                View Photo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notes Section */}
      {record.notes && (
        <div className="item-notes-section">
          <span className="notes-icon">📝</span>
          <div className="notes-content">
            <span className="notes-label">Notes:</span>
            <p className="notes-text">{record.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceListItem;
