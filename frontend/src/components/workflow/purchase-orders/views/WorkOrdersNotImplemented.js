import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';

/**
 * WorkOrdersNotImplemented
 * Placeholder component for the work orders tab that isn't implemented yet
 * Shows information about work orders and a coming soon message
 */
const WorkOrdersNotImplemented = ({ onBack }) => {
  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center text-[#0A84FF] mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Kembali
      </button>
      
      <div className="bg-[#1C1C1E] border border-[#38383A] rounded-lg p-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-[#AF52DE]/20 p-4 rounded-full">
            <FileText className="h-12 w-12 text-[#AF52DE]" />
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-white mb-2">Sistem Perintah Kerja</h2>
        <p className="text-[#8E8E93] mb-6 max-w-lg mx-auto">
          Modul ini akan memungkinkan Anda untuk membuat dan mengelola perintah kerja untuk jasa, tenaga kerja,
          dan sewa peralatan dari item RAB yang telah disetujui.
        </p>
        
        <div className="bg-[#0A84FF]/10 p-4 rounded-lg inline-block">
          <p className="text-[#0A84FF] font-semibold">Fitur ini akan segera tersedia</p>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
          <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Jasa Subkontraktor</h3>
            <p className="text-[#8E8E93] text-sm">
              Buat perintah kerja untuk jasa subkontraktor dengan milestone pembayaran
            </p>
          </div>
          
          <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Tenaga Kerja</h3>
            <p className="text-[#8E8E93] text-sm">
              Kelola tenaga kerja dengan timesheet dan jadwal pembayaran
            </p>
          </div>
          
          <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Sewa Peralatan</h3>
            <p className="text-[#8E8E93] text-sm">
              Kelola sewa peralatan dengan periode waktu dan pencatatan penggunaan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkOrdersNotImplemented;