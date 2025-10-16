import React from 'react';
import { useTranslation } from '../../../i18n';

/**
 * Component for displaying activity history
 */
const ActivityHistory = ({ workflows = [] }) => {
  const { approvals } = useTranslation();
  const events = workflows
    .filter(w => w.history && w.history.length > 0)
    .flatMap(workflow => 
      workflow.history.map((event, i) => ({...event, workflowTitle: workflow.title, id: `${workflow.id}-${i}`}))
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);
    
  return (
    <div className="approval-history mt-6">
      <h3 className="text-lg font-semibold mb-3">{approvals.activityHistory.title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {approvals.activityHistory.headers.workflow}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {approvals.activityHistory.headers.date}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {approvals.activityHistory.headers.action}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {approvals.activityHistory.headers.user}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map(event => (
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
                    {approvals.activityHistory.actions[event.action] || event.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityHistory;