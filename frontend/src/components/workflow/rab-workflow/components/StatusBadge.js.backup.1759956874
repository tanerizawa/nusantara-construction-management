import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { getStatusConfig } from '../config/statusConfig';

/**
 * StatusBadge Component
 * Displays approval status with icon and color coding
 */
const StatusBadge = ({ status }) => {
  const config = getStatusConfig(status);
  
  return (
    <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}>
      {config.icon === 'CheckCircle' && <CheckCircle className="h-4 w-4 mr-1" />}
      {config.icon === 'Clock' && <Clock className="h-4 w-4 mr-1" />}
      {config.label}
    </div>
  );
};

export default StatusBadge;
