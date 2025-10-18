/**
 * Security Sessions Component
 * View and manage active user sessions with login history
 */

import React, { useState, useEffect } from 'react';
import { securityApi } from '../../../services/operationalApi';
import { 
  Shield, Monitor, MapPin, Clock, LogOut, User, 
  Smartphone, Laptop, Globe 
} from 'lucide-react';
import { format } from 'date-fns';

const SecuritySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [currentPage]);

  const fetchData = async () => {
    try {
      const [sessionsRes, historyRes] = await Promise.all([
        securityApi.getActiveSessions(),
        securityApi.getLoginHistory({ page: currentPage, limit: 10 })
      ]);

      setSessions(sessionsRes.data || []);
      setLoginHistory(historyRes.data.history || []);
      setTotalPages(historyRes.data.pages || 1);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching security data:', error);
      setLoading(false);
    }
  };

  const handleTerminateSession = async (token) => {
    const confirmed = window.confirm(
      'Are you sure you want to terminate this session?\n\nThe user will be logged out immediately.'
    );

    if (!confirmed) return;

    try {
      await securityApi.terminateSession(token);
      alert('Session terminated successfully!');
      await fetchData();
    } catch (error) {
      console.error('Error terminating session:', error);
      alert('Failed to terminate session: ' + (error.message || 'Unknown error'));
    }
  };

  const getDeviceIcon = (deviceType) => {
    if (!deviceType) return <Monitor className="h-5 w-5 text-gray-400" />;
    
    const type = deviceType.toLowerCase();
    if (type.includes('mobile') || type.includes('android') || type.includes('iphone')) {
      return <Smartphone className="h-5 w-5 text-blue-500" />;
    }
    return <Laptop className="h-5 w-5 text-green-500" />;
  };

  const getStatusBadge = (success) => {
    return success 
      ? <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Success</span>
      : <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Failed</span>;
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
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              {sessions.length} active
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {sessions.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No active sessions found.
            </div>
          ) : (
            sessions.map((session) => (
              <div key={session.token} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      {getDeviceIcon(session.deviceType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          {session.userName}
                        </h4>
                        {session.isCurrent && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800">
                            Current Session
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>
                            {session.ipAddress} 
                            {session.location && ` • ${session.location.city}, ${session.location.country}`}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Monitor className="h-4 w-4 text-gray-400" />
                          <span>{session.deviceType || 'Unknown Device'}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span className="truncate max-w-md">{session.userAgent}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>
                            Login: {format(new Date(session.loginAt), 'MMM dd, yyyy HH:mm:ss')}
                          </span>
                        </div>
                        
                        {session.lastActivity && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>
                              Last activity: {format(new Date(session.lastActivity), 'MMM dd, yyyy HH:mm:ss')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <button
                      onClick={() => handleTerminateSession(session.token)}
                      className="ml-4 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg border border-red-300 flex items-center gap-2"
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
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <Clock className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Login History</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address / Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loginHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No login history found.
                  </td>
                </tr>
              ) : (
                loginHistory.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {entry.userName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(entry.success)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.ipAddress}</div>
                      {entry.location && (
                        <div className="text-xs text-gray-500">
                          {entry.location.city}, {entry.location.country}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getDeviceIcon(entry.deviceType)}
                        <span className="ml-2 text-sm text-gray-900">
                          {entry.deviceType || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(entry.loginAt), 'MMM dd, yyyy HH:mm:ss')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
