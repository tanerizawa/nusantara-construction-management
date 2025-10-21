import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Smartphone, MapPin, Camera, Lightbulb, AlertTriangle } from 'lucide-react';
import TodayStatusCard from '../components/Attendance/TodayStatusCard';
import QuickActionButtons from '../components/Attendance/QuickActionButtons';
import AttendanceStats from '../components/Attendance/AttendanceStats';
import ErrorBoundary from '../components/ErrorBoundary';
import './AttendanceDashboard.css';

/**
 * AttendanceDashboard Page
 * 
 * Main attendance page showing:
 * - Today's attendance status
 * - Quick action buttons (Clock In/Out)
 * - Weekly statistics
 * 
 * Integrates with Phase 1 backend APIs
 */
const AttendanceDashboard = () => {
  const navigate = useNavigate();
  const [todayRecord, setTodayRecord] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch today's attendance record
  const fetchTodayRecord = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Note: projectId is optional - if not provided, backend will return first available or null
      const response = await fetch('/api/attendance/today', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        if (response.status === 404 || response.status === 400) {
          // No record found or no project - this is OK, just return null
          setTodayRecord(null);
          return;
        }
        throw new Error(`Failed to fetch today's record: ${response.statusText}`);
      }

      const data = await response.json();
      setTodayRecord(data.data || null);
    } catch (err) {
      console.error('Error fetching today record:', err);
      // Only set error for critical errors, not for missing data
      if (!err.message.includes('404') && !err.message.includes('400')) {
        setError(err.message);
      }
      
      // Redirect to login if unauthorized
      if (err.message.includes('Authentication') || err.message.includes('Session expired')) {
        setTimeout(() => navigate('/login'), 2000);
      }
    }
  }, [navigate]);

  // Fetch weekly attendance data
  const fetchWeeklyData = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Get current week's Monday and Friday
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(today.getDate() - today.getDay() + 1);
      monday.setHours(0, 0, 0, 0);

      const friday = new Date(monday);
      friday.setDate(monday.getDate() + 4);
      friday.setHours(23, 59, 59, 999);

      const startDate = monday.toISOString().split('T')[0];
      const endDate = friday.toISOString().split('T')[0];

      const response = await fetch(
        `/api/attendance/history?start_date=${startDate}&end_date=${endDate}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`Failed to fetch weekly data: ${response.statusText}`);
      }

      const data = await response.json();
      setWeeklyData(data.data || []);
    } catch (err) {
      console.error('Error fetching weekly data:', err);
      // Don't set error state here, just log it
      setWeeklyData([]);
    }
  }, [navigate]);

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      await Promise.all([
        fetchTodayRecord(),
        fetchWeeklyData()
      ]);

      setIsLoading(false);
    };

    loadData();
  }, [fetchTodayRecord, fetchWeeklyData]);

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchTodayRecord(),
      fetchWeeklyData()
    ]);
    setRefreshing(false);
  };

  // Handle clock in
  const handleClockIn = () => {
    // Navigate to clock in page with camera/GPS flow
    navigate('/attendance/clock-in');
  };

  // Handle clock out
  const handleClockOut = () => {
    // Navigate to clock out page with camera/GPS flow
    navigate('/attendance/clock-out');
  };

  // Handle view history
  const handleViewHistory = () => {
    navigate('/attendance/history');
  };

  // Get user info from localStorage
  const getUserInfo = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

  const user = getUserInfo();

  return (
    <ErrorBoundary message="Failed to load attendance dashboard">
      <div className="attendance-dashboard">
        {/* Page Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Attendance Dashboard</h1>
            <p className="header-subtitle">
              Welcome back, <strong>{user?.name || 'User'}</strong>
            </p>
          </div>
          <button 
            className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh data"
          >
            <RefreshCw className={`refresh-icon ${refreshing ? 'refreshing' : ''}`} size={18} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="error-alert">
            <AlertTriangle className="alert-icon" size={32} />
            <div className="alert-content">
              <strong>Error</strong>
              <p>{error}</p>
            </div>
            <button 
              className="alert-close"
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="dashboard-content">
          {/* Today Status Card */}
          <TodayStatusCard
            todayRecord={todayRecord}
            isLoading={isLoading}
            error={error}
          />

          {/* Quick Action Buttons */}
          <QuickActionButtons
            todayRecord={todayRecord}
            onClockIn={handleClockIn}
            onClockOut={handleClockOut}
            onViewHistory={handleViewHistory}
            isLoading={isLoading}
            disabled={!!error}
          />

          {/* Weekly Statistics */}
          <AttendanceStats
            weeklyData={weeklyData}
            isLoading={isLoading}
            error={null} // Don't show error in stats, just show empty state
          />

          {/* Additional Info Cards */}
          <div className="info-cards">
            <div className="info-card">
              <Smartphone className="info-card-icon" size={48} />
              <div className="info-card-content">
                <h3>Mobile Friendly</h3>
                <p>Clock in/out from anywhere using your phone</p>
              </div>
            </div>

            <div className="info-card">
              <MapPin className="info-card-icon" size={48} />
              <div className="info-card-content">
                <h3>GPS Verified</h3>
                <p>Accurate location tracking with GPS verification</p>
              </div>
            </div>

            <div className="info-card">
              <Camera className="info-card-icon" size={48} />
              <div className="info-card-content">
                <h3>Photo Required</h3>
                <p>Take a selfie for attendance verification</p>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="help-section">
            <Lightbulb className="help-icon" size={48} />
            <div className="help-content">
              <h3>Need Help?</h3>
              <p>
                Make sure you're within the project location radius and have enabled 
                camera and GPS permissions on your device.
              </p>
              <button 
                className="help-btn"
                onClick={() => navigate('/help/attendance')}
              >
                View Guide →
              </button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AttendanceDashboard;
