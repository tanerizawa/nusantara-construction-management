import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Building, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Users,
  FileText,
  ShoppingCart,
  BarChart3,
  Plus,
  Settings
} from 'lucide-react';

const InventoryDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [inventoryStats, setInventoryStats] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalWarehouses: 0,
    totalSuppliers: 0,
    pendingOrders: 0,
    recentTransactions: []
  });

  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    fetchInventoryStats();
    fetchLowStockItems();
    fetchRecentTransactions();
  }, []);

  const fetchInventoryStats = async () => {
    // Mock data - replace with actual API calls
    setInventoryStats({
      totalItems: 1247,
      totalValue: 2450000000,
      lowStockItems: 23,
      outOfStockItems: 5,
      totalWarehouses: 8,
      totalSuppliers: 45,
      pendingOrders: 12,
      recentTransactions: []
    });
  };

  const fetchLowStockItems = async () => {
    // Mock data
    setLowStockItems([
      { id: 1, name: 'Semen Portland', currentStock: 15, minStock: 50, unit: 'ton' },
      { id: 2, name: 'Besi Beton 12mm', currentStock: 8, minStock: 25, unit: 'batang' },
      { id: 3, name: 'Cat Tembok Putih', currentStock: 3, minStock: 10, unit: 'kaleng' },
      { id: 4, name: 'Paku Beton 4 inch', currentStock: 12, minStock: 50, unit: 'kg' },
      { id: 5, name: 'Kawat Bendrat', currentStock: 2, minStock: 15, unit: 'roll' }
    ]);
  };

  const fetchRecentTransactions = async () => {
    // Mock data
    setRecentTransactions([
      { id: 1, type: 'IN', item: 'Semen Portland', quantity: 100, warehouse: 'Gudang Utama', date: '2024-08-27', reference: 'PO-2024-001' },
      { id: 2, type: 'OUT', item: 'Besi Beton 12mm', quantity: 50, warehouse: 'Gudang Site A', date: '2024-08-27', reference: 'MR-2024-045' },
      { id: 3, type: 'IN', item: 'Cat Tembok Putih', quantity: 25, warehouse: 'Gudang Utama', date: '2024-08-26', reference: 'PO-2024-002' },
      { id: 4, type: 'OUT', item: 'Paku Beton 4 inch', quantity: 15, warehouse: 'Gudang Site B', date: '2024-08-26', reference: 'MR-2024-046' },
      { id: 5, type: 'ADJUSTMENT', item: 'Kawat Bendrat', quantity: -3, warehouse: 'Gudang Utama', date: '2024-08-25', reference: 'ADJ-2024-010' }
    ]);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'IN':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'OUT':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Settings className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'IN':
        return 'text-green-600 bg-green-50';
      case 'OUT':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory Management</h1>
          <p className="text-gray-600">Comprehensive inventory and warehouse management system</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 inline-flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </button>
          <button className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 inline-flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Quick Add
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryStats.totalItems.toLocaleString()}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(inventoryStats.totalValue)}</p>
              <p className="text-sm text-green-600">+8% from last month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-orange-600">{inventoryStats.lowStockItems}</p>
              <p className="text-sm text-orange-600">Need attention</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{inventoryStats.outOfStockItems}</p>
              <p className="text-sm text-red-600">Critical items</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Warehouses</p>
              <p className="text-xl font-bold text-gray-900">{inventoryStats.totalWarehouses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Suppliers</p>
              <p className="text-xl font-bold text-gray-900">{inventoryStats.totalSuppliers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-xl font-bold text-gray-900">{inventoryStats.pendingOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'items', name: 'Items Management', icon: Package },
              { id: 'warehouses', name: 'Warehouses', icon: Building },
              { id: 'suppliers', name: 'Suppliers', icon: Users },
              { id: 'orders', name: 'Purchase Orders', icon: ShoppingCart },
              { id: 'reports', name: 'Reports', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Low Stock Alert */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
                  <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {lowStockItems.length} items
                  </span>
                </div>
                <div className="space-y-3">
                  {lowStockItems.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.currentStock} {item.unit} (Min: {item.minStock})
                          </p>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                        Reorder
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {recentTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTransactionColor(transaction.type)}`}>
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.item}</p>
                          <p className="text-sm text-gray-600">
                            {transaction.warehouse} • {formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.type === 'IN' ? 'text-green-600' : 
                          transaction.type === 'OUT' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          {transaction.type === 'OUT' ? '-' : '+'}{Math.abs(transaction.quantity)}
                        </p>
                        <p className="text-xs text-gray-500">{transaction.reference}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Items Management interface will be implemented here</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Go to Inventory Items
              </button>
            </div>
          )}

          {activeTab === 'warehouses' && (
            <div className="text-center py-8">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Warehouse Management interface will be implemented here</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Manage Warehouses
              </button>
            </div>
          )}

          {activeTab === 'suppliers' && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Supplier Management interface will be implemented here</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Manage Suppliers
              </button>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Purchase Orders interface will be implemented here</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Manage Orders
              </button>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Inventory Reports interface will be implemented here</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Generate Reports
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
