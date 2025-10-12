import React from 'react';
import { Menu, X } from 'lucide-react';
import { useMobileMenu } from '../hooks';
import { MobileMenuDrawer } from './MobileMenuDrawer';

/**
 * MobileMenu Component
 * Hamburger button and drawer for mobile navigation
 * 
 * @param {array} items - Array of navigation items
 * @param {string} activeTab - Currently active tab
 * @param {function} onTabChange - Tab change handler
 */
export const MobileMenu = ({ items, activeTab, onTabChange }) => {
  const {
    isOpen,
    expandedCategory,
    toggleMenu,
    closeMenu,
    toggleCategory,
    isCategoryExpanded
  } = useMobileMenu();

  const handleItemClick = (path) => {
    onTabChange(path);
    closeMenu();
  };

  return (
    <>
      {/* Hamburger Button (visible on mobile only) */}
      <button
        onClick={toggleMenu}
        className="lg:hidden flex items-center justify-center w-10 h-10 text-white hover:bg-[#3A3A3C] rounded-lg transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Drawer */}
      <MobileMenuDrawer
        isOpen={isOpen}
        items={items}
        activeTab={activeTab}
        expandedCategory={expandedCategory}
        onItemClick={handleItemClick}
        onClose={closeMenu}
        onToggleCategory={toggleCategory}
        isCategoryExpanded={isCategoryExpanded}
      />
    </>
  );
};

export default MobileMenu;
