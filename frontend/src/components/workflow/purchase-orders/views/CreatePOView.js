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
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Buat Purchase Order</h3>
          <p className="text-sm text-gray-600">{poItems.length} item dipilih</p>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">Validasi gagal:</h4>
          <ul className="list-disc list-inside text-sm text-red-700">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Supplier Information Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
          <Building className="h-5 w-5 mr-2 text-blue-600" />
          Informasi Supplier
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Supplier *
            </label>
            <input
              type="text"
              value={supplierInfo.name}
              onChange={(e) => setSupplierInfo({ ...supplierInfo, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="CV. Supplier Name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kontak *
            </label>
            <input
              type="text"
              value={supplierInfo.contact}
              onChange={(e) => setSupplierInfo({ ...supplierInfo, contact: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="081234567890"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat *
            </label>
            <input
              type="text"
              value={supplierInfo.address}
              onChange={(e) => setSupplierInfo({ ...supplierInfo, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Jalan Raya..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Pengiriman *
            </label>
            <input
              type="date"
              value={supplierInfo.deliveryDate}
              onChange={(e) => setSupplierInfo({ ...supplierInfo, deliveryDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      </div>

      {/* PO Items List */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
          <Package className="h-5 w-5 mr-2 text-blue-600" />
          Daftar Item ({poItems.length})
        </h4>
        
        <div className="space-y-3">
          {poItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{item.itemName}</h5>
                  <p className="text-sm text-gray-600">
                    Tersedia: {item.availableQuantity.toFixed(2)} {item.unit}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Harga Satuan</p>
                  <p className="font-medium text-gray-900">{formatCurrency(item.unitPrice)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jumlah ({item.unit})
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItemQuantity(index, e.target.value)}
                    max={item.availableQuantity}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                    {formatCurrency(item.totalPrice || 0)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total Purchase Order</span>
          <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          onClick={handleSubmit}
          disabled={poItems.filter(item => item.quantity > 0).length === 0}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4 mr-2" />
          Simpan Purchase Order
        </button>
      </div>
    </div>
  );
};

export default CreatePOView;
