import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  Truck,
  Package,
  DollarSign,
  Calendar,
  User,
  Building,
  AlertTriangle,
  Send,
  Download,
  Filter
} from 'lucide-react';

const ProjectPurchaseOrders = ({ projectId, project, onDataChange }) => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('rab-selection'); // 'rab-selection', 'create-po', 'po-list'
  const [selectedRABItems, setSelectedRABItems] = useState([]);
  const [rabItems, setRABItems] = useState([]);
  const [supplierInfo, setSupplierInfo] = useState({
    name: '',
    contact: '',
    address: '',
    deliveryDate: ''
  });

  useEffect(() => {
    fetchRABItems();
    fetchPurchaseOrderData();
  }, [projectId]);

  const fetchPurchaseOrderData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/purchase-orders?projectId=${projectId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPurchaseOrders(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRABItems = async () => {
    try {
      const response = await fetch(`/api/database/projects/${projectId}/rab-items`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Handle both response formats: {data: []} or direct array  
        const rabItemsArray = data.data || data || [];
        // Filter hanya yang approved untuk purchase order
        const approvedItems = rabItemsArray.filter(item => item.is_approved || item.isApproved);
        setRABItems(approvedItems);
      } else {
        console.error('Failed to fetch RAB items:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching RAB items:', error);
    }
  };

  const handleCreatePO = async (poData) => {
    try {
      const response = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...poData,
          projectId
        })
      });

      if (response.ok) {
        await fetchPurchaseOrderData();
        if (onDataChange) onDataChange();
        setCurrentView('rab-selection');
        setSelectedRABItems([]);
        setSupplierInfo({ name: '', contact: '', address: '', deliveryDate: '' });
        alert('Purchase Order berhasil dibuat');
      }
    } catch (error) {
      console.error('Error creating purchase order:', error);
      alert('Gagal membuat Purchase Order');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'sent': return 'text-blue-600 bg-blue-100';
      case 'received': return 'text-purple-600 bg-purple-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Purchase Order - Material Procurement</h2>
          <p className="text-gray-600">Pilih material dari RAB yang sudah disetujui untuk {project.name}</p>
        </div>
        <div className="flex items-center space-x-3">
          {currentView !== 'rab-selection' && (
            <button
              onClick={() => setCurrentView('rab-selection')}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Kembali ke Pilih Material
            </button>
          )}
          <button
            onClick={() => setCurrentView('po-list')}
            className="flex items-center px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
          >
            <FileText className="h-4 w-4 mr-2" />
            Riwayat PO ({purchaseOrders.length})
          </button>
        </div>
      </div>

      {/* Different Views */}
      {currentView === 'rab-selection' && (
        <RABSelectionView 
          rabItems={rabItems}
          selectedRABItems={selectedRABItems}
          setSelectedRABItems={setSelectedRABItems}
          onNext={() => setCurrentView('create-po')}
          loading={loading}
        />
      )}

      {currentView === 'create-po' && (
        <CreatePOFromRABView
          selectedRABItems={selectedRABItems}
          rabItems={rabItems}
          supplierInfo={supplierInfo}
          setSupplierInfo={setSupplierInfo}
          onSubmit={handleCreatePO}
          onBack={() => setCurrentView('rab-selection')}
          projectId={projectId}
        />
      )}

      {currentView === 'po-list' && (
        <POHistoryView
          purchaseOrders={purchaseOrders}
          onBack={() => setCurrentView('rab-selection')}
        />
      )}
    </div>
  );
};

// RAB Selection View - Main view for selecting materials
const RABSelectionView = ({ rabItems, selectedRABItems, setSelectedRABItems, onNext, loading }) => {
  const toggleRABItem = (itemId) => {
    // Semua item yang ditampilkan sudah approved, jadi langsung toggle
    const updatedSelection = selectedRABItems.includes(itemId)
      ? selectedRABItems.filter(id => id !== itemId)
      : [...selectedRABItems, itemId];
    setSelectedRABItems(updatedSelection);
  };

  const selectedItems = rabItems.filter(item => selectedRABItems.includes(item.id));
  const approvedItems = rabItems; // Semua item sudah approved
  const totalValue = selectedItems.reduce((sum, item) => {
    const unitPrice = item.unitPrice || item.unit_price || 0;
    return sum + (item.quantity * unitPrice);
  }, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Summary Cards - Compact */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white border rounded-lg p-3">
          <div className="flex items-center">
            <Package className="h-6 w-6 text-blue-600" />
            <div className="ml-2">
              <p className="text-lg font-bold text-gray-900">{rabItems.length}</p>
              <p className="text-xs text-gray-600">Material Approved</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg p-3">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div className="ml-2">
              <p className="text-lg font-bold text-green-600">{selectedRABItems.length}</p>
              <p className="text-xs text-gray-600">Material Dipilih</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg p-3">
          <div className="flex items-center">
            <DollarSign className="h-6 w-6 text-purple-600" />
            <div className="ml-2">
              <p className="text-sm font-bold text-purple-600">{formatCurrency(totalValue)}</p>
              <p className="text-xs text-gray-600">Total Dipilih</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg p-3">
          <div className="flex items-center justify-center">
            <button
              onClick={onNext}
              disabled={selectedRABItems.length === 0}
              className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lanjut ke PO ({selectedRABItems.length})
            </button>
          </div>
        </div>
      </div>

      {/* RAB Items List */}
      <div className="bg-white border rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-900">Material RAB yang Disetujui</h3>
          <p className="text-xs text-gray-600">Pilih material untuk Purchase Order</p>
        </div>

        {rabItems.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-1">Belum ada Material Approved</h3>
            <p className="text-sm text-gray-600">Material yang sudah disetujui akan muncul di sini.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {rabItems.map((item) => {
              const isSelected = selectedRABItems.includes(item.id);
              const unitPrice = item.unitPrice || item.unit_price || 0;
              
              return (
                <div
                  key={item.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                  }`}
                  onClick={() => toggleRABItem(item.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRABItem(item.id)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{item.description || item.item_name || 'Material'}</h4>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Approved
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{item.category}</p>
                        
                        <div className="grid grid-cols-4 gap-3 mt-2">
                          <div>
                            <p className="text-xs text-gray-500">Quantity</p>
                            <p className="text-sm font-medium">{item.quantity} {item.unit}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Unit Price</p>
                            <p className="text-sm font-medium">{formatCurrency(unitPrice)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Total</p>
                            <p className="text-sm font-medium text-green-600">{formatCurrency(item.quantity * unitPrice)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Action</p>
                            <p className="text-xs text-blue-600">{isSelected ? 'Selected' : 'Click to select'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Items Summary */}
      {selectedRABItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-blue-900">Material Terpilih</h3>
              <p className="text-sm text-blue-700">
                {selectedRABItems.length} material terpilih dengan total estimasi {formatCurrency(totalValue)}
              </p>
            </div>
            <button
              onClick={onNext}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Buat Purchase Order
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Create PO from selected RAB items
const CreatePOFromRABView = ({ selectedRABItems, rabItems, supplierInfo, setSupplierInfo, onSubmit, onBack, projectId }) => {
  const selectedItems = rabItems.filter(item => selectedRABItems.includes(item.id));
  const [itemQuantities, setItemQuantities] = useState({});

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Initialize quantities with RAB quantities
  useEffect(() => {
    const initialQuantities = {};
    selectedItems.forEach(item => {
      initialQuantities[item.id] = item.quantity;
    });
    setItemQuantities(initialQuantities);
  }, [selectedItems]);

  const updateQuantity = (itemId, quantity) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: quantity
    }));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => {
      const quantity = itemQuantities[item.id] || item.quantity;
      const unitPrice = item.unitPrice || item.unit_price || 0;
      return sum + (quantity * unitPrice);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const poData = {
      projectId,
      supplierName: supplierInfo.name,
      supplierContact: supplierInfo.contact,
      supplierAddress: supplierInfo.address,
      deliveryDate: supplierInfo.deliveryDate,
      items: selectedItems.map(item => {
        const quantity = itemQuantities[item.id] || item.quantity;
        const unitPrice = item.unitPrice || item.unit_price || 0;
        return {
          rabItemId: item.id,
          description: item.description || item.item_name || 'Material',
          category: item.category,
          quantity: quantity,
          unit: item.unit,
          unitPrice: unitPrice,
          totalPrice: quantity * unitPrice
        };
      }),
      totalAmount: calculateTotal(),
      status: 'draft',
      poNumber: `PO-${projectId}-${Date.now()}`
    };

    onSubmit(poData);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Supplier Information */}
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-base font-medium mb-3">Informasi Supplier</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Supplier *
              </label>
              <input
                type="text"
                value={supplierInfo.name}
                onChange={(e) => setSupplierInfo({ ...supplierInfo, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kontak Supplier
              </label>
              <input
                type="text"
                value={supplierInfo.contact}
                onChange={(e) => setSupplierInfo({ ...supplierInfo, contact: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat Supplier
              </label>
              <textarea
                value={supplierInfo.address}
                onChange={(e) => setSupplierInfo({ ...supplierInfo, address: e.target.value })}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Pengiriman
              </label>
              <input
                type="date"
                value={supplierInfo.deliveryDate}
                onChange={(e) => setSupplierInfo({ ...supplierInfo, deliveryDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Selected Items with Quantity Adjustment */}
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-base font-medium mb-3">Material yang Dipesan</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Material</th>
                  <th className="text-left py-2">Kategori</th>
                  <th className="text-center py-2">Qty RAB</th>
                  <th className="text-center py-2">Qty Order</th>
                  <th className="text-left py-2">Unit</th>
                  <th className="text-right py-2">Harga Satuan</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item) => {
                  const orderQuantity = itemQuantities[item.id] || item.quantity;
                  const unitPrice = item.unitPrice || item.unit_price || 0;
                  return (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">{item.description || item.item_name || 'Material'}</td>
                      <td className="py-2 text-xs text-gray-600">{item.category}</td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-center">
                        <input
                          type="number"
                          min="1"
                          max={item.quantity}
                          value={orderQuantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                          className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm"
                        />
                      </td>
                      <td className="py-2">{item.unit}</td>
                      <td className="py-2 text-right">{formatCurrency(unitPrice)}</td>
                      <td className="py-2 text-right font-medium">{formatCurrency(orderQuantity * unitPrice)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300">
                  <td colSpan="6" className="py-2 text-right font-medium">Total Purchase Order:</td>
                  <td className="py-2 text-right font-bold text-base">{formatCurrency(calculateTotal())}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            Kembali
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Buat Purchase Order
          </button>
        </div>
      </form>
    </>
  );
};

// PO History View
const POHistoryView = ({ purchaseOrders, onBack }) => {
  const [selectedPO, setSelectedPO] = useState(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'sent': return 'text-blue-600 bg-blue-100';
      case 'received': return 'text-purple-600 bg-purple-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const canEdit = (status) => {
    return ['draft', 'pending'].includes(status);
  };

  const canCancel = (status) => {
    return ['draft', 'pending', 'sent'].includes(status);
  };

  const handleCancelPO = async (poId) => {
    try {
      const response = await fetch(`/api/purchase-orders/${poId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Purchase Order berhasil dibatalkan');
        window.location.reload(); // Refresh untuk update data
      } else {
        alert('Gagal membatalkan Purchase Order');
      }
    } catch (error) {
      console.error('Error cancelling PO:', error);
      alert('Gagal membatalkan Purchase Order');
    }
    setShowConfirmCancel(null);
  };

  if (selectedPO) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Detail Purchase Order</h3>
          <button
            onClick={() => setSelectedPO(null)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Kembali ke List
          </button>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Informasi PO</h4>
              <div className="space-y-2">
                <p><span className="text-gray-600">No. PO:</span> {selectedPO.poNumber || selectedPO.po_number}</p>
                <p><span className="text-gray-600">Supplier:</span> {selectedPO.supplierName || selectedPO.supplier_name}</p>
                <p><span className="text-gray-600">Tanggal:</span> {formatDate(selectedPO.orderDate || selectedPO.order_date || selectedPO.createdAt)}</p>
                <p><span className="text-gray-600">Status:</span> 
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPO.status)}`}>
                    {selectedPO.status}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Pengiriman</h4>
              <div className="space-y-2">
                <p><span className="text-gray-600">Tanggal Kirim:</span> {selectedPO.deliveryDate ? formatDate(selectedPO.deliveryDate) : 'Belum ditentukan'}</p>
                <p><span className="text-gray-600">Alamat:</span> {selectedPO.supplierAddress || 'Sesuai kontrak'}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Items</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Material</th>
                    <th className="text-center py-2">Qty</th>
                    <th className="text-left py-2">Unit</th>
                    <th className="text-right py-2">Harga</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPO.items?.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.description}</td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2">{item.unit}</td>
                      <td className="py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-2 text-right">{formatCurrency(item.totalPrice)}</td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan="5" className="py-4 text-center text-gray-500">Detail items tidak tersedia</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2">
                    <td colSpan="4" className="py-2 text-right font-medium">Total:</td>
                    <td className="py-2 text-right font-bold">{formatCurrency(selectedPO.totalAmount || selectedPO.total_amount || 0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="border-t pt-6 flex justify-end space-x-3">
            {canEdit(selectedPO.status) && (
              <button className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50">
                <Edit className="h-4 w-4 inline mr-2" />
                Edit PO
              </button>
            )}
            {canCancel(selectedPO.status) && (
              <button 
                onClick={() => setShowConfirmCancel(selectedPO.id)}
                className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 inline mr-2" />
                Cancel PO
              </button>
            )}
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="h-4 w-4 inline mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Confirmation Modal */}
      {showConfirmCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Konfirmasi Pembatalan</h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin membatalkan Purchase Order ini? 
              Material yang dibatalkan akan dikembalikan ke RAB dan dapat dipilih kembali.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmCancel(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleCancelPO(showConfirmCancel)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Ya, Batalkan PO
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Riwayat Purchase Order</h3>
          <p className="text-sm text-gray-600">Kelola dan pantau status Purchase Order proyek</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Kembali
        </button>
      </div>

      <div className="bg-white border rounded-lg">
        {purchaseOrders.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada Purchase Order</h3>
            <p className="text-gray-600">Purchase Order yang dibuat akan muncul di sini.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{po.poNumber || po.po_number || `PO-${po.id?.slice(-8)}`}</h4>
                        <p className="text-sm text-gray-600">{po.supplierName || po.supplier_name || 'Supplier tidak tersedia'}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {po.items?.length || 0} items • Dibuat {formatDate(po.createdAt)}
                        </p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="font-medium">{formatCurrency(po.totalAmount || po.total_amount || 0)}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(po.status)}`}>
                          {po.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-6">
                    <button
                      onClick={() => setSelectedPO(po)}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {canEdit(po.status) && (
                      <button
                        className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"
                        title="Edit PO"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    {canCancel(po.status) && (
                      <button
                        onClick={() => setShowConfirmCancel(po.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Cancel PO"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectPurchaseOrders;
