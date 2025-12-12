import React from 'react';
import { BarChart3, Calculator, Clock, ShoppingCart } from 'lucide-react';

/**
 * Quick Stats Component
 * Displays quick project statistics
 */
const QuickStats = ({ project, workflowData }) => {
  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
      <div className="flex items-center border-b border-white/10 px-5 py-3 text-white">
        <BarChart3 className="mr-2 h-5 w-5 text-[#c084fc]" />
        <h3 className="text-base font-semibold">Statistik Cepat</h3>
      </div>
      <div className="space-y-3 p-4">
        <StatRow
          icon={Calculator}
          iconClass="from-[#60a5fa]/30 to-[#2563eb]/20 text-[#bfdbfe]"
          label="RAP Items"
          value={project.rabItems?.length || 0}
          valueClass="text-white"
        />
        <StatRow
          icon={Clock}
          iconClass="from-[#fbbf24]/30 to-[#f97316]/20 text-[#fde68a]"
          label="Pending Approvals"
          value={workflowData.approvalStatus?.pending || 0}
          valueClass="text-[#fbbf24]"
        />
        <StatRow
          icon={ShoppingCart}
          iconClass="from-[#34d399]/30 to-[#22c55e]/20 text-[#bbf7d0]"
          label="Active POs"
          value={workflowData.purchaseOrders?.filter(po => po.status === 'active').length || 0}
          valueClass="text-[#34d399]"
        />
      </div>
    </div>
  );
};

const StatRow = ({ icon: Icon, iconClass, label, value, valueClass }) => (
  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#05070d] px-4 py-3">
    <div className="flex items-center gap-3">
      <div className={`rounded-2xl bg-gradient-to-br ${iconClass} p-2`}>
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm text-white/70">{label}</span>
    </div>
    <span className={`text-base font-semibold ${valueClass}`}>{value}</span>
  </div>
);

export default QuickStats;
