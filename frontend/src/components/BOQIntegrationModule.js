import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Calculator, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Download,
  Upload,
  Plus,
  Search,
  Filter,
  Edit,
  Link2,
  BarChart3,
  PieChart
} from 'lucide-react';

/**
 * BOQ Integration Module Component
 * Construction Industry Best Practice Implementation
 * Priority 1 Enhancement - Material Requirement Planning from BOQ
 */

const BOQIntegrationModule = () => {
  const [boqItems, setBOQItems] = useState([]);
  const [materialMapping, setMaterialMapping] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('boq_items');
  const [selectedProject, setSelectedProject] = useState('all');
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [selectedBOQItem, setSelectedBOQItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // BOQ Analysis stats
  const [stats, setStats] = useState({
    totalBOQItems: 0,
    mappedItems: 0,
    unmappedItems: 0,
    totalEstimatedCost: 0,
    materialCoverage: 0,
    procurementReadiness: 0
  });

  useEffect(() => {
    fetchBOQData();
    fetchProjects();
    fetchMaterialMapping();
  }, [selectedProject]);

  const fetchBOQData = async () => {
    try {
      // Mock BOQ data - construction industry specific
      const mockBOQItems = [
        {
          id: 'BOQ-001',
          projectId: 'PRJ-001',
          projectName: 'Perumahan Green Valley Phase 1',
          itemCode: '1.1.1',
          description: 'Galian tanah pondasi',
          unit: 'm3',
          quantity: 150,
          unitPrice: 45000,
          totalPrice: 6750000,
          category: 'earthwork',
          phase: 'foundation',
          materialRequirements: [
            {
              materialId: 'MAT-EQP-001',
              materialName: 'Excavator PC200',
              materialCode: 'EQP-EXC-PC200',
              requiredQuantity: 1,
              unit: 'unit',
              duration: 3,
              durationUnit: 'days',
              estimatedCost: 1500000,
              availability: 'available',
              stockStatus: 'sufficient'
            }
          ],
          status: 'mapped',
          workPackage: 'WP-001',
          startDate: '2025-09-15',
          endDate: '2025-09-18',
          dependencies: [],
          notes: 'Foundation excavation for Type 36 houses - Block A'
        },
        {
          id: 'BOQ-002',
          projectId: 'PRJ-001',
          projectName: 'Perumahan Green Valley Phase 1',
          itemCode: '1.2.1',
          description: 'Urugan pasir bawah pondasi t=10cm',
          unit: 'm3',
          quantity: 50,
          unitPrice: 350000,
          totalPrice: 17500000,
          category: 'material',
          phase: 'foundation',
          materialRequirements: [
            {
              materialId: 'MAT-001',
              materialName: 'Pasir Urug',
              materialCode: 'MAT-PSR-URG',
              requiredQuantity: 55, // includes 10% wastage
              unit: 'm3',
              estimatedCost: 16500000,
              availability: 'limited',
              stockStatus: 'insufficient',
              currentStock: 25,
              shortage: 30,
              procurementRequired: true,
              supplierLeadTime: 7,
              recommendedOrderDate: '2025-09-08'
            }
          ],
          status: 'mapped',
          workPackage: 'WP-001',
          startDate: '2025-09-18',
          endDate: '2025-09-20',
          dependencies: ['BOQ-001'],
          notes: 'Sand bedding - grade A quality required'
        },
        {
          id: 'BOQ-003',
          projectId: 'PRJ-001',
          projectName: 'Perumahan Green Valley Phase 1',
          itemCode: '2.1.1',
          description: 'Beton K-250 untuk pondasi',
          unit: 'm3',
          quantity: 80,
          unitPrice: 750000,
          totalPrice: 60000000,
          category: 'concrete',
          phase: 'foundation',
          materialRequirements: [
            {
              materialId: 'MAT-002',
              materialName: 'Semen Portland Type I',
              materialCode: 'CMT-POR-T1-50KG',
              requiredQuantity: 320, // 4 sak per m3
              unit: 'sak',
              estimatedCost: 24000000,
              availability: 'available',
              stockStatus: 'sufficient',
              currentStock: 2500,
              reservationRequired: true
            },
            {
              materialId: 'MAT-003',
              materialName: 'Pasir Beton',
              materialCode: 'MAT-PSR-BTN',
              requiredQuantity: 50,
              unit: 'm3',
              estimatedCost: 17500000,
              availability: 'available',
              stockStatus: 'sufficient',
              currentStock: 120
            },
            {
              materialId: 'MAT-004',
              materialName: 'Kerikil Split 1-2 cm',
              materialCode: 'AGG-SPL-12',
              requiredQuantity: 60,
              unit: 'm3',
              estimatedCost: 18000000,
              availability: 'available',
              stockStatus: 'low',
              currentStock: 35,
              minimumStock: 30,
              reorderRequired: true
            }
          ],
          status: 'mapped',
          workPackage: 'WP-002',
          startDate: '2025-09-20',
          endDate: '2025-09-25',
          dependencies: ['BOQ-002'],
          notes: 'Foundation concrete - slump 12±2 cm'
        },
        {
          id: 'BOQ-004',
          projectId: 'PRJ-002',
          projectName: 'Mall Sentral Karawang',
          itemCode: '3.1.1',
          description: 'Struktur beton bertulang kolom 40x60 cm',
          unit: 'm3',
          quantity: 120,
          unitPrice: 2500000,
          totalPrice: 300000000,
          category: 'structure',
          phase: 'structure',
          materialRequirements: [
            {
              materialId: 'MAT-005',
              materialName: 'Besi Beton D16',
              materialCode: 'STL-RBR-D16',
              requiredQuantity: 2400, // 20 kg per m3
              unit: 'kg',
              estimatedCost: 48000000,
              availability: 'limited',
              stockStatus: 'critical',
              currentStock: 500,
              shortage: 1900,
              procurementRequired: true,
              supplierLeadTime: 14,
              recommendedOrderDate: '2025-08-25'
            },
            {
              materialId: 'MAT-006',
              materialName: 'Ready Mix Concrete K-350',
              materialCode: 'RMX-K350',
              requiredQuantity: 120,
              unit: 'm3',
              estimatedCost: 102000000,
              availability: 'supplier_direct',
              stockStatus: 'made_to_order',
              procurementRequired: true,
              supplierLeadTime: 3,
              schedulingRequired: true
            }
          ],
          status: 'partially_mapped',
          workPackage: 'WP-101',
          startDate: '2025-10-01',
          endDate: '2025-10-15',
          dependencies: [],
          notes: 'Main structure columns - Level 1-3',
          criticalPath: true
        },
        {
          id: 'BOQ-005',
          projectId: 'PRJ-001',
          projectName: 'Perumahan Green Valley Phase 1',
          itemCode: '4.1.1',
          description: 'Pemasangan keramik lantai 40x40 cm',
          unit: 'm2',
          quantity: 1200,
          unitPrice: 125000,
          totalPrice: 150000000,
          category: 'finishing',
          phase: 'finishing',
          materialRequirements: [],
          status: 'unmapped',
          workPackage: 'WP-003',
          startDate: '2025-11-01',
          endDate: '2025-11-15',
          dependencies: ['BOQ-003'],
          notes: 'Floor tiling - all house types'
        }
      ];

      setBOQItems(mockBOQItems);

      // Calculate stats
      const mappedCount = mockBOQItems.filter(item => item.status === 'mapped').length;
      const partiallyMapped = mockBOQItems.filter(item => item.status === 'partially_mapped').length;
      const unmappedCount = mockBOQItems.filter(item => item.status === 'unmapped').length;
      const totalCost = mockBOQItems.reduce((sum, item) => sum + item.totalPrice, 0);

      setStats({
        totalBOQItems: mockBOQItems.length,
        mappedItems: mappedCount + partiallyMapped,
        unmappedItems: unmappedCount,
        totalEstimatedCost: totalCost,
        materialCoverage: Math.round(((mappedCount + partiallyMapped * 0.5) / mockBOQItems.length) * 100),
        procurementReadiness: Math.round((mappedCount / mockBOQItems.length) * 100)
      });

    } catch (error) {
      console.error('Error fetching BOQ data:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const mockProjects = [
        { id: 'PRJ-001', name: 'Perumahan Green Valley Phase 1', status: 'active' },
        { id: 'PRJ-002', name: 'Mall Sentral Karawang', status: 'planning' },
        { id: 'PRJ-003', name: 'Gedung Perkantoran CBD', status: 'active' }
      ];
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchMaterialMapping = async () => {
    try {
      // This would contain the relationship between BOQ items and inventory materials
      const mockMapping = [
        {
          boqItemId: 'BOQ-002',
          materialId: 'MAT-001',
          mappingRatio: 1.1, // 110% including wastage
          lastUpdated: '2025-09-01',
          verifiedBy: 'Ahmad Fauzi'
        }
      ];
      setMaterialMapping(mockMapping);
    } catch (error) {
      console.error('Error fetching material mapping:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'mapped': return 'text-green-800 bg-green-100';
      case 'partially_mapped': return 'text-yellow-800 bg-yellow-100';
      case 'unmapped': return 'text-red-800 bg-red-100';
      default: return 'text-gray-800 bg-gray-100';
    }
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'sufficient': return 'text-green-800 bg-green-100';
      case 'low': return 'text-yellow-800 bg-yellow-100';
      case 'insufficient': return 'text-orange-800 bg-orange-100';
      case 'critical': return 'text-red-800 bg-red-100';
      case 'made_to_order': return 'text-blue-800 bg-blue-100';
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

  const handleCreateMaterialReservation = (boqItem) => {
    // Navigate to material reservation system with pre-filled data
    console.log('Creating material reservation for BOQ item:', boqItem.id);
  };

  const handleCreatePurchaseOrder = (material) => {
    // Navigate to purchase order creation with pre-filled data
    console.log('Creating purchase order for material:', material.materialId);
  };

  const renderBOQItems = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search BOQ items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Projects</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
      </div>

      {/* BOQ Items Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">BOQ Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phase</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mapping Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {boqItems.filter(item => 
                selectedProject === 'all' || item.projectId === selectedProject
              ).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.itemCode}</div>
                      <div className="text-sm text-gray-500">{item.projectName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{item.description}</div>
                    <div className="text-sm text-gray-500">{item.workPackage}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.quantity} {item.unit}</div>
                    <div className="text-sm text-gray-500">{formatCurrency(item.unitPrice)}/{item.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(item.totalPrice)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.phase}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ').charAt(0).toUpperCase() + item.status.replace('_', ' ').slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.materialRequirements.length > 0 ? (
                      <div className="space-y-1">
                        {item.materialRequirements.map((material, index) => (
                          <span 
                            key={index} 
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(material.stockStatus)}`}
                          >
                            {material.stockStatus.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Not mapped</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedBOQItem(item)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      {item.status === 'unmapped' && (
                        <button 
                          onClick={() => setShowMappingModal(true)}
                          className="text-green-600 hover:text-green-900"
                          title="Map Materials"
                        >
                          <Link2 className="w-4 h-4" />
                        </button>
                      )}
                      {item.materialRequirements.some(m => m.procurementRequired) && (
                        <button 
                          onClick={() => handleCreatePurchaseOrder(item.materialRequirements.find(m => m.procurementRequired))}
                          className="text-purple-600 hover:text-purple-900"
                          title="Create Purchase Order"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                      {item.materialRequirements.some(m => m.reservationRequired) && (
                        <button 
                          onClick={() => handleCreateMaterialReservation(item)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Create Material Reservation"
                        >
                          <Package className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total BOQ Items</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalBOQItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Mapped Items</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.mappedItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Unmapped Items</p>
              <p className="text-2xl font-semibold text-red-900">{stats.unmappedItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total BOQ Value</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(stats.totalEstimatedCost)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <PieChart className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Material Coverage</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.materialCoverage}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Procurement Ready</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.procurementReadiness}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {stats.unmappedItems > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                BOQ Mapping Required
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {stats.unmappedItems} BOQ items need material mapping to enable procurement planning.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Critical Procurement Items */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Critical Procurement Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">BOQ Requirement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shortage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommended Order Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {boqItems
                .flatMap(item => item.materialRequirements || [])
                .filter(material => material.procurementRequired || material.shortage > 0)
                .slice(0, 5)
                .map((material, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{material.materialName}</div>
                        <div className="text-sm text-gray-500">{material.materialCode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.requiredQuantity} {material.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.currentStock || 0} {material.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {material.shortage > 0 && (
                        <span className="text-red-600 font-medium">
                          {material.shortage} {material.unit}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.recommendedOrderDate && 
                        new Date(material.recommendedOrderDate).toLocaleDateString('id-ID')
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleCreatePurchaseOrder(material)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                      >
                        Create PO
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
          <h1 className="text-2xl font-bold text-gray-900">BOQ Integration Module</h1>
          <p className="text-gray-600">Bill of Quantities integration with material planning and procurement</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-150 flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Import BOQ</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'boq_items', label: 'BOQ Items', icon: FileText },
            { id: 'material_mapping', label: 'Material Mapping', icon: Link2 },
            { id: 'procurement_plan', label: 'Procurement Plan', icon: Calculator }
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
      {activeTab === 'boq_items' && renderBOQItems()}
      
      {/* Additional tab content implementations would go here */}

    </div>
  );
};

export default BOQIntegrationModule;
