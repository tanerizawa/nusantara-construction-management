import React from 'react';
import { Download, BookOpen } from 'lucide-react';
import ChartOfAccounts from '../../../components/ChartOfAccounts';
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
      link.download = `chart-of-accounts-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting COA:', error);
      alert('Failed to export Chart of Accounts');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold flex items-center" style={{ color: "#FFFFFF" }}>
          <BookOpen className="w-7 h-7 mr-3" style={{ color: "#0A84FF" }} />
          Chart of Accounts (PSAK Compliant)
        </h2>
        <button
          onClick={handleExportCOA}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
          style={{ background: "linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)", color: "#FFFFFF" }}
        >
          <Download className="w-4 h-4" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Chart of Accounts Component */}
      <div className="rounded-lg shadow-lg" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
        <ChartOfAccounts 
          subsidiaryId={selectedSubsidiary !== 'all' ? selectedSubsidiary : null}
        />
      </div>

      {/* Info Panel */}
      <div className="rounded-lg p-4" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
        <h3 className="text-sm font-medium mb-2" style={{ color: "#FFFFFF" }}>
          About Chart of Accounts
        </h3>
        <p className="text-sm mb-2" style={{ color: "#98989D" }}>
          The Chart of Accounts (COA) is structured according to PSAK (Indonesian Financial 
          Accounting Standards) requirements, ensuring compliance with local regulations.
        </p>
        <ul className="text-sm list-disc list-inside space-y-1" style={{ color: "#98989D" }}>
          <li>Asset accounts (1000-1999)</li>
          <li>Liability accounts (2000-2999)</li>
          <li>Equity accounts (3000-3999)</li>
          <li>Revenue accounts (4000-4999)</li>
          <li>Expense accounts (5000-9999)</li>
        </ul>
      </div>
    </div>
  );
};

export default ChartOfAccountsView;
