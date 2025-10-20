/**
 * Notification Actions Component
 * Inline action buttons for notifications (approve/reject)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleNotificationAction } from '../../utils/deepLinkHandler';
import './NotificationActions.css';

const NotificationActions = ({ notification, onActionComplete }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null); // 'approve' | 'reject' | null
  const [error, setError] = useState(null);

  // Check if notification supports actions
  const supportsActions = notification.data?.type === 'leave_approval_request';
  const leaveRequestId = notification.data?.leaveRequestId || notification.data?.leave_request_id;

  if (!supportsActions || !leaveRequestId) {
    return null;
  }

  const handleAction = async (actionType) => {
    setLoading(actionType);
    setError(null);

    try {
      const result = await handleNotificationAction({
        type: notification.data.type,
        leaveRequestId: leaveRequestId,
        actionType: actionType
      });

      if (result.success) {
        console.log('✅ Action completed:', actionType);
        
        // Call callback if provided
        if (onActionComplete) {
          onActionComplete(notification.id, actionType, result.data);
        }

        // Navigate to leave request page after a short delay
        setTimeout(() => {
          navigate(`/attendance/leave-request?id=${leaveRequestId}`);
        }, 1000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Action error:', err);
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="notification-actions">
      <button
        className="notification-action-btn approve"
        onClick={(e) => {
          e.stopPropagation();
          handleAction('approve');
        }}
        disabled={loading !== null}
      >
        {loading === 'approve' ? (
          <>
            <div className="action-spinner"></div>
            <span>Approving...</span>
          </>
        ) : (
          <>
            <svg className="action-icon" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Approve</span>
          </>
        )}
      </button>

      <button
        className="notification-action-btn reject"
        onClick={(e) => {
          e.stopPropagation();
          handleAction('reject');
        }}
        disabled={loading !== null}
      >
        {loading === 'reject' ? (
          <>
            <div className="action-spinner"></div>
            <span>Rejecting...</span>
          </>
        ) : (
          <>
            <svg className="action-icon" viewBox="0 0 24 24" fill="none">
              <path d="M10 14L12 12M12 12L14 10M12 12L10 10M12 12L14 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Reject</span>
          </>
        )}
      </button>

      {error && (
        <div className="notification-action-error">
          <svg className="error-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default NotificationActions;
