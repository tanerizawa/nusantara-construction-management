import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Plus,
  Search,
  Filter,
  FileText,
  Download,
  Upload,
  Settings,
  TrendingUp,
  DollarSign
} from 'lucide-react';

/**
 * Equipment Maintenance Management Component
 * Construction Industry Best Practice Implementation
 * Priority 1 Enhancement - Equipment Lifecycle Management
 */

const EquipmentMaintenanceManagement = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [upcomingMaintenance, setUpcomingMaintenance] = useState([]);
  const [overdueMaintenance, setOverdueMaintenance] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Maintenance stats
  const [stats, setStats] = useState({
    totalEquipment: 0,
    upcomingCount: 0,
    overdueCount: 0,
    completedThisMonth: 0,
    totalMaintenanceCost: 0,
    averageDowntime: 0
  });

  useEffect(() => {
    fetchMaintenanceData();
    fetchEquipmentList();
  }, []);

  const fetchMaintenanceData = async () => {
    try {
      // Mock data untuk equipment maintenance - sesuai construction industry
      const mockMaintenanceRecords = [
        {
          id: 1,
          equipmentId: 'EQP-EXC-001',
          equipmentName: 'Excavator PC200-8',
          maintenanceType: 'preventive',
          scheduledDate: '2025-09-15',
          completedDate: null,
          status: 'upcoming',
          description: 'Engine oil change, hydraulic fluid check, filter replacement',
          estimatedCost: 2500000,
          actualCost: null,
          technician: 'Ahmad Susanto',
          downtime: 0,
          priority: 'high',
          notes: 'Critical maintenance - 500 hours operation',
          location: 'Yard A - Heavy Equipment',
          workOrder: 'WO-2025-089',
          nextDueDate: '2025-12-15',
          parts: [
            { name: 'Engine Oil SAE 15W-40', quantity: 20, unit: 'liter', cost: 800000 },
            { name: 'Hydraulic Filter', quantity: 2, unit: 'pcs', cost: 450000 },
            { name: 'Air Filter', quantity: 1, unit: 'pcs', cost: 350000 }
          ]
        },
        {
          id: 2,
          equipmentId: 'EQP-GEN-001',
          equipmentName: 'Generator Set 150 KVA',
          maintenanceType: 'corrective',
          scheduledDate: '2025-08-28',
          completedDate: '2025-08-30',
          status: 'completed',
          description: 'Starter motor replacement, battery check',
          estimatedCost: 3500000,
          actualCost: 3750000,
          technician: 'Budi Hartono',
          downtime: 8,
          priority: 'urgent',
          notes: 'Emergency repair - generator failed to start',
          location: 'Site Project A',
          workOrder: 'WO-2025-087',
          nextDueDate: '2025-11-28',
          parts: [
            { name: 'Starter Motor', quantity: 1, unit: 'pcs', cost: 2500000 },
            { name: 'Battery 12V 100Ah', quantity: 2, unit: 'pcs', cost: 1250000 }
          ]
        },
        {
          id: 3,
          equipmentId: 'EQP-CRN-001',
          equipmentName: 'Tower Crane QTZ63',
          maintenanceType: 'preventive',
          scheduledDate: '2025-09-10',
          completedDate: null,
          status: 'overdue',
          description: 'Safety inspection, wire rope check, brake system test',
          estimatedCost: 4500000,
          actualCost: null,
          technician: 'Sari Dewi',
          downtime: 0,
          priority: 'critical',
          notes: 'Monthly safety inspection - regulatory requirement',
          location: 'Site Project B - Tower 1',
          workOrder: 'WO-2025-091',
          nextDueDate: '2025-10-10',
          parts: [
            { name: 'Wire Rope 16mm', quantity: 50, unit: 'meter', cost: 2000000 },
            { name: 'Brake Pad Set', quantity: 1, unit: 'set', cost: 1200000 },
            { name: 'Safety Certificate', quantity: 1, unit: 'doc', cost: 500000 }
          ]
        },
        {
          id: 4,
          equipmentId: 'EQP-MXR-001',
          equipmentName: 'Concrete Mixer Truck 7m³',
          maintenanceType: 'preventive',
          scheduledDate: '2025-09-05',
          completedDate: '2025-09-05',
          status: 'completed',
          description: 'Drum bearing lubrication, hydraulic system check',
          estimatedCost: 1800000,
          actualCost: 1950000,
          technician: 'Rina Safitri',
          downtime: 4,
          priority: 'medium',
          notes: 'Regular maintenance - 200 operation hours',
          location: 'Concrete Plant',
          workOrder: 'WO-2025-092',
          nextDueDate: '2025-12-05',
          parts: [
            { name: 'Bearing Grease', quantity: 5, unit: 'kg', cost: 250000 },
            { name: 'Hydraulic Oil', quantity: 15, unit: 'liter', cost: 900000 },
            { name: 'Seal Kit', quantity: 1, unit: 'set', cost: 800000 }
          ]
        }
      ];

      setMaintenanceRecords(mockMaintenanceRecords);

      // Filter untuk upcoming dan overdue
      const upcoming = mockMaintenanceRecords.filter(record => 
        record.status === 'upcoming' && new Date(record.scheduledDate) > new Date()
      );
      const overdue = mockMaintenanceRecords.filter(record => 
        record.status === 'overdue' || 
        (record.status === 'upcoming' && new Date(record.scheduledDate) < new Date())
      );

      setUpcomingMaintenance(upcoming);
      setOverdueMaintenance(overdue);

      // Calculate stats
      const completedThisMonth = mockMaintenanceRecords.filter(record => {
        if (!record.completedDate) return false;
        const completedDate = new Date(record.completedDate);
        const now = new Date();
        return completedDate.getMonth() === now.getMonth() && 
               completedDate.getFullYear() === now.getFullYear();
      }).length;

      const totalCost = mockMaintenanceRecords
        .filter(record => record.actualCost)
        .reduce((sum, record) => sum + record.actualCost, 0);

      const avgDowntime = mockMaintenanceRecords
        .filter(record => record.downtime > 0)
        .reduce((sum, record, _, arr) => sum + record.downtime / arr.length, 0);

      setStats({
        totalEquipment: 15,
        upcomingCount: upcoming.length,
        overdueCount: overdue.length,
        completedThisMonth,
        totalMaintenanceCost: totalCost,
        averageDowntime: Math.round(avgDowntime)
      });

    } catch (error) {
      console.error('Error fetching maintenance data:', error);
    }
  };

  const fetchEquipmentList = async () => {
    try {
      // Mock equipment list untuk dropdown
      const mockEquipment = [
        { id: 'EQP-EXC-001', name: 'Excavator PC200-8', type: 'Heavy Machinery' },
        { id: 'EQP-GEN-001', name: 'Generator Set 150 KVA', type: 'Power Equipment' },
        { id: 'EQP-CRN-001', name: 'Tower Crane QTZ63', type: 'Lifting Equipment' },
        { id: 'EQP-MXR-001', name: 'Concrete Mixer Truck 7m³', type: 'Transport Equipment' },
        { id: 'EQP-PMP-001', name: 'Concrete Pump 45m', type: 'Pumping Equipment' }
      ];
      setEquipmentList(mockEquipment);
    } catch (error) {
      console.error('Error fetching equipment list:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-800 bg-green-100';
      case 'upcoming': return 'text-blue-800 bg-blue-100';
      case 'overdue': return 'text-red-800 bg-red-100';
      case 'in_progress': return 'text-yellow-800 bg-yellow-100';
      default: return 'text-gray-800 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-800 bg-red-100';
      case 'urgent': return 'text-orange-800 bg-orange-100';
      case 'high': return 'text-yellow-800 bg-yellow-100';
      case 'medium': return 'text-blue-800 bg-blue-100';
      case 'low': return 'text-gray-800 bg-gray-100';
      default: return 'text-gray-800 bg-gray-100';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Settings className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Equipment</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalEquipment}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Upcoming</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.upcomingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Overdue</p>
              <p className="text-2xl font-semibold text-red-900">{stats.overdueCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completedThisMonth}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Cost</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.totalMaintenanceCost)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Downtime</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.averageDowntime}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {stats.overdueCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Overdue Maintenance Alert
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {stats.overdueCount} equipment maintenance schedules are overdue. 
                Immediate action required to prevent equipment failure.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Maintenance Records */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Maintenance Activities</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {maintenanceRecords.slice(0, 5).map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.equipmentName}</div>
                      <div className="text-sm text-gray-500">{record.equipmentId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.maintenanceType === 'preventive' ? 'Preventive' : 'Corrective'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(record.scheduledDate).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(record.priority)}`}>
                      {record.priority.charAt(0).toUpperCase() + record.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.actualCost ? formatCurrency(record.actualCost) : formatCurrency(record.estimatedCost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setSelectedEquipment(record)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipment Maintenance Management</h1>
          <p className="text-gray-600">Construction industry best practice - equipment lifecycle management</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Maintenance</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'upcoming', label: 'Upcoming', icon: Clock },
            { id: 'overdue', label: 'Overdue', icon: AlertTriangle },
            { id: 'history', label: 'History', icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      
      {/* Other tabs implementation would go here */}
      
    </div>
  );
};

export default EquipmentMaintenanceManagement;
