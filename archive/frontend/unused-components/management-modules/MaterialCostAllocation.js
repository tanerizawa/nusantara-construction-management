import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  Package,
  Building,
  Filter,
  Download,
  Eye,
  Calculator,
  ArrowUp,
  ArrowDown,
  FileText,
  AlertTriangle
} from 'lucide-react';

const MaterialCostAllocation = () => {
  const [projects] = useState([
    {
      id: 1,
      name: 'Perumahan Green Valley',
      code: 'PGV-2024',
      startDate: '2024-01-15',
      endDate: '2024-12-15',
      status: 'active',
      totalBudget: 15000000000,
      materialBudget: 9000000000,
      allocatedCost: 6750000000,
      actualCost: 7200000000,
      variance: -450000000,
      efficiency: 94.2,
      progress: 75,
      categories: [
        { name: 'Material Struktur', budget: 4500000000, actual: 4800000000, variance: -300000000 },
        { name: 'Material Finishing', budget: 2700000000, actual: 2400000000, variance: 300000000 },
        { name: 'Material MEP', budget: 1800000000, actual: 2000000000, variance: -200000000 }
      ]
    },
    {
      id: 2,
      name: 'Mall Sentral Plaza',
      code: 'MSP-2024',
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      status: 'active',
      totalBudget: 25000000000,
      materialBudget: 15000000000,
      allocatedCost: 7500000000,
      actualCost: 7200000000,
      variance: 300000000,
      efficiency: 104.2,
      progress: 45,
      categories: [
        { name: 'Material Struktur', budget: 9000000000, actual: 4500000000, variance: 4500000000 },
        { name: 'Material Finishing', budget: 4500000000, actual: 2000000000, variance: 2500000000 },
        { name: 'Material MEP', budget: 1500000000, actual: 700000000, variance: 800000000 }
      ]
    },
    {
      id: 3,
      name: 'Kantor Pusat ABC',
      code: 'KPA-2024',
      startDate: '2024-06-01',
      endDate: '2024-11-30',
      status: 'active',
      totalBudget: 8500000000,
      materialBudget: 5100000000,
      allocatedCost: 2550000000,
      actualCost: 2100000000,
      variance: 450000000,
      efficiency: 121.4,
      progress: 40,
      categories: [
        { name: 'Material Struktur', budget: 2550000000, actual: 1200000000, variance: 1350000000 },
        { name: 'Material Finishing', budget: 1530000000, actual: 600000000, variance: 930000000 },
        { name: 'Material MEP', budget: 1020000000, actual: 300000000, variance: 720000000 }
      ]
    }
  ]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [viewMode, setViewMode] = useState('summary');

  // Material allocation details for selected project
  const [materialAllocations] = useState([
    {
      id: 1,
      materialCode: 'SMN-001',
      materialName: 'Semen Portland 50kg',
      category: 'Material Struktur',
      allocatedQty: 500,
      actualQty: 520,
      unitPrice: 65000,
      allocatedCost: 32500000,
      actualCost: 33800000,
      variance: -1300000,
      usageDate: '2024-08-10',
      supplier: 'PT Sumber Makmur',
      phase: 'Struktur Lantai 1',
      notes: 'Additional requirement for foundation'
    },
    {
      id: 2,
      materialCode: 'BSB-012',
      materialName: 'Besi Beton 12mm',
      category: 'Material Struktur',
      allocatedQty: 1000,
      actualQty: 950,
      unitPrice: 85000,
      allocatedCost: 85000000,
      actualCost: 80750000,
      variance: 4250000,
      usageDate: '2024-08-12',
      supplier: 'CV Teknik Mandiri',
      phase: 'Struktur Lantai 2',
      notes: 'Efficient usage, savings achieved'
    },
    {
      id: 3,
      materialCode: 'CAT-025',
      materialName: 'Cat Tembok Interior 25L',
      category: 'Material Finishing',
      allocatedQty: 200,
      actualQty: 180,
      unitPrice: 125000,
      allocatedCost: 25000000,
      actualCost: 22500000,
      variance: 2500000,
      usageDate: '2024-08-14',
      supplier: 'Toko Material Sejahtera',
      phase: 'Finishing Interior',
      notes: 'Less coverage needed than estimated'
    }
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 100) return 'text-green-600';
    if (efficiency >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getVarianceColor = (variance) => {
    if (variance > 0) return 'text-green-600';
    if (variance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Calculate totals
  const totals = {
    totalBudget: projects.reduce((sum, p) => sum + p.materialBudget, 0),
    totalAllocated: projects.reduce((sum, p) => sum + p.allocatedCost, 0),
    totalActual: projects.reduce((sum, p) => sum + p.actualCost, 0),
    totalVariance: projects.reduce((sum, p) => sum + p.variance, 0),
    averageEfficiency: projects.reduce((sum, p) => sum + p.efficiency, 0) / projects.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Material Cost Allocation</h1>
          <p className="text-gray-600 mt-1">Analisis alokasi biaya material per proyek</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="summary">Summary View</option>
            <option value="detailed">Detailed View</option>
            <option value="comparison">Comparison View</option>
          </select>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Cost Analysis
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totals.totalBudget)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Allocated</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totals.totalAllocated)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actual Cost</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totals.totalActual)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Variance</p>
              <p className={`text-2xl font-bold mt-1 ${getVarianceColor(totals.totalVariance)}`}>
                {totals.totalVariance >= 0 ? '+' : ''}{formatCurrency(totals.totalVariance)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${totals.totalVariance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {totals.totalVariance >= 0 ? 
                <ArrowUp className="w-6 h-6 text-green-600" /> : 
                <ArrowDown className="w-6 h-6 text-red-600" />
              }
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Efficiency</p>
              <p className={`text-2xl font-bold mt-1 ${getEfficiencyColor(totals.averageEfficiency)}`}>
                {totals.averageEfficiency.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
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
            <option value="current">Current Month</option>
            <option value="quarter">Current Quarter</option>
            <option value="year">Current Year</option>
            <option value="all">All Time</option>
          </select>

          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">All Projects</option>
            <option value="active">Active Projects</option>
            <option value="completed">Completed Projects</option>
          </select>

          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">All Categories</option>
            <option value="struktur">Material Struktur</option>
            <option value="finishing">Material Finishing</option>
            <option value="mep">Material MEP</option>
          </select>
        </div>
      </div>

      {/* Projects Cost Allocation Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Project Material Cost Analysis</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                      <div className="text-sm text-gray-500">{project.code}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(project.materialBudget)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(project.allocatedCost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(project.actualCost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getVarianceColor(project.variance)}`}>
                      {project.variance >= 0 ? '+' : ''}{formatCurrency(project.variance)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {((project.variance / project.allocatedCost) * 100).toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getEfficiencyColor(project.efficiency)}`}>
                      {project.efficiency}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{project.progress}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setSelectedProject(project);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900" title="Cost Analysis">
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Report">
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

      {/* Project Detail Modal */}
      {showDetailModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  Material Cost Detail - {selectedProject.name}
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
              {/* Project Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Building className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Project Code</p>
                      <p className="text-lg font-bold text-blue-900">{selectedProject.code}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-green-600 font-medium">Material Budget</p>
                      <p className="text-lg font-bold text-green-900">{formatCurrency(selectedProject.materialBudget)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Efficiency</p>
                      <p className={`text-lg font-bold ${getEfficiencyColor(selectedProject.efficiency)}`}>
                        {selectedProject.efficiency}%
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className={`rounded-lg p-4 ${selectedProject.variance >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center gap-3">
                    {selectedProject.variance >= 0 ? 
                      <ArrowUp className="w-8 h-8 text-green-600" /> : 
                      <ArrowDown className="w-8 h-8 text-red-600" />
                    }
                    <div>
                      <p className={`text-sm font-medium ${selectedProject.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Variance
                      </p>
                      <p className={`text-lg font-bold ${getVarianceColor(selectedProject.variance)}`}>
                        {selectedProject.variance >= 0 ? '+' : ''}{formatCurrency(selectedProject.variance)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown by Category</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedProject.categories.map((category, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">{category.name}</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Budget:</span>
                          <span className="font-medium">{formatCurrency(category.budget)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Actual:</span>
                          <span className="font-medium">{formatCurrency(category.actual)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Variance:</span>
                          <span className={`font-medium ${getVarianceColor(category.variance)}`}>
                            {category.variance >= 0 ? '+' : ''}{formatCurrency(category.variance)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className={`h-2 rounded-full ${category.variance >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min((category.actual / category.budget) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Material Allocation Details */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Material Allocation Details</h4>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allocated Qty</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actual Qty</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allocated Cost</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actual Cost</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {materialAllocations.map((allocation) => (
                        <tr key={allocation.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{allocation.materialName}</div>
                              <div className="text-sm text-gray-500">{allocation.materialCode}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{allocation.category}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{allocation.allocatedQty}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{allocation.actualQty}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(allocation.unitPrice)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(allocation.allocatedCost)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(allocation.actualCost)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-sm font-medium ${getVarianceColor(allocation.variance)}`}>
                              {allocation.variance >= 0 ? '+' : ''}{formatCurrency(allocation.variance)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Generate Report
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Recompute Allocation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cost Analysis Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-lg font-semibold text-yellow-900 mb-2">Cost Analysis Insights</h4>
            <div className="space-y-2 text-sm text-yellow-800">
              <p>• Proyek "Perumahan Green Valley" mengalami cost overrun sebesar 6.67% pada material struktur</p>
              <p>• Proyek "Mall Sentral Plaza" menunjukkan efisiensi tinggi dengan penghematan 4.17%</p>
              <p>• Material MEP secara keseluruhan memiliki tingkat variance tertinggi</p>
              <p>• Rekomendasi: Review supplier dan metode procurement untuk material struktur</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialCostAllocation;
