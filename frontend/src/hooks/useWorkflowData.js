import { useState, useEffect, useCallback } from 'react';

export const useWorkflowData = (projectId) => {
  const [workflowData, setWorkflowData] = useState({
    rabStatus: null,
    approvalStatus: null,
    purchaseOrders: [],
    budgetSummary: null,
    currentStage: 'planning'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkflowData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data for development - replace with actual API calls
      const mockData = {
        rabStatus: {
          data: [],
          pendingApproval: 0
        },
        approvalStatus: {
          data: [],
          pending: 0
        },
        purchaseOrders: [],
        budgetSummary: {
          totalBudget: 0,
          approvedAmount: 0,
          committedAmount: 0,
          actualSpent: 0,
          variancePercentage: 0
        },
        currentStage: 'planning'
      };

      setWorkflowData(mockData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchWorkflowData();
    }
  }, [projectId, fetchWorkflowData]);

  return {
    workflowData,
    loading,
    error,
    refetch: fetchWorkflowData
  };
};
