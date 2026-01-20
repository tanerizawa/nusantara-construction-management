import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Clock, 
  DollarSign, 
  Package,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Filter,
  Download,
  Eye,
  Edit3
} from 'lucide-react';

const SupplierPerformance = () => {
  const [suppliers] = useState([
    {
      id: 1,
      name: 'PT Sumber Makmur',
      category: 'Material Bangunan',
      rating: 4.8,
      totalOrders: 45,
      onTimeDelivery: 92,
      qualityScore: 4.6,
      totalValue: 2850000000,
      lastOrder: '2024-08-10',
      status: 'active',
      performance: 'excellent',
      monthlyTrend: 'up',
      contactPerson: 'Budi Santoso',
      phone: '021-5555-0001',
      email: 'budi@sumbermakmur.com',
      address: 'Jakarta Barat',
      riskLevel: 'low'
    },
    {
      id: 2,
      name: 'CV Teknik Mandiri',
      category: 'Alat Berat',
      rating: 4.2,
      totalOrders: 28,
      onTimeDelivery: 85,
      qualityScore: 4.1,
      totalValue: 1200000000,
      lastOrder: '2024-08-05',
      status: 'active',
      performance: 'good',
      monthlyTrend: 'stable',
      contactPerson: 'Sarah Wilson',
      phone: '021-5555-0002',
      email: 'sarah@teknikmandiri.com',
      address: 'Tangerang',
      riskLevel: 'medium'
    },
    {
      id: 3,
      name: 'Toko Material Sejahtera',
      category: 'Material Finishing',
      rating: 3.8,
      totalOrders: 62,
      onTimeDelivery: 78,
      qualityScore: 3.9,
      totalValue: 890000000,
      lastOrder: '2024-07-28',
      status: 'active',
      performance: 'average',
      monthlyTrend: 'down',
      contactPerson: 'Ahmad Fauzi',
      phone: '021-5555-0003',
      email: 'ahmad@materialsejahtera.com',
      address: 'Bekasi',
      riskLevel: 'high'
    }
  ]);

  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);

  // Performance metrics summary
  const performanceMetrics = {
    totalSuppliers: suppliers.length,
    averageRating: (suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1),
    averageOnTime: Math.round(suppliers.reduce((sum, s) => sum + s.onTimeDelivery, 0) / suppliers.length),
    totalOrderValue: suppliers.reduce((sum, s) => sum + s.totalValue, 0),
    highRiskSuppliers: suppliers.filter(s => s.riskLevel === 'high').length
  };

  const getPerformanceBadge = (performance) => {
    const badges = {
      excellent: { color: 'bg-green-100 text-green-800', label: 'Excellent' },
      good: { color: 'bg-blue-100 text-blue-800', label: 'Good' },
      average: { color: 'bg-yellow-100 text-yellow-800', label: 'Average' },
      poor: { color: 'bg-red-100 text-red-800', label: 'Poor' }
    };
    return badges[performance] || badges.average;
  };

  const getRiskBadge = (risk) => {
    const badges = {
      low: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      medium: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      high: { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    };
    return badges[risk] || badges.medium;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supplier Performance</h1>
          <p className="text-gray-600 mt-1">Monitor dan evaluasi kinerja supplier</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button 
            onClick={() => setShowEvaluationModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Performance Review
          </button>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{performanceMetrics.totalSuppliers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{performanceMetrics.averageRating}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On-Time Delivery</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{performanceMetrics.averageOnTime}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(performanceMetrics.totalOrderValue)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{performanceMetrics.highRiskSuppliers}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1month">1 Bulan Terakhir</option>
            <option value="3months">3 Bulan Terakhir</option>
            <option value="6months">6 Bulan Terakhir</option>
            <option value="1year">1 Tahun Terakhir</option>
          </select>

          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Semua Kategori</option>
            <option value="Material Bangunan">Material Bangunan</option>
            <option value="Alat Berat">Alat Berat</option>
            <option value="Material Finishing">Material Finishing</option>
          </select>
        </div>
      </div>

      {/* Supplier Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Supplier Performance Details</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">On-Time %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppliers.map((supplier) => {
                const performanceBadge = getPerformanceBadge(supplier.performance);
                const riskBadge = getRiskBadge(supplier.riskLevel);
                const RiskIcon = riskBadge.icon;
                
                return (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                        <div className="text-sm text-gray-500">{supplier.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${performanceBadge.color}`}>
                          {performanceBadge.label}
                        </span>
                        {supplier.monthlyTrend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                        {supplier.monthlyTrend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">{supplier.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{supplier.onTimeDelivery}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${supplier.onTimeDelivery >= 90 ? 'bg-green-600' : supplier.onTimeDelivery >= 80 ? 'bg-yellow-600' : 'bg-red-600'}`}
                          style={{ width: `${supplier.onTimeDelivery}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.totalOrders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(supplier.totalValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskBadge.color}`}>
                        <RiskIcon className="w-3 h-3 mr-1" />
                        {supplier.riskLevel.charAt(0).toUpperCase() + supplier.riskLevel.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setSelectedSupplier(supplier);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit3 className="w-4 h-4" />
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

      {/* Supplier Detail Modal */}
      {showDetailModal && selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Supplier Performance Detail</h3>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Supplier Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Informasi Supplier</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nama Supplier</label>
                      <p className="text-gray-900">{selectedSupplier.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Kategori</label>
                      <p className="text-gray-900">{selectedSupplier.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Contact Person</label>
                      <p className="text-gray-900">{selectedSupplier.contactPerson}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-gray-900">{selectedSupplier.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedSupplier.email}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h4>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Overall Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold">{selectedSupplier.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">On-Time Delivery</span>
                        <span className="font-semibold">{selectedSupplier.onTimeDelivery}%</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Quality Score</span>
                        <span className="font-semibold">{selectedSupplier.qualityScore}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Total Orders</span>
                        <span className="font-semibold">{selectedSupplier.totalOrders}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Evaluation Modal */}
      {showEvaluationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Performance Evaluation</h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">Generate comprehensive supplier performance report</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Evaluation Period</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Q1 2024</option>
                    <option>Q2 2024</option>
                    <option>Q3 2024</option>
                    <option>H1 2024</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Include Metrics</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Delivery Performance</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Quality Ratings</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Cost Analysis</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">Risk Assessment</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setShowEvaluationModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierPerformance;
