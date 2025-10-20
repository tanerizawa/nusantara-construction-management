import React, { useState, useEffect } from 'react';
import './NotificationBadge.css';

/**
 * NotificationBadge Component
 * Displays unread notification count with animated badge
 * Updates when new notifications arrive
 */
const NotificationBadge = ({ onClick, className = '' }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Fetch unread count on mount
    fetchUnreadCount();

    // Listen for new notifications
    const handleNotification = () => {
      fetchUnreadCount();
      triggerAnimation();
    };

    window.addEventListener('nusantara-notification', handleNotification);

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => {
      window.removeEventListener('nusantara-notification', handleNotification);
      clearInterval(interval);
    };
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // This would call a backend endpoint to get unread count
      // For now, we'll use localStorage to track
      const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const unread = storedNotifications.filter(n => !n.read).length;
      
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  if (unreadCount === 0) {
    return (
      <div 
        className={`notification-badge-wrapper ${className}`}
        onClick={handleClick}
      >
        <div className="notification-icon">
          🔔
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`notification-badge-wrapper ${className}`}
      onClick={handleClick}
    >
      <div className="notification-icon">
        🔔
      </div>
      <div 
        className={`notification-badge ${isAnimating ? 'animate' : ''}`}
        data-count={unreadCount > 99 ? '99+' : unreadCount}
      >
        {unreadCount > 99 ? '99+' : unreadCount}
      </div>
    </div>
  );
};

export default NotificationBadge;
