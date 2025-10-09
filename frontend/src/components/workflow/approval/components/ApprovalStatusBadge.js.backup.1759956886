import React from 'react';
import { statusConfig } from '../config';

/**
 * Approval Status Badge Component
 * Displays colored badge for approval status
 */
const ApprovalStatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig['draft'];
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-4 h-4 mr-1" />
      {config.label}
    </span>
  );
};

export default ApprovalStatusBadge;
