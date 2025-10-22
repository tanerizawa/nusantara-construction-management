/**
 * Security Sessions Component
 * View and manage active user sessions with login history
 */

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '../../../services/api';
import { 
  Shield, Monitor, MapPin, Clock, LogOut, User, 
  Smartphone, Laptop, Globe, AlertTriangle, Info, Trash2 
} from 'lucide-react';
import { format } from 'date-fns';

const SecuritySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [clearing, setClearing] = useState(false);
  const [clearType, setClearType] = useState(''); // 'all' or 'old'

  // Format date with error handling
  const formatDate = (dateString, formatString = 'MMM dd, yyyy HH:mm:ss') => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return format(date, formatString);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching security data...');
      
      const [sessionsRes, historyRes] = await Promise.all([
        apiClient.get('/auth/sessions'),
        apiClient.get('/auth/login-history', {
          params: { page: currentPage, limit: 10 }
        })
      ]);

      console.log('✅ Sessions Response:', sessionsRes.data);
      console.log('✅ Login History Response:', historyRes.data);

      setSessions(sessionsRes.data.sessions || []);
      setLoginHistory(historyRes.data.history || []);
      setTotalPages(Math.ceil((historyRes.data.count || 0) / 10));
      setLastUpdate(new Date());
    } catch (error) {
      console.error('❌ Error fetching security data:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Failed to fetch security data');
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateSession = async (sessionId) => {
    const confirmed = window.confirm(
      'Are you sure you want to terminate this session?\n\nThe user will be logged out immediately.'
    );

    if (!confirmed) return;

    try {
      await apiClient.delete(`/auth/sessions/${sessionId}`);
      toast.success('Session terminated successfully!');
      await fetchData();
    } catch (error) {
      console.error('Error terminating session:', error);
      toast.error('Failed to terminate session: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleClearSessions = async () => {
    const expectedText = clearType === 'all' ? 'CLEAR ALL SESSIONS' : 'CLEAR OLD SESSIONS';
    
    if (confirmationText !== expectedText) {
      toast.error(`Please type "${expectedText}" to confirm`);
      return;
    }

    try {
      setClearing(true);
      console.log(`🗑️  Clearing ${clearType} sessions...`);
      
      const endpoint = clearType === 'all' 
        ? '/auth/sessions/clear-all'
        : '/auth/sessions/clear-old';
      
      const response = await apiClient.delete(endpoint, {
        data: { 
          confirmationCode: expectedText.replace(/ /g, '_'),
          daysOld: clearType === 'old' ? 7 : undefined
        }
      });

      console.log('✅ Clear response:', response.data);
      
      if (response.data.success) {
        toast.success(`Successfully cleared ${response.data.data.deletedCount} sessions`);
        setShowClearConfirm(false);
        setConfirmationText('');
        setClearType('');
        fetchData(); // Refresh
      }
    } catch (error) {
      console.error('❌ Error clearing sessions:', error);
      toast.error('Failed to clear sessions: ' + (error.response?.data?.error || error.message));
    } finally {
      setClearing(false);
    }
  };

  const getDeviceIcon = (deviceType) => {
    if (!deviceType) return <Monitor className="h-5 w-5 text-gray-400" />;
    
    const type = deviceType.toLowerCase();
    if (type.includes('mobile') || type.includes('android') || type.includes('iphone')) {
      return <Smartphone className="h-5 w-5 text-blue-500" />;
    }
    if (type.includes('tablet') || type.includes('ipad')) {
      return <Monitor className="h-5 w-5 text-purple-500" />;
    }
    return <Laptop className="h-5 w-5 text-green-500" />;
  };

  const getStatusBadge = (success) => {
    return success 
      ? <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-900/30 text-green-400">Success</span>
      : <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-900/30 text-red-400">Failed</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Clear Sessions Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2C2C2E] rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border border-red-500/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-900/30 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {clearType === 'all' ? 'Clear All Sessions?' : 'Clear Old Sessions?'}
                </h3>
                <p className="text-sm text-gray-400">This action cannot be undone</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <p className="text-sm text-red-400 mb-2">
                  <strong>⚠️ Warning:</strong> This will {clearType === 'all' 
                    ? `terminate ALL ${sessions.length - 1} other sessions (except current)` 
                    : 'terminate all sessions older than 7 days'
                  }
                </p>
                <ul className="text-xs text-gray-400 space-y-1 ml-4 list-disc">
                  <li>{clearType === 'all' ? 'All other users will be logged out' : 'Inactive sessions will be removed'}</li>
                  <li>Users will need to log in again</li>
                  <li>Current session will remain active</li>
                  {clearType === 'all' && <li className="text-red-400">Use with caution in production!</li>}
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type <code className="px-2 py-1 bg-gray-800 rounded text-red-400 font-mono">
                    {clearType === 'all' ? 'CLEAR ALL SESSIONS' : 'CLEAR OLD SESSIONS'}
                  </code> to confirm:
                </label>
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="Type confirmation text..."
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-[#1C1C1E] border border-gray-700 text-white placeholder-gray-500"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowClearConfirm(false);
                    setConfirmationText('');
                    setClearType('');
                  }}
                  disabled={clearing}
                  className="flex-1 px-4 py-2 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearSessions}
                  disabled={clearing || confirmationText !== (clearType === 'all' ? 'CLEAR ALL SESSIONS' : 'CLEAR OLD SESSIONS')}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {clearing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Clearing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Clear Sessions
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Sessions */}
      <div className="bg-[#2C2C2E] rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700 bg-[#1C1C1E]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-900/30 rounded-lg">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Active Sessions</h3>
                {lastUpdate && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last updated: {formatDate(lastUpdate, 'HH:mm:ss')}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full text-sm font-semibold">
                {sessions.length} active
              </span>
              <button
                onClick={() => {
                  setClearType('old');
                  setShowClearConfirm(true);
                }}
                className="px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 text-sm"
                title="Clear sessions older than 7 days"
              >
                <Trash2 className="h-4 w-4" />
                Clear Old
              </button>
              <button
                onClick={() => {
                  setClearType('all');
                  setShowClearConfirm(true);
                }}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm"
                title="Clear all sessions except current"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {sessions.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              <Shield className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p className="font-medium">No active sessions found.</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="px-6 py-4 hover:bg-gray-800 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      {getDeviceIcon(session.deviceType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-sm font-medium text-white">
                          {session.device || 'Unknown Device'}
                        </h4>
                        {session.current && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Current Session
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>
                            {session.ipAddress || '-'} 
                            {session.location && ` • ${session.location}`}
                            {session.country && ` (${session.country})`}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Monitor className="h-4 w-4 text-gray-400" />
                          <span>{session.browser || 'Unknown'} • {session.os || 'Unknown OS'}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>
                            Login: {formatDate(session.createdAt, 'MMM dd, yyyy HH:mm:ss')}
                          </span>
                        </div>
                        
                        {session.lastActive && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>
                              Last active: {formatDate(session.lastActive, 'MMM dd, yyyy HH:mm:ss')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {!session.current && (
                    <button
                      onClick={() => handleTerminateSession(session.id)}
                      className="ml-4 px-3 py-1.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg border border-red-700 flex items-center gap-2 transition-all"
                    >
                      <LogOut className="h-4 w-4" />
                      Terminate
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Login History */}
      <div className="bg-[#2C2C2E] rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700 bg-[#1C1C1E]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-900/30 rounded-lg">
              <Clock className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Login History</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-[#1C1C1E]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  IP Address / Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#2C2C2E] divide-y divide-gray-700">
              {loginHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                    No login history found.
                  </td>
                </tr>
              ) : (
                loginHistory.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-white">
                          {entry.userName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(entry.success)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{entry.ipAddress}</div>
                      {entry.location && (
                        <div className="text-xs text-gray-400">
                          {entry.location.city}, {entry.location.country}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getDeviceIcon(entry.deviceType)}
                        <span className="ml-2 text-sm text-white">
                          {entry.deviceType || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {formatDate(entry.loginAt || entry.createdAt, 'MMM dd, yyyy HH:mm:ss')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySessions;
