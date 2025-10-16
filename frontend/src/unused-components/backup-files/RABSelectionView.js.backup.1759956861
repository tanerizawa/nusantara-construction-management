import React from 'react';
import { Plus, Package } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';

/**
 * RAB Selection View
 * Allows users to select RAB items for creating a Purchase Order
 * 
 * TODO: Extract from original ProjectPurchaseOrders.js lines 569-985
 */
const RABSelectionView = ({ 
  rabItems, 
  selectedRABItems, 
  setSelectedRABItems, 
  onNext, 
  loading,
  projectId 
}) => {
  // Toggle RAB item selection
  const toggleRABSelection = (item) => {
    const isSelected = selectedRABItems.some(selected => selected.id === item.id);
    
    if (isSelected) {
      setSelectedRABItems(selectedRABItems.filter(selected => selected.id !== item.id));
    } else {
      setSelectedRABItems([...selectedRABItems, item]);
    }
  };

  // Filter approved items only
  const approvedItems = rabItems.filter(item => item.isApproved || item.is_approved);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data RAB...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with selection count */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Package className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-900">
              {selectedRABItems.length} item dipilih dari {approvedItems.length} item tersedia
            </span>
          </div>
          {selectedRABItems.length > 0 && (
            <button
              onClick={onNext}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Buat Purchase Order
            </button>
          )}
        </div>
      </div>

      {/* RAB Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {approvedItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Tidak ada item RAB yang disetujui</p>
          </div>
        ) : (
          approvedItems.map((item) => {
            const isSelected = selectedRABItems.some(selected => selected.id === item.id);
            const remainingQty = (parseFloat(item.quantity) || 0) - (parseFloat(item.totalPurchased) || 0);
            const hasAvailableQty = remainingQty > 0;

            return (
              <div
                key={item.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : hasAvailableQty
                    ? 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                    : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                }`}
                onClick={() => hasAvailableQty && toggleRABSelection(item)}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="flex justify-end mb-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                )}

                {/* Item Info */}
                <h4 className="font-medium text-gray-900 mb-2">{item.description}</h4>
                <p className="text-sm text-gray-600 mb-1">Kategori: {item.category}</p>
                <p className="text-sm text-gray-600 mb-2">Harga: {formatCurrency(item.unitPrice || item.unit_price)}/{item.unit}</p>
                
                {/* Quantity Info */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tersedia:</span>
                    <span className={`font-medium ${hasAvailableQty ? 'text-green-600' : 'text-red-600'}`}>
                      {remainingQty.toFixed(2)} {item.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Total RAB:</span>
                    <span className="font-medium text-gray-900">{parseFloat(item.quantity).toFixed(2)} {item.unit}</span>
                  </div>
                </div>

                {/* Status indicator */}
                {!hasAvailableQty && (
                  <div className="mt-2 text-xs text-red-600 font-medium">
                    Stok habis
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RABSelectionView;
