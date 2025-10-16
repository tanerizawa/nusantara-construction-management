import React from 'react';
import { Building, ShoppingCart, BarChart3, Package } from 'lucide-react';

/**
 * Quick actions component
 * @returns {JSX.Element} Quick actions UI
 */
const QuickActions = () => {
  const actions = [
    { icon: Building, text: 'Buat Proyek Baru', color: '[#0A84FF]' },
    { icon: ShoppingCart, text: 'Buat Purchase Order', color: '[#30D158]' },
    { icon: BarChart3, text: 'Lihat Laporan', color: '[#64D2FF]' },
    { icon: Package, text: 'Kelola Inventory', color: '[#FF9F0A]' }
  ];
  
  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] p-6 rounded-xl hover:border-[#48484A] transition-colors">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button 
            key={index}
            className="w-full flex items-center justify-between p-3 text-left border border-[#38383A] rounded-lg hover:bg-[#3A3A3C] hover:border-[#48484A] transition-colors duration-150"
          >
            <div className="flex items-center">
              <action.icon className={`h-5 w-5 text-${action.color} mr-3`} />
              <span className="font-medium text-white">{action.text}</span>
            </div>
            <div className="text-[#98989D]">→</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;