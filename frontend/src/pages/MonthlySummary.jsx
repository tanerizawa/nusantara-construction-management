import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AttendanceCalendar from '../components/Attendance/AttendanceCalendar';
import MonthlyStats from '../components/Attendance/MonthlyStats';
import AttendanceCharts from '../components/Attendance/AttendanceCharts';
import './MonthlySummary.css';

const MonthlySummary = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get year and month from selectedDate
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1; // JavaScript months are 0-indexed

  // Fetch monthly summary data
  const fetchMonthlySummary = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/attendance/summary/${year}/${month}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch monthly summary');
      }

      const data = await response.json();
      setSummaryData(data);
    } catch (err) {
      console.error('Error fetching monthly summary:', err);
      setError('Failed to load monthly summary. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [year, month, navigate]);

  useEffect(() => {
    fetchMonthlySummary();
  }, [fetchMonthlySummary]);

  // Navigate to previous month
  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  // Navigate to next month
  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    
    // Don't allow future months
    const today = new Date();
    if (newDate <= today) {
      setSelectedDate(newDate);
    }
  };

  // Go to current month
  const handleToday = () => {
    setSelectedDate(new Date());
  };

  // Format month/year for display
  const formatMonthYear = () => {
    return selectedDate.toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Check if next month button should be disabled
  const isNextMonthDisabled = () => {
    const nextMonth = new Date(selectedDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const today = new Date();
    return nextMonth > today;
  };

  // Export summary to PDF using browser print dialog
  const handleExportPDF = () => {
    // Use browser's native print-to-PDF functionality
    window.print();
  };

  return (
    <div className="monthly-summary-page">
      {/* Header with month navigation */}
      <div className="summary-header">
        <button className="back-btn" onClick={() => navigate('/attendance')}>
          ← Back
        </button>

        <div className="month-selector">
          <button 
            className="nav-btn" 
            onClick={handlePrevMonth}
            title="Previous Month"
          >
            ◀
          </button>

          <div className="month-display">
            <h2>{formatMonthYear()}</h2>
          </div>

          <button 
            className="nav-btn" 
            onClick={handleNextMonth}
            disabled={isNextMonthDisabled()}
            title="Next Month"
          >
            ▶
          </button>
        </div>

        <div className="header-actions">
          <button className="today-btn" onClick={handleToday}>
            Today
          </button>
          <button className="export-btn" onClick={handleExportPDF}>
            📄 Export PDF
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading monthly summary...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-alert">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button className="retry-btn" onClick={fetchMonthlySummary}>
            Retry
          </button>
        </div>
      )}

      {/* Content */}
      {!loading && !error && summaryData && (
        <div className="summary-content">
          {/* Statistics Cards */}
          <MonthlyStats stats={summaryData.stats} />

          {/* Calendar View */}
          <div className="calendar-section">
            <div className="section-header">
              <h3>📅 Calendar View</h3>
              <p>Click on a day to view details</p>
            </div>
            <AttendanceCalendar 
              year={year}
              month={month}
              attendanceData={summaryData.calendar}
              onDayClick={(day) => {
                // Navigate to attendance history filtered by that day
                const date = new Date(year, month - 1, day);
                const dateStr = date.toISOString().split('T')[0];
                navigate(`/attendance/history?date=${dateStr}`);
              }}
            />
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            <div className="section-header">
              <h3>📊 Charts & Analytics</h3>
              <p>Visual representation of your attendance patterns</p>
            </div>
            <AttendanceCharts 
              year={year}
              month={month}
              chartsData={summaryData.charts}
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && summaryData && !summaryData.calendar?.length && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No Attendance Data</h3>
          <p>No attendance records found for {formatMonthYear()}</p>
          <button className="back-btn" onClick={() => navigate('/attendance')}>
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default MonthlySummary;
