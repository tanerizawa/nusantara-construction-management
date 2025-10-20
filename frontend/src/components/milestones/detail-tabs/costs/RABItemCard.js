import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Wrench, 
  Truck, 
  Users,
  Plus,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../utils/formatters';

/**
 * RABItemCard Component
 * 
 * Displays individual RAB item with:
 * - Item details (description, quantity, unit, price)
 * - Planned vs Actual amounts
 * - Progress bar and variance
 * - Expandable realizations list
 * - Inline add realization form
 */
const RABItemCard = ({ 
  item, 
  realizations, 
  isExpanded, 
  onToggleExpand, 
  onAddRealization,
  expenseAccounts = [],
  sourceAccounts = [],
  onSubmitRealization
}) => {
  const [loadingRealizations, setLoadingRealizations] = useState(false);
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: `Realisasi: ${item.description}`,
    accountId: '',
    sourceAccountId: '',
    progress: 0
  });

  // Debug: Log accounts on component mount and when they change
  React.useEffect(() => {
    console.log('[RABItemCard] 🔍 Accounts received:', {
      expenseAccountsCount: expenseAccounts?.length || 0,
      expenseAccounts: expenseAccounts,
      sourceAccountsCount: sourceAccounts?.length || 0,
      sourceAccounts: sourceAccounts,
      itemId: item.id,
      itemDescription: item.description
    });
  }, [expenseAccounts, sourceAccounts, item.id]);

  // Item type icons
  const itemTypeIcons = {
    material: Package,
    service: Wrench,
    equipment: Truck,
    subcontractor: Users
  };

  const ItemIcon = itemTypeIcons[item.item_type] || Package;

  // Status configuration
  const statusConfig = {
    not_started: {
      color: 'text-gray-400',
      bgColor: 'bg-gray-400/10',
      borderColor: 'border-gray-400/30',
      icon: Clock,
      label: 'Not Started'
    },
    in_progress: {
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/30',
      icon: Clock,
      label: 'In Progress'
    },
    completed: {
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/30',
      icon: CheckCircle,
      label: 'Completed'
    },
    over_budget: {
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      borderColor: 'border-red-400/30',
      icon: AlertCircle,
      label: 'Over Budget'
    }
  };

  const status = statusConfig[item.realization_status] || statusConfig.not_started;
  const StatusIcon = status.icon;

  // Variance calculation
  const variance = item.variance;
  const variancePercent = item.planned_amount > 0 
    ? ((variance / item.planned_amount) * 100) 
    : 0;

  const isUnderBudget = variance > 0;
  const isOverBudget = variance < 0;

  // Handle expand with loading state
  const handleToggleExpand = async () => {
    if (!isExpanded && realizations.length === 0 && item.realization_count > 0) {
      setLoadingRealizations(true);
    }
    await onToggleExpand();
    setLoadingRealizations(false);
  };

  // Handle inline form submit
  const handleInlineSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmitRealization(item.id, formData);
      // Reset form
      setFormData({
        amount: '',
        description: `Realisasi: ${item.description}`,
        accountId: '',
        sourceAccountId: '',
        progress: 0
      });
      setShowInlineForm(false);
    } catch (error) {
      console.error('Failed to add realization:', error);
      alert(error.message || 'Failed to add realization');
    }
  };

  // Toggle inline form
  const handleToggleForm = () => {
    setShowInlineForm(!showInlineForm);
    if (!showInlineForm) {
      // Reset form when opening
      setFormData({
        amount: item.planned_amount.toString(),
        description: `Realisasi: ${item.description}`,
        accountId: '',
        sourceAccountId: '',
        progress: item.actual_amount > 0 ? 0 : 100
      });
    }
  };

  return (
    <div className="bg-[#2C2C2E] rounded-lg border border-[#3C3C3E] overflow-hidden hover:border-[#4C4C4E] transition-colors">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Left: Item Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-400/10 border border-blue-400/30 flex items-center justify-center">
                <ItemIcon size={16} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white truncate">{item.description}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400 capitalize">{item.item_type}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-400">
                    {parseFloat(item.quantity).toLocaleString('id-ID')} {item.unit}
                  </span>
                  <span className="text-xs text-gray-500">@</span>
                  <span className="text-xs text-gray-400">{formatCurrency(item.unit_price)}</span>
                </div>
              </div>
            </div>

            {/* Amounts Row */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Planned</div>
                <div className="text-sm font-semibold text-white">{formatCurrency(item.planned_amount)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Actual</div>
                <div className="text-sm font-semibold text-blue-400">{formatCurrency(item.actual_amount)}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Progress</span>
                <span className="text-white font-medium">{item.progress_percentage.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-[#1C1C1E] rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    item.realization_status === 'completed' ? 'bg-green-500' :
                    item.realization_status === 'over_budget' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(item.progress_percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Status & Variance */}
          <div className="flex-shrink-0 text-right space-y-2">
            {/* Status Badge */}
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.borderColor} ${status.color} border`}>
              <StatusIcon size={12} />
              <span>{status.label}</span>
            </div>

            {/* Variance */}
            {item.actual_amount > 0 && (
              <div className={`text-sm font-semibold ${isUnderBudget ? 'text-green-400' : isOverBudget ? 'text-red-400' : 'text-gray-400'}`}>
                <div className="flex items-center justify-end gap-1">
                  {isUnderBudget && <TrendingDown size={14} />}
                  {isOverBudget && <TrendingUp size={14} />}
                  <span>{isUnderBudget ? '-' : isOverBudget ? '+' : ''}{formatCurrency(Math.abs(variance))}</span>
                </div>
                <div className="text-xs mt-0.5">
                  {isUnderBudget ? '-' : isOverBudget ? '+' : ''}{Math.abs(variancePercent).toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleToggleForm}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            {showInlineForm ? 'Cancel' : 'Add Realization'}
          </button>

          {item.realization_count > 0 && (
            <button
              onClick={handleToggleExpand}
              className="px-3 py-2 bg-[#3C3C3E] hover:bg-[#4C4C4E] text-gray-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <span>{item.realization_count} {item.realization_count === 1 ? 'Entry' : 'Entries'}</span>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Inline Form */}
      {showInlineForm && (
        <div className="border-t border-[#3C3C3E] bg-[#1C1C1E] p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
              Add Realization for {item.description}
            </div>
          </div>

          <form onSubmit={handleInlineSubmit} className="space-y-3">
            {/* Amount */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Amount <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#3C3C3E] rounded text-sm text-white focus:border-blue-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#3C3C3E] rounded text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Expense Account */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Expense Account <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={formData.accountId}
                onChange={(e) => setFormData(prev => ({ ...prev, accountId: e.target.value }))}
                className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#3C3C3E] rounded text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select account...</option>
                {expenseAccounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.accountCode} - {account.accountName}
                  </option>
                ))}
              </select>
            </div>

            {/* Source Account */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Source Account (Bank/Cash) <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={formData.sourceAccountId}
                onChange={(e) => setFormData(prev => ({ ...prev, sourceAccountId: e.target.value }))}
                className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#3C3C3E] rounded text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select source...</option>
                {sourceAccounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.accountCode} - {account.accountName}
                    {account.currentBalance !== undefined && ` (${formatCurrency(account.currentBalance)})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Progress */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Progress (%) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                step="0.01"
                value={formData.progress}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  progress: Math.min(100, Math.max(0, parseFloat(e.target.value) || 0))
                }))}
                className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#3C3C3E] rounded text-sm text-white focus:border-blue-500 focus:outline-none"
                placeholder="0-100"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Save Realization
              </button>
              <button
                type="button"
                onClick={handleToggleForm}
                className="px-4 py-2 bg-[#3C3C3E] hover:bg-[#4C4C4E] text-gray-300 text-sm font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expanded: Realizations List */}
      {isExpanded && (
        <div className="border-t border-[#3C3C3E] bg-[#1C1C1E] p-4">
          <div className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
            Realizations ({item.realization_count})
          </div>

          {loadingRealizations ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : realizations.length > 0 ? (
            <div className="space-y-2">
              {realizations.map((realization, index) => (
                <div 
                  key={realization.id || index}
                  className="bg-[#2C2C2E] rounded-lg p-3 border border-[#3C3C3E]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white font-medium mb-1">
                        {formatCurrency(realization.amount)}
                      </div>
                      {realization.description && (
                        <div className="text-xs text-gray-400 mb-2 line-clamp-2">
                          {realization.description}
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        {realization.recorder_name && (
                          <>
                            <span className="text-gray-400">{realization.recorder_name}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>{formatDate(realization.recorded_at)}</span>
                        {realization.expense_account_name && (
                          <>
                            <span>•</span>
                            <span className="text-blue-400">{realization.expense_account_name}</span>
                          </>
                        )}
                        {realization.source_account_name && (
                          <>
                            <span>•</span>
                            <span className="text-purple-400">{realization.source_account_name}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Progress Badge */}
                    {realization.rab_item_progress > 0 && (
                      <div className="flex-shrink-0">
                        <div className="px-2 py-1 bg-blue-400/10 border border-blue-400/30 rounded text-xs text-blue-400 font-medium">
                          {realization.rab_item_progress}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 text-sm">
              No realizations yet
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RABItemCard;
