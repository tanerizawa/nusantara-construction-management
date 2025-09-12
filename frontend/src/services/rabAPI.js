// RAB API Service untuk integrasi dengan database
const RAB_API_BASE = '/api';

export const rabAPI = {
  // Fetch RAB items for a project
  getRABItems: async (projectId) => {
    try {
      const response = await fetch(`${RAB_API_BASE}/projects/${projectId}/rab-items`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch RAB items: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data: data.data || []
      };
    } catch (error) {
      console.error('Error fetching RAB items:', error);
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  },

  // Create new RAB item
  createRABItem: async (projectId, rabData) => {
    try {
      const response = await fetch(`${RAB_API_BASE}/projects/${projectId}/rab-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(rabData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create RAB item: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('Error creating RAB item:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update RAB item
  updateRABItem: async (projectId, itemId, rabData) => {
    try {
      const response = await fetch(`${RAB_API_BASE}/projects/${projectId}/rab-items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(rabData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update RAB item: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('Error updating RAB item:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Delete RAB item
  deleteRABItem: async (projectId, itemId) => {
    try {
      const response = await fetch(`${RAB_API_BASE}/projects/${projectId}/rab-items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete RAB item: ${response.statusText}`);
      }
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting RAB item:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Approve RAB item
  approveRABItem: async (projectId, itemId, approvalData) => {
    try {
      const response = await fetch(`${RAB_API_BASE}/projects/${projectId}/rab-items/${itemId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          approved_by: approvalData.approvedBy || 'current_user',
          notes: approvalData.notes || '',
          approved_date: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to approve RAB item: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('Error approving RAB item:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Bulk approve RAB items
  bulkApproveRABItems: async (projectId, itemIds, approvalData) => {
    try {
      const response = await fetch(`${RAB_API_BASE}/projects/${projectId}/rab-items/bulk-approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          item_ids: itemIds,
          approved_by: approvalData.approvedBy || 'current_user',
          notes: approvalData.notes || '',
          approved_date: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to bulk approve RAB items: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('Error bulk approving RAB items:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Reject RAB item
  rejectRABItem: async (projectId, itemId, rejectionData) => {
    try {
      const response = await fetch(`${RAB_API_BASE}/projects/${projectId}/rab-items/${itemId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          rejected_by: rejectionData.rejectedBy || 'current_user',
          notes: rejectionData.notes || 'No reason provided',
          rejected_date: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to reject RAB item: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('Error rejecting RAB item:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Add notes to RAB item
  addNotes: async (projectId, itemId, notes) => {
    try {
      const response = await fetch(`${RAB_API_BASE}/projects/${projectId}/rab-items/${itemId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          notes: notes,
          added_by: 'current_user',
          added_date: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add notes to RAB item: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('Error adding notes to RAB item:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};
