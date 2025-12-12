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
    <div className="rounded-3xl border border-white/5 bg-white/5 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
      <div className="flex items-center border-b border-white/10 px-5 py-3 text-white">
        <DollarSign className="mr-2 h-4 w-4 text-[#34d399]" />
        <h3 className="text-base font-semibold">Ringkasan Keuangan</h3>
      </div>
      <div className="space-y-3 p-4">
        <FinancialRow
          label="Total Budget"
          value={formatCurrency(project.totalBudget)}
          badgeClass="from-[#60a5fa]/25 to-[#2563eb]/15 text-[#bae6fd]"
          valueClass="text-white"
        />
        <FinancialRow
          label="RAP Approved"
          value={formatCurrency(workflowData.budgetSummary?.approvedAmount || 0)}
          badgeClass="from-[#6366f1]/25 to-[#8b5cf6]/15 text-[#ddd6fe]"
          valueClass="text-[#c4b5fd]"
        />
        <FinancialRow
          label="PO Committed"
          value={formatCurrency(workflowData.budgetSummary?.committedAmount || 0)}
          badgeClass="from-[#fbbf24]/25 to-[#f97316]/15 text-[#fde68a]"
          valueClass="text-[#fbbf24]"
        />
        <FinancialRow
          label="Actual Spent"
          value={formatCurrency(workflowData.budgetSummary?.actualSpent || 0)}
          badgeClass="from-[#34d399]/25 to-[#22c55e]/15 text-[#bbf7d0]"
          valueClass="text-[#34d399]"
        />
      </div>
    </div>
  );
};

const FinancialRow = ({ label, value, badgeClass, valueClass }) => (
  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#05070d] px-4 py-3">
    <div className="flex items-center gap-3">
      <div className={`rounded-2xl bg-gradient-to-br ${badgeClass} px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]`}>
        {label}
      </div>
    </div>
    <span className={`text-base font-semibold ${valueClass}`}>{value}</span>
  </div>
);

export default FinancialSummary;
