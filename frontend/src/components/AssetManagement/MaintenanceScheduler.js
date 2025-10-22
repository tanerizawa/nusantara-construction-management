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
                <p className="text-sm text-[#98989D] mb-1">Terlambat</p>
                <p className="text-2xl font-bold text-[#FF453A]">{stats.overdue}</p>
              </div>
              <div className="w-12 h-12 bg-[#FF453A]/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-[#FF453A]" />
              </div>
            </div>
          </div>

          <div className="bg-[#2C2C2E] rounded-xl p-4 shadow-sm border border-[#38383A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#98989D] mb-1">Segera</p>
                <p className="text-2xl font-bold text-[#FF9F0A]">{stats.upcoming}</p>
              </div>
              <div className="w-12 h-12 bg-[#FF9F0A]/20 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-[#FF9F0A]" />
              </div>
            </div>
          </div>

          <div className="bg-[#2C2C2E] rounded-xl p-4 shadow-sm border border-[#38383A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#98989D] mb-1">Normal</p>
                <p className="text-2xl font-bold text-[#30D158]">{stats.ok}</p>
              </div>
              <div className="w-12 h-12 bg-[#30D158]/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-[#30D158]" />
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
              onClick={fetchAssets}
              className="flex items-center gap-2 px-4 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 transition-all"
            >
              <RefreshCw className="h-5 w-5" />
              Refresh
            </button>
          </div>
        </div>

        {/* Maintenance Table */}
        <div className="bg-[#2C2C2E] rounded-xl shadow-sm border border-[#38383A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1C1C1E] border-b border-[#38383A]">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-[#98989D] uppercase">Aset</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-[#98989D] uppercase">Interval</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-[#98989D] uppercase">Jadwal Berikutnya</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-[#98989D] uppercase">Hari</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-[#98989D] uppercase w-24">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#38383A]">
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <Package className="h-12 w-12 text-[#636366] mx-auto mb-3" />
                      <p className="text-[#98989D]">Tidak ada data perawatan</p>
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-[#38383A]/30 transition-colors">
                      <td className="px-3 py-3">
                        <div className="text-sm font-medium text-white">{asset.assetName}</div>
                        <div className="text-xs text-[#636366] mt-0.5">{asset.assetCode}</div>
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
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(asset.status)}`}>
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
