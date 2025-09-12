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

const PurchaseOrderWorkflow = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'project-selection', 'create-form', 'po-detail'
  const [selectedPO, setSelectedPO] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('all');
  const [rabItems, setRABItems] = useState([]);

  useEffect(() => {
    fetchPurchaseOrderData();
    fetchProjects();
  }, []);

  const fetchPurchaseOrderData = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || '/api';
      
      const response = await fetch(`${apiUrl}/purchase-orders`, {
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

  const fetchProjects = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '/api';
      const response = await fetch(`${apiUrl}/projects`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchRABItems = async (projectId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '/api';
      const response = await fetch(`${apiUrl}/projects/${projectId}/rab`, {
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
      const apiUrl = process.env.REACT_APP_API_URL || '/api';
      const response = await fetch(`${apiUrl}/purchase-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(poData)
      });

      if (response.ok) {
        await fetchPurchaseOrderData();
        setCurrentView('list');
        setSelectedProject(null);
        alert('Purchase Order berhasil dibuat');
      }
    } catch (error) {
      console.error('Error creating purchase order:', error);
      alert('Gagal membuat Purchase Order');
    }
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    fetchRABItems(project.id);
    setCurrentView('create-form');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedProject(null);
    setSelectedPO(null);
  };

  const handleShowProjectSelection = () => {
    setCurrentView('project-selection');
  };

  const handleViewPODetail = (po) => {
    setSelectedPO(po);
    setCurrentView('po-detail');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'received': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return FileText;
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID');
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
      {/* Navigation Breadcrumb */}
      {currentView !== 'list' && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <button 
            onClick={handleBackToList}
            className="hover:text-blue-600 transition-colors"
          >
            Purchase Orders
          </button>
          <span>/</span>
          {currentView === 'project-selection' && <span>Pilih Proyek</span>}
          {currentView === 'create-form' && <span>Buat PO - {selectedProject?.name}</span>}
          {currentView === 'po-detail' && <span>Detail PO - {selectedPO?.poNumber}</span>}
        </div>
      )}

      {/* Render different views based on currentView */}
      {currentView === 'list' && (
        <PurchaseOrderListView 
          purchaseOrders={purchaseOrders}
          filter={filter}
          setFilter={setFilter}
          poSummary={poSummary}
          filteredPOs={filteredPOs}
          handleShowProjectSelection={handleShowProjectSelection}
          handleViewPODetail={handleViewPODetail}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      )}

      {currentView === 'project-selection' && (
        <ProjectSelectionView
          projects={projects}
          onSelectProject={handleProjectSelect}
          onBack={handleBackToList}
        />
      )}

      {currentView === 'create-form' && selectedProject && (
        <CreatePOView
          project={selectedProject}
          rabItems={rabItems}
          onSubmit={handleCreatePO}
          onBack={() => setCurrentView('project-selection')}
          onCancel={handleBackToList}
        />
      )}

      {currentView === 'po-detail' && selectedPO && (
        <PODetailView
          po={selectedPO}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
};

// Purchase Order List View Component
const PurchaseOrderListView = ({ 
  purchaseOrders, 
  filter, 
  setFilter, 
  poSummary, 
  filteredPOs, 
  handleShowProjectSelection,
  handleViewPODetail,
  getStatusColor,
  getStatusIcon,
  formatCurrency,
  formatDate
}) => {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Purchase Orders</h2>
          <p className="text-gray-600">Manajemen pengadaan untuk semua proyek</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleShowProjectSelection}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Buat PO Baru
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total PO</p>
              <p className="text-2xl font-bold text-gray-900">{poSummary.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{poSummary.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{poSummary.approved}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(poSummary.totalValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {['all', 'draft', 'pending', 'approved', 'sent', 'received', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'Semua' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Purchase Orders List */}
      <div className="bg-white rounded-lg border divide-y">
        {filteredPOs.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada Purchase Order</h3>
            <p className="text-gray-500 mb-4">Mulai dengan membuat Purchase Order pertama untuk proyek Anda.</p>
            <button
              onClick={handleShowProjectSelection}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Buat PO Baru
            </button>
          </div>
        ) : (
          filteredPOs.map((po) => (
            <POCard 
              key={po.id} 
              po={po} 
              onView={handleViewPODetail}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          ))
        )}
      </div>
    </>
  );
};

// Project Selection View Component
const ProjectSelectionView = ({ projects, onSelectProject, onBack }) => {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Pilih Proyek</h2>
          <p className="text-gray-600">Pilih proyek untuk membuat Purchase Order baru</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Kembali
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <Building className="h-8 w-8 text-blue-500" />
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Aktif
              </span>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">{project.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{project.location?.city || 'Lokasi tidak tersedia'}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Nilai Proyek:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                  }).format(project.totalValue || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Progress:</span>
                <span className="font-medium">{project.progress || 0}%</span>
              </div>
            </div>
            
            <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Pilih Proyek
            </button>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada proyek tersedia</h3>
          <p className="text-gray-500">Hubungi administrator untuk menambahkan proyek baru.</p>
        </div>
      )}
    </>
  );
};

// Create PO View Component
const CreatePOView = ({ project, rabItems, onSubmit, onBack, onCancel }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [supplierInfo, setSupplierInfo] = useState({
    name: '',
    contact: '',
    address: '',
    deliveryDate: ''
  });

  const handleItemToggle = (rabItem) => {
    const isSelected = selectedItems.find(item => item.id === rabItem.id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter(item => item.id !== rabItem.id));
    } else {
      setSelectedItems([...selectedItems, { 
        ...rabItem, 
        orderQuantity: 1,
        unitPrice: rabItem.unitPrice || 0
      }]);
    }
  };

  const handleQuantityChange = (itemId, quantity) => {
    setSelectedItems(selectedItems.map(item => 
      item.id === itemId ? { ...item, orderQuantity: quantity } : item
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      alert('Pilih minimal satu item untuk PO');
      return;
    }

    const poData = {
      projectId: project.id,
      projectName: project.name,
      supplierName: supplierInfo.name,
      supplierContact: supplierInfo.contact,
      supplierAddress: supplierInfo.address,
      deliveryDate: supplierInfo.deliveryDate,
      items: selectedItems.map(item => ({
        rabItemId: item.id,
        itemName: item.itemName || item.material,
        quantity: item.orderQuantity,
        unitPrice: item.unitPrice,
        totalPrice: item.orderQuantity * item.unitPrice
      })),
      totalAmount: selectedItems.reduce((sum, item) => sum + (item.orderQuantity * item.unitPrice), 0),
      status: 'draft'
    };

    onSubmit(poData);
  };

  const totalAmount = selectedItems.reduce((sum, item) => sum + (item.orderQuantity * item.unitPrice), 0);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Buat Purchase Order</h2>
          <p className="text-gray-600">Proyek: {project.name}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Kembali
          </button>
          <button
            onClick={onCancel}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Batal
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Supplier Information */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Informasi Supplier</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kontak
              </label>
              <input
                type="text"
                value={supplierInfo.contact}
                onChange={(e) => setSupplierInfo({ ...supplierInfo, contact: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat
              </label>
              <textarea
                value={supplierInfo.address}
                onChange={(e) => setSupplierInfo({ ...supplierInfo, address: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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

        {/* RAB Items Selection */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Pilih Item RAB</h3>
          {rabItems.length === 0 ? (
            <p className="text-gray-500">Tidak ada item RAB yang tersedia untuk proyek ini.</p>
          ) : (
            <div className="space-y-4">
              {rabItems.map((item) => {
                const isSelected = selectedItems.find(selected => selected.id === item.id);
                return (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-4 transition-colors ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={() => handleItemToggle(item)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.itemName || item.material}</h4>
                        <p className="text-sm text-gray-600">
                          {item.quantity} {item.unit} @ {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR'
                          }).format(item.unitPrice || 0)}
                        </p>
                        {isSelected && (
                          <div className="mt-3 flex items-center space-x-4">
                            <div>
                              <label className="block text-sm text-gray-600">Jumlah Pesan</label>
                              <input
                                type="number"
                                min="1"
                                max={item.quantity}
                                value={isSelected.orderQuantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                              />
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Total: </span>
                              <span className="font-medium">
                                {new Intl.NumberFormat('id-ID', {
                                  style: 'currency',
                                  currency: 'IDR'
                                }).format(isSelected.orderQuantity * (item.unitPrice || 0))}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary */}
        {selectedItems.length > 0 && (
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Ringkasan PO</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Item:</span>
                <span className="font-medium">{selectedItems.length} item</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total Nilai:</span>
                <span>{new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR'
                }).format(totalAmount)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={selectedItems.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buat Purchase Order
          </button>
        </div>
      </form>
    </>
  );
};

// PO Detail View Component
const PODetailView = ({ po, onBack }) => {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Detail Purchase Order</h2>
          <p className="text-gray-600">PO Number: {po.poNumber}</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Kembali
        </button>
      </div>

      {/* PO Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Informasi Umum</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  po.status === 'approved' ? 'bg-green-100 text-green-800' :
                  po.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  po.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {po.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tanggal Order</p>
                <p className="font-medium">{new Date(po.orderDate).toLocaleDateString('id-ID')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Supplier</p>
                <p className="font-medium">{po.supplierName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Proyek</p>
                <p className="font-medium">{po.projectName}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Item yang Dipesan</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Item</th>
                    <th className="text-left py-2">Qty</th>
                    <th className="text-right py-2">Harga Satuan</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {po.items?.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.itemName}</td>
                      <td className="py-2">{item.quantity}</td>
                      <td className="py-2 text-right">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR'
                        }).format(item.unitPrice)}
                      </td>
                      <td className="py-2 text-right">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR'
                        }).format(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Ringkasan</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Item:</span>
                <span className="font-medium">{po.items?.length || 0}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-lg font-medium">Total Nilai:</span>
                <span className="text-lg font-bold text-green-600">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                  }).format(po.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Aksi</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Edit className="h-4 w-4 mr-2" />
                Edit PO
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchaseOrderWorkflow;

// PO Card Component
const POCard = ({ po, onView, getStatusColor, getStatusIcon, formatCurrency, formatDate }) => {
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
              <p className="text-sm text-gray-500">Project</p>
              <p className="font-medium">{po.projectName || '-'}</p>
            </div>
          </div>

          {/* Items Preview */}
          <div className="bg-gray-50 rounded p-3 mb-4">
            <p className="text-sm text-gray-600 font-medium mb-1">Items ({po.items?.length || 0})</p>
            <div className="flex flex-wrap gap-1">
              {po.items?.slice(0, 3).map((item, index) => (
                <span key={index} className="inline-flex px-2 py-1 text-xs bg-white rounded border">
                  {item.itemName}
                </span>
              ))}
              {po.items?.length > 3 && (
                <span className="inline-flex px-2 py-1 text-xs bg-gray-200 rounded">
                  +{po.items.length - 3} lainnya
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onView(po)}
              className="flex items-center px-3 py-1 text-sm border rounded hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 mr-1" />
              Lihat Detail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
