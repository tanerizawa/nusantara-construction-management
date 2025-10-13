import React, { useState, useEffect, useCallback } from 'react';
import { 
  PieChart, BarChart3, TrendingUp, DollarSign, Package, RefreshCw, X
} from 'lucide-react';
import axios from 'axios';

const AssetAnalytics = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/reports/fixed-asset/list');
      
      if (response.data.success) {
        const rawAssets = response.data.data || [];
        
        const totalValue = rawAssets.reduce((sum, a) => sum + (parseFloat(a.purchasePrice) || 0), 0);
        
        const byCategory = {};
        rawAssets.forEach(asset => {
          const cat = asset.assetCategory || 'OTHER';
          if (!byCategory[cat]) {
            byCategory[cat] = { count: 0, value: 0 };
          }
          byCategory[cat].count += 1;
          byCategory[cat].value += parseFloat(asset.purchasePrice) || 0;
        });

        const byStatus = {};
        rawAssets.forEach(asset => {
          const status = asset.status || 'UNKNOWN';
          byStatus[status] = (byStatus[status] || 0) + 1;
        });

        setAnalytics({
          total: rawAssets.length,
          totalValue,
          averageValue: rawAssets.length > 0 ? totalValue / rawAssets.length : 0,
          byCategory,
          byStatus
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Gagal memuat analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const categoryNames = {
    HEAVY_EQUIPMENT: 'Alat Berat',
    VEHICLES: 'Kendaraan',
    BUILDINGS: 'Bangunan',
    OFFICE_EQUIPMENT: 'Peralatan Kantor',
    TOOLS_MACHINERY: 'Peralatan & Mesin',
    COMPUTERS_IT: 'Komputer & IT'
  };

  const statusNames = {
    ACTIVE: 'Aktif',
    UNDER_MAINTENANCE: 'Perawatan',
    IDLE: 'Tidak Digunakan',
    DISPOSED: 'Dibuang'
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#2C2C2E] rounded-xl p-6 shadow-sm border border-[#38383A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#98989D] mb-1">Total Aset</p>
                <p className="text-3xl font-bold text-white">{analytics.total || 0}</p>
              </div>
              <div className="w-14 h-14 bg-[#0A84FF]/20 rounded-xl flex items-center justify-center">
                <Package className="h-7 w-7 text-[#0A84FF]" />
              </div>
            </div>
          </div>

          <div className="bg-[#2C2C2E] rounded-xl p-6 shadow-sm border border-[#38383A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#98989D] mb-1">Total Nilai</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(analytics.totalValue || 0)}</p>
              </div>
              <div className="w-14 h-14 bg-[#30D158]/20 rounded-xl flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-[#30D158]" />
              </div>
            </div>
          </div>

          <div className="bg-[#2C2C2E] rounded-xl p-6 shadow-sm border border-[#38383A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#98989D] mb-1">Rata-rata Nilai</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(analytics.averageValue || 0)}</p>
              </div>
              <div className="w-14 h-14 bg-[#0A84FF]/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-[#0A84FF]" />
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

        {/* By Category */}
        <div className="bg-[#2C2C2E] rounded-xl shadow-sm border border-[#38383A] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-[#0A84FF]" />
              Aset per Kategori
            </h3>
            <button
              onClick={fetchAnalytics}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 transition-all text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
          
          <div className="space-y-4">
            {Object.entries(analytics.byCategory || {}).map(([key, data]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-[#1C1C1E] rounded-lg">
                <div>
                  <p className="text-sm font-medium text-white">{categoryNames[key] || key}</p>
                  <p className="text-xs text-[#98989D] mt-1">{data.count} aset</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#0A84FF]">{formatCurrency(data.value)}</p>
                  <p className="text-xs text-[#636366] mt-1">
                    {((data.value / (analytics.totalValue || 1)) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Status */}
        <div className="bg-[#2C2C2E] rounded-xl shadow-sm border border-[#38383A] p-6">
          <h3 className="text-lg font-bold text-white flex items-center mb-6">
            <BarChart3 className="h-5 w-5 mr-2 text-[#0A84FF]" />
            Aset per Status
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(analytics.byStatus || {}).map(([key, count]) => {
              const colors = {
                ACTIVE: '#30D158',
                UNDER_MAINTENANCE: '#FF9F0A',
                IDLE: '#98989D',
                DISPOSED: '#FF453A'
              };
              const color = colors[key] || '#98989D';
              
              return (
                <div key={key} className="bg-[#1C1C1E] rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold mb-2" style={{ color }}>{count}</p>
                  <p className="text-sm text-[#98989D]">{statusNames[key] || key}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AssetAnalytics;
