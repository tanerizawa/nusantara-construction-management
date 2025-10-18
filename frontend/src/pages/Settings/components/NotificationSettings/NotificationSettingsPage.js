import React, { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Moon, Save, RefreshCw } from 'lucide-react';
import { API_URL } from '../../../../utils/config';

/**
 * NotificationSettingsPage Component
 * Manages user notification preferences for email, push, and in-app notifications
 */
const NotificationSettingsPage = () => {
  const [settings, setSettings] = useState({
    emailEnabled: true,
    pushEnabled: false,
    inAppEnabled: true,
    
    // Notification Types
    approvalRequests: true,
    approvalDecisions: true,
    escalations: true,
    completions: false,
    systemAlerts: true,
    
    // Frequency
    emailFrequency: 'instant', // instant, hourly, daily
    
    // Quiet Hours
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Load settings from backend
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/user-notifications/preferences`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.preferences) {
          setSettings(prev => ({ ...prev, ...data.preferences }));
        }
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/user-notifications/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ preferences: settings })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Settings saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: '❌ Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
        <span className="ml-3 text-gray-600">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage how and when you receive notifications
        </p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Notification Channels */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Channels</h3>

        {/* Email Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Email Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailEnabled}
                onChange={() => handleToggle('emailEnabled')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {settings.emailEnabled && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Frequency
              </label>
              <select
                value={settings.emailFrequency}
                onChange={(e) => handleChange('emailFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="instant">Instant (as they happen)</option>
                <option value="hourly">Hourly Digest</option>
                <option value="daily">Daily Digest</option>
              </select>
            </div>
          )}
        </div>

        {/* Push Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Smartphone className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Push Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive browser push notifications</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pushEnabled}
                onChange={() => handleToggle('pushEnabled')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>
          </div>
          {settings.pushEnabled && (
            <p className="mt-3 text-sm text-yellow-600 dark:text-yellow-500">
              ⚠️ Make sure to allow notifications in your browser settings
            </p>
          )}
        </div>

        {/* In-App Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">In-App Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Show notifications in the app</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.inAppEnabled}
                onChange={() => handleToggle('inAppEnabled')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Types</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Choose which types of notifications you want to receive
        </p>
        <div className="space-y-3">
          {[
            { 
              key: 'approvalRequests', 
              label: 'Approval Requests', 
              desc: 'When you need to approve something',
              icon: '📝'
            },
            { 
              key: 'approvalDecisions', 
              label: 'Approval Decisions', 
              desc: 'When your request is approved or rejected',
              icon: '✅'
            },
            { 
              key: 'escalations', 
              label: 'Escalations', 
              desc: 'When a request is escalated to you',
              icon: '⚠️'
            },
            { 
              key: 'completions', 
              label: 'Process Completions', 
              desc: 'When a workflow is completed',
              icon: '🎉'
            },
            { 
              key: 'systemAlerts', 
              label: 'System Alerts', 
              desc: 'Important system notifications',
              icon: '🔔'
            }
          ].map(({ key, label, desc, icon }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={() => handleToggle(key)}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
              <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quiet Hours</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't disturb me during these hours
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.quietHoursEnabled}
              onChange={() => handleToggle('quietHoursEnabled')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        
        {settings.quietHoursEnabled && (
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={settings.quietHoursStart}
                onChange={(e) => handleChange('quietHoursStart', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={settings.quietHoursEnd}
                onChange={(e) => handleChange('quietHoursEnd', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={loadSettings}
          disabled={saving}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
