import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Package, CheckCircle, Clock, DollarSign, Box, CheckSquare, Square, FileText, Briefcase, HardHat, Truck } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';

/**
 * Helper function to determine item type based on multiple properties
 * Uses the existing item_type field from database first
 */
const determineItemType = (item) => {
  // Priority 1: Use existing item_type or itemType field from database
  const explicitType = item.item_type || item.itemType || item.type;
  if (explicitType) {
    console.log(`🎯 [detectType] Using explicit type from DB: "${explicitType}" for item: "${item.name || item.item_name}"`);
    return explicitType;
  }
  
  console.warn(`⚠️ [detectType] No item_type found for: "${item.name || item.item_name}", using fallback detection`);
  
  // Fallback: Keyword-based detection (should rarely be used)
  const serviceKeywords = ['jasa', 'service', 'instalasi', 'pasang'];
  const laborKeywords = ['upah', 'tenaga', 'labor', 'pekerja', 'tukang'];
  const equipmentKeywords = ['alat', 'equipment', 'sewa'];
  const materialKeywords = ['material', 'bahan', 'besi', 'kayu', 'beton', 'cat', 'pasir', 'semen', 'bata', 'keramik', 'pipa', 'kabel'];
  
  const name = (item.name || item.item_name || item.description || '').toLowerCase();
  
  if (materialKeywords.some(keyword => name.includes(keyword))) return 'material';
  if (serviceKeywords.some(keyword => name.includes(keyword))) return 'service';
  if (laborKeywords.some(keyword => name.includes(keyword))) return 'labor';
  if (equipmentKeywords.some(keyword => name.includes(keyword))) return 'equipment';
  
  // Default fallback
  console.log(`🎯 [detectType] Default fallback to material for: "${name}"`);
  return 'material';
};

/**
 * RAB Selection View - Table Format with Dashboard and Category Tabs
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
  const [activeTab, setActiveTab] = useState(() => {
    // For WO mode, set to 'all-wo' to show all work order items together
    return mode === 'wo' ? 'all-wo' : 'material';
  });
  
  // Force material tab for PO mode, force all-wo for WO mode
  useEffect(() => {
    if (mode === 'po' && activeTab !== 'material') {
      console.log('🔒 [RABSelection] Forcing material tab for PO mode');
      setActiveTab('material');
    } else if (mode === 'wo' && activeTab !== 'all-wo') {
      console.log('🔒 [RABSelection] Forcing all-wo tab for WO mode');
      setActiveTab('all-wo');
    }
  }, [mode, activeTab]);
  
  // Categorize all approved items
  const categorizedItems = useMemo(() => {
    console.log('🔍 [RABSelection] Starting categorization...');
    console.log('🔍 [RABSelection] Total rabItems:', rabItems.length);
    
    const materials = [];
    const services = [];
    const labor = [];
    const equipment = [];
    
    rabItems.forEach((item, index) => {
      const isApproved = (item.isApproved || item.is_approved);
      const hasQuantity = (item.availableQuantity || item.available_quantity || 0) > 0;
      
      console.log(`🔍 [Item ${index}]`, {
        name: item.name || item.item_name || item.description,
        category: item.kategori || item.category,
        item_type: item.item_type || item.itemType || item.type || 'NOT SET',
        isApproved,
        hasQuantity,
        qty: item.availableQuantity || item.available_quantity,
        // Show all properties to see what's available
        allProps: Object.keys(item)
      });
      
      if (!isApproved || !hasQuantity) {
        console.log(`❌ [Item ${index}] Skipped - Not approved or no quantity`);
        return;
      }
      
      const itemType = determineItemType(item);
      console.log(`✅ [Item ${index}] Final detected type:`, itemType);
      
      if (itemType === 'material') {
        materials.push({...item, detectedType: itemType});
      } else if (itemType === 'service') {
        services.push({...item, detectedType: itemType});
      } else if (itemType === 'labor') {
        labor.push({...item, detectedType: itemType});
      } else if (itemType === 'equipment') {
        equipment.push({...item, detectedType: itemType});
      }
    });
    
    console.log('📊 [RABSelection] Categorization result:', {
      materials: materials.length,
      services: services.length,
      labor: labor.length,
      equipment: equipment.length
    });
    
    return { materials, services, labor, equipment };
  }, [rabItems]);
  
  // Get items to display based on active tab
  const displayedItems = useMemo(() => {
    console.log('🎨 [displayedItems] Active tab:', activeTab);
    console.log('🎨 [displayedItems] Mode:', mode);
    
    // For Work Order mode, show all non-material items together
    if (activeTab === 'all-wo') {
      const allWOItems = [...categorizedItems.services, ...categorizedItems.labor, ...categorizedItems.equipment];
      console.log('🎨 [displayedItems] Showing all WO items:', allWOItems.length);
      return allWOItems;
    }
    
    // For PO mode or specific tab selection
    if (activeTab === 'material') {
      console.log('🎨 [displayedItems] Showing materials:', categorizedItems.materials.length);
      return categorizedItems.materials;
    } else if (activeTab === 'service') {
      console.log('🎨 [displayedItems] Showing services:', categorizedItems.services.length);
      return categorizedItems.services;
    } else if (activeTab === 'labor') {
      console.log('🎨 [displayedItems] Showing labor:', categorizedItems.labor.length);
      return categorizedItems.labor;
    } else if (activeTab === 'equipment') {
      console.log('🎨 [displayedItems] Showing equipment:', categorizedItems.equipment.length);
      return categorizedItems.equipment;
    }
    
    // Default fallback
    return categorizedItems.materials;
  }, [categorizedItems, activeTab, mode]);
  
  // Filter only approved items with available quantity (backward compatible)
  const approvedItems = useMemo(() => {
    console.log('📋 [RABSelection] Computing approvedItems...');
    console.log('📋 [RABSelection] Mode:', mode);
    
    let items;
    if (mode === 'po') {
      items = categorizedItems.materials;
      console.log('📋 [RABSelection] PO Mode - Materials:', items.length);
    } else {
      // For WO mode, return all non-material items
      items = [...categorizedItems.services, ...categorizedItems.labor, ...categorizedItems.equipment];
      console.log('📋 [RABSelection] WO Mode - Non-materials:', items.length);
    }
    
    // FALLBACK: If categorization resulted in no items, use all approved items as before
    if (items.length === 0) {
      console.warn('⚠️ [RABSelection] FALLBACK: No categorized items, using all approved items');
      items = rabItems.filter(item => 
        (item.isApproved || item.is_approved) && 
        (item.availableQuantity || item.available_quantity || 0) > 0
      );
      console.log('📋 [RABSelection] Fallback items:', items.length);
    }
    
    return items;
  }, [categorizedItems, mode, rabItems]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalMaterials = categorizedItems.materials.length;
    const totalServices = categorizedItems.services.length;
    const totalLabor = categorizedItems.labor.length;
    const totalEquipment = categorizedItems.equipment.length;
    
    const totalItems = mode === 'po' ? totalMaterials : (totalServices + totalLabor + totalEquipment);
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

    return { 
      totalItems, 
      selectedCount, 
      totalValue, 
      selectedValue,
      totalMaterials,
      totalServices,
      totalLabor,
      totalEquipment
    };
  }, [categorizedItems, approvedItems, selectedRABItems, mode]);

  // Toggle item selection
  const toggleItemSelection = (item) => {
    const isSelected = selectedRABItems.some(selected => selected.id === item.id);
    
    if (isSelected) {
      setSelectedRABItems(selectedRABItems.filter(selected => selected.id !== item.id));
    } else {
      setSelectedRABItems([...selectedRABItems, item]);
    }
  };

  // Select all visible items
  const handleSelectAll = () => {
    if (selectedRABItems.length === displayedItems.length) {
      // Deselect only items currently displayed
      const displayedIds = new Set(displayedItems.map(item => item.id));
      setSelectedRABItems(selectedRABItems.filter(item => !displayedIds.has(item.id)));
    } else {
      // Add all displayed items, avoiding duplicates
      const currentIds = new Set(selectedRABItems.map(item => item.id));
      const newItems = displayedItems.filter(item => !currentIds.has(item.id));
      setSelectedRABItems([...selectedRABItems, ...newItems]);
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
    const emptyMessage = mode === 'po' 
      ? "Tidak ada material RAB yang tersedia untuk Purchase Order" 
      : "Tidak ada jasa/tenaga kerja yang tersedia untuk Work Order";
      
    return (
      <div className="text-center py-12 bg-[#1C1C1E] border border-[#38383A] rounded-lg">
        {mode === 'po' ? (
          <Package className="h-12 w-12 text-[#636366] mx-auto mb-4" />
        ) : (
          <Briefcase className="h-12 w-12 text-[#636366] mx-auto mb-4" />
        )}
        <p className="text-[#8E8E93]">{emptyMessage}</p>
        <p className="text-[#636366] text-sm mt-2">Pastikan RAB sudah disetujui dan memiliki quantity tersedia</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info banner untuk mode */}
      {mode === 'po' && (
        <div 
          style={{
            backgroundColor: 'rgba(10, 132, 255, 0.1)',
            border: '1px solid rgba(10, 132, 255, 0.3)'
          }}
          className="rounded-lg p-4"
        >
          <div className="flex items-center">
            <Package className="h-5 w-5 text-[#0A84FF] mr-2" />
            <p className="text-[#0A84FF] text-sm font-medium">
              Mode Purchase Order: Menampilkan item MATERIAL saja. Untuk jasa, tenaga kerja, dan peralatan, gunakan Work Order.
            </p>
          </div>
        </div>
      )}
      
      {mode === 'wo' && (
        <div 
          style={{
            backgroundColor: 'rgba(175, 82, 222, 0.1)',
            border: '1px solid rgba(175, 82, 222, 0.3)'
          }}
          className="rounded-lg p-4"
        >
          <div className="flex items-center">
            <Briefcase className="h-5 w-5 text-[#AF52DE] mr-2" />
            <p className="text-[#AF52DE] text-sm font-medium">
              Mode Work Order: Menampilkan semua item Jasa, Tenaga Kerja, dan Peralatan dalam satu tabel.
            </p>
          </div>
        </div>
      )}
      
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
                {mode === 'wo' ? 'Total Work Order Items' : 
                 activeTab === 'material' ? 'Total Material' :
                 activeTab === 'service' ? 'Total Jasa' :
                 activeTab === 'labor' ? 'Total Tenaga Kerja' :
                 activeTab === 'equipment' ? 'Total Peralatan' : 'Total Items'}
              </p>
              <p className="text-2xl font-bold text-white">{displayedItems.length}</p>
              <p className="text-xs text-[#636366] mt-1">Item tersedia</p>
            </div>
            <div 
              style={{
                backgroundColor: mode === 'wo' ? 'rgba(175, 82, 222, 0.2)' : 'rgba(10, 132, 255, 0.2)'
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center"
            >
              {mode === 'wo' ? (
                <Briefcase className="w-6 h-6 text-[#AF52DE]" />
              ) : (
                <>
                  {activeTab === 'material' && <Package className="w-6 h-6 text-[#0A84FF]" />}
                  {activeTab === 'service' && <FileText className="w-6 h-6 text-[#AF52DE]" />}
                  {activeTab === 'labor' && <HardHat className="w-6 h-6 text-[#30D158]" />}
                  {activeTab === 'equipment' && <Truck className="w-6 h-6 text-[#FF9F0A]" />}
                </>
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
              <p className="text-xs text-[#636366] mt-1">
                {mode === 'wo' ? 'Semua item WO' : 'Semua material'}
              </p>
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
                backgroundColor: mode === 'wo' ? '#AF52DE' : '#0A84FF',
                border: mode === 'wo' ? '1px solid #AF52DE' : '1px solid #0A84FF'
              }}
              className={`flex items-center px-6 py-2 text-white rounded-lg transition-colors shadow-lg ${
                mode === 'wo' 
                  ? 'hover:bg-[#AF52DE]/90 shadow-[#AF52DE]/20' 
                  : 'hover:bg-[#0A84FF]/90 shadow-[#0A84FF]/20'
              }`}
            >
              {mode === 'wo' ? (
                <>
                  <Briefcase className="h-4 w-4 mr-2" />
                  Lanjut ke Form WO
                </>
              ) : (
                <>
                  <Package className="h-4 w-4 mr-2" />
                  Lanjut ke Form PO
                </>
              )}
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
                {mode === 'wo' ? 'Nama Pekerjaan' : 'Nama Material'}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider border-b border-[#38383A]">
                Item Type
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
            {displayedItems.length > 0 ? (
              displayedItems.map((item) => {
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
                    {(() => {
                      const itemType = item.item_type || item.itemType || item.detectedType || 'material';
                      const typeColors = {
                        'material': { bg: 'bg-[#0A84FF]/20', text: 'text-[#0A84FF]', label: '📦 Material' },
                        'service': { bg: 'bg-[#AF52DE]/20', text: 'text-[#AF52DE]', label: '🔨 Jasa' },
                        'labor': { bg: 'bg-[#30D158]/20', text: 'text-[#30D158]', label: '👷 Tenaga Kerja' },
                        'equipment': { bg: 'bg-[#FF9F0A]/20', text: 'text-[#FF9F0A]', label: '🚛 Peralatan' },
                        'overhead': { bg: 'bg-gray-500/20', text: 'text-gray-400', label: '⚙️ Overhead' }
                      };
                      const typeConfig = typeColors[itemType] || typeColors['material'];
                      
                      return (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeConfig.bg} ${typeConfig.text}`}>
                          {typeConfig.label}
                        </span>
                      );
                    })()}
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
            })
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    {activeTab === 'material' && <Package className="h-12 w-12 text-[#636366] mb-4" />}
                    {activeTab === 'service' && <FileText className="h-12 w-12 text-[#636366] mb-4" />}
                    {activeTab === 'labor' && <HardHat className="h-12 w-12 text-[#636366] mb-4" />}
                    {activeTab === 'equipment' && <Truck className="h-12 w-12 text-[#636366] mb-4" />}
                    <p className="text-[#8E8E93]">
                      {activeTab === 'material' && 'Tidak ada material yang tersedia'}
                      {activeTab === 'service' && 'Tidak ada jasa yang tersedia'}
                      {activeTab === 'labor' && 'Tidak ada tenaga kerja yang tersedia'}
                      {activeTab === 'equipment' && 'Tidak ada peralatan yang tersedia'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
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
