import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Package, CheckCircle, DollarSign, Box, CheckSquare, Square, FileText, Briefcase, HardHat, Truck } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';

/**
 * RAB Selection View with Tab-based Item Type Filtering
 * Separates material items and service items into different tabs
 */
const RABSelectionViewTabs = ({ 
  rabItems, 
  selectedRABItems, 
  setSelectedRABItems, 
  onNext, 
  loading,
  projectId,
  mode = 'po' // 'po' for Purchase Orders, 'wo' for Work Orders
}) => {
  const [activeTab, setActiveTab] = useState('material');
  
  // Helper function to determine item type based on multiple properties
  const determineItemType = useCallback((item) => {
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
  }, []);

  // Categorize all items
  const categorizedItems = useMemo(() => {
    const materials = [];
    const services = [];
    const labor = [];
    const equipment = [];
    
    rabItems.forEach(item => {
      const isApproved = (item.isApproved || item.is_approved);
      const hasQuantity = (item.availableQuantity || item.available_quantity || 0) > 0;
      
      if (!isApproved || !hasQuantity) return;
      
      const itemType = determineItemType(item);
      
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
    
    return { materials, services, labor, equipment };
  }, [rabItems, determineItemType]);
  
  // Filter items based on active tab and mode
  const displayedItems = useMemo(() => {
    if (mode === 'po') {
      // PO mode only shows materials
      return categorizedItems.materials;
    } else {
      // WO mode shows items based on active tab
      if (activeTab === 'service') {
        return categorizedItems.services;
      } else if (activeTab === 'labor') {
        return categorizedItems.labor;
      } else if (activeTab === 'equipment') {
        return categorizedItems.equipment;
      }
      
      // Default to services
      return categorizedItems.services;
    }
  }, [categorizedItems, activeTab, mode]);
  
  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalMaterials = categorizedItems.materials.length;
    const totalServices = categorizedItems.services.length;
    const totalLabor = categorizedItems.labor.length;
    const totalEquipment = categorizedItems.equipment.length;
    
    const totalItems = mode === 'po' ? totalMaterials : (totalServices + totalLabor + totalEquipment);
    const selectedCount = selectedRABItems.length;
    
    const selectedValue = selectedRABItems.reduce((sum, selectedItem) => {
      const qty = selectedItem.availableQuantity || selectedItem.available_quantity || 0;
      const price = selectedItem.unitPrice || selectedItem.unit_price || 0;
      return sum + (qty * price);
    }, 0);

    return { 
      totalItems,
      selectedCount, 
      selectedValue,
      totalMaterials,
      totalServices,
      totalLabor,
      totalEquipment
    };
  }, [categorizedItems, selectedRABItems, mode]);

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
  const selectAllVisible = () => {
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
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const areAllCurrentItemsSelected = useMemo(() => {
    if (displayedItems.length === 0) return false;
    return displayedItems.every(item => isItemSelected(item));
  }, [displayedItems, selectedRABItems]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Memuat data RAB...</p>
        </div>
      </div>
    );
  }
  
  // Get total items for current mode
  const modeItems = mode === 'po' 
    ? categorizedItems.materials 
    : [...categorizedItems.services, ...categorizedItems.labor, ...categorizedItems.equipment];
  
  if (modeItems.length === 0) {
    const emptyMessage = mode === 'po' 
      ? "Tidak ada material RAB yang tersedia untuk Purchase Order" 
      : "Tidak ada jasa/tenaga kerja yang tersedia untuk Work Order";
    
    return (
      <div className="text-center py-12 bg-gray-100 rounded-lg border border-gray-200">
        {mode === 'po' ? (
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        ) : (
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        )}
        <p className="text-gray-500">{emptyMessage}</p>
        <p className="text-gray-400 text-sm mt-2">
          Pastikan RAB sudah disetujui dan memiliki quantity tersedia
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Items */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {mode === 'po' ? 'Total Material' : 'Total Pekerjaan'}
              </p>
              <p className="text-2xl font-bold text-gray-800">{summaryStats.totalItems}</p>
              <p className="text-xs text-gray-400 mt-1">Item tersedia</p>
            </div>
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
              {mode === 'po' ? (
                <Package className="w-6 h-6 text-blue-500" />
              ) : (
                <Briefcase className="w-6 h-6 text-blue-500" />
              )}
            </div>
          </div>
        </div>

        {/* Selected Items */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Item Dipilih</p>
              <p className="text-2xl font-bold text-gray-800">{summaryStats.selectedCount}</p>
              <p className="text-xs text-gray-400 mt-1">dari {summaryStats.totalItems} item</p>
            </div>
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* Total Value */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Nilai Dipilih</p>
              <p className="text-xl font-bold text-gray-800">{formatCurrency(summaryStats.selectedValue)}</p>
              <p className="text-xs text-gray-400 mt-1">Total nilai item dipilih</p>
            </div>
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
        
        {/* Item Breakdown */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Kategori Item</p>
              <div className="flex flex-col gap-1 mt-2">
                {mode === 'po' ? (
                  <p className="text-xs"><span className="font-medium text-blue-500">●</span> Material: {summaryStats.totalMaterials}</p>
                ) : (
                  <>
                    <p className="text-xs"><span className="font-medium text-purple-500">●</span> Jasa: {summaryStats.totalServices}</p>
                    <p className="text-xs"><span className="font-medium text-green-500">●</span> Tenaga Kerja: {summaryStats.totalLabor}</p>
                    <p className="text-xs"><span className="font-medium text-yellow-500">●</span> Peralatan: {summaryStats.totalEquipment}</p>
                  </>
                )}
              </div>
            </div>
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center">
              <Box className="w-6 h-6 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation for Work Orders */}
      {mode === 'wo' && (
        <div className="border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => handleTabChange('service')}
              className={`py-3 px-4 font-medium text-sm flex items-center ${
                activeTab === 'service'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Jasa ({summaryStats.totalServices})
            </button>
            <button
              onClick={() => handleTabChange('labor')}
              className={`py-3 px-4 font-medium text-sm flex items-center ${
                activeTab === 'labor'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <HardHat className="h-4 w-4 mr-2" />
              Tenaga Kerja ({summaryStats.totalLabor})
            </button>
            <button
              onClick={() => handleTabChange('equipment')}
              className={`py-3 px-4 font-medium text-sm flex items-center ${
                activeTab === 'equipment'
                  ? 'text-yellow-600 border-b-2 border-yellow-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Truck className="h-4 w-4 mr-2" />
              Peralatan ({summaryStats.totalEquipment})
            </button>
          </div>
        </div>
      )}

      {/* Table Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <button
            onClick={selectAllVisible}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            {areAllCurrentItemsSelected ? (
              <CheckSquare className="h-5 w-5 text-blue-500 mr-2" />
            ) : (
              <Square className="h-5 w-5 text-gray-400 mr-2" />
            )}
            <span className="text-sm">
              {areAllCurrentItemsSelected ? 'Batalkan Semua' : 'Pilih Semua'}
            </span>
          </button>
        </div>
      </div>

      {/* Item List */}
      {displayedItems.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Item
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satuan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga Satuan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedItems.map((item) => {
                const isSelected = isItemSelected(item);
                const quantity = item.availableQuantity || item.available_quantity || 0;
                const unitPrice = item.unitPrice || item.unit_price || 0;
                const subtotal = quantity * unitPrice;
                
                return (
                  <tr 
                    key={item.id} 
                    className={`${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'} cursor-pointer`}
                    onClick={() => toggleItemSelection(item)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {isSelected ? (
                          <CheckSquare className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name || item.item_name || item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.kategori || item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(unitPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quantity} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      {formatCurrency(subtotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          {activeTab === 'service' && (
            <div>
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada jasa tersedia dalam RAB</p>
            </div>
          )}
          {activeTab === 'labor' && (
            <div>
              <HardHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada tenaga kerja tersedia dalam RAB</p>
            </div>
          )}
          {activeTab === 'equipment' && (
            <div>
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada peralatan tersedia dalam RAB</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RABSelectionViewTabs;