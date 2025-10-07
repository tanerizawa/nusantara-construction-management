import React from 'react';
import { BarChart3, Calculator, Clock, ShoppingCart, Users } from 'lucide-react';

/**
 * Quick Stats Component
 * Displays quick project statistics
 */
const QuickStats = ({ project, workflowData }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
          Statistik Cepat
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calculator className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">RAB Items</span>
            </div>
            <span className="text-lg font-bold text-gray-900">
              {project.rabItems?.length || 0}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Pending Approvals</span>
            </div>
            <span className="text-lg font-bold text-yellow-600">
              {workflowData.approvalStatus?.pending || 0}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingCart className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Active POs</span>
            </div>
            <span className="text-lg font-bold text-green-600">
              {workflowData.purchaseOrders?.filter(po => po.status === 'active').length || 0}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Team Members</span>
            </div>
            <span className="text-lg font-bold text-purple-600">
              {project.teamMembers?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
