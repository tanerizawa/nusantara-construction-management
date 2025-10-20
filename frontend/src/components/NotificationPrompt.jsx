import React, { useState, useEffect } from 'react';
import notificationManager from '../utils/notificationManager';
import { getNotificationPermission, isNotificationSupported } from '../firebase/firebaseConfig';
import './NotificationPrompt.css';

const NotificationPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permission, setPermission] = useState('default');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = () => {
    if (!isNotificationSupported()) {
      return;
    }

    const currentPermission = getNotificationPermission();
    setPermission(currentPermission);

    // Show prompt if permission is default (not asked yet)
    // And user has been logged in for more than 5 seconds
    if (currentPermission === 'default') {
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000); // Show after 5 seconds
    }
  };

  const handleEnable = async () => {
    setLoading(true);
    try {
      const success = await notificationManager.requestPermission();
      
      if (success) {
        setPermission('granted');
        setShowPrompt(false);
        
        // Show success message
        notificationManager.showInAppNotification({
          title: 'Notifications Enabled',
          body: 'You will now receive important updates and reminders.',
          type: 'success'
        });
      } else {
        // Permission denied or error
        const newPermission = getNotificationPermission();
        setPermission(newPermission);
        
        if (newPermission === 'denied') {
          setShowPrompt(false);
        }
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    
    // Remember dismissal for this session
    sessionStorage.setItem('notification-prompt-dismissed', 'true');
  };

  const handleNotNow = () => {
    setShowPrompt(false);
    
    // Ask again in 24 hours
    localStorage.setItem('notification-prompt-next', Date.now() + 24 * 60 * 60 * 1000);
  };

  // Don't show if:
  // - Not supported
  // - Already granted or denied
  // - Dismissed in this session
  // - Asked to not show for 24 hours
  if (!isNotificationSupported() || 
      permission !== 'default' || 
      !showPrompt ||
      sessionStorage.getItem('notification-prompt-dismissed')) {
    return null;
  }

  const nextPromptTime = localStorage.getItem('notification-prompt-next');
  if (nextPromptTime && Date.now() < parseInt(nextPromptTime)) {
    return null;
  }

  return (
    <div className="notification-prompt-overlay">
      <div className="notification-prompt">
        <button className="prompt-close" onClick={handleDismiss} aria-label="Close">
          ✗
        </button>

        <div className="prompt-icon">🔔</div>

        <h3>Enable Notifications</h3>
        <p>
          Stay updated with important reminders and approvals. 
          You can change this anytime in your browser settings.
        </p>

        <div className="prompt-benefits">
          <div className="benefit">
            <span className="benefit-icon">⏰</span>
            <span>Clock-in reminders</span>
          </div>
          <div className="benefit">
            <span className="benefit-icon">✅</span>
            <span>Leave approval alerts</span>
          </div>
          <div className="benefit">
            <span className="benefit-icon">📋</span>
            <span>Task notifications</span>
          </div>
        </div>

        <div className="prompt-actions">
          <button
            className="btn-enable"
            onClick={handleEnable}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Enabling...</span>
              </>
            ) : (
              <>
                <span>🔔</span>
                <span>Enable Notifications</span>
              </>
            )}
          </button>
          <button className="btn-later" onClick={handleNotNow}>
            Not Now
          </button>
        </div>

        <p className="prompt-note">
          We'll only send you important updates. No spam, we promise! 🙏
        </p>
      </div>
    </div>
  );
};

export default NotificationPrompt;
