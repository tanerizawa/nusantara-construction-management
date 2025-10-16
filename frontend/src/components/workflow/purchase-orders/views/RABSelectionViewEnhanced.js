import React, { useMemo, useState, useEffect } from 'react';
import { Package, CheckCircle, DollarSign, Box, CheckSquare, Square, FileText } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';

/**
 * RAB Selection View with Item Type Filtering
 * Allows users to select approved RAB items for creating Purchase Orders or Work Orders
 */
const RABSelectionView = ({ 
  rabItems, 
  selectedRABItems, 
  setSelectedRABItems, 
  onNext, 
  loading,
  projectId,
  mode = 'po' // 'po' for Purchase Orders, 'wo' for Work Orders
}) => {
  const [itemType, setItemType] = useState(mode === 'po' ? 'material' : 'service');
  
  // Helper function to determine item type based on multiple properties
  const determineItemType = (item) => {
    // If itemType is explicitly set, use it
    if (item.itemType) return item.itemType;
    
    // Check kategori/category field for clues
    const category = (item.kategori || item.category || '').toLowerCase();
    
    // Common words indicating service items
    const serviceKeywords = ['jasa', 'service', 'pekerjaan', 'persiapan', 'instalasi', 'pasang'];
    const laborKeywords = ['tenaga', 'labor', 'pekerja', 'tukang'];
    const equipmentKeywords = ['alat', 'equipment', 'sewa'];
    const materialKeywords = ['material', 'bahan', 'besi', 'kayu', 'beton', 'cat'];
    
    // Check category
    if (serviceKeywords.some(keyword => category.includes(keyword))) return 'service';
    if (laborKeywords.some(keyword => category.includes(keyword))) return 'labor';
    if (equipmentKeywords.some(keyword => category.includes(keyword))) return 'equipment';
    if (materialKeywords.some(keyword => category.includes(keyword))) return 'material';
    
    // Check item name
    const name = (item.name || item.item_name || item.description || '').toLowerCase();
    
    if (serviceKeywords.some(keyword => name.includes(keyword))) return 'service';
    if (laborKeywords.some(keyword => name.includes(keyword))) return 'labor';
    if (equipmentKeywords.some(keyword => name.includes(keyword))) return 'equipment';
    if (materialKeywords.some(keyword => name.includes(keyword))) return 'material';
    
    // Default: if it has unit 'ls' (lump sum) or includes 'jasa'/'pekerjaan', it's likely a service
    if ((item.unit || '').toLowerCase() === 'ls' || name.includes('jasa') || name.includes('pekerjaan')) {
      return 'service';
    }
    
    // Default fallback - assume material
    return 'material';
  };

  // Filter items based on type and approval status
  const filteredItems = useMemo(() => {
    return rabItems.filter(item => {
      const isApproved = (item.isApproved || item.is_approved);
      const hasQuantity = (item.availableQuantity || item.available_quantity || 0) > 0;
      const detectedType = determineItemType(item);
      
      if (mode === 'po') {
        // For Purchase Orders: Only show materials or items with PO ID
        return isApproved && hasQuantity && (
          detectedType === 'material' || 
          (item.poId || item.po_id) // Items already linked to PO
        );
      } else {
        // For Work Orders: Show service, labor, equipment
        return isApproved && hasQuantity && ['service', 'labor', 'equipment'].includes(detectedType);
      }
    });
  }, [rabItems, mode]);

  // Reset selection when filtered items change
  useEffect(() => {
    setSelectedRABItems([]);
  }, [mode, setSelectedRABItems]);
  
  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalItems = filteredItems.length;
    const selectedCount = selectedRABItems.length;
    const totalValue = filteredItems.reduce((sum, item) => {
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
  }, [filteredItems, selectedRABItems]);

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
    if (selectedRABItems.length === filteredItems.length) {
      setSelectedRABItems([]);
    } else {
      setSelectedRABItems([...filteredItems]);
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

  if (filteredItems.length === 0) {
    const emptyMessage = mode === 'po' 
      ? "Tidak ada material RAB yang tersedia untuk Purchase Order" 
      : "Tidak ada jasa/tenaga kerja yang tersedia untuk Perintah Kerja";
    
    const emptyDetailMessage = mode === 'po' 
      ? "Pastikan RAB material sudah disetujui dan memiliki quantity tersedia" 
      : "Pastikan RAB jasa sudah disetujui dan memiliki quantity tersedia";

    return (
      <div className="text-center py-12 bg-[#1C1C1E] border border-[#38383A] rounded-lg">
        {mode === 'po' ? (
          <Package className="h-12 w-12 text-[#636366] mx-auto mb-4" />
        ) : (
          <FileText className="h-12 w-12 text-[#636366] mx-auto mb-4" />
        )}
        <p className="text-[#8E8E93]">{emptyMessage}</p>
        <p className="text-[#636366] text-sm mt-2">{emptyDetailMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toggle between PO and Work Order */}
      {/* Mode toggle would go here if both modes were implemented */}

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
              <p className="text-sm text-[#8E8E93]">
                {mode === 'po' ? 'Total Material' : 'Total Item Jasa'}
              </p>
              <p className="text-2xl font-bold text-white">{summaryStats.totalItems}</p>
              <p className="text-xs text-[#636366] mt-1">Item tersedia</p>
            </div>
            <div 
              style={{
                backgroundColor: 'rgba(10, 132, 255, 0.2)'
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center"
            >
              {mode === 'po' ? (
                <Package className="w-6 h-6 text-[#0A84FF]" />
              ) : (
                <FileText className="w-6 h-6 text-[#0A84FF]" />
              )}
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

        {/* Other summary cards... */}
        
        {/* Action Bar */}
        <div className="col-span-full flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {mode === 'po' ? 'Pilih Material untuk Purchase Order' : 'Pilih Jasa untuk Perintah Kerja'}
            </h3>
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
              {selectedRABItems.length === filteredItems.length && filteredItems.length > 0 ? (
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
                {mode === 'po' ? (
                  <>
                    <Package className="h-4 w-4 mr-2" />
                    Lanjut ke Form PO
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Lanjut ke Form Perintah Kerja
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table with items */}
      <div 
        style={{
          backgroundColor: '#1C1C1E',
          border: '1px solid #38383A'
        }}
        className="rounded-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead style={{ backgroundColor: '#2C2C2E' }}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider border-b border-[#38383A]" style={{ width: '50px' }}>
                  <input
                    type="checkbox"
                    checked={selectedRABItems.length === filteredItems.length && filteredItems.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-[#0A84FF] bg-[#2C2C2E] border-[#38383A] rounded focus:ring-[#0A84FF] focus:ring-2"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider border-b border-[#38383A]">
                  {mode === 'po' ? 'Nama Material' : 'Nama Jasa/Tenaga'}
                </th>
                {/* Other table headers... */}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr
                  key={item.id}
                  className={`${index % 2 === 0 ? 'bg-[#2C2C2E]' : 'bg-[#1C1C1E]'} 
                             ${isItemSelected(item) ? 'bg-[#0A84FF]/10 hover:bg-[#0A84FF]/20' : 'hover:bg-[#3A3A3C]'}`}
                  onClick={() => toggleItemSelection(item)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={isItemSelected(item)}
                      onChange={() => toggleItemSelection(item)}
                      onClick={e => e.stopPropagation()}
                      className="w-4 h-4 text-[#0A84FF] bg-[#2C2C2E] border-[#38383A] rounded focus:ring-[#0A84FF] focus:ring-2"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-white">{item.description}</p>
                      <p className="text-xs text-[#8E8E93]">{item.code || ''}</p>
                    </div>
                  </td>
                  {/* Other table cells... */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RABSelectionView;