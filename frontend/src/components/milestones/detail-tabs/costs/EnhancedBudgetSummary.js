import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';

/**
 * EnhancedBudgetSummary Component
 * 
 * Displays comprehensive budget summary with RAB planned budget,
 * actual costs (RAB-linked), additional costs (non-RAB), and variance tracking.
 */
const EnhancedBudgetSummary = ({ milestone, rabSummary, additionalCosts }) => {
  const budget = milestone?.budget || 0;
  
  // RAB planned & actual (from RAB items)
  const rabPlanned = rabSummary?.total_planned || 0;
  const rabActual = rabSummary?.total_actual || 0;
  
  // Additional costs (non-RAB: kasbon, overhead, etc.)
  const additional = additionalCosts || 0;
  
  // Total spent = RAB actual + Additional
  const totalSpent = rabActual + additional;
  
  // Variance calculations
  const variance = budget - totalSpent;
  const variancePercent = budget > 0 ? ((variance / budget) * 100) : 0;
  const rabVariance = rabPlanned - rabActual;
  
  // Status determination
  const getStatus = () => {
    if (variance >= budget * 0.1) return 'under';
    if (variance >= 0) return 'on_track';
    return 'over';
  };
  
  const status = getStatus();
  
  // Status config
  const statusConfig = {
    under: {
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      icon: TrendingDown,
      label: 'Under Budget',
      borderColor: 'border-green-400/30'
    },
    on_track: {
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      icon: CheckCircle,
      label: 'On Track',
      borderColor: 'border-blue-400/30'
    },
    over: {
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      icon: AlertCircle,
      label: 'Over Budget',
      borderColor: 'border-red-400/30'
    }
  };
  
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  
  // Progress percentage
  const progressPercent = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;
  
  return (
    <div className="bg-[#1C1C1E] rounded-xl border border-[#2C2C2E] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#2C2C2E]">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <DollarSign size={18} className="text-blue-400" />
            Budget Summary
          </h3>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor} ${config.borderColor} border`}>
            <StatusIcon size={14} className={config.color} />
            <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
          </div>
        </div>
      </div>
      
      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        {/* Card 1: Milestone Budget */}
        <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#3C3C3E]">
          <div className="text-xs text-gray-400 mb-1">Milestone Budget</div>
          <div className="text-lg font-bold text-white">{formatCurrency(budget)}</div>
          <div className="text-xs text-gray-500 mt-1">Total allocated</div>
        </div>
        
        {/* Card 2: RAB Actual */}
        <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#3C3C3E]">
          <div className="text-xs text-gray-400 mb-1">RAB Actual</div>
          <div className="text-lg font-bold text-blue-400">{formatCurrency(rabActual)}</div>
          <div className="text-xs text-gray-500 mt-1">
            From {rabSummary?.items_count || 0} items
          </div>
        </div>
        
        {/* Card 3: Additional Costs */}
        <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#3C3C3E]">
          <div className="text-xs text-gray-400 mb-1">Additional Costs</div>
          <div className="text-lg font-bold text-purple-400">{formatCurrency(additional)}</div>
          <div className="text-xs text-gray-500 mt-1">Non-RAB costs</div>
        </div>
        
        {/* Card 4: Variance */}
        <div className={`rounded-lg p-4 border ${config.bgColor} ${config.borderColor}`}>
          <div className="text-xs text-gray-400 mb-1">Variance</div>
          <div className={`text-lg font-bold ${config.color} flex items-center gap-1`}>
            {variance >= 0 ? (
              <TrendingDown size={16} />
            ) : (
              <TrendingUp size={16} />
            )}
            {formatCurrency(Math.abs(variance))}
          </div>
          <div className={`text-xs mt-1 ${config.color}`}>
            {variancePercent >= 0 ? '-' : '+'}{Math.abs(variancePercent).toFixed(1)}%
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="px-6 pb-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Budget Usage</span>
            <span className="text-white font-medium">
              {formatCurrency(totalSpent)} / {formatCurrency(budget)}
            </span>
          </div>
          
          <div className="relative h-3 bg-[#2C2C2E] rounded-full overflow-hidden">
            {/* RAB Actual (Blue) */}
            <div 
              className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${Math.min((rabActual / budget) * 100, 100)}%` }}
            />
            {/* Additional Costs (Purple) - stacked on top */}
            <div 
              className="absolute top-0 h-full bg-purple-500 transition-all duration-300"
              style={{ 
                left: `${Math.min((rabActual / budget) * 100, 100)}%`,
                width: `${Math.min((additional / budget) * 100, 100 - ((rabActual / budget) * 100))}%` 
              }}
            />
            {/* Over budget indicator (Red) */}
            {progressPercent > 100 && (
              <div 
                className="absolute top-0 right-0 h-full bg-red-500 animate-pulse"
                style={{ width: `${Math.min(progressPercent - 100, 20)}%` }}
              />
            )}
          </div>
          
          {/* Progress Details */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-gray-400">RAB</span>
                <span className="text-white font-medium">{formatCurrency(rabActual)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-gray-400">Additional</span>
                <span className="text-white font-medium">{formatCurrency(additional)}</span>
              </div>
            </div>
            <span className={`font-medium ${config.color}`}>
              {progressPercent.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* RAB Variance Alert (if different from total variance) */}
      {rabVariance !== variance && rabSummary?.items_count > 0 && (
        <div className="px-6 pb-6">
          <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <div className="text-yellow-400 font-medium mb-1">RAB Variance</div>
              <div className="text-gray-300">
                RAB items {rabVariance >= 0 ? 'under' : 'over'} budget by{' '}
                <span className="font-semibold text-white">{formatCurrency(Math.abs(rabVariance))}</span>
                {' '}({Math.abs((rabVariance / rabPlanned) * 100).toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Item Status Summary (if RAB items exist) */}
      {rabSummary && rabSummary.items_count > 0 && (
        <div className="px-6 pb-6 border-t border-[#2C2C2E] pt-4">
          <div className="text-xs text-gray-400 mb-3">RAB Items Status</div>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{rabSummary.completed_count || 0}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{rabSummary.in_progress_count || 0}</div>
              <div className="text-xs text-gray-500">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-400">{rabSummary.not_started_count || 0}</div>
              <div className="text-xs text-gray-500">Not Started</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-400">{rabSummary.over_budget_count || 0}</div>
              <div className="text-xs text-gray-500">Over Budget</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedBudgetSummary;
