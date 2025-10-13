import React, { useState, useMemo, useCallback } from 'react';
import { ArrowLeft, Save, User, Building, Package } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';
import { calculatePOTotal } from '../utils/poCalculations';
import { DateInputWithIcon } from '../../../../components/ui/CalendarIcon';
import { QuantityInput } from '../../../../components/ui/NumberInput';

/**
 * Create PO View
 * Form for creating a new Purchase Order from selected RAB items
 * 
 * TODO: Extract full functionality from original ProjectPurchaseOrders.js lines 986-1362
 */
const CreatePOView = ({ 
  selectedRABItems, 
  rabItems,
  supplierInfo, 
  setSupplierInfo, 
  onSubmit, 
  onBack,
  projectId 
}) => {
  const [poItems, setPOItems] = useState(
    selectedRABItems.map(item => {
      // Use Math.floor to eliminate decimal issues
      const available = Math.floor(item.availableQuantity || item.remainingQuantity || 0);
      // Set initial quantity to 1, or 0 if nothing available
      const initialQty = available > 0 ? Math.min(1, available) : 0;
      
      return {
        rabItemId: item.id,
        inventoryId: item.id,
        itemName: item.description,
        quantity: initialQty,
        unitPrice: item.unitPrice || item.unit_price || 0,
        unit: item.unit,
        totalPrice: initialQty * (item.unitPrice || item.unit_price || 0),
        availableQuantity: available
      };
    })
  );

  const [errors, setErrors] = useState([]);

  // Update item quantity - memoized to prevent re-creation
  const updateItemQuantity = useCallback((index, newQuantity) => {
    setPOItems(prevItems => {
      const updatedItems = [...prevItems];
      // Use Math.floor to ensure integer quantity
      const qty = Math.floor(parseFloat(newQuantity) || 0);
      const item = updatedItems[index];
      
      // Validate quantity
      if (qty > item.availableQuantity) {
        alert(`Jumlah tidak boleh melebihi ${item.availableQuantity} ${item.unit}`);
        return prevItems; // Return previous state if invalid
      }
      
      item.quantity = qty;
      item.totalPrice = qty * item.unitPrice;
      return updatedItems;
    });
  }, []); // No dependencies needed

  // Calculate total - memoized to prevent recalculation
  const totalAmount = useMemo(() => calculatePOTotal(poItems), [poItems]);

  // Count valid items - memoized
  const validItemsCount = useMemo(() => {
    return poItems.filter(item => (parseFloat(item.quantity) || 0) > 0).length;
  }, [poItems]);

  // Count zero quantity items - memoized
  const zeroQtyCount = useMemo(() => {
    return poItems.filter(item => (parseFloat(item.quantity) || 0) === 0).length;
  }, [poItems]);

  // Handle form submission
  const handleSubmit = () => {
    // Basic validation with debug logging
    const errors = [];
    
    console.log('🔍 DEBUG Validation Start:');
    console.log('supplierInfo:', supplierInfo);
    console.log('poItems:', poItems);
    
    if (!supplierInfo.name || supplierInfo.name.trim() === '') {
      console.log('❌ FAIL: Nama supplier empty');
      errors.push('Nama supplier harus diisi');
    } else {
      console.log('✅ PASS: Nama supplier:', supplierInfo.name);
    }
    
    if (!supplierInfo.contact || supplierInfo.contact.trim() === '') {
      console.log('❌ FAIL: Kontak supplier empty');
      errors.push('Kontak supplier harus diisi');
    } else {
      console.log('✅ PASS: Kontak supplier:', supplierInfo.contact);
    }
    
    if (!supplierInfo.address || supplierInfo.address.trim() === '') {
      console.log('❌ FAIL: Alamat supplier empty');
      errors.push('Alamat supplier harus diisi');
    } else {
      console.log('✅ PASS: Alamat supplier:', supplierInfo.address);
    }
    
    if (!supplierInfo.deliveryDate) {
      console.log('❌ FAIL: Delivery date empty');
      errors.push('Tanggal pengiriman harus diisi');
    } else {
      console.log('✅ PASS: Delivery date:', supplierInfo.deliveryDate);
    }
    
    // Convert to numbers for comparison
    const validItems = poItems.filter(item => {
      const qty = parseFloat(item.quantity) || 0;
      return qty > 0;
    });
    
    console.log('Valid items (qty > 0):', validItems.length, '/', poItems.length);
    
    if (validItems.length === 0) {
      console.log('❌ FAIL: No items with quantity > 0');
      errors.push('Minimal harus ada 1 item dengan quantity > 0');
    } else {
      console.log('✅ PASS: Found', validItems.length, 'valid items');
    }
    
    // Check if any quantity exceeds available (with proper type conversion)
    validItems.forEach(item => {
      const qty = parseFloat(item.quantity) || 0;
      const available = parseFloat(item.availableQuantity) || 0;
      
      console.log(`  Item: ${item.itemName}, qty: ${qty}, available: ${available}`);
      
      if (qty > available) {
        console.log(`  ❌ FAIL: Exceeds available (${qty} > ${available})`);
        errors.push(`${item.itemName}: Quantity ${qty} melebihi yang tersedia (${available})`);
      }
    });
    
    console.log('Total errors:', errors.length);
    if (errors.length > 0) {
      console.log('Errors:', errors);
      setErrors(errors);
      return;
    }
    
    console.log('✅ All validation passed!');
    setErrors([]); // Clear any previous errors
    
    // Generate supplier ID from name (simple hash)
    const supplierId = `SUP-${supplierInfo.name.replace(/\s+/g, '-').toUpperCase().substring(0, 20)}-${Date.now().toString().slice(-6)}`;
    
    // Build payload matching backend schema EXACTLY
    const poData = {
      // Basic PO info
      projectId,
      poNumber: `PO-${Date.now()}`,
      supplierId: supplierId,
      supplierName: supplierInfo.name,
      orderDate: new Date().toISOString(),
      expectedDeliveryDate: supplierInfo.deliveryDate,
      status: 'pending',
      
      // Items array (only fields backend expects)
      items: validItems.map(item => ({
        inventoryId: item.inventoryId || item.rabItemId,
        itemName: item.itemName,
        quantity: parseFloat(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        totalPrice: parseFloat(item.quantity) * parseFloat(item.unitPrice),
        description: `${item.itemName} (${item.unit})`
      })),
      
      // Financial totals
      subtotal: totalAmount,
      taxAmount: 0,
      totalAmount: totalAmount,
      
      // Optional fields (all allowed by backend schema)
      notes: `Kontak: ${supplierInfo.contact}\nAlamat: ${supplierInfo.address}`,
      deliveryAddress: supplierInfo.address,
      terms: ''
    };

    console.log('📤 Submitting PO Data:', JSON.stringify(poData, null, 2));
    console.log('🔍 Items detail:', poData.items.map(i => ({
      inventoryId: i.inventoryId,
      itemName: i.itemName,
      hasRabItemId: !!i.rabItemId // Check if source had rabItemId
    })));

    // Submit
    onSubmit(poData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={onBack}
          style={{
            backgroundColor: '#2C2C2E',
            border: '1px solid #38383A'
          }}
          className="mr-4 p-2 hover:bg-[#3A3A3C] rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <div>
          <h3 className="text-lg font-semibold text-white">Buat Purchase Order</h3>
          <p className="text-sm text-[#8E8E93]">{poItems.length} item dipilih</p>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div 
          style={{
            backgroundColor: 'rgba(255, 59, 48, 0.1)',
            border: '1px solid rgba(255, 59, 48, 0.3)'
          }}
          className="rounded-lg p-4"
        >
          <h4 className="text-sm font-medium text-[#FF3B30] mb-2">⚠️ Validasi gagal:</h4>
          <ul className="list-disc list-inside text-sm text-[#FF3B30] space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Supplier Information Form */}
      <div 
        style={{
          backgroundColor: '#1C1C1E',
          border: '1px solid #38383A'
        }}
        className="rounded-lg p-6"
      >
        <h4 className="text-md font-semibold text-white mb-4 flex items-center">
          <Building className="h-5 w-5 mr-2 text-[#0A84FF]" />
          Informasi Supplier
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#98989D] mb-1">
              Nama Supplier <span className="text-[#FF3B30]">*</span>
            </label>
            <input
              type="text"
              value={supplierInfo.name}
              onChange={(e) => setSupplierInfo({ ...supplierInfo, name: e.target.value })}
              style={{
                backgroundColor: '#2C2C2E',
                border: errors.some(e => e.includes('Nama supplier')) ? '1px solid #FF3B30' : '1px solid #38383A',
                color: 'white'
              }}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
              placeholder="CV. Supplier Name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#98989D] mb-1">
              Kontak <span className="text-[#FF3B30]">*</span>
            </label>
            <input
              type="text"
              value={supplierInfo.contact}
              onChange={(e) => setSupplierInfo({ ...supplierInfo, contact: e.target.value })}
              style={{
                backgroundColor: '#2C2C2E',
                border: errors.some(e => e.includes('Kontak supplier')) ? '1px solid #FF3B30' : '1px solid #38383A',
                color: 'white'
              }}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
              placeholder="081234567890"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#98989D] mb-1">
              Alamat <span className="text-[#FF3B30]">*</span>
            </label>
            <input
              type="text"
              value={supplierInfo.address}
              onChange={(e) => setSupplierInfo({ ...supplierInfo, address: e.target.value })}
              style={{
                backgroundColor: '#2C2C2E',
                border: errors.some(e => e.includes('Alamat supplier')) ? '1px solid #FF3B30' : '1px solid #38383A',
                color: 'white'
              }}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
              placeholder="Jalan Raya..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#98989D] mb-1">
              Tanggal Pengiriman <span className="text-[#FF3B30]">*</span>
            </label>
            <DateInputWithIcon
              value={supplierInfo.deliveryDate}
              onChange={(e) => setSupplierInfo({ ...supplierInfo, deliveryDate: e.target.value })}
              style={{
                backgroundColor: '#2C2C2E',
                border: errors.some(e => e.includes('Tanggal pengiriman')) ? '1px solid #FF3B30' : '1px solid #38383A',
                color: 'white',
                colorScheme: 'dark'
              }}
              className="w-full pr-4 py-2 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      </div>

      {/* PO Items List - Scrollable */}
      <div 
        style={{
          backgroundColor: '#1C1C1E',
          border: '1px solid #38383A'
        }}
        className="rounded-lg p-6"
      >
        <h4 className="text-md font-semibold text-white mb-4 flex items-center">
          <Package className="h-5 w-5 mr-2 text-[#0A84FF]" />
          Daftar Item ({poItems.length})
        </h4>
        
        {/* Warning for items with quantity 0 */}
        {zeroQtyCount > 0 && (
          <div 
            style={{
              backgroundColor: 'rgba(255, 159, 10, 0.1)',
              border: '1px solid rgba(255, 159, 10, 0.3)'
            }}
            className="rounded-lg p-3 mb-4"
          >
            <p className="text-sm text-[#FF9F0A]">
              ⚠️ {zeroQtyCount} item memiliki quantity 0 dan tidak akan dimasukkan dalam PO
            </p>
          </div>
        )}
        
        <div 
          className="space-y-3 max-h-96 overflow-y-auto pr-2 po-items-scroll"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#38383A #1C1C1E'
          }}
        >
          <style>{`
            .po-items-scroll::-webkit-scrollbar {
              width: 8px;
            }
            .po-items-scroll::-webkit-scrollbar-track {
              background: #1C1C1E;
            }
            .po-items-scroll::-webkit-scrollbar-thumb {
              background: #38383A;
              border-radius: 4px;
            }
            .po-items-scroll::-webkit-scrollbar-thumb:hover {
              background: #48484A;
            }
          `}</style>
          {poItems.map((item, index) => (
            <div 
              key={index} 
              style={{
                backgroundColor: '#2C2C2E',
                border: '1px solid #38383A'
              }}
              className="rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h5 className="font-medium text-white mb-1">{item.itemName}</h5>
                  <p className="text-sm text-[#8E8E93]">
                    Tersedia: <span className="font-medium text-[#30D158]">{Math.floor(item.availableQuantity)} {item.unit}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#98989D] mb-1">Harga Satuan</p>
                  <p className="font-medium text-[#0A84FF]">{formatCurrency(item.unitPrice)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#98989D] mb-1">
                    Jumlah ({item.unit})
                  </label>
                  <QuantityInput
                    value={item.quantity}
                    onChange={(rawValue) => updateItemQuantity(index, rawValue)}
                    max={item.availableQuantity}
                    min="0"
                    step="0.01"
                    style={{
                      backgroundColor: '#1C1C1E',
                      border: '1px solid #38383A',
                      color: 'white'
                    }}
                    className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#98989D] mb-1">
                    Total
                  </label>
                  <div 
                    style={{
                      backgroundColor: 'rgba(10, 132, 255, 0.1)',
                      border: '1px solid rgba(10, 132, 255, 0.3)'
                    }}
                    className="px-3 py-2 rounded-lg"
                  >
                    <span className="font-bold text-[#0A84FF]">{formatCurrency(item.totalPrice || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Summary */}
      <div 
        style={{
          backgroundColor: 'rgba(10, 132, 255, 0.1)',
          border: '1px solid rgba(10, 132, 255, 0.3)'
        }}
        className="rounded-lg p-6"
      >
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-white">Total Purchase Order</span>
          <span className="text-2xl font-bold text-[#0A84FF]">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Helper Text */}
        <div 
          style={{
            backgroundColor: 'rgba(142, 142, 147, 0.1)',
            border: '1px solid rgba(142, 142, 147, 0.2)'
          }}
          className="rounded-lg p-3"
        >
          <p className="text-xs text-[#8E8E93] text-center">
            💡 Pastikan semua field bertanda (*) sudah diisi dan minimal 1 item memiliki quantity {">"} 0
          </p>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onBack}
            style={{
              backgroundColor: '#1C1C1E',
              border: '1px solid #38383A',
              color: 'white'
            }}
            className="px-6 py-2 rounded-lg hover:bg-[#2C2C2E] transition-all"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={validItemsCount === 0}
            style={{
              backgroundColor: validItemsCount === 0 ? '#38383A' : '#0A84FF'
            }}
            className="flex items-center px-6 py-2 text-white rounded-lg hover:bg-[#0A84FF]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#0A84FF]/20"
          >
            <Save className="h-4 w-4 mr-2" />
            Simpan Purchase Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePOView;
