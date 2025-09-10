import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  DollarSign,
  BarChart3,
  PieChart,
  TrendingUp,
  Package,
  Building,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const CostAllocation = () => {
  const [projects, setProjects] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockProjectData = [
      {
        id: 1,
        projectCode: 'PRJ-2025-001',
        projectName: 'Pembangunan Rumah Tinggal Jl. Mawar',
        location: 'Surabaya',
        startDate: '2025-08-01',
        endDate: '2025-12-31',
        status: 'active',
        totalBudget: 850000000,
        materialBudget: 425000000,
        allocatedCost: 125000000,
        actualCost: 118500000,
        variance: -6500000,
        completionPercentage: 35,
        categories: [
          {
            category: 'Material Bangunan',
            budgeted: 200000000,
            allocated: 65000000,
            actual: 62000000,
            variance: -3000000,
            items: [
              { name: 'Semen Portland', quantity: 150, unit: 'sak', unitCost: 62000, totalCost: 9300000 },
              { name: 'Batu Bata Merah', quantity: 5000, unit: 'biji', unitCost: 800, totalCost: 4000000 }
            ]
          },
          {
            category: 'Material Besi',
            budgeted: 150000000,
            allocated: 45000000,
            actual: 43500000,
            variance: -1500000,
            items: [
              { name: 'Besi Beton 10mm', quantity: 200, unit: 'batang', unitCost: 85000, totalCost: 17000000 },
              { name: 'Besi Beton 12mm', quantity: 150, unit: 'batang', unitCost: 125000, totalCost: 18750000 }
            ]
          }
        ]
      },
      {
        id: 2,
        projectCode: 'PRJ-2025-002',
        projectName: 'Renovasi Kantor PT ABC',
        location: 'Jakarta',
        startDate: '2025-07-15',
        endDate: '2025-11-30',
        status: 'active',
        totalBudget: 650000000,
        materialBudget: 325000000,
        allocatedCost: 95000000,
        actualCost: 98200000,
        variance: 3200000,
        completionPercentage: 55,
        categories: [
          {
            category: 'Material Finishing',
            budgeted: 180000000,
            allocated: 65000000,
            actual: 67500000,
            variance: 2500000,
            items: [
              { name: 'Cat Tembok Premium', quantity: 50, unit: 'kaleng', unitCost: 150000, totalCost: 7500000 },
              { name: 'Keramik Lantai 60x60', quantity: 200, unit: 'm²', unitCost: 85000, totalCost: 17000000 }
            ]
          }
        ]
      },
      {
        id: 3,
        projectCode: 'PRJ-2025-003',
        projectName: 'Pembangunan Warehouse PT XYZ',
        location: 'Sidoarjo',
        startDate: '2025-08-15',
        endDate: '2026-02-28',
        status: 'planning',
        totalBudget: 1200000000,
        materialBudget: 600000000,
        allocatedCost: 25000000,
        actualCost: 22800000,
        variance: -2200000,
        completionPercentage: 8,
        categories: []
      }
    ];

    const mockAllocationData = [
      {
        id: 1,
        date: '2025-08-20',
        projectCode: 'PRJ-2025-001',
        projectName: 'Pembangunan Rumah Tinggal Jl. Mawar',
        itemName: 'Semen Portland',
        category: 'Material Bangunan',
        quantity: 25,
        unit: 'sak',
        unitCost: 62000,
        totalCost: 1550000,
        allocatedBy: 'Site Manager',
        workOrder: 'WO-2025-045',
        purpose: 'Pengecoran lantai dasar'
      },
      {
        id: 2,
        date: '2025-08-21',
        projectCode: 'PRJ-2025-002',
        projectName: 'Renovasi Kantor PT ABC',
        itemName: 'Cat Tembok Premium',
        category: 'Material Finishing',
        quantity: 8,
        unit: 'kaleng',
        unitCost: 150000,
        totalCost: 1200000,
        allocatedBy: 'Project Manager',
        workOrder: 'WO-2025-046',
        purpose: 'Pengecatan ruang meeting'
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setProjects(mockProjectData);
      setAllocations(mockAllocationData);
      setLoading(false);
    }, 1000);
  }, []);

  const getVarianceColor = (variance) => {
    if (variance > 0) return 'text-red-600';
    if (variance < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getVarianceIcon = (variance) => {
    if (variance > 0) return <ArrowUpRight className="h-4 w-4" />;
    if (variance < 0) return <ArrowDownRight className="h-4 w-4" />;
    return null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'planning': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-gray-600 bg-gray-50';
      case 'on_hold': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const overallStats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalAllocated: projects.reduce((sum, p) => sum + p.allocatedCost, 0),
    totalActual: projects.reduce((sum, p) => sum + p.actualCost, 0),
    totalVariance: projects.reduce((sum, p) => sum + p.variance, 0)
  };

  const recentAllocations = allocations.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cost Allocation</h1>
          <p className="text-gray-600 mt-1">Material cost allocation dan tracking per project</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.totalProjects}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-green-600">{overallStats.activeProjects}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Allocated</p>
              <p className="text-2xl font-bold text-gray-900">Rp {(overallStats.totalAllocated / 1000000000).toFixed(1)}B</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Calculator className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Actual</p>
              <p className="text-2xl font-bold text-gray-900">Rp {(overallStats.totalActual / 1000000000).toFixed(1)}B</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Variance</p>
              <div className="flex items-center gap-2">
                <p className={`text-2xl font-bold ${getVarianceColor(overallStats.totalVariance)}`}>
                  Rp {Math.abs(overallStats.totalVariance / 1000000).toFixed(0)}M
                </p>
                {getVarianceIcon(overallStats.totalVariance)}
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Project Overview
            </button>
            <button
              onClick={() => setActiveTab('allocations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'allocations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Recent Allocations
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Cost Analytics
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{project.projectCode}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">{project.projectName}</p>
                      <p className="text-sm text-gray-500">
                        {typeof project.location === 'object' && project.location ? 
                          `${project.location.address || ''}, ${project.location.city || ''}, ${project.location.state || ''}`.replace(/^,\s*|,\s*$|,\s*,/g, '').trim() || 'Location not specified'
                          : project.location || 'Location not specified'
                        }
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedProject(project)}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Material Budget</p>
                      <p className="text-lg font-semibold text-gray-900">Rp {(project.materialBudget / 1000000).toFixed(0)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Allocated</p>
                      <p className="text-lg font-semibold text-blue-600">Rp {(project.allocatedCost / 1000000).toFixed(0)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Actual Cost</p>
                      <p className="text-lg font-semibold text-gray-900">Rp {(project.actualCost / 1000000).toFixed(0)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Variance</p>
                      <div className="flex items-center gap-2">
                        <p className={`text-lg font-semibold ${getVarianceColor(project.variance)}`}>
                          Rp {Math.abs(project.variance / 1000000).toFixed(1)}M
                        </p>
                        {getVarianceIcon(project.variance)}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Completion Progress</span>
                      <span>{project.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'allocations' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Date</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Project</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Item</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Quantity</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Unit Cost</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Total Cost</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Allocated By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentAllocations.map((allocation) => (
                      <tr key={allocation.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-gray-900">{allocation.date}</td>
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-gray-900">{allocation.projectCode}</div>
                            <div className="text-sm text-gray-500">{allocation.projectName}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-gray-900">{allocation.itemName}</div>
                            <div className="text-sm text-gray-500">{allocation.category}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-900">{allocation.quantity} {allocation.unit}</td>
                        <td className="py-4 px-6 text-gray-900">Rp {allocation.unitCost.toLocaleString()}</td>
                        <td className="py-4 px-6 font-medium text-gray-900">Rp {allocation.totalCost.toLocaleString()}</td>
                        <td className="py-4 px-6 text-gray-900">{allocation.allocatedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <PieChart className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Cost by Category</h3>
                </div>
                <div className="text-center py-8">
                  <p className="text-gray-500">Chart visualization akan ditampilkan di sini</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Monthly Allocation Trend</h3>
                </div>
                <div className="text-center py-8">
                  <p className="text-gray-500">Trend chart akan ditampilkan di sini</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedProject.projectCode}</h3>
                  <p className="text-gray-600">{selectedProject.projectName}</p>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Package className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {selectedProject.categories && selectedProject.categories.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown by Category</h4>
                  {selectedProject.categories.map((category, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-medium text-gray-900">{category.category}</h5>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${getVarianceColor(category.variance)}`}>
                            Rp {Math.abs(category.variance / 1000000).toFixed(1)}M variance
                          </span>
                          {getVarianceIcon(category.variance)}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Budgeted</p>
                          <p className="font-semibold text-gray-900">Rp {(category.budgeted / 1000000).toFixed(0)}M</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Allocated</p>
                          <p className="font-semibold text-blue-600">Rp {(category.allocated / 1000000).toFixed(0)}M</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Actual</p>
                          <p className="font-semibold text-gray-900">Rp {(category.actual / 1000000).toFixed(0)}M</p>
                        </div>
                      </div>

                      {category.items && category.items.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Major Items:</p>
                          <div className="space-y-2">
                            {category.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex justify-between items-center text-sm">
                                <span className="text-gray-900">{item.name}</span>
                                <span className="text-gray-600">
                                  {item.quantity} {item.unit} × Rp {item.unitCost.toLocaleString()} = Rp {item.totalCost.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostAllocation;
