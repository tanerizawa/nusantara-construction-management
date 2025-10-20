import React, { useState } from 'react';
import { FileText, AlertCircle } from 'lucide-react';
import RABItemCard from './RABItemCard';

/**
 * RABItemsSection Component
 * 
 * Displays list of RAB items with expandable realizations and inline forms.
 * Manages expand/collapse state and loads realizations on demand.
 */
const RABItemsSection = ({ 
  rabItems, 
  onAddRealization, 
  getRealizations,
  expenseAccounts = [],
  sourceAccounts = [],
  onSubmitRealization
}) => {
  const [expandedItems, setExpandedItems] = useState({});
  const [realizations, setRealizations] = useState({});

  /**
   * Toggle expand/collapse for specific RAB item
   * Loads realizations if not already loaded
   */
  const toggleExpand = async (rabItemId) => {
    const isCurrentlyExpanded = expandedItems[rabItemId];

    // If expanding and realizations not loaded yet, fetch them
    if (!isCurrentlyExpanded && !realizations[rabItemId]) {
      try {
        const data = await getRealizations(rabItemId);
        setRealizations(prev => ({ ...prev, [rabItemId]: data || [] }));
      } catch (error) {
        console.error('[RABItemsSection] Error loading realizations:', error);
        setRealizations(prev => ({ ...prev, [rabItemId]: [] }));
      }
    }

    // Toggle expanded state
    setExpandedItems(prev => ({ 
      ...prev, 
      [rabItemId]: !prev[rabItemId] 
    }));
  };

  // If no RAB items, show empty state
  if (!rabItems || rabItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <FileText size={18} className="text-blue-400" />
          RAB Items (Biaya Rencana)
          <span className="ml-1 px-2 py-0.5 bg-blue-400/10 border border-blue-400/30 rounded-full text-xs text-blue-400 font-medium">
            {rabItems.length}
          </span>
        </h3>
      </div>

      {/* Items Grid */}
      <div className="space-y-3">
        {rabItems.map((item) => (
          <RABItemCard
            key={item.id}
            item={item}
            realizations={realizations[item.id] || []}
            isExpanded={!!expandedItems[item.id]}
            onToggleExpand={() => toggleExpand(item.id)}
            onAddRealization={onAddRealization}
            expenseAccounts={expenseAccounts}
            sourceAccounts={sourceAccounts}
            onSubmitRealization={onSubmitRealization}
          />
        ))}
      </div>

      {/* Summary Info */}
      <div className="bg-blue-400/5 border border-blue-400/20 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-300">
            <span className="font-medium text-blue-400">RAB Integration:</span> These items are from your approved RAB (Rencana Anggaran Biaya). 
            Click "Add Realization" to record actual costs against each item. 
            For costs outside the RAB (kasbon, overhead), add them in the Additional Costs section below.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RABItemsSection;
