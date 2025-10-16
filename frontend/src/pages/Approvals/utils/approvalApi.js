// Mock API functions for approval functionality
// These will be replaced with actual API calls in production

/**
 * Fetch approval data from the API
 * @returns {Promise<Object>} Workflows and user data
 */
export const fetchApprovalData = async () => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        workflows: [
          {
            id: 'wf-001',
            title: 'Purchase Order #12345',
            description: 'Approval needed for equipment purchase',
            status: 'pending',
            type: 'Purchase Order',
            assignedTo: '1', // Current user ID
            requester: { name: 'Sarah Johnson' },
            history: [
              {
                action: 'created',
                user: 'Sarah Johnson',
                timestamp: '2025-10-10T14:30:00Z'
              }
            ]
          },
          {
            id: 'wf-002',
            title: 'Material Requisition #54321',
            description: 'Urgent concrete materials needed for Site B',
            status: 'pending',
            type: 'Material Requisition',
            assignedTo: '1', // Current user ID
            requester: { name: 'Mike Thompson' },
            history: [
              {
                action: 'created',
                user: 'Mike Thompson',
                timestamp: '2025-10-12T09:15:00Z'
              }
            ]
          },
          {
            id: 'wf-003',
            title: 'Contractor Agreement #789',
            description: 'Plumbing subcontractor agreement for Phase 2',
            status: 'approved',
            type: 'Contract',
            assignedTo: '2',
            requester: { name: 'Lisa Wong' },
            history: [
              {
                action: 'created',
                user: 'Lisa Wong',
                timestamp: '2025-10-05T11:20:00Z'
              },
              {
                action: 'approved',
                user: 'John Davis',
                timestamp: '2025-10-06T15:45:00Z'
              }
            ]
          },
          {
            id: 'wf-004',
            title: 'Change Order #456',
            description: 'Additional electrical work for office area',
            status: 'rejected',
            type: 'Change Order',
            assignedTo: '3',
            requester: { name: 'Robert Chen' },
            history: [
              {
                action: 'created',
                user: 'Robert Chen',
                timestamp: '2025-10-02T13:10:00Z'
              },
              {
                action: 'rejected',
                user: 'Emily Parker',
                timestamp: '2025-10-03T10:30:00Z'
              }
            ]
          }
        ],
        currentUser: {
          id: '1',
          name: 'Alex Martinez',
          role: 'Project Manager'
        }
      });
    }, 300);
  });
};

/**
 * Approve a workflow
 * @param {string} workflowId - ID of workflow to approve
 * @returns {Promise<Object>} Updated workflow
 */
export const approveWorkflow = async (workflowId) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, workflowId });
    }, 200);
  });
};

/**
 * Reject a workflow
 * @param {string} workflowId - ID of workflow to reject
 * @returns {Promise<Object>} Updated workflow
 */
export const rejectWorkflow = async (workflowId) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, workflowId });
    }, 200);
  });
};

/**
 * Delegate a workflow
 * @param {string} workflowId - ID of workflow to delegate
 * @returns {Promise<Object>} Updated workflow
 */
export const delegateWorkflow = async (workflowId) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, workflowId });
    }, 200);
  });
};