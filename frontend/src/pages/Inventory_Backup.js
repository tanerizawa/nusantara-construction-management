import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Package, AlertTriangle, TrendingDown, FileText, Warehouse, Users, Activity, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DensityToggle from '../components/DensityToggle';
import PageActions from '../components/PageActions';
import WarehouseManagement from '../components/WarehouseManagement';
import SupplierManagement from '../components/SupplierManagement';
import StockMovementManagement from '../components/StockMovementManagement';
import PurchaseOrderManagement from '../components/PurchaseOrderManagement';

const Inventory = () => {
  const { isAuthenticated, token } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    price: '',
    supplier: '',
    warehouse: '',
    minStock: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStockCount: 0,
    uniqueCategories: 0
  });
  const [serverPagination, setServerPagination] = useState({
    count: 0,
    page: 1,
    limit: 50
  });
  const [isDense, setIsDense] = useState(false);
  const [viewMode, setViewMode] = useState('simple');
  const [activeTab, setActiveTab] = useState('inventory');

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/inventory', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }
      
      const data = await response.json();
      setInventory(data || []);
      setFilteredInventory(data || []);
      setServerPagination(prev => ({ ...prev, count: data?.length || 0 }));
      
      // Calculate stats
      if (data && data.length > 0) {
        const totalValue = data.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const lowStockCount = data.filter(item => item.quantity <= (item.minStock || 10)).length;
        const uniqueCategories = [...new Set(data.map(item => item.category))].length;
        
        setStatsData({
          totalItems: data.length,
          totalValue,
          lowStockCount,
          uniqueCategories
        });
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Gagal memuat data inventory');
      // Ensure arrays are still arrays even on error
      setInventory([]);
      setFilteredInventory([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchInventory();
    }
  }, [isAuthenticated, fetchInventory]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    
    // Ensure inventory is an array before filtering
    const inventoryArray = Array.isArray(inventory) ? inventory : [];
    
    if (!value.trim()) {
      setFilteredInventory(inventoryArray);
      return;
    }
    
    const filtered = inventoryArray.filter(item => {
      const supplierText = typeof item.supplier === 'object' && item.supplier?.primary 
        ? item.supplier.primary 
        : item.supplier || '';
      
      return item.name?.toLowerCase().includes(value.toLowerCase()) ||
        item.category?.toLowerCase().includes(value.toLowerCase()) ||
        supplierText.toLowerCase().includes(value.toLowerCase());
    });
    setFilteredInventory(filtered);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newItem)
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      await fetchInventory();
      setNewItem({
        name: '',
        category: '',
        quantity: '',
        unit: '',
        price: '',
        supplier: '',
        warehouse: '',
        minStock: ''
      });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Gagal menambah item');
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Yakin ingin menghapus item ini?')) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/inventory/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      await fetchInventory();
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Gagal menghapus item');
    }
  };

  const handleEditItem = (item) => {
    const supplierValue = typeof item.supplier === 'object' && item.supplier?.primary 
      ? item.supplier.primary 
      : item.supplier || '';
      
    setEditingItem(item);
    setNewItem({
      name: item.name || '',
      category: item.category || '',
      quantity: item.quantity?.toString() || '',
      unit: item.unit || '',
      price: item.price?.toString() || '',
      supplier: supplierValue,
      warehouse: item.warehouse || '',
      minStock: item.minStock?.toString() || ''
    });
    setShowAddForm(true);
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5001/api/inventory/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newItem)
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      await fetchInventory();
      setNewItem({
        name: '',
        category: '',
        quantity: '',
        unit: '',
        price: '',
        supplier: '',
        warehouse: '',
        minStock: ''
      });
      setShowAddForm(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Gagal mengupdate item');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-64">Silakan login terlebih dahulu</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Memuat data inventory...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
            <button
              onClick={() => {
                setError(null);
                if (isAuthenticated) {
                  fetchInventory();
                }
              }}
              className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      {/* Mode Toggle */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Inventory</h1>
          <p className="text-gray-600">Kelola stok barang dan material proyek di Karawang</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">{serverPagination.count} item</div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('simple')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                viewMode === 'simple' 
                  ? 'bg-white text-gray-900 shadow' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Simple View
            </button>
            <button
              onClick={() => setViewMode('advanced')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                viewMode === 'advanced' 
                  ? 'bg-white text-gray-900 shadow' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Advanced View
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'inventory'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package size={16} className="mr-2" />
            Inventory
          </button>
          <button
            onClick={() => setActiveTab('warehouse')}
            className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'warehouse'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Warehouse size={16} className="mr-2" />
            Warehouse
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'suppliers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users size={16} className="mr-2" />
            Suppliers
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'movements'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Activity size={16} className="mr-2" />
            Stock Movement
          </button>
          <button
            onClick={() => setActiveTab('purchase-orders')}
            className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'purchase-orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ShoppingCart size={16} className="mr-2" />
            Purchase Orders
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'inventory' && (
        <>          
          {/* Traditional Inventory Mode */}
          {viewMode === 'simple' && (
            <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <Package className="h-12 w-12 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Item</p>
                  <p className="text-2xl font-bold text-gray-900">{statsData.totalItems}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <FileText className="h-12 w-12 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Nilai</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(statsData.totalValue)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-12 w-12 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Stok Rendah</p>
                  <p className="text-2xl font-bold text-gray-900">{statsData.lowStockCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <TrendingDown className="h-12 w-12 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Kategori</p>
                  <p className="text-2xl font-bold text-gray-900">{statsData.uniqueCategories}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <input
                type="text"
                placeholder="Cari item..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full sm:w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <DensityToggle isDense={isDense} onToggle={setIsDense} />
            </div>
            <PageActions>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={16} />
                Tambah Item
              </button>
            </PageActions>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
              <button 
                onClick={() => setError(null)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">
                {editingItem ? 'Edit Item' : 'Tambah Item Baru'}
              </h2>
              <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Item</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih kategori</option>
                    <option value="Material">Material</option>
                    <option value="Alat">Alat</option>
                    <option value="Consumable">Consumable</option>
                    <option value="Safety">Safety</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="pcs, kg, m2, dll"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <input
                    type="text"
                    value={newItem.supplier}
                    onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gudang</label>
                  <select
                    value={newItem.warehouse}
                    onChange={(e) => setNewItem({ ...newItem, warehouse: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih gudang</option>
                    <option value="Gudang Utama">Gudang Utama</option>
                    <option value="Gudang Proyek A">Gudang Proyek A</option>
                    <option value="Gudang Proyek B">Gudang Proyek B</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stok</label>
                  <input
                    type="number"
                    value={newItem.minStock}
                    onChange={(e) => setNewItem({ ...newItem, minStock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10"
                  />
                </div>

                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    {editingItem ? 'Update' : 'Tambah'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingItem(null);
                      setNewItem({
                        name: '',
                        category: '',
                        quantity: '',
                        unit: '',
                        price: '',
                        supplier: '',
                        warehouse: '',
                        minStock: ''
                      });
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Data Table */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada data inventory</h3>
              <p className="text-gray-600">Tambahkan item pertama untuk memulai</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className={`min-w-full divide-y divide-gray-200 ${isDense ? 'text-sm' : ''}`}>
                  <thead className="bg-gray-50">
                    <tr>
                      <th className={`px-6 ${isDense ? 'py-2' : 'py-3'} text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                        Item
                      </th>
                      <th className={`px-6 ${isDense ? 'py-2' : 'py-3'} text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                        Kategori
                      </th>
                      <th className={`px-6 ${isDense ? 'py-2' : 'py-3'} text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                        Stok
                      </th>
                      <th className={`px-6 ${isDense ? 'py-2' : 'py-3'} text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                        Harga
                      </th>
                      <th className={`px-6 ${isDense ? 'py-2' : 'py-3'} text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                        Supplier
                      </th>
                      <th className={`px-6 ${isDense ? 'py-2' : 'py-3'} text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                        Status
                      </th>
                      <th className={`px-6 ${isDense ? 'py-2' : 'py-3'} text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(Array.isArray(filteredInventory) ? filteredInventory : []).map((item, index) => {
                      const isLowStock = item.quantity <= (item.minStock || 10);
                      return (
                        <tr key={item.id || index} className="hover:bg-gray-50">
                          <td className={`px-6 ${isDense ? 'py-2' : 'py-4'} whitespace-nowrap`}>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.warehouse}</div>
                            </div>
                          </td>
                          <td className={`px-6 ${isDense ? 'py-2' : 'py-4'} whitespace-nowrap`}>
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {item.category}
                            </span>
                          </td>
                          <td className={`px-6 ${isDense ? 'py-2' : 'py-4'} whitespace-nowrap text-sm text-gray-900`}>
                            <div className={isLowStock ? 'text-red-600 font-medium' : ''}>
                              {item.quantity} {item.unit}
                            </div>
                          </td>
                          <td className={`px-6 ${isDense ? 'py-2' : 'py-4'} whitespace-nowrap text-sm text-gray-900`}>
                            {formatCurrency(item.price)}
                          </td>
                          <td className={`px-6 ${isDense ? 'py-2' : 'py-4'} whitespace-nowrap text-sm text-gray-500`}>
                            {typeof item.supplier === 'object' && item.supplier?.primary 
                              ? item.supplier.primary 
                              : item.supplier || '-'}
                          </td>
                          <td className={`px-6 ${isDense ? 'py-2' : 'py-4'} whitespace-nowrap`}>
                            {isLowStock ? (
                              <span className="flex items-center text-red-600">
                                <AlertTriangle size={16} className="mr-1" />
                                Stok Rendah
                              </span>
                            ) : (
                              <span className="text-green-600">Normal</span>
                            )}
                          </td>
                          <td className={`px-6 ${isDense ? 'py-2' : 'py-4'} whitespace-nowrap text-sm font-medium`}>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditItem(item)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    
                    {/* Empty state */}
                    {(!Array.isArray(filteredInventory) || filteredInventory.length === 0) && (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <Package className="w-12 h-12 text-gray-400" />
                            <p className="text-gray-500 text-lg">
                              {searchTerm ? 'Tidak ada item yang sesuai dengan pencarian' : 'Belum ada data inventory'}
                            </p>
                            {!searchTerm && (
                              <button
                                onClick={() => setShowAddForm(true)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Item Pertama
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          </>
        )}
        </>
      )}

      {/* Warehouse Management Tab */}
      {activeTab === 'warehouse' && <WarehouseManagement />}
      
      {/* Supplier Management Tab */}
      {activeTab === 'suppliers' && <SupplierManagement />}
      
      {/* Stock Movement Tab */}
      {activeTab === 'movements' && <StockMovementManagement />}
      
      {/* Purchase Orders Tab */}
      {activeTab === 'purchase-orders' && <PurchaseOrderManagement />}
    </div>
  );
};

export default Inventory;
