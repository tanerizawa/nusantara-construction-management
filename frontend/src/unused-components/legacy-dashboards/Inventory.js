import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Package, 
  ShoppingCart,
  ClipboardList,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  TrendingUp,
  Download,
  Clock,
  CheckCircle,
  DollarSign
} from 'lucide-react';

const Inventory = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('materials');
  const [materialPlanning, setMaterialPlanning] = useState([]);
  const [projectMaterials, setProjectMaterials] = useState([]);
  const [deliveryTracking, setDeliveryTracking] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    totalCategories: 0,
    totalValue: 0
  });
  const [supplierStats, setSupplierStats] = useState({
    totalSuppliers: 0,
    activeSuppliers: 0,
    topRatedSuppliers: 0,
    totalOrders: 0
  });

  // Determine tab based on URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/suppliers')) {
      setActiveTab('suppliers');
    } else if (path.includes('/orders')) {
      setActiveTab('orders');
    } else {
      setActiveTab('stock');
    }
  }, [location.pathname]);

  // Fetch inventory data from database
  useEffect(() => {
    if (activeTab === 'stock') {
      fetchInventoryData();
    } else if (activeTab === 'suppliers') {
      fetchSuppliersData();
    } else if (activeTab === 'orders') {
      fetchPurchaseOrdersData();
    }
  }, [activeTab, searchTerm, selectedCategory]);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('q', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      
      const response = await fetch(`/api/inventory?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMaterialPlanning(data.data || []);
        
        // Calculate stats for project-based material planning
        const totalItems = data.data?.length || 0;
        const activeProjects = data.data?.filter(item => 
          item.project_status === 'active'
        ).length || 0;
        const pendingProcurement = data.data?.filter(item => 
          item.procurement_status === 'planning'
        ).length || 0;
        const deliveredItems = data.data?.filter(item => 
          item.procurement_status === 'delivered'
        ).length || 0;
        const totalMaterialBudget = data.data?.reduce((sum, item) => 
          sum + (item.budget_amount || 0), 0
        ) || 0;
        
        setStats({
          totalItems,
          activeProjects,
          pendingProcurement,
          deliveredItems,
          totalMaterialBudget
        });
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliersData = async () => {
    try {
      setLoading(true);
      // Implementasi akan menggunakan API suppliers ketika tersedia
      // Sementara menggunakan data placeholder yang lebih realistis
      setSuppliers([]);
      setSupplierStats({
        totalSuppliers: 0,
        activeSuppliers: 0,
        topRatedSuppliers: 0,
        totalOrders: 0
      });
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchaseOrdersData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/purchase-orders', {
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (item) => {
    if (item.currentStock === 0) return 'bg-[#FF3B30]/20 text-[#FF3B30]';
    if (item.currentStock <= item.minimumStock) return 'bg-[#FF9F0A]/20 text-[#FF9F0A]';
    return 'bg-[#30D158]/20 text-[#30D158]';
  };

  const getStatusText = (item) => {
    if (item.currentStock === 0) return 'Habis';
    if (item.currentStock <= item.minimumStock) return 'Stok Menipis';
    return 'Tersedia';
  };

  const tabs = [
    { id: 'materials', label: 'Material Planning', icon: Package },
    { id: 'suppliers', label: 'Supplier Management', icon: ShoppingCart },
    { id: 'procurement', label: 'Procurement Orders', icon: ClipboardList },
    { id: 'delivery', label: 'Delivery Tracking', icon: TrendingUp }
  ];

  // Stock tab content
  const renderStockContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A84FF] mx-auto mb-4"></div>
            <p className="text-[#8E8E93]">Memuat data material planning...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-[#0A84FF]/10 border border-[#0A84FF]/30 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Package className="h-5 w-5 text-[#0A84FF]" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-[#0A84FF]">
                Material Planning Berbasis Proyek
              </h3>
              <div className="mt-2 text-sm text-[#0A84FF]">
                <p>Rencanakan kebutuhan material berdasarkan RAB proyek, tanpa gudang pusat - langsung ke lokasi proyek</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Material Planning per Proyek</h2>
          <div className="flex space-x-3">
            <button className="bg-[#30D158] text-white px-4 py-2 rounded-lg hover:bg-[#30D158]/90 transition-colors duration-150 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Import dari RAB</span>
            </button>
            <button className="bg-[#0A84FF] text-white px-4 py-2 rounded-lg hover:bg-[#0A84FF]/90 transition-colors duration-150 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Planning Manual</span>
            </button>
          </div>
        </div>
        
        {/* Project-Based Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-[#0A84FF]/20 rounded-lg">
                <Package className="h-5 w-5 text-[#0A84FF]" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-[#98989D]">Proyek Aktif</p>
                <p className="text-xl font-semibold text-white">{stats.activeProjects || 0}</p>
                <p className="text-xs text-[#636366]">Membutuhkan material</p>
              </div>
            </div>
          </div>
          <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-[#FF9F0A]/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-[#FF9F0A]" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-[#98989D]">Pending Procurement</p>
                <p className="text-xl font-semibold text-white">{stats.pendingProcurement || 0}</p>
                <p className="text-xs text-[#636366]">Perlu diorder</p>
              </div>
            </div>
          </div>
          <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-[#30D158]/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-[#30D158]" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-[#98989D]">Material Delivered</p>
                <p className="text-xl font-semibold text-white">{stats.deliveredItems || 0}</p>
                <p className="text-xs text-[#636366]">Sudah sampai lokasi</p>
              </div>
            </div>
          </div>
          <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-[#BF5AF2]/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-[#BF5AF2]" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-[#98989D]">Total Budget Material</p>
                <p className="text-base font-semibold text-white">{formatCurrency(stats.totalMaterialBudget || 0)}</p>
                <p className="text-xs text-[#636366]">Semua proyek aktif</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Project Material Planning */}
        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-white">Material Planning by Project</h3>
            <div className="flex space-x-3">
              <select className="px-3 py-2 border border-[#38383A] rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent bg-[#1C1C1E] text-white">
                <option value="">Semua Proyek</option>
                <option value="active">Proyek Aktif</option>
                <option value="planning">Tahap Planning</option>
                <option value="procurement">Tahap Procurement</option>
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#636366] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari proyek atau material..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-[#38383A] rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent bg-[#1C1C1E] text-white placeholder-[#636366]"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#38383A]">
              <thead className="bg-[#1C1C1E]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Proyek</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Material Needed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Qty Planning</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Status Procurement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#1C1C1E] divide-y divide-[#38383A]">
                {materialPlanning.length > 0 ? (
                  materialPlanning.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{item.project_name}</div>
                          <div className="text-xs text-[#98989D]">{item.project_location}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{item.material_name}</div>
                          <div className="text-xs text-[#98989D]">{item.material_specification}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {item.quantity_needed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#98989D]">
                        {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {formatCurrency(item.budget_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.procurement_status === 'delivered' ? 'bg-[#30D158]/20 text-[#30D158]' :
                          item.procurement_status === 'ordered' ? 'bg-[#0A84FF]/20 text-[#0A84FF]' :
                          item.procurement_status === 'planning' ? 'bg-[#FF9F0A]/20 text-[#FF9F0A]' :
                          'bg-[#2C2C2E] text-[#EBEBF5]'
                        }`}>
                          {item.procurement_status === 'delivered' ? 'Delivered' :
                           item.procurement_status === 'ordered' ? 'Ordered' :
                           item.procurement_status === 'planning' ? 'Planning' :
                           'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-[#0A84FF] hover:text-[#0A84FF]" title="Lihat Detail RAB">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-[#30D158] hover:text-[#30D158]" title="Buat PO">
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                          <button className="text-[#FF9F0A] hover:text-[#FF9F0A]" title="Edit Planning">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <Package className="h-12 w-12 text-[#636366] mx-auto mb-4" />
                      <p className="text-[#98989D] text-lg">Belum ada material planning</p>
                      <p className="text-[#636366] text-sm">Import dari RAB proyek atau buat planning manual</p>
                      <div className="mt-4 flex justify-center space-x-3">
                        <button className="bg-[#30D158] text-white px-4 py-2 rounded-lg hover:bg-[#30D158]/90 transition-colors duration-150 flex items-center space-x-2">
                          <Plus className="w-4 h-4" />
                          <span>Import dari RAB</span>
                        </button>
                        <button className="bg-[#0A84FF] text-white px-4 py-2 rounded-lg hover:bg-[#0A84FF]/90 transition-colors duration-150 flex items-center space-x-2">
                          <Plus className="w-4 h-4" />
                          <span>Planning Manual</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Suppliers tab content
  const renderSuppliersContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A84FF] mx-auto mb-4"></div>
            <p className="text-[#8E8E93]">Memuat data supplier...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Info Banner */}
        <div className="bg-[#FF9F0A]/10 border border-[#FF9F0A]/30 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ShoppingCart className="h-5 w-5 text-[#FF9F0A]" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-[#FF9F0A]">
                Supplier Management Konstruksi
              </h3>
              <div className="mt-2 text-sm text-[#FF9F0A]">
                <p>Kelola database supplier material dan jasa konstruksi untuk procurement project-based</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header with Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Manajemen Supplier Konstruksi</h2>
          <button className="bg-[#0A84FF] text-white px-4 py-2 rounded-lg hover:bg-[#0A84FF]/90 transition-colors duration-150 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Tambah Supplier</span>
          </button>
        </div>
        
        {/* Stats Cards - Same structure as other tabs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-[#0A84FF]/20 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-[#0A84FF]" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-[#98989D]">Total Supplier</p>
                <p className="text-xl font-semibold text-white">{supplierStats.totalSuppliers}</p>
                <p className="text-xs text-[#636366]">Vendor terdaftar</p>
              </div>
            </div>
          </div>
          <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-[#30D158]/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-[#30D158]" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-[#98989D]">Supplier Aktif</p>
                <p className="text-xl font-semibold text-white">{supplierStats.activeSuppliers}</p>
                <p className="text-xs text-[#636366]">Sedang bekerja sama</p>
              </div>
            </div>
          </div>
          <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-[#FF9F0A]/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-[#FF9F0A]" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-[#98989D]">Rating Tinggi</p>
                <p className="text-xl font-semibold text-white">{supplierStats.topRatedSuppliers}</p>
                <p className="text-xs text-[#636366]">Rating 4.5+</p>
              </div>
            </div>
          </div>
          <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-[#BF5AF2]/20 rounded-lg">
                <ClipboardList className="h-5 w-5 text-[#BF5AF2]" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-[#98989D]">Total PO</p>
                <p className="text-xl font-semibold text-white">{supplierStats.totalOrders}</p>
                <p className="text-xs text-[#636366]">Purchase orders</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Supplier Table */}
        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-white">Database Supplier</h3>
            <div className="flex space-x-3">
              <select className="px-3 py-2 border border-[#38383A] rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent bg-[#1C1C1E] text-white">
                <option value="">Semua Kategori</option>
                <option value="material">Material Konstruksi</option>
                <option value="equipment">Alat Berat</option>
                <option value="subkontraktor">Subkontraktor</option>
                <option value="jasa">Jasa Konstruksi</option>
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#636366] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari supplier konstruksi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-[#38383A] rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent bg-[#1C1C1E] text-white placeholder-[#636366]"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#38383A]">
              <thead className="bg-[#1C1C1E]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Kontak</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Spesialisasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#1C1C1E] divide-y divide-[#38383A]">
                {suppliers.length > 0 ? (
                  suppliers.map((supplier) => (
                    <tr key={supplier.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{supplier.name}</div>
                          <div className="text-xs text-[#98989D]">{supplier.address}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{supplier.phone}</div>
                        <div className="text-xs text-[#98989D]">{supplier.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#98989D]">
                        {supplier.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {supplier.rating}/5
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          supplier.status === 'active' ? 'bg-[#30D158]/20 text-[#30D158]' : 'bg-[#2C2C2E] text-[#EBEBF5]'
                        }`}>
                          {supplier.status === 'active' ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-[#0A84FF] hover:text-[#0A84FF]">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-[#FF9F0A] hover:text-[#FF9F0A]">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-[#FF3B30] hover:text-[#FF3B30]">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <ShoppingCart className="h-12 w-12 text-[#636366] mx-auto mb-4" />
                      <p className="text-[#98989D] text-lg">Belum ada supplier terdaftar</p>
                      <p className="text-[#636366] text-sm">Tambahkan supplier konstruksi untuk memulai procurement management</p>
                      <button className="mt-4 bg-[#0A84FF] text-white px-4 py-2 rounded-lg hover:bg-[#0A84FF]/90 transition-colors duration-150 flex items-center space-x-2 mx-auto">
                        <Plus className="w-4 h-4" />
                        <span>Tambah Supplier Pertama</span>
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Delivery Tracking tab content
  const renderDeliveryContent = () => {
    return (
      <div className="space-y-4">
        <div className="bg-[#30D158]/10 border border-[#30D158]/30 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <TrendingUp className="h-5 w-5 text-[#30D158]" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-[#30D158]">
                Tracking Pengiriman ke Lokasi Proyek
              </h3>
              <div className="mt-2 text-sm text-[#30D158]">
                <p>Monitor status pengiriman material langsung dari supplier ke lokasi proyek konstruksi</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Delivery Tracking</h2>
          <div className="flex space-x-3">
            <button className="bg-[#30D158] text-white px-4 py-2 rounded-lg hover:bg-[#30D158]/90 transition-colors duration-150 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Update Delivery Status</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-[#0A84FF]/20 rounded-lg">
                <ClipboardList className="h-5 w-5 text-[#0A84FF]" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-[#98989D]">Total Deliveries</p>
                <p className="text-xl font-semibold text-white">{deliveryTracking.totalDeliveries || 0}</p>
                <p className="text-xs text-[#636366]">Semua status</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-[#FF9F0A]/20 rounded-lg">
                <Clock className="h-5 w-5 text-[#FF9F0A]" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-[#98989D]">On Transit</p>
                <p className="text-xl font-semibold text-white">{deliveryTracking.onTransit || 0}</p>
                <p className="text-xs text-[#636366]">Dalam perjalanan</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-[#30D158]/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-[#30D158]" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-[#98989D]">Delivered</p>
                <p className="text-xl font-semibold text-white">{deliveryTracking.delivered || 0}</p>
                <p className="text-xs text-[#636366]">Sudah sampai</p>
              </div>
            </div>
          </div>

          <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-[#FF3B30]/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-[#FF3B30]" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-[#98989D]">Delayed</p>
                <p className="text-xl font-semibold text-white">{deliveryTracking.delayed || 0}</p>
                <p className="text-xs text-[#636366]">Terlambat</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-white">Active Deliveries</h3>
            <div className="flex space-x-3">
              <select className="px-3 py-2 border border-[#38383A] rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent bg-[#1C1C1E] text-white">
                <option value="">Semua Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="picked_up">Picked Up</option>
                <option value="on_transit">On Transit</option>
                <option value="delivered">Delivered</option>
                <option value="delayed">Delayed</option>
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#636366] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari delivery atau proyek..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-[#38383A] rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent bg-[#1C1C1E] text-white placeholder-[#636366]"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#38383A]">
              <thead className="bg-[#1C1C1E]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Delivery ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Proyek Tujuan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Material</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Est. Arrival</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#1C1C1E] divide-y divide-[#38383A]">
                {deliveryTracking.deliveries && deliveryTracking.deliveries.length > 0 ? (
                  deliveryTracking.deliveries.map((delivery) => (
                    <tr key={delivery.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {delivery.delivery_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{delivery.project_name}</div>
                          <div className="text-xs text-[#98989D]">{delivery.project_location}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{delivery.material_name}</div>
                          <div className="text-xs text-[#98989D]">{delivery.quantity} {delivery.unit}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#98989D]">
                        {delivery.supplier_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#98989D]">
                        {new Date(delivery.estimated_arrival).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          delivery.status === 'delivered' ? 'bg-[#30D158]/20 text-[#30D158]' :
                          delivery.status === 'on_transit' ? 'bg-[#0A84FF]/20 text-[#0A84FF]' :
                          delivery.status === 'delayed' ? 'bg-[#FF3B30]/20 text-[#FF3B30]' :
                          delivery.status === 'picked_up' ? 'bg-[#FF9F0A]/20 text-[#FF9F0A]' :
                          'bg-[#2C2C2E] text-[#EBEBF5]'
                        }`}>
                          {delivery.status === 'delivered' ? 'Delivered' :
                           delivery.status === 'on_transit' ? 'On Transit' :
                           delivery.status === 'delayed' ? 'Delayed' :
                           delivery.status === 'picked_up' ? 'Picked Up' :
                           'Scheduled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-[#0A84FF] hover:text-[#0A84FF]" title="Track Delivery">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-[#30D158] hover:text-[#30D158]" title="Update Status">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-[#BF5AF2] hover:text-purple-900" title="Contact Driver">
                            <TrendingUp className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <TrendingUp className="h-12 w-12 text-[#636366] mx-auto mb-4" />
                      <p className="text-[#98989D] text-lg">Belum ada delivery tracking</p>
                      <p className="text-[#636366] text-sm">Delivery akan muncul setelah purchase order diproses</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  const renderOrdersContent = () => {
    return (
      <div className="space-y-4">
        <div className="bg-[#BF5AF2]/10 border border-[#BF5AF2]/30 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ClipboardList className="h-5 w-5 text-[#BF5AF2]" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-[#BF5AF2]">
                Procurement Orders Project-Based
              </h3>
              <div className="mt-2 text-sm text-[#BF5AF2]">
                <p>Kelola procurement material berdasarkan RAB proyek dengan delivery langsung ke lokasi konstruksi</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Procurement Orders</h2>
          <button className="bg-[#0A84FF] text-white px-4 py-2 rounded-lg hover:bg-[#0A84FF]/90 transition-colors duration-150 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Buat Procurement Order</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-[#FF9F0A]/20 rounded-lg">
                <Clock className="h-5 w-5 text-[#FF9F0A]" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-[#98989D]">Total PO</p>
                <p className="text-xl font-semibold text-white">{purchaseOrders.totalPO || 0}</p>
                <p className="text-xs text-[#636366]">Bulan ini</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-[#0A84FF]/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-[#0A84FF]" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-[#98989D]">PO Disetujui</p>
                <p className="text-xl font-semibold text-white">{purchaseOrders.approvedPO || 0}</p>
                <p className="text-xs text-[#636366]">Siap kirim</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-[#30D158]/20 rounded-lg">
                <Package className="h-5 w-5 text-[#30D158]" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-[#98989D]">PO Diterima</p>
                <p className="text-xl font-semibold text-white">{purchaseOrders.deliveredPO || 0}</p>
                <p className="text-xs text-[#636366]">Sudah diterima</p>
              </div>
            </div>
          </div>

          <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-[#BF5AF2]/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-[#BF5AF2]" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-[#98989D]">Total Nilai PO</p>
                <p className="text-base font-semibold text-white">
                  {new Intl.NumberFormat('id-ID', { 
                    style: 'currency', 
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0 
                  }).format(purchaseOrders.totalValue || 0)}
                </p>
                <p className="text-xs text-[#636366]">Total value</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-white">Recent Purchase Orders</h3>
            <div className="flex space-x-3">
              <select className="px-3 py-2 border border-[#38383A] rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent bg-[#1C1C1E] text-white">
                <option value="">Semua Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Disetujui</option>
                <option value="delivered">Diterima</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#636366] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari PO..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-[#38383A] rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent bg-[#1C1C1E] text-white placeholder-[#636366]"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#38383A]">
              <thead className="bg-[#1C1C1E]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">No PO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Proyek Tujuan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Material</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Total Nilai</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#1C1C1E] divide-y divide-[#38383A]">
                {purchaseOrders.orders && purchaseOrders.orders.length > 0 ? (
                  purchaseOrders.orders.map((po) => (
                    <tr key={po.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {po.po_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{po.project_name || 'Proyek A'}</div>
                          <div className="text-xs text-[#98989D]">{po.delivery_location || 'Lokasi delivery'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{po.supplier_name}</div>
                          <div className="text-xs text-[#98989D]">{po.supplier_type}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{po.material_name || po.category}</div>
                          <div className="text-xs text-[#98989D]">{po.quantity || ''} {po.unit || ''}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {new Intl.NumberFormat('id-ID', { 
                          style: 'currency', 
                          currency: 'IDR',
                          minimumFractionDigits: 0 
                        }).format(po.total_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          po.status === 'approved' ? 'bg-[#30D158]/20 text-[#30D158]' :
                          po.status === 'pending' ? 'bg-[#FF9F0A]/20 text-[#FF9F0A]' :
                          po.status === 'delivered' ? 'bg-[#0A84FF]/20 text-[#0A84FF]' :
                          po.status === 'cancelled' ? 'bg-[#FF3B30]/20 text-[#FF3B30]' :
                          'bg-[#2C2C2E] text-[#EBEBF5]'
                        }`}>
                          {po.status === 'approved' ? 'Disetujui' :
                           po.status === 'pending' ? 'Pending' :
                           po.status === 'delivered' ? 'Diterima' :
                           po.status === 'cancelled' ? 'Dibatalkan' :
                           'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-[#0A84FF] hover:text-[#0A84FF]" title="Lihat Detail">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-[#FF9F0A] hover:text-[#FF9F0A]" title="Edit PO">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-[#30D158] hover:text-[#30D158]" title="Download PDF">
                            <Download className="w-4 h-4" />
                          </button>
                          {po.status === 'draft' && (
                            <button className="text-[#FF3B30] hover:text-[#FF3B30]" title="Hapus">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <ShoppingCart className="h-12 w-12 text-[#636366] mx-auto mb-4" />
                      <p className="text-[#98989D] text-lg">Belum ada purchase order</p>
                      <p className="text-[#636366] text-sm">Buat PO pertama untuk memulai procurement konstruksi</p>
                      <button className="mt-4 bg-[#0A84FF] text-white px-4 py-2 rounded-lg hover:bg-[#0A84FF]/90 transition-colors duration-150 flex items-center space-x-2 mx-auto">
                        <Plus className="w-4 h-4" />
                        <span>Buat PO Pertama</span>
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'suppliers':
        return renderSuppliersContent();
      case 'procurement':
        return renderOrdersContent();
      case 'delivery':
        return renderDeliveryContent();
      default:
        return renderStockContent();
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1C1E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Material Management & Procurement</h1>
          <p className="mt-1 text-sm text-[#8E8E93]">Kelola perencanaan material, procurement, dan pengiriman langsung ke lokasi proyek</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-[#38383A]">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${
                      activeTab === tab.id
                        ? 'border-[#0A84FF] text-[#0A84FF]'
                        : 'border-transparent text-[#98989D] hover:text-white hover:border-[#38383A]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Inventory;
