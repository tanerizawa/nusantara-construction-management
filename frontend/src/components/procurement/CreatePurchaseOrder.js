import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Save, 
  Send, 
  Building, 
  User, 
  Calendar, 
  Package,
  DollarSign,
  Truck,
  AlertTriangle
} from 'lucide-react';

const CreatePurchaseOrder = ({ projectId, project, selectedRABItems = [], onBack, onSave }) => {
  const [formData, setFormData] = useState({
    supplierName: '',
    supplierContact: '',
    supplierAddress: '',
    deliveryDate: '',
    deliveryAddress: '',
    terms: 'NET 30',
    notes: ''
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Initialize items from selected RAB items
    if (selectedRABItems && selectedRABItems.length > 0) {
      const initialItems = selectedRABItems.map(rabItem => ({
        id: rabItem.id,
        rabItemId: rabItem.id,
        description: rabItem.description || rabItem.item_name || 'Material',
        category: rabItem.category || 'General',
        quantity: rabItem.quantity || 1,
        unit: rabItem.unit || 'pcs',
        unitPrice: rabItem.unitPrice || rabItem.unit_price || 0,
        total: (rabItem.quantity || 1) * (rabItem.unitPrice || rabItem.unit_price || 0)
      }));
      setItems(initialItems);
    } else {
      // Add one empty item if no RAB items selected
      addNewItem();
    }

    // Set default delivery address from project
    if (project?.location) {
      setFormData(prev => ({
        ...prev,
        deliveryAddress: project.location
      }));
    }
  }, [selectedRABItems, project]);

  const addNewItem = () => {
    const newItem = {
      id: Date.now(),
      rabItemId: null,
      description: '',
      category: '',
      quantity: 1,
      unit: 'pcs',
      unitPrice: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const updateItem = (itemId, field, value) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total when quantity or price changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.11; // 11% PPN
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount || 0);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.supplierName.trim()) {
      newErrors.supplierName = 'Nama supplier harus diisi';
    }

    if (!formData.supplierContact.trim()) {
      newErrors.supplierContact = 'Kontak supplier harus diisi';
    }

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Tanggal pengiriman harus diisi';
    }

    if (items.length === 0) {
      newErrors.items = 'Minimal harus ada satu item';
    }

    // Validate items
    items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item_${index}_description`] = 'Deskripsi item harus diisi';
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantity harus lebih dari 0';
      }
      if (item.unitPrice <= 0) {
        newErrors[`item_${index}_unitPrice`] = 'Harga satuan harus lebih dari 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!validateForm() && !isDraft) {
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        projectId,
        supplierName: formData.supplierName,
        supplierContact: formData.supplierContact,
        supplierAddress: formData.supplierAddress,
        deliveryDate: formData.deliveryDate,
        deliveryAddress: formData.deliveryAddress,
        terms: formData.terms,
        notes: formData.notes,
        items: items.map(item => ({
          rabItemId: item.rabItemId,
          description: item.description,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          total: item.total
        })),
        subtotal: calculateSubtotal(),
        taxAmount: calculateTax(),
        totalAmount: calculateTotal(),
        status: isDraft ? 'draft' : 'pending'
      };

      const response = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        if (onSave) {
          onSave(result);
        }
      } else {
        const error = await response.json();
        setErrors({ submit: error.message || 'Gagal menyimpan Purchase Order' });
      }
    } catch (error) {
      console.error('Error creating purchase order:', error);
      setErrors({ submit: 'Terjadi kesalahan saat menyimpan' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buat Purchase Order</h1>
          <p className="text-gray-600">
            Proyek: {project?.name || projectId}
          </p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
        {/* Supplier Information */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Informasi Supplier
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Supplier *
              </label>
              <input
                type="text"
                value={formData.supplierName}
                onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan nama supplier"
              />
              {errors.supplierName && (
                <p className="text-red-600 text-sm mt-1">{errors.supplierName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kontak Supplier *
              </label>
              <input
                type="text"
                value={formData.supplierContact}
                onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email atau nomor telepon"
              />
              {errors.supplierContact && (
                <p className="text-red-600 text-sm mt-1">{errors.supplierContact}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Supplier
              </label>
              <textarea
                value={formData.supplierAddress}
                onChange={(e) => setFormData({ ...formData, supplierAddress: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Alamat lengkap supplier"
              />
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Informasi Pengiriman
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Pengiriman *
              </label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.deliveryDate && (
                <p className="text-red-600 text-sm mt-1">{errors.deliveryDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Terms of Payment
              </label>
              <select
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="NET 30">NET 30</option>
                <option value="NET 15">NET 15</option>
                <option value="NET 7">NET 7</option>
                <option value="COD">Cash on Delivery</option>
                <option value="Prepaid">Prepaid</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Pengiriman
              </label>
              <textarea
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Alamat pengiriman material"
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Package className="h-5 w-5" />
              Material yang Dipesan
            </h3>
            <button
              type="button"
              onClick={addNewItem}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              Tambah Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Deskripsi</th>
                  <th className="text-left py-3">Kategori</th>
                  <th className="text-center py-3">Qty</th>
                  <th className="text-left py-3">Unit</th>
                  <th className="text-right py-3">Harga Satuan</th>
                  <th className="text-right py-3">Total</th>
                  <th className="text-center py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Deskripsi material"
                      />
                      {errors[`item_${index}_description`] && (
                        <p className="text-red-600 text-xs mt-1">{errors[`item_${index}_description`]}</p>
                      )}
                    </td>
                    <td className="py-3">
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Kategori"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm"
                      />
                      {errors[`item_${index}_quantity`] && (
                        <p className="text-red-600 text-xs mt-1">{errors[`item_${index}_quantity`]}</p>
                      )}
                    </td>
                    <td className="py-3">
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="pcs"
                      />
                    </td>
                    <td className="py-3 text-right">
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-24 border border-gray-300 rounded px-2 py-1 text-right text-sm"
                        placeholder="0"
                      />
                      {errors[`item_${index}_unitPrice`] && (
                        <p className="text-red-600 text-xs mt-1">{errors[`item_${index}_unitPrice`]}</p>
                      )}
                    </td>
                    <td className="py-3 text-right font-medium">
                      {formatCurrency(item.total)}
                    </td>
                    <td className="py-3 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        disabled={items.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {errors.items && (
            <p className="text-red-600 text-sm mt-2">{errors.items}</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Ringkasan Order
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Catatan tambahan untuk purchase order"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">PPN (11%):</span>
                <span className="font-medium">{formatCurrency(calculateTax())}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span>Total:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="bg-white p-6 rounded-lg border">
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-red-600">{errors.submit}</span>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Simpan Draft
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {loading ? 'Menyimpan...' : 'Submit untuk Approval'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePurchaseOrder;
