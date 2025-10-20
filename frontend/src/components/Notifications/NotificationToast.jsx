import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationToast.css';

/**
 * NotificationToast Component
 * Displays in-app notifications as toast popups
 * Listens to custom 'nusantara-notification' events from notificationManager
 */
const NotificationToast = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Listen for notification events
    const handleNotification = (event) => {
      const notification = event.detail;
      
      // Add unique ID if not present
      const notificationWithId = {
        ...notification,
        id: notification.id || Date.now(),
        timestamp: notification.timestamp || new Date().toISOString()
      };

      // Add to notifications array
      setNotifications(prev => [...prev, notificationWithId]);
      setIsVisible(true);

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        removeNotification(notificationWithId.id);
      }, 5000);
    };

    // Add event listener
    window.addEventListener('nusantara-notification', handleNotification);

    // Cleanup
    return () => {
      window.removeEventListener('nusantara-notification', handleNotification);
    };
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => {
      const filtered = prev.filter(n => n.id !== id);
      if (filtered.length === 0) {
        setIsVisible(false);
      }
      return filtered;
    });
  };

  const handleClick = (notification) => {
    // Handle navigation based on notification type
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
          // Generic navigation
          if (notification.clickAction) {
            navigate(notification.clickAction);
          }
      }
    }

    // Remove notification after click
    removeNotification(notification.id);
  };

  const handleDismiss = (id) => {
    removeNotification(id);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'leave_approval_request':
        return '📝';
      case 'leave_approved':
        return '✅';
      case 'leave_rejected':
        return '❌';
      case 'attendance_reminder':
        return '⏰';
      case 'clockout_reminder':
        return '🔔';
      default:
        return '🔔';
    }
  };

  const getNotificationClass = (type) => {
    if (type.includes('approved') || type === 'success') return 'success';
    if (type.includes('rejected') || type === 'error') return 'error';
    if (type.includes('warning')) return 'warning';
    return 'info';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  if (!isVisible || notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-toast-container">
      {notifications.map((notification) => {
        const type = notification.data?.type || notification.type || 'info';
        const icon = getNotificationIcon(type);
        const className = getNotificationClass(type);

        return (
          <div
            key={notification.id}
            className={`notification-toast ${className} slide-in`}
            onClick={() => handleClick(notification)}
          >
            <div className="toast-icon">{icon}</div>
            
            <div className="toast-content">
              <div className="toast-title">
                {notification.title || 'Notification'}
              </div>
              <div className="toast-body">
                {notification.body || notification.message}
              </div>
              <div className="toast-timestamp">
                {formatTimestamp(notification.timestamp)}
              </div>
            </div>

            <button
              className="toast-close"
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss(notification.id);
              }}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationToast;
