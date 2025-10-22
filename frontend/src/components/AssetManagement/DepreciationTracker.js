import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingDown, Calculator, RefreshCw, Package, X, ChevronDown, ChevronUp
} from 'lucide-react';
import { apiClient } from '../../services/api';

const DepreciationTracker = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);

  const depreciationMethods = {
    STRAIGHT_LINE: 'Garis Lurus',
    DECLINING_BALANCE: 'Saldo Menurun',
    DOUBLE_DECLINING: 'Saldo Menurun Berganda'
  };

  const fetchAssetsWithDepreciation = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/reports/fixed-asset/list');
      
      if (response.data.success) {
        const rawAssets = response.data.data || [];
        
        const assetsWithDepreciation = rawAssets.map(asset => {
          const purchasePrice = parseFloat(asset.purchasePrice) || 0;
          const salvageValue = parseFloat(asset.salvageValue) || 0;
          const usefulLife = parseInt(asset.usefulLife) || 5;
          const purchaseDate = new Date(asset.purchaseDate);
          const currentDate = new Date();
          
          const monthsElapsed = (currentDate.getFullYear() - purchaseDate.getFullYear()) * 12 + 
                               (currentDate.getMonth() - purchaseDate.getMonth());
          
          const depreciableAmount = purchasePrice - salvageValue;
          const annualDepreciation = depreciableAmount / usefulLife;
          const monthlyDepreciation = annualDepreciation / 12;
          const accumulatedDepreciation = Math.min(monthlyDepreciation * monthsElapsed, depreciableAmount);
          const netBookValue = purchasePrice - accumulatedDepreciation;
          
          return {
            ...asset,
            depreciableAmount,
            annualDepreciation,
            monthlyDepreciation,
            accumulatedDepreciation,
            netBookValue,
            depreciationMethod: 'STRAIGHT_LINE',
            usefulLife
          };
        });
        
        setAssets(assetsWithDepreciation);
      }
    } catch (error) {
      console.error('Error fetching depreciation data:', error);
      setError('Gagal memuat data depresiasi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssetsWithDepreciation();
  }, [fetchAssetsWithDepreciation]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const generateDepreciationSchedule = (asset) => {
    const schedule = [];
    const startYear = new Date(asset.purchaseDate).getFullYear();
    
    for (let year = 1; year <= asset.usefulLife; year++) {
      const yearlyDepreciation = asset.annualDepreciation;
      const accumulated = yearlyDepreciation * year;
      const netBookValue = asset.purchasePrice - Math.min(accumulated, asset.depreciableAmount);
      
      schedule.push({
        year: startYear + year - 1,
        yearNumber: year,
        depreciation: yearlyDepreciation,
        accumulated: Math.min(accumulated, asset.depreciableAmount),
        netBookValue: Math.max(netBookValue, asset.salvageValue || 0)
      });
    }
    
    return schedule;
  };

  const toggleRowExpand = (assetId) => {
    setExpandedRow(expandedRow === assetId ? null : assetId);
  };

  const filteredAssets = assets.filter(asset =>
    asset.assetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalAssets: assets.length,
    totalCost: assets.reduce((sum, a) => sum + (parseFloat(a.purchasePrice) || 0), 0),
    totalDepreciation: assets.reduce((sum, a) => sum + (a.accumulatedDepreciation || 0), 0),
    totalNetBook: assets.reduce((sum, a) => sum + (a.netBookValue || 0), 0)
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
                <p className="text-2xl font-bold text-white">{stats.totalAssets}</p>
              </div>
              <div className="w-12 h-12 bg-[#0A84FF]/20 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-[#0A84FF]" />
              </div>
            </div>
          </div>

          <div className="bg-[#2C2C2E] rounded-xl p-4 shadow-sm border border-[#38383A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#98989D] mb-1">Total Biaya</p>
                <p className="text-lg font-bold text-white">{formatCurrency(stats.totalCost)}</p>
              </div>
              <div className="w-12 h-12 bg-[#0A84FF]/20 rounded-xl flex items-center justify-center">
                <Calculator className="h-6 w-6 text-[#0A84FF]" />
              </div>
            </div>
          </div>

          <div className="bg-[#2C2C2E] rounded-xl p-4 shadow-sm border border-[#38383A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#98989D] mb-1">Akumulasi Depresiasi</p>
                <p className="text-lg font-bold text-[#FF9F0A]">{formatCurrency(stats.totalDepreciation)}</p>
              </div>
              <div className="w-12 h-12 bg-[#FF9F0A]/20 rounded-xl flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-[#FF9F0A]" />
              </div>
            </div>
          </div>

          <div className="bg-[#2C2C2E] rounded-xl p-4 shadow-sm border border-[#38383A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#98989D] mb-1">Nilai Buku Bersih</p>
                <p className="text-lg font-bold text-[#30D158]">{formatCurrency(stats.totalNetBook)}</p>
              </div>
              <div className="w-12 h-12 bg-[#30D158]/20 rounded-xl flex items-center justify-center">
                <Calculator className="h-6 w-6 text-[#30D158]" />
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

        {/* Search */}
        <div className="bg-[#2C2C2E] rounded-xl shadow-sm border border-[#38383A] p-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Cari aset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white placeholder-[#636366] focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
            />
            <button
              onClick={fetchAssetsWithDepreciation}
              className="flex items-center gap-2 px-4 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 transition-all"
            >
              <RefreshCw className="h-5 w-5" />
              Refresh
            </button>
          </div>
        </div>

        {/* Assets Table */}
        <div className="bg-[#2C2C2E] rounded-xl shadow-sm border border-[#38383A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1C1C1E] border-b border-[#38383A]">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-[#98989D] uppercase w-8"></th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-[#98989D] uppercase">Aset</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-[#98989D] uppercase">Metode</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-[#98989D] uppercase">Harga Beli</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-[#98989D] uppercase">Akumulasi</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-[#98989D] uppercase">Nilai Buku</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-[#98989D] uppercase">Per Tahun</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#38383A]">
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <Package className="h-12 w-12 text-[#636366] mx-auto mb-3" />
                      <p className="text-[#98989D]">Tidak ada data aset</p>
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
                            title={expandedRow === asset.id ? "Tutup Jadwal" : "Lihat Jadwal"}
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
                          <div className="text-sm text-white">{depreciationMethods[asset.depreciationMethod]}</div>
                          <div className="text-xs text-[#98989D] mt-0.5">{asset.usefulLife} tahun</div>
                        </td>
                        <td className="px-3 py-3 text-sm text-white">
                          {formatCurrency(asset.purchasePrice || 0)}
                        </td>
                        <td className="px-3 py-3 text-sm text-[#FF9F0A]">
                          {formatCurrency(asset.accumulatedDepreciation || 0)}
                        </td>
                        <td className="px-3 py-3 text-sm text-[#30D158] font-medium">
                          {formatCurrency(asset.netBookValue || 0)}
                        </td>
                        <td className="px-3 py-3 text-sm text-white">
                          {formatCurrency(asset.annualDepreciation || 0)}
                        </td>
                      </tr>

                      {/* Inline Schedule */}
                      {expandedRow === asset.id && (
                        <tr className="bg-[#1C1C1E]/80">
                          <td colSpan="7" className="px-6 py-4">
                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold text-white mb-3">
                                Jadwal Depresiasi - {asset.assetName}
                              </h4>
                              
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead className="bg-[#2C2C2E]">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-[#98989D] uppercase">Tahun</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-[#98989D] uppercase">Depresiasi</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-[#98989D] uppercase">Akumulasi</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-[#98989D] uppercase">Nilai Buku</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-[#38383A]">
                                    {generateDepreciationSchedule(asset).map((item) => (
                                      <tr key={item.year} className="hover:bg-[#38383A]/30">
                                        <td className="px-4 py-2 text-sm text-white">
                                          Tahun {item.yearNumber} ({item.year})
                                        </td>
                                        <td className="px-4 py-2 text-sm text-[#FF9F0A]">
                                          {formatCurrency(item.depreciation)}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-[#FF453A]">
                                          {formatCurrency(item.accumulated)}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-[#30D158] font-medium">
                                          {formatCurrency(item.netBookValue)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
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

      </div>
    </div>
  );
};

export default DepreciationTracker;
