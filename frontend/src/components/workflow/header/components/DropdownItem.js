import React from 'react';

/**
 * DropdownItem Component
 * Individual item inside a dropdown menu
 * 
 * @param {object} item - Dropdown item config
 * @param {boolean} isActive - Whether this item is currently active
 * @param {function} onClick - Click handler
 */
export const DropdownItem = ({ item, isActive, onClick }) => {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-start space-x-3 px-4 py-3
        transition-colors duration-150
        ${isActive 
          ? 'bg-[#0A84FF]/10 text-[#0A84FF]' 
          : 'text-white hover:bg-[#3A3A3C]'
        }
      `}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <Icon 
          size={20} 
          className={isActive ? 'text-[#0A84FF]' : 'text-[#8E8E93]'} 
        />
      </div>

      {/* Content */}
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sm">
            {item.label}
          </span>
          
          {/* Badge (if enabled) */}
          {item.badge && (
            <span className="flex-shrink-0 px-2 py-0.5 bg-[#FF3B30] text-white text-xs font-semibold rounded-full">
              3
            </span>
          )}
        </div>
        
        {/* Description */}
        <p className="text-xs text-[#8E8E93] mt-0.5 line-clamp-1">
          {item.description}
        </p>
      </div>
    </button>
  );
};

export default DropdownItem;
