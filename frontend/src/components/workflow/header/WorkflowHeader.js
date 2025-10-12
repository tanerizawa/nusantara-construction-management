import React from 'react';
import { HeaderBrand, UserMenu, MainNavigation, MobileMenu } from './components';
import { useNavigation } from './hooks';

/**
 * WorkflowHeader Component
 * Main horizontal header for workflow navigation
 * 
 * Features:
 * - Full-width horizontal layout
 * - 5 main categories with dropdowns
 * - Mobile-responsive (hamburger menu)
 * - Sticky header
 * 
 * @param {object} project - Project data
 * @param {string} activeTab - Currently active tab
 * @param {function} onTabChange - Tab change handler
 */
const WorkflowHeader = ({ project, activeTab, onTabChange }) => {
  const { navigationItems } = useNavigation(activeTab);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#2C2C2E] border-b border-[#38383A] shadow-lg">
      {/* Row 1: Brand + Project + User */}
      <div className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-[#38383A]">
        {/* Left: Mobile Menu + Brand */}
        <div className="flex items-center space-x-3">
          <MobileMenu
            items={navigationItems}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
          <HeaderBrand project={project} />
        </div>

        {/* Right: User Menu */}
        <UserMenu />
      </div>

      {/* Row 2: Main Navigation (Desktop only) */}
      <div className="hidden lg:block h-16 px-6">
        <MainNavigation
          items={navigationItems}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </div>
    </header>
  );
};

export default WorkflowHeader;
