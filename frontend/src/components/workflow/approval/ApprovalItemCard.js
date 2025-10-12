import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText,
  Calendar,
  User,
  DollarSign,
  MessageSquare,
  Eye
} from 'lucide-react';

/**
 * ApprovalItemCard Component
 * 
 * Displays individual approval item with action buttons
 * 
 * @param {Object} props
 * @param {Object} props.item - Approval item data
 * @param {string} props.type - Type of approval (rab, po, ba, tt)
 * @param {Function} props.onApprove - Callback when approved
 * @param {Function} props.onReject - Callback when rejected
 * @param {Function} props.onReview - Callback when marked as reviewed
 * @param {Function} props.onViewDetails - Callback to view details
 */
const ApprovalItemCard = ({
  item,
  type,
  onApprove,
  onReject,
  onReview,
  onViewDetails
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Status badge configuration
  const statusConfig = {
    draft: {
      label: 'Draft',
      color: 'gray',
      icon: FileText
    },
    pending_approval: {
      label: 'Pending',
      color: 'yellow',
      icon: Clock
    },
    reviewed: {
      label: 'Reviewed',
      color: 'blue',
      icon: Eye
    },
    approved: {
      label: 'Approved',
      color: 'green',
      icon: CheckCircle2
    },
    rejected: {
      label: 'Rejected',
      color: 'red',
      icon: XCircle
    }
  };

  const status = statusConfig[item.approval_status] || statusConfig.draft;
  const StatusIcon = status.icon;

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Handle approve action
  const handleApprove = async () => {
    if (!onApprove || isProcessing) return;
    setIsProcessing(true);
    try {
      await onApprove(item);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle review action
  const handleReview = async () => {
    if (!onReview || isProcessing) return;
    setIsProcessing(true);
    try {
      await onReview(item);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle reject action
  const handleReject = async () => {
    if (!onReject || isProcessing) return;
    if (!rejectReason.trim()) {
      alert('Mohon masukkan alasan penolakan');
      return;
    }
    setIsProcessing(true);
    try {
      await onReject(item, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="px-4 py-3 hover:bg-[#3A3A3C] transition-colors">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Item Info - Compact */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              {/* Description */}
              <h4 className="text-sm font-medium text-white truncate flex-1">
                {item.name || item.description}
              </h4>
              
              {/* Amount */}
              {item.total_amount && (
                <span className="text-sm font-semibold text-[#30D158] whitespace-nowrap">
                  {formatCurrency(item.total_amount)}
                </span>
              )}
            </div>
            
            {/* Category & Unit - Small text */}
            <div className="flex items-center gap-2 mt-1 text-xs text-[#8E8E93]">
              <span>{item.category}</span>
              {item.quantity && item.unit && (
                <>
                  <span>•</span>
                  <span>{item.quantity} {item.unit}</span>
                </>
              )}
            </div>
          </div>

          {/* Right: Action Buttons - Compact */}
          <div className="flex items-center gap-2">
            {/* Approve Button */}
            {onApprove && (
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="px-3 py-1.5 text-xs font-medium text-white bg-[#30D158] hover:bg-[#30D158]/90 rounded-md transition-colors disabled:opacity-50 flex items-center"
                title="Approve"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Approve
              </button>
            )}

            {/* Reject Button */}
            {onReject && (
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={isProcessing}
                className="px-3 py-1.5 text-xs font-medium text-[#FF453A] hover:bg-[#FF453A]/10 rounded-md transition-colors disabled:opacity-50 flex items-center"
                title="Reject"
              >
                <XCircle className="w-3.5 h-3.5 mr-1" />
                Reject
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal - Keep as is */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2C2C2E] rounded-lg max-w-md w-full p-6 border border-[#38383A]">
            <h3 className="text-lg font-semibold text-white mb-4">
              Reject {item.code || 'Item'}
            </h3>
            <p className="text-sm text-[#8E8E93] mb-4">
              Mohon berikan alasan penolakan untuk item ini:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Contoh: Nilai terlalu tinggi, perlu revisi..."
              rows={4}
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-sm text-white placeholder-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
            />
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium text-[#8E8E93] hover:bg-[#3A3A3C] rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                disabled={isProcessing || !rejectReason.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-[#FF453A] hover:bg-[#FF453A]/90 rounded-lg transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApprovalItemCard;
