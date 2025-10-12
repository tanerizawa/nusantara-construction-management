import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Package, FileCheck, CreditCard, ShoppingCart, TrendingUp, X } from 'lucide-react';
import api from '../../services/api';

/**
 * MilestoneWorkflowProgress Component
 * Displays detailed workflow progress for a milestone linked to RAB
 */
const MilestoneWorkflowProgress = ({ milestoneId, projectId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, [milestoneId]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/projects/${projectId}/milestones/${milestoneId}/progress`
      );
      const data = response.data;

      if (data.success) {
        setProgressData(data.data);
      } else {
        setError(data.message || 'Failed to load progress');
      }
    } catch (err) {
      console.error('Error fetching milestone progress:', err);
      setError('Failed to load workflow progress');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setLoading(true);
      const response = await api.post(
        `/projects/${projectId}/milestones/${milestoneId}/sync`
      );
      const data = response.data;

      if (data.success) {
        setProgressData(data.data);
      }
    } catch (err) {
      console.error('Error syncing milestone:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (step) => {
    if (!progressData) return 'pending';

    const wp = progressData.workflow_progress;

    switch (step) {
      case 'rab':
        return wp.rab_approved.status ? 'completed' : 'pending';
      case 'po':
        if (wp.purchase_orders.approved_count >= wp.purchase_orders.total_count && wp.purchase_orders.total_count > 0) {
          return 'completed';
        }
        if (wp.purchase_orders.total_count > 0) return 'active';
        return 'pending';
      case 'receipt':
        if (wp.receipts.received_count >= wp.receipts.expected_count && wp.receipts.expected_count > 0) {
          return 'completed';
        }
        if (wp.receipts.received_count > 0) return 'active';
        return 'pending';
      case 'ba':
        if (wp.berita_acara.completed_percentage >= 100) return 'completed';
        if (wp.berita_acara.total_count > 0) return 'active';
        return 'pending';
      case 'payment':
        if (wp.payments.payment_percentage >= 100) return 'completed';
        if (wp.payments.paid_count > 0) return 'active';
        return 'pending';
      default:
        return 'pending';
    }
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-[#30D158]';
      case 'active':
        return 'bg-[#FF9F0A]';
      default:
        return 'bg-[#636366]';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#1C1C1E] rounded-lg p-8 max-w-4xl w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A84FF]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !progressData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#1C1C1E] rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-[#FF9F0A] mx-auto mb-4" />
            <p className="text-white mb-4">{error || 'No progress data available'}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { workflow_progress: wp, overall_progress } = progressData;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#1C1C1E] rounded-lg max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#38383A]">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-[#0A84FF]" />
            <div>
              <h2 className="text-xl font-semibold text-white">Workflow Progress</h2>
              <p className="text-sm text-[#8E8E93]">Overall Progress: {overall_progress}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSync}
              className="px-4 py-2 bg-[#0A84FF] text-white text-sm rounded-lg hover:bg-[#0A84FF]/90"
            >
              Sync Now
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#8E8E93] hover:text-white hover:bg-[#2C2C2E] rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-6 border-b border-[#38383A]">
          <div className="relative h-2 bg-[#2C2C2E] rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#0A84FF] to-[#30D158] transition-all duration-500"
              style={{ width: `${overall_progress}%` }}
            />
          </div>
        </div>

        {/* Workflow Stages */}
        <div className="p-6 space-y-4">
          {/* Stage 1: RAB */}
          <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full ${getStepColor(getStepStatus('rab'))} flex items-center justify-center flex-shrink-0`}>
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">RAB Approved</h3>
                <div className="text-sm text-[#8E8E93] space-y-1">
                  <p>{formatCurrency(wp.rab_approved.total_value)} • {wp.rab_approved.total_items} items</p>
                  <p>Approved: {new Date(wp.rab_approved.approved_date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stage 2: Purchase Orders */}
          <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full ${getStepColor(getStepStatus('po'))} flex items-center justify-center flex-shrink-0`}>
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">
                  Purchase Orders ({wp.purchase_orders.approved_count}/{wp.purchase_orders.total_count})
                </h3>
                <div className="text-sm text-[#8E8E93] space-y-1 mb-2">
                  <p>{formatCurrency(wp.purchase_orders.total_value)}</p>
                  <p>Approved: {wp.purchase_orders.approved_count} • Pending: {wp.purchase_orders.pending_count}</p>
                </div>
                {wp.purchase_orders.items.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {wp.purchase_orders.items.map((po, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs bg-[#1C1C1E] p-2 rounded">
                        <span className="text-white">{po.po_number}</span>
                        <span className="text-[#8E8E93]">{po.supplier}</span>
                        <span className={`px-2 py-0.5 rounded ${
                          po.status === 'approved' ? 'bg-[#30D158]/20 text-[#30D158]' : 'bg-[#FF9F0A]/20 text-[#FF9F0A]'
                        }`}>
                          {po.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stage 3: Tanda Terima */}
          <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full ${getStepColor(getStepStatus('receipt'))} flex items-center justify-center flex-shrink-0`}>
                <Package className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">
                  Tanda Terima ({wp.receipts.received_count}/{wp.receipts.expected_count})
                </h3>
                <div className="text-sm text-[#8E8E93] space-y-1">
                  <p>Received: {formatCurrency(wp.receipts.received_value)}</p>
                  <p>Pending: {formatCurrency(wp.receipts.pending_value)}</p>
                </div>
                {wp.receipts.alerts && wp.receipts.alerts.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {wp.receipts.alerts.map((alert, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs bg-[#FF9F0A]/10 border border-[#FF9F0A]/30 p-2 rounded">
                        <AlertCircle className="h-4 w-4 text-[#FF9F0A] flex-shrink-0 mt-0.5" />
                        <span className="text-[#FF9F0A]">{alert.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stage 4: Berita Acara */}
          <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full ${getStepColor(getStepStatus('ba'))} flex items-center justify-center flex-shrink-0`}>
                <FileCheck className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Berita Acara</h3>
                <div className="text-sm text-[#8E8E93] space-y-1">
                  <p>{wp.berita_acara.total_count} BA • {wp.berita_acara.completed_percentage.toFixed(1)}% completed</p>
                  <p>{formatCurrency(wp.berita_acara.total_value)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stage 5: Progress Payment */}
          <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full ${getStepColor(getStepStatus('payment'))} flex items-center justify-center flex-shrink-0`}>
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Progress Payments</h3>
                <div className="text-sm text-[#8E8E93] space-y-1">
                  <p>Paid: {formatCurrency(wp.payments.paid_value)} ({wp.payments.payment_percentage.toFixed(1)}%)</p>
                  <p>Pending: {formatCurrency(wp.payments.pending_value)}</p>
                  <p>{wp.payments.paid_count} payments completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#38383A] flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#30D158]"></div>
              <span className="text-[#8E8E93]">Selesai</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#FF9F0A]"></div>
              <span className="text-[#8E8E93]">Proses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#636366]"></div>
              <span className="text-[#8E8E93]">Belum</span>
            </div>
          </div>
          <div className="text-xs text-[#636366]">
            Last synced: {new Date(progressData.last_synced).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneWorkflowProgress;
