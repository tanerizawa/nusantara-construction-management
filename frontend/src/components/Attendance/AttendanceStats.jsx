import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Target, 
  Calendar, 
  Trophy, 
  Star,
  Circle
} from 'lucide-react';
import './AttendanceStats.css';

/**
 * AttendanceStats Component
 * 
 * Displays weekly attendance statistics with charts and metrics
 * 
 * @param {Object} props
 * @param {Array} props.weeklyData - Array of attendance records for the week
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message
 */
const AttendanceStats = ({ weeklyData = [], isLoading, error }) => {
  const [stats, setStats] = useState({
    totalDays: 0,
    presentDays: 0,
    lateDays: 0,
    absentDays: 0,
    totalHours: 0,
    averageHours: 0,
    onTimePercentage: 0
  });

  useEffect(() => {
    if (!weeklyData || weeklyData.length === 0) {
      return;
    }

    // Calculate stats directly in useEffect to avoid stale closure
    const workingDays = 5; // Monday to Friday
    const presentDays = weeklyData.filter(r => r.status === 'present' || r.status === 'late').length;
    const lateDays = weeklyData.filter(r => r.status === 'late').length;
    const absentDays = workingDays - presentDays;

    // Calculate total hours
    let totalMinutes = 0;
    weeklyData.forEach(record => {
      if (record.clock_in_time && record.clock_out_time) {
        const clockIn = new Date(record.clock_in_time);
        const clockOut = new Date(record.clock_out_time);
        const diffMs = clockOut - clockIn;
        totalMinutes += Math.floor(diffMs / (1000 * 60));
      }
    });

    const totalHours = (totalMinutes / 60).toFixed(1);
    const averageHours = presentDays > 0 ? (totalMinutes / 60 / presentDays).toFixed(1) : 0;
    const onTimePercentage = presentDays > 0 ? (((presentDays - lateDays) / presentDays) * 100).toFixed(0) : 0;

    setStats({
      totalDays: workingDays,
      presentDays,
      lateDays,
      absentDays,
      totalHours: parseFloat(totalHours),
      averageHours: parseFloat(averageHours),
      onTimePercentage: parseInt(onTimePercentage)
    });
  }, [weeklyData]);

  // Get current week range
  const getWeekRange = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    const formatDate = (date) => {
      return date.toLocaleDateString('id-ID', { 
        day: 'numeric',
        month: 'short'
      });
    };

    return `${formatDate(monday)} - ${formatDate(friday)}`;
  };

  // Get day status for visualization
  const getDayStatus = (dayIndex) => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    
    const targetDay = new Date(monday);
    targetDay.setDate(monday.getDate() + dayIndex);
    
    // Check if day is in the future
    if (targetDay > today) {
      return { status: 'future', label: 'Future' };
    }

    // Check if day is today
    const isToday = targetDay.toDateString() === today.toDateString();
    
    // Find record for this day
    const record = weeklyData.find(r => {
      const recordDate = new Date(r.clock_in_time || r.date);
      return recordDate.toDateString() === targetDay.toDateString();
    });

    if (record) {
      if (record.status === 'late') {
        return { status: 'late', label: 'Late', icon: <AlertTriangle size={20} /> };
      }
      return { status: 'present', label: 'Present', icon: <CheckCircle2 size={20} /> };
    }

    if (isToday) {
      return { status: 'pending', label: 'Today', icon: <Circle size={20} /> };
    }

    return { status: 'absent', label: 'Absent', icon: <XCircle size={20} /> };
  };

  if (isLoading) {
    return (
      <div className="attendance-stats loading">
        <div className="stats-header">
          <div className="skeleton skeleton-title"></div>
        </div>
        <div className="stats-grid">
          <div className="skeleton skeleton-card"></div>
          <div className="skeleton skeleton-card"></div>
          <div className="skeleton skeleton-card"></div>
          <div className="skeleton skeleton-card"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="attendance-stats error">
        <div className="error-icon"><AlertTriangle size={64} /></div>
        <h3>Failed to Load Statistics</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="attendance-stats">
      {/* Header */}
      <div className="stats-header">
        <div className="stats-title">
          <h2>
            <TrendingUp size={24} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
            Weekly Summary
          </h2>
          <p className="stats-period">{getWeekRange()}</p>
        </div>
        <div className="stats-badge">
          <span className="badge-label">Attendance Rate</span>
          <span className="badge-value">
            {stats.totalDays > 0 ? ((stats.presentDays / stats.totalDays) * 100).toFixed(0) : 0}%
          </span>
        </div>
      </div>

      {/* Weekly Progress Bar */}
      <div className="weekly-progress">
        <div className="progress-days">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => {
            const dayStatus = getDayStatus(index);
            return (
              <div key={day} className={`progress-day ${dayStatus.status}`}>
                <div className="day-icon">{dayStatus.icon || day[0]}</div>
                <div className="day-label">{day}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {/* Present Days */}
        <div className="stat-card present">
          <div className="stat-icon"><CheckCircle2 size={36} /></div>
          <div className="stat-content">
            <span className="stat-label">Present</span>
            <span className="stat-value">{stats.presentDays}</span>
            <span className="stat-unit">days</span>
          </div>
        </div>

        {/* Late Days */}
        <div className="stat-card late">
          <div className="stat-icon"><AlertTriangle size={36} /></div>
          <div className="stat-content">
            <span className="stat-label">Late</span>
            <span className="stat-value">{stats.lateDays}</span>
            <span className="stat-unit">days</span>
          </div>
        </div>

        {/* Absent Days */}
        <div className="stat-card absent">
          <div className="stat-icon"><XCircle size={36} /></div>
          <div className="stat-content">
            <span className="stat-label">Absent</span>
            <span className="stat-value">{stats.absentDays}</span>
            <span className="stat-unit">days</span>
          </div>
        </div>

        {/* Total Hours */}
        <div className="stat-card hours">
          <div className="stat-icon"><Clock size={36} /></div>
          <div className="stat-content">
            <span className="stat-label">Total Hours</span>
            <span className="stat-value">{stats.totalHours}</span>
            <span className="stat-unit">hours</span>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="additional-metrics">
        <div className="metric-item">
          <div className="metric-icon"><TrendingUp size={28} /></div>
          <div className="metric-content">
            <span className="metric-label">Average Hours/Day</span>
            <span className="metric-value">{stats.averageHours}h</span>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-icon"><Target size={28} /></div>
          <div className="metric-content">
            <span className="metric-label">On-Time Rate</span>
            <span className="metric-value">{stats.onTimePercentage}%</span>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-icon"><Calendar size={28} /></div>
          <div className="metric-content">
            <span className="metric-label">Working Days</span>
            <span className="metric-value">{stats.totalDays} days</span>
          </div>
        </div>
      </div>

      {/* Performance Badge */}
      {stats.presentDays === stats.totalDays && stats.lateDays === 0 && (
        <div className="performance-badge excellent">
          <div className="badge-icon"><Trophy size={36} /></div>
          <div className="badge-content">
            <strong>Perfect Attendance!</strong>
            <p>You have 100% attendance this week. Excellent work!</p>
          </div>
        </div>
      )}

      {stats.onTimePercentage >= 80 && stats.onTimePercentage < 100 && (
        <div className="performance-badge good">
          <div className="badge-icon"><Star size={36} /></div>
          <div className="badge-content">
            <strong>Great Performance!</strong>
            <p>Your on-time rate is {stats.onTimePercentage}%. Keep it up!</p>
          </div>
        </div>
      )}

      {stats.absentDays > 2 && (
        <div className="performance-badge warning">
          <div className="badge-icon"><AlertTriangle size={36} /></div>
          <div className="badge-content">
            <strong>Attendance Warning</strong>
            <p>You have {stats.absentDays} absent days this week. Please maintain regular attendance.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceStats;
