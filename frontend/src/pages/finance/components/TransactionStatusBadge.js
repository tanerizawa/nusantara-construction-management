import React from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  AlertCircle 
} from 'lucide-react';

/**
 * TransactionStatusBadge Component
 * 
 * Displays status badge with appropriate styling and icon
 * Supports all transaction statuses from the backend
 * 
 * Status Flow:
 * - DRAFT: Editable, not submitted
 * - PENDING: Waiting for approval
 * - APPROVED: Approved but not posted yet
 * - POSTED/COMPLETED: Posted to ledger
 * - VOIDED: Cancelled transaction
 * - REVERSED: Corrected transaction
 * 
 * @param {Object} props
 * @param {string} props.status - Transaction status
 * @param {string} props.size - Badge size (sm, md, lg)
 * @param {boolean} props.showIcon - Whether to show status icon
 */
const TransactionStatusBadge = ({ 
  status, 
  size = 'md',
  showIcon = true 
}) => {
  /**
   * Get status configuration (color, icon, label)
   */
  const getStatusConfig = () => {
    const configs = {
      draft: {
        label: 'Draft',
        icon: FileText,
        bgColor: 'rgba(142, 142, 147, 0.15)',
        textColor: '#8E8E93',
        borderColor: 'rgba(142, 142, 147, 0.3)',
        description: 'Editable'
      },
      pending: {
        label: 'Pending',
        icon: Clock,
        bgColor: 'rgba(255, 159, 10, 0.15)',
        textColor: '#FF9F0A',
        borderColor: 'rgba(255, 159, 10, 0.3)',
        description: 'Awaiting approval'
      },
      approved: {
        label: 'Approved',
        icon: CheckCircle,
        bgColor: 'rgba(48, 209, 88, 0.15)',
        textColor: '#30D158',
        borderColor: 'rgba(48, 209, 88, 0.3)',
        description: 'Approved, not posted'
      },
      posted: {
        label: 'Posted',
        icon: CheckCircle,
        bgColor: 'rgba(10, 132, 255, 0.15)',
        textColor: '#0A84FF',
        borderColor: 'rgba(10, 132, 255, 0.3)',
        description: 'Posted to ledger'
      },
      completed: {
        label: 'Posted',
        icon: CheckCircle,
        bgColor: 'rgba(10, 132, 255, 0.15)',
        textColor: '#0A84FF',
        borderColor: 'rgba(10, 132, 255, 0.3)',
        description: 'Posted to ledger'
      },
      voided: {
        label: 'Voided',
        icon: XCircle,
        bgColor: 'rgba(255, 69, 58, 0.15)',
        textColor: '#FF453A',
        borderColor: 'rgba(255, 69, 58, 0.3)',
        description: 'Cancelled'
      },
      reversed: {
        label: 'Reversed',
        icon: RefreshCw,
        bgColor: 'rgba(255, 149, 0, 0.15)',
        textColor: '#FF9500',
        borderColor: 'rgba(255, 149, 0, 0.3)',
        description: 'Corrected'
      },
      cancelled: {
        label: 'Cancelled',
        icon: XCircle,
        bgColor: 'rgba(255, 69, 58, 0.15)',
        textColor: '#FF453A',
        borderColor: 'rgba(255, 69, 58, 0.3)',
        description: 'Cancelled'
      },
      failed: {
        label: 'Failed',
        icon: AlertCircle,
        bgColor: 'rgba(255, 69, 58, 0.15)',
        textColor: '#FF453A',
        borderColor: 'rgba(255, 69, 58, 0.3)',
        description: 'Failed'
      }
    };

    return configs[status?.toLowerCase()] || configs.draft;
  };

  /**
   * Get size classes
   */
  const getSizeClasses = () => {
    const sizes = {
      sm: {
        padding: 'px-1.5 py-0.5',
        text: 'text-xs',
        iconSize: 'w-3 h-3'
      },
      md: {
        padding: 'px-2 py-1',
        text: 'text-xs',
        iconSize: 'w-3.5 h-3.5'
      },
      lg: {
        padding: 'px-3 py-1.5',
        text: 'text-sm',
        iconSize: 'w-4 h-4'
      }
    };

    return sizes[size] || sizes.md;
  };

  const config = getStatusConfig();
  const sizeClasses = getSizeClasses();
  const Icon = config.icon;

  return (
    <span 
      className={`inline-flex items-center space-x-1 rounded-full font-medium ${sizeClasses.padding} ${sizeClasses.text}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        border: `1px solid ${config.borderColor}`
      }}
      title={config.description}
    >
      {showIcon && <Icon className={sizeClasses.iconSize} />}
      <span>{config.label}</span>
    </span>
  );
};

export default TransactionStatusBadge;
