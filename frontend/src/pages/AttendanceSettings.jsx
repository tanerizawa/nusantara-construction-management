import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AttendanceSettings.css';

const AttendanceSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    work_start_time: '08:00',
    work_end_time: '17:00',
    geolocation_radius: 100,
    auto_clockout_time: '18:00',
    late_threshold_minutes: 15,
    enable_notifications: true,
    enable_geolocation: true,
    enable_auto_clockout: false,
    require_photo: true
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/attendance/settings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          navigate('/login');
          return;
        }

        if (response.status === 403) {
          alert('You do not have permission to access settings');
          navigate('/attendance');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }

        const data = await response.json();
        if (data.data) {
          setSettings({
            work_start_time: data.data.work_start_time || '08:00',
            work_end_time: data.data.work_end_time || '17:00',
            geolocation_radius: data.data.geolocation_radius || 100,
            auto_clockout_time: data.data.auto_clockout_time || '18:00',
            late_threshold_minutes: data.data.late_threshold_minutes || 15,
            enable_notifications: data.data.enable_notifications !== false,
            enable_geolocation: data.data.enable_geolocation !== false,
            enable_auto_clockout: data.data.enable_auto_clockout === true,
            require_photo: data.data.require_photo !== false
          });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [navigate]);

  // Handle change
  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setSuccess(false);
  };

  // Validate settings
  const validate = () => {
    const errors = [];

    // Validate work hours
    if (settings.work_start_time >= settings.work_end_time) {
      errors.push('Work start time must be before end time');
    }

    // Validate radius
    if (settings.geolocation_radius < 10 || settings.geolocation_radius > 1000) {
      errors.push('Geolocation radius must be between 10 and 1000 meters');
    }

    // Validate late threshold
    if (settings.late_threshold_minutes < 1 || settings.late_threshold_minutes > 60) {
      errors.push('Late threshold must be between 1 and 60 minutes');
    }

    // Validate auto clock-out time
    if (settings.enable_auto_clockout && settings.auto_clockout_time <= settings.work_end_time) {
      errors.push('Auto clock-out time must be after work end time');
    }

    return errors;
  };

  // Handle save
  const handleSave = async () => {
    setError(null);
    setSuccess(false);

    // Validate
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '));
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/attendance/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (response.status === 403) {
        throw new Error('You do not have permission to update settings');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="attendance-settings loading">
        <div className="loading-spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="attendance-settings">
      {/* Page Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/attendance')}>
          <span>←</span>
          <span>Back</span>
        </button>
        <div className="header-content">
          <h1>Attendance Settings</h1>
          <p>Configure attendance system parameters</p>
        </div>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="success-alert">
          <span className="success-icon">✓</span>
          <span className="success-message">Settings saved successfully!</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="error-alert">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{error}</span>
          <button className="error-close" onClick={() => setError(null)}>✗</button>
        </div>
      )}

      {/* Settings Form */}
      <div className="settings-form">
        {/* Work Hours Group */}
        <div className="settings-group">
          <div className="group-header">
            <span className="group-icon">⏰</span>
            <h2>Work Hours</h2>
          </div>
          <div className="group-content">
            <div className="setting-item">
              <label>
                <span className="setting-label">Work Start Time</span>
                <span className="setting-description">Default clock-in time</span>
              </label>
              <input
                type="time"
                value={settings.work_start_time}
                onChange={(e) => handleChange('work_start_time', e.target.value)}
              />
            </div>
            <div className="setting-item">
              <label>
                <span className="setting-label">Work End Time</span>
                <span className="setting-description">Default clock-out time</span>
              </label>
              <input
                type="time"
                value={settings.work_end_time}
                onChange={(e) => handleChange('work_end_time', e.target.value)}
              />
            </div>
            <div className="setting-item">
              <label>
                <span className="setting-label">Late Threshold</span>
                <span className="setting-description">Minutes after start time to mark as late</span>
              </label>
              <div className="input-with-unit">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.late_threshold_minutes}
                  onChange={(e) => handleChange('late_threshold_minutes', parseInt(e.target.value))}
                />
                <span className="input-unit">minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Geolocation Group */}
        <div className="settings-group">
          <div className="group-header">
            <span className="group-icon">📍</span>
            <h2>Geolocation</h2>
          </div>
          <div className="group-content">
            <div className="setting-item toggle">
              <label>
                <div>
                  <span className="setting-label">Enable Geolocation</span>
                  <span className="setting-description">Require location when clocking in/out</span>
                </div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.enable_geolocation}
                    onChange={(e) => handleChange('enable_geolocation', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
            </div>
            {settings.enable_geolocation && (
              <div className="setting-item">
                <label>
                  <span className="setting-label">Radius Tolerance</span>
                  <span className="setting-description">Maximum distance from project location</span>
                </label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={settings.geolocation_radius}
                    onChange={(e) => handleChange('geolocation_radius', parseInt(e.target.value))}
                  />
                  <span className="input-unit">meters</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Auto Clock-Out Group */}
        <div className="settings-group">
          <div className="group-header">
            <span className="group-icon">🔔</span>
            <h2>Auto Clock-Out</h2>
          </div>
          <div className="group-content">
            <div className="setting-item toggle">
              <label>
                <div>
                  <span className="setting-label">Enable Auto Clock-Out</span>
                  <span className="setting-description">Automatically clock out employees</span>
                </div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.enable_auto_clockout}
                    onChange={(e) => handleChange('enable_auto_clockout', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
            </div>
            {settings.enable_auto_clockout && (
              <div className="setting-item">
                <label>
                  <span className="setting-label">Auto Clock-Out Time</span>
                  <span className="setting-description">Time to auto clock-out if not done manually</span>
                </label>
                <input
                  type="time"
                  value={settings.auto_clockout_time}
                  onChange={(e) => handleChange('auto_clockout_time', e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Notifications Group */}
        <div className="settings-group">
          <div className="group-header">
            <span className="group-icon">🔔</span>
            <h2>Notifications</h2>
          </div>
          <div className="group-content">
            <div className="setting-item toggle">
              <label>
                <div>
                  <span className="setting-label">Enable Notifications</span>
                  <span className="setting-description">Send push notifications to employees</span>
                </div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.enable_notifications}
                    onChange={(e) => handleChange('enable_notifications', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Photo Requirement Group */}
        <div className="settings-group">
          <div className="group-header">
            <span className="group-icon">📷</span>
            <h2>Photo Requirement</h2>
          </div>
          <div className="group-content">
            <div className="setting-item toggle">
              <label>
                <div>
                  <span className="setting-label">Require Photo</span>
                  <span className="setting-description">Require selfie when clocking in/out</span>
                </div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.require_photo}
                    onChange={(e) => handleChange('require_photo', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="form-actions">
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner"></span>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSettings;
