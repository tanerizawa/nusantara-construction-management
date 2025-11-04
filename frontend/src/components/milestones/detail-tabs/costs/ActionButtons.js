import React, { useState } from 'react';

/**
 * ActionButtons Component - Workflow action buttons for cost realization
 * 
 * Button visibility based on status:
 * - draft: Show "Submit" button
 * - submitted: Show "Approve" and "Reject" buttons (manager only)
 * - approved: Show "Execute Payment" button (finance/manager only)
 * - rejected/paid: No action buttons
 */
const ActionButtons = ({ 
  cost, 
  onSubmit, 
  onApprove, 
  onReject,
  onExecutePayment,
  isManager = false,
  isFinance = false,
  loading = false 
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (loading || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(cost.id);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (loading || submitting) return;
    if (!window.confirm('Apakah Anda yakin ingin menyetujui realisasi biaya ini?')) {
      return;
    }
    setSubmitting(true);
    try {
      await onApprove(cost.id);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      alert('Alasan penolakan harus diisi!');
      return;
    }
    
    setSubmitting(true);
    try {
      await onReject(cost.id, rejectionReason.trim());
      setShowRejectModal(false);
      setRejectionReason('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setRejectionReason('');
  };

  // Draft status: Show Submit button
  if (cost.status === 'draft') {
    return (
      <button
        onClick={handleSubmit}
        disabled={loading || submitting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {submitting ? (
          <>
            <span className="animate-spin">⏳</span>
            <span>Mengirim...</span>
          </>
        ) : (
          <>
            <span>📤</span>
            <span>Kirim untuk Persetujuan</span>
          </>
        )}
      </button>
    );
  }

  // Submitted status: Show Approve and Reject buttons (manager only)
  if (cost.status === 'submitted' && isManager) {
    return (
      <>
        <div className="flex gap-2">
          <button
            onClick={handleApprove}
            disabled={loading || submitting}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>✅</span>
                <span>Setujui</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={loading || submitting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>❌</span>
            <span>Tolak</span>
          </button>
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Alasan Penolakan</h3>
              
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Masukkan alasan penolakan realisasi biaya ini..."
                className="w-full border border-gray-300 rounded p-3 mb-4 min-h-[120px] focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoFocus
              />
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleRejectCancel}
                  disabled={submitting}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  onClick={handleRejectSubmit}
                  disabled={submitting || !rejectionReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Menolak...</span>
                    </>
                  ) : (
                    <>
                      <span>❌</span>
                      <span>Tolak Realisasi</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Approved status: Show Execute Payment button (finance/manager only)
  if (cost.status === 'approved' && (isManager || isFinance)) {
    return (
      <button
        onClick={() => onExecutePayment && onExecutePayment(cost.id)}
        disabled={loading || submitting}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {submitting ? (
          <>
            <span className="animate-spin">⏳</span>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>💰</span>
            <span>Execute Payment</span>
          </>
        )}
      </button>
    );
  }

  // Rejected or Paid: No action buttons
  return null;
};

export default ActionButtons;
