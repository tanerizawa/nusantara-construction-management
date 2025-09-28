import React from 'react';
import { X, Package, MapPin, User, Calendar, DollarSign, Settings, Info } from 'lucide-react';

const AssetDetailModal = ({ asset, onClose }) => {
  if (!asset) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR' 
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-red-100 text-red-800',
      'Under Maintenance': 'bg-yellow-100 text-yellow-800',
      'Disposed': 'bg-gray-100 text-gray-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getConditionBadge = (condition) => {
    const conditionColors = {
      'Excellent': 'bg-green-100 text-green-800',
      'Good': 'bg-blue-100 text-blue-800',
      'Fair': 'bg-yellow-100 text-yellow-800',
      'Poor': 'bg-red-100 text-red-800'
    };
    return conditionColors[condition] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {asset.assetName}
            </h2>
            <p className="text-gray-600">Asset Code: {asset.assetCode}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Asset Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Package className="text-blue-600 mr-2" size={20} />
              <span className="text-sm text-gray-600">Category</span>
            </div>
            <p className="font-semibold text-blue-800">{asset.assetCategory}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <DollarSign className="text-green-600 mr-2" size={20} />
              <span className="text-sm text-gray-600">Purchase Price</span>
            </div>
            <p className="font-semibold text-green-800">{formatCurrency(asset.purchasePrice)}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Calendar className="text-purple-600 mr-2" size={20} />
              <span className="text-sm text-gray-600">Purchase Date</span>
            </div>
            <p className="font-semibold text-purple-800">{formatDate(asset.purchaseDate)}</p>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <MapPin className="text-orange-600 mr-2" size={20} />
              <span className="text-sm text-gray-600">Location</span>
            </div>
            <p className="font-semibold text-orange-800">{asset.location || '-'}</p>
          </div>
        </div>

        {/* Status and Condition */}
        <div className="flex gap-4 mb-6">
          <div>
            <span className="text-sm text-gray-600 block mb-1">Status</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(asset.status)}`}>
              {asset.status || 'Unknown'}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-600 block mb-1">Condition</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionBadge(asset.condition)}`}>
              {asset.condition || 'Unknown'}
            </span>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Info className="mr-2" size={18} />
              Basic Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Asset Type:</span>
                <p className="font-medium">{asset.assetType || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Description:</span>
                <p className="font-medium">{asset.description || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Serial Number:</span>
                <p className="font-medium">{asset.serialNumber || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Manufacturer:</span>
                <p className="font-medium">{asset.manufacturer || '-'}</p>
              </div>
            </div>
          </div>

          {/* Purchase & Financial Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <DollarSign className="mr-2" size={18} />
              Financial Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Supplier:</span>
                <p className="font-medium">{asset.supplier || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Useful Life:</span>
                <p className="font-medium">{asset.usefulLife ? `${asset.usefulLife} years` : '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Salvage Value:</span>
                <p className="font-medium">{asset.salvageValue ? formatCurrency(asset.salvageValue) : '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Book Value:</span>
                <p className="font-medium">{asset.netBookValue ? formatCurrency(asset.netBookValue) : '-'}</p>
              </div>
            </div>
          </div>

          {/* Assignment Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <User className="mr-2" size={18} />
              Assignment Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Department:</span>
                <p className="font-medium">{asset.department || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Responsible Person:</span>
                <p className="font-medium">{asset.responsiblePerson || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Location:</span>
                <p className="font-medium">{asset.location || '-'}</p>
              </div>
            </div>
          </div>

          {/* Maintenance Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Settings className="mr-2" size={18} />
              Maintenance Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Last Maintenance:</span>
                <p className="font-medium">{formatDate(asset.lastMaintenanceDate)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Next Maintenance:</span>
                <p className="font-medium">{formatDate(asset.nextMaintenanceDate)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Maintenance Cost (YTD):</span>
                <p className="font-medium">{asset.maintenanceCost ? formatCurrency(asset.maintenanceCost) : '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
    </div>
  );
};

export default AssetDetailModal;