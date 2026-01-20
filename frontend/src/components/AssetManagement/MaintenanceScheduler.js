import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, AlertTriangle, CheckCircle, RefreshCw, Package, X
} from 'lucide-react';
import { apiClient } from '../../services/api';

const MaintenanceScheduler = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/reports/fixed-asset/list');
      
      if (response.data.success) {
        const rawAssets = response.data.data || [];
        
        const assetsWithMaintenance = rawAssets.map(asset => {
          const purchaseDate = new Date(asset.purchaseDate);
          const currentDate = new Date();
          
          let maintenanceInterval = 12;
          if (asset.assetCategory === 'HEAVY_EQUIPMENT') maintenanceInterval = 6;
          if (asset.assetCategory === 'VEHICLES') maintenanceInterval = 3;
          
          const nextMaintenanceDate = new Date(purchaseDate);
          nextMaintenanceDate.setMonth(nextMaintenanceDate.getMonth() + maintenanceInterval);
          
          const daysUntilMaintenance = Math.ceil((nextMaintenanceDate - currentDate) / (1000 * 60 * 60 * 24));
          const isOverdue = daysUntilMaintenance < 0;
          const isUpcoming = daysUntilMaintenance > 0 && daysUntilMaintenance <= 30;
          
          return {
            ...asset,
            nextMaintenanceDate,
            daysUntilMaintenance,
            maintenanceInterval,
            status: isOverdue ? 'OVERDUE' : isUpcoming ? 'UPCOMING' : 'OK'
          };
        });
        
        setAssets(assetsWithMaintenance);
      }
    } catch (error) {
      console.error('Error fetching maintenance data:', error);
      setError('Gagal memuat data perawatan');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const filteredAssets = assets.filter(asset =>
    asset.assetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: assets.length,
    overdue: assets.filter(a => a.status === 'OVERDUE').length,
    upcoming: assets.filter(a => a.status === 'UPCOMING').length,
    ok: assets.filter(a => a.status === 'OK').length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OVERDUE': return 'bg-[#FF453A]/20 text-[#FF453A] border-[#FF453A]/30';
      case 'UPCOMING': return 'bg-[#FF9F0A]/20 text-[#FF9F0A] border-[#FF9F0A]/30';
      default: return 'bg-[#30D158]/20 text-[#30D158] border-[#30D158]/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1C1C1E]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A84FF]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#0b0f19] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0b0f19]/90 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">Total Aset</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-[#0ea5e9]/20 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-[#0ea5e9]" />
              </div>
            </div>
          </div>
          <div className="bg-[#0b0f19]/90 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">Terlambat</p>
                <p className="text-2xl font-bold text-red-400">{stats.overdue}</p>
              </div>
              <div className="w-12 h-12 bg-red-400/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </div>
          <div className="bg-[#0b0f19]/90 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">Segera</p>
                <p className="text-2xl font-bold text-amber-400">{stats.upcoming}</p>
              </div>
              <div className="w-12 h-12 bg-amber-400/20 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </div>
          <div className="bg-[#0b0f19]/90 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">Normal</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.ok}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-400/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Search */}
        <div className="bg-[#0b0f19]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Cari aset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent transition-all"
            />
            <button
              onClick={fetchAssets}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0ea5e9] text-white rounded-xl hover:bg-[#0ea5e9]/90 transition-all shadow-lg shadow-[#0ea5e9]/20"
            >
              <RefreshCw className="h-5 w-5" />
              Refresh
            </button>
          </div>
        </div>

        {/* Maintenance Table */}
        <div className="bg-[#0b0f19]/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-3 py-4 text-left text-xs font-medium text-white/50 uppercase">Aset</th>
                  <th className="px-3 py-4 text-left text-xs font-medium text-white/50 uppercase">Interval</th>
                  <th className="px-3 py-4 text-left text-xs font-medium text-white/50 uppercase">Jadwal Berikutnya</th>
                  <th className="px-3 py-4 text-left text-xs font-medium text-white/50 uppercase">Hari</th>
                  <th className="px-3 py-4 text-center text-xs font-medium text-white/50 uppercase w-24">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center bg-white/5 rounded-xl">
                      <Package className="h-12 w-12 text-white/30 mx-auto mb-3" />
                      <p className="text-white/60">Tidak ada data perawatan</p>
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-white/10 transition-colors">
                      <td className="px-3 py-3">
                        <div className="text-sm font-semibold text-white">{asset.assetName}</div>
                        <div className="text-xs text-white/40 mt-0.5">{asset.assetCode}</div>
                      </td>
                      <td className="px-3 py-3 text-sm text-white">
                        {asset.maintenanceInterval} bulan
                      </td>
                      <td className="px-3 py-3 text-sm text-white">
                        {asset.nextMaintenanceDate.toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-3 py-3 text-sm text-white">
                        {asset.daysUntilMaintenance > 0 ? `${asset.daysUntilMaintenance} hari` : `${Math.abs(asset.daysUntilMaintenance)} hari terlambat`}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(asset.status)} bg-white/10`}>
                          {asset.status === 'OVERDUE' ? 'Terlambat' : asset.status === 'UPCOMING' ? 'Segera' : 'Normal'}
                        </span>
                      </td>
                    </tr>
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

export default MaintenanceScheduler;
