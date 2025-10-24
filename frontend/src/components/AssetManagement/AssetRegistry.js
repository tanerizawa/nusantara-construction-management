import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../services/api';
import {
  Plus, Search, Trash2, RefreshCw, Package, X, Check, Edit2, ChevronDown, ChevronUp, FilePlus2
} from 'lucide-react';
import AssetForm from './AssetForm';

const AssetRegistry = () => {
  // State management
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAddingInline, setIsAddingInline] = useState(false);
  const [showFullAdd, setShowFullAdd] = useState(false);
  const [savingFullAdd, setSavingFullAdd] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Form data
  const todayStr = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    assetName: '',
    assetCode: '',
    assetCategory: '',
    purchasePrice: '',
    purchaseDate: todayStr,
    status: 'ACTIVE',
    condition: 'GOOD',
    location: '',
    description: '',
    supplier: '',
    invoiceNumber: '',
    depreciationMethod: 'STRAIGHT_LINE',
    usefulLife: '5',
    salvageValue: ''
  });

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
    UNDER_MAINTENANCE: 'Perawatan',
    IDLE: 'Tidak Digunakan',
    DISPOSED: 'Dibuang'
  };

  const conditionTypes = {
    EXCELLENT: 'Sangat Baik',
    GOOD: 'Baik',
    FAIR: 'Cukup',
    POOR: 'Buruk'
  };

  const resetForm = () => {
    setFormData({
      assetName: '',
      assetCode: '',
      assetCategory: '',
      purchasePrice: '',
      purchaseDate: todayStr,
      status: 'ACTIVE',
      condition: 'GOOD',
      location: '',
      description: '',
      supplier: '',
      invoiceNumber: '',
      depreciationMethod: 'STRAIGHT_LINE',
      usefulLife: '5',
      salvageValue: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Fetch assets from API
  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/reports/fixed-asset/list');
      
      if (response.data.success) {
        const assetData = response.data.data || [];
        setAssets(assetData);
      } else {
        setError('Gagal memuat data aset');
      }
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Gagal memuat aset. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleSubmitAsset = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      const response = await apiClient.post('/reports/fixed-asset/register', {
        asset_name: formData.assetName,
        asset_code: formData.assetCode,
        asset_category: formData.assetCategory,
        purchase_price: parseFloat(formData.purchasePrice) || 0,
        purchase_date: formData.purchaseDate,
        status: formData.status,
        condition: formData.condition,
        location: formData.location,
        description: formData.description,
        supplier: formData.supplier || undefined,
        invoice_number: formData.invoiceNumber || undefined,
        depreciation_method: formData.depreciationMethod || 'STRAIGHT_LINE',
        useful_life: parseInt(formData.usefulLife || '5'),
        salvage_value: formData.salvageValue ? parseFloat(formData.salvageValue) : 0,
        depreciation_start_date: formData.purchaseDate
      });
      
      if (response.data.success) {
        await fetchAssets();
        resetForm();
        setIsAddingInline(false);
        setError(null);
      } else {
        throw new Error(response.data.message || 'Gagal menambah aset');
      }
    } catch (error) {
      console.error('Error creating asset:', error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteAsset = async (asset) => {
    if (!window.confirm(`Hapus aset "${asset.assetName}"?\n\nTindakan ini tidak dapat dibatalkan.`)) return;
    
    try {
      const response = await apiClient.delete(`/reports/fixed-asset/${asset.id}`);
      
      if (response.data.success) {
        await fetchAssets();
        setError(null);
      } else {
        setError('Gagal menghapus aset');
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
      setError(error.response?.data?.message || 'Gagal menghapus aset');
    }
  };

  const handleEditClick = (asset) => {
    setEditingId(asset.id);
    setExpandedRow(asset.id);
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const toggleRowExpand = (assetId) => {
    if (editingId === assetId) return; // Don't allow expand/collapse during edit
    setExpandedRow(expandedRow === assetId ? null : assetId);
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.assetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || asset.assetCategory === categoryFilter;
    const matchesStatus = !statusFilter || asset.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-[#30D158]/20 text-[#30D158] border-[#30D158]/30';
      case 'UNDER_MAINTENANCE': return 'bg-[#FF9F0A]/20 text-[#FF9F0A] border-[#FF9F0A]/30';
      case 'IDLE': return 'bg-[#98989D]/20 text-[#98989D] border-[#98989D]/30';
      case 'DISPOSED': return 'bg-[#FF453A]/20 text-[#FF453A] border-[#FF453A]/30';
      default: return 'bg-[#98989D]/20 text-[#98989D] border-[#98989D]/30';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'EXCELLENT': return 'bg-[#30D158]/20 text-[#30D158] border-[#30D158]/30';
      case 'GOOD': return 'bg-[#0A84FF]/20 text-[#0A84FF] border-[#0A84FF]/30';
      case 'FAIR': return 'bg-[#FF9F0A]/20 text-[#FF9F0A] border-[#FF9F0A]/30';
      case 'POOR': return 'bg-[#FF453A]/20 text-[#FF453A] border-[#FF453A]/30';
      default: return 'bg-[#98989D]/20 text-[#98989D] border-[#98989D]/30';
    }
  };

  const stats = {
    total: assets.length,
    active: assets.filter(a => a.status === 'ACTIVE').length,
    maintenance: assets.filter(a => a.status === 'UNDER_MAINTENANCE').length,
    totalValue: assets.reduce((sum, a) => sum + (parseFloat(a.purchasePrice) || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1C1C1E]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A84FF]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#1C1C1E] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#2C2C2E] rounded-xl p-4 shadow-sm border border-[#38383A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#98989D] mb-1">Total Aset</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-[#0A84FF]/20 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-[#0A84FF]" />
              </div>
            </div>
          </div>

          <div className="bg-[#2C2C2E] rounded-xl p-4 shadow-sm border border-[#38383A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#98989D] mb-1">Aktif</p>
                <p className="text-2xl font-bold text-[#30D158]">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-[#30D158]/20 rounded-xl flex items-center justify-center">
                <Check className="h-6 w-6 text-[#30D158]" />
              </div>
            </div>
          </div>

          <div className="bg-[#2C2C2E] rounded-xl p-4 shadow-sm border border-[#38383A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#98989D] mb-1">Perawatan</p>
                <p className="text-2xl font-bold text-[#FF9F0A]">{stats.maintenance}</p>
              </div>
              <div className="w-12 h-12 bg-[#FF9F0A]/20 rounded-xl flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-[#FF9F0A]" />
              </div>
            </div>
          </div>

          <div className="bg-[#2C2C2E] rounded-xl p-4 shadow-sm border border-[#38383A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#98989D] mb-1">Total Nilai</p>
                <p className="text-lg font-bold text-white">
                  {new Intl.NumberFormat('id-ID', { 
                    style: 'currency', 
                    currency: 'IDR',
                    maximumFractionDigits: 0
                  }).format(stats.totalValue)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-[#2C2C2E] rounded-xl shadow-sm border border-[#38383A] p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#636366]" />
              <input
                type="text"
                placeholder="Cari aset atau kode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
              />
            </div>

            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:ring-2 focus:ring-[#0A84FF]"
            >
              <option value="">Semua Kategori</option>
              {Object.entries(categories).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>

            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:ring-2 focus:ring-[#0A84FF]"
            >
              <option value="">Semua Status</option>
              {Object.entries(statusTypes).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setIsAddingInline(true); setShowFullAdd(false); }}
                className="flex items-center gap-2 px-4 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 transition-all"
              >
                <Plus className="h-5 w-5" />
                Tambah Cepat
              </button>
              <button
                type="button"
                onClick={() => { setShowFullAdd(true); setIsAddingInline(false); }}
                className="flex items-center gap-2 px-4 py-2 bg-[#30D158] text-white rounded-lg hover:bg-[#30D158]/90 transition-all"
              >
                <FilePlus2 className="h-5 w-5" />
                Tambah Lengkap
              </button>
            </div>
          </div>
        </div>

        {/* Full Add Form (Inline) */}
        {showFullAdd && (
          <div className="bg-[#2C2C2E] rounded-xl shadow-sm border border-[#38383A] p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">Tambah Aset (Lengkap)</h3>
              <button
                type="button"
                onClick={() => setShowFullAdd(false)}
                disabled={savingFullAdd}
                className="px-3 py-1.5 text-sm bg-[#FF453A] text-white rounded-lg hover:bg-[#FF453A]/90 disabled:opacity-50"
              >
                Tutup
              </button>
            </div>
            <div className="bg-[#1C1C1E] rounded-lg">
              <AssetForm
                mode="create"
                theme="dark"
                categories={Object.keys(categories)}
                statusTypes={Object.keys(statusTypes)}
                conditionTypes={Object.keys(conditionTypes)}
                onCancel={() => setShowFullAdd(false)}
                onSubmit={async (data) => {
                  try {
                    setSavingFullAdd(true);
                    const payload = {
                      asset_name: data.assetName,
                      asset_code: data.assetCode,
                      asset_category: data.assetCategory,
                      asset_type: data.assetType || undefined,
                      description: data.description || undefined,
                      purchase_price: data.purchasePrice ? parseFloat(data.purchasePrice) : 0,
                      purchase_date: data.purchaseDate,
                      supplier: data.supplier || undefined,
                      invoice_number: data.invoiceNumber || undefined,
                      depreciation_method: data.depreciationMethod || 'STRAIGHT_LINE',
                      useful_life: data.usefulLife ? parseInt(data.usefulLife) : 5,
                      salvage_value: data.salvageValue ? parseFloat(data.salvageValue) : 0,
                      depreciation_start_date: data.purchaseDate,
                      location: data.location || undefined,
                      department: data.department || undefined,
                      responsible_person: data.responsiblePerson || undefined,
                      cost_center: data.costCenter || undefined,
                      status: data.status || 'ACTIVE',
                      condition: data.condition || 'GOOD',
                      serial_number: data.serialNumber || undefined,
                      model_number: data.modelNumber || undefined,
                      manufacturer: data.manufacturer || undefined
                    };
                    const res = await apiClient.post('/reports/fixed-asset/register', payload);
                    if (!res.data?.success) throw new Error(res.data?.message || 'Gagal menyimpan aset');
                    await fetchAssets();
                    setShowFullAdd(false);
                  } catch (err) {
                    console.error('Gagal simpan aset:', err);
                    alert(err.response?.data?.message || err.message);
                  } finally {
                    setSavingFullAdd(false);
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Assets Table */}
        <div className="bg-[#2C2C2E] rounded-xl shadow-sm border border-[#38383A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1C1C1E] border-b border-[#38383A]">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider w-8">
                    
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
                    Aset
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
                    Kategori & Lokasi
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-[#98989D] uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-[#98989D] uppercase tracking-wider w-24">
                    Status
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-[#98989D] uppercase tracking-wider w-24">
                    Kondisi
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-[#98989D] uppercase tracking-wider w-28">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#38383A]">
                {/* Inline Add Form */}
                {isAddingInline && (
                  <tr className="bg-[#1C1C1E]/50">
                    <td className="px-3 py-3"></td>
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        name="assetCode"
                        value={formData.assetCode}
                        onChange={handleInputChange}
                        placeholder="Kode: AST-001"
                        required
                        className="w-full px-2 py-1 mb-1 bg-[#2C2C2E] border border-[#38383A] rounded text-xs text-white placeholder-[#636366] focus:ring-1 focus:ring-[#0A84FF]"
                      />
                      <input
                        type="text"
                        name="assetName"
                        value={formData.assetName}
                        onChange={handleInputChange}
                        placeholder="Nama Aset *"
                        required
                        className="w-full px-2 py-1 bg-[#2C2C2E] border border-[#38383A] rounded text-xs text-white placeholder-[#636366] focus:ring-1 focus:ring-[#0A84FF]"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <select
                        name="assetCategory"
                        value={formData.assetCategory}
                        onChange={handleInputChange}
                        required
                        className="w-full px-2 py-1 mb-1 bg-[#2C2C2E] border border-[#38383A] rounded text-xs text-white focus:ring-1 focus:ring-[#0A84FF]"
                      >
                        <option value="">Pilih Kategori *</option>
                        {Object.entries(categories).map(([key, value]) => (
                          <option key={key} value={key}>{value}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Lokasi"
                        className="w-full px-2 py-1 bg-[#2C2C2E] border border-[#38383A] rounded text-xs text-white placeholder-[#636366] focus:ring-1 focus:ring-[#0A84FF]"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        name="purchasePrice"
                        value={formData.purchasePrice}
                        onChange={handleInputChange}
                        placeholder="Harga"
                        className="w-full px-2 py-1 bg-[#2C2C2E] border border-[#38383A] rounded text-xs text-white placeholder-[#636366] focus:ring-1 focus:ring-[#0A84FF] mb-1"
                      />
                      <input
                        type="date"
                        name="purchaseDate"
                        value={formData.purchaseDate}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 bg-[#2C2C2E] border border-[#38383A] rounded text-xs text-white focus:ring-1 focus:ring-[#0A84FF]"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 bg-[#2C2C2E] border border-[#38383A] rounded text-xs text-white focus:ring-1 focus:ring-[#0A84FF]"
                      >
                        {Object.entries(statusTypes).map(([key, value]) => (
                          <option key={key} value={key}>{value}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 bg-[#2C2C2E] border border-[#38383A] rounded text-xs text-white focus:ring-1 focus:ring-[#0A84FF]"
                      >
                        {Object.entries(conditionTypes).map(([key, value]) => (
                          <option key={key} value={key}>{value}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={handleSubmitAsset}
                          disabled={submitLoading || !formData.assetName || !formData.assetCategory}
                          className="p-1 bg-[#30D158] text-white rounded hover:bg-[#30D158]/90 transition-colors disabled:opacity-50"
                          title="Simpan"
                        >
                          {submitLoading ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setIsAddingInline(false);
                            resetForm();
                          }}
                          className="p-1 bg-[#FF453A] text-white rounded hover:bg-[#FF453A]/90 transition-colors"
                          title="Batal"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {filteredAssets.length === 0 && !isAddingInline ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <Package className="h-12 w-12 text-[#636366] mx-auto mb-3" />
                      <p className="text-[#98989D]">Tidak ada data aset</p>
                      <p className="text-sm text-[#636366] mt-1">Silakan tambahkan aset baru</p>
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => (
                    <React.Fragment key={asset.id}>
                      <tr className="hover:bg-[#38383A]/30 transition-colors">
                        <td className="px-3 py-3">
                          <button
                            onClick={() => toggleRowExpand(asset.id)}
                            className="text-[#98989D] hover:text-white transition-colors"
                            title={expandedRow === asset.id ? "Tutup Detail" : "Lihat Detail"}
                          >
                            {expandedRow === asset.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-sm font-medium text-white">{asset.assetName}</div>
                          <div className="text-xs text-[#636366] mt-0.5">{asset.assetCode}</div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-sm text-white">{categories[asset.assetCategory] || asset.assetCategory}</div>
                          <div className="text-xs text-[#98989D] mt-0.5">{asset.location || '-'}</div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-sm text-white">
                            {new Intl.NumberFormat('id-ID', { 
                              style: 'currency', 
                              currency: 'IDR',
                              maximumFractionDigits: 0
                            }).format(asset.purchasePrice || 0)}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(asset.status)}`}>
                            {statusTypes[asset.status] || asset.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${getConditionColor(asset.condition)}`}>
                            {conditionTypes[asset.condition] || asset.condition}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleEditClick(asset)}
                              className="p-1 text-[#0A84FF] hover:bg-[#0A84FF]/10 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAsset(asset)}
                              className="p-1 text-[#FF453A] hover:bg-[#FF453A]/10 rounded transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Inline Detail/Edit Row */}
                      {expandedRow === asset.id && (
                        <tr className="bg-[#1C1C1E]/80">
                          <td colSpan="7" className="px-6 py-4">
                            {editingId === asset.id ? (
                              /* EDIT MODE - Full AssetForm */
                              <AssetForm
                                theme="dark"
                                mode="edit"
                                asset={asset}
                                categories={Object.keys(categories)}
                                statusTypes={Object.keys(statusTypes)}
                                conditionTypes={Object.keys(conditionTypes)}
                                onCancel={handleEditCancel}
                                onSubmit={async (data) => {
                                  try {
                                    setSubmitLoading(true);
                                    const payload = {
                                      asset_name: data.assetName,
                                      asset_code: data.assetCode,
                                      asset_category: data.assetCategory,
                                      asset_type: data.assetType || undefined,
                                      description: data.description || undefined,
                                      purchase_price: data.purchasePrice ? parseFloat(data.purchasePrice) : 0,
                                      purchase_date: data.purchaseDate,
                                      supplier: data.supplier || undefined,
                                      invoice_number: data.invoiceNumber || undefined,
                                      depreciation_method: data.depreciationMethod || 'STRAIGHT_LINE',
                                      useful_life: data.usefulLife ? parseInt(data.usefulLife) : 5,
                                      salvage_value: data.salvageValue ? parseFloat(data.salvageValue) : 0,
                                      depreciation_start_date: data.purchaseDate,
                                      location: data.location || undefined,
                                      department: data.department || undefined,
                                      responsible_person: data.responsiblePerson || undefined,
                                      cost_center: data.costCenter || undefined,
                                      status: data.status || 'ACTIVE',
                                      condition: data.condition || 'GOOD',
                                      serial_number: data.serialNumber || undefined,
                                      model_number: data.modelNumber || undefined,
                                      manufacturer: data.manufacturer || undefined
                                    };
                                    const res = await apiClient.put(`/reports/fixed-asset/${asset.id}`, payload);
                                    if (!res.data?.success) throw new Error(res.data?.message || 'Gagal mengupdate aset');
                                    await fetchAssets();
                                    setEditingId(null);
                                  } catch (err) {
                                    console.error('Gagal update aset:', err);
                                    alert(err.response?.data?.message || err.message);
                                  } finally {
                                    setSubmitLoading(false);
                                  }
                                }}
                              />
                            ) : (
                              /* VIEW MODE */
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="text-xs font-medium text-[#98989D]">Nama Aset</label>
                                  <p className="mt-1 text-sm text-white">{asset.assetName}</p>
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-[#98989D]">Kode Aset</label>
                                  <p className="mt-1 text-sm text-white">{asset.assetCode}</p>
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-[#98989D]">Kategori</label>
                                  <p className="mt-1 text-sm text-white">{categories[asset.assetCategory] || asset.assetCategory}</p>
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-[#98989D]">Lokasi</label>
                                  <p className="mt-1 text-sm text-white">{asset.location || '-'}</p>
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-[#98989D]">Harga Pembelian</label>
                                  <p className="mt-1 text-sm text-white">
                                    {new Intl.NumberFormat('id-ID', { 
                                      style: 'currency', 
                                      currency: 'IDR',
                                      maximumFractionDigits: 0
                                    }).format(asset.purchasePrice || 0)}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-[#98989D]">Tanggal Pembelian</label>
                                  <p className="mt-1 text-sm text-white">
                                    {asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString('id-ID') : '-'}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-[#98989D]">Status</label>
                                  <p className="mt-1">
                                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(asset.status)}`}>
                                      {statusTypes[asset.status] || asset.status}
                                    </span>
                                  </p>
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-[#98989D]">Kondisi</label>
                                  <p className="mt-1">
                                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${getConditionColor(asset.condition)}`}>
                                      {conditionTypes[asset.condition] || asset.condition}
                                    </span>
                                  </p>
                                </div>
                                {asset.description && (
                                  <div className="md:col-span-3">
                                    <label className="text-xs font-medium text-[#98989D]">Deskripsi</label>
                                    <p className="mt-1 text-sm text-white">{asset.description}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* (Modal removed; form now inline) */}

      </div>
    </div>
  );
};

export default AssetRegistry;
