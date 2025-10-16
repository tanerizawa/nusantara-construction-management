import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AssetForm from './AssetForm';
import AssetDetailModal from './AssetDetailModal';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Package,
  Building,
  Truck,
  HardDrive,
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  X
} from 'lucide-react';

const AssetRegistry = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'detail'
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Categories and status mapping
  const categories = {
    HEAVY_EQUIPMENT: 'Alat Berat',
    VEHICLES: 'Kendaraan',
    BUILDINGS: 'Bangunan',
    OFFICE_EQUIPMENT: 'Peralatan Kantor',
    TOOLS_MACHINERY: 'Peralatan & Mesin',
    COMPUTERS_IT: 'Komputer & IT'
  };

  const statusTypes = {
    ACTIVE: 'Aktif',
    UNDER_MAINTENANCE: 'Dalam Perawatan',
    IDLE: 'Tidak Digunakan',
    DISPOSED: 'Sudah Dibuang'
  };

  const conditionTypes = {
    EXCELLENT: 'Sangat Baik',
    GOOD: 'Baik',
    FAIR: 'Cukup',
    POOR: 'Buruk'
  };

  // Fetch assets from backend API
  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Build query parameters
      const params = new URLSearchParams();
      if (categoryFilter) params.append('category', categoryFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      params.append('page', currentPage);
      params.append('limit', itemsPerPage);

      const response = await axios.get(`/api/reports/fixed-asset/list?${params.toString()}`);
      
      if (response.data.success) {
        const assetsData = response.data.data.map(asset => ({
          ...asset,
          purchasePrice: parseInt(asset.purchasePrice),
          netBookValue: parseInt(asset.netBookValue),
          accumulatedDepreciation: parseInt(asset.accumulatedDepreciation),
          purchaseDate: new Date(asset.purchaseDate).toLocaleDateString('id-ID'),
          lastMaintenanceDate: asset.lastMaintenanceDate ? 
            new Date(asset.lastMaintenanceDate).toLocaleDateString('id-ID') : '-',
          nextMaintenanceDate: asset.nextMaintenanceDate ? 
            new Date(asset.nextMaintenanceDate).toLocaleDateString('id-ID') : '-'
        }));
        
        setAssets(assetsData);
        setFilteredAssets(assetsData);
        
        // Update pagination info if available
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages);
          setTotalItems(response.data.pagination.totalItems);
        }
      } else {
        console.error('Failed to fetch assets:', response.data.message);
        setError('Failed to load assets data');
        setAssets([]);
        setFilteredAssets([]);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
      setError('Failed to connect to server. Please try again later.');
      setAssets([]);
      setFilteredAssets([]);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, statusFilter, searchTerm, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'HEAVY_EQUIPMENT': return <Package className="h-4 w-4" />;
      case 'VEHICLES': return <Truck className="h-4 w-4" />;
      case 'BUILDINGS': return <Building className="h-4 w-4" />;
      case 'COMPUTERS_IT': return <HardDrive className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'UNDER_MAINTENANCE': return 'bg-yellow-100 text-yellow-800';
      case 'IDLE': return 'bg-gray-100 text-gray-800';
      case 'DISPOSED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle filter changes
  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // Handle asset actions
  const handleViewAsset = (asset) => {
    setSelectedAsset(asset);
    setCurrentView('detail');
  };

  const handleEditAsset = (asset) => {
    setSelectedAsset(asset);
    setCurrentView('edit');
  };

  const handleCreateAsset = () => {
    setSelectedAsset(null);
    setCurrentView('create');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedAsset(null);
  };

  // Handle asset form submission
  const handleAssetSubmit = async (formData) => {
    try {
      setLoading(true);
      
      if (currentView === 'create') {
        // Create new asset
        const response = await axios.post('/api/reports/fixed-asset/register', {
          asset_name: formData.assetName,
          asset_code: formData.assetCode,
          asset_category: formData.assetCategory,
          asset_type: formData.assetType,
          description: formData.description,
          purchase_price: formData.purchasePrice,
          purchase_date: formData.purchaseDate,
          supplier: formData.supplier,
          location: formData.location,
          department: formData.department,
          responsible_person: formData.responsiblePerson,
          status: formData.status,
          condition: formData.condition,
          serial_number: formData.serialNumber,
          manufacturer: formData.manufacturer,
          useful_life: formData.usefulLife,
          salvage_value: formData.salvageValue
        });
        
        if (response.data.success) {
          setCurrentView('list');
          fetchAssets(); // Refresh the list
          alert('Asset created successfully!');
        }
      } else if (currentView === 'edit') {
        // Update existing asset
        const response = await axios.put(`/api/reports/fixed-asset/${selectedAsset.id}`, {
          asset_name: formData.assetName,
          asset_code: formData.assetCode,
          asset_category: formData.assetCategory,
          asset_type: formData.assetType,
          description: formData.description,
          purchase_price: formData.purchasePrice,
          purchase_date: formData.purchaseDate,
          supplier: formData.supplier,
          location: formData.location,
          department: formData.department,
          responsible_person: formData.responsiblePerson,
          status: formData.status,
          condition: formData.condition,
          serial_number: formData.serialNumber,
          manufacturer: formData.manufacturer
        });
        
        if (response.data.success) {
          setCurrentView('list');
          fetchAssets(); // Refresh the list
          alert('Asset updated successfully!');
        }
      }
    } catch (error) {
      console.error('Error submitting asset:', error);
      alert(`Error ${currentView === 'create' ? 'creating' : 'updating'} asset: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Render based on current view
  const renderHeader = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {currentView === 'list' && 'Asset Registry'}
            {currentView === 'create' && 'Add New Asset'}
            {currentView === 'edit' && 'Edit Asset'}
            {currentView === 'detail' && 'Asset Detail'}
          </h1>
          <p className="text-gray-600">
            {currentView === 'list' && 'Manage and track all company assets'}
            {currentView === 'create' && 'Create a new asset record'}
            {currentView === 'edit' && 'Update asset information'}
            {currentView === 'detail' && 'View detailed asset information'}
          </p>
        </div>
        {currentView !== 'list' && (
          <button
            onClick={handleBackToList}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Back to List
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {renderHeader()}

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
          <button 
            onClick={fetchAssets}
            className="ml-4 text-red-800 underline hover:no-underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Render based on current view */}
      {currentView === 'list' && (
        <div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {Object.entries(categories).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              {Object.entries(statusTypes).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>

            <button
              onClick={handleCreateAsset}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Asset
            </button>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredAssets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No Assets Found</p>
            <p>No assets match your current filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asset Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              {getCategoryIcon(asset.assetCategory)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {asset.assetName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {asset.assetCode}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {categories[asset.assetCategory]}
                        </div>
                        <div className="text-sm text-gray-500">
                          {asset.assetType}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          {asset.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(asset.status)}`}>
                          {statusTypes[asset.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(asset.netBookValue)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Book Value
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewAsset(asset)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditAsset(asset)}
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded"
                            title="Edit Asset"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between items-center">
                  <p className="text-sm text-gray-700">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-1 border rounded text-sm ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Asset Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {modalMode === 'create' ? 'Add New Asset' : 
                   modalMode === 'edit' ? 'Edit Asset' : 'Asset Details'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              {selectedAsset && modalMode === 'view' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Asset Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAsset.assetName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Asset Code</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAsset.assetCode}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <p className="mt-1 text-sm text-gray-900">{categories[selectedAsset.assetCategory]}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <p className="mt-1 text-sm text-gray-900">{statusTypes[selectedAsset.status]}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
                      <p className="mt-1 text-sm text-gray-900">{formatCurrency(selectedAsset.purchasePrice)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Net Book Value</label>
                      <p className="mt-1 text-sm text-gray-900">{formatCurrency(selectedAsset.netBookValue)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAsset.location}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Department</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAsset.department}</p>
                    </div>
                  </div>
                </div>
              )}
              {modalMode !== 'view' && (
                <AssetForm 
                  asset={selectedAsset}
                  mode={modalMode}
                  onSubmit={handleAssetSubmit}
                  onCancel={() => setShowModal(false)}
                  categories={Object.keys(categories)}
                  statusTypes={Object.keys(statusTypes)}
                  conditionTypes={Object.keys(conditionTypes)}
                />
              )}
            </div>
          </div>
      </div>
    );
  }

  // Render asset form view
  function renderAssetForm() {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <AssetForm 
          asset={selectedAsset}
          mode={currentView}
          onSubmit={handleAssetSubmit}
          onCancel={handleBackToList}
          categories={Object.keys(categories)}
          statusTypes={Object.keys(statusTypes)}
          conditionTypes={Object.keys(conditionTypes)}
        />
      </div>
    );
  }

  // Render asset detail view
  function renderAssetDetail() {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <AssetDetailModal
          asset={selectedAsset}
          onClose={handleBackToList}
        />
      </div>
    );
  }
};

export default AssetRegistry;