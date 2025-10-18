/**
 * Security Sessions Component
 * View and manage active user sessions with login history
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { securityApi } from '../../../services/operationalApi';
import { 
  Shield, Monitor, MapPin, Clock, LogOut, User, 
  Smartphone, Laptop, Globe, AlertTriangle, Info 
} from 'lucide-react';
import { format } from 'date-fns';

const SecuritySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastUpdate, setLastUpdate] = useState(null);

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
        axios.get('/api/auth/sessions'),
        axios.get('/api/auth/login-history', {
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
      await axios.delete(`/api/auth/sessions/${sessionId}`);
      toast.success('Session terminated successfully!');
      await fetchData();
    } catch (error) {
      console.error('Error terminating session:', error);
      toast.error('Failed to terminate session: ' + (error.response?.data?.error || 'Unknown error'));
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
      ? <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Success</span>
      : <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Failed</span>;
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
      {/* Active Sessions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Active Sessions</h3>
                {lastUpdate && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last updated: {formatDate(lastUpdate, 'HH:mm:ss')}
                  </p>
                )}
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm font-semibold">
              {sessions.length} active
            </span>
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
              <div key={session.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      {getDeviceIcon(session.deviceType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {session.device || 'Unknown Device'}
                        </h4>
                        {session.current && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Current Session
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>
                            {session.ipAddress || '-'} 
                            {session.location && ` • ${session.location}`}
                            {session.country && ` (${session.country})`}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Monitor className="h-4 w-4 text-gray-400" />
                          <span>{session.browser || 'Unknown'} • {session.os || 'Unknown OS'}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
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
                      className="ml-4 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-red-300 dark:border-red-700 flex items-center gap-2 transition-all"
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Login History</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  IP Address / Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loginHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No login history found.
                  </td>
                </tr>
              ) : (
                loginHistory.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {entry.userName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(entry.success)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">{entry.ipAddress}</div>
                      {entry.location && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {entry.location.city}, {entry.location.country}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getDeviceIcon(entry.deviceType)}
                        <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                          {entry.deviceType || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
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
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
