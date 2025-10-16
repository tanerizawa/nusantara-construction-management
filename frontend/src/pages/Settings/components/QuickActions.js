import React from 'react';
import { QUICK_ACTIONS } from '../utils';

/**
 * Quick actions component
 * @returns {JSX.Element} Quick actions UI
 */
const QuickActions = () => {
  return (
    <div className="rounded-xl p-6" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
      <h2 className="text-xl font-semibold mb-4" style={{ color: '#FFFFFF' }}>
        Aksi Cepat
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUICK_ACTIONS.map((action, index) => {
          const IconComponent = action.icon;
          
          return (
            <button
              key={index}
              disabled={action.disabled}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors text-sm font-medium"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #38383A',
                color: '#636366',
                cursor: 'not-allowed'
              }}
            >
              <IconComponent className="h-4 w-4" />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;