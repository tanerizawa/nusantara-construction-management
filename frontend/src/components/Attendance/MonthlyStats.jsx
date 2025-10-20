import React from 'react';
import PropTypes from 'prop-types';
import './MonthlyStats.css';

const MonthlyStats = ({ stats }) => {
  if (!stats) return null;

  // Calculate percentages
  const totalWorkingDays = stats.total_working_days || 0;
  const presentDays = stats.present_days || 0;
  const lateDays = stats.late_days || 0;
  const absentDays = stats.absent_days || 0;
  const leaveDays = stats.leave_days || 0;

  const attendanceRate = totalWorkingDays > 0 
    ? ((presentDays + lateDays) / totalWorkingDays * 100).toFixed(1)
    : 0;

  const onTimeRate = (presentDays + lateDays) > 0
    ? (presentDays / (presentDays + lateDays) * 100).toFixed(1)
    : 0;

  // Format hours
  const formatHours = (minutes) => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const totalHours = formatHours(stats.total_work_minutes);
  const avgHours = formatHours(stats.average_work_minutes);

  // Stats configuration
  const statsConfig = [
    {
      icon: '📅',
      label: 'Total Working Days',
      value: totalWorkingDays,
      color: '#667eea',
      description: 'Days in month'
    },
    {
      icon: '✓',
      label: 'Present',
      value: presentDays,
      color: '#28a745',
      description: 'Days attended',
      percentage: totalWorkingDays > 0 ? ((presentDays / totalWorkingDays) * 100).toFixed(0) + '%' : '0%'
    },
    {
      icon: '⏰',
      label: 'Late',
      value: lateDays,
      color: '#ffc107',
      description: 'Late arrivals',
      percentage: totalWorkingDays > 0 ? ((lateDays / totalWorkingDays) * 100).toFixed(0) + '%' : '0%'
    },
    {
      icon: '✗',
      label: 'Absent',
      value: absentDays,
      color: '#dc3545',
      description: 'Days missed',
      percentage: totalWorkingDays > 0 ? ((absentDays / totalWorkingDays) * 100).toFixed(0) + '%' : '0%'
    },
    {
      icon: '🏖️',
      label: 'On Leave',
      value: leaveDays,
      color: '#007bff',
      description: 'Approved leaves',
      percentage: totalWorkingDays > 0 ? ((leaveDays / totalWorkingDays) * 100).toFixed(0) + '%' : '0%'
    },
    {
      icon: '🕐',
      label: 'Total Hours',
      value: totalHours,
      color: '#6f42c1',
      description: 'Time worked'
    },
    {
      icon: '⏱️',
      label: 'Average Hours',
      value: avgHours,
      color: '#fd7e14',
      description: 'Per day'
    },
    {
      icon: '📊',
      label: 'Attendance Rate',
      value: attendanceRate + '%',
      color: attendanceRate >= 90 ? '#28a745' : attendanceRate >= 75 ? '#ffc107' : '#dc3545',
      description: 'Overall rate'
    },
    {
      icon: '🎯',
      label: 'On-Time Rate',
      value: onTimeRate + '%',
      color: onTimeRate >= 90 ? '#28a745' : onTimeRate >= 75 ? '#ffc107' : '#dc3545',
      description: 'Punctuality'
    }
  ];

  return (
    <div className="monthly-stats">
      <div className="stats-grid">
        {statsConfig.map((stat, index) => (
          <div 
            key={index} 
            className="stat-card"
            style={{ '--stat-color': stat.color }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
              {stat.percentage && (
                <div className="stat-percentage">{stat.percentage}</div>
              )}
              <div className="stat-description">{stat.description}</div>
            </div>
            <div className="stat-accent" style={{ backgroundColor: stat.color }}></div>
          </div>
        ))}
      </div>

      {/* Summary Bar */}
      <div className="summary-bar">
        <h4>Monthly Summary</h4>
        <div className="summary-visualization">
          {presentDays > 0 && (
            <div 
              className="summary-segment present" 
              style={{ width: `${(presentDays / totalWorkingDays) * 100}%` }}
              title={`Present: ${presentDays} days`}
            >
              {presentDays > 0 && <span>{presentDays}</span>}
            </div>
          )}
          {lateDays > 0 && (
            <div 
              className="summary-segment late" 
              style={{ width: `${(lateDays / totalWorkingDays) * 100}%` }}
              title={`Late: ${lateDays} days`}
            >
              {lateDays > 0 && <span>{lateDays}</span>}
            </div>
          )}
          {absentDays > 0 && (
            <div 
              className="summary-segment absent" 
              style={{ width: `${(absentDays / totalWorkingDays) * 100}%` }}
              title={`Absent: ${absentDays} days`}
            >
              {absentDays > 0 && <span>{absentDays}</span>}
            </div>
          )}
          {leaveDays > 0 && (
            <div 
              className="summary-segment leave" 
              style={{ width: `${(leaveDays / totalWorkingDays) * 100}%` }}
              title={`Leave: ${leaveDays} days`}
            >
              {leaveDays > 0 && <span>{leaveDays}</span>}
            </div>
          )}
        </div>
        <div className="summary-legend">
          <div className="legend-item">
            <span className="legend-dot present"></span>
            <span>Present ({presentDays})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot late"></span>
            <span>Late ({lateDays})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot absent"></span>
            <span>Absent ({absentDays})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot leave"></span>
            <span>Leave ({leaveDays})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

MonthlyStats.propTypes = {
  stats: PropTypes.shape({
    total_working_days: PropTypes.number,
    present_days: PropTypes.number,
    late_days: PropTypes.number,
    absent_days: PropTypes.number,
    leave_days: PropTypes.number,
    total_work_minutes: PropTypes.number,
    average_work_minutes: PropTypes.number
  })
};

export default MonthlyStats;
