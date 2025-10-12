import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useDropdown } from '../hooks';
import { DropdownItem } from './DropdownItem';

/**
 * NavDropdown Component
 * Navigation button with dropdown menu
 * 
 * @param {object} item - Navigation item config with sub-items
 * @param {boolean} isActive - Whether any child is currently active
 * @param {string} activeTab - Currently active tab path
 * @param {function} onTabChange - Tab change handler
 */
export const NavDropdown = ({ item, isActive, activeTab, onTabChange }) => {
  const {
    isOpen,
    dropdownRef,
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
    closeDropdown
  } = useDropdown();

  const Icon = item.icon;

  const handleItemClick = (path) => {
    onTabChange(path);
    closeDropdown();
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dropdown Trigger Button */}
      <button
        onClick={handleClick}
        className={`
          flex items-center space-x-2 px-4 h-10 rounded-lg
          font-medium text-sm
          transition-all duration-200
          ${isActive 
            ? 'bg-[#0A84FF] text-white shadow-lg shadow-[#0A84FF]/20' 
            : 'text-[#8E8E93] hover:bg-[#3A3A3C] hover:text-white'
          }
        `}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={item.description}
      >
        <Icon size={18} />
        <span>{item.label}</span>
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-80 bg-[#2C2C2E] border border-[#38383A] rounded-lg shadow-xl z-50 overflow-hidden animate-slideDown"
          role="menu"
        >
          {/* Menu Items */}
          <div className="py-2">
            {item.items.map((subItem, index) => (
              <React.Fragment key={subItem.id}>
                {index > 0 && (
                  <div className="h-px bg-[#38383A] mx-2" />
                )}
                <DropdownItem
                  item={subItem}
                  isActive={activeTab === subItem.path}
                  onClick={() => handleItemClick(subItem.path)}
                />
              </React.Fragment>
            ))}
          </div>

          {/* Optional Footer - can be used for "View All" link */}
          {item.items.length > 4 && (
            <>
              <div className="h-px bg-[#38383A]" />
              <div className="p-2">
                <button className="w-full text-center text-sm text-[#0A84FF] hover:text-[#0A84FF]/80 py-2 transition-colors">
                  View All {item.label} →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NavDropdown;
