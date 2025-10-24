import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  ShoppingCart,
  FileText,
  RefreshCw,
  Filter,
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import ProjectFinanceIntegrationService from '../../services/ProjectFinanceIntegrationService';

const ProjectFinanceIntegrationDashboard = ({ selectedSubsidiary, selectedProject, compact = false }) => {
  const [integrationData, setIntegrationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch integrated data
  const fetchIntegratedData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters = {};
      
      if (selectedSubsidiary && selectedSubsidiary !== 'all') {
        filters.subsidiaryId = selectedSubsidiary;
      }
      
      if (selectedProject && selectedProject !== 'all') {
        filters.projectId = selectedProject;
      }
      
      const response = await ProjectFinanceIntegrationService.getIntegratedFinancialData(filters);
      
      if (response.success) {
        setIntegrationData(response.data);
        setLastUpdate(new Date().toLocaleTimeString('id-ID'));
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching integrated data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh setup
  useEffect(() => {
    fetchIntegratedData();
  }, [selectedSubsidiary, selectedProject]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchIntegratedData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, selectedSubsidiary, selectedProject]);

  // Manual refresh
  const handleManualRefresh = () => {
    fetchIntegratedData();
  };

  // Format currency
  const formatCurrency = ProjectFinanceIntegrationService.formatCurrency;

  if (loading && !integrationData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin" style={{ color: "#0A84FF" }} />
          <span style={{ color: "#98989D" }}>Memuat data keuangan terintegrasi...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg p-6" style={{ backgroundColor: "rgba(255, 69, 58, 0.1)", border: "1px solid #FF453A" }}>
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" style={{ color: "#FF453A" }} />
          <span className="font-medium" style={{ color: "#FF453A" }}>Gagal memuat data</span>
        </div>
        <p className="text-sm mt-2" style={{ color: "#FF453A" }}>{error}</p>
        <button
          onClick={handleManualRefresh}
          className="mt-3 px-4 py-2 rounded-md text-sm transition-colors duration-150"
          style={{ backgroundColor: "rgba(255, 69, 58, 0.15)", border: "1px solid #FF453A", color: "#FF453A" }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!integrationData) {
    return (
      <div className="text-center p-8">
        <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: "#636366" }} />
        <p style={{ color: "#98989D" }}>Tidak ada data keuangan terintegrasi</p>
      </div>
    );
  }

  const { metrics, projects, transactions, poTransactions } = integrationData;

  return (
    <div className="space-y-6">
      {/* Header with refresh controls */}
      {!compact && (
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold" style={{ color: "#FFFFFF" }}>Project Finance Integration</h3>
            <p className="text-sm" style={{ color: "#98989D" }}>
              Real-time synchronization between project transactions and finance data
            </p>
            {lastUpdate && (
              <p className="text-xs mt-1" style={{ color: "#636366" }}>
                Last updated: {lastUpdate}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
                style={{ accentColor: "#0A84FF" }}
              />
              <span className="text-sm" style={{ color: "#98989D" }}>Auto-refresh</span>
            </label>
            
            <button
              onClick={handleManualRefresh}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg text-sm flex items-center space-x-1 transition-colors duration-150 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)", color: "#FFFFFF" }}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      )}

      {/* Overview Metrics */}
      <div className={`grid grid-cols-1 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'} gap-6`}>
        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "#98989D" }}>Proyek Aktif</p>
              <p className="text-2xl font-bold" style={{ color: "#FFFFFF" }}>{metrics.overview.activeProjects}</p>
              <p className="text-xs" style={{ color: "#636366" }}>dari total {metrics.overview.totalProjects}</p>
            </div>
            <Building2 className="w-8 h-8" style={{ color: "#0A84FF" }} />
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "#98989D" }}>Total Pendapatan</p>
              <p className="text-2xl font-bold" style={{ color: "#32D74B" }}>{formatCurrency(metrics.overview.totalIncome)}</p>
              <p className="text-xs" style={{ color: "#636366" }}>{metrics.overview.totalTransactions} transaksi</p>
            </div>
            <TrendingUp className="w-8 h-8" style={{ color: "#32D74B" }} />
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "#98989D" }}>Total Pengeluaran</p>
              <p className="text-2xl font-bold" style={{ color: "#FF453A" }}>{formatCurrency(metrics.overview.totalExpense)}</p>
              <p className="text-xs" style={{ color: "#636366" }}>termasuk komitmen PO</p>
            </div>
            <TrendingDown className="w-8 h-8" style={{ color: "#FF453A" }} />
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "#98989D" }}>Transaksi PO</p>
              <p className="text-2xl font-bold" style={{ color: "#0A84FF" }}>{metrics.overview.poTransactions}</p>
              <p className="text-xs" style={{ color: "#636366" }}>{formatCurrency(metrics.overview.totalPOAmount)}</p>
            </div>
            <ShoppingCart className="w-8 h-8" style={{ color: "#0A84FF" }} />
          </div>
        </div>
      </div>

      {/* Net Income Summary */}
      <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold" style={{ color: "#FFFFFF" }}>Ringkasan Keuangan</h4>
          <div className={`px-3 py-1 rounded-full text-sm font-medium`} style={{
            backgroundColor: metrics.overview.netIncome >= 0 ? "rgba(50, 215, 75, 0.15)" : "rgba(255, 69, 58, 0.15)",
            color: metrics.overview.netIncome >= 0 ? "#32D74B" : "#FF453A"
          }}>
            Laba Bersih: {formatCurrency(metrics.overview.netIncome)}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg" style={{ backgroundColor: "rgba(50, 215, 75, 0.1)", border: "1px solid rgba(50, 215, 75, 0.3)" }}>
            <p className="text-sm" style={{ color: "#98989D" }}>Pendapatan</p>
            <p className="text-xl font-bold" style={{ color: "#32D74B" }}>{formatCurrency(metrics.overview.totalIncome)}</p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: "rgba(255, 69, 58, 0.1)", border: "1px solid rgba(255, 69, 58, 0.3)" }}>
            <p className="text-sm" style={{ color: "#98989D" }}>Pengeluaran</p>
            <p className="text-xl font-bold" style={{ color: "#FF453A" }}>{formatCurrency(metrics.overview.totalExpense)}</p>
          </div>
          <div className={`p-4 rounded-lg`} style={{
            backgroundColor: metrics.overview.netIncome >= 0 ? "rgba(10, 132, 255, 0.1)" : "rgba(255, 159, 10, 0.1)",
            border: metrics.overview.netIncome >= 0 ? "1px solid rgba(10, 132, 255, 0.3)" : "1px solid rgba(255, 159, 10, 0.3)"
          }}>
            <p className="text-sm" style={{ color: "#98989D" }}>Hasil Bersih</p>
            <p className={`text-xl font-bold`} style={{
              color: metrics.overview.netIncome >= 0 ? "#0A84FF" : "#FF9F0A"
            }}>
              {formatCurrency(metrics.overview.netIncome)}
            </p>
          </div>
        </div>
      </div>

      {/* Project Breakdown */}
      {!compact && metrics.projectBreakdown.length > 0 && (
        <div className="rounded-lg shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="p-6" style={{ borderBottom: "1px solid #38383A" }}>
            <h4 className="text-lg font-semibold" style={{ color: "#FFFFFF" }}>Rincian Proyek</h4>
            <p className="text-sm" style={{ color: "#98989D" }}>Kinerja keuangan per proyek</p>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full" style={{ borderCollapse: "collapse" }}>
                <thead style={{ backgroundColor: "#1C1C1E" }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#98989D", borderBottom: "1px solid #38383A" }}>Proyek</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#98989D", borderBottom: "1px solid #38383A" }}>Pendapatan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#98989D", borderBottom: "1px solid #38383A" }}>Pengeluaran</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#98989D", borderBottom: "1px solid #38383A" }}>Laba Bersih</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#98989D", borderBottom: "1px solid #38383A" }}>Jumlah PO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#98989D", borderBottom: "1px solid #38383A" }}>Transaksi</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: "#2C2C2E" }}>
                  {metrics.projectBreakdown.map((project, index) => (
                    <tr key={project.projectId} 
                        className="transition-colors duration-150" 
                        style={{ borderBottom: "1px solid #38383A" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4" style={{ color: "#636366" }} />
                          <div>
                            <div className="text-sm font-medium" style={{ color: "#FFFFFF" }}>{project.projectName}</div>
                            <div className="text-xs" style={{ color: "#636366" }}>{project.projectId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: "#32D74B" }}>
                        {formatCurrency(project.income)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: "#FF453A" }}>
                        {formatCurrency(project.expense)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium`} style={{
                          color: project.netIncome >= 0 ? "#32D74B" : "#FF453A"
                        }}>
                          {formatCurrency(project.netIncome)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: "rgba(10, 132, 255, 0.15)", color: "#0A84FF" }}>
                          {project.poCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: "#98989D" }}>
                        {project.transactionCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {!compact && metrics.recentActivity.length > 0 && (
        <div className="rounded-lg shadow-sm" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="p-6" style={{ borderBottom: "1px solid #38383A" }}>
            <h4 className="text-lg font-semibold" style={{ color: "#FFFFFF" }}>Aktivitas Keuangan Terbaru</h4>
            <p className="text-sm" style={{ color: "#98989D" }}>Transaksi terbaru di seluruh proyek</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-3">
              {metrics.recentActivity.slice(0, 5).map((transaction, index) => (
                <div key={transaction.id || index} 
                     className="flex items-center justify-between p-3 rounded-lg transition-colors duration-150"
                     style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A" }}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full`} style={{
                      backgroundColor: transaction.type === 'income' ? "rgba(50, 215, 75, 0.15)" : "rgba(255, 69, 58, 0.15)"
                    }}>
                      <Activity className={`w-4 h-4`} style={{
                        color: transaction.type === 'income' ? "#32D74B" : "#FF453A"
                      }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#FFFFFF" }}>
                        {transaction.description || transaction.desc || 'Tanpa deskripsi'}
                      </p>
                      <p className="text-xs" style={{ color: "#98989D" }}>
                        {transaction.date ? new Date(transaction.date).toLocaleDateString('id-ID') : 'Tanpa tanggal'}
                        {transaction.category && ` • ${transaction.category}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-sm font-medium`} style={{
                      color: transaction.type === 'income' ? "#32D74B" : "#FF453A"
                    }}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    {transaction.purchaseOrderId && (
                      <p className="text-xs" style={{ color: "#0A84FF" }}>Tertaut ke PO</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectFinanceIntegrationDashboard;
