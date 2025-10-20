import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationActions from './NotificationActions';
import './NotificationList.css';

/**
 * NotificationList Component
 * Displays notification history with filters and actions
 */
const NotificationList = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    fetchNotifications();

    // Listen for new notifications
    const handleNewNotification = (event) => {
      const notification = event.detail;
      
      // Add to local storage
      const stored = JSON.parse(localStorage.getItem('notifications') || '[]');
      stored.unshift({
        ...notification,
        id: notification.id || Date.now(),
        timestamp: notification.timestamp || new Date().toISOString(),
        read: false
      });
      
      // Keep only last 100 notifications
      if (stored.length > 100) {
        stored.pop();
      }
      
      localStorage.setItem('notifications', JSON.stringify(stored));
      setNotifications(stored);
    };

    window.addEventListener('nusantara-notification', handleNewNotification);

    return () => {
      window.removeEventListener('nusantara-notification', handleNewNotification);
    };
  }, []);

  const fetchNotifications = () => {
    try {
      setLoading(true);
      
      // Get from localStorage (in production, this would be an API call)
      const stored = JSON.parse(localStorage.getItem('notifications') || '[]');
      setNotifications(stored);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
    
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
      localStorage.setItem('notifications', JSON.stringify([]));
      setSelectedNotification(null);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Set as selected
    setSelectedNotification(notification);

    // Handle navigation
    if (notification.data) {
      const { type, leaveRequestId, projectId } = notification.data;

      switch (type) {
        case 'leave_approval_request':
          navigate(`/attendance/leave-request?id=${leaveRequestId}`);
          break;
        case 'leave_approved':
        case 'leave_rejected':
          navigate('/attendance/leave-request');
          break;
        case 'attendance_reminder':
          navigate('/attendance/clock-in');
          break;
        case 'clockout_reminder':
          navigate('/attendance/clock-out');
          break;
        case 'project_assignment':
          navigate(`/projects/${projectId}`);
          break;
        default:
          if (notification.clickAction) {
            navigate(notification.clickAction);
          }
      }
    }
  };

  const getNotificationIcon = (type) => {
    if (!type) return '🔔';
    
    if (type.includes('leave_approval_request')) return '📝';
    if (type.includes('leave_approved') || type.includes('success')) return '✅';
    if (type.includes('leave_rejected') || type.includes('error')) return '❌';
    if (type.includes('attendance_reminder')) return '⏰';
    if (type.includes('clockout_reminder')) return '🔔';
    if (type.includes('warning')) return '⚠️';
    if (type.includes('info')) return 'ℹ️';
    
    return '🔔';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="notification-list loading">
        <div className="loading-spinner"></div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="notification-list-container">
      {/* Header */}
      <div className="notification-list-header">
        <h2>
          Notifications
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </h2>

        <div className="header-actions">
          {unreadCount > 0 && (
            <button
              className="action-button mark-all"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          )}
          
          {notifications.length > 0 && (
            <button
              className="action-button clear-all"
              onClick={clearAll}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="notification-filters">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button
          className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      <div className="notification-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔕</div>
            <h3>No notifications</h3>
            <p>
              {filter === 'unread'
                ? 'You\'re all caught up! No unread notifications.'
                : 'You haven\'t received any notifications yet.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const type = notification.data?.type || notification.type;
            const icon = getNotificationIcon(type);

            return (
              <div
                key={notification.id}
                className={`notification-item ${!notification.read ? 'unread' : ''} ${
                  selectedNotification?.id === notification.id ? 'selected' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon">{icon}</div>

                <div className="notification-content">
                  <div className="notification-title">
                    {notification.title || 'Notification'}
                    {!notification.read && <div className="unread-dot"></div>}
                  </div>
                  
                  <div className="notification-body">
                    {notification.body || notification.message}
                  </div>
                  
                  <div className="notification-timestamp">
                    {formatTimestamp(notification.timestamp)}
                  </div>
                </div>

                <div className="notification-meta-actions">
                  <button
                    className="action-icon delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>

                {/* Add action buttons for actionable notifications */}
                <NotificationActions 
                  notification={notification}
                  onActionComplete={(id, action, result) => {
                    console.log('Action completed:', { id, action, result });
                    // Mark notification as read after action
                    markAsRead(id);
                  }}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationList;
