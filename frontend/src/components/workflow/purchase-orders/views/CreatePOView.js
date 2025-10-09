import React, { useState } from 'react';
import { ArrowLeft, Save, Calendar, User, Building, Package } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';
import { validateCompletePO } from '../utils/poValidation';
import { calculatePOTotal } from '../utils/poCalculations';

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
    selectedRABItems.map(item => ({
      rabItemId: item.id,
      inventoryId: item.id,
      itemName: item.description,
      quantity: Math.min(1, item.availableQuantity || item.remainingQuantity || 0),
      unitPrice: item.unitPrice || item.unit_price || 0,
      unit: item.unit,
      totalPrice: 0,
      availableQuantity: item.availableQuantity || item.remainingQuantity || 0
    }))
  );

  const [errors, setErrors] = useState([]);

  // Update item quantity
  const updateItemQuantity = (index, newQuantity) => {
    const updatedItems = [...poItems];
    const qty = parseFloat(newQuantity) || 0;
    const item = updatedItems[index];
    
    // Validate quantity
    if (qty > item.availableQuantity) {
      alert(`Jumlah tidak boleh melebihi ${item.availableQuantity} ${item.unit}`);
      return;
    }
    
    item.quantity = qty;
    item.totalPrice = qty * item.unitPrice;
    setPOItems(updatedItems);
  };

  // Calculate total
  const totalAmount = calculatePOTotal(poItems);

  // Handle form submission
  const handleSubmit = () => {
    const poData = {
      projectId,
      poNumber: `PO-${Date.now()}`,
      supplierName: supplierInfo.name,
      supplierContact: supplierInfo.contact,
      supplierAddress: supplierInfo.address || '-',
      deliveryAddress: supplierInfo.address || '-',
      deliveryDate: supplierInfo.deliveryDate,
      expectedDeliveryDate: supplierInfo.deliveryDate,
      orderDate: new Date().toISOString(),
      status: 'pending',
      items: poItems.filter(item => item.quantity > 0),
      subtotal: totalAmount,
      taxAmount: 0,
      totalAmount: totalAmount,
      notes: '',
      terms: ''
    };

    // Validate
    const validation = validateCompletePO(poData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Submit
    onSubmit(poData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="mr-4 p-2 hover:bg-[#3A3A3C] rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
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
            backgroundColor: '#FF3B30',
            opacity: 0.1,
            border: '1px solid rgba(255, 59, 48, 0.3)'
          }}
          className="rounded-lg p-4 relative"
        >
          <div 
            style={{ backgroundColor: 'transparent', opacity: 1 }}
            className="absolute inset-0 p-4"
          >
            <h4 className="text-sm font-medium text-[#FF3B30] mb-2">⚠️ Validasi gagal:</h4>
            <ul className="list-disc list-inside text-sm text-[#FF3B30] space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
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
                border: '1px solid #38383A',
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
                border: '1px solid #38383A',
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
                border: '1px solid #38383A',
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
            <input
              type="date"
              value={supplierInfo.deliveryDate}
              onChange={(e) => setSupplierInfo({ ...supplierInfo, deliveryDate: e.target.value })}
              style={{
                backgroundColor: '#2C2C2E',
                border: '1px solid #38383A',
                color: 'white',
                colorScheme: 'dark'
              }}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      </div>

      {/* PO Items List */}
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
        
        <div className="space-y-3">
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
                    Tersedia: <span className="font-medium text-[#30D158]">{item.availableQuantity.toFixed(2)} {item.unit}</span>
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
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItemQuantity(index, e.target.value)}
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
                      backgroundColor: '#0A84FF',
                      opacity: 0.1,
                      border: '1px solid rgba(10, 132, 255, 0.3)'
                    }}
                    className="px-3 py-2 rounded-lg relative"
                  >
                    <div 
                      style={{ backgroundColor: 'transparent', opacity: 1 }}
                      className="absolute inset-0 px-3 py-2 flex items-center"
                    >
                      <span className="font-medium text-[#0A84FF]">{formatCurrency(item.totalPrice || 0)}</span>
                    </div>
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
          backgroundColor: '#0A84FF',
          opacity: 0.1,
          border: '1px solid rgba(10, 132, 255, 0.3)'
        }}
        className="rounded-lg p-6 relative"
      >
        <div 
          style={{ backgroundColor: 'transparent', opacity: 1 }}
          className="absolute inset-0 p-6"
        >
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-white">Total Purchase Order</span>
            <span className="text-2xl font-bold text-[#0A84FF]">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
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
          disabled={poItems.filter(item => item.quantity > 0).length === 0}
          style={{
            backgroundColor: poItems.filter(item => item.quantity > 0).length === 0 ? '#38383A' : '#0A84FF'
          }}
          className="flex items-center px-6 py-2 text-white rounded-lg hover:bg-[#0A84FF]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#0A84FF]/20"
        >
          <Save className="h-4 w-4 mr-2" />
          Simpan Purchase Order
        </button>
      </div>
    </div>
  );
};

export default CreatePOView;
