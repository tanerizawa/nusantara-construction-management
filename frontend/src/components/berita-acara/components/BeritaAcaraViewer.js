import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  DollarSign, 
  CheckCircle,
  FileText,
  User,
  MapPin,
  Percent,
  File
} from 'lucide-react';
import { getStatusConfig, getBATypeConfig } from '../config/baStatusConfig';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import HandoverDocument from './HandoverDocument';

/**
 * Viewer component untuk menampilkan detail Berita Acara
 * Full implementation with dark theme and handover document
 */
const BeritaAcaraViewer = ({ 
  beritaAcara, 
  project, 
  onEdit, 
  onBack 
}) => {
  const [showHandover, setShowHandover] = useState(false);
  const statusConfig = getStatusConfig(beritaAcara.status);
  const typeConfig = getBATypeConfig(beritaAcara.baType);

  const handlePrint = () => {
    // Use browser's native print function
    // The @media print CSS will hide non-printable elements
    window.print();
  };

  const handleDownload = () => {
    // TODO: Implement PDF generation
    alert('Fitur download PDF akan segera tersedia');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-[#8E8E93] hover:text-white hover:bg-[#48484A] rounded transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-white">
                {beritaAcara.baNumber}
              </h3>
              <span 
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{
                  backgroundColor: statusConfig.bgColor,
                  color: statusConfig.color
                }}
              >
                {statusConfig.label}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#48484A] text-[#8E8E93]">
                {typeConfig.label}
              </span>
            </div>
            <p className="text-sm text-[#8E8E93] mt-1">
              {project?.name || 'Detail Berita Acara'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {beritaAcara.status === 'draft' && (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 bg-[#0A84FF] text-white px-4 py-2 rounded-lg hover:bg-[#0A84FF]/90 transition-colors"
            >
              <Edit size={16} />
              Edit BA
            </button>
          )}
          
          {/* View Handover Document Button - Available after submission */}
          {['submitted', 'client_review', 'approved', 'rejected'].includes(beritaAcara.status) && (
            <button
              onClick={() => setShowHandover(!showHandover)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showHandover 
                  ? 'bg-[#48484A] text-white hover:bg-[#48484A]/80' 
                  : 'bg-[#30D158] text-white hover:bg-[#30D158]/90'
              }`}
            >
              <File size={16} />
              {showHandover ? 'Sembunyikan Dokumen' : 'Lihat Berita Acara Formal'}
            </button>
          )}
        </div>
      </div>

      {/* Inline Handover Document - Shows at top when toggled */}
      {showHandover && (
        <div className="animate-slideDown">
          <HandoverDocument
            beritaAcara={beritaAcara}
            project={project}
            onPrint={handlePrint}
            onDownload={handleDownload}
            onClose={() => setShowHandover(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Work Description */}
          <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] p-6">
            <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <FileText size={16} />
              Deskripsi Pekerjaan
            </h4>
            <p className="text-[#8E8E93] whitespace-pre-line">
              {beritaAcara.workDescription}
            </p>
          </div>

          {/* Progress Details */}
          <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] p-6">
            <h4 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Percent size={16} />
              Detail Progress
            </h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#8E8E93]">Persentase Penyelesaian</span>
                  <span className="text-white font-mono">{beritaAcara.completionPercentage}%</span>
                </div>
                <div className="w-full bg-[#48484A] rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${beritaAcara.completionPercentage}%`,
                      backgroundColor: statusConfig.color
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="flex items-center gap-2 text-[#8E8E93] text-sm mb-1">
                    <Calendar size={14} />
                    Tanggal Penyelesaian
                  </div>
                  <div className="text-white font-medium">
                    {formatDate(beritaAcara.completionDate)}
                  </div>
                </div>

                {beritaAcara.milestone && (
                  <div>
                    <div className="text-[#8E8E93] text-sm mb-1">Milestone Terkait</div>
                    <div className="text-white font-medium">
                      {beritaAcara.milestone.title || beritaAcara.milestone.name}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Client Notes */}
          {beritaAcara.clientNotes && (
            <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] p-6">
              <h4 className="text-base font-semibold text-white mb-3">
                Catatan untuk Klien
              </h4>
              <p className="text-[#8E8E93] whitespace-pre-line">
                {beritaAcara.clientNotes}
              </p>
            </div>
          )}

          {/* Witnesses */}
          {beritaAcara.witnesses && beritaAcara.witnesses.length > 0 && (
            <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] p-6">
              <h4 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <User size={16} />
                Saksi-saksi
              </h4>
              <div className="space-y-3">
                {beritaAcara.witnesses.map((witness, index) => (
                  <div key={index} className="bg-[#1C1C1E] rounded-lg p-4 border border-[#38383A]">
                    <div className="font-medium text-white">{witness.name}</div>
                    <div className="text-sm text-[#8E8E93] mt-1">{witness.position}</div>
                    {witness.organization && (
                      <div className="text-xs text-[#98989D] mt-1">{witness.organization}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-6">
          {/* Submission Info */}
          {beritaAcara.submittedAt && (
            <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] p-6">
              <h4 className="text-base font-semibold text-white mb-4">
                Informasi Pengajuan
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-[#8E8E93] mb-1">Diajukan Tanggal</div>
                  <div className="text-white">{formatDate(beritaAcara.submittedAt)}</div>
                </div>
                {beritaAcara.submittedBy && (
                  <div>
                    <div className="text-[#8E8E93] mb-1">Diajukan Oleh</div>
                    <div className="text-white">{beritaAcara.submittedBy}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Approval Info */}
          {beritaAcara.approvedAt && (
            <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] p-6">
              <h4 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle size={16} className="text-[#30D158]" />
                Informasi Persetujuan
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-[#8E8E93] mb-1">Disetujui Tanggal</div>
                  <div className="text-white">{formatDate(beritaAcara.approvedAt)}</div>
                </div>
                {beritaAcara.approvedBy && (
                  <div>
                    <div className="text-[#8E8E93] mb-1">Disetujui Oleh</div>
                    <div className="text-white">{beritaAcara.approvedBy}</div>
                  </div>
                )}
                {beritaAcara.clientApprovalNotes && (
                  <div>
                    <div className="text-[#8E8E93] mb-1">Catatan Persetujuan</div>
                    <div className="text-white">{beritaAcara.clientApprovalNotes}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rejection Info */}
          {beritaAcara.status === 'rejected' && beritaAcara.rejectionReason && (
            <div className="bg-[#2C2C2E] rounded-lg border border-[#FF3B30] p-6">
              <h4 className="text-base font-semibold text-[#FF3B30] mb-3">
                Alasan Penolakan
              </h4>
              <p className="text-[#8E8E93] text-sm">
                {beritaAcara.rejectionReason}
              </p>
            </div>
          )}

          {/* Payment Info */}
          {beritaAcara.paymentAuthorized && beritaAcara.paymentAmount && (
            <div className="bg-[#2C2C2E] rounded-lg border border-[#30D158] p-6">
              <h4 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <DollarSign size={16} className="text-[#30D158]" />
                Informasi Pembayaran
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-[#8E8E93] mb-1">Jumlah Pembayaran</div>
                  <div className="text-lg font-bold text-[#30D158]">
                    {formatCurrency(beritaAcara.paymentAmount)}
                  </div>
                </div>
                {beritaAcara.paymentDueDate && (
                  <div>
                    <div className="text-[#8E8E93] mb-1">Jatuh Tempo</div>
                    <div className="text-white">{formatDate(beritaAcara.paymentDueDate)}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Created Info */}
          <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] p-6">
            <h4 className="text-base font-semibold text-white mb-4">
              Informasi Dokumen
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-[#8E8E93] mb-1">Dibuat Tanggal</div>
                <div className="text-white">{formatDate(beritaAcara.createdAt)}</div>
              </div>
              {beritaAcara.updatedAt && beritaAcara.updatedAt !== beritaAcara.createdAt && (
                <div>
                  <div className="text-[#8E8E93] mb-1">Terakhir Diubah</div>
                  <div className="text-white">{formatDate(beritaAcara.updatedAt)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="bg-[#48484A] text-white px-6 py-2.5 rounded-lg hover:bg-[#48484A]/80 transition-colors"
        >
          Kembali ke Daftar
        </button>
      </div>
    </div>
  );
};

export default BeritaAcaraViewer;
