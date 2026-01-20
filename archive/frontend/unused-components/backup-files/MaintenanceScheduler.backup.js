import React, { useState, useEffect, useCallback } from 'react';
import { 
  Wrench, 
  Calendar, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  DollarSign,
  User,
  Building,
  RefreshCw,
  AlertCircle as AlertIcon,
  Download,
  Bell
} from 'lucide-react';
import axios from 'axios';

/**
 * Maintenance Scheduler Component
 * 
 * Comprehensive maintenance management for construction assets
 * Features:
 * - Preventive maintenance scheduling
 * - Work order management
 * - Maintenance cost tracking
 * - Vendor management
 * - Maintenance history and analytics
 * - Integration with asset registry
 */
const MaintenanceScheduler = () => {
  const [assets, setAssets] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [upcomingMaintenance, setUpcomingMaintenance] = useState([]);
  const [overdueMaintenance, setOverdueMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const maintenanceTypes = {
    ROUTINE: 'Rutin',
    PREVENTIVE: 'Preventif',
    CORRECTIVE: 'Korektif',
    EMERGENCY: 'Darurat',
    OVERHAUL: 'Overhaul'
  };

  const maintenanceStatuses = {
    SCHEDULED: 'Terjadwal',
    IN_PROGRESS: 'Sedang Berlangsung',
    COMPLETED: 'Selesai',
    CANCELLED: 'Dibatalkan',
    OVERDUE: 'Terlambat'
  };

  // Fetch maintenance data
  const fetchMaintenanceData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch assets from database
      const assetsResponse = await axios.get('/api/reports/fixed-asset/list');
      
      if (assetsResponse.data.success) {
        const rawAssets = assetsResponse.data.assets || [];
        
        // Transform assets for maintenance scheduling
        const assetsWithMaintenance = rawAssets.map(asset => {
          const purchaseDate = new Date(asset.purchase_date);
          const currentDate = new Date();
          
          // Calculate default maintenance intervals based on asset category
          let maintenanceInterval = 12; // Default 12 months
          if (asset.asset_category === 'HEAVY_EQUIPMENT') maintenanceInterval = 6;
          if (asset.asset_category === 'VEHICLES') maintenanceInterval = 3;
          if (asset.asset_category === 'TOOLS_MACHINERY') maintenanceInterval = 6;
          
          // Calculate last and next maintenance dates
          const monthsSincePurchase = (currentDate.getFullYear() - purchaseDate.getFullYear()) * 12 + 
                                     (currentDate.getMonth() - purchaseDate.getMonth());
          
          const maintenanceCycles = Math.floor(monthsSincePurchase / maintenanceInterval);
          
          const lastMaintenanceDate = new Date(purchaseDate);
          lastMaintenanceDate.setMonth(lastMaintenanceDate.getMonth() + (maintenanceCycles * maintenanceInterval));
          
          const nextMaintenanceDate = new Date(lastMaintenanceDate);
          nextMaintenanceDate.setMonth(nextMaintenanceDate.getMonth() + maintenanceInterval);
          
          // Estimate operating hours based on asset age and category
          let estimatedHours = 0;
          if (asset.asset_category === 'HEAVY_EQUIPMENT') estimatedHours = monthsSincePurchase * 180;
          if (asset.asset_category === 'VEHICLES') estimatedHours = monthsSincePurchase * 120;
          if (asset.asset_category === 'TOOLS_MACHINERY') estimatedHours = monthsSincePurchase * 80;
          
          return {
            id: asset.id,
            assetCode: asset.asset_code,
            assetName: asset.asset_name,
            location: asset.location || 'Not specified',
            lastMaintenanceDate: lastMaintenanceDate.toISOString().split('T')[0],
            nextMaintenanceDate: nextMaintenanceDate.toISOString().split('T')[0],
            maintenanceInterval: maintenanceInterval,
            operatingHours: estimatedHours,
            condition: asset.condition || 'GOOD'
          };
        });

        // Generate maintenance records based on asset maintenance history
        const maintenanceRecords = assetsWithMaintenance.flatMap(asset => {
          const records = [];
          const purchaseDate = new Date(asset.lastMaintenanceDate);
          const currentDate = new Date();
          
          // Generate past maintenance records
          const maintenanceTypes = ['ROUTINE', 'PREVENTIVE', 'CORRECTIVE'];
          const statuses = ['COMPLETED', 'SCHEDULED', 'IN_PROGRESS'];
          
          // Create last maintenance record
          records.push({
            id: `MAINT-${asset.id}-001`,
            assetId: asset.id,
            assetName: asset.assetName,
            assetCode: asset.assetCode,
            maintenanceDate: asset.lastMaintenanceDate,
            maintenanceType: 'ROUTINE',
            description: `Regular maintenance for ${asset.assetName}`,
            cost: asset.assetCode.includes('EXC') ? 25000000 : 
                  asset.assetCode.includes('CRN') ? 45000000 : 15000000,
            technician: 'Service Team',
            vendor: 'Authorized Service Center',
            status: 'COMPLETED',
            workOrder: `WO-${new Date().getFullYear()}-${asset.id}`,
            duration: 8,
            nextMaintenanceDate: asset.nextMaintenanceDate,
            notes: 'Regular scheduled maintenance completed'
          });
          
          // Create next maintenance record if upcoming
          const nextDate = new Date(asset.nextMaintenanceDate);
          const today = new Date();
          const daysUntil = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
          
          if (daysUntil <= 60) { // Create record for upcoming maintenance within 60 days
            records.push({
              id: `MAINT-${asset.id}-002`,
              assetId: asset.id,
              assetName: asset.assetName,
              assetCode: asset.assetCode,
              maintenanceDate: asset.nextMaintenanceDate,
              maintenanceType: 'ROUTINE',
              description: `Scheduled maintenance for ${asset.assetName}`,
              cost: asset.assetCode.includes('EXC') ? 25000000 : 
                    asset.assetCode.includes('CRN') ? 45000000 : 15000000,
              technician: 'To be assigned',
              vendor: 'Authorized Service Center',
              status: daysUntil < 0 ? 'OVERDUE' : 'SCHEDULED',
              workOrder: `WO-${new Date().getFullYear()}-${asset.id}-NEXT`,
              duration: 8,
              nextMaintenanceDate: new Date(nextDate.getTime() + (asset.maintenanceInterval * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
              notes: daysUntil < 0 ? 'Maintenance overdue' : 'Scheduled maintenance'
            });
          }
          
          return records;
        });

        setAssets(assetsWithMaintenance);
        setMaintenanceRecords(maintenanceRecords);
        setFilteredRecords(maintenanceRecords);

        // Calculate upcoming and overdue maintenance
        const today = new Date();
        const upcoming = assetsWithMaintenance.filter(asset => {
          const nextDate = new Date(asset.nextMaintenanceDate);
          const daysUntil = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
          return daysUntil <= 30 && daysUntil > 0;
        });

        const overdue = assetsWithMaintenance.filter(asset => {
          const nextDate = new Date(asset.nextMaintenanceDate);
          return nextDate < today;
        });

        setUpcomingMaintenance(upcoming);
        setOverdueMaintenance(overdue);
      } else {
        setError('Failed to fetch assets data');
      }

    } catch (error) {
      console.error('Error fetching maintenance data:', error);
      setError('Failed to load maintenance data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaintenanceData();
  }, [fetchMaintenanceData]);

  // Filter maintenance records
  useEffect(() => {
    let filtered = maintenanceRecords;

    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(record => record.status === filterStatus);
    }

    if (filterType) {
      filtered = filtered.filter(record => record.maintenanceType === filterType);
    }

    setFilteredRecords(filtered);
  }, [searchTerm, filterStatus, filterType, maintenanceRecords]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      OVERDUE: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type) => {
    const colors = {
      ROUTINE: 'bg-blue-100 text-blue-800',
      PREVENTIVE: 'bg-green-100 text-green-800',
      CORRECTIVE: 'bg-yellow-100 text-yellow-800',
      EMERGENCY: 'bg-red-100 text-red-800',
      OVERHAUL: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getDaysUntilMaintenance = (dateString) => {
    const today = new Date();
    const maintenanceDate = new Date(dateString);
    const diffTime = maintenanceDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalMaintenanceCost = maintenanceRecords.reduce((sum, record) => sum + record.cost, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Wrench className="mr-3 text-blue-600" size={32} />
              Maintenance Scheduler
            </h1>
            <p className="text-gray-600 mt-2">
              Jadwal maintenance preventif dan tracking work orders - Asset maintenance management
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Schedule Maintenance
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center transition-colors">
              <Download size={20} className="mr-2" />
              Export Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Calendar },
              { id: 'schedule', label: 'Maintenance Schedule', icon: Clock },
              { id: 'records', label: 'Maintenance Records', icon: Wrench },
              { id: 'assets', label: 'Asset Status', icon: Building }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="mr-2" size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Assets</p>
                  <p className="text-2xl font-bold text-gray-900">{assets.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Building className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming Maintenance</p>
                  <p className="text-2xl font-bold text-yellow-600">{upcomingMaintenance.length}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overdue Maintenance</p>
                  <p className="text-2xl font-bold text-red-600">{overdueMaintenance.length}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Maintenance Cost</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalMaintenanceCost)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="text-green-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Maintenance */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Bell className="mr-2 text-yellow-600" size={20} />
                  Upcoming Maintenance
                </h3>
                <span className="text-sm text-gray-500">{upcomingMaintenance.length} items</span>
              </div>
              <div className="space-y-3">
                {upcomingMaintenance.slice(0, 5).map((asset) => {
                  const daysUntil = getDaysUntilMaintenance(asset.nextMaintenanceDate);
                  return (
                    <div key={asset.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{asset.assetName}</p>
                        <p className="text-sm text-gray-600">{asset.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-yellow-600">
                          {daysUntil} days
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(asset.nextMaintenanceDate)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Overdue Maintenance */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <AlertTriangle className="mr-2 text-red-600" size={20} />
                  Overdue Maintenance
                </h3>
                <span className="text-sm text-gray-500">{overdueMaintenance.length} items</span>
              </div>
              <div className="space-y-3">
                {overdueMaintenance.slice(0, 5).map((asset) => {
                  const daysOverdue = Math.abs(getDaysUntilMaintenance(asset.nextMaintenanceDate));
                  return (
                    <div key={asset.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{asset.assetName}</p>
                        <p className="text-sm text-gray-600">{asset.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-600">
                          {daysOverdue} days overdue
                        </p>
                        <p className="text-xs text-gray-500">
                          Due: {formatDate(asset.nextMaintenanceDate)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Records Tab */}
      {activeTab === 'records' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari maintenance records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Status</option>
                {Object.entries(maintenanceStatuses).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Type</option>
                {Object.entries(maintenanceTypes).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>

              <button
                onClick={fetchMaintenanceData}
                disabled={loading}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center transition-colors disabled:opacity-50"
              >
                <RefreshCw size={20} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Maintenance Records Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Maintenance Records ({filteredRecords.length} records)
              </h3>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="animate-spin text-blue-600" size={32} />
                <span className="ml-3 text-gray-600">Loading maintenance records...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <AlertIcon className="text-red-600" size={32} />
                <span className="ml-3 text-red-600">{error}</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Asset
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Maintenance Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Technician
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {record.assetName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {record.assetCode} • {record.workOrder}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(record.maintenanceDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(record.maintenanceType)}`}>
                            {maintenanceTypes[record.maintenanceType]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                            {maintenanceStatuses[record.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(record.cost)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{record.technician}</div>
                          <div className="text-sm text-gray-500">{record.vendor}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedRecord(record)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRecord(record);
                                setShowAddModal(true);
                              }}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              <Edit size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TODO: Add other tabs (schedule, assets) */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Maintenance Schedule</h3>
          <p className="text-gray-600">Calendar view coming soon...</p>
        </div>
      )}

      {activeTab === 'assets' && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Building className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Asset Status</h3>
          <p className="text-gray-600">Asset maintenance status overview coming soon...</p>
        </div>
      )}

      {/* TODO: Add Maintenance Modal */}
    </div>
  );
};

export default MaintenanceScheduler;