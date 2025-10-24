import React from 'react';
import { Receipt, Building2, Activity, Download } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import InlineIncomeStatement from '../../../components/InlineIncomeStatement';
import InlineBalanceSheet from '../../../components/InlineBalanceSheet';
import InlineCashFlowStatement from '../../../components/InlineCashFlowStatement';

/**
 * FinancialReportsView Component
 * 
 * Displays PSAK-compliant financial reports
 * Includes Income Statement, Balance Sheet, and Cash Flow Statement
 * 
 * @param {Object} props
 * @param {Object} props.reports - Financial reports data
 * @param {boolean} props.loading - Loading state
 * @param {string} props.activeDetailedReport - Currently active detailed report
 * @param {Function} props.onToggleDetailedReport - Handler to toggle detailed report
 * @param {Function} props.onExport - Handler for export action
 */
const FinancialReportsView = ({
  reports = {},
  loading = false,
  activeDetailedReport = null,
  onToggleDetailedReport,
  onExport
}) => {
  const { incomeStatement = {}, balanceSheet = {}, cashFlow = {}, summary = {} } = reports;

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg shadow-lg p-6" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
            <div className="animate-pulse">
              <div className="h-4 rounded w-3/4 mb-4" style={{ backgroundColor: '#38383A' }}></div>
              <div className="space-y-2">
                <div className="h-3 rounded" style={{ backgroundColor: '#38383A' }}></div>
                <div className="h-3 rounded w-5/6" style={{ backgroundColor: '#38383A' }}></div>
                <div className="h-3 rounded w-4/6" style={{ backgroundColor: '#38383A' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income Statement Card */}
        <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium" style={{ color: '#FFFFFF' }}>Laporan Laba Rugi</h3>
            <Receipt className="w-5 h-5" style={{ color: '#636366' }} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pendapatan</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(incomeStatement?.revenue || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Biaya Langsung</span>
              <span className="font-semibold text-red-600">
                ({formatCurrency(incomeStatement?.directCosts || 0)})
              </span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-sm text-gray-600">Laba Kotor</span>
              <span className="font-semibold text-blue-600">
                {formatCurrency(incomeStatement?.grossProfit || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: "#98989D" }}>Biaya Tidak Langsung</span>
              <span className="font-semibold" style={{ color: "#FF453A" }}>
                ({formatCurrency(incomeStatement?.indirectCosts || 0)})
              </span>
            </div>
            <div className="flex justify-between pt-3 font-bold" style={{ borderTop: "1px solid #38383A" }}>
              <span style={{ color: "#FFFFFF" }}>Laba Bersih</span>
              <span style={{ color: (incomeStatement?.netIncome || 0) >= 0 ? '#30D158' : '#FF453A' }}>
                {formatCurrency(incomeStatement?.netIncome || 0)}
              </span>
            </div>
          </div>
          <button 
            onClick={() => onToggleDetailedReport('income')}
            className="mt-4 w-full py-2 rounded-lg transition-colors text-sm font-medium"
            style={{
              background: activeDetailedReport === 'income' 
                ? 'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)'
                : 'rgba(10, 132, 255, 0.15)',
              color: activeDetailedReport === 'income' ? '#FFFFFF' : '#0A84FF',
              border: activeDetailedReport === 'income' ? 'none' : '1px solid rgba(10, 132, 255, 0.3)'
            }}
          >
            {activeDetailedReport === 'income' ? 'Sembunyikan Laporan Rinci' : 'Lihat Laporan Rinci'}
          </button>
        </div>

        {/* Balance Sheet Card */}
        <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium" style={{ color: "#FFFFFF" }}>Neraca</h3>
            <Building2 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Aset</span>
              <span className="font-semibold text-blue-600">
                {formatCurrency(balanceSheet?.totalAssets || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: "#98989D" }}>Aset Lancar</span>
              <span className="font-medium" style={{ color: "#FFFFFF" }}>
                {formatCurrency(balanceSheet?.currentAssets || 0)}
              </span>
            </div>
            <div className="flex justify-between pt-3" style={{ borderTop: "1px solid #38383A" }}>
              <span className="text-sm" style={{ color: "#98989D" }}>Total Kewajiban</span>
              <span className="font-semibold" style={{ color: "#FF453A" }}>
                {formatCurrency(balanceSheet?.totalLiabilities || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: "#98989D" }}>Kewajiban Lancar</span>
              <span className="font-medium" style={{ color: "#FFFFFF" }}>
                {formatCurrency(balanceSheet?.currentLiabilities || 0)}
              </span>
            </div>
            <div className="flex justify-between pt-3 font-bold" style={{ borderTop: "1px solid #38383A" }}>
              <span style={{ color: "#FFFFFF" }}>Ekuitas</span>
              <span style={{ color: "#30D158" }}>
                {formatCurrency(balanceSheet?.equity || 0)}
              </span>
            </div>
          </div>
          <button 
            onClick={() => onToggleDetailedReport('balance')}
            className="mt-4 w-full py-2 rounded-lg transition-colors text-sm font-medium"
            style={{
              background: activeDetailedReport === 'balance' 
                ? 'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)'
                : 'rgba(10, 132, 255, 0.15)',
              color: activeDetailedReport === 'balance' ? '#FFFFFF' : '#0A84FF',
              border: activeDetailedReport === 'balance' ? 'none' : '1px solid rgba(10, 132, 255, 0.3)'
            }}
          >
            {activeDetailedReport === 'balance' ? 'Sembunyikan Laporan Rinci' : 'Lihat Laporan Rinci'}
          </button>
        </div>

        {/* Cash Flow Card */}
        <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium" style={{ color: "#FFFFFF" }}>Laporan Arus Kas</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Arus Kas Operasi</span>
              <span className={`font-semibold ${(cashFlow?.operating || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(cashFlow?.operating || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Arus Kas Investasi</span>
              <span className={`font-semibold ${(cashFlow?.investing || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(cashFlow?.investing || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: "#98989D" }}>Arus Kas Pendanaan</span>
              <span className="font-semibold" style={{ color: (cashFlow?.financing || 0) >= 0 ? '#30D158' : '#FF453A' }}>
                {formatCurrency(cashFlow?.financing || 0)}
              </span>
            </div>
            <div className="flex justify-between pt-3 font-bold" style={{ borderTop: "1px solid #38383A" }}>
              <span style={{ color: "#FFFFFF" }}>Arus Kas Bersih</span>
              <span style={{ color: (cashFlow?.netCashFlow || 0) >= 0 ? '#30D158' : '#FF453A' }}>
                {formatCurrency(cashFlow?.netCashFlow || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: "#98989D" }}>Saldo Kas</span>
              <span className="font-semibold" style={{ color: "#0A84FF" }}>
                {formatCurrency(cashFlow?.endingBalance || 0)}
              </span>
            </div>
          </div>
          <button 
            onClick={() => onToggleDetailedReport('cashflow')}
            className="mt-4 w-full py-2 rounded-lg transition-colors text-sm font-medium"
            style={{
              background: activeDetailedReport === 'cashflow' 
                ? 'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)'
                : 'rgba(10, 132, 255, 0.15)',
              color: activeDetailedReport === 'cashflow' ? '#FFFFFF' : '#0A84FF',
              border: activeDetailedReport === 'cashflow' ? 'none' : '1px solid rgba(10, 132, 255, 0.3)'
            }}
          >
            {activeDetailedReport === 'cashflow' ? 'Sembunyikan Laporan Rinci' : 'Lihat Laporan Rinci'}
          </button>
        </div>
      </div>

      {/* Detailed Reports */}
      {activeDetailedReport === 'income' && (
        <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold" style={{ color: "#FFFFFF" }}>Laporan Laba Rugi (Rinci)</h3>
            {onExport && (
              <button
                onClick={() => onExport('income')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Ekspor</span>
              </button>
            )}
          </div>
          <InlineIncomeStatement data={reports} />
        </div>
      )}

      {activeDetailedReport === 'balance' && (
        <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold" style={{ color: "#FFFFFF" }}>Neraca (Rinci)</h3>
            {onExport && (
              <button
                onClick={() => onExport('balance')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Ekspor</span>
              </button>
            )}
          </div>
          <InlineBalanceSheet data={reports} />
        </div>
      )}

      {activeDetailedReport === 'cashflow' && (
        <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold" style={{ color: "#FFFFFF" }}>Laporan Arus Kas (Rinci)</h3>
            {onExport && (
              <button
                onClick={() => onExport('cashflow')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Ekspor</span>
              </button>
            )}
          </div>
          <InlineCashFlowStatement data={cashFlow} />
        </div>
      )}

      {/* Summary Information */}
      {summary && Object.keys(summary).length > 0 && (
        <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#FFFFFF" }}>Ringkasan Keuangan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg p-4" style={{ background: "linear-gradient(135deg, rgba(10, 132, 255, 0.2) 0%, rgba(10, 132, 255, 0.1) 100%)", border: "1px solid rgba(10, 132, 255, 0.3)" }}>
              <p className="text-sm font-medium mb-1" style={{ color: "#0A84FF" }}>Total Pendapatan</p>
              <p className="text-2xl font-bold" style={{ color: "#0A84FF" }}>
                {formatCurrency(summary.totalIncome || 0)}
              </p>
            </div>
            <div className="rounded-lg p-4" style={{ background: "linear-gradient(135deg, rgba(255, 69, 58, 0.2) 0%, rgba(255, 69, 58, 0.1) 100%)", border: "1px solid rgba(255, 69, 58, 0.3)" }}>
              <p className="text-sm font-medium mb-1" style={{ color: "#FF453A" }}>Total Pengeluaran</p>
              <p className="text-2xl font-bold" style={{ color: "#FF453A" }}>
                {formatCurrency(summary.totalExpense || 0)}
              </p>
            </div>
            <div className="rounded-lg p-4" style={{ background: "linear-gradient(135deg, rgba(48, 209, 88, 0.2) 0%, rgba(48, 209, 88, 0.1) 100%)", border: "1px solid rgba(48, 209, 88, 0.3)" }}>
              <p className="text-sm font-medium mb-1" style={{ color: "#30D158" }}>Saldo Bersih</p>
              <p className="text-2xl font-bold" style={{ color: "#30D158" }}>
                {formatCurrency(summary.balance || 0)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialReportsView;
