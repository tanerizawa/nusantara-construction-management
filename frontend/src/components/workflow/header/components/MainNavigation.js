import React from 'react';
import { NavItem } from './NavItem';
import { NavDropdown } from './NavDropdown';

/**
 * MainNavigation Component
 * Container for all navigation items
 * 
 * @param {array} items - Array of navigation items
 * @param {string} activeTab - Currently active tab
 * @param {function} onTabChange - Tab change handler
 */
export const MainNavigation = ({ items, activeTab, onTabChange }) => {
  return (
    <nav className="flex items-center space-x-1 h-full" role="navigation">
      {items.map(item => {
        if (item.type === 'single') {
          return (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeTab === item.path}
              onClick={() => onTabChange(item.path)}
            />
          );
        }

        if (item.type === 'dropdown') {
          // Check if any sub-item is active
          const isActive = item.items.some(sub => sub.path === activeTab);
          
          return (
            <NavDropdown
              key={item.id}
              item={item}
              isActive={isActive}
              activeTab={activeTab}
              onTabChange={onTabChange}
            />
          );
        }

        return null;
      })}
    </nav>
  );
};

export default MainNavigation;
