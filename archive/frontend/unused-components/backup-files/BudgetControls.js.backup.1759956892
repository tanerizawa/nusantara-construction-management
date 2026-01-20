import React from 'react';
import { AlertTriangle, Calculator, BarChart3, Target } from 'lucide-react';

/**
 * Component untuk budget control actions
 */
const BudgetControls = () => {
  const controls = [
    {
      icon: AlertTriangle,
      label: 'Set Budget Alert',
      color: 'text-[#FF9F0A]'
    },
    {
      icon: Calculator,
      label: 'Budget Reallocation',
      color: 'text-[#0A84FF]'
    },
    {
      icon: BarChart3,
      label: 'Generate Report',
      color: 'text-[#30D158]'
    },
    {
      icon: Target,
      label: 'Set Milestone Budget',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="bg-[#2C2C2E] rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-white mb-4">Budget Control Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {controls.map((control, index) => {
          const Icon = control.icon;
          return (
            <button 
              key={index}
              className="flex items-center justify-center px-4 py-3 border border-[#38383A] rounded-lg hover:bg-[#1C1C1E] transition-colors"
            >
              <Icon className={`h-5 w-5 ${control.color} mr-2`} />
              <span>{control.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetControls;
