/**
 * Backup Manager Component
 * Manage database backups with create, verify, restore, and download capabilities
 */

import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../services/api';
import toast from 'react-hot-toast';
import { backupApi } from '../../../services/operationalApi';
import { 
  Database, Download, CheckCircle, XCircle, Clock, 
  RefreshCw, Trash2, AlertTriangle, HardDrive, Shield, Info 
} from 'lucide-react';
import { format } from 'date-fns';

const BackupManager = () => {
  const [backups, setBackups] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [description, setDescription] = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);

  // Fetch all data (backups + stats)
  const fetchData = async () => {
    await Promise.all([fetchBackups(), fetchStats()]);
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [currentPage]);

  // Fetch backup statistics
  const fetchStats = async () => {
    try {
      console.log('📊 Fetching backup stats...');
      const response = await apiClient.get('/backup/stats');
      console.log('✅ Stats Response:', response.data);
      
      // Backend returns stats inside 'data' object
      const statsData = response.data.data || response.data;
      setStats(statsData);
    } catch (error) {
      console.error('❌ Error fetching backup stats:', error);
      console.error('Error response:', error.response?.data);
    }
  };

  // Fetch backups
  const fetchBackups = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching backups from API...');
      const response = await apiClient.get('/backup/list', {
        params: {
          limit: 10,
          offset: (currentPage - 1) * 10,
          includeDeleted: false
        }
      });
      console.log('✅ Backup API Response:', response.data);
      
      // Backend returns data inside 'data' object
      const backupData = response.data.data || response.data;
      console.log('� Backups data:', backupData);
      
      setBackups(backupData.backups || []);
      setTotalPages(backupData.pages || 1);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('❌ Error fetching backups:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Failed to fetch backup history');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    if (creating) return;
    
    try {
      setCreating(true);
      await backupApi.createBackup(description);
      setDescription('');
      await fetchData();
      alert('Backup created successfully!');
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Failed to create backup: ' + (error.message || 'Unknown error'));
    } finally {
      setCreating(false);
    }
  };

  const handleVerifyBackup = async (id) => {
    try {
      const result = await backupApi.verifyBackup(id);
      if (result.success) {
        alert('Backup verified successfully!');
        await fetchData();
      }
    } catch (error) {
      console.error('Error verifying backup:', error);
      alert('Failed to verify backup: ' + (error.message || 'Unknown error'));
    }
  };

  const handleRestoreBackup = async (id, fileName) => {
    const confirmed = window.confirm(
      `⚠️ WARNING: This will restore the database from backup "${fileName}".\n\n` +
      'ALL CURRENT DATA WILL BE REPLACED!\n\n' +
      'Are you absolutely sure you want to continue?'
    );

    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      'This is your FINAL confirmation.\n\n' +
      'Type YES in the next prompt to proceed with restore.'
    );

    if (!doubleConfirm) return;

    const finalConfirm = prompt('Type "YES" to confirm restore:');
    if (finalConfirm !== 'YES') {
      alert('Restore cancelled.');
      return;
    }

    try {
      const result = await backupApi.restoreBackup(id, true);
      if (result.success) {
        alert('Backup restored successfully! Application will reload...');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      alert('Failed to restore backup: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDeleteBackup = async (id, fileName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete backup "${fileName}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await backupApi.deleteBackup(id);
      alert('Backup deleted successfully!');
      await fetchData();
    } catch (error) {
      console.error('Error deleting backup:', error);
      alert('Failed to delete backup: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDownloadBackup = async (id, fileName) => {
    try {
      const blob = await backupApi.downloadBackup(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading backup:', error);
      alert('Failed to download backup: ' + (error.message || 'Unknown error'));
    }
  };

  // Format bytes to human readable
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Format date with error handling
  const formatDate = (dateString, formatString = 'PPp') => {
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

  // Get status badge color (dark matte theme)
  const getStatusColor = (status) => {
    const colors = {
      'COMPLETED': 'bg-green-900/30 text-green-400',
      'VERIFIED': 'bg-blue-900/30 text-blue-400',
      'IN_PROGRESS': 'bg-yellow-900/30 text-yellow-400',
      'FAILED': 'bg-red-900/30 text-red-400',
      'CORRUPTED': 'bg-red-900/30 text-red-400'
    };
    return colors[status] || 'bg-gray-900/30 text-gray-400';
  };

  // Get type badge color (dark matte theme)
  const getTypeColor = (type) => {
    const colors = {
      'FULL': 'bg-purple-900/30 text-purple-400',
      'INCREMENTAL': 'bg-indigo-900/30 text-indigo-400',
      'MANUAL': 'bg-cyan-900/30 text-cyan-400'
    };
    return colors[type] || 'bg-gray-900/30 text-gray-400';
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
      {/* Header with Last Update */}
      {lastUpdate && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#2C2C2E] rounded-lg border border-gray-700">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <RefreshCw className="h-3 w-3" />
            <span>Auto-refresh every 30s</span>
          </div>
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg shadow-md hover:shadow-lg transition-all p-6" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: '#98989D' }}>Total Backups</p>
                <p className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>{stats.totalBackups || 0}</p>
              </div>
              <Database className="h-8 w-8" style={{ color: '#0A84FF' }} />
            </div>
          </div>
          
          <div className="rounded-lg shadow-md hover:shadow-lg transition-all p-6" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: '#98989D' }}>Success Rate</p>
                <p className="text-2xl font-bold" style={{ color: '#30D158' }}>{stats.successRate || 0}%</p>
              </div>
              <CheckCircle className="h-8 w-8" style={{ color: '#30D158' }} />
            </div>
          </div>

          <div className="rounded-lg shadow-md hover:shadow-lg transition-all p-6" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: '#98989D' }}>Total Size</p>
                <p className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>{formatBytes(stats.totalSize)}</p>
              </div>
              <HardDrive className="h-8 w-8" style={{ color: '#BF5AF2' }} />
            </div>
          </div>

          <div className="rounded-lg shadow-md hover:shadow-lg transition-all p-6" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: '#98989D' }}>Avg Compression</p>
                <p className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>{stats.averageCompression || 0}%</p>
              </div>
              <Shield className="h-8 w-8" style={{ color: '#FF9F0A' }} />
            </div>
          </div>
        </div>
      )}

      {/* Latest Backup Info */}
      {stats?.latestBackup && (
        <div className="p-4 rounded" style={{ backgroundColor: 'rgba(10, 132, 255, 0.1)', border: '1px solid rgba(10, 132, 255, 0.3)' }}>
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 mt-0.5" style={{ color: '#0A84FF' }} />
            <div className="ml-3">
              <h3 className="text-sm font-medium" style={{ color: '#0A84FF' }}>Latest Backup</h3>
              <p className="text-sm mt-1" style={{ color: '#0A84FF' }}>
                {stats.latestBackup.fileName} • {formatBytes(stats.latestBackup.fileSize)} • 
                {stats.latestBackup.status} • {stats.latestBackup.compressionRatio}% compression
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Create Backup */}
      <div className="rounded-lg shadow-md hover:shadow-lg transition-all p-6" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
        <div className="flex items-center space-x-2 mb-4">
          <Database className="h-5 w-5" style={{ color: '#0A84FF' }} />
          <h3 className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>Create Manual Backup</h3>
          <div className="group relative">
            <Info className="h-4 w-4 cursor-help" style={{ color: '#98989D' }} />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10" style={{ backgroundColor: '#2C2C2E', color: '#FFFFFF', border: '1px solid #38383A' }}>
              <p className="font-semibold mb-1">Manual Backup</p>
              <p>Creates an immediate database backup. Useful before major updates or changes.</p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent" style={{ borderTopColor: '#2C2C2E' }}></div>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Backup description (optional)"
            className="flex-1 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
            style={{ backgroundColor: '#1C1C1E', border: '1px solid #38383A', color: '#FFFFFF' }}
          />
          <button
            onClick={handleCreateBackup}
            disabled={creating}
            className="px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
            style={{ backgroundColor: '#0A84FF', color: '#FFFFFF' }}
          >
            {creating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                Create Backup
              </>
            )}
          </button>
        </div>
      </div>

      {/* Backup List */}
      <div className="rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #38383A', backgroundColor: '#1C1C1E' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HardDrive className="h-6 w-6" style={{ color: '#0A84FF' }} />
              <h3 className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>Backup History</h3>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: 'rgba(10,132,255,0.1)', color: '#0A84FF' }}>{backups.length} backups</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-[#1C1C1E]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#2C2C2E] divide-y divide-gray-700">
              {backups.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12">
                    <div className="flex flex-col items-center justify-center text-center">
                      <HardDrive className="h-16 w-16 text-gray-500 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">No Backups Found</h3>
                      <p className="text-gray-400 mb-4">You haven't created any backups yet.</p>
                      <button
                        onClick={() => document.querySelector('input[placeholder="Backup description (optional)"]').focus()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                      >
                        Create First Backup
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                backups.map((backup) => (
                  <tr key={backup.id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <Database className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-white">{backup.fileName}</div>
                          {backup.description && (
                            <div className="text-sm text-gray-400 mt-1">{backup.description}</div>
                          )}
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                            <span>by {backup.triggeredByUsername || 'system'}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(backup.backupType)}`}>
                              {backup.backupType}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(backup.status)}`}>
                          {backup.status}
                        </span>
                        {backup.status === 'VERIFIED' && (
                          <Shield className="h-4 w-4 text-green-500" title="Verified" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      <div className="font-medium">{formatBytes(backup.fileSize)}</div>
                      {backup.compressionRatio && (
                        <div className="text-xs text-gray-400">
                          {parseFloat(backup.compressionRatio).toFixed(1)}% compression
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {formatDate(backup.startedAt, 'PPp')}
                      </div>
                      {backup.expiresAt && (
                        <div className="text-xs text-gray-400">
                          Expires: {formatDate(backup.expiresAt, 'PP')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {backup.status === 'COMPLETED' && backup.status !== 'VERIFIED' && (
                          <button
                            onClick={() => handleVerifyBackup(backup.id)}
                            className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-lg transition-all"
                            title="Verify Backup"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDownloadBackup(backup.id, backup.fileName)}
                          className="p-2 text-green-400 hover:bg-green-900/20 rounded-lg transition-all"
                          title="Download Backup"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRestoreBackup(backup.id, backup.fileName)}
                          className="p-2 text-yellow-400 hover:bg-yellow-900/20 rounded-lg transition-all"
                          title="Restore Backup"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBackup(backup.id, backup.fileName)}
                          className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                          title="Delete Backup"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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

export default BackupManager;
