import React from 'react';
import { useTranslation } from '../../../i18n';

/**
 * Individual workflow card component
 */
const WorkflowCard = ({ workflow, onApprove, onReject, onDelegate }) => {
  const { approvals } = useTranslation();
  
  return (
    <div className="workflow-card border p-4 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{workflow.title}</h4>
          <p className="text-sm text-gray-600">{workflow.description}</p>
          <div className="mt-2">
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              {workflow.type}
            </span>
            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded ml-2">
              {approvals.workflowList.requestedBy}: {workflow.requester?.name || approvals.workflowList.unknown}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => onApprove(workflow.id)}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {approvals.actions.approve}
          </button>
          <button 
            onClick={() => onReject(workflow.id)}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {approvals.actions.reject}
          </button>
          <button 
            onClick={() => onDelegate(workflow.id)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {approvals.actions.delegate}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowCard;