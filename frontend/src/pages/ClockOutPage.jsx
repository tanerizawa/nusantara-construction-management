import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';
import './ClockOutPage.css';

/**
 * ClockOutPage Component
 * 
 * Simplified clock out flow:
 * 1. Show today's attendance info
 * 2. Calculate work duration
 * 3. Optional notes
 * 4. Confirm and submit
 */
const ClockOutPage = () => {
  const navigate = useNavigate();

  // State
  const [todayRecord, setTodayRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState('');
  const [workDuration, setWorkDuration] = useState({ hours: 0, minutes: 0 });

  // Get token
  const getToken = () => localStorage.getItem('token');

  // Fetch today's record
  useEffect(() => {
    const fetchTodayRecord = async () => {
      try {
        setIsLoading(true);
        const token = getToken();
        
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch('/api/attendance/today', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          navigate('/login');
          return;
        }

        if (response.status === 404) {
          // No record today
          setError('No clock in record found for today. Please clock in first.');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch attendance record');
        }

        const data = await response.json();
        
        // Check if already clocked out
        if (data.data && data.data.clock_out_time) {
          setError('You have already clocked out today.');
          return;
        }

        setTodayRecord(data.data);
      } catch (err) {
        console.error('Error fetching record:', err);
        setError(err.message || 'Failed to load attendance record');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayRecord();
  }, [navigate]);

  // Calculate work duration
  useEffect(() => {
    if (todayRecord && todayRecord.clock_in_time) {
      const calculateDuration = () => {
        const clockIn = new Date(todayRecord.clock_in_time);
        const now = new Date();
        const diffMs = now - clockIn;
        const diffMins = Math.floor(diffMs / 60000);
        const hours = Math.floor(diffMins / 60);
        const minutes = diffMins % 60;
        
        setWorkDuration({ hours, minutes });
      };

      calculateDuration();
      const interval = setInterval(calculateDuration, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [todayRecord]);

  // Handle submit
  const handleSubmit = async () => {
    if (!window.confirm('Are you sure you want to clock out?')) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/attendance/clock-out', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notes: notes || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to clock out');
      }

      const data = await response.json();
      console.log('Clock out success:', data);

      // Navigate to success page
      navigate('/attendance/success', {
        state: {
          type: 'clock-out',
          data: {
            ...data.data,
            total_duration_hours: workDuration.hours,
            total_duration_minutes: workDuration.minutes
          },
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error('Clock out error:', err);
      setError(err.message || 'Failed to clock out. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
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

  // Loading state
  if (isLoading) {
    return (
      <div className="clock-out-page">
        <div className="clock-out-header">
          <button className="back-btn" onClick={handleCancel}>← Back</button>
          <h1>Clock Out</h1>
          <div></div>
        </div>
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !todayRecord) {
    return (
      <div className="clock-out-page">
        <div className="clock-out-header">
          <button className="back-btn" onClick={handleCancel}>← Back</button>
          <h1>Clock Out</h1>
          <div></div>
        </div>
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Cannot Clock Out</h2>
          <p>{error}</p>
          <button className="back-to-dashboard" onClick={handleCancel}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary message="Failed to load clock out page">
      <div className="clock-out-page">
        {/* Header */}
        <div className="clock-out-header">
          <button className="back-btn" onClick={handleCancel}>
            ← Back
          </button>
          <h1>Clock Out</h1>
          <div></div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="error-alert">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <strong>Error</strong>
              <p>{error}</p>
            </div>
            <button className="alert-close" onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Content */}
        <div className="clock-out-content">
          {/* Today's Info */}
          <div className="info-card">
            <div className="card-header">
              <h2>📅 Today's Attendance</h2>
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="info-label">Date</span>
                <span className="info-value">
                  {formatDate(todayRecord?.clock_in_time)}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Clock In</span>
                <span className="info-value clock-in-time">
                  {formatTime(todayRecord?.clock_in_time)}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Location</span>
                <span className="info-value">
                  {todayRecord?.location_name || 'N/A'}
                </span>
              </div>
              {todayRecord?.is_valid_location && (
                <div className="info-row">
                  <span className="info-label">Status</span>
                  <span className="info-value verified">
                    ✓ Location Verified
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Work Duration */}
          <div className="duration-card">
            <div className="card-header">
              <h2>⏱️ Work Duration</h2>
            </div>
            <div className="card-body">
              <div className="duration-display">
                <div className="duration-item">
                  <div className="duration-value">{workDuration.hours}</div>
                  <div className="duration-label">Hours</div>
                </div>
                <div className="duration-separator">:</div>
                <div className="duration-item">
                  <div className="duration-value">{workDuration.minutes}</div>
                  <div className="duration-label">Minutes</div>
                </div>
              </div>
              <p className="duration-note">
                This is your total work time for today
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="notes-card">
            <div className="card-header">
              <h2>📝 Notes (Optional)</h2>
            </div>
            <div className="card-body">
              <textarea
                className="notes-input"
                placeholder="Add any notes about your work today..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
              <p className="notes-hint">
                You can add notes about completed tasks, issues, or any other relevant information
              </p>
            </div>
          </div>

          {/* Current Time */}
          <div className="current-time-card">
            <div className="clock-icon">🕐</div>
            <div className="current-time-content">
              <span className="current-time-label">Clocking out at</span>
              <span className="current-time-value">
                {new Date().toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Submitting...
              </>
            ) : (
              'Confirm Clock Out'
            )}
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ClockOutPage;
