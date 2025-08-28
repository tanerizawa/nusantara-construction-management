import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Phone,
  Mail,
  MapPin,
  Star,
  TrendingUp,
  Package,
  Clock,
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

/**
 * Supplier Management Component - Phase 3 Week 7-8
 * Enhanced supplier relationship management
 */

const SupplierManagement = () => {
  // const { token } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [supplierStats, setSupplierStats] = useState({
    totalSuppliers: 0,
    activeSuppliers: 0,
    averageRating: 0,
    totalOrders: 0,
    totalValue: 0
  });

  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    category: 'material',
    rating: 5,
    status: 'active',
    notes: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API
      const mockSuppliers = [
        {
          id: 1,
          name: 'PT Semen Indonesia',
          contact: 'Ahmad Fauzi',
          email: 'ahmad@semenindonesia.co.id',
          phone: '021-8765-4321',
          address: 'Jakarta Selatan',
          category: 'material',
          rating: 4.8,
          status: 'active',
          totalOrders: 45,
          totalValue: 2850000000,
          lastOrder: '2024-01-10',
          performance: 98,
          notes: 'Supplier utama untuk semen dan material dasar'
        },
        {
          id: 2,
          name: 'CV Baja Konstruksi',
          contact: 'Siti Nurhaliza',
          email: 'siti@bajakonstruksi.com',
          phone: '022-1234-5678',
          address: 'Bandung',
          category: 'steel',
          rating: 4.5,
          status: 'active',
          totalOrders: 32,
          totalValue: 1950000000,
          lastOrder: '2024-01-08',
          performance: 94,
          notes: 'Spesialis baja dan material logam'
        },
        {
          id: 3,
          name: 'Toko Alat Berat Jaya',
          contact: 'Bambang Suryono',
          email: 'bambang@alatberatjaya.co.id',
          phone: '024-9876-5432',
          address: 'Semarang',
          category: 'equipment',
          rating: 4.2,
          status: 'active',
          totalOrders: 18,
          totalValue: 850000000,
          lastOrder: '2024-01-05',
          performance: 87,
          notes: 'Penyedia alat berat dan peralatan konstruksi'
        },
        {
          id: 4,
          name: 'Safety Equipment Pro',
          contact: 'Diana Putri',
          email: 'diana@safetyequipment.com',
          phone: '031-5555-6666',
          address: 'Surabaya',
          category: 'safety',
          rating: 4.7,
          status: 'active',
          totalOrders: 28,
          totalValue: 450000000,
          lastOrder: '2024-01-12',
          performance: 96,
          notes: 'Supplier peralatan safety dan K3'
        }
      ];

      setSuppliers(mockSuppliers);
      
      // Calculate stats
      const activeSuppliers = mockSuppliers.filter(s => s.status === 'active');
      const averageRating = mockSuppliers.reduce((sum, s) => sum + s.rating, 0) / mockSuppliers.length;
      const totalOrders = mockSuppliers.reduce((sum, s) => sum + s.totalOrders, 0);
      const totalValue = mockSuppliers.reduce((sum, s) => sum + s.totalValue, 0);

      setSupplierStats({
        totalSuppliers: mockSuppliers.length,
        activeSuppliers: activeSuppliers.length,
        averageRating,
        totalOrders,
        totalValue
      });
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      const newId = suppliers.length + 1;
      const supplier = {
        ...newSupplier,
        id: newId,
        totalOrders: 0,
        totalValue: 0,
        lastOrder: null,
        performance: 100
      };
      
      setSuppliers([...suppliers, supplier]);
      setNewSupplier({
        name: '',
        contact: '',
        email: '',
        phone: '',
        address: '',
        category: 'material',
        rating: 5,
        status: 'active',
        notes: ''
      });
      setShowAddForm(false);
      
      await fetchSuppliers();
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  const handleDeleteSupplier = async (supplierId) => {
    if (!window.confirm('Yakin ingin menghapus supplier ini?')) return;
    
    try {
      setSuppliers(suppliers.filter(s => s.id !== supplierId));
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'material': return 'bg-blue-100 text-blue-800';
      case 'steel': return 'bg-gray-100 text-gray-800';
      case 'equipment': return 'bg-purple-100 text-purple-800';
      case 'safety': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 95) return 'text-green-600';
    if (performance >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={`${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Package },
    { id: 'suppliers', label: 'Supplier', icon: Users },
    { id: 'performance', label: 'Performance', icon: TrendingUp }
  ];

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Supplier</h1>
          <p className="text-gray-600">Kelola hubungan dengan supplier dan vendor</p>
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
            Tambah Supplier
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <Users className="h-12 w-12 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Supplier</p>
                  <p className="text-2xl font-bold text-gray-900">{supplierStats.totalSuppliers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <AlertCircle className="h-12 w-12 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Supplier Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">{supplierStats.activeSuppliers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <Star className="h-12 w-12 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rating Rata-rata</p>
                  <p className="text-2xl font-bold text-gray-900">{supplierStats.averageRating.toFixed(1)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <Package className="h-12 w-12 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Order</p>
                  <p className="text-2xl font-bold text-gray-900">{supplierStats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <TrendingUp className="h-12 w-12 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Nilai</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(supplierStats.totalValue)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Suppliers */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Top Supplier</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {suppliers.slice(0, 4).map((supplier) => (
                <div key={supplier.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{supplier.name}</h4>
                      <p className="text-sm text-gray-500">{supplier.contact}</p>
                    </div>
                    <div className="flex items-center">
                      {renderStars(supplier.rating)}
                      <span className="ml-1 text-sm text-gray-600">({supplier.rating})</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Kategori:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(supplier.category)}`}>
                        {supplier.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Order:</span>
                      <span className="font-medium">{supplier.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance:</span>
                      <span className={`font-medium ${getPerformanceColor(supplier.performance)}`}>
                        {supplier.performance}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'suppliers' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Cari supplier..."
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

          {/* Add Supplier Form */}
          {showAddForm && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Tambah Supplier Baru</h3>
              <form onSubmit={handleAddSupplier} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan</label>
                  <input
                    type="text"
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={newSupplier.contact}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                  <input
                    type="text"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    value={newSupplier.category}
                    onChange={(e) => setNewSupplier({ ...newSupplier, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="material">Material</option>
                    <option value="steel">Baja/Logam</option>
                    <option value="equipment">Peralatan</option>
                    <option value="safety">Safety/K3</option>
                    <option value="services">Jasa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating Awal</label>
                  <select
                    value={newSupplier.rating}
                    onChange={(e) => setNewSupplier({ ...newSupplier, rating: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Good</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Below Average</option>
                    <option value={1}>1 - Poor</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <textarea
                    value={newSupplier.address}
                    onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                  <textarea
                    value={newSupplier.notes}
                    onChange={(e) => setNewSupplier({ ...newSupplier, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Catatan tambahan tentang supplier..."
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

          {/* Suppliers Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kontak
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
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
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin size={12} className="mr-1" />
                            {supplier.address}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{supplier.contact}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone size={12} className="mr-1" />
                            {supplier.phone}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail size={12} className="mr-1" />
                            {supplier.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(supplier.category)}`}>
                          {supplier.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {renderStars(supplier.rating)}
                          <span className="ml-1 text-sm text-gray-600">({supplier.rating})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className={`text-sm font-medium ${getPerformanceColor(supplier.performance)}`}>
                            {supplier.performance}%
                          </div>
                          <div className="text-sm text-gray-500">{supplier.totalOrders} orders</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(supplier.status)}`}>
                          {supplier.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteSupplier(supplier.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <TrendingUp className="h-12 w-12 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                  <p className="text-2xl font-bold text-gray-900">94.2%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <Clock className="h-12 w-12 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">On-Time Delivery</p>
                  <p className="text-2xl font-bold text-gray-900">89.5%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <CheckCircle className="h-12 w-12 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Quality Score</p>
                  <p className="text-2xl font-bold text-gray-900">4.6/5</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <BarChart3 className="h-12 w-12 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Cost Efficiency</p>
                  <p className="text-2xl font-bold text-gray-900">92.8%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Top Performing Suppliers</h3>
              <div className="space-y-4">
                {suppliers.sort((a, b) => b.performance - a.performance).slice(0, 5).map((supplier, index) => (
                  <div key={supplier.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-sm">{supplier.name}</div>
                        <div className="text-xs text-gray-500">{supplier.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getPerformanceColor(supplier.performance)}`}>
                        {supplier.performance}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {supplier.rating}⭐ ({supplier.totalOrders} orders)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Trends */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Line Chart - Monthly Performance</p>
                  <p className="text-sm text-gray-500">Trend analysis coming soon</p>
                </div>
              </div>
            </div>

            {/* Category Performance */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Performance by Category</h3>
              <div className="space-y-3">
                {[
                  { category: 'Material Konstruksi', performance: 96.2, suppliers: 8 },
                  { category: 'Safety Equipment', performance: 94.8, suppliers: 5 },
                  { category: 'Alat Berat', performance: 91.5, suppliers: 4 },
                  { category: 'Cat & Finishing', performance: 89.3, suppliers: 6 },
                  { category: 'Elektronik', performance: 87.1, suppliers: 3 }
                ].map((cat, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <div>
                      <div className="font-medium text-sm">{cat.category}</div>
                      <div className="text-xs text-gray-500">{cat.suppliers} suppliers</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getPerformanceColor(cat.performance)}`}>
                        {cat.performance}%
                      </div>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${cat.performance}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Issues & Recommendations */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Issues & Recommendations</h3>
              <div className="space-y-4">
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    <h4 className="font-medium text-red-900">Quality Issues</h4>
                  </div>
                  <p className="text-sm text-red-800">2 suppliers memiliki rating di bawah 4.0. Perlu evaluasi lebih lanjut.</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                    <h4 className="font-medium text-yellow-900">Delivery Delays</h4>
                  </div>
                  <p className="text-sm text-yellow-800">Rata-rata delay 2.3 hari untuk kategori Alat Berat. Perlu negosiasi SLA.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <h4 className="font-medium text-green-900">Excellence</h4>
                  </div>
                  <p className="text-sm text-green-800">3 suppliers mencapai perfect score. Pertimbangkan untuk strategic partnership.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierManagement;
