import React from 'react';
import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * SummaryCards Component
 * Displays summary statistics for Tanda Terima
 */
const SummaryCards = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      {/* Total Tanda Terima */}
      <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#0A84FF]/20">
            <FileText className="h-5 w-5 text-[#0A84FF]" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-[#8E8E93]">Total Tanda Terima</p>
            <p className="text-xl font-semibold text-white mt-0.5">{summary.total}</p>
          </div>
        </div>
      </div>

      {/* Menunggu */}
      <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF9F0A]/20">
            <Clock className="h-5 w-5 text-[#FF9F0A]" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-[#8E8E93]">Menunggu</p>
            <p className="text-xl font-semibold text-white mt-0.5">{summary.pending}</p>
          </div>
        </div>
      </div>

      {/* Diterima */}
      <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#30D158]/20">
            <CheckCircle className="h-5 w-5 text-[#30D158]" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-[#8E8E93]">Diterima</p>
            <p className="text-xl font-semibold text-white mt-0.5">{summary.received}</p>
          </div>
        </div>
      </div>

      {/* Ditolak */}
      <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF3B30]/20">
            <AlertTriangle className="h-5 w-5 text-[#FF3B30]" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-[#8E8E93]">Ditolak</p>
            <p className="text-xl font-semibold text-white mt-0.5">{summary.rejected}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
