import React, { useState } from 'react';
import { 
  Package, 
  Wrench, 
  Truck, 
  Users,
  Plus,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Edit2,
  Eye
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../utils/formatters';

/**
 * RABItemsTable Component
 * 
 * Professional table view for RAB items with planned vs actual costs
 * Following construction accounting best practices
 */
const RABItemsTable = ({ 
  rabItems, 
  onAddRealization,
  getRealizations,
  expenseAccounts = [],
  sourceAccounts = [],
  onSubmitRealization
}) => {
  const [expandedItems, setExpandedItems] = useState({});
  const [realizations, setRealizations] = useState({});
  const [showInlineForm, setShowInlineForm] = useState(null); // null or rabItemId
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    accountId: '',
    sourceAccountId: '',
    progress: 0
  });

  // Item type icons
  const itemTypeIcons = {
    material: Package,
    service: Wrench,
    equipment: Truck,
    subcontractor: Users
  };

  // Status configuration
  const getStatusBadge = (status) => {
    const configs = {
      not_started: { icon: Clock, label: 'Not Started', color: 'text-gray-400', bg: 'bg-gray-400/10' },
      in_progress: { icon: Clock, label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-400/10' },
      completed: { icon: CheckCircle, label: 'Completed', color: 'text-green-400', bg: 'bg-green-400/10' },
      over_budget: { icon: AlertCircle, label: 'Over Budget', color: 'text-red-400', bg: 'bg-red-400/10' }
    };
    return configs[status] || configs.not_started;
  };

  // Toggle expand/collapse for specific RAB item
  const toggleExpand = async (rabItemId) => {
    const isCurrentlyExpanded = expandedItems[rabItemId];

    // If expanding and realizations not loaded yet, fetch them
    if (!isCurrentlyExpanded && !realizations[rabItemId]) {
      try {
        const data = await getRealizations(rabItemId);
        setRealizations(prev => ({ ...prev, [rabItemId]: data || [] }));
      } catch (error) {
        console.error('[RABItemsTable] Error loading realizations:', error);
        setRealizations(prev => ({ ...prev, [rabItemId]: [] }));
      }
    }

    // Toggle expanded state
    setExpandedItems(prev => ({ 
      ...prev, 
      [rabItemId]: !prev[rabItemId] 
    }));
  };

  // Handle inline form toggle
  const handleToggleForm = (item) => {
    if (showInlineForm === item.id) {
      setShowInlineForm(null);
    } else {
      setShowInlineForm(item.id);
      setFormData({
        amount: '',
        description: `Realisasi: ${item.description}`,
        accountId: '',
        sourceAccountId: '',
        progress: item.actual_amount > 0 ? 0 : 100
      });
    }
  };

  // Handle inline form submit
  const handleInlineSubmit = async (e, rabItemId) => {
    e.preventDefault();
    try {
      await onSubmitRealization(rabItemId, formData);
      // Reset form
      setFormData({
        amount: '',
        description: '',
        accountId: '',
        sourceAccountId: '',
        progress: 0
      });
      setShowInlineForm(null);
      
      // Reload realizations for this item
      const data = await getRealizations(rabItemId);
      setRealizations(prev => ({ ...prev, [rabItemId]: data || [] }));
    } catch (error) {
      console.error('Failed to add realization:', error);
      alert(error.message || 'Failed to add realization');
    }
  };

  // Calculate totals
  const totals = {
    planned: rabItems.reduce((sum, item) => sum + parseFloat(item.planned_amount || 0), 0),
    actual: rabItems.reduce((sum, item) => sum + parseFloat(item.actual_amount || 0), 0),
  };
  totals.variance = totals.planned - totals.actual;
  totals.variancePercent = totals.planned > 0 ? (totals.variance / totals.planned) * 100 : 0;

  if (!rabItems || rabItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="bg-[#2C2C2E] rounded-lg border border-[#3C3C3E] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-[#1C1C1E] border-b border-[#3C3C3E]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Planned (RAB)
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Actual Cost
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Variance
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#3C3C3E]">
              {rabItems.map((item, index) => {
                const ItemIcon = itemTypeIcons[item.item_type] || Package;
                const statusConfig = getStatusBadge(item.realization_status);
                const StatusIcon = statusConfig.icon;
                const variance = item.variance;
                const variancePercent = item.planned_amount > 0 
                  ? ((variance / item.planned_amount) * 100) 
                  : 0;
                const isUnderBudget = variance > 0;
                const isOverBudget = variance < 0;
                const isExpanded = expandedItems[item.id];
                const itemRealizations = realizations[item.id] || [];

                return (
                  <React.Fragment key={item.id}>
                    {/* Main Row */}
                    <tr className="hover:bg-[#3C3C3E]/30 transition-colors">
                      {/* Item */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-400/10 border border-blue-400/30 flex items-center justify-center">
                            <ItemIcon size={14} className="text-blue-400" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-white truncate max-w-xs">
                              {item.description}
                            </div>
                            <div className="text-xs text-gray-500 capitalize mt-0.5">
                              {item.item_type}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="px-4 py-3 text-center">
                        <div className="text-sm text-white font-medium">
                          {parseFloat(item.quantity).toLocaleString('id-ID')}
                        </div>
                        <div className="text-xs text-gray-500">{item.unit}</div>
                      </td>

                      {/* Unit Price */}
                      <td className="px-4 py-3 text-right">
                        <div className="text-sm text-white">
                          {formatCurrency(item.unit_price)}
                        </div>
                      </td>

                      {/* Planned Amount */}
                      <td className="px-4 py-3 text-right">
                        <div className="text-sm font-semibold text-white">
                          {formatCurrency(item.planned_amount)}
                        </div>
                      </td>

                      {/* Actual Cost */}
                      <td className="px-4 py-3 text-right">
                        <div className={`text-sm font-semibold ${
                          item.actual_amount > 0 ? 'text-blue-400' : 'text-gray-500'
                        }`}>
                          {item.actual_amount > 0 ? formatCurrency(item.actual_amount) : '-'}
                        </div>
                        {item.realization_count > 0 && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            {item.realization_count} {item.realization_count === 1 ? 'entry' : 'entries'}
                          </div>
                        )}
                      </td>

                      {/* Variance */}
                      <td className="px-4 py-3 text-right">
                        {item.actual_amount > 0 ? (
                          <div>
                            <div className={`text-sm font-semibold flex items-center justify-end gap-1 ${
                              isUnderBudget ? 'text-green-400' : isOverBudget ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              {isUnderBudget && <TrendingDown size={14} />}
                              {isOverBudget && <TrendingUp size={14} />}
                              <span>{formatCurrency(Math.abs(variance))}</span>
                            </div>
                            <div className={`text-xs mt-0.5 ${
                              isUnderBudget ? 'text-green-400' : isOverBudget ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              {isUnderBudget ? '-' : '+'}{Math.abs(variancePercent).toFixed(1)}%
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">-</div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border border-current border-opacity-30`}>
                          <StatusIcon size={12} />
                          <span>{statusConfig.label}</span>
                        </div>
                      </td>

                      {/* Progress */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="text-xs font-medium text-white">
                            {item.progress_percentage.toFixed(0)}%
                          </div>
                          <div className="w-full max-w-[80px] h-2 bg-[#1C1C1E] rounded-full overflow-hidden">
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
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleToggleForm(item)}
                            className="p-1.5 hover:bg-blue-500/20 rounded text-blue-400 transition-colors"
                            title="Add Realization"
                          >
                            <Plus size={16} />
                          </button>
                          {item.realization_count > 0 && (
                            <button
                              onClick={() => toggleExpand(item.id)}
                              className="p-1.5 hover:bg-gray-500/20 rounded text-gray-400 transition-colors"
                              title="View Realizations"
                            >
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Inline Add Form */}
                    {showInlineForm === item.id && (
                      <tr>
                        <td colSpan="9" className="px-4 py-3 bg-[#1C1C1E]">
                          <div className="max-w-4xl mx-auto">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
                                Add Realization for: {item.description}
                              </div>
                            </div>

                            <form onSubmit={(e) => handleInlineSubmit(e, item.id)} className="grid grid-cols-6 gap-3">
                              {/* Amount */}
                              <div className="col-span-2">
                                <label className="block text-xs text-gray-400 mb-1">
                                  Amount <span className="text-red-400">*</span>
                                </label>
                                <input
                                  type="number"
                                  required
                                  step="0.01"
                                  value={formData.amount}
                                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                  className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#3C3C3E] rounded text-sm text-white focus:border-blue-500 focus:outline-none"
                                  placeholder="0.00"
                                />
                              </div>

                              {/* Expense Account */}
                              <div className="col-span-2">
                                <label className="block text-xs text-gray-400 mb-1">
                                  Expense Account <span className="text-red-400">*</span>
                                </label>
                                <select
                                  required
                                  value={formData.accountId}
                                  onChange={(e) => setFormData(prev => ({ ...prev, accountId: e.target.value }))}
                                  className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#3C3C3E] rounded text-sm text-white focus:border-blue-500 focus:outline-none"
                                >
                                  <option value="">Select...</option>
                                  {expenseAccounts.map(account => (
                                    <option key={account.id} value={account.id}>
                                      {account.accountCode} - {account.accountName}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Source Account */}
                              <div className="col-span-2">
                                <label className="block text-xs text-gray-400 mb-1">
                                  Source (Bank/Cash) <span className="text-red-400">*</span>
                                </label>
                                <select
                                  required
                                  value={formData.sourceAccountId}
                                  onChange={(e) => setFormData(prev => ({ ...prev, sourceAccountId: e.target.value }))}
                                  className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#3C3C3E] rounded text-sm text-white focus:border-blue-500 focus:outline-none"
                                >
                                  <option value="">Select...</option>
                                  {sourceAccounts.map(account => {
                                    const isCashAccount = account.accountName?.toLowerCase().includes('kas');
                                    const isKasTunai = account.accountName?.toLowerCase().includes('kas tunai') || account.accountCode === '1101.07';
                                    const displayLabel = isKasTunai 
                                      ? `${account.accountCode} - ${account.accountName} (Unlimited - Modal Owner)`
                                      : isCashAccount
                                        ? `${account.accountCode} - ${account.accountName}`
                                        : `${account.accountCode} - ${account.accountName} (Saldo: ${formatCurrency(account.currentBalance || 0)})`;
                                    
                                    return (
                                      <option key={account.id} value={account.id}>
                                        {displayLabel}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>

                              {/* Description */}
                              <div className="col-span-4">
                                <label className="block text-xs text-gray-400 mb-1">Description</label>
                                <input
                                  type="text"
                                  value={formData.description}
                                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                  className="w-full px-3 py-2 bg-[#2C2C2E] border border-[#3C3C3E] rounded text-sm text-white focus:border-blue-500 focus:outline-none"
                                  placeholder="Optional note..."
                                />
                              </div>

                              {/* Progress */}
                              <div className="col-span-1">
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

                              {/* Actions */}
                              <div className="col-span-1 flex items-end gap-2">
                                <button
                                  type="submit"
                                  className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded transition-colors"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowInlineForm(null)}
                                  className="px-3 py-2 bg-[#3C3C3E] hover:bg-[#4C4C4E] text-gray-300 text-sm font-medium rounded transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Expanded: Realizations List */}
                    {isExpanded && (
                      <tr>
                        <td colSpan="9" className="px-4 py-3 bg-[#1C1C1E]">
                          <div className="max-w-6xl mx-auto">
                            <div className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                              Realizations for: {item.description} ({item.realization_count})
                            </div>

                            {itemRealizations.length > 0 ? (
                              <div className="space-y-2">
                                {itemRealizations.map((real, idx) => (
                                  <div 
                                    key={real.id || idx}
                                    className="bg-[#2C2C2E] rounded-lg p-3 border border-[#3C3C3E] flex items-center justify-between"
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3">
                                        <div className="text-sm font-semibold text-blue-400">
                                          {formatCurrency(real.amount)}
                                        </div>
                                        {real.description && (
                                          <div className="text-sm text-gray-300">
                                            {real.description}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                        {real.recorded_at && (
                                          <span>{formatDate(real.recorded_at)}</span>
                                        )}
                                        {real.expense_account_name && (
                                          <>
                                            <span>•</span>
                                            <span className="text-blue-400">{real.expense_account_name}</span>
                                          </>
                                        )}
                                        {real.source_account_name && (
                                          <>
                                            <span>•</span>
                                            <span className="text-purple-400">{real.source_account_name}</span>
                                          </>
                                        )}
                                        {real.recorder_name && (
                                          <>
                                            <span>•</span>
                                            <span className="text-gray-400">by {real.recorder_name}</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    {real.rab_item_progress > 0 && (
                                      <div className="px-3 py-1 bg-blue-400/10 border border-blue-400/30 rounded text-xs text-blue-400 font-medium">
                                        {real.rab_item_progress}%
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-gray-500 text-sm">
                                No realizations found
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>

            {/* Table Footer - Totals */}
            <tfoot className="bg-[#1C1C1E] border-t-2 border-blue-500/30">
              <tr>
                <td colSpan="3" className="px-4 py-3 text-left text-sm font-bold text-white uppercase">
                  Total
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-white">
                  {formatCurrency(totals.planned)}
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-blue-400">
                  {formatCurrency(totals.actual)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div>
                    <div className={`text-sm font-bold flex items-center justify-end gap-1 ${
                      totals.variance > 0 ? 'text-green-400' : totals.variance < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {totals.variance > 0 && <TrendingDown size={14} />}
                      {totals.variance < 0 && <TrendingUp size={14} />}
                      <span>{formatCurrency(Math.abs(totals.variance))}</span>
                    </div>
                    <div className={`text-xs mt-0.5 ${
                      totals.variance > 0 ? 'text-green-400' : totals.variance < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {totals.variance > 0 ? '-' : '+'}{Math.abs(totals.variancePercent).toFixed(1)}%
                    </div>
                  </div>
                </td>
                <td colSpan="3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Info Footer */}
      <div className="bg-blue-400/5 border border-blue-400/20 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <AlertCircle size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-300">
            <span className="font-medium text-blue-400">RAB Tracking:</span> Klik tombol <Plus className="inline w-3 h-3" /> untuk record actual cost per item RAB. 
            Setiap realisasi akan tersimpan di tabel ini dan <span className="font-semibold text-blue-400">TIDAK akan muncul di section "Additional Costs"</span>. 
            Variance otomatis dihitung sebagai selisih antara RAB (planned) dan Actual Cost. 
            Variance positif (hijau) = hemat, negatif (merah) = over budget.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RABItemsTable;
