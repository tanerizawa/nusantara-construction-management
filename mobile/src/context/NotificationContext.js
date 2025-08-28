import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    
    // Listen for incoming notifications
    const subscription = Notifications.addNotificationReceivedListener(handleNotification);
    
    return () => subscription.remove();
  }, []);

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem('notifications');
      if (stored) {
        const notificationList = JSON.parse(stored);
        setNotifications(notificationList);
        setUnreadCount(notificationList.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleNotification = async (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      title: notification.request.content.title,
      body: notification.request.content.body,
      data: notification.request.content.data,
      timestamp: new Date().toISOString(),
      read: false,
      type: notification.request.content.data?.type || 'general'
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    setUnreadCount(prev => prev + 1);
    
    await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const markAsRead = async (notificationId) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
    
    await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = async () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    
    setNotifications(updatedNotifications);
    setUnreadCount(0);
    
    await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const scheduleLocalNotification = async (title, body, data = {}, delay = 0) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: delay > 0 ? { seconds: delay } : null,
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const sendHRNotification = async (type, content) => {
    const notifications = {
      'leave_approved': {
        title: '✅ Leave Request Approved',
        body: 'Your leave request has been approved by your manager.',
        data: { type: 'leave', action: 'approved' }
      },
      'leave_rejected': {
        title: '❌ Leave Request Rejected',
        body: 'Your leave request has been rejected. Please contact HR for details.',
        data: { type: 'leave', action: 'rejected' }
      },
      'performance_review': {
        title: '📊 Performance Review Due',
        body: 'Your quarterly performance review is scheduled for this week.',
        data: { type: 'performance', action: 'review_due' }
      },
      'training_reminder': {
        title: '📚 Training Reminder',
        body: 'You have pending training courses to complete.',
        data: { type: 'training', action: 'reminder' }
      },
      'attendance_alert': {
        title: '⏰ Attendance Alert',
        body: 'Please remember to check in for today.',
        data: { type: 'attendance', action: 'checkin_reminder' }
      },
      'birthday': {
        title: '🎂 Happy Birthday!',
        body: 'Wishing you a wonderful birthday from the YK Group team!',
        data: { type: 'celebration', action: 'birthday' }
      },
      'payroll': {
        title: '💰 Payroll Processed',
        body: 'Your salary for this month has been processed.',
        data: { type: 'payroll', action: 'processed' }
      },
      'ai_insight': {
        title: '🤖 AI Insight',
        body: content || 'New AI insights are available for your review.',
        data: { type: 'ai', action: 'insight' }
      }
    };

    const notification = notifications[type];
    if (notification) {
      await scheduleLocalNotification(
        notification.title,
        notification.body,
        notification.data
      );
    }
  };

  const clearNotifications = async () => {
    setNotifications([]);
    setUnreadCount(0);
    await AsyncStorage.removeItem('notifications');
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    scheduleLocalNotification,
    sendHRNotification,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
