import React, { useState } from 'react';
import { 
  AlertTriangle, 
  TrendingDown, 
  Package, 
  Clock,
  ShoppingCart,
  Bell,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

const ReorderAlerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      itemName: 'Semen Portland 50kg',
      currentStock: 45,
      reorderPoint: 100,
      maxStock: 500,
      category: 'Material Bangunan',
      warehouse: 'Gudang Utama',
      supplier: 'PT Sumber Makmur',
      leadTime: 7,
      averageUsage: 25,
      daysUntilStockout: 2,
      priority: 'critical',
      status: 'pending',
      lastOrdered: '2024-07-15',
      suggestedOrder: 455,
      estimatedCost: 22750000,
      projectsAffected: ['Perumahan Green Valley', 'Kantor Pusat ABC']
    },
    {
      id: 2,
      itemName: 'Besi Beton 12mm',
      currentStock: 75,
      reorderPoint: 120,
      maxStock: 800,
      category: 'Material Struktur',
      warehouse: 'Gudang B',
      supplier: 'CV Teknik Mandiri',
      leadTime: 5,
      averageUsage: 15,
      daysUntilStockout: 5,
      priority: 'high',
      status: 'ordered',
      lastOrdered: '2024-08-08',
      suggestedOrder: 725,
      estimatedCost: 43500000,
      projectsAffected: ['Mall Sentral Plaza']
    },
    {
      id: 3,
      itemName: 'Cat Tembok Interior 25L',
      currentStock: 28,
      reorderPoint: 50,
      maxStock: 200,
      category: 'Material Finishing',
      warehouse: 'Gudang C',
      supplier: 'Toko Material Sejahtera',
      leadTime: 3,
      averageUsage: 8,
      daysUntilStockout: 4,
      priority: 'medium',
      status: 'pending',
      lastOrdered: '2024-07-20',
      suggestedOrder: 172,
      estimatedCost: 8600000,
      projectsAffected: ['Renovasi Kantor XYZ']
    },
    {
      id: 4,
      itemName: 'Pipa PVC 4 inch',
      currentStock: 15,
      reorderPoint: 30,
      maxStock: 150,
      category: 'Material MEP',
      warehouse: 'Gudang Utama',
      supplier: 'PT Pipa Nusantara',
      leadTime: 4,
      averageUsage: 6,
      daysUntilStockout: 3,
      priority: 'high',
      status: 'pending',
      lastOrdered: '2024-07-28',
      suggestedOrder: 135,
      estimatedCost: 6750000,
      projectsAffected: ['Perumahan Green Valley']
    }
  ]);

  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Alert statistics
  const alertStats = {
    total: alerts.length,
    critical: alerts.filter(a => a.priority === 'critical').length,
    high: alerts.filter(a => a.priority === 'high').length,
    medium: alerts.filter(a => a.priority === 'medium').length,
    pending: alerts.filter(a => a.status === 'pending').length,
    totalCost: alerts.reduce((sum, a) => sum + a.estimatedCost, 0)
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      critical: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      high: { color: 'bg-orange-100 text-orange-800', icon: TrendingDown },
      medium: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      low: { color: 'bg-green-100 text-green-800', icon: CheckCircle }
    };
    return badges[priority] || badges.medium;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      ordered: { color: 'bg-blue-100 text-blue-800', icon: ShoppingCart },
      received: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle }
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

  const handleCreateOrder = (alert) => {
    // Logic to create purchase order
    setAlerts(alerts.map(a => 
      a.id === alert.id 
        ? { ...a, status: 'ordered' }
        : a
    ));
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(alerts.filter(a => a.id !== alertId));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (selectedPriority !== 'all' && alert.priority !== selectedPriority) return false;
    if (selectedStatus !== 'all' && alert.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reorder Alerts</h1>
          <p className="text-gray-600 mt-1">Monitor stock levels dan automated reorder points</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => setShowSettingsModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Alert Settings
          </button>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{alertStats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{alertStats.critical}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{alertStats.high}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Medium Priority</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{alertStats.medium}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{alertStats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cost</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(alertStats.totalCost)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
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
            value={selectedPriority} 
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Semua Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="ordered">Ordered</option>
            <option value="received">Received</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active Reorder Alerts</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Until Stockout</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suggested Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAlerts.map((alert) => {
                const priorityBadge = getPriorityBadge(alert.priority);
                const statusBadge = getStatusBadge(alert.status);
                const PriorityIcon = priorityBadge.icon;
                const StatusIcon = statusBadge.icon;
                
                return (
                  <tr key={alert.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{alert.itemName}</div>
                        <div className="text-sm text-gray-500">{alert.category} • {alert.warehouse}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-900">
                          {alert.currentStock} / {alert.reorderPoint} (min)
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              alert.currentStock <= alert.reorderPoint * 0.5 ? 'bg-red-600' : 
                              alert.currentStock <= alert.reorderPoint * 0.8 ? 'bg-yellow-600' : 
                              'bg-green-600'
                            }`}
                            style={{ width: `${Math.max((alert.currentStock / alert.reorderPoint) * 100, 10)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityBadge.color}`}>
                        <PriorityIcon className="w-3 h-3 mr-1" />
                        {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {alert.daysUntilStockout} hari
                      </div>
                      <div className="text-xs text-gray-500">
                        Usage: {alert.averageUsage}/hari
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {alert.suggestedOrder} unit
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(alert.estimatedCost)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setSelectedAlert(alert);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {alert.status === 'pending' && (
                          <button 
                            onClick={() => handleCreateOrder(alert)}
                            className="text-green-600 hover:text-green-900"
                            title="Create Order"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDismissAlert(alert.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Dismiss Alert"
                        >
                          <XCircle className="w-4 h-4" />
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

      {/* Alert Detail Modal */}
      {showDetailModal && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Alert Detail</h3>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Item Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Item Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Item Name</label>
                      <p className="text-gray-900">{selectedAlert.itemName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      <p className="text-gray-900">{selectedAlert.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Warehouse</label>
                      <p className="text-gray-900">{selectedAlert.warehouse}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Supplier</label>
                      <p className="text-gray-900">{selectedAlert.supplier}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Stock Information</h4>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Current Stock</span>
                        <span className="font-semibold text-2xl">{selectedAlert.currentStock}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Reorder Point</span>
                        <span className="font-semibold">{selectedAlert.reorderPoint}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Max Stock</span>
                        <span className="font-semibold">{selectedAlert.maxStock}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Projects Affected */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Projects Affected</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAlert.projectsAffected.map((project, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {project}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Action */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Recommended Action</h4>
                <p className="text-blue-800 mb-4">
                  Order {selectedAlert.suggestedOrder} units to maintain optimal stock levels
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleCreateOrder(selectedAlert)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Purchase Order
                  </button>
                  <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                    Adjust Reorder Point
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Alert Settings</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h4>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">SMS Notifications</span>
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">In-App Notifications</span>
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                  </label>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Alert Thresholds</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Critical Alert Threshold (%)</label>
                    <input 
                      type="number" 
                      defaultValue="25"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">High Priority Threshold (%)</label>
                    <input 
                      type="number" 
                      defaultValue="50"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medium Priority Threshold (%)</label>
                    <input 
                      type="number" 
                      defaultValue="75"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReorderAlerts;
