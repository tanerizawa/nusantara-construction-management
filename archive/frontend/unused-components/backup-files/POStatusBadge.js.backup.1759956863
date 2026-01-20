import React from 'react';
import { formatPOStatusLabel, getPOStatusColor } from '../utils/poFormatters';

/**
 * PO Status Badge Component
 * Displays a colored badge showing the PO status
 */
const POStatusBadge = ({ status, className = '' }) => {
  if (!status) return null;
  
  const statusColor = getPOStatusColor(status);
  const statusLabel = formatPOStatusLabel(status);
  
  return (
    <span 
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColor} ${className}`}
    >
      {statusLabel}
    </span>
  );
};

export default POStatusBadge;
