import React from 'react';
import NotificationList from '../components/Notifications/NotificationList';
import './NotificationPage.css';

/**
 * NotificationPage
 * Main page for viewing and managing notifications
 */
const NotificationPage = () => {
  return (
    <div className="notification-page">
      <div className="notification-page-container">
        <NotificationList />
      </div>
    </div>
  );
};

export default NotificationPage;
