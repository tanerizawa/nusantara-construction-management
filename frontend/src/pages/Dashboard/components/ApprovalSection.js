import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, DollarSign, Calendar, User, RefreshCw } from 'lucide-react';
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

const CARD_ACCENTS = {
  rab: 'from-[#0ea5e9]/15 via-transparent to-transparent',
  progress_payment: 'from-[#34d399]/15 via-transparent to-transparent',
  purchase_order: 'from-[#f97316]/15 via-transparent to-transparent',
  work_order: 'from-[#a855f7]/15 via-transparent to-transparent',
  delivery: 'from-[#facc15]/15 via-transparent to-transparent',
  leave: 'from-[#fb7185]/15 via-transparent to-transparent',
  default: 'from-white/10 via-transparent to-transparent'
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
                <h4 className="text-sm font-semibold text-white mb-1 break-words">{item.description}</h4>
                <p className="text-xs text-[#98989D] break-words">
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
                <h4 className="text-sm font-semibold text-white mb-1 break-words">
                  Pembayaran #{item.invoiceNumber || item.id}
                </h4>
                <p className="text-xs text-[#98989D] break-words">
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
                <h4 className="text-sm font-semibold text-white mb-1 break-words">
                  PO #{item.poNumber}
                </h4>
                <p className="text-xs text-[#98989D] break-words">
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
                <h4 className="text-sm font-semibold text-white mb-1 break-words">
                  WO #{item.woNumber}
                </h4>
                <p className="text-xs text-[#98989D] break-words">
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
                <p className="text-xs text-[#98989D] break-words">{item.supplierName}</p>
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
                <h4 className="text-sm font-semibold text-white mb-1 break-words">
                  Cuti {item.leaveType}
                </h4>
                <p className="text-xs text-[#98989D] break-words">{item.employeeName}</p>
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

  const accentClass = CARD_ACCENTS[type] || CARD_ACCENTS.default;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-lg transition duration-300 hover:-translate-y-0.5 hover:border-white/20">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentClass} opacity-0 transition duration-300 group-hover:opacity-100`} />
      <div className="relative space-y-4">
        {renderCardContent()}

        {!showConfirm ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => handleAction('approve')}
              disabled={loading}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#22c55e] to-[#16a34a] py-2.5 px-4 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(34,197,94,0.35)] transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <CheckCircle className="mb-0.5 mr-1.5 inline h-4 w-4" />
              Approve
            </button>
            <button
              onClick={() => handleAction('reject')}
              disabled={loading}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#fb7185] to-[#ef4444] py-2.5 px-4 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(248,113,113,0.35)] transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <AlertCircle className="mb-0.5 mr-1.5 inline h-4 w-4" />
              Reject
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Tambahkan komentar (opsional)..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-[#0ea5e9] focus:outline-none"
              rows="2"
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={confirmAction}
                disabled={loading}
                className={`flex-1 rounded-xl py-2.5 px-4 text-sm font-semibold text-white shadow transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed ${
                  action === 'approve'
                    ? 'bg-gradient-to-r from-[#22c55e] to-[#16a34a]'
                    : 'bg-gradient-to-r from-[#fb7185] to-[#ef4444]'
                }`}
              >
                {loading ? 'Processing...' : `Konfirmasi ${action === 'approve' ? 'Approve' : 'Reject'}`}
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setComments('');
                  setAction(null);
                }}
                disabled={loading}
                className="flex-1 rounded-xl border border-white/10 bg-transparent py-2.5 px-4 text-sm font-medium text-white/80 transition hover:border-white/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Batalkan
              </button>
            </div>
          </div>
        )}
      </div>
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
    <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#0b0e16]/90 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/5 via-transparent to-transparent" />
      <div className="pointer-events-none absolute -right-24 top-10 h-56 w-56 rounded-full bg-[#0ea5e9]/20 blur-3xl" />
      <div className="relative space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">Approval Workflow</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <AlertCircle className="h-5 w-5 text-[#facc15]" />
                <div>
                  <p className="text-sm font-semibold text-white">Approval Tertunda</p>
                  <p className="text-xs text-white/50">Harap selesaikan prioritas ini</p>
                </div>
              </div>
              {totalPending > 0 && (
                <span className="rounded-full bg-gradient-to-r from-[#fb7185] to-[#ef4444] px-3 py-1 text-xs font-bold text-white shadow-[0_10px_30px_rgba(248,113,113,0.35)]">
                  {totalPending} item
                </span>
              )}
            </div>
          </div>

          <button
            onClick={fetchApprovals}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Memuat...' : 'Segarkan Data'}
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-w-[180px] items-center justify-between gap-3 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? 'border-[#0ea5e9] bg-[#0ea5e9]/20 text-white shadow-[0_12px_30px_rgba(14,165,233,0.25)]'
                  : 'border-white/5 bg-white/5 text-white/60 hover:border-white/20 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-white/10 text-white/80'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-10 text-white/60">
              <Clock className="mb-3 h-8 w-8 animate-spin" />
              <p>Memuat data persetujuan...</p>
            </div>
          ) : currentApprovals.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-10 text-white/60">
              <CheckCircle className="mb-3 h-8 w-8 text-[#34d399]" />
              <p>Tidak ada approval tertunda 🎉</p>
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
    </section>
  );
};

export default ApprovalSection;
