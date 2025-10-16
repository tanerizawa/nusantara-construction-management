import React from 'react';
import { STATUS_CONFIG } from '../utils';

/**
 * Component for displaying status badges for tax items
 * @param {Object} props Component props
 * @param {string} props.status Status of the tax item ('paid', 'pending', 'overdue')
 * @returns {JSX.Element} Status badge with icon
 */
const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
      <Icon size={12} className="mr-1" />
      {config.text}
    </span>
  );
};

export default StatusBadge;