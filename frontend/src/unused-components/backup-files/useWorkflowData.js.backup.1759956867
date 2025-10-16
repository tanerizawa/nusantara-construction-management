import { useState, useEffect } from 'react';

/**
 * Custom hook untuk mengelola data workflow dan notifications
 */
export const useWorkflowData = (projectId) => {
  const [workflowData, setWorkflowData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchWorkflowData();
      fetchNotifications();
    }
  }, [projectId]);

  const fetchWorkflowData = async () => {
    try {
      // Placeholder - akan diimplementasikan dengan API call
      setWorkflowData({
        currentStage: 'planning',
        rab: { pendingApproval: 0 },
        approvals: { pending: 0 },
        purchaseOrders: { pending: 0 }
      });
    } catch (error) {
      console.error('Error fetching workflow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      // Placeholder - akan diimplementasikan dengan API call
      setNotifications([]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const urgentNotifications = notifications.filter(n => n.urgent);

  return {
    workflowData,
    notifications,
    urgentNotifications,
    loading,
    refetch: () => {
      fetchWorkflowData();
      fetchNotifications();
    }
  };
};
