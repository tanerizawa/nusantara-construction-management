import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, DollarSign, Calendar, User } from 'lucide-react';
import api from '../../../services/api';

/**
 * Urgency Badge Component
 */
const UrgencyBadge = ({ urgency }) => {
  const badges = {
    urgent: {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/30',
      icon: '🔴',
      label: 'MENDESAK'
    },
    medium: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      icon: '🟡',
      label: 'SEDANG'
    },
    normal: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      border: 'border-green-500/30',
      icon: '🟢',
      label: 'NORMAL'
    }
  };

  const badge = badges[urgency] || badges.normal;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.bg} ${badge.text} ${badge.border}`}>
      <span className="mr-1">{badge.icon}</span>
      {badge.label}
    </span>
  );
};

/**
 * Format currency to Rupiah
 */
const formatRupiah = (amount) => {
  if (!amount) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

/**
 * Format date to relative time
 */
const formatRelativeTime = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diffInMs = now - then;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInDays > 0) return `${diffInDays} hari yang lalu`;
  if (diffInHours > 0) return `${diffInHours} jam yang lalu`;
  if (diffInMinutes > 0) return `${diffInMinutes} menit yang lalu`;
  return 'Baru saja';
};

/**
 * Approval Card Component
 */
const ApprovalCard = ({ item, type, onApprove, onReject, loading }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [action, setAction] = useState(null);
  const [comments, setComments] = useState('');

  const handleAction = (actionType) => {
    setAction(actionType);
    setShowConfirm(true);
  };

  const confirmAction = async () => {
    if (action === 'approve') {
      await onApprove(item.id, comments);
    } else {
      await onReject(item.id, comments);
    }
    setShowConfirm(false);
    setComments('');
    setAction(null);
  };

  // Different card content based on type
  const renderCardContent = () => {
    switch (type) {
      case 'rab':
        return (
          <>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-1">{item.description}</h4>
                <p className="text-xs text-[#98989D]">
                  {item.projectName} ({item.projectCode})
                </p>
              </div>
              <UrgencyBadge urgency={item.urgency} />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center text-xs">
                <DollarSign className="h-4 w-4 text-[#0A84FF] mr-1.5" />
                <div>
                  <p className="text-[#98989D]">Total Nilai</p>
                  <p className="font-semibold text-white">{formatRupiah(item.totalAmount)}</p>
                </div>
              </div>
              <div className="flex items-center text-xs">
                <Clock className="h-4 w-4 text-[#FF9F0A] mr-1.5" />
                <div>
                  <p className="text-[#98989D]">Kuantitas</p>
                  <p className="font-semibold text-white">{item.quantity} {item.unit}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center text-xs text-[#636366] mb-3">
              <User className="h-3.5 w-3.5 mr-1" />
              <span>Diajukan oleh {item.createdBy}</span>
              <span className="mx-2">•</span>
              <span>{formatRelativeTime(item.createdAt)}</span>
            </div>
          </>
        );

      case 'progress_payment':
        return (
          <>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-1">
                  Pembayaran #{item.invoiceNumber || item.id}
                </h4>
                <p className="text-xs text-[#98989D]">
                  {item.projectName} ({item.projectCode})
                </p>
              </div>
              <UrgencyBadge urgency={item.urgency} />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center text-xs">
                <DollarSign className="h-4 w-4 text-[#30D158] mr-1.5" />
                <div>
                  <p className="text-[#98989D]">Jumlah Bayar</p>
                  <p className="font-semibold text-white">{formatRupiah(item.amount)}</p>
                </div>
              </div>
              <div className="flex items-center text-xs">
                <CheckCircle className="h-4 w-4 text-[#64D2FF] mr-1.5" />
                <div>
                  <p className="text-[#98989D]">Progress</p>
                  <p className="font-semibold text-white">{item.percentage}%</p>
                </div>
              </div>
            </div>

            {item.dueDate && (
              <div className="flex items-center text-xs text-[#636366] mb-3">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>Jatuh tempo: {new Date(item.dueDate).toLocaleDateString('id-ID')}</span>
              </div>
            )}
          </>
        );

      case 'purchase_order':
        return (
          <>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-1">
                  PO #{item.poNumber}
                </h4>
                <p className="text-xs text-[#98989D]">
                  {item.supplierName}
                  {item.projectName && ` • ${item.projectName}`}
                </p>
              </div>
              <UrgencyBadge urgency={item.urgency} />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center text-xs">
                <DollarSign className="h-4 w-4 text-[#30D158] mr-1.5" />
                <div>
                  <p className="text-[#98989D]">Total Nilai</p>
                  <p className="font-semibold text-white">{formatRupiah(item.totalAmount)}</p>
                </div>
              </div>
              <div className="flex items-center text-xs">
                <Calendar className="h-4 w-4 text-[#64D2FF] mr-1.5" />
                <div>
                  <p className="text-[#98989D]">Tanggal Pengiriman</p>
                  <p className="font-semibold text-white">
                    {item.deliveryDate ? new Date(item.deliveryDate).toLocaleDateString('id-ID') : 'TBD'}
                  </p>
                </div>
              </div>
            </div>

            {item.paymentTerms && (
              <div className="text-xs text-[#98989D] mb-3">
                <p className="font-medium mb-1">Syarat Pembayaran:</p>
                <p className="text-[#636366]">{item.paymentTerms}</p>
              </div>
            )}

            <div className="flex items-center text-xs text-[#636366] mb-3">
              <User className="h-3.5 w-3.5 mr-1" />
              <span>Diajukan oleh {item.createdBy}</span>
              <span className="mx-2">•</span>
              <span>{formatRelativeTime(item.createdAt)}</span>
            </div>
          </>
        );

      case 'work_order':
        return (
          <>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-1">
                  WO #{item.woNumber}
                </h4>
                <p className="text-xs text-[#98989D]">
                  {item.contractorName || '—'}
                  {item.projectName && ` • ${item.projectName}`}
                </p>
              </div>
              <UrgencyBadge urgency={item.urgency} />
            </div>

            {item.description && (
              <div className="text-xs text-[#98989D] mb-3">
                <p className="font-semibold text-white">{item.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center text-xs">
                <DollarSign className="h-4 w-4 text-[#FF9F0A] mr-1.5" />
                <div>
                  <p className="text-[#98989D]">Nilai Kontrak</p>
                  <p className="font-semibold text-white">{formatRupiah(item.totalAmount || 0)}</p>
                </div>
              </div>
              <div className="flex items-center text-xs">
                <Calendar className="h-4 w-4 text-[#64D2FF] mr-1.5" />
                <div>
                  <p className="text-[#98989D]">Schedule</p>
                  <p className="font-semibold text-white">
                    {item.startDate ? new Date(item.startDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : 'TBD'}
                    {item.endDate && ` - ${new Date(item.endDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center text-xs text-[#636366] mb-3">
              <User className="h-3.5 w-3.5 mr-1" />
              <span>Diajukan oleh {item.createdBy}</span>
              <span className="mx-2">•</span>
              <span>{formatRelativeTime(item.createdAt)}</span>
            </div>
          </>
        );

      case 'delivery':
        return (
          <>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-1">
                  Surat Jalan #{item.receiptNumber}
                </h4>
                <p className="text-xs text-[#98989D]">{item.supplierName}</p>
              </div>
              <UrgencyBadge urgency={item.urgency} />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center text-xs">
                <DollarSign className="h-4 w-4 text-[#FF9F0A] mr-1.5" />
                <div>
                  <p className="text-[#98989D]">Penerima</p>
                  <p className="font-semibold text-white">{item.receiverName || '—'}</p>
                </div>
              </div>
              <div className="flex items-center text-xs">
                <Calendar className="h-4 w-4 text-[#64D2FF] mr-1.5" />
                <div>
                  <p className="text-[#98989D]">Tanggal Kirim</p>
                  <p className="font-semibold text-white">
                    {new Date(item.deliveryDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          </>
        );

      case 'leave':
        return (
          <>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-1">
                  Cuti {item.leaveType}
                </h4>
                <p className="text-xs text-[#98989D]">{item.employeeName}</p>
              </div>
              <UrgencyBadge urgency={item.urgency} />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center text-xs">
                <Calendar className="h-4 w-4 text-[#0A84FF] mr-1.5" />
                <div>
                  <p className="text-[#98989D]">Tanggal</p>
                  <p className="font-semibold text-white">
                    {new Date(item.startDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-xs">
                <Clock className="h-4 w-4 text-[#FF9F0A] mr-1.5" />
                <div>
                  <p className="text-[#98989D]">Durasi</p>
                  <p className="font-semibold text-white">{item.totalDays} hari</p>
                </div>
              </div>
            </div>

            {item.reason && (
              <div className="text-xs text-[#98989D] mb-3">
                <p className="font-medium mb-1">Alasan:</p>
                <p className="text-[#636366]">{item.reason}</p>
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] p-4 rounded-lg hover:border-[#48484A] transition-all duration-150">
      {renderCardContent()}

      {/* Action Buttons */}
      {!showConfirm ? (
        <div className="flex gap-2">
          <button
            onClick={() => handleAction('approve')}
            disabled={loading}
            className="flex-1 bg-[#30D158] hover:bg-[#30D158]/80 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-150 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="h-4 w-4 inline mr-1.5" />
            Approve
          </button>
          <button
            onClick={() => handleAction('reject')}
            disabled={loading}
            className="flex-1 bg-[#FF453A] hover:bg-[#FF453A]/80 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-150 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <AlertCircle className="h-4 w-4 inline mr-1.5" />
            Reject
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Tambahkan komentar (opsional)..."
            className="w-full bg-[#1C1C1E] border border-[#38383A] text-white placeholder-[#636366] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0A84FF] resize-none"
            rows="2"
          />
          <div className="flex gap-2">
            <button
              onClick={confirmAction}
              disabled={loading}
              className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors duration-150 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                action === 'approve'
                  ? 'bg-[#30D158] hover:bg-[#30D158]/80 text-white'
                  : 'bg-[#FF453A] hover:bg-[#FF453A]/80 text-white'
              }`}
            >
              {loading ? 'Processing...' : `Confirm ${action === 'approve' ? 'Approve' : 'Reject'}`}
            </button>
            <button
              onClick={() => {
                setShowConfirm(false);
                setComments('');
                setAction(null);
              }}
              disabled={loading}
              className="flex-1 bg-[#3A3A3C] hover:bg-[#48484A] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-150 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Approval Section Component
 */
const ApprovalSection = () => {
  const [activeTab, setActiveTab] = useState('rab');
  const [approvals, setApprovals] = useState({
    rab: [],
    progressPayments: [],
    purchaseOrders: [],
    workOrders: [],
    deliveryReceipts: [],
    leaveRequests: []
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const tabs = [
    { id: 'rab', label: 'RAB', count: approvals.rab.length },
    { id: 'progress_payment', label: 'Progress Payment', count: approvals.progressPayments.length },
    { id: 'purchase_order', label: 'PO', count: approvals.purchaseOrders.length },
    { id: 'work_order', label: 'Work Order', count: approvals.workOrders.length },
    { id: 'delivery', label: 'Delivery Receipt', count: approvals.deliveryReceipts.length },
    { id: 'leave', label: 'Leave Request', count: approvals.leaveRequests.length }
  ];

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      // api.get() already returns response.data, not full axios response
      const response = await api.get('/dashboard/pending-approvals', {
        params: { limit: 10 }
      });
      
      if (response.success) {
        setApprovals(response.data);
      }
    } catch (error) {
      console.error('Error fetching approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, comments) => {
    try {
      setActionLoading(true);
      const response = await api.post(`/dashboard/approve/${activeTab}/${id}`, {
        action: 'approve',
        comments
      });

      if (response.success) {
        // Refresh approvals immediately to show updated list
        await fetchApprovals();
        
        // Show success notification
        alert(`Successfully approved!`);
      }
    } catch (error) {
      console.error('Error approving:', error);
      alert('Failed to approve. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id, comments) => {
    try {
      setActionLoading(true);
      const response = await api.post(`/dashboard/approve/${activeTab}/${id}`, {
        action: 'reject',
        comments
      });

      if (response.success) {
        // Refresh approvals immediately to show updated list
        await fetchApprovals();
        
        // Show success notification
        alert(`Successfully rejected!`);
      }
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Failed to reject. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const getCurrentApprovals = () => {
    switch (activeTab) {
      case 'rab':
        return approvals.rab;
      case 'progress_payment':
        return approvals.progressPayments;
      case 'purchase_order':
        return approvals.purchaseOrders;
      case 'work_order':
        return approvals.workOrders;
      case 'delivery':
        return approvals.deliveryReceipts;
      case 'leave':
        return approvals.leaveRequests;
      default:
        return [];
    }
  };

  const currentApprovals = getCurrentApprovals();
  const totalPending = tabs.reduce((sum, tab) => sum + tab.count, 0);

  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-xl p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <AlertCircle className="h-6 w-6 text-[#FF9F0A] mr-2" />
          <h3 className="text-lg font-semibold text-white">
            Pending Approvals
          </h3>
          {totalPending > 0 && (
            <span className="ml-3 bg-[#FF453A] text-white text-xs font-bold px-2 py-1 rounded-full">
              {totalPending}
            </span>
          )}
        </div>
        <button
          onClick={fetchApprovals}
          disabled={loading}
          className="text-[#0A84FF] hover:text-[#0A84FF]/80 text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
              activeTab === tab.id
                ? 'bg-[#0A84FF] text-white'
                : 'bg-[#3A3A3C] text-[#98989D] hover:bg-[#48484A] hover:text-white'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs font-bold ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-[#FF453A] text-white'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-[#636366]">
            <Clock className="h-8 w-8 mx-auto mb-2 animate-spin" />
            <p>Loading approvals...</p>
          </div>
        ) : currentApprovals.length === 0 ? (
          <div className="text-center py-8 text-[#636366]">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-[#30D158]" />
            <p>No pending approvals</p>
          </div>
        ) : (
          currentApprovals.map((item) => (
            <ApprovalCard
              key={item.id}
              item={item}
              type={activeTab}
              onApprove={handleApprove}
              onReject={handleReject}
              loading={actionLoading}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ApprovalSection;
