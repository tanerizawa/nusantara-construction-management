import React, { useState } from 'react';
import { Download, BookOpen, Wand2, Zap } from 'lucide-react';
import ChartOfAccounts from '../../../components/ChartOfAccounts';
import AccountWizard from '../../../components/ChartOfAccounts/components/AccountWizard';
import QuickTemplates from '../../../components/ChartOfAccounts/components/QuickTemplates';
import { convertCOAToCSV } from '../utils/formatters';

/**
 * ChartOfAccountsView Component
 * 
 * Display and manage Chart of Accounts (COA)
 * Supports CSV export and account hierarchy
 * 
 * @param {Object} props
 * @param {string} props.selectedSubsidiary - Currently selected subsidiary ID
 */
const ChartOfAccountsView = ({
  selectedSubsidiary
}) => {
  const [showWizard, setShowWizard] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  /**
   * Handle COA export to CSV
   */
  const handleExportCOA = async () => {
    try {
      // This would typically fetch COA data from API
      // For now, we'll use the existing ChartOfAccounts component data
      const csvData = convertCOAToCSV([]);
      
      // Create download link
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bagan-akun-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting COA:', error);
      alert('Gagal mengekspor Bagan Akun');
    }
  };

  /**
   * Handle wizard complete
   */
  const handleWizardComplete = (account) => {
    console.log('Account created:', account);
    setShowWizard(false);
    setRefreshKey(prev => prev + 1); // Trigger refresh
  };

  /**
   * Handle templates complete
   */
  const handleTemplatesComplete = (result) => {
    console.log('Template applied:', result);
    setShowTemplates(false);
    setRefreshKey(prev => prev + 1); // Trigger refresh
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold flex items-center" style={{ color: "#FFFFFF" }}>
          <BookOpen className="w-7 h-7 mr-3" style={{ color: "#0A84FF" }} />
          Bagan Akun (Sesuai PSAK)
        </h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
            style={{ background: "linear-gradient(135deg, #30D158 0%, #28A745 100%)", color: "#FFFFFF" }}
          >
            <Zap className="w-4 h-4" />
            <span>Template Cepat</span>
          </button>
          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
            style={{ background: "linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)", color: "#FFFFFF" }}
          >
            <Wand2 className="w-4 h-4" />
            <span>Buat Akun Baru</span>
          </button>
          <button
            onClick={handleExportCOA}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: "#2C2C2E", color: "#FFFFFF" }}
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Chart of Accounts Component */}
      <div className="rounded-lg shadow-lg" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
        <ChartOfAccounts 
          key={refreshKey}
          subsidiaryId={selectedSubsidiary !== 'all' ? selectedSubsidiary : null}
        />
      </div>

      {/* Modals */}
      {showWizard && (
        <AccountWizard
          onComplete={handleWizardComplete}
          onCancel={() => setShowWizard(false)}
          subsidiaryId={selectedSubsidiary !== 'all' ? selectedSubsidiary : null}
        />
      )}

      {showTemplates && (
        <QuickTemplates
          onComplete={handleTemplatesComplete}
          onCancel={() => setShowTemplates(false)}
          subsidiaryId={selectedSubsidiary !== 'all' ? selectedSubsidiary : null}
        />
      )}

      {/* Info Panel */}
      <div className="rounded-lg p-4" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
        <h3 className="text-sm font-medium mb-2" style={{ color: "#FFFFFF" }}>
          Tentang Bagan Akun
        </h3>
        <p className="text-sm mb-2" style={{ color: "#98989D" }}>
          Bagan Akun (COA) disusun sesuai ketentuan PSAK (Standar Akuntansi Keuangan),
          untuk memastikan kepatuhan terhadap regulasi lokal.
        </p>
        <ul className="text-sm list-disc list-inside space-y-1" style={{ color: "#98989D" }}>
          <li>Akun Aset (1000-1999)</li>
          <li>Akun Liabilitas (2000-2999)</li>
          <li>Akun Ekuitas (3000-3999)</li>
          <li>Akun Pendapatan (4000-4999)</li>
          <li>Akun Beban (5000-9999)</li>
        </ul>
      </div>
    </div>
  );
};

export default ChartOfAccountsView;
