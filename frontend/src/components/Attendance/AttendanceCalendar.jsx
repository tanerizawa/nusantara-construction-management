import React from 'react';
import PropTypes from 'prop-types';
import './AttendanceCalendar.css';

const AttendanceCalendar = ({ year, month, attendanceData, onDayClick }) => {
  // Get calendar data
  const getCalendarDays = () => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  // Get attendance status for a specific day
  const getAttendanceForDay = (day) => {
    if (!day || !attendanceData) return null;
    return attendanceData.find(record => {
      const recordDate = new Date(record.date);
      return recordDate.getDate() === day;
    });
  };

  // Get status color class
  const getStatusClass = (attendance) => {
    if (!attendance) return 'no-data';
    
    switch (attendance.status) {
      case 'present':
        return 'present';
      case 'late':
        return 'late';
      case 'absent':
        return 'absent';
      case 'leave':
        return 'leave';
      case 'sick':
        return 'sick';
      case 'weekend':
        return 'weekend';
      case 'holiday':
        return 'holiday';
      default:
        return 'no-data';
    }
  };

  // Get status icon
  const getStatusIcon = (attendance) => {
    if (!attendance) return '';
    
    switch (attendance.status) {
      case 'present':
        return '✓';
      case 'late':
        return '⏰';
      case 'absent':
        return '✗';
      case 'leave':
        return '🏖️';
      case 'sick':
        return '🤒';
      case 'weekend':
        return '🏠';
      case 'holiday':
        return '🎉';
      default:
        return '';
    }
  };

  // Check if day is today
  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month - 1 &&
      today.getFullYear() === year
    );
  };

  // Check if day is in future
  const isFuture = (day) => {
    if (!day) return false;
    const dayDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dayDate > today;
  };

  const days = getCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="attendance-calendar">
      {/* Week day headers */}
      <div className="calendar-header">
        {weekDays.map(day => (
          <div key={day} className="weekday-header">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="calendar-grid">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="calendar-day empty"></div>;
          }

          const attendance = getAttendanceForDay(day);
          const statusClass = getStatusClass(attendance);
          const statusIcon = getStatusIcon(attendance);
          const future = isFuture(day);
          const today = isToday(day);

          return (
            <div
              key={day}
              className={`calendar-day ${statusClass} ${today ? 'today' : ''} ${future ? 'future' : ''}`}
              onClick={() => !future && onDayClick && onDayClick(day)}
              title={attendance ? `${day}: ${attendance.status}` : `${day}: No data`}
            >
              <div className="day-number">{day}</div>
              {statusIcon && <div className="day-icon">{statusIcon}</div>}
              {attendance && attendance.clock_in_time && (
                <div className="day-time">
                  {new Date(attendance.clock_in_time).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-title">Legend:</div>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-box present">✓</span>
            <span>Present</span>
          </div>
          <div className="legend-item">
            <span className="legend-box late">⏰</span>
            <span>Late</span>
          </div>
          <div className="legend-item">
            <span className="legend-box absent">✗</span>
            <span>Absent</span>
          </div>
          <div className="legend-item">
            <span className="legend-box leave">🏖️</span>
            <span>Leave</span>
          </div>
          <div className="legend-item">
            <span className="legend-box weekend">🏠</span>
            <span>Weekend</span>
          </div>
          <div className="legend-item">
            <span className="legend-box holiday">🎉</span>
            <span>Holiday</span>
          </div>
          <div className="legend-item">
            <span className="legend-box no-data"></span>
            <span>No Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

AttendanceCalendar.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  attendanceData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      clock_in_time: PropTypes.string,
      clock_out_time: PropTypes.string
    })
  ),
  onDayClick: PropTypes.func
};

export default AttendanceCalendar;
