import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Filter, Search, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { API_URL } from '../../utils/config';

/**
 * NotificationList Component
 * Full-page notification history with filters and bulk actions
 */
const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    loadNotifications();
  }, [filter, typeFilter, currentPage]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const unreadOnly = filter === 'unread';
      const offset = (currentPage - 1) * itemsPerPage;
      
      const response = await fetch(
        `${API_URL}/notifications?limit=${itemsPerPage}&offset=${offset}&unreadOnly=${unreadOnly}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          let notifications = data.data.notifications || [];
          
          // Apply type filter
          if (typeFilter !== 'all') {
            notifications = notifications.filter(n => n.notificationType === typeFilter);
          }
          
          // Apply search filter
          if (searchQuery) {
            notifications = notifications.filter(n =>
              n.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              n.message?.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
          
          setNotifications(notifications);
          setTotalCount(data.data.total || 0);
        }
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadNotifications();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadNotifications();
        setSelectedIds([]);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadNotifications();
        setSelectedIds(prev => prev.filter(id => id !== notificationId));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;
    
    if (!window.confirm(`Delete ${selectedIds.length} selected notification(s)?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await Promise.all(
        selectedIds.map(id =>
          fetch(`${API_URL}/notifications/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        )
      );
      
      loadNotifications();
      setSelectedIds([]);
    } catch (error) {
      console.error('Error deleting notifications:', error);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map(n => n.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'approval_request': '📝',
      'approved': '✅',
      'rejected': '❌',
      'escalation': '⚠️',
      'completed': '🎉',
      'system': '🔔'
    };
    return icons[type] || '📬';
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

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Notifications</h1>
        <p className="text-[#8E8E93]">Manage all your notifications</p>
      </div>

      {/* Filters & Actions Bar */}
      <div className="bg-[#2C2C2E] rounded-lg p-4 mb-6 space-y-4">
        {/* Top Row: Search and Refresh */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8E8E93]" size={18} />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1C1C1E] text-white rounded-lg border border-[#3A3A3C] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
          </div>
          <button
            onClick={loadNotifications}
            className="px-4 py-2 bg-[#3A3A3C] text-white rounded-lg hover:bg-[#48484A] transition-colors flex items-center space-x-2"
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Bottom Row: Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-[#8E8E93]" />
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-[#1C1C1E] text-white rounded-lg border border-[#3A3A3C] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            >
              <option value="all">All</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-[#1C1C1E] text-white rounded-lg border border-[#3A3A3C] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
          >
            <option value="all">All Types</option>
            <option value="approval_request">Approval Requests</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="escalation">Escalations</option>
            <option value="completed">Completed</option>
          </select>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-sm text-[#8E8E93]">
                {selectedIds.length} selected
              </span>
              <button
                onClick={deleteSelected}
                className="px-3 py-2 bg-[#FF3B30] text-white rounded-lg hover:bg-[#FF4D43] transition-colors flex items-center space-x-1"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          )}

          {/* Mark All as Read */}
          {filter === 'unread' && notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#409CFF] transition-colors flex items-center space-x-1"
            >
              <Check size={16} />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Notification List */}
      <div className="bg-[#2C2C2E] rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="animate-spin mx-auto text-[#0A84FF] mb-3" size={32} />
            <p className="text-[#8E8E93]">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={48} className="mx-auto text-[#3A3A3C] mb-3" />
            <p className="text-[#8E8E93]">No notifications found</p>
            <p className="text-xs text-[#636366] mt-1">
              {filter === 'unread' ? 'All caught up!' : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <>
            {/* Select All Header */}
            <div className="px-4 py-3 border-b border-[#3A3A3C] bg-[#1C1C1E]">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.length === notifications.length && notifications.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-[#0A84FF] bg-[#2C2C2E] border-[#3A3A3C] rounded focus:ring-[#0A84FF]"
                />
                <span className="text-sm text-[#8E8E93]">
                  Select All ({notifications.length})
                </span>
              </label>
            </div>

            {/* Notifications */}
            <div className="divide-y divide-[#3A3A3C]">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-[#1C1C1E] transition-colors ${
                    notification.status === 'pending' ? 'bg-[#2C2C2E]' : 'bg-[#2C2C2E] opacity-75'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(notification.id)}
                      onChange={() => toggleSelect(notification.id)}
                      className="mt-1 w-4 h-4 text-[#0A84FF] bg-[#2C2C2E] border-[#3A3A3C] rounded focus:ring-[#0A84FF]"
                    />

                    {/* Icon */}
                    <div className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification.notificationType)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">
                            {notification.subject}
                          </p>
                          <p className="text-sm text-[#8E8E93] mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <p className="text-xs text-[#636366]">
                              {formatDate(notification.createdAt)}
                            </p>
                            {notification.status === 'pending' && (
                              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-[#0A84FF] text-white rounded">
                                New
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          {notification.status === 'pending' ? (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-[#0A84FF] hover:bg-[#3A3A3C] rounded transition-colors"
                              title="Mark as read"
                            >
                              <Eye size={16} />
                            </button>
                          ) : (
                            <button
                              className="p-2 text-[#8E8E93] hover:bg-[#3A3A3C] rounded transition-colors"
                              title="Already read"
                            >
                              <EyeOff size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-[#8E8E93] hover:text-[#FF3B30] hover:bg-[#3A3A3C] rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-[#8E8E93]">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} notifications
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#2C2C2E] text-white rounded-lg hover:bg-[#3A3A3C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-[#8E8E93]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#2C2C2E] text-white rounded-lg hover:bg-[#3A3A3C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
