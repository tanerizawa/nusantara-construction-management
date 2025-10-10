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
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
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
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Income Statement</h3>
            <Receipt className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Revenue</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(incomeStatement?.revenue || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Direct Costs</span>
              <span className="font-semibold text-red-600">
                ({formatCurrency(incomeStatement?.directCosts || 0)})
              </span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-sm text-gray-600">Gross Profit</span>
              <span className="font-semibold text-blue-600">
                {formatCurrency(incomeStatement?.grossProfit || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Indirect Costs</span>
              <span className="font-semibold text-red-600">
                ({formatCurrency(incomeStatement?.indirectCosts || 0)})
              </span>
            </div>
            <div className="flex justify-between border-t pt-3 font-bold">
              <span className="text-gray-900">Net Income</span>
              <span className={`${(incomeStatement?.netIncome || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(incomeStatement?.netIncome || 0)}
              </span>
            </div>
          </div>
          <button 
            onClick={() => onToggleDetailedReport('income')}
            className={`mt-4 w-full py-2 rounded-lg transition-colors text-sm font-medium ${
              activeDetailedReport === 'income' 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            {activeDetailedReport === 'income' ? 'Hide Detailed Report' : 'View Detailed Report'}
          </button>
        </div>

        {/* Balance Sheet Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Balance Sheet</h3>
            <Building2 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Assets</span>
              <span className="font-semibold text-blue-600">
                {formatCurrency(balanceSheet?.totalAssets || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Current Assets</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(balanceSheet?.currentAssets || 0)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-sm text-gray-600">Total Liabilities</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(balanceSheet?.totalLiabilities || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Current Liabilities</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(balanceSheet?.currentLiabilities || 0)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-3 font-bold">
              <span className="text-gray-900">Equity</span>
              <span className="text-emerald-600">
                {formatCurrency(balanceSheet?.equity || 0)}
              </span>
            </div>
          </div>
          <button 
            onClick={() => onToggleDetailedReport('balance')}
            className={`mt-4 w-full py-2 rounded-lg transition-colors text-sm font-medium ${
              activeDetailedReport === 'balance' 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            {activeDetailedReport === 'balance' ? 'Hide Detailed Report' : 'View Detailed Report'}
          </button>
        </div>

        {/* Cash Flow Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Cash Flow Statement</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Operating Activities</span>
              <span className={`font-semibold ${(cashFlow?.operating || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(cashFlow?.operating || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Investing Activities</span>
              <span className={`font-semibold ${(cashFlow?.investing || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(cashFlow?.investing || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Financing Activities</span>
              <span className={`font-semibold ${(cashFlow?.financing || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(cashFlow?.financing || 0)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-3 font-bold">
              <span className="text-gray-900">Net Cash Flow</span>
              <span className={`${(cashFlow?.netCashFlow || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(cashFlow?.netCashFlow || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Cash Balance</span>
              <span className="font-semibold text-blue-600">
                {formatCurrency(cashFlow?.endingBalance || 0)}
              </span>
            </div>
          </div>
          <button 
            onClick={() => onToggleDetailedReport('cashflow')}
            className={`mt-4 w-full py-2 rounded-lg transition-colors text-sm font-medium ${
              activeDetailedReport === 'cashflow' 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            {activeDetailedReport === 'cashflow' ? 'Hide Detailed Report' : 'View Detailed Report'}
          </button>
        </div>
      </div>

      {/* Detailed Reports */}
      {activeDetailedReport === 'income' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Detailed Income Statement</h3>
            {onExport && (
              <button
                onClick={() => onExport('income')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            )}
          </div>
          <InlineIncomeStatement data={incomeStatement} />
        </div>
      )}

      {activeDetailedReport === 'balance' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Detailed Balance Sheet</h3>
            {onExport && (
              <button
                onClick={() => onExport('balance')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            )}
          </div>
          <InlineBalanceSheet data={balanceSheet} />
        </div>
      )}

      {activeDetailedReport === 'cashflow' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Detailed Cash Flow Statement</h3>
            {onExport && (
              <button
                onClick={() => onExport('cashflow')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            )}
          </div>
          <InlineCashFlowStatement data={cashFlow} />
        </div>
      )}

      {/* Summary Information */}
      {summary && Object.keys(summary).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-900 font-medium mb-1">Total Income</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(summary.totalIncome || 0)}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-900 font-medium mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(summary.totalExpense || 0)}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-900 font-medium mb-1">Net Balance</p>
              <p className="text-2xl font-bold text-green-600">
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
