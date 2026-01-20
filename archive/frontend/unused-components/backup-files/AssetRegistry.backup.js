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
  Wrench,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const AssetRegistry = () => {
  // State management
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // View management
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

  // Fetch assets from API
  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/reports/fixed-asset/list');
      
      if (response.data.success) {
        const assetData = response.data.data || [];
        console.log('Raw API Response:', response.data);
        console.log('Asset Data:', assetData);
        console.log('First Asset:', assetData[0]);
        setAssets(assetData);
        setFilteredAssets(assetData);
        setTotalItems(assetData.length);
        setTotalPages(Math.ceil(assetData.length / itemsPerPage));
        console.log('Assets loaded:', assetData.length, 'items');
      } else {
        setError('Failed to fetch assets data');
      }
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Failed to load assets. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Search and filter functionality
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(1);
    filterAssets(term, categoryFilter, statusFilter);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
    setCurrentPage(1);
    filterAssets(searchTerm, category, statusFilter);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
    filterAssets(searchTerm, categoryFilter, status);
  };

  const filterAssets = (search, category, status) => {
    let filtered = assets.filter(asset => {
      const matchesSearch = 
        asset.assetName?.toLowerCase().includes(search) ||
        asset.assetCode?.toLowerCase().includes(search) ||
        asset.description?.toLowerCase().includes(search);
      
      const matchesCategory = !category || asset.assetCategory === category;
      const matchesStatus = !status || asset.status === status;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    setFilteredAssets(filtered);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  };

  // Asset action handlers
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

  const handleDeleteAsset = async (asset) => {
    if (window.confirm(`Are you sure you want to delete "${asset.assetName}"?\n\nThis action cannot be undone.`)) {
      try {
        setLoading(true);
        const response = await axios.delete(`/api/reports/fixed-asset/${asset.id}`);
        
        if (response.data.success) {
          // Remove asset from state immediately
          const updatedAssets = assets.filter(a => a.id !== asset.id);
          setAssets(updatedAssets);
          setFilteredAssets(updatedAssets);
          setTotalItems(updatedAssets.length);
          setTotalPages(Math.ceil(updatedAssets.length / itemsPerPage));
          
          // Show success message (you can add a toast notification here)
          console.log('Asset deleted successfully:', response.data.message);
        } else {
          setError('Failed to delete asset: ' + response.data.message);
        }
      } catch (err) {
        console.error('Error deleting asset:', err);
        setError('Failed to delete asset. Please try again.');
      } finally {
        setLoading(false);
      }
    }
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

  // Loading state
  if (loading && currentView === 'list') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Render header
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

  // Get paginated assets
  const getPaginatedAssets = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filteredAssets.slice(startIndex, endIndex);
    console.log('getPaginatedAssets:', {
      totalAssets: assets.length,
      filteredAssets: filteredAssets.length,
      currentPage,
      startIndex,
      endIndex,
      paginated: paginated.length,
      paginatedData: paginated
    });
    return paginated;
  };

  // Render asset list
  const renderAssetList = () => {
    console.log('Rendering asset list with:', {
      assets: assets.length,
      filteredAssets: filteredAssets.length,
      currentPage,
      getPaginatedLength: getPaginatedAssets().length
    });
    
    return (
      <>
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
          </div>

          {/* Add Asset Button */}
          <button
            onClick={handleCreateAsset}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Asset
          </button>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {getPaginatedAssets().length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || categoryFilter || statusFilter 
                ? 'Try adjusting your search criteria' 
                : 'Get started by adding your first asset'}
            </p>
            {!searchTerm && !categoryFilter && !statusFilter && (
              <button
                onClick={handleCreateAsset}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add First Asset
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getPaginatedAssets().map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{asset.assetName}</div>
                        <div className="text-sm text-gray-500">{asset.assetCode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{categories[asset.assetCategory] || asset.assetCategory}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(asset.purchasePrice || 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        asset.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        asset.status === 'UNDER_MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                        asset.status === 'IDLE' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {statusTypes[asset.status] || asset.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        asset.condition === 'EXCELLENT' ? 'bg-green-100 text-green-800' :
                        asset.condition === 'GOOD' ? 'bg-blue-100 text-blue-800' :
                        asset.condition === 'FAIR' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {conditionTypes[asset.condition] || asset.condition || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewAsset(asset)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditAsset(asset)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit Asset"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Asset"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
    );
  };

  // Render asset form
  const renderAssetForm = () => (
    <div className="bg-white rounded-lg shadow-sm border">
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

  // Render asset detail
  const renderAssetDetail = () => (
    <div className="bg-white rounded-lg shadow-sm border">
      <AssetDetailModal
        asset={selectedAsset}
        onClose={handleBackToList}
      />
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
      {currentView === 'list' && renderAssetList()}
      {currentView === 'create' && renderAssetForm()}
      {currentView === 'edit' && renderAssetForm()}
      {currentView === 'detail' && renderAssetDetail()}
    </div>
  );
};

export default AssetRegistry;