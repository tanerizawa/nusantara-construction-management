import React from 'react';
import { Plus } from 'lucide-react';
import POSummaryCards from '../components/POSummaryCards';
import POStatusFilter from '../components/POStatusFilter';
import POList from '../components/POList';

/**
 * Purchase Order List View Component
 */
const PurchaseOrderListView = ({ 
  purchaseOrders,
  filter,
  setFilter,
  poSummary,
  filteredPOs,
  onShowProjectSelection,
  onViewPODetail
}) => {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Purchase Orders</h2>
          <p className="text-gray-600">Manajemen pengadaan untuk semua proyek</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onShowProjectSelection}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Buat PO Baru
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <POSummaryCards summary={poSummary} />

      {/* Filter Buttons */}
      <POStatusFilter filter={filter} setFilter={setFilter} />

      {/* Purchase Orders List */}
      <POList
        filteredPOs={filteredPOs}
        onShowProjectSelection={onShowProjectSelection}
        onViewPODetail={onViewPODetail}
      />
    </>
  );
};

export default PurchaseOrderListView;