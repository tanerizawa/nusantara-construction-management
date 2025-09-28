import React, { useState, useEffect } from 'react';

const initialState = {
  assetName: '',
  assetCode: '',
  assetCategory: '',
  assetType: '',
  description: '',
  purchasePrice: '',
  purchaseDate: '',
  supplier: '',
  location: '',
  department: '',
  responsiblePerson: '',
  status: '',
  condition: '',
  serialNumber: '',
  manufacturer: '',
  usefulLife: '',
  salvageValue: ''
};

const AssetForm = ({ asset, mode, onSubmit, onCancel, categories = [], statusTypes = [], conditionTypes = [] }) => {
  console.log('🔄 AssetForm component rendered with:', { mode, asset: asset?.id });
  console.log('🔄 Component render timestamp:', new Date().toISOString());
  
  // Initialize form with default values
  const [formData, setFormData] = useState({
    assetName: '',
    assetCode: '',
    assetCategory: '',
    assetType: '',
    description: '',
    purchasePrice: '',
    purchaseDate: '',
    supplier: '',
    location: '',
    department: '',
    responsiblePerson: '',
    status: 'ACTIVE',
    condition: 'GOOD',
    serialNumber: '',
    manufacturer: '',
    usefulLife: '',
    salvageValue: '',
    depreciationMethod: 'STRAIGHT_LINE'
  });

  const [errors, setErrors] = useState({});

  // Populate form data when editing
  useEffect(() => {
    console.log('🔄 AssetForm useEffect triggered:', { mode, asset: asset?.id });
    
    if (mode === 'edit' && asset && asset.id) {
      console.log('📝 Populating form with asset data:', asset);
      console.log('📋 Asset fields available:', Object.keys(asset));
      
      const newFormData = {
        assetName: asset.assetName || '',
        assetCode: asset.assetCode || '',
        assetCategory: asset.assetCategory || '',
        assetType: asset.assetType || '',
        description: asset.description || '',
        purchasePrice: asset.purchasePrice ? asset.purchasePrice.toString() : '',
        purchaseDate: asset.purchaseDate ? asset.purchaseDate.split('T')[0] : '', // Format for input date
        supplier: asset.supplier || '',
        location: asset.location || '',
        department: asset.department || '',
        responsiblePerson: asset.responsiblePerson || '',
        status: asset.status || 'ACTIVE',
        condition: asset.condition || 'GOOD',
        serialNumber: asset.serialNumber || '',
        manufacturer: asset.manufacturer || '',
        usefulLife: asset.usefulLife ? asset.usefulLife.toString() : '',
        salvageValue: asset.salvageValue ? asset.salvageValue.toString() : '',
        depreciationMethod: asset.depreciationMethod || 'STRAIGHT_LINE'
      };
      
      console.log('💾 New form data to be set:', newFormData);
      console.log('🎯 Specifically setting assetName to:', newFormData.assetName);
      console.log('🎯 Specifically setting assetCode to:', newFormData.assetCode);
      
      // Use direct state update without callback to avoid conflicts
      setFormData({ ...newFormData });
      
    } else if (mode === 'create') {
      console.log('➕ Setting form to create mode with initial state');
      setFormData({ ...initialState });
    }
  }, [mode, asset?.id]);

  // Debug: Log formData changes
  useEffect(() => {
    console.log('FormData state updated:', formData);
    
    // Debug: Check if DOM elements have correct values
    const assetNameInput = document.querySelector('input[name="assetName"]');
    const assetCodeInput = document.querySelector('input[name="assetCode"]');
    
    if (assetNameInput) {
      console.log('🎯 DOM Input assetName value:', assetNameInput.value);
      console.log('🎯 React state assetName value:', formData.assetName);
    }
    
    if (assetCodeInput) {
      console.log('🎯 DOM Input assetCode value:', assetCodeInput.value);
      console.log('🎯 React state assetCode value:', formData.assetCode);
    }
  }, [formData]);

  // Category labels mapping
  const categoryLabels = {
    HEAVY_EQUIPMENT: 'Alat Berat',
    VEHICLES: 'Kendaraan',
    BUILDINGS: 'Bangunan',
    OFFICE_EQUIPMENT: 'Peralatan Kantor',
    TOOLS_MACHINERY: 'Peralatan & Mesin',
    COMPUTERS_IT: 'Komputer & IT'
  };

  const statusLabels = {
    ACTIVE: 'Aktif',
    UNDER_MAINTENANCE: 'Dalam Perawatan',
    IDLE: 'Tidak Digunakan',
    DISPOSED: 'Sudah Dibuang'
  };

  const conditionLabels = {
    EXCELLENT: 'Sangat Baik',
    GOOD: 'Baik',
    FAIR: 'Cukup',
    POOR: 'Buruk'
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.assetName) newErrors.assetName = 'Asset name is required';
    if (!formData.assetCode) newErrors.assetCode = 'Asset code is required';
    if (!formData.assetCategory) newErrors.assetCategory = 'Category is required';
    if (!formData.purchasePrice) newErrors.purchasePrice = 'Purchase price is required';
    if (!formData.purchaseDate) newErrors.purchaseDate = 'Purchase date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Debug Panel - Remove in production */}
      {mode === 'edit' && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">🐛 Debug Info:</h4>
          <div className="text-xs text-yellow-700 space-y-1">
            <div>Mode: <strong>{mode}</strong></div>
            <div>Asset Name in Form State: <strong>"{formData.assetName}"</strong></div>
            <div>Asset Code in Form State: <strong>"{formData.assetCode}"</strong></div>
            <div>Asset ID: <strong>{asset?.id}</strong></div>
            <div>Form Data Keys: <strong>{Object.keys(formData).join(', ')}</strong></div>
            <div>Input Value Test: <strong>{document.querySelector('input[name="assetName"]')?.value || 'Not found'}</strong></div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">{mode === 'edit' ? 'Edit Asset' : 'Add New Asset'}</h2>
        
        {/* Basic Information Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Asset Name *</label>
            <input 
              name="assetName" 
              value={formData.assetName || ''} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter asset name"
            />
            {errors.assetName && <span className="text-red-500 text-xs mt-1 block">{errors.assetName}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Asset Code *</label>
            <input 
              name="assetCode" 
              value={formData.assetCode || ''} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter asset code"
            />
            {errors.assetCode && <span className="text-red-500 text-xs mt-1 block">{errors.assetCode}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select 
              name="assetCategory" 
              value={formData.assetCategory} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => <option key={cat} value={cat}>{categoryLabels[cat] || cat}</option>)}
            </select>
            {errors.assetCategory && <span className="text-red-500 text-xs mt-1 block">{errors.assetCategory}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <input 
              name="assetType" 
              value={formData.assetType} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter asset type"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
              placeholder="Enter asset description"
            />
          </div>
        </div>
        </div>
        
        {/* Purchase Information Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Purchase Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price *</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">IDR</span>
              <input 
                name="purchasePrice" 
                type="number" 
                value={formData.purchasePrice} 
                onChange={handleChange} 
                className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="0"
              />
            </div>
            {errors.purchasePrice && <span className="text-red-500 text-xs mt-1 block">{errors.purchasePrice}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date *</label>
            <input 
              name="purchaseDate" 
              type="date" 
              value={formData.purchaseDate} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {errors.purchaseDate && <span className="text-red-500 text-xs mt-1 block">{errors.purchaseDate}</span>}
          </div>
        </div>
        </div>
        
        {/* Location & Assignment Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Location & Assignment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
            <input 
              name="supplier" 
              value={formData.supplier} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter supplier name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter asset location"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <input 
              name="department" 
              value={formData.department} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter department"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Responsible Person</label>
            <input 
              name="responsiblePerson" 
              value={formData.responsiblePerson} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter responsible person name"
            />
          </div>
        </div>
        </div>
        
        {/* Status & Condition Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Status & Condition</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            >
              <option value="">Select Status</option>
              {statusTypes.map((s) => <option key={s} value={s}>{statusLabels[s] || s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
            <select 
              name="condition" 
              value={formData.condition} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            >
              <option value="">Select Condition</option>
              {conditionTypes.map((c) => <option key={c} value={c}>{conditionLabels[c] || c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
            <input 
              name="serialNumber" 
              value={formData.serialNumber} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter serial number"
            />
          </div>
        </div>
        </div>
        
        {/* Additional Details Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Additional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
            <input 
              name="manufacturer" 
              value={formData.manufacturer} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter manufacturer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Useful Life (years)</label>
            <input 
              name="usefulLife" 
              type="number" 
              value={formData.usefulLife} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter useful life in years"
              min="1"
              max="50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Salvage Value</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">IDR</span>
              <input 
                name="salvageValue" 
                type="number" 
                value={formData.salvageValue} 
                onChange={handleChange} 
                className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="0"
              />
            </div>
          </div>
        </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200 gap-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {mode === 'edit' ? 'Update Asset' : 'Create Asset'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssetForm;
