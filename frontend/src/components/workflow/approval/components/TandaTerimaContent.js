import React, { useState } from 'react';
import { Search, Plus, AlertCircle } from 'lucide-react';
import useTandaTerima from '../../../tanda-terima/tanda-terima-manager/hooks/useTandaTerima';
import useAvailablePOs from '../../../tanda-terima/tanda-terima-manager/hooks/useAvailablePOs';
import { STATUS_FILTER_OPTIONS } from '../../../tanda-terima/tanda-terima-manager/config/statusConfig';
import { filterReceipts } from '../../../tanda-terima/tanda-terima-manager/utils/calculations';
import ReceiptsTable from '../../../tanda-terima/tanda-terima-manager/components/ReceiptsTable';
import EmptyState from '../../../tanda-terima/tanda-terima-manager/components/EmptyState';
import CreateTandaTerimaForm from '../../../tanda-terima/tanda-terima-manager/components/CreateTandaTerimaForm';

/**
 * TandaTerimaContent
 * Content only component for Tanda Terima in Approval Dashboard
 * Does NOT include its own header, tabs, or stats - only the content area
 */
const TandaTerimaContent = ({ projectId, project, onDataChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { receipts, loading, fetchReceipts } = useTandaTerima(projectId, onDataChange);
  const { availablePOs } = useAvailablePOs(projectId);

  // Filter receipts
  const filteredReceiptsList = filterReceipts(receipts, searchTerm, statusFilter);

  const handleFormSuccess = () => {
    fetchReceipts();
    if (onDataChange) onDataChange();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A84FF]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* API Not Ready Notice */}
      {receipts.length === 0 && availablePOs.length === 0 && (
        <div className="bg-[#FF9F0A]/10 border border-[#FF9F0A]/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-[#FF9F0A] mt-0.5" />
            <div className="text-[#FF9F0A] text-sm">
              <p className="font-semibold mb-1">Endpoint Tanda Terima Belum Tersedia</p>
              <p className="text-xs">
                Backend API untuk tanda terima sedang dalam pengembangan. 
                Fitur ini akan menampilkan data dari Purchase Orders yang sudah approved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#636366]" />
          <input
            type="text"
            placeholder="Cari nomor tanda terima, PO, atau supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              backgroundColor: '#1C1C1E !important', 
              color: 'white !important',
              border: '1px solid #38383A',
              borderRadius: '0.5rem',
              padding: '0.5rem 1rem',
              paddingLeft: '2.5rem'
            }}
            className="w-full placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ 
            backgroundColor: '#1C1C1E !important', 
            color: 'white !important',
            border: '1px solid #38383A',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem'
          }}
          className="focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF]"
        >
          {STATUS_FILTER_OPTIONS.map(option => (
            <option key={option.value} value={option.value} style={{ backgroundColor: '#1C1C1E', color: 'white' }}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Create Form - Inline & Collapsible */}
      <CreateTandaTerimaForm
        availablePOs={availablePOs}
        projectId={projectId}
        onSuccess={handleFormSuccess}
      />

      {/* Receipts List */}
      <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] overflow-hidden">
        {filteredReceiptsList.length === 0 ? (
          <EmptyState 
            availablePOs={availablePOs} 
            onCreateClick={() => {
              // Scroll to form and expand it if needed
              const formElement = document.querySelector('[data-create-form]');
              if (formElement) {
                formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                formElement.querySelector('button').click();
              }
            }} 
          />
        ) : (
          <ReceiptsTable
            receipts={filteredReceiptsList}
            onView={(receipt) => console.log('View receipt:', receipt)}
          />
        )}
      </div>
    </div>
  );
};

export default TandaTerimaContent;
