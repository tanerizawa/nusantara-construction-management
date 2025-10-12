import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, FileText, DollarSign, User } from 'lucide-react';
import { ApprovalStatusBadge } from './index';
import { formatCurrency, formatDate } from '../../../../utils/formatters';
import { projectAPI } from '../../../../services/api';

/**
 * Berita Acara Content for Approval Workflow
 * Displays submitted BA for review and approval
 */
const BeritaAcaraContent = ({ projectId, project, onDataChange }) => {
  const [baList, setBaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, submitted, client_review

  useEffect(() => {
    fetchBeritaAcara();
  }, [projectId]);

  const fetchBeritaAcara = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await projectAPI.getBeritaAcara(projectId);
      
      // Filter only submitted and client_review status (awaiting approval)
      const pendingBA = response.data.filter(ba => 
        ['submitted', 'client_review'].includes(ba.status)
      );

      setBaList(pendingBA);
    } catch (err) {
      console.error('Error fetching Berita Acara:', err);
      setError(err.message || 'Gagal memuat Berita Acara');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (baId) => {
    if (!window.confirm('Apakah Anda yakin akan menyetujui Berita Acara ini?')) return;

    const approvedBy = localStorage.getItem('username') || 'System';
    const clientApprovalNotes = prompt('Catatan persetujuan (opsional):');

    try {
      await projectAPI.approveBeritaAcara(projectId, baId, {
        approvedBy,
        clientApprovalNotes: clientApprovalNotes || ''
      });

      alert('Berita Acara berhasil disetujui!');
      await fetchBeritaAcara();
      if (onDataChange) onDataChange();
    } catch (err) {
      console.error('Error approving BA:', err);
      alert('Gagal menyetujui Berita Acara');
    }
  };

  const handleReject = async (baId) => {
    const rejectionReason = prompt('Alasan penolakan (wajib):');
    if (!rejectionReason || rejectionReason.trim() === '') {
      alert('Alasan penolakan harus diisi');
      return;
    }

    try {
      await projectAPI.updateBeritaAcara(projectId, baId, {
        status: 'rejected',
        rejectionReason: rejectionReason.trim(),
        reviewedBy: localStorage.getItem('username') || 'System',
        reviewedAt: new Date().toISOString()
      });

      alert('Berita Acara ditolak');
      await fetchBeritaAcara();
      if (onDataChange) onDataChange();
    } catch (err) {
      console.error('Error rejecting BA:', err);
      alert('Gagal menolak Berita Acara');
    }
  };

  const handleMarkForReview = async (baId) => {
    try {
      await projectAPI.updateBeritaAcara(projectId, baId, {
        status: 'client_review',
        reviewedBy: localStorage.getItem('username') || 'System',
        reviewedAt: new Date().toISOString()
      });

      alert('Berita Acara ditandai untuk client review');
      await fetchBeritaAcara();
      if (onDataChange) onDataChange();
    } catch (err) {
      console.error('Error marking BA for review:', err);
      alert('Gagal menandai Berita Acara');
    }
  };

  const filteredList = baList.filter(ba => {
    if (filter === 'all') return true;
    return ba.status === filter;
  });

  const stats = {
    total: baList.length,
    submitted: baList.filter(ba => ba.status === 'submitted').length,
    review: baList.filter(ba => ba.status === 'client_review').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A84FF] mx-auto"></div>
          <p className="mt-4 text-[#8E8E93]">Memuat Berita Acara...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/30 rounded-lg p-4">
        <p className="text-[#FF3B30]">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-3">
          <p className="text-xs text-[#8E8E93]">Total Pending</p>
          <p className="text-xl font-semibold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#0A84FF]/10 border border-[#0A84FF]/30 rounded-lg p-3">
          <p className="text-xs text-[#8E8E93]">Submitted</p>
          <p className="text-xl font-semibold text-[#0A84FF]">{stats.submitted}</p>
        </div>
        <div className="bg-[#FF9F0A]/10 border border-[#FF9F0A]/30 rounded-lg p-3">
          <p className="text-xs text-[#8E8E93]">Client Review</p>
          <p className="text-xl font-semibold text-[#FF9F0A]">{stats.review}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            filter === 'all'
              ? 'bg-[#0A84FF] text-white'
              : 'bg-[#2C2C2E] text-[#8E8E93] hover:text-white'
          }`}
        >
          Semua ({stats.total})
        </button>
        <button
          onClick={() => setFilter('submitted')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            filter === 'submitted'
              ? 'bg-[#0A84FF] text-white'
              : 'bg-[#2C2C2E] text-[#8E8E93] hover:text-white'
          }`}
        >
          Submitted ({stats.submitted})
        </button>
        <button
          onClick={() => setFilter('client_review')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            filter === 'client_review'
              ? 'bg-[#0A84FF] text-white'
              : 'bg-[#2C2C2E] text-[#8E8E93] hover:text-white'
          }`}
        >
          Client Review ({stats.review})
        </button>
      </div>

      {/* BA List */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="text-center py-12 bg-[#2C2C2E] border border-[#38383A] rounded-lg">
            <FileText className="w-12 h-12 text-[#48484A] mx-auto mb-3" />
            <p className="text-[#8E8E93]">Tidak ada Berita Acara yang menunggu approval</p>
          </div>
        ) : (
          filteredList.map((ba) => (
            <div
              key={ba.id}
              className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4 hover:border-[#0A84FF]/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-white">{ba.baNumber}</h3>
                    <ApprovalStatusBadge status={ba.status} />
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#48484A] text-[#8E8E93]">
                      {ba.baType}
                    </span>
                  </div>
                  <p className="text-sm text-[#8E8E93]">{project?.name || 'Project'}</p>
                </div>
              </div>

              {/* BA Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
                <div className="flex items-start gap-2">
                  <FileText size={16} className="text-[#0A84FF] mt-0.5" />
                  <div>
                    <div className="text-[#98989D]">Pekerjaan</div>
                    <div className="text-white">{ba.workDescription}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock size={16} className="text-[#0A84FF] mt-0.5" />
                  <div>
                    <div className="text-[#98989D]">Progress</div>
                    <div className="text-white">{ba.completionPercentage}%</div>
                  </div>
                </div>

                {ba.paymentAmount && (
                  <div className="flex items-start gap-2">
                    <DollarSign size={16} className="text-[#30D158] mt-0.5" />
                    <div>
                      <div className="text-[#98989D]">Nilai Pembayaran</div>
                      <div className="text-white">{formatCurrency(ba.paymentAmount)}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2">
                  <User size={16} className="text-[#0A84FF] mt-0.5" />
                  <div>
                    <div className="text-[#98989D]">Diajukan Oleh</div>
                    <div className="text-white">{ba.submittedBy}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock size={16} className="text-[#0A84FF] mt-0.5" />
                  <div>
                    <div className="text-[#98989D]">Tanggal Pengajuan</div>
                    <div className="text-white">{formatDate(ba.submittedAt)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock size={16} className="text-[#0A84FF] mt-0.5" />
                  <div>
                    <div className="text-[#98989D]">Tanggal Penyelesaian</div>
                    <div className="text-white">{formatDate(ba.completionDate)}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-[#38383A]">
                {ba.status === 'submitted' && (
                  <>
                    <button
                      onClick={() => handleMarkForReview(ba.id)}
                      className="flex-1 bg-[#FF9F0A] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#FF9F0A]/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Clock size={16} />
                      Mark for Review
                    </button>
                    <button
                      onClick={() => handleApprove(ba.id)}
                      className="flex-1 bg-[#30D158] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#30D158]/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Setujui
                    </button>
                    <button
                      onClick={() => handleReject(ba.id)}
                      className="flex-1 bg-[#FF3B30] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#FF3B30]/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle size={16} />
                      Tolak
                    </button>
                  </>
                )}

                {ba.status === 'client_review' && (
                  <>
                    <button
                      onClick={() => handleApprove(ba.id)}
                      className="flex-1 bg-[#30D158] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#30D158]/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Setujui
                    </button>
                    <button
                      onClick={() => handleReject(ba.id)}
                      className="flex-1 bg-[#FF3B30] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#FF3B30]/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle size={16} />
                      Tolak
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BeritaAcaraContent;
