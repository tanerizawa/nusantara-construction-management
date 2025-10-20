import React from 'react';
import PropTypes from 'prop-types';
import './AttendanceCharts.css';

const AttendanceCharts = ({ year, month, chartsData }) => {
  if (!chartsData) return null;

  const { daily, weekly, summary, workHours } = chartsData;

  // Calculate max values for scaling
  const maxDailyValue = daily ? Math.max(...daily.map(d => d.value || 0)) : 0;
  const maxWeeklyValue = weekly ? Math.max(...weekly.map(w => w.value || 0)) : 0;
  const maxWorkHours = workHours ? Math.max(...workHours.map(w => w.hours || 0)) : 0;

  // Calculate percentages for pie chart
  const getSummaryPercentages = () => {
    if (!summary) return [];
    const total = summary.present + summary.late + summary.absent + summary.leave;
    if (total === 0) return [];

    return [
      {
        label: 'Present',
        value: summary.present,
        percentage: ((summary.present / total) * 100).toFixed(1),
        color: '#28a745',
        dashOffset: 0
      },
      {
        label: 'Late',
        value: summary.late,
        percentage: ((summary.late / total) * 100).toFixed(1),
        color: '#ffc107',
        dashOffset: ((summary.present / total) * 100)
      },
      {
        label: 'Absent',
        value: summary.absent,
        percentage: ((summary.absent / total) * 100).toFixed(1),
        color: '#dc3545',
        dashOffset: (((summary.present + summary.late) / total) * 100)
      },
      {
        label: 'Leave',
        value: summary.leave,
        percentage: ((summary.leave / total) * 100).toFixed(1),
        color: '#007bff',
        dashOffset: (((summary.present + summary.late + summary.absent) / total) * 100)
      }
    ];
  };

  const summaryPercentages = getSummaryPercentages();

  return (
    <div className="attendance-charts">
      {/* Daily Trend Line Chart */}
      {daily && daily.length > 0 && (
        <div className="chart-container">
          <h4 className="chart-title">📈 Daily Attendance Trend</h4>
          <div className="line-chart">
            <div className="chart-y-axis">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="y-axis-label">
                  {Math.round((maxDailyValue * (5 - i)) / 5)}
                </div>
              ))}
            </div>
            <div className="chart-area">
              {/* Grid lines */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid-line"></div>
              ))}
              
              {/* Line path */}
              <svg className="line-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  points={daily.map((d, i) => 
                    `${(i / (daily.length - 1)) * 100},${100 - ((d.value / maxDailyValue) * 100)}`
                  ).join(' ')}
                  fill="none"
                  stroke="#667eea"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Data points */}
                {daily.map((d, i) => (
                  <circle
                    key={i}
                    cx={(i / (daily.length - 1)) * 100}
                    cy={100 - ((d.value / maxDailyValue) * 100)}
                    r="1"
                    fill="white"
                    stroke="#667eea"
                    strokeWidth="0.5"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>
              
              {/* X-axis labels */}
              <div className="x-axis">
                {daily.map((d, i) => (
                  i % Math.ceil(daily.length / 7) === 0 && (
                    <div key={i} className="x-axis-label" style={{ left: `${(i / (daily.length - 1)) * 100}%` }}>
                      {d.label}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Bar Chart */}
      {weekly && weekly.length > 0 && (
        <div className="chart-container">
          <h4 className="chart-title">📊 Weekly Comparison</h4>
          <div className="bar-chart">
            {weekly.map((w, i) => (
              <div key={i} className="bar-item">
                <div className="bar-wrapper">
                  <div 
                    className="bar-fill"
                    style={{ 
                      height: `${(w.value / maxWeeklyValue) * 100}%`,
                      backgroundColor: `hsl(${240 - (i * 30)}, 70%, 60%)`
                    }}
                    title={`Week ${w.label}: ${w.value} days`}
                  >
                    <span className="bar-value">{w.value}</span>
                  </div>
                </div>
                <div className="bar-label">{w.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Summary Pie Chart */}
      {summaryPercentages.length > 0 && (
        <div className="chart-container">
          <h4 className="chart-title">🥧 Monthly Summary</h4>
          <div className="pie-chart-wrapper">
            <svg className="pie-chart" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="20"
              />
              {summaryPercentages.map((segment, i) => {
                const circumference = 2 * Math.PI * 50;
                const segmentLength = (segment.percentage / 100) * circumference;
                const offset = -(segment.dashOffset / 100) * circumference;

                return (
                  <circle
                    key={i}
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="20"
                    strokeDasharray={`${segmentLength} ${circumference}`}
                    strokeDashoffset={offset}
                    transform="rotate(-90 60 60)"
                    className="pie-segment"
                  />
                );
              })}
            </svg>
            <div className="pie-legend">
              {summaryPercentages.map((segment, i) => (
                <div key={i} className="pie-legend-item">
                  <span 
                    className="legend-color" 
                    style={{ backgroundColor: segment.color }}
                  ></span>
                  <span className="legend-label">{segment.label}</span>
                  <span className="legend-percentage">{segment.percentage}%</span>
                  <span className="legend-value">({segment.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Work Hours Stacked Bar */}
      {workHours && workHours.length > 0 && (
        <div className="chart-container">
          <h4 className="chart-title">⏰ Work Hours by Week</h4>
          <div className="stacked-bar-chart">
            {workHours.map((w, i) => (
              <div key={i} className="stacked-bar-item">
                <div className="stacked-bar-wrapper">
                  <div 
                    className="stacked-bar-fill"
                    style={{ 
                      height: `${(w.hours / maxWorkHours) * 100}%`,
                      background: `linear-gradient(135deg, #667eea, #764ba2)`
                    }}
                    title={`Week ${w.label}: ${w.hours}h`}
                  >
                    <span className="stacked-bar-value">{w.hours}h</span>
                  </div>
                </div>
                <div className="stacked-bar-label">{w.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

AttendanceCharts.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  chartsData: PropTypes.shape({
    daily: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired
      })
    ),
    weekly: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired
      })
    ),
    summary: PropTypes.shape({
      present: PropTypes.number,
      late: PropTypes.number,
      absent: PropTypes.number,
      leave: PropTypes.number
    }),
    workHours: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        hours: PropTypes.number.isRequired
      })
    )
  })
};

export default AttendanceCharts;
