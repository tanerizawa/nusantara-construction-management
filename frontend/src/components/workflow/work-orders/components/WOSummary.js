import React from 'react';
import { Clipboard, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';

/**
 * WO Summary Component
 * Displays summary statistics for work orders
 */
const WOSummary = ({ workOrders = [] }) => {
  // Calculate statistics
  const stats = {
    total: workOrders.length,
    pending: workOrders.filter(wo => wo.status === 'pending').length,
    approved: workOrders.filter(wo => wo.status === 'approved' || wo.status === 'in_progress').length,
    completed: workOrders.filter(wo => wo.status === 'completed').length,
    totalValue: workOrders.reduce((sum, wo) => sum + (parseFloat(wo.totalAmount || wo.total_amount) || 0), 0)
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total WOs */}
      <div
        style={{
          backgroundColor: '#1C1C1E',
          border: '1px solid #38383A'
        }}
        className="rounded-lg p-5"
      >
        <div className="flex items-center justify-between mb-2">
          <Clipboard className="h-8 w-8 text-[#AF52DE]" />
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </div>
        </div>
        <div className="text-sm text-[#8E8E93]">Total Work Orders</div>
      </div>

      {/* Pending */}
      <div
        style={{
          backgroundColor: '#1C1C1E',
          border: '1px solid #38383A'
        }}
        className="rounded-lg p-5"
      >
        <div className="flex items-center justify-between mb-2">
          <Clock className="h-8 w-8 text-[#FF9F0A]" />
          <div className="text-right">
            <div className="text-3xl font-bold text-[#FF9F0A]">{stats.pending}</div>
          </div>
        </div>
        <div className="text-sm text-[#8E8E93]">Pending Approval</div>
      </div>

      {/* Active */}
      <div
        style={{
          backgroundColor: '#1C1C1E',
          border: '1px solid #38383A'
        }}
        className="rounded-lg p-5"
      >
        <div className="flex items-center justify-between mb-2">
          <TrendingUp className="h-8 w-8 text-[#0A84FF]" />
          <div className="text-right">
            <div className="text-3xl font-bold text-[#0A84FF]">{stats.approved}</div>
          </div>
        </div>
        <div className="text-sm text-[#8E8E93]">Active / In Progress</div>
      </div>

      {/* Completed */}
      <div
        style={{
          backgroundColor: '#1C1C1E',
          border: '1px solid #38383A'
        }}
        className="rounded-lg p-5"
      >
        <div className="flex items-center justify-between mb-2">
          <CheckCircle className="h-8 w-8 text-[#30D158]" />
          <div className="text-right">
            <div className="text-3xl font-bold text-[#30D158]">{stats.completed}</div>
          </div>
        </div>
        <div className="text-sm text-[#8E8E93]">Completed</div>
      </div>

      {/* Total Value - Spans full width on mobile, 4 cols on desktop */}
      <div
        style={{
          backgroundColor: 'rgba(175, 82, 222, 0.1)',
          border: '1px solid rgba(175, 82, 222, 0.3)'
        }}
        className="rounded-lg p-5 md:col-span-4"
      >
        <div className="flex items-center justify-between">
          <div className="text-[#98989D] font-medium">Total Nilai Work Orders:</div>
          <div className="text-3xl font-bold text-[#AF52DE]">
            {formatCurrency(stats.totalValue)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WOSummary;
