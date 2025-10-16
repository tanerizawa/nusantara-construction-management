import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MapPin, 
  Package, 
  Edit, 
  Trash2, 
  Building,
  Users,
  TrendingUp,
  Search,
  Filter,
  Download,
  BarChart3
} from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

/**
 * Warehouse Management Component - Phase 3 Week 7-8
 * Enhanced warehouse and location management
 */

const WarehouseManagement = () => {
  // const { token } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  // const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [warehouseStats, setWarehouseStats] = useState({
    totalWarehouses: 0,
    totalCapacity: 0,
    activeWarehouses: 0,
    itemsStored: 0,
    occupancyRate: 0
  });

  const [newWarehouse, setNewWarehouse] = useState({
    name: '',
    location: '',
    type: 'main',
    capacity: '',
    manager: '',
    contact: '',
    address: '',
    status: 'active'
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API
      const mockWarehouses = [
        {
          id: 1,
          name: 'Gudang Utama Karawang',
          location: 'Karawang Timur',
          type: 'main',
          capacity: 10000,
          currentStock: 7500,
          manager: 'Budi Santoso',
          contact: '0812-3456-7890',
          address: 'Jl. Industri No. 123, Karawang',
          status: 'active',
          staff: 12,
          lastActivity: '2024-01-15',
          items: 234
        },
        {
          id: 2,
          name: 'Gudang Proyek A',
          location: 'Site Proyek A',
          type: 'project',
          capacity: 5000,
          currentStock: 3200,
          manager: 'Siti Rahayu',
          contact: '0813-7890-1234',
          address: 'Site Proyek Perumahan ABC',
          status: 'active',
          staff: 6,
          lastActivity: '2024-01-14',
          items: 156
        },
        {
          id: 3,
          name: 'Gudang Proyek B',
          location: 'Site Proyek B',
          type: 'project',
          capacity: 3000,
          currentStock: 1800,
          manager: 'Ahmad Wijaya',
          contact: '0814-5678-9012',
          address: 'Site Proyek Komersial XYZ',
          status: 'maintenance',
          staff: 4,
          lastActivity: '2024-01-13',
          items: 89
        }
      ];

      setWarehouses(mockWarehouses);
      
      // Calculate stats
      const totalCapacity = mockWarehouses.reduce((sum, w) => sum + w.capacity, 0);
      const totalStock = mockWarehouses.reduce((sum, w) => sum + w.currentStock, 0);
      const occupancyRate = totalCapacity > 0 ? (totalStock / totalCapacity) * 100 : 0;
      // const activeStaff = mockWarehouses.reduce((sum, w) => sum + w.staff, 0);

      setWarehouseStats({
        totalWarehouses: mockWarehouses.length,
        totalCapacity,
        activeWarehouses: mockWarehouses.filter(w => w.status === 'active').length,
        itemsStored: mockWarehouses.reduce((sum, w) => sum + w.items, 0),
        occupancyRate
      });
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWarehouse = async (e) => {
    e.preventDefault();
    try {
      // Mock API call
      const newId = warehouses.length + 1;
      const warehouse = {
        ...newWarehouse,
        id: newId,
        currentStock: 0,
        staff: 0,
        lastActivity: new Date().toISOString().split('T')[0],
        items: 0,
        capacity: parseInt(newWarehouse.capacity)
      };
      
      setWarehouses([...warehouses, warehouse]);
      setNewWarehouse({
        name: '',
        location: '',
        type: 'main',
        capacity: '',
        manager: '',
        contact: '',
        address: '',
        status: 'active'
      });
      setShowAddForm(false);
      
      // Refresh stats
      await fetchWarehouses();
    } catch (error) {
      console.error('Error adding warehouse:', error);
    }
  };

  const handleDeleteWarehouse = async (warehouseId) => {
    if (!window.confirm('Yakin ingin menghapus gudang ini?')) return;
    
    try {
      setWarehouses(warehouses.filter(w => w.id !== warehouseId));
    } catch (error) {
      console.error('Error deleting warehouse:', error);
    }
  };

  const getOccupancyColor = (occupancy) => {
    if (occupancy >= 90) return 'text-red-600 bg-red-100';
    if (occupancy >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCapacity = (capacity) => {
    return new Intl.NumberFormat('id-ID').format(capacity) + ' m³';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'warehouses', label: 'Gudang', icon: Building }
  ];

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Gudang</h1>
          <p className="text-gray-600">Kelola gudang dan fasilitas penyimpanan</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download size={16} className="mr-2" />
            Export
          </button>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} className="mr-2" />
            Tambah Gudang
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} className="mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <Building className="h-12 w-12 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Gudang</p>
                  <p className="text-2xl font-bold text-gray-900">{warehouseStats.totalWarehouses}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <Package className="h-12 w-12 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Kapasitas</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCapacity(warehouseStats.totalCapacity)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <TrendingUp className="h-12 w-12 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tingkat Okupansi</p>
                  <p className="text-2xl font-bold text-gray-900">{warehouseStats.occupancyRate.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <Users className="h-12 w-12 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Items Tersimpan</p>
                  <p className="text-2xl font-bold text-gray-900">{warehouseStats.itemsStored}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Overview */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Ringkasan Gudang</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {warehouses.slice(0, 3).map((warehouse) => {
                const occupancy = (warehouse.currentStock / warehouse.capacity) * 100;
                return (
                  <div key={warehouse.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-900">{warehouse.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(warehouse.status)}`}>
                        {warehouse.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Lokasi:</span>
                        <span>{warehouse.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Manager:</span>
                        <span>{warehouse.manager}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Okupansi:</span>
                        <span className={`px-2 py-1 rounded ${getOccupancyColor(occupancy)}`}>
                          {occupancy.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'warehouses' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Cari gudang..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={16} className="mr-2" />
                Filter
              </button>
            </div>
          </div>

          {/* Add Warehouse Form */}
          {showAddForm && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Tambah Gudang Baru</h3>
              <form onSubmit={handleAddWarehouse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Gudang</label>
                  <input
                    type="text"
                    value={newWarehouse.name}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                  <input
                    type="text"
                    value={newWarehouse.location}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Gudang</label>
                  <select
                    value={newWarehouse.type}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="main">Gudang Utama</option>
                    <option value="project">Gudang Proyek</option>
                    <option value="temporary">Gudang Sementara</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas (m³)</label>
                  <input
                    type="number"
                    value={newWarehouse.capacity}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, capacity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                  <input
                    type="text"
                    value={newWarehouse.manager}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, manager: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kontak</label>
                  <input
                    type="text"
                    value={newWarehouse.contact}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, contact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <textarea
                    value={newWarehouse.address}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, address: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Warehouses Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gudang
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kapasitas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Okupansi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manager
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
                  {filteredWarehouses.map((warehouse) => {
                    const occupancy = warehouse.capacity > 0 ? (warehouse.currentStock / warehouse.capacity) * 100 : 0;
                    return (
                      <tr key={warehouse.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{warehouse.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <MapPin size={12} className="mr-1" />
                              {warehouse.location}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div>{formatCapacity(warehouse.capacity)}</div>
                            <div className="text-xs text-gray-500">{warehouse.items} items</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${occupancy >= 90 ? 'bg-red-500' : occupancy >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${Math.min(occupancy, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-900">{occupancy.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">{warehouse.manager}</div>
                            <div className="text-sm text-gray-500">{warehouse.contact}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(warehouse.status)}`}>
                            {warehouse.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteWarehouse(warehouse.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseManagement;
