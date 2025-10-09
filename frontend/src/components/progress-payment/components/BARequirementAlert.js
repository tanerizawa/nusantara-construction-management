import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Alert component untuk menginformasikan requirement BA
 */
const BARequirementAlert = ({ hasApprovedBA }) => {
  if (hasApprovedBA) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-amber-800">Berita Acara Diperlukan</h4>
          <p className="text-sm text-amber-700 mt-1">
            Untuk membuat Progress Payment, diperlukan Berita Acara yang sudah disetujui. 
            Silakan buat dan setujui Berita Acara terlebih dahulu di tab "Berita Acara".
          </p>
        </div>
      </div>
    </div>
  );
};

export default BARequirementAlert;
