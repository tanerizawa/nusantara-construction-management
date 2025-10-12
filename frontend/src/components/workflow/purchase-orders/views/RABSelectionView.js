import React, { useMemo } from 'react';
import { Package, CheckCircle, Clock, DollarSign, Box, CheckSquare, Square } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';

/**
 * RAB Selection View - Table Format with Dashboard
 * Allows users to select approved RAB items for creating Purchase Orders
 */
const RABSelectionView = ({ 
  rabItems, 
  selectedRABItems, 
  setSelectedRABItems, 
  onNext, 
  loading,
  projectId 
}) => {
  // Filter only approved items with available quantity
  const approvedItems = useMemo(() => {
    return rabItems.filter(item => 
      (item.isApproved || item.is_approved) && 
      (item.availableQuantity || item.available_quantity || 0) > 0
    );
  }, [rabItems]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalItems = approvedItems.length;
    const selectedCount = selectedRABItems.length;
    const totalValue = approvedItems.reduce((sum, item) => {
      const qty = item.availableQuantity || item.available_quantity || 0;
      const price = item.unitPrice || item.unit_price || 0;
      return sum + (qty * price);
    }, 0);
    const selectedValue = selectedRABItems.reduce((sum, selectedItem) => {
      const qty = selectedItem.availableQuantity || selectedItem.available_quantity || 0;
      const price = selectedItem.unitPrice || selectedItem.unit_price || 0;
      return sum + (qty * price);
    }, 0);

    return { totalItems, selectedCount, totalValue, selectedValue };
  }, [approvedItems, selectedRABItems]);

  // Toggle item selection
  const toggleItemSelection = (item) => {
    const isSelected = selectedRABItems.some(selected => selected.id === item.id);
    
    if (isSelected) {
      setSelectedRABItems(selectedRABItems.filter(selected => selected.id !== item.id));
    } else {
      setSelectedRABItems([...selectedRABItems, item]);
    }
  };

  // Select all / Deselect all
  const handleSelectAll = () => {
    if (selectedRABItems.length === approvedItems.length) {
      setSelectedRABItems([]);
    } else {
      setSelectedRABItems([...approvedItems]);
    }
  };

  // Check if item is selected
  const isItemSelected = (item) => {
    return selectedRABItems.some(selected => selected.id === item.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A84FF] mx-auto"></div>
          <p className="mt-4 text-[#8E8E93]">Memuat data RAB...</p>
        </div>
      </div>
    );
  }

  if (approvedItems.length === 0) {
    return (
      <div className="text-center py-12 bg-[#1C1C1E] border border-[#38383A] rounded-lg">
        <Package className="h-12 w-12 text-[#636366] mx-auto mb-4" />
        <p className="text-[#8E8E93]">Tidak ada material RAB yang tersedia</p>
        <p className="text-[#636366] text-sm mt-2">Pastikan RAB sudah disetujui dan memiliki quantity tersedia</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Items */}
        <div 
          style={{
            backgroundColor: '#2C2C2E',
            border: '1px solid #38383A'
          }}
          className="rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8E8E93]">Total Material</p>
              <p className="text-2xl font-bold text-white">{summaryStats.totalItems}</p>
              <p className="text-xs text-[#636366] mt-1">Item tersedia</p>
            </div>
            <div 
              style={{
                backgroundColor: 'rgba(10, 132, 255, 0.2)'
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center"
            >
              <Box className="w-6 h-6 text-[#0A84FF]" />
            </div>
          </div>
        </div>

        {/* Selected Items */}
        <div 
          style={{
            backgroundColor: '#2C2C2E',
            border: '1px solid #38383A'
          }}
          className="rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8E8E93]">Dipilih</p>
              <p className="text-2xl font-bold text-[#30D158]">{summaryStats.selectedCount}</p>
              <p className="text-xs text-[#636366] mt-1">Item terpilih</p>
            </div>
            <div 
              style={{
                backgroundColor: 'rgba(48, 209, 88, 0.2)'
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-6 h-6 text-[#30D158]" />
            </div>
          </div>
        </div>

        {/* Total Value */}
        <div 
          style={{
            backgroundColor: '#2C2C2E',
            border: '1px solid #38383A'
          }}
          className="rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8E8E93]">Total Nilai</p>
              <p className="text-lg font-bold text-white" title={formatCurrency(summaryStats.totalValue)}>
                {formatCurrency(summaryStats.totalValue, true)}
              </p>
              <p className="text-xs text-[#636366] mt-1">Semua material</p>
            </div>
            <div 
              style={{
                backgroundColor: 'rgba(191, 90, 242, 0.2)'
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center"
            >
              <DollarSign className="w-6 h-6 text-[#BF5AF2]" />
            </div>
          </div>
        </div>

        {/* Selected Value */}
        <div 
          style={{
            backgroundColor: '#2C2C2E',
            border: '1px solid #38383A'
          }}
          className="rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8E8E93]">Nilai Terpilih</p>
              <p className="text-lg font-bold text-[#0A84FF]" title={formatCurrency(summaryStats.selectedValue)}>
                {formatCurrency(summaryStats.selectedValue, true)}
              </p>
              <p className="text-xs text-[#636366] mt-1">Material dipilih</p>
            </div>
            <div 
              style={{
                backgroundColor: 'rgba(10, 132, 255, 0.2)'
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center"
            >
              <Package className="w-6 h-6 text-[#0A84FF]" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Pilih Material untuk Purchase Order</h3>
          <p className="text-sm text-[#8E8E93]">
            {summaryStats.selectedCount} dari {summaryStats.totalItems} item dipilih
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleSelectAll}
            style={{
              backgroundColor: '#2C2C2E',
              border: '1px solid #38383A'
            }}
            className="flex items-center px-4 py-2 text-white rounded-lg hover:bg-[#3A3A3C] transition-colors"
          >
            {selectedRABItems.length === approvedItems.length ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Batalkan Semua
              </>
            ) : (
              <>
                <CheckSquare className="h-4 w-4 mr-2" />
                Pilih Semua
              </>
            )}
          </button>

          {selectedRABItems.length > 0 && (
            <button
              onClick={onNext}
              style={{
                backgroundColor: '#0A84FF',
                border: '1px solid #0A84FF'
              }}
              className="flex items-center px-6 py-2 text-white rounded-lg hover:bg-[#0A84FF]/90 transition-colors shadow-lg shadow-[#0A84FF]/20"
            >
              <Package className="h-4 w-4 mr-2" />
              Lanjut ke Form PO
            </button>
          )}
        </div>
      </div>

      {/* Table with Horizontal Scroll */}
      <div 
        style={{
          backgroundColor: '#1C1C1E',
          border: '1px solid #38383A'
        }}
        className="rounded-lg overflow-hidden"
      >
        <div 
          className="overflow-x-auto rab-table-scroll"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#38383A #1C1C1E'
          }}
        >
          <style>{`
            .rab-table-scroll::-webkit-scrollbar {
              height: 8px;
            }
            .rab-table-scroll::-webkit-scrollbar-track {
              background: #1C1C1E;
            }
            .rab-table-scroll::-webkit-scrollbar-thumb {
              background: #38383A;
              border-radius: 4px;
            }
            .rab-table-scroll::-webkit-scrollbar-thumb:hover {
              background: #48484A;
            }
          `}</style>
          <table className="min-w-full">
          <thead style={{ backgroundColor: '#2C2C2E' }}>
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider border-b border-[#38383A]" style={{ width: '50px' }}>
                <input
                  type="checkbox"
                  checked={selectedRABItems.length === approvedItems.length && approvedItems.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-[#0A84FF] bg-[#2C2C2E] border-[#38383A] rounded focus:ring-[#0A84FF] focus:ring-2"
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider border-b border-[#38383A]">
                Nama Material
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider border-b border-[#38383A]">
                Kategori
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-[#98989D] uppercase tracking-wider border-b border-[#38383A]">
                Satuan
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-[#98989D] uppercase tracking-wider border-b border-[#38383A]">
                Harga Satuan
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-[#98989D] uppercase tracking-wider border-b border-[#38383A]">
                Qty Tersedia
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-[#98989D] uppercase tracking-wider border-b border-[#38383A]">
                Total Nilai
              </th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: '#1C1C1E' }} className="divide-y divide-[#38383A]">
            {approvedItems.map((item) => {
              const isSelected = isItemSelected(item);
              const availableQty = item.availableQuantity || item.available_quantity || 0;
              const unitPrice = item.unitPrice || item.unit_price || 0;
              const totalValue = availableQty * unitPrice;
              
              return (
                <tr 
                  key={item.id}
                  onClick={() => toggleItemSelection(item)}
                  className="hover:bg-[#2C2C2E] transition-colors cursor-pointer"
                  style={{
                    backgroundColor: isSelected ? 'rgba(10, 132, 255, 0.1)' : 'transparent'
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleItemSelection(item)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 text-[#0A84FF] bg-[#2C2C2E] border-[#38383A] rounded focus:ring-[#0A84FF] focus:ring-2"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-[#0A84FF] flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {item.description || item.name || '-'}
                        </p>
                        {item.specifications && (
                          <p className="text-xs text-[#8E8E93] mt-1">{item.specifications}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-[#8E8E93]">
                      {item.category || item.pekerjaan || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#0A84FF]/20 text-[#0A84FF]">
                      {item.unit || item.satuan || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <span className="text-sm font-medium text-white">
                      {formatCurrency(unitPrice)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <span className="text-sm font-bold text-[#30D158]">
                      {Math.floor(availableQty)}
                    </span>
                    <span className="text-xs text-[#8E8E93] ml-1">
                      {item.unit || item.satuan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <span className="text-sm font-bold text-[#0A84FF]">
                      {formatCurrency(totalValue)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {/* Footer Info */}
      <div 
        style={{
          backgroundColor: 'rgba(10, 132, 255, 0.1)',
          border: '1px solid rgba(10, 132, 255, 0.3)'
        }}
        className="rounded-lg p-4"
      >
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-[#0A84FF] mr-2 flex-shrink-0" />
          <span className="text-sm text-[#0A84FF] font-medium">
            💡 Tip: Klik baris untuk memilih/membatalkan material. Pilih minimal 1 item untuk melanjutkan.
          </span>
        </div>
      </div>
    </div>
  );
};

export default RABSelectionView;
