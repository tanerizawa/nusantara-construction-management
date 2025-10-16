import React from 'react';
import WorkflowCard from './WorkflowCard';
import { useTranslation } from '../../../i18n';

/**
 * Component for displaying workflow items requiring user action
 */
const WorkflowList = ({ workflows = [], user = {}, onApprove, onReject, onDelegate }) => {
  const { approvals } = useTranslation();
  const pendingWorkflows = workflows.filter(w => w.assignedTo === user.id && w.status === 'pending');
  
  return (
    <div className="approval-list mt-6">
      <h3 className="text-lg font-semibold mb-3">{approvals.workflowList.title}</h3>
      {pendingWorkflows.length > 0 ? (
        <div className="space-y-4">
          {pendingWorkflows.map((workflow, index) => (
            <WorkflowCard 
              key={workflow.id || index}
              workflow={workflow}
              onApprove={onApprove}
              onReject={onReject}
              onDelegate={onDelegate}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{approvals.workflowList.emptyState}</p>
        </div>
      )}
    </div>
  );
};

export default WorkflowList;