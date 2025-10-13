import React from 'react';
import { FileText } from 'lucide-react';
import BACard from './BACard';

/**
 * Komponen untuk menampilkan daftar Berita Acara
 * Dark theme version
 */
const BAList = ({ 
  baList, 
  onView, 
  onEdit, 
  onSubmit, 
  onDelete,
  onApprove,
  onReject,
  onCreateBA 
}) => {
  if (baList.length === 0) {
    return (
      <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A]">
        <div className="px-6 py-4 border-b border-[#38383A]">
          <h4 className="text-lg font-medium text-white">Daftar Berita Acara</h4>
        </div>
        <div className="px-6 py-12 text-center">
          <FileText size={48} className="text-[#48484A] mx-auto mb-4" />
          <p className="text-[#8E8E93] mb-4">Belum ada Berita Acara yang dibuat</p>
          <button
            onClick={onCreateBA}
            className="bg-[#0A84FF] text-white px-4 py-2 rounded-lg hover:bg-[#0A84FF]/90 transition-colors"
          >
            Buat BA Pertama
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A]">
      <div className="px-6 py-4 border-b border-[#38383A]">
        <h4 className="text-lg font-medium text-white">Daftar Berita Acara</h4>
      </div>
      <div className="divide-y divide-[#38383A]">
        {baList.map((ba) => (
          <BACard
            key={ba.id}
            ba={ba}
            onView={onView}
            onEdit={onEdit}
            onSubmit={onSubmit}
            onDelete={onDelete}
            onApprove={onApprove}
            onReject={onReject}
          />
        ))}
      </div>
    </div>
  );
};

export default BAList;
