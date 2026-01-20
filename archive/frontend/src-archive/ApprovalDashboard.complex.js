import React from 'react';

/**
 * Complex version of the ApprovalDashboard component
 * This provides advanced approval workflow functionality
 */
const ApprovalDashboardComplex = ({ 
  workflows = [], 
  user = {}, 
  onApprove, 
  onReject, 
  onDelegate 
}) => {
  return (
    <div className="approval-dashboard-complex">
      <div className="approval-header">
        <h2>Advanced Approval Dashboard</h2>
        <p className="text-gray-500">
          Manage complex approval workflows and hierarchies
        </p>
      </div>
      
      <div className="approval-stats">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat-card bg-blue-50 p-4 rounded-lg">
            <h3 className="text-blue-600">Pending Approvals</h3>
            <p className="text-2xl font-bold">{workflows.filter(w => w.status === 'pending').length}</p>
          </div>
          <div className="stat-card bg-green-50 p-4 rounded-lg">
            <h3 className="text-green-600">Approved</h3>
            <p className="text-2xl font-bold">{workflows.filter(w => w.status === 'approved').length}</p>
          </div>
          <div className="stat-card bg-red-50 p-4 rounded-lg">
            <h3 className="text-red-600">Rejected</h3>
            <p className="text-2xl font-bold">{workflows.filter(w => w.status === 'rejected').length}</p>
          </div>
        </div>
      </div>
      
      <div className="approval-list mt-6">
        <h3 className="text-lg font-semibold mb-3">Workflows Requiring Your Action</h3>
        {workflows.filter(w => w.assignedTo === user.id && w.status === 'pending').length > 0 ? (
          <div className="space-y-4">
            {workflows
              .filter(w => w.assignedTo === user.id && w.status === 'pending')
              .map((workflow, index) => (
                <div key={workflow.id || index} className="workflow-card border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{workflow.title}</h4>
                      <p className="text-sm text-gray-600">{workflow.description}</p>
                      <div className="mt-2">
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {workflow.type}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded ml-2">
                          Requested by: {workflow.requester?.name || 'Unknown'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => onApprove(workflow.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => onReject(workflow.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => onDelegate(workflow.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Delegate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="empty-state text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No pending workflows require your action</p>
          </div>
        )}
      </div>
      
      <div className="approval-history mt-6">
        <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workflow
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workflows
                .filter(w => w.history && w.history.length > 0)
                .flatMap(workflow => 
                  workflow.history.map((event, i) => ({...event, workflowTitle: workflow.title, id: `${workflow.id}-${i}`}))
                )
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, 5)
                .map(event => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.workflowTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        event.action === 'approved' ? 'bg-green-100 text-green-800' :
                        event.action === 'rejected' ? 'bg-red-100 text-red-800' :
                        event.action === 'delegated' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.user}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApprovalDashboardComplex;