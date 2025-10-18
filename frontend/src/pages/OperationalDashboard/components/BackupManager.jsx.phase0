/**
 * Backup Manager Component
 * Manage database backups with create, verify, restore, and download capabilities
 */

import React, { useState, useEffect } from 'react';
import { backupApi } from '../../../services/operationalApi';
import { 
  Database, Download, CheckCircle, XCircle, Clock, 
  RefreshCw, Trash2, AlertTriangle, HardDrive 
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

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      const [backupsRes, statsRes] = await Promise.all([
        backupApi.listBackups({ page: currentPage, limit: 10 }),
        backupApi.getStats()
      ]);

      setBackups(backupsRes.data.backups || []);
      setTotalPages(backupsRes.data.pages || 1);
      setStats(statsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching backups:', error);
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Completed</span>;
      case 'VERIFIED':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Verified</span>;
      case 'FAILED':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Failed</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">In Progress</span>;
      case 'CORRUPTED':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Corrupted</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
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
      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Backups</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBackups || 0}</p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">{stats.successRate || 0}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Size</p>
                <p className="text-2xl font-bold text-gray-900">{formatBytes(stats.totalSize)}</p>
              </div>
              <HardDrive className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Compression</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageCompression || 0}%</p>
              </div>
              <Database className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>
      )}

      {/* Latest Backup Info */}
      {stats?.latestBackup && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Latest Backup</h3>
              <p className="text-sm text-blue-700 mt-1">
                {stats.latestBackup.fileName} • {formatBytes(stats.latestBackup.fileSize)} • 
                {stats.latestBackup.status} • {stats.latestBackup.compressionRatio}% compression
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Create Backup */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Manual Backup</h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Backup description (optional)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleCreateBackup}
            disabled={creating}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Backup History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {backups.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No backups found. Create your first backup above.
                  </td>
                </tr>
              ) : (
                backups.map((backup) => (
                  <tr key={backup.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{backup.fileName}</div>
                      {backup.description && (
                        <div className="text-sm text-gray-500">{backup.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(backup.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatBytes(backup.fileSize)}
                      <div className="text-xs text-gray-500">
                        {backup.compressionRatio}% compressed
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(backup.createdAt), 'PPp')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVerifyBackup(backup.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Verify Backup"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadBackup(backup.id, backup.fileName)}
                          className="text-green-600 hover:text-green-900"
                          title="Download Backup"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRestoreBackup(backup.id, backup.fileName)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Restore Backup"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBackup(backup.id, backup.fileName)}
                          className="text-red-600 hover:text-red-900"
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

export default BackupManager;
