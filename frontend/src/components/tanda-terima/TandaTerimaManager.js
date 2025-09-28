import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  X,
  Trash2,
  User,
  Calendar,
  MapPin,
  Phone,
  FileText,
  Camera,
  Download,
  Search,
  Filter,
  RefreshCw,
  Archive,
  ClipboardCheck,
  UserCheck,
  AlertCircle
} from 'lucide-react';

const TandaTerimaManager = ({ projectId, project, onReceiptChange }) => {
  const [receipts, setReceipts] = useState([]);
  const [availablePOs, setAvailablePOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    purchaseOrderId: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    deliveryLocation: '',
    receiverName: '',
    receiverPosition: '',
    receiverPhone: '',
    supplierDeliveryPerson: '',
    supplierDeliveryPhone: '',
    vehicleNumber: '',
    deliveryMethod: 'truck',
    receiptType: 'full_delivery',
    items: [],
    qualityNotes: '',
    conditionNotes: '',
    deliveryNotes: '',
    photos: [],
    documents: []
  });

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return 'Rp 0';
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericAmount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Status configuration
  const getStatusInfo = (status) => {
    const statusMap = {
      'pending_delivery': {
        label: 'Menunggu Pengiriman',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock
      },
      'partial_delivered': {
        label: 'Pengiriman Sebagian',
        color: 'bg-blue-100 text-blue-800',
        icon: Package
      },
      'fully_delivered': {
        label: 'Pengiriman Lengkap',
        color: 'bg-purple-100 text-purple-800',
        icon: Truck
      },
      'received': {
        label: 'Diterima',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle
      },
      'completed': {
        label: 'Selesai',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle
      },
      'rejected': {
        label: 'Ditolak',
        color: 'bg-red-100 text-red-800',
        icon: AlertTriangle
      }
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
  };

  // Fetch delivery receipts
  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}/delivery-receipts`);
      if (response.ok) {
        const result = await response.json();
        setReceipts(result.data || []);
      } else {
        console.error('Failed to fetch delivery receipts');
        setReceipts([]);
      }
    } catch (error) {
      console.error('Error fetching delivery receipts:', error);
      setReceipts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available POs for delivery receipt creation
  const fetchAvailablePOs = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/delivery-receipts/available-pos`);
      if (response.ok) {
        const result = await response.json();
        setAvailablePOs(result.data || []);
      } else {
        console.error('Failed to fetch available POs');
        setAvailablePOs([]);
      }
    } catch (error) {
      console.error('Error fetching available POs:', error);
      setAvailablePOs([]);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchReceipts();
      fetchAvailablePOs();
    }
  }, [projectId]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-populate items when PO is selected
    if (field === 'purchaseOrderId' && value) {
      const selectedPO = availablePOs.find(po => po.id === value);
      if (selectedPO && selectedPO.items) {
        const items = selectedPO.items.map(item => ({
          itemName: item.itemName || item.name,
          orderedQuantity: item.quantity || 0,
          deliveredQuantity: 0,
          unitPrice: item.unitPrice || 0,
          unit: item.unit || 'pcs',
          condition: 'good',
          notes: ''
        }));
        setFormData(prev => ({
          ...prev,
          items
        }));
      }
    }
  };

  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  // Create delivery receipt
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);

      const payload = {
        ...formData,
        deliveryDate: formData.deliveryDate || new Date().toISOString()
      };

      const response = await fetch(`/api/projects/${projectId}/delivery-receipts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowCreateModal(false);
        resetForm();
        fetchReceipts();
        fetchAvailablePOs();
        if (onReceiptChange) onReceiptChange();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to create delivery receipt'}`);
      }
    } catch (error) {
      console.error('Error creating delivery receipt:', error);
      alert('Error creating delivery receipt');
    } finally {
      setCreating(false);
    }
  };

  // Approve receipt
  const handleApprove = async (receiptId) => {
    if (!window.confirm('Apakah Anda yakin ingin menyetujui tanda terima ini?')) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/delivery-receipts/${receiptId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inspectionResult: 'passed',
          qualityNotes: 'Approved by system',
          conditionNotes: 'Quality check passed'
        })
      });

      if (response.ok) {
        fetchReceipts();
        fetchAvailablePOs();
        if (onReceiptChange) onReceiptChange();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to approve receipt'}`);
      }
    } catch (error) {
      console.error('Error approving receipt:', error);
      alert('Error approving receipt');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      purchaseOrderId: '',
      deliveryDate: new Date().toISOString().split('T')[0],
      deliveryLocation: '',
      receiverName: '',
      receiverPosition: '',
      receiverPhone: '',
      supplierDeliveryPerson: '',
      supplierDeliveryPhone: '',
      vehicleNumber: '',
      deliveryMethod: 'truck',
      receiptType: 'full_delivery',
      items: [],
      qualityNotes: '',
      conditionNotes: '',
      deliveryNotes: '',
      photos: [],
      documents: []
    });
  };

  // Filter receipts
  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = !searchTerm || 
      receipt.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.purchaseOrder?.poNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.purchaseOrder?.supplierName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || receipt.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Summary calculations
  const summary = {
    total: receipts.length,
    pending: receipts.filter(r => r.status === 'pending_delivery').length,
    received: receipts.filter(r => r.status === 'received' || r.status === 'completed').length,
    rejected: receipts.filter(r => r.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tanda Terima</h2>
          <p className="text-gray-600">Manajemen tanda terima pengiriman untuk Purchase Orders</p>
        </div>
        <button
          onClick={() => {
            fetchAvailablePOs();
            setShowCreateModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Buat Tanda Terima
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tanda Terima</p>
              <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Menunggu</p>
              <p className="text-2xl font-bold text-gray-900">{summary.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Diterima</p>
              <p className="text-2xl font-bold text-gray-900">{summary.received}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ditolak</p>
              <p className="text-2xl font-bold text-gray-900">{summary.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available POs Alert */}
      {availablePOs.filter(po => po.canCreateReceipt).length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                PO Siap untuk Tanda Terima
              </h3>
              <p className="text-sm text-blue-600 mt-1">
                Ada {availablePOs.filter(po => po.canCreateReceipt).length} Purchase Order yang sudah approved 
                dan siap untuk dibuat tanda terimanya.
              </p>
              <button
                onClick={() => {
                  fetchAvailablePOs();
                  setShowCreateModal(true);
                }}
                className="text-sm text-blue-700 hover:text-blue-800 font-medium mt-2"
              >
                Buat Tanda Terima →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cari</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Cari nomor tanda terima, PO, atau supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="pending_delivery">Menunggu Pengiriman</option>
              <option value="partial_delivered">Pengiriman Sebagian</option>
              <option value="fully_delivered">Pengiriman Lengkap</option>
              <option value="received">Diterima</option>
              <option value="completed">Selesai</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                fetchReceipts();
                fetchAvailablePOs();
              }}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Receipts List */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {filteredReceipts.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Tanda Terima</h3>
            <p className="text-gray-600 mb-6">
              {availablePOs.filter(po => po.canCreateReceipt).length > 0
                ? `Ada ${availablePOs.filter(po => po.canCreateReceipt).length} PO yang siap untuk dibuat tanda terimanya.`
                : 'Belum ada Purchase Order yang approved untuk project ini.'}
            </p>
            {availablePOs.filter(po => po.canCreateReceipt).length > 0 && (
              <button
                onClick={() => {
                  fetchAvailablePOs();
                  setShowCreateModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Buat Tanda Terima Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanda Terima
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchase Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Penerima
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReceipts.map((receipt) => {
                  const statusInfo = getStatusInfo(receipt.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <tr key={receipt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {receipt.receiptNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {receipt.receiptType === 'full_delivery' ? 'Pengiriman Penuh' : 'Pengiriman Sebagian'}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {receipt.purchaseOrder?.poNumber || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {receipt.purchaseOrder?.supplierName || 'N/A'}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {receipt.receiverName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {receipt.receiverPosition || 'N/A'}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          Diterima: {formatDate(receipt.receivedDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Kirim: {formatDate(receipt.deliveryDate)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setSelectedReceipt(receipt)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Lihat Detail"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {(receipt.status === 'received' || receipt.status === 'pending_delivery') && (
                            <button
                              onClick={() => handleApprove(receipt.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Setujui"
                            >
                              <UserCheck className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Buat Tanda Terima Baru</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purchase Order <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.purchaseOrderId}
                      onChange={(e) => handleInputChange('purchaseOrderId', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Pilih Purchase Order</option>
                      {availablePOs.filter(po => po.canCreateReceipt).map((po) => (
                        <option key={po.id} value={po.id}>
                          {po.poNumber} - {po.supplierName} ({formatCurrency(po.totalAmount)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Pengiriman <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lokasi Pengiriman <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.deliveryLocation}
                      onChange={(e) => handleInputChange('deliveryLocation', e.target.value)}
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Alamat lengkap lokasi pengiriman..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Metode Pengiriman
                    </label>
                    <select
                      value={formData.deliveryMethod}
                      onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="truck">Truck</option>
                      <option value="pickup">Pickup</option>
                      <option value="van">Van</option>
                      <option value="container">Container</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>
                </div>

                {/* Receiver Info */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Informasi Penerima</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Penerima <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.receiverName}
                        onChange={(e) => handleInputChange('receiverName', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nama lengkap penerima"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jabatan
                      </label>
                      <input
                        type="text"
                        value={formData.receiverPosition}
                        onChange={(e) => handleInputChange('receiverPosition', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Site Manager, Supervisor, dll"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        value={formData.receiverPhone}
                        onChange={(e) => handleInputChange('receiverPhone', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                {formData.items.length > 0 && (
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Daftar Barang</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dipesan</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dikirim</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kondisi</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Catatan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {formData.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.itemName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {formatCurrency(item.unitPrice)}/{item.unit}
                                </div>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {item.orderedQuantity} {item.unit}
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  type="number"
                                  value={item.deliveredQuantity}
                                  onChange={(e) => handleItemChange(index, 'deliveredQuantity', parseFloat(e.target.value) || 0)}
                                  className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                                  min="0"
                                  max={item.orderedQuantity}
                                />
                              </td>
                              <td className="px-4 py-2">
                                <select
                                  value={item.condition}
                                  onChange={(e) => handleItemChange(index, 'condition', e.target.value)}
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                >
                                  <option value="good">Baik</option>
                                  <option value="damaged">Rusak</option>
                                  <option value="incomplete">Tidak Lengkap</option>
                                </select>
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  type="text"
                                  value={item.notes}
                                  onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                  placeholder="Catatan item..."
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Catatan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catatan Kualitas
                      </label>
                      <textarea
                        value={formData.qualityNotes}
                        onChange={(e) => handleInputChange('qualityNotes', e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Kondisi kualitas barang yang diterima..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catatan Pengiriman
                      </label>
                      <textarea
                        value={formData.deliveryNotes}
                        onChange={(e) => handleInputChange('deliveryNotes', e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Catatan proses pengiriman..."
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={creating || !formData.purchaseOrderId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {creating ? 'Membuat...' : 'Buat Tanda Terima'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Detail Tanda Terima</h3>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Informasi Tanda Terima</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nomor:</span>
                        <span className="font-medium">{selectedReceipt.receiptNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tanggal Diterima:</span>
                        <span className="font-medium">{formatDate(selectedReceipt.receivedDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tanggal Kirim:</span>
                        <span className="font-medium">{formatDate(selectedReceipt.deliveryDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(selectedReceipt.status).color}`}>
                          {getStatusInfo(selectedReceipt.status).label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Informasi PO</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nomor PO:</span>
                        <span className="font-medium">{selectedReceipt.purchaseOrder?.poNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Supplier:</span>
                        <span className="font-medium">{selectedReceipt.purchaseOrder?.supplierName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total PO:</span>
                        <span className="font-medium">{formatCurrency(selectedReceipt.purchaseOrder?.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Receiver Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Informasi Penerima</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Nama:</span>
                      <p className="font-medium">{selectedReceipt.receiverName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Jabatan:</span>
                      <p className="font-medium">{selectedReceipt.receiverPosition || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Telepon:</span>
                      <p className="font-medium">{selectedReceipt.receiverPhone || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                {selectedReceipt.items && selectedReceipt.items.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Daftar Barang</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-200 rounded-lg text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium text-gray-500">Item</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-500">Dipesan</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-500">Diterima</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-500">Kondisi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedReceipt.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 font-medium">{item.itemName}</td>
                              <td className="px-4 py-2">{item.orderedQuantity} {item.unit}</td>
                              <td className="px-4 py-2">{item.deliveredQuantity} {item.unit}</td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.condition === 'good' ? 'bg-green-100 text-green-800' :
                                  item.condition === 'damaged' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {item.condition === 'good' ? 'Baik' : 
                                   item.condition === 'damaged' ? 'Rusak' : 'Tidak Lengkap'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {(selectedReceipt.qualityNotes || selectedReceipt.deliveryNotes || selectedReceipt.conditionNotes) && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Catatan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {selectedReceipt.qualityNotes && (
                        <div>
                          <span className="text-gray-600 font-medium">Kualitas:</span>
                          <p className="mt-1 text-gray-800">{selectedReceipt.qualityNotes}</p>
                        </div>
                      )}
                      {selectedReceipt.deliveryNotes && (
                        <div>
                          <span className="text-gray-600 font-medium">Pengiriman:</span>
                          <p className="mt-1 text-gray-800">{selectedReceipt.deliveryNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  {(selectedReceipt.status === 'received' || selectedReceipt.status === 'pending_delivery') && (
                    <button
                      onClick={() => {
                        handleApprove(selectedReceipt.id);
                        setSelectedReceipt(null);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <UserCheck className="h-4 w-4" />
                      Setujui Tanda Terima
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedReceipt(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TandaTerimaManager;