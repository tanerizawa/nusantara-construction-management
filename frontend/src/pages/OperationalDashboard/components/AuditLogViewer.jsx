/**
 * Audit Log Viewer Component
 * Browse and filter audit trail logs with export capabilities
 */

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '../../../services/api';
import { FileText, Download, Filter, Search, User, Calendar, Shield, Info, AlertTriangle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const AuditLogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    action: '',
    entityType: '',
    userId: '',
    startDate: '',
    endDate: '',
    search: ''
  });

  const [actions, setActions] = useState([]);
  const [entityTypes, setEntityTypes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [clearing, setClearing] = useState(false);

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
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchLogs();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, [currentPage, filters]);

  const fetchMetadata = async () => {
    try {
      console.log('📊 Fetching audit metadata...');
      const [actionsRes, typesRes] = await Promise.all([
        apiClient.get('/audit/actions'),
        apiClient.get('/audit/entity-types')
      ]);
      
      console.log('✅ Actions Response:', actionsRes.data);
      console.log('✅ Entity Types Response:', typesRes.data);
      
      const actionsData = actionsRes.data.data || actionsRes.data;
      const typesData = typesRes.data.data || typesRes.data;
      
      setActions(Array.isArray(actionsData) ? actionsData : []);
      setEntityTypes(Array.isArray(typesData) ? typesData : []);
    } catch (error) {
      console.error('❌ Error fetching metadata:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching audit logs...');
      
      const params = {
        page: currentPage,
        limit: 20,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        )
      };

      console.log('📋 Params:', params);
      const response = await apiClient.get('/audit/logs', { params });
      console.log('✅ Audit Logs Response:', response.data);
      
      const data = response.data.data || response.data;
      console.log('📦 Logs data:', data);
      
      setLogs(data.logs || []);
      setTotalPages(data.pages || 1);
      setTotalLogs(data.total || 0);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('❌ Error fetching logs:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      action: '',
      entityType: '',
      userId: '',
      startDate: '',
      endDate: '',
      search: ''
    });
    setCurrentPage(1);
  };

  const handleExport = async () => {
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      
      const blob = await auditApi.exportLogs(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit_logs_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting logs:', error);
      alert('Failed to export logs: ' + (error.message || 'Unknown error'));
    }
  };

  const handleClearAllLogs = async () => {
    if (confirmationText !== 'CLEAR ALL LOGS') {
      toast.error('Please type "CLEAR ALL LOGS" to confirm');
      return;
    }

    try {
      setClearing(true);
      console.log('🗑️  Clearing all audit logs...');
      
      const response = await apiClient.delete('/audit/logs/clear-all', {
        data: { confirmationCode: 'CLEAR_ALL_LOGS' }
      });

      console.log('✅ Clear response:', response.data);
      
      if (response.data.success) {
        toast.success(`Successfully cleared ${response.data.data.deletedCount} logs`);
        setShowClearConfirm(false);
        setConfirmationText('');
        fetchLogs(); // Refresh
      }
    } catch (error) {
      console.error('❌ Error clearing logs:', error);
      toast.error('Failed to clear logs: ' + (error.response?.data?.error || error.message));
    } finally {
      setClearing(false);
    }
  };

  const getActionBadge = (action) => {
    const colors = {
      CREATE: 'bg-green-900/30 text-green-400',
      UPDATE: 'bg-blue-900/30 text-blue-400',
      DELETE: 'bg-red-900/30 text-red-400',
      LOGIN: 'bg-purple-900/30 text-purple-400',
      LOGOUT: 'bg-gray-900/30 text-gray-400',
      VIEW: 'bg-yellow-900/30 text-yellow-400',
      EXPORT: 'bg-orange-900/30 text-orange-400',
      APPROVE: 'bg-cyan-900/30 text-cyan-400',
      REJECT: 'bg-pink-900/30 text-pink-400'
    };
    return colors[action] || 'bg-gray-900/30 text-gray-400';
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2C2C2E] rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border border-red-500/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-900/30 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Clear All Audit Logs?</h3>
                <p className="text-sm text-gray-400">This action is irreversible</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <p className="text-sm text-red-400 mb-2">
                  <strong>⚠️ Warning:</strong> This will permanently delete ALL {totalLogs.toLocaleString()} audit logs.
                </p>
                <ul className="text-xs text-gray-400 space-y-1 ml-4 list-disc">
                  <li>Cannot be undone</li>
                  <li>No backup will be created</li>
                  <li>Historical data will be lost</li>
                  <li>Compliance records will be removed</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type <code className="px-2 py-1 bg-gray-800 rounded text-red-400 font-mono">CLEAR ALL LOGS</code> to confirm:
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
                  }}
                  disabled={clearing}
                  className="flex-1 px-4 py-2 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAllLogs}
                  disabled={clearing || confirmationText !== 'CLEAR ALL LOGS'}
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
                      Clear All Logs
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#2C2C2E] rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-900/30 rounded-lg">
                <FileText className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Audit Trail</h2>
                <p className="text-sm text-gray-400 mt-1">
                  {totalLogs.toLocaleString()} total logs
                  {lastUpdate && (
                    <span className="ml-2">• Last updated: {formatDate(lastUpdate, 'HH:mm:ss')}</span>
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                showFilters
                  ? 'border-blue-500 bg-blue-900/30 text-blue-400'
                  : 'border-gray-700 text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              title="Clear all audit logs (irreversible)"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Logs
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search logs..."
                    className="pl-10 w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#1C1C1E] border border-gray-700 text-white placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Action
                </label>
                <select
                  value={filters.action}
                  onChange={(e) => handleFilterChange('action', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#1C1C1E] border border-gray-700 text-white"
                >
                  <option value="">All Actions</option>
                  {actions.map(action => (
                    <option key={action} value={action}>{action}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Entity Type
                </label>
                <select
                  value={filters.entityType}
                  onChange={(e) => handleFilterChange('entityType', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#1C1C1E] border border-gray-700 text-white"
                >
                  <option value="">All Types</option>
                  {entityTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#1C1C1E] border border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#1C1C1E] border border-gray-700 text-white"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleResetFilters}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logs Table */}
      <div className="bg-[#2C2C2E] rounded-lg shadow overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-[#1C1C1E]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Entity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#2C2C2E] divide-y divide-gray-700">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {formatDate(log.timestamp || log.createdAt, 'MMM dd, yyyy HH:mm:ss')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-white">{log.userName || log.userId || '-'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getActionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{log.entityType}</div>
                      {log.entityId && (
                        <div className="text-xs text-gray-400">ID: {log.entityId}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">
                      {log.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {log.ipAddress || '-'}
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
              className="px-4 py-2 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogViewer;
