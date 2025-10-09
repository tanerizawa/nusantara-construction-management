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
          <p className="mt-4 text-[#8E8E93]">Memuat data RAB...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with selection count */}
      <div 
        style={{
          backgroundColor: '#0A84FF',
          opacity: 0.1,
          border: '1px solid rgba(10, 132, 255, 0.3)'
        }}
        className="rounded-lg p-4 relative"
      >
        <div 
          style={{ backgroundColor: 'transparent', opacity: 1 }}
          className="absolute inset-0 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="h-5 w-5 text-[#0A84FF] mr-2" />
              <span className="text-sm font-medium text-[#0A84FF]">
                {selectedRABItems.length} item dipilih dari {approvedItems.length} item tersedia
              </span>
            </div>
            {selectedRABItems.length > 0 && (
              <button
                onClick={onNext}
                style={{ backgroundColor: '#0A84FF' }}
                className="flex items-center px-4 py-2 text-white rounded-lg hover:bg-[#0A84FF]/90 transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Buat Purchase Order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RAB Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {approvedItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Package className="h-12 w-12 text-[#636366] mx-auto mb-4" />
            <p className="text-[#8E8E93]">Tidak ada item RAB yang disetujui</p>
          </div>
        ) : (
          approvedItems.map((item) => {
            const isSelected = selectedRABItems.some(selected => selected.id === item.id);
            const remainingQty = (parseFloat(item.quantity) || 0) - (parseFloat(item.totalPurchased) || 0);
            const hasAvailableQty = remainingQty > 0;

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: isSelected ? 'rgba(10, 132, 255, 0.1)' : '#1C1C1E',
                  border: isSelected 
                    ? '1px solid #0A84FF' 
                    : hasAvailableQty
                    ? '1px solid #38383A'
                    : '1px solid #38383A',
                  opacity: hasAvailableQty ? 1 : 0.6,
                  cursor: hasAvailableQty ? 'pointer' : 'not-allowed'
                }}
                className="rounded-lg p-4 transition-all hover:border-[#0A84FF]"
                onClick={() => hasAvailableQty && toggleRABSelection(item)}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="flex justify-end mb-2">
                    <div 
                      style={{ backgroundColor: '#0A84FF' }}
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                )}

                {/* Item Info */}
                <h4 className="font-medium text-white mb-2 line-clamp-2">{item.description}</h4>
                <p className="text-sm text-[#8E8E93] mb-1">
                  <span className="text-[#98989D]">Kategori:</span> {item.category}
                </p>
                <p className="text-sm text-[#8E8E93] mb-2">
                  <span className="text-[#98989D]">Harga:</span> {formatCurrency(item.unitPrice || item.unit_price)}/{item.unit}
                </p>
                
                {/* Quantity Info */}
                <div className="mt-3 pt-3 border-t border-[#38383A]">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8E8E93]">Tersedia:</span>
                    <span className={`font-medium ${hasAvailableQty ? 'text-[#30D158]' : 'text-[#FF3B30]'}`}>
                      {remainingQty.toFixed(2)} {item.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-[#8E8E93]">Total RAB:</span>
                    <span className="font-medium text-white">{parseFloat(item.quantity).toFixed(2)} {item.unit}</span>
                  </div>
                </div>

                {/* Status indicator */}
                {!hasAvailableQty && (
                  <div className="mt-2 text-xs text-[#FF3B30] font-medium">
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
