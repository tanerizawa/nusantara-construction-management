import React from 'react';
import { DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils';

/**
 * Financial Summary Component
 * Displays budget breakdown and financial metrics
 */
const FinancialSummary = ({ project, workflowData }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-green-600" />
          Ringkasan Keuangan
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Total Budget</span>
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(project.totalBudget)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">RAB Approved</span>
            <span className="text-base font-semibold text-blue-700">
              {formatCurrency(workflowData.budgetSummary?.approvedAmount || 0)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">PO Committed</span>
            <span className="text-base font-semibold text-yellow-700">
              {formatCurrency(workflowData.budgetSummary?.committedAmount || 0)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Actual Spent</span>
            <span className="text-base font-semibold text-green-700">
              {formatCurrency(workflowData.budgetSummary?.actualSpent || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
