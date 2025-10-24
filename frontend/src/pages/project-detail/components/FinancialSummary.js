import React from 'react';
import { DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils';

/**
 * Financial Summary Component
 * Displays budget breakdown and financial metrics
 * 
 * UPDATED (Oct 11, 2025):
 * - Added hover effects for better interactivity
 * - Added tooltips for financial items
 */
const FinancialSummary = ({ project, workflowData }) => {
  return (
    <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] overflow-hidden">
      <div className="px-4 py-3 bg-[#1C1C1E] border-b border-[#38383A]">
        <h3 className="text-base font-semibold text-white flex items-center">
          <DollarSign className="h-4 w-4 mr-2 text-[#30D158]" />
          Ringkasan Keuangan
        </h3>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          <div 
            className="flex justify-between items-center p-3 bg-[#1C1C1E] border border-[#38383A] rounded-lg hover:bg-[#38383A]/30 transition-colors cursor-default"
            title="Total budget yang dialokasikan untuk proyek ini"
          >
            <span className="text-sm font-medium text-[#8E8E93]">Total Budget</span>
            <span className="text-base font-bold text-white">
              {formatCurrency(project.totalBudget)}
            </span>
          </div>
          <div 
            className="flex justify-between items-center p-3 bg-[#0A84FF]/10 border border-[#0A84FF]/30 rounded-lg hover:bg-[#0A84FF]/20 transition-colors cursor-default"
            title="Total RAP yang telah disetujui"
          >
            <span className="text-sm font-medium text-[#8E8E93]">RAP Approved</span>
            <span className="text-base font-semibold text-[#0A84FF]">
              {formatCurrency(workflowData.budgetSummary?.approvedAmount || 0)}
            </span>
          </div>
          <div 
            className="flex justify-between items-center p-3 bg-[#FF9F0A]/10 border border-[#FF9F0A]/30 rounded-lg hover:bg-[#FF9F0A]/20 transition-colors cursor-default"
            title="Total nilai Purchase Order yang telah dibuat"
          >
            <span className="text-sm font-medium text-[#8E8E93]">PO Committed</span>
            <span className="text-base font-semibold text-[#FF9F0A]">
              {formatCurrency(workflowData.budgetSummary?.committedAmount || 0)}
            </span>
          </div>
          <div 
            className="flex justify-between items-center p-3 bg-[#30D158]/10 border border-[#30D158]/30 rounded-lg hover:bg-[#30D158]/20 transition-colors cursor-default"
            title="Total pengeluaran aktual yang telah dicatat"
          >
            <span className="text-sm font-medium text-[#8E8E93]">Actual Spent</span>
            <span className="text-base font-semibold text-[#30D158]">
              {formatCurrency(workflowData.budgetSummary?.actualSpent || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
