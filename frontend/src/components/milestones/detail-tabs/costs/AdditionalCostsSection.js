import React from 'react';
import { PlusCircle, Edit, Trash2, DollarSign, FileText } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../utils/formatters';

/**
 * AdditionalCostsSection Component
 * 
 * Displays costs that are NOT linked to RAB items.
 * These are additional costs like kasbon, overhead, unforeseen expenses, etc.
 */
const AdditionalCostsSection = ({ costs, onEdit, onDelete, onAddNew }) => {
  // Filter only non-RAB costs
  const additionalCosts = costs.filter(cost => !cost.rabItemId && !cost.rab_item_id);

  // Cost category colors
  const categoryColors = {
    materials: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    labor: 'text-green-400 bg-green-400/10 border-green-400/30',
    equipment: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
    subcontractor: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
    indirect: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    overhead: 'text-pink-400 bg-pink-400/10 border-pink-400/30',
    other: 'text-gray-400 bg-gray-400/10 border-gray-400/30'
  };

  // Cost type badges
  const typeColors = {
    actual: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    planned: 'text-gray-400 bg-gray-400/10 border-gray-400/30',
    change_order: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
    unforeseen: 'text-red-400 bg-red-400/10 border-red-400/30'
  };

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <DollarSign size={18} className="text-purple-400" />
          Additional Costs (Diluar RAB)
          {additionalCosts.length > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-purple-400/10 border border-purple-400/30 rounded-full text-xs text-purple-400 font-medium">
              {additionalCosts.length}
            </span>
          )}
        </h3>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <PlusCircle size={16} />
          Add Cost
        </button>
      </div>

      {/* Costs List */}
      {additionalCosts.length > 0 ? (
        <div className="space-y-2">
          {additionalCosts.map((cost) => (
            <div 
              key={cost.id}
              className="bg-[#2C2C2E] rounded-lg border border-[#3C3C3E] p-4 hover:border-[#4C4C4E] transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left: Cost Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {/* Category Badge */}
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${categoryColors[cost.costCategory] || categoryColors.other}`}>
                      {cost.costCategory?.replace('_', ' ') || 'Other'}
                    </span>

                    {/* Type Badge */}
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${typeColors[cost.costType] || typeColors.actual}`}>
                      {cost.costType?.replace('_', ' ') || 'Actual'}
                    </span>

                    {/* Reference Number */}
                    {cost.referenceNumber && (
                      <span className="px-2 py-1 bg-[#3C3C3E] text-gray-400 rounded-md text-xs font-medium flex items-center gap-1">
                        <FileText size={12} />
                        {cost.referenceNumber}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {cost.description && (
                    <div className="text-sm text-gray-300 mb-2 line-clamp-2">
                      {cost.description}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span>{formatDate(cost.recordedAt || cost.recorded_at)}</span>
                    
                    {cost.recorderName && (
                      <>
                        <span>•</span>
                        <span className="text-gray-400">{cost.recorderName}</span>
                      </>
                    )}

                    {cost.expenseAccountName && (
                      <>
                        <span>•</span>
                        <span className="text-blue-400">{cost.expenseAccountName}</span>
                      </>
                    )}

                    {cost.sourceAccountName && (
                      <>
                        <span>•</span>
                        <span className="text-purple-400">{cost.sourceAccountName}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex-shrink-0 text-right space-y-2">
                  <div className="text-lg font-bold text-white">
                    {formatCurrency(cost.amount)}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(cost)}
                      className="p-1.5 bg-[#3C3C3E] hover:bg-[#4C4C4E] text-blue-400 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(cost.id)}
                      className="p-1.5 bg-[#3C3C3E] hover:bg-red-500/20 text-red-400 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#2C2C2E] rounded-lg border border-[#3C3C3E] p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-400/10 border border-purple-400/30 flex items-center justify-center">
              <DollarSign size={24} className="text-purple-400" />
            </div>
            <div>
              <div className="text-white font-medium mb-1">No Additional Costs</div>
              <div className="text-sm text-gray-400">
                Add costs for kasbon, overhead, or other expenses outside the RAB
              </div>
            </div>
            <button
              onClick={onAddNew}
              className="mt-2 flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <PlusCircle size={16} />
              Add First Cost
            </button>
          </div>
        </div>
      )}

      {/* Info Box */}
      {additionalCosts.length > 0 && (
        <div className="bg-purple-400/5 border border-purple-400/20 rounded-lg p-4">
          <div className="text-xs text-gray-300">
            <span className="font-medium text-purple-400">Additional Costs:</span> These costs are not linked to RAB items. 
            They include kasbon, overhead, unforeseen expenses, or other costs that were not part of the original budget plan.
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalCostsSection;
