import React from 'react';
import { BarChart3, Calculator, Clock, ShoppingCart } from 'lucide-react';

/**
 * Quick Stats Component
 * Displays quick project statistics
 */
const QuickStats = ({ project, workflowData }) => {
  return (
    <div className="bg-[#2C2C2E] rounded-lg  border border-[#38383A] overflow-hidden">
      <div className="px-4 py-3 bg-[#1C1C1E] border-b border-[#38383A]">
        <h3 className="text-base font-semibold text-white flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-[#BF5AF2]" />
          Statistik Cepat
        </h3>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 hover:bg-[#1C1C1E] rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#0A84FF]/20 rounded-lg">
                <Calculator className="h-4 w-4 text-[#0A84FF]" />
              </div>
              <span className="text-sm font-medium text-[#98989D]">RAB Items</span>
            </div>
            <span className="text-base font-bold text-white">
              {project.rabItems?.length || 0}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 hover:bg-[#1C1C1E] rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#FF9F0A]/20 rounded-lg">
                <Clock className="h-4 w-4 text-[#FF9F0A]" />
              </div>
              <span className="text-sm font-medium text-[#98989D]">Pending Approvals</span>
            </div>
            <span className="text-base font-bold text-[#FF9F0A]">
              {workflowData.approvalStatus?.pending || 0}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 hover:bg-[#1C1C1E] rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#30D158]/20 rounded-lg">
                <ShoppingCart className="h-4 w-4 text-[#30D158]" />
              </div>
              <span className="text-sm font-medium text-[#98989D]">Active POs</span>
            </div>
            <span className="text-base font-bold text-[#30D158]">
              {workflowData.purchaseOrders?.filter(po => po.status === 'active').length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
