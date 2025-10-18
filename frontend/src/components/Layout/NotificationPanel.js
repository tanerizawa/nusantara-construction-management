import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, Trash2, Eye } from 'lucide-react';
import { API_URL } from '../../utils/config';
import { useNavigate } from 'react-router-dom';

/**
 * NotificationPanel Component
 * Displays notifications in header with dropdown panel
 */
const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Load notifications on mount and when panel opens
  useEffect(() => {
    loadNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/notifications?limit=10&unreadOnly=false`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setNotifications(data.data.notifications || []);
          setUnreadCount(data.data.unreadCount || 0);
        }
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
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
        // Update local state
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, status: 'read' } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
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
        setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        loadNotifications(); // Refresh to update count
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
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

  const getNotificationColor = (type) => {
    const colors = {
      'approval_request': 'bg-blue-50 border-blue-200',
      'approved': 'bg-green-50 border-green-200',
      'rejected': 'bg-red-50 border-red-200',
      'escalation': 'bg-yellow-50 border-yellow-200',
      'completed': 'bg-purple-50 border-purple-200',
      'system': 'bg-gray-50 border-gray-200'
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#8E8E93] hover:text-white hover:bg-[#3A3A3C] rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-[#FF3B30] text-white text-xs font-semibold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-[#1C1C1E] border border-[#3A3A3C] rounded-lg shadow-2xl z-50 max-h-[600px] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#3A3A3C]">
            <div>
              <h3 className="text-white font-semibold">Notifications</h3>
              <p className="text-xs text-[#8E8E93]">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[#0A84FF] hover:text-[#409CFF] transition-colors flex items-center space-x-1"
              >
                <Check size={14} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto max-h-[500px]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={48} className="mx-auto text-[#3A3A3C] mb-3" />
                <p className="text-[#8E8E93]">No notifications yet</p>
                <p className="text-xs text-[#636366] mt-1">
                  You'll see updates here when you have notifications
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#2C2C2E]">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-[#2C2C2E] transition-colors ${
                      notification.status === 'pending' ? 'bg-[#1C1C1E]' : 'bg-[#1C1C1E] opacity-75'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
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
                            <p className="text-xs text-[#8E8E93] mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-[#636366] mt-2">
                              {formatTimeAgo(notification.createdAt)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 ml-2">
                            {notification.status === 'pending' && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-[#0A84FF] hover:bg-[#3A3A3C] rounded transition-colors"
                                title="Mark as read"
                              >
                                <Eye size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 text-[#8E8E93] hover:text-[#FF3B30] hover:bg-[#3A3A3C] rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {notification.status === 'pending' && (
                          <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-[#0A84FF] text-white rounded">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-[#3A3A3C] p-3">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/notifications');
                }}
                className="w-full text-center text-sm text-[#0A84FF] hover:text-[#409CFF] transition-colors"
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
