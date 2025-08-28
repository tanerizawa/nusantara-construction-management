import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  ArrowUpRight,
  ArrowDownLeft,
  User,
  Search,
  Filter,
  Download,
  Eye,
  RotateCcw,
  Activity,
  BarChart3,
  Clock,
  CheckCircle
} from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

/**
 * Stock Movement Management Component - Phase 3 Week 7-8
 * Enhanced stock tracking and transaction history
 */

const StockMovementManagement = () => {
  // const { token } = useAuth();
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedType, setSelectedType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [movementStats, setMovementStats] = useState({
    totalMovements: 0,
    incomingTotal: 0,
    outgoingTotal: 0,
    adjustmentTotal: 0,
    totalValue: 0
  });

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API
      const mockMovements = [
        {
          id: 1,
          date: '2024-01-15',
          time: '09:30',
          type: 'masuk',
          item: 'Semen Portland',
          quantity: 100,
          unit: 'sak',
          unitPrice: 65000,
          totalValue: 6500000,
          reference: 'PO-2024-001',
          warehouse: 'Gudang A',
          user: 'Ahmad Fauzi',
          notes: 'Pembelian rutin dari PT Semen Indonesia',
          prevStock: 450,
          newStock: 550
        },
        {
          id: 2,
          date: '2024-01-15',
          time: '11:15',
          type: 'keluar',
          item: 'Pasir Cor',
          quantity: 25,
          unit: 'm3',
          unitPrice: 350000,
          totalValue: 8750000,
          reference: 'REQ-2024-015',
          warehouse: 'Gudang B',
          user: 'Siti Nurhaliza',
          notes: 'Penggunaan untuk proyek perumahan ABC - Fase 1',
          prevStock: 75,
          newStock: 50
        },
        {
          id: 3,
          date: '2024-01-14',
          time: '14:45',
          type: 'adjustment',
          item: 'Besi Beton 12mm',
          quantity: -5,
          unit: 'batang',
          unitPrice: 85000,
          totalValue: -425000,
          reference: 'ADJ-2024-003',
          warehouse: 'Gudang A',
          user: 'Diana Putri',
          notes: 'Penyesuaian stock fisik - ditemukan kekurangan',
          prevStock: 205,
          newStock: 200
        },
        {
          id: 4,
          date: '2024-01-14',
          time: '08:20',
          type: 'masuk',
          item: 'Helm Safety',
          quantity: 50,
          unit: 'pcs',
          unitPrice: 125000,
          totalValue: 6250000,
          reference: 'PO-2024-003',
          warehouse: 'Gudang C',
          user: 'Bambang Suryono',
          notes: 'Penambahan stock safety equipment',
          prevStock: 25,
          newStock: 75
        },
        {
          id: 5,
          date: '2024-01-13',
          time: '16:30',
          type: 'keluar',
          item: 'Cat Tembok',
          quantity: 20,
          unit: 'kaleng',
          unitPrice: 75000,
          totalValue: 1500000,
          reference: 'REQ-2024-012',
          warehouse: 'Gudang B',
          user: 'Rina Safitri',
          notes: 'Penggunaan untuk finishing rumah type 45',
          prevStock: 100,
          newStock: 80
        },
        {
          id: 6,
          date: '2024-01-13',
          time: '10:10',
          type: 'transfer',
          item: 'Wiremesh M8',
          quantity: 10,
          unit: 'lembar',
          unitPrice: 450000,
          totalValue: 4500000,
          reference: 'TRF-2024-005',
          warehouse: 'Gudang A → Gudang B',
          user: 'Ahmad Fauzi',
          notes: 'Transfer antar gudang untuk kebutuhan proyek',
          prevStock: 35,
          newStock: 25
        }
      ];

      setMovements(mockMovements);
      
      // Calculate stats
      const incomingMovements = mockMovements.filter(m => m.type === 'masuk');
      const outgoingMovements = mockMovements.filter(m => m.type === 'keluar');
      const adjustmentMovements = mockMovements.filter(m => m.type === 'adjustment');
      
      const incomingTotal = incomingMovements.reduce((sum, m) => sum + m.totalValue, 0);
      const outgoingTotal = outgoingMovements.reduce((sum, m) => sum + Math.abs(m.totalValue), 0);
      const adjustmentTotal = adjustmentMovements.reduce((sum, m) => sum + Math.abs(m.totalValue), 0);
      const totalValue = mockMovements.reduce((sum, m) => sum + Math.abs(m.totalValue), 0);

      setMovementStats({
        totalMovements: mockMovements.length,
        incomingTotal,
        outgoingTotal,
        adjustmentTotal,
        totalValue
      });
    } catch (error) {
      console.error('Error fetching movements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMovementIcon = (type) => {
    switch (type) {
      case 'masuk': return <ArrowDownLeft className="text-green-600" size={20} />;
      case 'keluar': return <ArrowUpRight className="text-red-600" size={20} />;
      case 'adjustment': return <RotateCcw className="text-orange-600" size={20} />;
      case 'transfer': return <Activity className="text-blue-600" size={20} />;
      default: return <Package className="text-gray-600" size={20} />;
    }
  };

  const getMovementColor = (type) => {
    switch (type) {
      case 'masuk': return 'bg-green-100 text-green-800';
      case 'keluar': return 'bg-red-100 text-red-800';
      case 'adjustment': return 'bg-orange-100 text-orange-800';
      case 'transfer': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMovementLabel = (type) => {
    switch (type) {
      case 'masuk': return 'Stock In';
      case 'keluar': return 'Stock Out';
      case 'adjustment': return 'Adjustment';
      case 'transfer': return 'Transfer';
      default: return type;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'movements', label: 'Stock Movements', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  const typeFilters = [
    { value: 'all', label: 'Semua Jenis' },
    { value: 'masuk', label: 'Stock In' },
    { value: 'keluar', label: 'Stock Out' },
    { value: 'adjustment', label: 'Adjustment' },
    { value: 'transfer', label: 'Transfer' }
  ];

  const dateFilters = [
    { value: 'all', label: 'Semua Periode' },
    { value: 'today', label: 'Hari Ini' },
    { value: 'week', label: '7 Hari Terakhir' },
    { value: 'month', label: '30 Hari Terakhir' },
    { value: 'quarter', label: '3 Bulan Terakhir' }
  ];

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || movement.type === selectedType;
    return matchesSearch && matchesType;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Stock Movement</h1>
          <p className="text-gray-600">Lacak pergerakan dan transaksi stock inventory</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download size={16} className="mr-2" />
            Export
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
                <Activity className="h-12 w-12 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Transaksi</p>
                  <p className="text-2xl font-bold text-gray-900">{movementStats.totalMovements}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <ArrowDownLeft className="h-12 w-12 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Stock In</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(movementStats.incomingTotal)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <ArrowUpRight className="h-12 w-12 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Stock Out</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(movementStats.outgoingTotal)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <RotateCcw className="h-12 w-12 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Adjustment</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(movementStats.adjustmentTotal)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center">
                <TrendingUp className="h-12 w-12 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Nilai</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(movementStats.totalValue)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Movements */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Pergerakan Stock Terbaru</h3>
            <div className="space-y-4">
              {movements.slice(0, 5).map((movement) => (
                <div key={movement.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div className="flex items-center space-x-4">
                    {getMovementIcon(movement.type)}
                    <div>
                      <h4 className="font-medium text-gray-900">{movement.item}</h4>
                      <p className="text-sm text-gray-500">
                        {movement.quantity > 0 ? '+' : ''}{movement.quantity} {movement.unit} • {movement.date} {movement.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(Math.abs(movement.totalValue))}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMovementColor(movement.type)}`}>
                      {getMovementLabel(movement.type)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'movements' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Cari item, referensi, atau user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {typeFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>{filter.label}</option>
                ))}
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {dateFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>{filter.label}</option>
                ))}
              </select>
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={16} className="mr-2" />
                Filter
              </button>
            </div>
          </div>

          {/* Movements Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal/Waktu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nilai
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referensi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMovements.map((movement) => (
                    <tr key={movement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{movement.date}</div>
                        <div className="text-sm text-gray-500">{movement.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getMovementIcon(movement.type)}
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getMovementColor(movement.type)}`}>
                            {getMovementLabel(movement.type)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{movement.item}</div>
                        <div className="text-sm text-gray-500">{movement.warehouse}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity} {movement.unit}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{movement.prevStock} → {movement.newStock}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(Math.abs(movement.totalValue))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {movement.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User size={16} className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{movement.user}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Analytics Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stock Movement Trends */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Stock Movement Trends</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Area Chart - Stock In vs Stock Out</p>
                  <p className="text-sm text-gray-500">Monthly trends coming soon</p>
                </div>
              </div>
            </div>

            {/* Movement Categories */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Movement by Category</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                    <span className="text-sm">Stock In</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">64%</div>
                    <div className="text-xs text-gray-500">{formatCurrency(movementStats.incomingTotal)}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                    <span className="text-sm">Stock Out</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">28%</div>
                    <div className="text-xs text-gray-500">{formatCurrency(movementStats.outgoingTotal)}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-500 rounded mr-3"></div>
                    <span className="text-sm">Adjustment</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">8%</div>
                    <div className="text-xs text-gray-500">{formatCurrency(movementStats.adjustmentTotal)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Moving Items */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Top Moving Items</h3>
              <div className="space-y-3">
                {[
                  { item: 'Semen Portland', movements: 45, value: 12500000 },
                  { item: 'Besi Beton 12mm', movements: 38, value: 8900000 },
                  { item: 'Pasir Cor', movements: 32, value: 6750000 },
                  { item: 'Helm Safety', movements: 28, value: 3200000 },
                  { item: 'Cat Tembok', movements: 25, value: 2800000 }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <div className="font-medium text-sm">{item.item}</div>
                      <div className="text-xs text-gray-500">{item.movements} movements</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatCurrency(item.value)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Movement Velocity */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Movement Velocity</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Line Chart - Movement Frequency</p>
                  <p className="text-sm text-gray-500">Weekly velocity trends</p>
                </div>
              </div>
            </div>
          </div>

          {/* Insights & Recommendations */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Insights & Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-medium text-blue-900">High Activity Items</h4>
                </div>
                <p className="text-sm text-blue-800">Semen Portland dan Besi Beton menunjukkan aktivitas tinggi. Pertimbangkan untuk menaikkan minimum stock.</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                  <h4 className="font-medium text-yellow-900">Slow Moving Items</h4>
                </div>
                <p className="text-sm text-yellow-800">Beberapa item safety equipment perlu dioptimalasi stocking untuk mengurangi capital tied-up.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <h4 className="font-medium text-green-900">Optimization</h4>
                </div>
                <p className="text-sm text-green-800">Warehouse utilization optimal. Movement patterns menunjukkan efisiensi yang baik.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockMovementManagement;
