import React from 'react';
import { getUniqueCategories } from '../utils/rabCalculations';

/**
 * RABStatistics Component
 * Displays statistical overview of RAP
 */
const RABStatistics = ({ rabItems, approvalStatus }) => {
  const uniqueCategories = getUniqueCategories(rabItems);
  
  return (
    <div className="bg-[#2C2C2E] rounded-lg  p-4">
      <h3 className="text-lg font-medium text-white mb-4">Statistik RAP</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-[#0A84FF]/10 rounded-lg">
          <div className="text-lg font-bold text-[#0A84FF]">{rabItems.length}</div>
          <div className="text-sm text-[#8E8E93]">Total Item</div>
        </div>
        <div className="text-center p-3 bg-[#30D158]/10 rounded-lg">
          <div className="text-lg font-bold text-[#30D158]">
            {approvalStatus?.status === 'approved' ? 'Disetujui' : 'Draft'}
          </div>
          <div className="text-sm text-[#8E8E93]">Status RAP</div>
        </div>
        <div className="text-center p-3 bg-[#BF5AF2]/10 rounded-lg">
          <div className="text-lg font-bold text-[#BF5AF2]">
            {uniqueCategories}
          </div>
          <div className="text-sm text-[#8E8E93]">Kategori</div>
        </div>
      </div>
    </div>
  );
};

export default RABStatistics;
