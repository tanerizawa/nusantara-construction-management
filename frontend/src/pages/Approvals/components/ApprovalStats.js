import React from 'react';
import { useTranslation } from '../../../i18n';

/**
 * Component for displaying approval statistics
 */
const ApprovalStats = ({ workflows = [] }) => {
  const { approvals } = useTranslation();
  
  return (
    <div className="approval-stats">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card bg-blue-50 p-4 rounded-lg">
          <h3 className="text-blue-600">{approvals.stats.pending}</h3>
          <p className="text-2xl font-bold">{workflows.filter(w => w.status === 'pending').length}</p>
        </div>
        <div className="stat-card bg-green-50 p-4 rounded-lg">
          <h3 className="text-green-600">{approvals.stats.approved}</h3>
          <p className="text-2xl font-bold">{workflows.filter(w => w.status === 'approved').length}</p>
        </div>
        <div className="stat-card bg-red-50 p-4 rounded-lg">
          <h3 className="text-red-600">{approvals.stats.rejected}</h3>
          <p className="text-2xl font-bold">{workflows.filter(w => w.status === 'rejected').length}</p>
        </div>
      </div>
    </div>
  );
};

export default ApprovalStats;