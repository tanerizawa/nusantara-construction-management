import React, { useState } from 'react';
import { 
  FileText, 
  TrendingUp, 
  PieChart, 
  BarChart3,
  DollarSign,
  Download,
  Loader2,
  X,
  ChevronDown
} from 'lucide-react';
import { CalendarIconWhite } from '../../../components/ui/CalendarIcon';
import { DateInputWithIcon } from '../../../components/ui/CalendarIcon';

/**
 * ReportGenerator - Inline component untuk generate report dalam workflow
 * Muncul sebagai section di dalam page, bukan modal
 */
const ReportGenerator = ({ 
  projectId, 
  project,
  onClose 
}) => {
  const [selectedReportType, setSelectedReportType] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [error, setError] = useState('');

  // Report types dengan icon dan deskripsi
  const reportTypes = [
    {
      id: 'cost-analysis',
      name: 'Project Cost Analysis',
      description: 'Analisis detail breakdown biaya proyek',
      icon: DollarSign,
      color: '#0A84FF',
      endpoint: '/api/reports/project/cost-analysis'
    },
    {
      id: 'profitability',
      name: 'Profitability Analysis',
      description: 'Analisis profitabilitas dan margin proyek',
      icon: TrendingUp,
      color: '#30D158',
      endpoint: '/api/reports/project/profitability'
    },
    {
      id: 'budget-variance',
      name: 'Budget Variance Report',
      description: 'Perbandingan budget vs aktual spending',
      icon: PieChart,
      color: '#FFD60A',
      endpoint: '/api/reports/budget/variance'
    },
    {
      id: 'resource-utilization',
      name: 'Resource Utilization',
      description: 'Penggunaan resource dan manpower',
      icon: BarChart3,
      color: '#BF5AF2',
      endpoint: '/api/reports/project/resource-utilization'
    },
    {
      id: 'executive-summary',
      name: 'Executive Summary',
      description: 'Ringkasan eksekutif untuk management',
      icon: FileText,
      color: '#FF453A',
      endpoint: '/api/reports/executive/summary'
    }
  ];

  const selectedReport = reportTypes.find(r => r.id === selectedReportType);

  // Handle generate report
  const handleGenerateReport = async () => {
    if (!selectedReportType) {
      setError('Pilih jenis report terlebih dahulu');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const report = reportTypes.find(r => r.id === selectedReportType);
      
      // Build query parameters
      const params = new URLSearchParams({
        project_id: projectId
      });

      if (dateRange.startDate) {
        params.append('start_date', dateRange.startDate);
      }
      if (dateRange.endDate) {
        params.append('end_date', dateRange.endDate);
      }

      const response = await fetch(`${report.endpoint}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      setGeneratedReport(data);
      
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Gagal generate report. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle download report
  const handleDownloadReport = () => {
    if (!generatedReport) return;

    // Download as JSON format
    // Note: For PDF export, use browser Print > Save as PDF
    const dataStr = JSON.stringify(generatedReport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedReportType}-${projectId}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border border-[#38383A] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <BarChart3 size={24} className="text-[#0A84FF]" />
              Generate Report
            </h2>
            <p className="text-sm text-[#8E8E93] mt-1">
              {project?.name || `Project ${projectId}`}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#38383A] rounded-lg transition-colors"
              title="Tutup"
            >
              <X size={20} className="text-[#8E8E93]" />
            </button>
          )}
        </div>

        {!generatedReport ? (
          <>
            {/* Report Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-3">
                Pilih Jenis Report
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  const isSelected = selectedReportType === report.id;
                  
                  return (
                    <button
                      key={report.id}
                      onClick={() => setSelectedReportType(report.id)}
                      className={`
                        relative p-4 rounded-xl border-2 text-left transition-all
                        ${isSelected 
                          ? 'border-[#0A84FF] bg-[#0A84FF]/10' 
                          : 'border-[#38383A] bg-[#2C2C2E] hover:border-[#48484A]'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="p-2 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: `${report.color}20` }}
                        >
                          <Icon 
                            size={20} 
                            style={{ color: report.color }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white text-sm mb-1">
                            {report.name}
                          </h3>
                          <p className="text-xs text-[#8E8E93] leading-relaxed">
                            {report.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Selected indicator */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-[#0A84FF] rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-3">
                <CalendarIconWhite size={16} className="inline mr-2" />
                Periode (Opsional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#8E8E93] mb-2">
                    Tanggal Mulai
                  </label>
                  <DateInputWithIcon
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({
                      ...prev,
                      startDate: e.target.value
                    }))}
                    className="w-full pr-4 py-2.5 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8E8E93] mb-2">
                    Tanggal Selesai
                  </label>
                  <DateInputWithIcon
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({
                      ...prev,
                      endDate: e.target.value
                    }))}
                    className="w-full pr-4 py-2.5 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-lg">
                <p className="text-sm text-[#FF453A]">{error}</p>
              </div>
            )}

            {/* Selected Report Info */}
            {selectedReport && (
              <div className="mb-6 p-4 bg-[#0A84FF]/10 border border-[#0A84FF]/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: selectedReport.color }}
                  />
                  <p className="text-sm font-medium text-white">
                    Akan generate: {selectedReport.name}
                  </p>
                </div>
                <p className="text-xs text-[#8E8E93]">
                  Report akan berisi {selectedReport.description.toLowerCase()}
                  {dateRange.startDate && ` untuk periode ${dateRange.startDate}`}
                  {dateRange.endDate && ` sampai ${dateRange.endDate}`}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {onClose && (
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-[#2C2C2E] hover:bg-[#38383A] text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Batal
                </button>
              )}
              <button
                onClick={handleGenerateReport}
                disabled={!selectedReportType || isGenerating}
                className="flex-1 px-4 py-2.5 bg-[#0A84FF] hover:bg-[#0A84FF]/90 disabled:bg-[#38383A] disabled:text-[#8E8E93] text-white rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <BarChart3 size={16} />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* Report Preview - Visual Display */
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {selectedReport?.name}
                  </h3>
                  <p className="text-sm text-[#8E8E93] mt-1">
                    Generated on {new Date().toLocaleString('id-ID')}
                  </p>
                </div>
                <button
                  onClick={() => setGeneratedReport(null)}
                  className="px-4 py-2 text-sm text-[#0A84FF] hover:bg-[#0A84FF]/10 rounded-lg transition-colors"
                >
                  Generate Ulang
                </button>
              </div>

              {/* Report Summary Cards */}
              {generatedReport?.data?.summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Total Project Costs */}
                  <div className="bg-gradient-to-br from-[#0A84FF]/20 to-[#0A84FF]/5 border border-[#0A84FF]/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-[#8E8E93] font-medium">Total Biaya Proyek</p>
                      <DollarSign size={16} className="text-[#0A84FF]" />
                    </div>
                    <p className="text-2xl font-bold text-white">
                      Rp {generatedReport.data.summary.totalProjectCosts?.toLocaleString('id-ID') || '0'}
                    </p>
                  </div>

                  {/* Cost Categories */}
                  <div className="bg-gradient-to-br from-[#30D158]/20 to-[#30D158]/5 border border-[#30D158]/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-[#8E8E93] font-medium">Kategori Biaya</p>
                      <PieChart size={16} className="text-[#30D158]" />
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {generatedReport.data.summary.costCategories || 0}
                    </p>
                    <p className="text-xs text-[#8E8E93] mt-1">Kategori aktif</p>
                  </div>

                  {/* Average Monthly Cost */}
                  <div className="bg-gradient-to-br from-[#FFD60A]/20 to-[#FFD60A]/5 border border-[#FFD60A]/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-[#8E8E93] font-medium">Rata-rata per Bulan</p>
                      <TrendingUp size={16} className="text-[#FFD60A]" />
                    </div>
                    <p className="text-2xl font-bold text-white">
                      Rp {generatedReport.data.summary.averageMonthlyCost?.toLocaleString('id-ID') || '0'}
                    </p>
                  </div>
                </div>
              )}

              {/* Period Info */}
              {generatedReport?.data?.period && (
                <div className="bg-[#2C2C2E] border border-[#38383A] rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarIconWhite size={16} className="text-[#0A84FF]" />
                    <h4 className="text-sm font-semibold text-white">Periode Report</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[#8E8E93] mb-1">Tanggal Mulai</p>
                      <p className="text-white font-medium">
                        {new Date(generatedReport.data.period.startDate).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#8E8E93] mb-1">Tanggal Selesai</p>
                      <p className="text-white font-medium">
                        {new Date(generatedReport.data.period.endDate).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cost Breakdown */}
              {generatedReport?.data?.costBreakdown && generatedReport.data.costBreakdown.length > 0 ? (
                <div className="bg-[#2C2C2E] border border-[#38383A] rounded-xl p-5 mb-6">
                  <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 size={16} className="text-[#0A84FF]" />
                    Breakdown Biaya per Kategori
                  </h4>
                  <div className="space-y-3">
                    {generatedReport.data.costBreakdown.map((category, index) => (
                      <div key={index} className="p-3 bg-[#1C1C1E] rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-white">{category.categoryName}</p>
                          <p className="text-sm font-bold text-[#0A84FF]">
                            Rp {category.totalAmount?.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-[#38383A] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#0A84FF] rounded-full transition-all"
                              style={{ width: `${category.percentage || 0}%` }}
                            />
                          </div>
                          <p className="text-xs text-[#8E8E93] font-medium w-12 text-right">
                            {category.percentage?.toFixed(1) || 0}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-[#2C2C2E] border border-[#38383A] rounded-xl p-8 mb-6 text-center">
                  <PieChart size={48} className="text-[#636366] mx-auto mb-3" />
                  <p className="text-white font-medium mb-1">Belum Ada Data Biaya</p>
                  <p className="text-sm text-[#8E8E93]">
                    Project ini belum memiliki transaksi biaya yang tercatat
                  </p>
                </div>
              )}

              {/* Monthly Trends */}
              {generatedReport?.data?.monthlyTrends && Array.isArray(generatedReport.data.monthlyTrends) && generatedReport.data.monthlyTrends.length > 0 && (
                <div className="bg-[#2C2C2E] border border-[#38383A] rounded-xl p-5 mb-6">
                  <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-[#30D158]" />
                    Tren Biaya Bulanan
                  </h4>
                  <div className="space-y-2">
                    {generatedReport.data.monthlyTrends.map((trend) => (
                      <div key={trend.month} className="flex items-center justify-between p-2 hover:bg-[#1C1C1E] rounded-lg transition-colors">
                        <p className="text-sm text-[#8E8E93]">{trend.monthName || trend.month}</p>
                        <p className="text-sm font-medium text-white">
                          Rp {trend.amount?.toLocaleString('id-ID') || '0'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Info Footer */}
              <div className="bg-[#1C1C1E] border border-[#38383A] rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FileText size={16} className="text-[#0A84FF] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white mb-1">
                      Report Generated Successfully
                    </p>
                    <p className="text-xs text-[#8E8E93] leading-relaxed">
                      Data di atas adalah hasil analisis real-time dari database untuk project{' '}
                      <span className="text-white font-mono">{generatedReport?.data?.projectId}</span>.
                      {generatedReport?.data?.costBreakdown?.length === 0 && 
                        ' Project ini belum memiliki transaksi biaya yang tercatat.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setGeneratedReport(null)}
                className="flex-1 px-4 py-2.5 bg-[#2C2C2E] hover:bg-[#38383A] text-white rounded-lg transition-colors text-sm font-medium"
              >
                Generate Ulang
              </button>
              <button
                onClick={handleDownloadReport}
                className="flex-1 px-4 py-2.5 bg-[#30D158] hover:bg-[#30D158]/90 text-white rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Download Data (JSON)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportGenerator;
