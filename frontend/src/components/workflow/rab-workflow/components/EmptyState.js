import React from 'react';
import { Calculator, List, Upload, Download } from 'lucide-react';

/**
 * EmptyState Component
 * Displays when no RAB items exist with enhanced CTA
 */
const EmptyState = ({ onAddClick }) => {
  return (
    <div className="text-center py-16">
      <div className="mb-6">
        <Calculator className="h-16 w-16 text-[#636366] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Belum Ada Item RAB</h3>
        <p className="text-[#8E8E93] mb-6 max-w-md mx-auto">
          Mulai kelola RAB project Anda dengan input massal yang efisien atau import dari Excel
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onAddClick}
          className="flex items-center bg-[#30D158] text-white px-6 py-3 rounded-lg hover:bg-[#30D158]/90 transition-colors font-medium"
        >
          <List className="h-5 w-5 mr-2" />
          Mulai Kelola RAB
        </button>
        
        <div className="flex items-center space-x-2 text-sm text-[#8E8E93]">
          <Upload className="h-4 w-4" />
          <span>Import Excel</span>
          <span>•</span>
          <Download className="h-4 w-4" />
          <span>Template</span>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm">
        <div className="bg-[#1C1C1E] rounded-lg p-4 border border-[#38383A]">
          <div className="text-[#0A84FF] font-semibold mb-1">Input Massal</div>
          <div className="text-[#8E8E93]">Input ratusan item sekaligus dalam tabel</div>
        </div>
        <div className="bg-[#1C1C1E] rounded-lg p-4 border border-[#38383A]">
          <div className="text-[#FF9F0A] font-semibold mb-1">Import Excel</div>
          <div className="text-[#8E8E93]">Upload file Excel/CSV untuk import otomatis</div>
        </div>
        <div className="bg-[#1C1C1E] rounded-lg p-4 border border-[#38383A]">
          <div className="text-[#30D158] font-semibold mb-1">Auto Workflow</div>
          <div className="text-[#8E8E93]">Material→PO, Jasa→Perintah Kerja</div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
