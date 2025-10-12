import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  TrendingUp, 
  PieChart, 
  BarChart3,
  DollarSign,
  Calendar,
  Download,
  Eye,
  Loader2
} from 'lucide-react';

/**
 * ReportGeneratorModal - Modal untuk generate berbagai jenis report
 * Menggunakan backend APIs yang sudah ada
 */
const ReportGeneratorModal = ({ 
  isOpen, 
  onClose, 
  projectId, 
  project 
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

  // Handle download report (future: export to PDF/Excel)
  const handleDownloadReport = () => {
    if (!generatedReport) return;

    // For now, download as JSON
    // TODO: Implement PDF/Excel export
    const dataStr = JSON.stringify(generatedReport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedReportType}-${projectId}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Reset form
  const handleClose = () => {
    setSelectedReportType('');
    setDateRange({ startDate: '', endDate: '' });
    setGeneratedReport(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border border-[#38383A] rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[#38383A] bg-[#1C1C1E]/95 backdrop-blur">
          <div>
            <h2 className="text-xl font-semibold text-white">Generate Report</h2>
            <p className="text-sm text-[#8E8E93] mt-1">
              {project?.name || `Project ${projectId}`}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-[#38383A] rounded-lg transition-colors"
          >
            <X size={20} className="text-[#8E8E93]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!generatedReport ? (
            <>
              {/* Report Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-3">
                  Pilih Jenis Report
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                            className="p-2 rounded-lg"
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

              {/* Date Range (Optional) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-3">
                  <Calendar size={16} className="inline mr-2" />
                  Periode (Opsional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#8E8E93] mb-2">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange(prev => ({
                        ...prev,
                        startDate: e.target.value
                      }))}
                      className="w-full px-4 py-2.5 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#8E8E93] mb-2">
                      Tanggal Selesai
                    </label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({
                        ...prev,
                        endDate: e.target.value
                      }))}
                      className="w-full px-4 py-2.5 bg-[#2C2C2E] border border-[#38383A] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all"
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
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2.5 bg-[#2C2C2E] hover:bg-[#38383A] text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Batal
                </button>
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
            /* Report Preview */
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
                    className="text-sm text-[#0A84FF] hover:text-[#0A84FF]/80 transition-colors"
                  >
                    Generate Ulang
                  </button>
                </div>

                {/* Report Data Display */}
                <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-6 max-h-[400px] overflow-y-auto">
                  <pre className="text-xs text-white whitespace-pre-wrap break-words">
                    {JSON.stringify(generatedReport, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2.5 bg-[#2C2C2E] hover:bg-[#38383A] text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Tutup
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="flex-1 px-4 py-2.5 bg-[#30D158] hover:bg-[#30D158]/90 text-white rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Download Report
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportGeneratorModal;
