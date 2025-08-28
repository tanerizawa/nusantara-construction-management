import React, { useState, useEffect } from 'react';
import { Plus, FileText, Check, X, Clock, Download, Eye } from 'lucide-react';
import axios from 'axios';

// Phase 3 Components
import Button from './ui/Button';
import Card, { KPICard } from './ui/Card';
import DataCard from './ui/DataCard';
import PageLoader from './ui/PageLoader';
import { Modal } from './ui/Modal';
import { Alert } from './ui/Alert';

/**
 * Purchase Order Management Component - Phase 3 Week 5
 * Apple HIG compliant purchase order workflow
 */

const PurchaseOrderManagement = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showNewPOModal, setShowNewPOModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [poStats, setPOStats] = useState({
    totalPOs: 0,
    pendingPOs: 0,
    approvedPOs: 0,
    totalValue: 0
  });

  useEffect(() => {
    fetchPurchaseOrders();
    fetchPOStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter]);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/purchase-orders', {
        params: {
          q: searchTerm || undefined,
          status: statusFilter || undefined
        }
      });
      setPurchaseOrders(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPOStats = async () => {
    try {
      const response = await axios.get('/purchase-orders/stats');
      setPOStats(response.data || {
        totalPOs: 0,
        pendingPOs: 0,
        approvedPOs: 0,
        totalValue: 0
      });
    } catch (error) {
      console.error('Error fetching PO stats:', error);
    }
  };

  const handleApprove = async (poId) => {
    try {
      await axios.put(`/purchase-orders/${poId}/approve`);
      fetchPurchaseOrders();
      fetchPOStats();
      Alert.success('Purchase Order berhasil disetujui');
    } catch (error) {
      console.error('Error approving PO:', error);
      Alert.error('Gagal menyetujui Purchase Order');
    }
  };

  const handleReject = async (poId) => {
    try {
      await axios.put(`/purchase-orders/${poId}/reject`);
      fetchPurchaseOrders();
      fetchPOStats();
      Alert.success('Purchase Order berhasil ditolak');
    } catch (error) {
      console.error('Error rejecting PO:', error);
      Alert.error('Gagal menolak Purchase Order');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return '-';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'received': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'approved': return 'Disetujui';
      case 'rejected': return 'Ditolak';
      case 'received': return 'Diterima';
      default: return status;
    }
  };

  if (loading) {
    return <PageLoader size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Order</h1>
          <p className="text-gray-600">Kelola pemesanan material dan equipment</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowNewPOModal(true)}
          icon={<Plus />}
        >
          PO Baru
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Total PO"
          value={poStats.totalPOs}
          icon={FileText}
          color="blue"
          subtitle="Semua pesanan"
        />
        <KPICard
          title="Menunggu Approval"
          value={poStats.pendingPOs}
          icon={Clock}
          color="orange"
          subtitle="Perlu disetujui"
        />
        <KPICard
          title="Disetujui"
          value={poStats.approvedPOs}
          icon={Check}
          color="green"
          subtitle="Siap diproses"
        />
        <KPICard
          title="Total Nilai"
          value={formatCurrency(poStats.totalValue)}
          icon={FileText}
          color="purple"
          subtitle="Keseluruhan"
        />
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Cari berdasarkan nomor PO atau supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
              <option value="received">Diterima</option>
            </select>
          </div>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-1.5" />
            Export
          </Button>
        </div>
      </Card>

      {/* PO Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nomor PO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{po.poNumber}</div>
                    <div className="text-sm text-gray-500">{po.project?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{po.supplier?.name}</div>
                    <div className="text-sm text-gray-500">{po.supplier?.contact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(po.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(po.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(po.status)}`}>
                      {getStatusLabel(po.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPO(po)}
                    >
                      <Eye size={16} />
                    </Button>
                    {po.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprove(po.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReject(po.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={16} />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Empty State */}
      {purchaseOrders.length === 0 && (
        <DataCard
          title={searchTerm ? 'Tidak ada PO yang ditemukan' : 'Belum ada Purchase Order'}
          subtitle={searchTerm ? 'Coba ubah kata kunci pencarian' : 'Mulai dengan membuat PO baru'}
          isEmpty
        />
      )}

      {/* New PO Modal */}
      <Modal
        isOpen={showNewPOModal}
        onClose={() => setShowNewPOModal(false)}
        title="Purchase Order Baru"
        size="lg"
      >
        <PurchaseOrderForm
          onSuccess={() => {
            setShowNewPOModal(false);
            fetchPurchaseOrders();
            fetchPOStats();
          }}
        />
      </Modal>

      {/* PO Detail Modal */}
      <Modal
        isOpen={selectedPO}
        onClose={() => setSelectedPO(null)}
        title={`Purchase Order ${selectedPO?.poNumber}`}
        size="lg"
      >
        {selectedPO && (
          <PurchaseOrderDetail 
            po={selectedPO}
            onClose={() => setSelectedPO(null)}
          />
        )}
      </Modal>
    </div>
  );
};

// Purchase Order Form Component
const PurchaseOrderForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    projectId: '',
    supplierId: '',
    notes: '',
    items: [{ itemId: '', quantity: '', unitPrice: '', description: '' }]
  });
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchSuppliers();
    fetchInventory();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/projects');
      setProjects(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('/suppliers');
      setSuppliers(response.data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await axios.get('/inventory');
      setInventory(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemId: '', quantity: '', unitPrice: '', description: '' }]
    });
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index, field, value) => {
    const updatedItems = formData.items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post('/purchase-orders', {
        ...formData,
        items: formData.items.map(item => ({
          ...item,
          quantity: parseInt(item.quantity),
          unitPrice: parseFloat(item.unitPrice)
        }))
      });
      Alert.success('Purchase Order berhasil dibuat');
      onSuccess();
    } catch (error) {
      console.error('Error creating PO:', error);
      Alert.error('Gagal membuat Purchase Order');
    } finally {
      setLoading(false);
    }
  };

  const getTotalAmount = () => {
    return formData.items.reduce((total, item) => {
      const subtotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
      return total + subtotal;
    }, 0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Proyek *
          </label>
          <select
            required
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Pilih Proyek</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supplier *
          </label>
          <select
            required
            value={formData.supplierId}
            onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Pilih Supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Items */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Item Pesanan *
          </label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus size={16} className="mr-1" />
            Tambah Item
          </Button>
        </div>
        
        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 p-3 border border-gray-200 rounded-lg">
            <div>
              <select
                value={item.itemId}
                onChange={(e) => updateItem(index, 'itemId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Pilih Item</option>
                {inventory.map((invItem) => (
                  <option key={invItem.id} value={invItem.id}>
                    {invItem.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="number"
                placeholder="Jumlah"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Harga Satuan"
                min="0"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Keterangan"
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex items-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Catatan
        </label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Total */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Total:</span>
          <span className="text-xl font-bold text-blue-600">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0
            }).format(getTotalAmount())}
          </span>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" type="button" onClick={onSuccess}>
          Batal
        </Button>
        <Button variant="primary" type="submit" loading={loading}>
          Buat Purchase Order
        </Button>
      </div>
    </form>
  );
};

// Purchase Order Detail Component
const PurchaseOrderDetail = ({ po, onClose }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* PO Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Pesanan</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Nomor PO:</span>
              <span className="font-medium">{po.poNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Proyek:</span>
              <span className="font-medium">{po.project?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                po.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                po.status === 'approved' ? 'bg-green-100 text-green-800' :
                po.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {po.status === 'pending' ? 'Menunggu' :
                 po.status === 'approved' ? 'Disetujui' :
                 po.status === 'rejected' ? 'Ditolak' : 'Diterima'}
              </span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Supplier</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Nama:</span>
              <span className="font-medium">{po.supplier?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kontak:</span>
              <span className="font-medium">{po.supplier?.contact}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{po.supplier?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Item Pesanan</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {po.items?.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.item?.name || item.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Total Pesanan:</span>
          <span className="text-xl font-bold text-blue-600">
            {formatCurrency(po.totalAmount)}
          </span>
        </div>
      </div>

      {/* Notes */}
      {po.notes && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Catatan</h3>
          <p className="text-gray-600">{po.notes}</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Tutup
        </Button>
      </div>
    </div>
  );
};

export default PurchaseOrderManagement;
