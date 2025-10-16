import React from 'react';
import { formatCurrency } from '../utils/poUtils';

/**
 * Purchase Order Summary Section Component
 */
const POSummarySection = ({ selectedItems, totalAmount }) => {
  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Ringkasan PO</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Total Item:</span>
          <span className="font-medium">{selectedItems.length} item</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total Nilai:</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
};

export default POSummarySection;