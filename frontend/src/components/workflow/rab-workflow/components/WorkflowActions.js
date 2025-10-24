import React from 'react';
import { CheckCircle, TrendingUp, ShoppingCart, AlertCircle, Package, FileCheck, CreditCard } from 'lucide-react';

/**
 * WorkflowActions Component
 * Displays RAP status and next steps guide with dynamic workflow progress
 */
const WorkflowActions = ({ 
  approvalStatus, 
  rabItemsCount,
  isSubmitting,
  onApprove,
  workflowStats = {
    totalPOs: 0,
    approvedPOs: 0,
    totalReceipts: 0,
    totalBAs: 0,
    totalPayments: 0
  }
}) => {
  if (rabItemsCount === 0) return null;

  // Calculate workflow step status
  const getStepStatus = (step) => {
    if (approvalStatus?.status !== 'approved') {
      return step === 'rab' ? 'active' : 'disabled';
    }

    switch (step) {
      case 'rab':
        return 'completed';
      case 'po':
        if (workflowStats.approvedPOs > 0) return 'completed';
        if (workflowStats.totalPOs > 0) return 'active';
        return 'pending';
      case 'receipt':
        if (workflowStats.totalReceipts >= workflowStats.approvedPOs && workflowStats.approvedPOs > 0) {
          return 'completed';
        }
        if (workflowStats.totalReceipts > 0) return 'active';
        return 'pending';
      case 'ba':
        if (workflowStats.totalBAs > 0) return 'active';
        return 'pending';
      case 'payment':
        if (workflowStats.totalPayments > 0) return 'active';
        return 'pending';
      default:
        return 'pending';
    }
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-[#30D158]';
      case 'active': return 'bg-[#FF9F0A]';
      case 'pending': return 'bg-[#636366]';
      default: return 'bg-[#636366]';
    }
  };

  const getStepTooltip = (step) => {
    const status = getStepStatus(step);
    switch (step) {
      case 'po':
        if (status === 'completed') return `${workflowStats.approvedPOs} PO approved`;
        if (status === 'active') return `${workflowStats.totalPOs} PO (belum approved)`;
        return 'Belum ada PO';
      case 'receipt':
        if (status === 'completed') return `${workflowStats.totalReceipts} Tanda Terima (lengkap)`;
        if (status === 'active') return `${workflowStats.totalReceipts}/${workflowStats.approvedPOs} Tanda Terima`;
        return 'Belum ada tanda terima';
      case 'ba':
        return workflowStats.totalBAs > 0 ? `${workflowStats.totalBAs} Berita Acara` : 'Belum ada BA';
      case 'payment':
        return workflowStats.totalPayments > 0 ? `${workflowStats.totalPayments} Payment` : 'Belum ada payment';
      default:
        return '';
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#2C2C2E] to-[#1C1C1E] rounded-lg border border-[#38383A] p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-[#0A84FF]" />
        Status RAP & Langkah Selanjutnya
      </h3>
      
      <div className="space-y-4">
        {/* Current Status */}
        <div className="flex items-start gap-3 p-4 bg-[#1C1C1E] rounded-lg border border-[#38383A]">
          {approvalStatus?.status === 'approved' ? (
            <>
              <div className="w-10 h-10 rounded-full bg-[#30D158]/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-[#30D158]" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-1">RAP Sudah Disetujui</h4>
                <p className="text-xs text-[#8E8E93] mb-3">
                  RAP telah disetujui dan siap untuk proses selanjutnya
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A84FF]/10 text-[#0A84FF] rounded-md">
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Lanjut ke Purchase Orders
                  </div>
                  <span className="text-[#636366]">→</span>
                  <span className="text-[#636366]">Procurement → Berita Acara → Payment</span>
                </div>
              </div>
            </>
          ) : approvalStatus?.status === 'draft' ? (
            <>
              <div className="w-10 h-10 rounded-full bg-[#FF9F0A]/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-[#FF9F0A]" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-1">RAP Menunggu Approval</h4>
                <p className="text-xs text-[#8E8E93] mb-3">
                  RAP perlu disetujui sebelum melanjutkan ke tahap procurement
                </p>
                <button
                  onClick={onApprove}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#30D158] text-white text-sm font-medium rounded-lg hover:bg-[#30D158]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <CheckCircle className="h-4 w-4" />
                  {isSubmitting ? 'Mengapprove...' : 'Approve RAP Sekarang'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-[#636366]/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-[#636366]" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-1">Status: {approvalStatus?.status || 'Unknown'}</h4>
                <p className="text-xs text-[#8E8E93]">
                  Periksa status approval untuk melanjutkan
                </p>
              </div>
            </>
          )}
        </div>

        {/* Workflow Guide with Dynamic Status */}
        <div className="p-4 bg-[#1C1C1E]/50 rounded-lg border border-[#38383A]/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-white">Construction Workflow Progress</span>
            {approvalStatus?.status === 'approved' && (
              <span className="text-xs text-[#636366]">
                {workflowStats.totalPOs > 0 && `${workflowStats.approvedPOs}/${workflowStats.totalPOs} PO Approved`}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* RAP */}
            <div className="flex flex-col items-center gap-1.5 group relative">
              <div className={`w-8 h-8 rounded-full ${getStepColor(getStepStatus('rab'))} flex items-center justify-center transition-all`}>
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] text-[#8E8E93] font-medium">RAP</span>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#2C2C2E] border border-[#38383A] px-2 py-1 rounded text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Approved
              </div>
            </div>

            <div className="h-0.5 flex-1 bg-[#38383A]"></div>

            {/* PO */}
            <div className="flex flex-col items-center gap-1.5 group relative">
              <div className={`w-8 h-8 rounded-full ${getStepColor(getStepStatus('po'))} flex items-center justify-center transition-all`}>
                <ShoppingCart className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] text-[#8E8E93] font-medium">PO</span>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#2C2C2E] border border-[#38383A] px-2 py-1 rounded text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {getStepTooltip('po')}
              </div>
            </div>

            <div className="h-0.5 flex-1 bg-[#38383A]"></div>

            {/* Tanda Terima */}
            <div className="flex flex-col items-center gap-1.5 group relative">
              <div className={`w-8 h-8 rounded-full ${getStepColor(getStepStatus('receipt'))} flex items-center justify-center transition-all`}>
                <Package className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] text-[#8E8E93] font-medium">Receipt</span>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#2C2C2E] border border-[#38383A] px-2 py-1 rounded text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {getStepTooltip('receipt')}
              </div>
            </div>

            <div className="h-0.5 flex-1 bg-[#38383A]"></div>

            {/* BA */}
            <div className="flex flex-col items-center gap-1.5 group relative">
              <div className={`w-8 h-8 rounded-full ${getStepColor(getStepStatus('ba'))} flex items-center justify-center transition-all`}>
                <FileCheck className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] text-[#8E8E93] font-medium">BA</span>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#2C2C2E] border border-[#38383A] px-2 py-1 rounded text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {getStepTooltip('ba')}
              </div>
            </div>

            <div className="h-0.5 flex-1 bg-[#38383A]"></div>

            {/* Payment */}
            <div className="flex flex-col items-center gap-1.5 group relative">
              <div className={`w-8 h-8 rounded-full ${getStepColor(getStepStatus('payment'))} flex items-center justify-center transition-all`}>
                <CreditCard className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] text-[#8E8E93] font-medium">Payment</span>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#2C2C2E] border border-[#38383A] px-2 py-1 rounded text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {getStepTooltip('payment')}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-[#38383A]/50">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#30D158]"></div>
              <span className="text-[10px] text-[#8E8E93]">Selesai</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#FF9F0A]"></div>
              <span className="text-[10px] text-[#8E8E93]">Proses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#636366]"></div>
              <span className="text-[10px] text-[#8E8E93]">Belum</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowActions;
