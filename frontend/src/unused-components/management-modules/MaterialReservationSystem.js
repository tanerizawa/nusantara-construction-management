import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Package, 
  MapPin, 
  User, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2
} from 'lucide-react';

/**
 * Material Reservation System Component
 * Construction Industry Best Practice Implementation
 * Priority 1 Enhancement - Project Material Planning
 */

const MaterialReservationSystem = () => {
  const [reservations, setReservations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Reservation stats
  const [stats, setStats] = useState({
    totalReservations: 0,
    activeReservations: 0,
    pendingApproval: 0,
    totalReservedValue: 0,
    criticalShortages: 0,
    utilizationRate: 0
  });

  const [newReservation, setNewReservation] = useState({
    projectId: '',
    materialId: '',
    quantity: '',
    reservedDate: '',
    requiredDate: '',
    requestedBy: '',
    purpose: '',
    priority: 'medium',
    notes: ''
  });

  useEffect(() => {
    fetchReservations();
    fetchProjects();
    fetchMaterials();
  }, []);

  const fetchReservations = async () => {
    try {
      // Mock data untuk material reservations - construction industry specific
      const mockReservations = [
        {
          id: 'RSV-2025-001',
          projectId: 'PRJ-001',
          projectName: 'Perumahan Green Valley Phase 1',
          materialId: 'MAT-001',
          materialName: 'Semen Portland Type I',
          materialCode: 'CMT-POR-T1-50KG',
          quantity: 500,
          unit: 'sak',
          unitPrice: 75000,
          totalValue: 37500000,
          reservedDate: '2025-09-01',
          requiredDate: '2025-09-15',
          requestedBy: 'Ahmad Fauzi',
          requestedByRole: 'Site Manager',
          approvedBy: 'Budi Santoso',
          approvedDate: '2025-09-02',
          status: 'approved',
          priority: 'high',
          purpose: 'Foundation concrete work - Block A1-A5',
          notes: 'Critical path activity - no delays acceptable',
          warehouse: 'Gudang Utama',
          currentStock: 2500,
          availableStock: 2000,
          location: 'Area A1-01',
          projectPhase: 'Foundation',
          estimatedUsageDate: '2025-09-16',
          wastageAllowance: 0.05, // 5% wastage factor
          actualQuantity: 525, // including wastage
          releaseStatus: 'pending_release',
          trackingCode: 'TRK-RSV-001'
        },
        {
          id: 'RSV-2025-002',
          projectId: 'PRJ-002',
          projectName: 'Mall Sentral Karawang',
          materialId: 'MAT-002',
          materialName: 'Besi Beton 12mm',
          materialCode: 'STL-RBR-12MM',
          quantity: 200,
          unit: 'batang',
          unitPrice: 125000,
          totalValue: 25000000,
          reservedDate: '2025-08-30',
          requiredDate: '2025-09-10',
          requestedBy: 'Sari Dewi',
          requestedByRole: 'Structural Engineer',
          approvedBy: null,
          approvedDate: null,
          status: 'pending_approval',
          priority: 'critical',
          purpose: 'Column reinforcement - Level 2',
          notes: 'BOQ Item 3.2.1 - Grade BJTD 24 required',
          warehouse: 'Gudang B',
          currentStock: 150,
          availableStock: 150,
          location: 'Area B2-05',
          projectPhase: 'Structure',
          estimatedUsageDate: '2025-09-12',
          wastageAllowance: 0.03,
          actualQuantity: 206,
          releaseStatus: 'not_released',
          trackingCode: 'TRK-RSV-002',
          shortage: 50 // insufficient stock
        },
        {
          id: 'RSV-2025-003',
          projectId: 'PRJ-001',
          projectName: 'Perumahan Green Valley Phase 1',
          materialId: 'MAT-003',
          materialName: 'Keramik 40x40 cm',
          materialCode: 'FIN-KRM-40X40',
          quantity: 1000,
          unit: 'm2',
          unitPrice: 85000,
          totalValue: 85000000,
          reservedDate: '2025-08-25',
          requiredDate: '2025-10-01',
          requestedBy: 'Rina Safitri',
          requestedByRole: 'Interior Designer',
          approvedBy: 'Budi Santoso',
          approvedDate: '2025-08-26',
          status: 'released',
          priority: 'medium',
          purpose: 'Flooring installation - Type 36 houses',
          notes: 'Color: Beige Marble pattern, Grade A quality',
          warehouse: 'Gudang C',
          currentStock: 1200,
          availableStock: 200,
          location: 'Area C1-03',
          projectPhase: 'Finishing',
          estimatedUsageDate: '2025-10-05',
          wastageAllowance: 0.10, // 10% for ceramic
          actualQuantity: 1100,
          releaseStatus: 'released',
          trackingCode: 'TRK-RSV-003',
          releasedDate: '2025-09-01',
          releasedBy: 'Diana Putri'
        },
        {
          id: 'RSV-2025-004',
          projectId: 'PRJ-003',
          projectName: 'Gedung Perkantoran CBD',
          materialId: 'MAT-004',
          materialName: 'Ready Mix Concrete K-300',
          materialCode: 'RMX-K300',
          quantity: 150,
          unit: 'm3',
          unitPrice: 850000,
          totalValue: 127500000,
          reservedDate: '2025-09-02',
          requiredDate: '2025-09-08',
          requestedBy: 'Bambang Suryono',
          requestedByRole: 'Project Manager',
          approvedBy: null,
          approvedDate: null,
          status: 'pending_approval',
          priority: 'urgent',
          purpose: 'Slab casting - Level 3',
          notes: 'Weather dependent - monsoon season consideration',
          warehouse: 'Concrete Plant',
          currentStock: 0, // Made to order
          availableStock: 0,
          location: 'Concrete Plant',
          projectPhase: 'Structure',
          estimatedUsageDate: '2025-09-09',
          wastageAllowance: 0.02,
          actualQuantity: 153,
          releaseStatus: 'not_released',
          trackingCode: 'TRK-RSV-004',
          supplierDelivery: true,
          deliverySchedule: '2025-09-08 06:00'
        }
      ];

      setReservations(mockReservations);

      // Calculate stats
      const activeCount = mockReservations.filter(r => r.status !== 'cancelled' && r.status !== 'completed').length;
      const pendingCount = mockReservations.filter(r => r.status === 'pending_approval').length;
      const totalValue = mockReservations
        .filter(r => r.status !== 'cancelled')
        .reduce((sum, r) => sum + r.totalValue, 0);
      const shortages = mockReservations.filter(r => r.shortage && r.shortage > 0).length;

      setStats({
        totalReservations: mockReservations.length,
        activeReservations: activeCount,
        pendingApproval: pendingCount,
        totalReservedValue: totalValue,
        criticalShortages: shortages,
        utilizationRate: 85
      });

    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const mockProjects = [
        { id: 'PRJ-001', name: 'Perumahan Green Valley Phase 1', status: 'active' },
        { id: 'PRJ-002', name: 'Mall Sentral Karawang', status: 'active' },
        { id: 'PRJ-003', name: 'Gedung Perkantoran CBD', status: 'planning' },
        { id: 'PRJ-004', name: 'Apartemen Sky Tower', status: 'active' }
      ];
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const mockMaterials = [
        { id: 'MAT-001', name: 'Semen Portland Type I', code: 'CMT-POR-T1-50KG', unit: 'sak', currentStock: 2500 },
        { id: 'MAT-002', name: 'Besi Beton 12mm', code: 'STL-RBR-12MM', unit: 'batang', currentStock: 150 },
        { id: 'MAT-003', name: 'Keramik 40x40 cm', code: 'FIN-KRM-40X40', unit: 'm2', currentStock: 1200 },
        { id: 'MAT-004', name: 'Ready Mix Concrete K-300', code: 'RMX-K300', unit: 'm3', currentStock: 0 }
      ];
      setMaterials(mockMaterials);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-800 bg-green-100';
      case 'pending_approval': return 'text-yellow-800 bg-yellow-100';
      case 'released': return 'text-blue-800 bg-blue-100';
      case 'completed': return 'text-gray-800 bg-gray-100';
      case 'cancelled': return 'text-red-800 bg-red-100';
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

  const handleApprove = async (reservationId) => {
    try {
      // API call to approve reservation
      console.log('Approving reservation:', reservationId);
      // Update local state
      setReservations(prev => prev.map(r => 
        r.id === reservationId 
          ? { ...r, status: 'approved', approvedBy: 'Current User', approvedDate: new Date().toISOString().split('T')[0] }
          : r
      ));
    } catch (error) {
      console.error('Error approving reservation:', error);
    }
  };

  const handleRelease = async (reservationId) => {
    try {
      // API call to release materials
      console.log('Releasing materials for reservation:', reservationId);
      setReservations(prev => prev.map(r => 
        r.id === reservationId 
          ? { ...r, releaseStatus: 'released', releasedDate: new Date().toISOString().split('T')[0], releasedBy: 'Current User' }
          : r
      ));
    } catch (error) {
      console.error('Error releasing materials:', error);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Reservations</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalReservations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeReservations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Approval</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingApproval}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Critical Shortages</p>
              <p className="text-2xl font-semibold text-red-900">{stats.criticalShortages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Reserved Value</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(stats.totalReservedValue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Utilization Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.utilizationRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {stats.criticalShortages > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Material Shortage Alert
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {stats.criticalShortages} reservations have insufficient stock. 
                Review procurement schedule to prevent project delays.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Reservations */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Material Reservations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reservation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Required Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.slice(0, 5).map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{reservation.id}</div>
                      <div className="text-sm text-gray-500">{reservation.trackingCode}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.projectName}</div>
                    <div className="text-sm text-gray-500">{reservation.projectPhase}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{reservation.materialName}</div>
                    <div className="text-sm text-gray-500">{reservation.materialCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.quantity} {reservation.unit}</div>
                    {reservation.shortage && reservation.shortage > 0 && (
                      <div className="text-sm text-red-600">Short: {reservation.shortage} {reservation.unit}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(reservation.requiredDate).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                      {reservation.status.replace('_', ' ').charAt(0).toUpperCase() + reservation.status.replace('_', ' ').slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(reservation.priority)}`}>
                      {reservation.priority.charAt(0).toUpperCase() + reservation.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {reservation.status === 'pending_approval' && (
                      <button 
                        onClick={() => handleApprove(reservation.id)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {(reservation.status === 'approved' && reservation.releaseStatus !== 'released') && (
                      <button 
                        onClick={() => handleRelease(reservation.id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Package className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => setSelectedReservation(reservation)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Edit className="w-4 h-4" />
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
          <h1 className="text-2xl font-bold text-gray-900">Material Reservation System</h1>
          <p className="text-gray-600">Construction project material planning and allocation management</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Reservation</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'active', label: 'Active Reservations', icon: Package },
            { id: 'pending', label: 'Pending Approval', icon: Clock },
            { id: 'shortages', label: 'Critical Shortages', icon: AlertCircle },
            { id: 'history', label: 'History', icon: CheckCircle }
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
      {activeTab === 'active' && renderDashboard()}
      
      {/* Additional tab content implementations would go here */}

    </div>
  );
};

export default MaterialReservationSystem;
