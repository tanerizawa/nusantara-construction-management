import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import useTandaTerima from './tanda-terima-manager/hooks/useTandaTerima';
import useAvailablePOs from './tanda-terima-manager/hooks/useAvailablePOs';
import useTTForm from './tanda-terima-manager/hooks/useTTForm';
import SummaryCards from './tanda-terima-manager/components/SummaryCards';
import AvailablePOsAlert from './tanda-terima-manager/components/AvailablePOsAlert';
import FiltersBar from './tanda-terima-manager/components/FiltersBar';
import ReceiptsTable from './tanda-terima-manager/components/ReceiptsTable';
import EmptyState from './tanda-terima-manager/components/EmptyState';
import CreateReceiptModal from './tanda-terima-manager/components/CreateReceiptModal';
import DetailModal from './tanda-terima-manager/components/DetailModal';
import { calculateSummary, filterReceipts } from './tanda-terima-manager/utils/calculations';

const TandaTerimaManager = ({ projectId, project, onReceiptChange }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Custom hooks
  const { receipts, loading, fetchReceipts, approveReceipt } = useTandaTerima(projectId, onReceiptChange);
  const { availablePOs, fetchAvailablePOs } = useAvailablePOs(projectId);

  const handleFormSuccess = () => {
    setShowCreateModal(false);
    fetchReceipts();
    fetchAvailablePOs();
    if (onReceiptChange) onReceiptChange();
  };

  const {
    formData,
    creating,
    handleInputChange,
    handleItemChange,
    handleSubmit,
    resetForm
  } = useTTForm(availablePOs, handleFormSuccess);

  const handleOpenCreateModal = () => {
    fetchAvailablePOs();
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  const handleFormSubmit = (e) => {
    handleSubmit(e, projectId);
  };

  // Filter and calculate
  const filteredReceiptsList = filterReceipts(receipts, searchTerm, statusFilter);
  const summary = calculateSummary(receipts);

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
      {receipts.length === 0 && availablePOs.length === 0 && !loading && (
        <div className="bg-[#FF9F0A]/10 border border-[#FF9F0A]/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-[#FF9F0A] text-sm">
              <p className="font-semibold mb-1">⚠️ Endpoint Tanda Terima Belum Tersedia</p>
              <p className="text-xs">
                Backend API untuk tanda terima sedang dalam pengembangan. 
                Fitur ini akan menampilkan data dari Purchase Orders yang sudah approved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">Tanda Terima</h2>
          <p className="text-sm text-[#8E8E93] mt-1">Manajemen tanda terima pengiriman untuk Purchase Orders</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-[#0A84FF] text-white px-4 py-2 rounded-lg hover:bg-[#0A84FF]/90 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Buat Tanda Terima
        </button>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={summary} />

      {/* Available POs Alert */}
      <AvailablePOsAlert 
        availablePOs={availablePOs} 
        onCreateClick={handleOpenCreateModal} 
      />

      {/* Filters */}
      <FiltersBar
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
      />

      {/* Receipts List */}
      <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] overflow-hidden">
        {filteredReceiptsList.length === 0 ? (
          <EmptyState 
            availablePOs={availablePOs} 
            onCreateClick={handleOpenCreateModal} 
          />
        ) : (
          <ReceiptsTable
            receipts={filteredReceiptsList}
            onView={setSelectedReceipt}
            onApprove={approveReceipt}
          />
        )}
      </div>

      {/* Modals */}
      <CreateReceiptModal
        show={showCreateModal}
        formData={formData}
        creating={creating}
        availablePOs={availablePOs}
        onClose={handleCloseCreateModal}
        onSubmit={handleFormSubmit}
        onInputChange={handleInputChange}
        onItemChange={handleItemChange}
      />

      <DetailModal
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        onApprove={approveReceipt}
      />
    </div>
  );
};

export default TandaTerimaManager;
