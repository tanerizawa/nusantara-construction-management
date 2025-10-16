import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Plus,
  Download,
  Upload,
  BarChart3,
  Filter,
  Camera,
  FileText,
  Eye,
  Edit3,
  Trash2
} from 'lucide-react';

const StockOpname = () => {
  const [opnameRecords, setOpnameRecords] = useState([
    {
      id: 1,
      opnameCode: 'SO-2024-001',
      date: '2024-08-14',
      type: 'Full Opname',
      warehouse: 'Gudang Utama',
      supervisor: 'Ahmad Fauzi',
      status: 'completed',
      totalItems: 145,
      discrepancies: 8,
      accuracy: 94.5,
      value: 2850000000,
      variance: -12500000,
      startTime: '08:00',
      endTime: '17:30',
      notes: 'Opname rutin bulanan'
    },
    {
      id: 2,
      opnameCode: 'SO-2024-002',
      date: '2024-08-12',
      type: 'Cycle Count',
      warehouse: 'Gudang B',
      supervisor: 'Sarah Wilson',
      status: 'in_progress',
      totalItems: 75,
      discrepancies: 3,
      accuracy: 96.0,
      value: 890000000,
      variance: 5200000,
      startTime: '09:00',
      endTime: null,
      notes: 'Focus pada material finishing'
    },
    {
      id: 3,
      opnameCode: 'SO-2024-003',
      date: '2024-08-10',
      type: 'Spot Check',
      warehouse: 'Gudang C',
      supervisor: 'Budi Santoso',
      status: 'pending',
      totalItems: 32,
      discrepancies: 0,
      accuracy: 100.0,
      value: 450000000,
      variance: 0,
      startTime: null,
      endTime: null,
      notes: 'Verifikasi item high value'
    }
  ]);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');

  // New opname form state
  const [newOpname, setNewOpname] = useState({
    type: 'full',
    warehouse: '',
    supervisor: '',
    date: '',
    notes: ''
  });

  // Stock opname items (example for detail view)
  const [opnameItems] = useState([
    {
      id: 1,
      itemCode: 'SMN-001',
      itemName: 'Semen Portland 50kg',
      systemStock: 150,
      physicalStock: 148,
      variance: -2,
      unit: 'sak',
      location: 'A1-01',
      checker: 'Ahmad Fauzi',
      notes: 'Minor shortage',
      photo: null
    },
    {
      id: 2,
      itemCode: 'BSB-012',
      itemName: 'Besi Beton 12mm',
      systemStock: 100,
      physicalStock: 103,
      variance: 3,
      unit: 'batang',
      location: 'B2-05',
      checker: 'Sari Dewi',
      notes: 'Extra stock found',
      photo: null
    },
    {
      id: 3,
      itemCode: 'CAT-025',
      itemName: 'Cat Tembok Interior 25L',
      systemStock: 45,
      physicalStock: 45,
      variance: 0,
      unit: 'kaleng',
      location: 'C1-03',
      checker: 'Rudi Hartono',
      notes: 'Stock match',
      photo: null
    }
  ]);

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      in_progress: { color: 'bg-blue-100 text-blue-800', icon: BarChart3 },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    };
    return badges[status] || badges.pending;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCreateOpname = () => {
    const opnameCode = `SO-2024-${String(opnameRecords.length + 1).padStart(3, '0')}`;
    const newRecord = {
      id: opnameRecords.length + 1,
      opnameCode,
      ...newOpname,
      status: 'pending',
      totalItems: 0,
      discrepancies: 0,
      accuracy: 0,
      value: 0,
      variance: 0,
      startTime: null,
      endTime: null
    };
    
    setOpnameRecords([...opnameRecords, newRecord]);
    setNewOpname({ type: 'full', warehouse: '', supervisor: '', date: '', notes: '' });
    setShowCreateModal(false);
  };

  const filteredRecords = opnameRecords.filter(record => {
    if (selectedStatus !== 'all' && record.status !== selectedStatus) return false;
    if (selectedWarehouse !== 'all' && record.warehouse !== selectedWarehouse) return false;
    return true;
  });

  // Statistics
  const stats = {
    total: opnameRecords.length,
    completed: opnameRecords.filter(r => r.status === 'completed').length,
    inProgress: opnameRecords.filter(r => r.status === 'in_progress').length,
    pending: opnameRecords.filter(r => r.status === 'pending').length,
    averageAccuracy: opnameRecords.reduce((sum, r) => sum + r.accuracy, 0) / opnameRecords.length || 0,
    totalVariance: opnameRecords.reduce((sum, r) => sum + r.variance, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Opname</h1>
          <p className="text-gray-600 mt-1">Manajemen stock taking dan inventory audit</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import Template
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Opname
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Opname</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Accuracy</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.averageAccuracy.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Variance</p>
              <p className={`text-2xl font-bold mt-1 ${stats.totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(stats.totalVariance))}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stats.totalVariance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <AlertTriangle className={`w-6 h-6 ${stats.totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
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
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select 
            value={selectedWarehouse} 
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Semua Gudang</option>
            <option value="Gudang Utama">Gudang Utama</option>
            <option value="Gudang B">Gudang B</option>
            <option value="Gudang C">Gudang C</option>
          </select>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search opname..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Opname Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Stock Opname Records</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opname Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => {
                const statusBadge = getStatusBadge(record.status);
                const StatusIcon = statusBadge.icon;
                
                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.opnameCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.date}</div>
                        <div className="text-sm text-gray-500">{record.type}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.warehouse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.supervisor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {record.status.replace('_', ' ').charAt(0).toUpperCase() + record.status.replace('_', ' ').slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.accuracy}%</div>
                      <div className="text-sm text-gray-500">{record.discrepancies} discrepancies</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${record.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {record.variance >= 0 ? '+' : ''}{formatCurrency(record.variance)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setSelectedRecord(record);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" title="Delete">
                          <Trash2 className="w-4 h-4" />
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

      {/* Create Opname Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Create New Stock Opname</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opname Type</label>
                  <select 
                    value={newOpname.type}
                    onChange={(e) => setNewOpname({...newOpname, type: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="full">Full Opname</option>
                    <option value="cycle">Cycle Count</option>
                    <option value="spot">Spot Check</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse</label>
                  <select 
                    value={newOpname.warehouse}
                    onChange={(e) => setNewOpname({...newOpname, warehouse: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Warehouse</option>
                    <option value="Gudang Utama">Gudang Utama</option>
                    <option value="Gudang B">Gudang B</option>
                    <option value="Gudang C">Gudang C</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Supervisor</label>
                  <input
                    type="text"
                    value={newOpname.supervisor}
                    onChange={(e) => setNewOpname({...newOpname, supervisor: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter supervisor name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
                  <input
                    type="date"
                    value={newOpname.date}
                    onChange={(e) => setNewOpname({...newOpname, date: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={newOpname.notes}
                  onChange={(e) => setNewOpname({...newOpname, notes: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter any additional notes..."
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateOpname}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Opname
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  Stock Opname Detail - {selectedRecord.opnameCode}
                </h3>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Opname Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Opname Info</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Type:</span>
                      <span className="ml-2 font-medium">{selectedRecord.type}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Date:</span>
                      <span className="ml-2 font-medium">{selectedRecord.date}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Warehouse:</span>
                      <span className="ml-2 font-medium">{selectedRecord.warehouse}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Supervisor:</span>
                      <span className="ml-2 font-medium">{selectedRecord.supervisor}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Results</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Total Items:</span>
                      <span className="ml-2 font-medium">{selectedRecord.totalItems}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Discrepancies:</span>
                      <span className="ml-2 font-medium">{selectedRecord.discrepancies}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Accuracy:</span>
                      <span className="ml-2 font-medium">{selectedRecord.accuracy}%</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Value Variance:</span>
                      <span className={`ml-2 font-medium ${selectedRecord.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(selectedRecord.variance)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Timing</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Start Time:</span>
                      <span className="ml-2 font-medium">{selectedRecord.startTime || 'Not started'}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">End Time:</span>
                      <span className="ml-2 font-medium">{selectedRecord.endTime || 'In progress'}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className="ml-2">
                        {(() => {
                          const statusBadge = getStatusBadge(selectedRecord.status);
                          const StatusIcon = statusBadge.icon;
                          return (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {selectedRecord.status.replace('_', ' ').charAt(0).toUpperCase() + selectedRecord.status.replace('_', ' ').slice(1)}
                            </span>
                          );
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Item Details Table */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h4>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">System Stock</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Physical Stock</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variance</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Checker</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {opnameItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                              <div className="text-sm text-gray-500">{item.itemCode}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.location}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.systemStock} {item.unit}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.physicalStock} {item.unit}</td>
                          <td className="px-4 py-3">
                            <span className={`text-sm font-medium ${item.variance > 0 ? 'text-green-600' : item.variance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                              {item.variance > 0 ? '+' : ''}{item.variance} {item.unit}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.checker}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-600 hover:text-blue-900" title="Add Photo">
                                <Camera className="w-4 h-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-900" title="Notes">
                                <FileText className="w-4 h-4" />
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
          </div>
        </div>
      )}
    </div>
  );
};

export default StockOpname;
