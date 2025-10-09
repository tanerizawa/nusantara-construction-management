import React from 'react';

/**
 * Individual tab item dengan tooltip untuk collapsed mode
 */
export const TabItem = ({ tab, isActive, isCollapsed, onClick }) => {
  const IconComponent = tab.icon;

  return (
    <div className="relative group">
      <button
        onClick={() => onClick(tab.id)}
        className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-4' : 'px-4 py-3'} text-left hover:bg-[#3A3A3C] transition-colors border-l-3 ${
          isActive 
            ? 'bg-[#0A84FF]/10 text-[#0A84FF] border-[#0A84FF] font-medium' 
            : 'text-[#98989D] border-transparent hover:text-white'
        }`}
        title={isCollapsed ? `${tab.label} - ${tab.description}` : undefined}
      >
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'min-w-0 flex-1'}`}>
          <div className="flex-shrink-0">
            <IconComponent size={isCollapsed ? 20 : 18} />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1 ml-3">
              <div className={`text-sm font-medium truncate ${isActive ? 'text-white' : ''}`}>
                {tab.label}
              </div>
              <div className="text-xs text-[#636366] truncate">
                {tab.description}
              </div>
            </div>
          )}
        </div>
      </button>
      
      {/* Tooltip for collapsed mode */}
      {isCollapsed && (
        <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-[#2C2C2E] border border-[#38383A] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          <div className="font-medium">{tab.label}</div>
          <div className="text-xs text-[#98989D]">{tab.description}</div>
          <div className="absolute top-3 -left-1 w-2 h-2 bg-[#2C2C2E] border-l border-b border-[#38383A] transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};
