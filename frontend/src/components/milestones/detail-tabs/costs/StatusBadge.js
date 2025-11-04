import React from 'react';

/**
 * StatusBadge Component - Display cost realization status with color coding
 * 
 * Status workflow:
 * - draft: Initial state, can be edited and submitted
 * - submitted: Waiting for manager approval
 * - approved: Approved by manager, ready for payment
 * - rejected: Rejected by manager with reason
 * - paid: Payment executed, linked to finance transaction
 */
const StatusBadge = ({ status, size = 'normal' }) => {
  const getStatusConfig = () => {
    const configs = {
      draft: {
        label: 'Draft',
        className: 'bg-gray-100 text-gray-700 border border-gray-300',
        icon: '📝'
      },
      submitted: {
        label: 'Menunggu Persetujuan',
        className: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
        icon: '⏳'
      },
      approved: {
        label: 'Disetujui',
        className: 'bg-green-100 text-green-800 border border-green-300',
        icon: '✅'
      },
      rejected: {
        label: 'Ditolak',
        className: 'bg-red-100 text-red-800 border border-red-300',
        icon: '❌'
      },
      paid: {
        label: 'Dibayar',
        className: 'bg-blue-100 text-blue-800 border border-blue-300',
        icon: '💰'
      }
    };

    return configs[status] || {
      label: status || 'Unknown',
      className: 'bg-gray-100 text-gray-600 border border-gray-300',
      icon: '❓'
    };
  };

  const config = getStatusConfig();
  const sizeClasses = size === 'small' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-3 py-1 text-sm';

  return (
    <span 
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses} ${config.className}`}
      title={config.label}
    >
      <span className="text-xs">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
