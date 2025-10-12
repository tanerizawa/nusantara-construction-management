import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Clock,
  Filter,
  Search
} from 'lucide-react';
import ApprovalItemCard from './ApprovalItemCard';

/**
 * ApprovalSection Component
 * 
 * Reusable inline approval section for workflow pages
 * Displays pending approval items with actions
 * 
 * @param {Object} props
 * @param {Array} props.items - Array of items pending approval
 * @param {string} props.type - Type of approval (rab, po, ba, tt)
 * @param {Function} props.onApprove - Callback when item is approved
 * @param {Function} props.onReject - Callback when item is rejected
 * @param {Function} props.onReview - Callback when item is marked as reviewed
 * @param {boolean} props.isCollapsible - Whether section can collapse
 * @param {boolean} props.autoExpand - Auto expand if items > 0
 * @param {boolean} props.showFilters - Show search and filter controls
 * @param {string} props.className - Additional CSS classes
 */
const ApprovalSection = ({
  items = [],
  type = 'rab',
  onApprove,
  onReject,
  onReview,
  isCollapsible = true,
  autoExpand = true,
  showFilters = true,
  className = ''
}) => {
  // DEBUG LOG
  console.log('🎯 [ApprovalSection] Component rendered');
  console.log('🎯 [ApprovalSection] items:', items);
  console.log('🎯 [ApprovalSection] items.length:', items?.length);
  console.log('🎯 [ApprovalSection] type:', type);

  const [isExpanded, setIsExpanded] = useState(autoExpand && items.length > 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, draft, pending, reviewed
  const [filteredItems, setFilteredItems] = useState(items);

  // Type configuration
  const typeConfig = {
    rab: {
      label: 'RAB & BOQ',
      icon: AlertCircle,
      color: 'blue',
      singularLabel: 'RAB'
    },
    po: {
      label: 'Purchase Order',
      icon: AlertCircle,
      color: 'purple',
      singularLabel: 'PO'
    },
    ba: {
      label: 'Berita Acara',
      icon: AlertCircle,
      color: 'green',
      singularLabel: 'BA'
    },
    tt: {
      label: 'Tanda Terima',
      icon: AlertCircle,
      color: 'orange',
      singularLabel: 'TT'
    }
  };

  const config = typeConfig[type] || typeConfig.rab;
  const Icon = config.icon;

  // Auto expand when items arrive
  useEffect(() => {
    if (autoExpand && items.length > 0) {
      setIsExpanded(true);
    }
  }, [items.length, autoExpand]);

  // Filter items based on search and filter status
  useEffect(() => {
    let filtered = [...items];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => {
        const searchLower = searchQuery.toLowerCase();
        return (
          item.code?.toLowerCase().includes(searchLower) ||
          item.name?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.amount?.toString().includes(searchLower)
        );
      });
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.approval_status === filterStatus);
    }

    setFilteredItems(filtered);
  }, [items, searchQuery, filterStatus]);

  // Count by status
  const statusCounts = {
    total: items.length,
    draft: items.filter(i => i.approval_status === 'draft').length,
    pending: items.filter(i => i.approval_status === 'pending_approval').length,
    reviewed: items.filter(i => i.approval_status === 'reviewed').length
  };

  // Handle bulk approve
  const handleBulkApprove = () => {
    if (!onApprove) return;
    filteredItems.forEach(item => {
      if (item.approval_status !== 'approved') {
        onApprove(item);
      }
    });
  };

  // Handle bulk review
  const handleBulkReview = () => {
    if (!onReview) return;
    filteredItems.forEach(item => {
      if (item.approval_status === 'draft' || item.approval_status === 'pending_approval') {
        onReview(item);
      }
    });
  };

  if (items.length === 0) {
    return null; // Don't show section if no items
  }

  return (
    <div className={`bg-[#2C2C2E] rounded-lg border border-[#38383A] overflow-hidden mb-4 ${className}`}>
      {/* Compact Header */}
      <div className="px-4 py-3 border-b border-[#38383A] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-[#FF9F0A]" />
          <h3 className="text-sm font-semibold text-white">
            Menunggu Approval
          </h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#FF9F0A]/20 text-[#FF9F0A]">
            {statusCounts.total}
          </span>
        </div>
        
        {/* Approve All Button */}
        {onApprove && filteredItems.length > 0 && (
          <button
            onClick={handleBulkApprove}
            className="px-3 py-1.5 text-xs font-medium text-white bg-[#30D158] hover:bg-[#30D158]/90 rounded-md transition-colors flex items-center"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Approve Semua
          </button>
        )}
      </div>

      {/* Compact Items List */}
      <div className="divide-y divide-[#38383A]">
        {filteredItems.map((item, index) => (
          <ApprovalItemCard
            key={item.id || index}
            item={item}
            type={type}
            onApprove={onApprove}
            onReject={onReject}
            onReview={onReview}
          />
        ))}
      </div>
    </div>
  );
};

export default ApprovalSection;
