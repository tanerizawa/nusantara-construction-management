import React, { useState, useEffect } from 'react';
import { Shield, Lock, Key, Eye, EyeOff, Save, AlertTriangle, Check, X, History, Monitor } from 'lucide-react';
import { API_URL } from '../../../../utils/config';

/**
 * SecuritySettingsPage Component
 * Manages user security settings including password change, login history, and sessions
 */
const SecuritySettingsPage = () => {
  const [activeTab, setActiveTab] = useState('password');
  
  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);

  // Login History State
  const [loginHistory, setLoginHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Active Sessions State
  const [activeSessions, setActiveSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  useEffect(() => {
    if (activeTab === 'history') {
      loadLoginHistory();
    } else if (activeTab === 'sessions') {
      loadActiveSessions();
    }
  }, [activeTab]);

  // Calculate password strength
  useEffect(() => {
    const password = passwordData.newPassword;
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15;

    setPasswordStrength(strength);
  }, [passwordData.newPassword]);

  const loadLoginHistory = async () => {
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/login-history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLoginHistory(data.history || []);
      }
    } catch (error) {
      console.error('Error loading login history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadActiveSessions = async () => {
    setLoadingSessions(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setActiveSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match!' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters long!' });
      return;
    }

    if (passwordStrength < 60) {
      setPasswordMessage({ type: 'error', text: 'Password is too weak! Add uppercase, numbers, and special characters.' });
      return;
    }

    setChangingPassword(true);
    setPasswordMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        setPasswordMessage({ type: 'success', text: '✅ Password changed successfully!' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setPasswordMessage(null), 3000);
      } else {
        const error = await response.json();
        setPasswordMessage({ type: 'error', text: error.message || 'Failed to change password' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setChangingPassword(false);
    }
  };

  const revokeSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to end this session?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadActiveSessions();
      }
    } catch (error) {
      console.error('Error revoking session:', error);
    }
  };

  const logoutAllDevices = async () => {
    if (!window.confirm('This will log you out from all devices including this one. Continue?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/logout-all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error logging out all devices:', error);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Shield className="h-6 w-6 text-blue-500" />
          <span>Security Settings</span>
        </h2>
        <p className="text-[#8E8E93] mt-1">Manage your account security and login settings</p>
      </div>

      {/* Tabs */}
      <div className="bg-[#2C2C2E] rounded-lg border border-[#3A3A3C]">
        <div className="flex overflow-x-auto border-b border-[#3A3A3C]">
          {[
            { id: 'password', label: 'Change Password', icon: Lock },
            { id: 'history', label: 'Login History', icon: History },
            { id: 'sessions', label: 'Active Sessions', icon: Monitor }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === id
                  ? 'text-[#0A84FF] border-b-2 border-[#0A84FF]'
                  : 'text-[#8E8E93] hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Change Password Tab */}
          {activeTab === 'password' && (
            <div className="max-w-2xl">
              <form onSubmit={handlePasswordChange} className="space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-[#1C1C1E] text-white rounded-lg border border-[#3A3A3C] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8E8E93] hover:text-white"
                    >
                      {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-[#1C1C1E] text-white rounded-lg border border-[#3A3A3C] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8E8E93] hover:text-white"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  {/* Password Strength Meter */}
                  {passwordData.newPassword && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#8E8E93]">Password Strength</span>
                        <span className={`text-xs font-medium ${
                          passwordStrength < 40 ? 'text-red-500' :
                          passwordStrength < 70 ? 'text-yellow-500' :
                          'text-green-500'
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-[#2C2C2E] rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-[#8E8E93] space-y-1">
                        <p className={passwordData.newPassword.length >= 8 ? 'text-green-500' : ''}>
                          {passwordData.newPassword.length >= 8 ? '✓' : '○'} At least 8 characters
                        </p>
                        <p className={/[A-Z]/.test(passwordData.newPassword) ? 'text-green-500' : ''}>
                          {/[A-Z]/.test(passwordData.newPassword) ? '✓' : '○'} Uppercase letter
                        </p>
                        <p className={/[0-9]/.test(passwordData.newPassword) ? 'text-green-500' : ''}>
                          {/[0-9]/.test(passwordData.newPassword) ? '✓' : '○'} Number
                        </p>
                        <p className={/[^a-zA-Z0-9]/.test(passwordData.newPassword) ? 'text-green-500' : ''}>
                          {/[^a-zA-Z0-9]/.test(passwordData.newPassword) ? '✓' : '○'} Special character
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-[#1C1C1E] text-white rounded-lg border border-[#3A3A3C] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8E8E93] hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="mt-2 text-xs text-red-500 flex items-center space-x-1">
                      <X size={14} />
                      <span>Passwords do not match</span>
                    </p>
                  )}
                  {passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
                    <p className="mt-2 text-xs text-green-500 flex items-center space-x-1">
                      <Check size={14} />
                      <span>Passwords match</span>
                    </p>
                  )}
                </div>

                {/* Message */}
                {passwordMessage && (
                  <div className={`p-4 rounded-lg ${
                    passwordMessage.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {passwordMessage.text}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={changingPassword || passwordStrength < 60}
                  className="px-6 py-3 bg-[#0A84FF] text-white rounded-lg hover:bg-[#409CFF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {changingPassword ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>Changing Password...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Change Password</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Login History Tab */}
          {activeTab === 'history' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Recent Login Activity</h3>
                <button
                  onClick={loadLoginHistory}
                  className="text-sm text-[#0A84FF] hover:text-[#409CFF] transition-colors"
                >
                  Refresh
                </button>
              </div>

              {loadingHistory ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0A84FF] border-t-transparent mx-auto mb-3" />
                  <p className="text-[#8E8E93]">Loading history...</p>
                </div>
              ) : loginHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History size={48} className="mx-auto text-[#3A3A3C] mb-3" />
                  <p className="text-[#8E8E93]">No login history available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {loginHistory.map((login, index) => (
                    <div
                      key={index}
                      className="p-4 bg-[#1C1C1E] rounded-lg border border-[#3A3A3C] hover:border-[#48484A] transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-block w-2 h-2 rounded-full ${
                              login.success ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <span className="text-white font-medium">
                              {login.success ? 'Successful Login' : 'Failed Login'}
                            </span>
                          </div>
                          <div className="mt-2 space-y-1 text-sm text-[#8E8E93]">
                            <p>IP Address: {login.ipAddress || 'Unknown'}</p>
                            <p>Device: {login.userAgent || 'Unknown'}</p>
                            {login.location && <p>Location: {login.location}</p>}
                          </div>
                        </div>
                        <span className="text-xs text-[#636366]">
                          {formatDate(login.loginAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Active Sessions Tab */}
          {activeTab === 'sessions' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Active Sessions</h3>
                  <p className="text-sm text-[#8E8E93] mt-1">Manage devices where you're currently logged in</p>
                </div>
                <button
                  onClick={logoutAllDevices}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  Logout All Devices
                </button>
              </div>

              {loadingSessions ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0A84FF] border-t-transparent mx-auto mb-3" />
                  <p className="text-[#8E8E93]">Loading sessions...</p>
                </div>
              ) : activeSessions.length === 0 ? (
                <div className="text-center py-12">
                  <Monitor size={48} className="mx-auto text-[#3A3A3C] mb-3" />
                  <p className="text-[#8E8E93]">No active sessions found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeSessions.map((session, index) => (
                    <div
                      key={index}
                      className="p-4 bg-[#1C1C1E] rounded-lg border border-[#3A3A3C] hover:border-[#48484A] transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Monitor className="text-[#0A84FF] flex-shrink-0" size={24} />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-medium">
                                {session.device || 'Unknown Device'}
                              </span>
                              {session.current && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-green-500 text-white rounded">
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="mt-2 space-y-1 text-sm text-[#8E8E93]">
                              <p>IP: {session.ipAddress || 'Unknown'}</p>
                              <p>Location: {session.location || 'Unknown'}</p>
                              <p>Last Active: {formatDate(session.lastActive)}</p>
                            </div>
                          </div>
                        </div>
                        {!session.current && (
                          <button
                            onClick={() => revokeSession(session.id)}
                            className="px-3 py-1 text-sm text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          >
                            End Session
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="text-blue-500 flex-shrink-0" size={20} />
          <div className="flex-1">
            <h4 className="text-white font-medium mb-2">Security Tips</h4>
            <ul className="text-sm text-[#8E8E93] space-y-1">
              <li>• Use a strong, unique password for your account</li>
              <li>• Change your password regularly (every 3-6 months)</li>
              <li>• Don't share your password with anyone</li>
              <li>• Review login history regularly for suspicious activity</li>
              <li>• End sessions on devices you no longer use</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsPage;
