import React from 'react';

/**
 * NavItem Component
 * Single navigation button (no dropdown)
 * 
 * @param {object} item - Navigation item config
 * @param {boolean} isActive - Whether this item is currently active
 * @param {function} onClick - Click handler
 */
export const NavItem = ({ item, isActive, onClick }) => {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center space-x-2 px-4 h-10 rounded-lg
        font-medium text-sm
        transition-all duration-200
        ${isActive 
          ? 'bg-[#0A84FF] text-white shadow-lg shadow-[#0A84FF]/20' 
          : 'text-[#8E8E93] hover:bg-[#3A3A3C] hover:text-white'
        }
      `}
      title={item.description}
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon size={18} />
      <span>{item.label}</span>
    </button>
  );
};

export default NavItem;
