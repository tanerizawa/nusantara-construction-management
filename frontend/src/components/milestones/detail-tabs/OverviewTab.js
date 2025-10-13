// Overview Tab - Quick summary and key metrics
import React from 'react';
import { Calendar, DollarSign, TrendingUp, Package, Clock, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { getStatusInfo } from '../config/statusConfig';
import { useMilestoneCosts } from '../hooks/useMilestoneCosts';

const OverviewTab = ({ milestone, projectId }) => {
  const { summary, loading } = useMilestoneCosts(projectId, milestone.id);
  const statusInfo = getStatusInfo(milestone.status);
  const StatusIcon = statusInfo.icon;

  // Calculate budget variance percentage
  const budgetVariancePercent = summary?.variance 
    ? ((summary.variance / milestone.budget) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Status Card */}
      <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: statusInfo.bgOpacity }}
            >
              <StatusIcon size={24} style={{ color: statusInfo.color }} />
            </div>
            <div>
              <p className="text-sm text-[#8E8E93]">Status</p>
              <p 
                className="text-lg font-semibold"
                style={{ color: statusInfo.color }}
              >
                {statusInfo.text}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#8E8E93]">Progress</p>
            <p className="text-2xl font-bold text-white">{milestone.progress}%</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-[#48484A] rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${milestone.progress}%`,
                backgroundColor: statusInfo.color
              }}
            />
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Target Date */}
        <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
          <div className="flex items-center gap-2 text-[#0A84FF] mb-2">
            <Calendar size={18} />
            <span className="text-xs font-medium">Target Date</span>
          </div>
          <p className="text-base font-semibold text-white">
            {formatDate(milestone.targetDate)}
          </p>
        </div>

        {/* Budget */}
        <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
          <div className="flex items-center gap-2 text-[#30D158] mb-2">
            <DollarSign size={18} />
            <span className="text-xs font-medium">Budget</span>
          </div>
          <p className="text-base font-semibold text-white">
            {formatCurrency(milestone.budget)}
          </p>
        </div>

        {/* Deliverables */}
        {milestone.deliverables && milestone.deliverables.length > 0 && (
          <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
            <div className="flex items-center gap-2 text-[#FF9F0A] mb-2">
              <Package size={18} />
              <span className="text-xs font-medium">Deliverables</span>
            </div>
            <p className="text-base font-semibold text-white">
              {milestone.deliverables.length} items
            </p>
          </div>
        )}

        {/* Days Remaining */}
        {milestone.status !== 'completed' && (
          <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
            <div className="flex items-center gap-2 text-[#FF453A] mb-2">
              <Clock size={18} />
              <span className="text-xs font-medium">Days Remaining</span>
            </div>
            <p className="text-base font-semibold text-white">
              {Math.ceil((new Date(milestone.targetDate) - new Date()) / (1000 * 60 * 60 * 24))} days
            </p>
          </div>
        )}
      </div>

      {/* Budget Summary */}
      {loading ? (
        <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
          <p className="text-sm text-[#8E8E93]">Loading cost summary...</p>
        </div>
      ) : summary ? (
        <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-[#0A84FF]" />
            <h3 className="font-semibold text-white">Budget vs Actual</h3>
          </div>
          
          <div className="space-y-3">
            {/* Milestone Budget (Planned) */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8E8E93]">Milestone Budget</span>
              <span className="text-sm font-medium text-white">
                {formatCurrency(summary.budget || milestone.budget || 0)}
              </span>
            </div>

            {/* Actual */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8E8E93]">Actual Cost</span>
              <span className="text-sm font-medium text-white">
                {formatCurrency(summary.totalActual || 0)}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-[#38383A] my-2"></div>

            {/* Variance */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Variance</span>
              <div className="text-right">
                <span 
                  className={`text-sm font-bold ${
                    summary.status === 'over_budget' 
                      ? 'text-[#FF453A]' 
                      : summary.status === 'under_budget'
                      ? 'text-[#30D158]'
                      : 'text-[#FF9F0A]'
                  }`}
                >
                  {summary.variance > 0 ? '+' : ''}{formatCurrency(summary.variance)}
                </span>
                <p 
                  className={`text-xs ${
                    summary.status === 'over_budget' 
                      ? 'text-[#FF453A]' 
                      : summary.status === 'under_budget'
                      ? 'text-[#30D158]'
                      : 'text-[#FF9F0A]'
                  }`}
                >
                  {budgetVariancePercent > 0 ? '+' : ''}{budgetVariancePercent}%
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="pt-2">
              <span 
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                  summary.status === 'over_budget'
                    ? 'bg-[#FF453A]/10 text-[#FF453A] border border-[#FF453A]/30'
                    : summary.status === 'under_budget'
                    ? 'bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/30'
                    : 'bg-[#FF9F0A]/10 text-[#FF9F0A] border border-[#FF9F0A]/30'
                }`}
              >
                {summary.status === 'over_budget' && '⚠️ Over Budget'}
                {summary.status === 'under_budget' && '✅ Under Budget'}
                {summary.status === 'on_budget' && '👍 On Budget'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
          <p className="text-sm text-[#8E8E93]">No cost data available yet.</p>
        </div>
      )}

      {/* RAB Category Link */}
      {milestone.category_link && milestone.category_link.enabled && (
        <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
          <div className="flex items-center gap-2 mb-3">
            <Package size={18} className="text-[#0A84FF]" />
            <h3 className="font-semibold text-white">RAB Category Link</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8E8E93]">Category</span>
              <span className="text-sm font-medium text-white">
                {milestone.category_link.category_name}
              </span>
            </div>
            {milestone.category_link.itemCount && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8E8E93]">Items</span>
                <span className="text-sm font-medium text-white">
                  {milestone.category_link.itemCount} items
                </span>
              </div>
            )}
            {milestone.category_link.totalValue && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8E8E93]">Total Value</span>
                <span className="text-sm font-medium text-white">
                  {formatCurrency(milestone.category_link.totalValue)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completion Date */}
      {milestone.actualDate && (
        <div className="bg-[#30D158]/10 rounded-lg p-4 border border-[#30D158]/30">
          <div className="flex items-center gap-2">
            <CheckCircle size={20} className="text-[#30D158]" />
            <div>
              <p className="text-sm font-medium text-[#30D158]">Completed</p>
              <p className="text-xs text-[#8E8E93]">
                Finished on {formatDate(milestone.actualDate)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
