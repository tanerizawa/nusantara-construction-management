import React from 'react';
import { Package } from 'lucide-react';

/**
 * EmptyState Component
 * Shows when no receipts exist
 */
const EmptyState = ({ availablePOs, onCreateClick }) => {
  const readyCount = availablePOs.filter(po => po.canCreateReceipt).length;

  return (
    <div className="p-12 text-center">
      <Package className="h-12 w-12 text-[#38383A] mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">Belum Ada Tanda Terima</h3>
      <p className="text-sm text-[#8E8E93] mb-6">
        {readyCount > 0
          ? `Ada ${readyCount} PO yang siap untuk dibuat tanda terimanya.`
          : 'Belum ada Purchase Order yang approved untuk project ini.'}
      </p>
      {readyCount > 0 && (
        <button
          onClick={onCreateClick}
          className="bg-[#0A84FF] text-white px-4 py-2 rounded-lg hover:bg-[#0A84FF]/90"
        >
          Buat Tanda Terima Pertama
        </button>
      )}
    </div>
  );
};

export default EmptyState;
