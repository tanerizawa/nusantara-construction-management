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
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
          <BookOpen className="w-7 h-7 mr-3 text-blue-600" />
          Chart of Accounts (PSAK Compliant)
        </h2>
        <button
          onClick={handleExportCOA}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Chart of Accounts Component */}
      <div className="bg-white rounded-lg shadow">
        <ChartOfAccounts 
          subsidiaryId={selectedSubsidiary !== 'all' ? selectedSubsidiary : null}
        />
      </div>

      {/* Info Panel */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          About Chart of Accounts
        </h3>
        <p className="text-sm text-gray-700 mb-2">
          The Chart of Accounts (COA) is structured according to PSAK (Indonesian Financial 
          Accounting Standards) requirements, ensuring compliance with local regulations.
        </p>
        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
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
