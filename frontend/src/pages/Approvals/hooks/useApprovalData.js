import { useState, useEffect } from 'react';
import { fetchApprovalData, approveWorkflow, rejectWorkflow, delegateWorkflow } from '../utils/approvalApi';

/**
 * Hook for managing approval data and actions
 * @returns {Object} Approval state and handler functions
 */
export const useApprovalData = () => {
  const [workflows, setWorkflows] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { workflows, currentUser } = await fetchApprovalData();
        setWorkflows(workflows);
        setUser(currentUser);
      } catch (err) {
        console.error('Error loading approval data:', err);
        setError(err.message || 'Failed to load approval data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Handler for approving workflows
  const handleApprove = async (workflowId) => {
    try {
      await approveWorkflow(workflowId);
      
      // Update local state
      setWorkflows(prevWorkflows => 
        prevWorkflows.map(workflow => {
          if (workflow.id === workflowId) {
            return {
              ...workflow,
              status: 'approved',
              history: [
                ...(workflow.history || []),
                {
                  action: 'approved',
                  user: user.name,
                  timestamp: new Date().toISOString()
                }
              ]
            };
          }
          return workflow;
        })
      );
    } catch (err) {
      console.error('Error approving workflow:', err);
      setError(err.message || 'Failed to approve workflow');
    }
  };

  // Handler for rejecting workflows
  const handleReject = async (workflowId) => {
    try {
      await rejectWorkflow(workflowId);
      
      // Update local state
      setWorkflows(prevWorkflows => 
        prevWorkflows.map(workflow => {
          if (workflow.id === workflowId) {
            return {
              ...workflow,
              status: 'rejected',
              history: [
                ...(workflow.history || []),
                {
                  action: 'rejected',
                  user: user.name,
                  timestamp: new Date().toISOString()
                }
              ]
            };
          }
          return workflow;
        })
      );
    } catch (err) {
      console.error('Error rejecting workflow:', err);
      setError(err.message || 'Failed to reject workflow');
    }
  };

  // Handler for delegating workflows
  const handleDelegate = async (workflowId) => {
    try {
      await delegateWorkflow(workflowId);
      
      // Update local state
      setWorkflows(prevWorkflows => 
        prevWorkflows.map(workflow => {
          if (workflow.id === workflowId) {
            return {
              ...workflow,
              status: 'delegated',
              history: [
                ...(workflow.history || []),
                {
                  action: 'delegated',
                  user: user.name,
                  timestamp: new Date().toISOString()
                }
              ]
            };
          }
          return workflow;
        })
      );
    } catch (err) {
      console.error('Error delegating workflow:', err);
      setError(err.message || 'Failed to delegate workflow');
    }
  };

  return {
    workflows,
    user,
    loading,
    error,
    handleApprove,
    handleReject,
    handleDelegate
  };
};