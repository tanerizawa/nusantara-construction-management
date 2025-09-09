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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [filter, setFilter] = useState('all');
  const [rabItems, setRABItems] = useState([]);

  useEffect(() => {
    fetchPurchaseOrderData();
    fetchRABItems();
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
      const response = await fetch(`/api/projects/${projectId}/rab`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRABItems(data.data?.filter(item => item.isApproved) || []);
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
        setShowCreateForm(false);
        alert('Purchase Order berhasil dibuat');
      }
    } catch (error) {
      console.error('Error creating purchase order:', error);
      alert('Gagal membuat Purchase Order');
    }
  };

  const handleSubmitForApproval = async (poId) => {
    try {
      const response = await fetch(`/api/approval/po/${poId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await fetchPurchaseOrderData();
        if (onDataChange) onDataChange();
        alert('Purchase Order berhasil disubmit untuk approval');
      }
    } catch (error) {
      console.error('Error submitting PO for approval:', error);
      alert('Gagal submit PO untuk approval');
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'pending': return Clock;
      case 'sent': return Send;
      case 'received': return Package;
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return FileText;
    }
  };

  const filteredPOs = purchaseOrders.filter(po => {
    if (filter === 'all') return true;
    return po.status === filter;
  });

  const poSummary = {
    total: purchaseOrders.length,
    draft: purchaseOrders.filter(po => po.status === 'draft').length,
    pending: purchaseOrders.filter(po => po.status === 'pending').length,
    approved: purchaseOrders.filter(po => po.status === 'approved').length,
    sent: purchaseOrders.filter(po => po.status === 'sent').length,
    received: purchaseOrders.filter(po => po.status === 'received').length,
    totalValue: purchaseOrders.reduce((sum, po) => sum + (po.totalAmount || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Purchase Orders</h2>
          <p className="text-gray-600">Manajemen pengadaan untuk {project.name}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Buat PO Baru
          </button>
          
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export PO
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">{poSummary.total}</p>
              <p className="text-sm text-gray-600">Total PO</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-yellow-600">{poSummary.pending}</p>
              <p className="text-sm text-gray-600">Pending Approval</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-green-600">{poSummary.approved}</p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-lg font-bold text-purple-600">{formatCurrency(poSummary.totalValue)}</p>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action: Generate PO from RAB */}
      {rabItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-blue-900">Generate PO dari RAB</h3>
              <p className="text-blue-700">
                Ada {rabItems.length} item RAB yang sudah diapprove dan siap untuk dibuat PO
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Generate PO
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'all', label: 'Semua', count: poSummary.total },
              { key: 'draft', label: 'Draft', count: poSummary.draft },
              { key: 'pending', label: 'Pending', count: poSummary.pending },
              { key: 'approved', label: 'Approved', count: poSummary.approved },
              { key: 'sent', label: 'Sent', count: poSummary.sent },
              { key: 'received', label: 'Received', count: poSummary.received }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* PO List */}
        <div className="divide-y divide-gray-200">
          {filteredPOs.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'Belum ada Purchase Order' : `Tidak ada PO dengan status ${filter}`}
              </h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? 'Mulai dengan membuat Purchase Order pertama dari RAB yang sudah diapprove'
                  : `Tidak ada Purchase Order dengan status ${filter}`
                }
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Buat PO Pertama
                </button>
              )}
            </div>
          ) : (
            filteredPOs.map((po) => (
              <POCard
                key={po.id}
                po={po}
                onView={() => setSelectedPO(po)}
                onSubmitApproval={() => handleSubmitForApproval(po.id)}
                onRefresh={fetchPurchaseOrderData}
              />
            ))
          )}
        </div>
      </div>

      {/* Create PO Modal */}
      {showCreateForm && (
        <CreatePOModal
          projectId={projectId}
          rabItems={rabItems}
          onClose={() => setShowCreateForm(false)}
          onCreate={handleCreatePO}
        />
      )}

      {/* PO Detail Modal */}
      {selectedPO && (
        <PODetailModal
          po={selectedPO}
          onClose={() => setSelectedPO(null)}
        />
      )}
    </div>
  );
};

// PO Card Component
const POCard = ({ po, onView, onSubmitApproval, onRefresh }) => {
  const StatusIcon = getStatusIcon(po.status);
  
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-2">
            <StatusIcon className={`h-5 w-5 ${getStatusColor(po.status).split(' ')[0]}`} />
            <h3 className="text-lg font-medium text-gray-900">{po.poNumber}</h3>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(po.status)}`}>
              {po.status}
            </span>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Supplier</p>
              <p className="font-medium">{po.supplierName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium text-green-600">{formatCurrency(po.totalAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">{formatDate(po.orderDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expected Delivery</p>
              <p className="font-medium">{po.expectedDeliveryDate ? formatDate(po.expectedDeliveryDate) : '-'}</p>
            </div>
          </div>

          {/* Items Preview */}
          <div className="bg-gray-50 rounded p-3 mb-4">
            <p className="text-sm text-gray-600 font-medium mb-1">Items ({po.items?.length || 0})</p>
            {po.items?.slice(0, 2).map((item, index) => (
              <p key={index} className="text-sm text-gray-600">
                • {item.description} ({item.quantity} {item.unit})
              </p>
            ))}
            {po.items?.length > 2 && (
              <p className="text-sm text-gray-500 mt-1">+{po.items.length - 2} items lainnya</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end space-y-2 ml-4">
          <button
            onClick={() => onView(po)}
            className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Eye className="h-4 w-4 mr-1" />
            Detail
          </button>
          
          {po.status === 'draft' && (
            <button
              onClick={() => onSubmitApproval(po.id)}
              className="flex items-center px-3 py-1 text-green-600 hover:bg-green-50 rounded transition-colors"
            >
              <Send className="h-4 w-4 mr-1" />
              Submit Approval
            </button>
          )}

          {po.status === 'approved' && (
            <button className="flex items-center px-3 py-1 text-purple-600 hover:bg-purple-50 rounded transition-colors">
              <Truck className="h-4 w-4 mr-1" />
              Track Delivery
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Create PO Modal Component
const CreatePOModal = ({ projectId, rabItems, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    supplierName: '',
    supplierId: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '',
    items: [],
    notes: '',
    deliveryAddress: ''
  });

  const [selectedRABItems, setSelectedRABItems] = useState([]);

  const handleAddRABItems = () => {
    const newItems = selectedRABItems.map(rabId => {
      const rabItem = rabItems.find(item => item.id === rabId);
      return {
        description: rabItem.description,
        specification: rabItem.description,
        unit: rabItem.unit,
        quantity: rabItem.quantity,
        unitPrice: rabItem.unitPrice,
        totalPrice: rabItem.quantity * rabItem.unitPrice,
        rabItemId: rabItem.id
      };
    });

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, ...newItems]
    }));
    setSelectedRABItems([]);
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const poData = {
      ...formData,
      subtotal: calculateTotal(),
      totalAmount: calculateTotal(), // Add tax calculation if needed
      poNumber: `PO-${projectId}-${Date.now()}`,
      status: 'draft'
    };

    onCreate(poData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full m-4 max-h-screen overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Buat Purchase Order Baru</h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.supplierName}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplierName: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.orderDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, orderDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectedDeliveryDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address
                </label>
                <input
                  type="text"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Add Items from RAB */}
            {rabItems.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Items dari RAB yang Approved
                </label>
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                    {rabItems.map((item) => (
                      <label key={item.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRABItems.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRABItems(prev => [...prev, item.id]);
                            } else {
                              setSelectedRABItems(prev => prev.filter(id => id !== item.id));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">
                          {item.description} - {item.quantity} {item.unit} @ {formatCurrency(item.unitPrice)}
                        </span>
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddRABItems}
                    disabled={selectedRABItems.length === 0}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    Add Selected Items
                  </button>
                </div>
              </div>
            )}

            {/* Items List */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PO Items
              </label>
              {formData.items.length > 0 ? (
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 text-sm">{item.description}</td>
                          <td className="px-3 py-2 text-sm">{item.quantity}</td>
                          <td className="px-3 py-2 text-sm">{item.unit}</td>
                          <td className="px-3 py-2 text-sm">{formatCurrency(item.unitPrice)}</td>
                          <td className="px-3 py-2 text-sm font-medium">{formatCurrency(item.totalPrice)}</td>
                          <td className="px-3 py-2 text-sm">
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  items: prev.items.filter((_, i) => i !== index)
                                }));
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="bg-gray-50 px-3 py-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total PO:</span>
                      <span className="font-bold text-lg">{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4 text-center text-gray-500">
                  Belum ada items. Pilih dari RAB atau tambah manual.
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={formData.items.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Create PO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// PO Detail Modal Component
const PODetailModal = ({ po, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full m-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Purchase Order Detail</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* PO Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm text-gray-500">PO Number</label>
              <p className="font-medium">{po.poNumber}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(po.status)}`}>
                {po.status}
              </span>
            </div>
            <div>
              <label className="text-sm text-gray-500">Supplier</label>
              <p className="font-medium">{po.supplierName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Order Date</label>
              <p className="font-medium">{formatDate(po.orderDate)}</p>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {po.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm">{item.description}</td>
                      <td className="px-4 py-2 text-sm">{item.quantity}</td>
                      <td className="px-4 py-2 text-sm">{item.unit}</td>
                      <td className="px-4 py-2 text-sm">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-4 py-2 text-sm">{formatCurrency(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="text-right">
            <p className="text-lg font-bold">Total: {formatCurrency(po.totalAmount)}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper functions
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

const getStatusIcon = (status) => {
  switch (status) {
    case 'approved': return CheckCircle;
    case 'rejected': return XCircle;
    case 'pending': return Clock;
    case 'sent': return Send;
    case 'received': return Package;
    case 'completed': return CheckCircle;
    case 'cancelled': return XCircle;
    default: return FileText;
  }
};

export default ProjectPurchaseOrders;
