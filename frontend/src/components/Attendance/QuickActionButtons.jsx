import React, { useState } from 'react';
import { Clock, LogOut, History, Lightbulb, Loader } from 'lucide-react';
import './QuickActionButtons.css';

/**
 * QuickActionButtons Component
 * 
 * Provides quick action buttons for clock in/out operations
 * 
 * @param {Object} props
 * @param {Object} props.todayRecord - Today's attendance record
 * @param {Function} props.onClockIn - Callback when clock in clicked
 * @param {Function} props.onClockOut - Callback when clock out clicked
 * @param {Function} props.onViewHistory - Callback when view history clicked
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.disabled - Disabled state
 */
const QuickActionButtons = ({
  todayRecord,
  onClockIn,
  onClockOut,
  onViewHistory,
  isLoading = false,
  disabled = false
}) => {
  const [actionLoading, setActionLoading] = useState(null);

  // Check if can clock in
  const canClockIn = !todayRecord && !isLoading && !disabled;
  
  // Check if can clock out
  const canClockOut = todayRecord && !todayRecord.clock_out_time && !isLoading && !disabled;

  // Handle clock in
  const handleClockIn = async () => {
    if (!canClockIn) return;
    
    setActionLoading('clockIn');
    try {
      await onClockIn?.();
    } finally {
      setActionLoading(null);
    }
  };

  // Handle clock out
  const handleClockOut = async () => {
    if (!canClockOut) return;
    
    // Confirm before clock out
    if (!window.confirm('Are you sure you want to clock out?')) {
      return;
    }
    
    setActionLoading('clockOut');
    try {
      await onClockOut?.();
    } finally {
      setActionLoading(null);
    }
  };

  // Handle view history
  const handleViewHistory = () => {
    onViewHistory?.();
  };

  return (
    <div className="quick-action-buttons">
      {/* Clock In Button */}
      <button
        className={`action-btn clock-in ${canClockIn ? 'active' : 'disabled'}`}
        onClick={handleClockIn}
        disabled={!canClockIn || actionLoading === 'clockIn'}
      >
        <div className="btn-icon">
          {actionLoading === 'clockIn' ? (
            <Loader className="spinner" size={48} />
          ) : (
            <Clock size={48} />
          )}
        </div>
        <div className="btn-content">
          <span className="btn-title">Clock In</span>
          <span className="btn-subtitle">
            {canClockIn 
              ? 'Start your workday' 
              : todayRecord 
                ? 'Already clocked in' 
                : 'Not available'}
          </span>
        </div>
        {canClockIn && (
          <div className="btn-arrow">→</div>
        )}
      </button>

      {/* Clock Out Button */}
      <button
        className={`action-btn clock-out ${canClockOut ? 'active' : 'disabled'}`}
        onClick={handleClockOut}
        disabled={!canClockOut || actionLoading === 'clockOut'}
      >
        <div className="btn-icon">
          {actionLoading === 'clockOut' ? (
            <Loader className="spinner" size={48} />
          ) : (
            <LogOut size={48} />
          )}
        </div>
        <div className="btn-content">
          <span className="btn-title">Clock Out</span>
          <span className="btn-subtitle">
            {canClockOut 
              ? 'End your workday' 
              : todayRecord?.clock_out_time
                ? 'Already clocked out'
                : 'Clock in first'}
          </span>
        </div>
        {canClockOut && (
          <div className="btn-arrow">→</div>
        )}
      </button>

      {/* View History Button */}
      <button
        className="action-btn view-history active"
        onClick={handleViewHistory}
        disabled={isLoading}
      >
        <div className="btn-icon">
          <History size={48} />
        </div>
        <div className="btn-content">
          <span className="btn-title">View History</span>
          <span className="btn-subtitle">Check your attendance records</span>
        </div>
        <div className="btn-arrow">→</div>
      </button>

      {/* Status Hints */}
      {todayRecord && !todayRecord.clock_out_time && (
        <div className="status-hint active">
          <Lightbulb className="hint-icon" size={24} />
          <div className="hint-content">
            <strong>You're clocked in!</strong>
            <p>Don't forget to clock out when you finish work.</p>
          </div>
        </div>
      )}

      {todayRecord?.clock_out_time && (
        <div className="status-hint completed">
          <div className="hint-icon">✅</div>
          <div className="hint-content">
            <strong>All done for today!</strong>
            <p>Have a great rest of your day.</p>
          </div>
        </div>
      )}

      {!todayRecord && (
        <div className="status-hint pending">
          <div className="hint-icon"><Clock size={24} /></div>
          <div className="hint-content">
            <strong>Ready to start?</strong>
            <p>Clock in to begin tracking your work hours.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActionButtons;
