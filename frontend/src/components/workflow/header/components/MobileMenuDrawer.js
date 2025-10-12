import React from 'react';
import { ChevronRight, X } from 'lucide-react';

/**
 * MobileMenuDrawer Component
 * Full-screen drawer menu for mobile devices
 * 
 * @param {boolean} isOpen - Whether drawer is open
 * @param {array} items - Array of navigation items
 * @param {string} activeTab - Currently active tab
 * @param {string} expandedCategory - Currently expanded category ID
 * @param {function} onItemClick - Item click handler
 * @param {function} onClose - Close handler
 * @param {function} onToggleCategory - Category toggle handler
 * @param {function} isCategoryExpanded - Check if category is expanded
 */
export const MobileMenuDrawer = ({
  isOpen,
  items,
  activeTab,
  expandedCategory,
  onItemClick,
  onClose,
  onToggleCategory,
  isCategoryExpanded
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-[#2C2C2E] border-r border-[#38383A] z-50 overflow-y-auto lg:hidden animate-slideRight">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#38383A] sticky top-0 bg-[#2C2C2E] z-10">
          <h2 className="text-white font-semibold text-lg">Navigation</h2>
          <button
            onClick={onClose}
            className="p-2 text-[#8E8E93] hover:text-white hover:bg-[#3A3A3C] rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {items.map(item => {
            const Icon = item.icon;
            const isItemActive = item.type === 'single' 
              ? activeTab === item.path 
              : item.items.some(sub => sub.path === activeTab);

            // Single Item
            if (item.type === 'single') {
              return (
                <button
                  key={item.id}
                  onClick={() => onItemClick(item.path)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 text-left
                    transition-colors
                    ${isItemActive 
                      ? 'bg-[#0A84FF] text-white' 
                      : 'text-[#8E8E93] hover:bg-[#3A3A3C] hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            }

            // Dropdown Item
            if (item.type === 'dropdown') {
              const isDropdownOpen = isCategoryExpanded(item.id);

              return (
                <div key={item.id}>
                  {/* Dropdown Header */}
                  <button
                    onClick={() => onToggleCategory(item.id)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3
                      transition-colors
                      ${isItemActive 
                        ? 'bg-[#0A84FF]/10 text-[#0A84FF]' 
                        : 'text-[#8E8E93] hover:bg-[#3A3A3C] hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-90' : ''}`}
                    />
                  </button>

                  {/* Dropdown Items */}
                  {isDropdownOpen && (
                    <div className="bg-[#1C1C1E]">
                      {item.items.map(subItem => {
                        const SubIcon = subItem.icon;
                        const isSubActive = activeTab === subItem.path;

                        return (
                          <button
                            key={subItem.id}
                            onClick={() => onItemClick(subItem.path)}
                            className={`
                              w-full flex items-start space-x-3 pl-12 pr-4 py-3 text-left
                              transition-colors
                              ${isSubActive 
                                ? 'bg-[#0A84FF] text-white' 
                                : 'text-[#8E8E93] hover:bg-[#3A3A3C] hover:text-white'
                              }
                            `}
                          >
                            <SubIcon size={18} className="mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-medium text-sm">
                                  {subItem.label}
                                </span>
                                {subItem.badge && (
                                  <span className="flex-shrink-0 px-2 py-0.5 bg-[#FF3B30] text-white text-xs font-semibold rounded-full">
                                    3
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#8E8E93] mt-0.5 line-clamp-2">
                                {subItem.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </>
  );
};

export default MobileMenuDrawer;
