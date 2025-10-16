import React from 'react';
import { useApprovalData } from '../hooks/useApprovalData';
import ApprovalStats from './ApprovalStats';
import WorkflowList from './WorkflowList';
import ActivityHistory from './ActivityHistory';
import { useTranslation } from '../../../i18n';

/**
 * Main ApprovalDashboard component
 * Container for all approval-related functionality
 */
const ApprovalDashboard = () => {
  const { approvals } = useTranslation();
  const { 
    workflows,
    user,
    handleApprove,
    handleReject,
    handleDelegate
  } = useApprovalData();
  
  return (
    <div className="approval-dashboard">
      <div className="approval-header">
        <h2>{approvals.title}</h2>
        <p className="text-gray-500">
          {approvals.subtitle}
        </p>
      </div>
      
      <ApprovalStats workflows={workflows} />
      <WorkflowList 
        workflows={workflows} 
        user={user} 
        onApprove={handleApprove}
        onReject={handleReject}
        onDelegate={handleDelegate}
      />
      <ActivityHistory workflows={workflows} />
    </div>
  );
};

export default ApprovalDashboard;