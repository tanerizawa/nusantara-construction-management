import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * AvailablePOsAlert Component
 * Shows alert when there are POs ready for receipt creation
 */
const AvailablePOsAlert = ({ availablePOs, onCreateClick }) => {
  const readyCount = availablePOs.filter(po => po.canCreateReceipt).length;
  
  if (readyCount === 0) return null;

  return (
    <div className="bg-[#0A84FF]/10 border border-[#0A84FF]/30 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-[#0A84FF] mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[#0A84FF]">
            PO Siap untuk Tanda Terima
          </h3>
          <p className="text-sm text-[#0A84FF] mt-1">
            Ada {readyCount} Purchase Order yang sudah approved 
            dan siap untuk dibuat tanda terimanya.
          </p>
          <button
            onClick={onCreateClick}
            className="text-sm text-[#0A84FF] hover:text-[#0A84FF]/80 font-medium mt-2"
          >
            Buat Tanda Terima →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailablePOsAlert;
