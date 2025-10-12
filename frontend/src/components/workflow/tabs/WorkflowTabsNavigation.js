import React from 'react';
import { workflowTabsConfig, findTabByPath, hasActiveChild } from './workflowTabsConfig';

/**
 * WorkflowTabsNavigation - Hierarchical tabs navigation
 * Main tabs (pills) + Secondary tabs (flat tabs for children)
 */
const WorkflowTabsNavigation = ({ activeTab, onTabChange }) => {
  const { mainTab: activeMainTab, subTab: activeSubTab } = findTabByPath(activeTab);

  /**
   * Handle main tab click
   */
  const handleMainTabClick = (tab) => {
    if (tab.hasChildren) {
      // If has children, select first child
      const firstChild = tab.children[0];
      onTabChange(firstChild.path);
    } else {
      // If no children, navigate directly
      onTabChange(tab.path);
    }
  };

  /**
   * Handle sub tab click
   */
  const handleSubTabClick = (subTab) => {
    onTabChange(subTab.path);
  };

  return (
    <div className="mb-6">
      {/* Main Tabs - Pills Style */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {workflowTabsConfig.map(tab => {
          const isActive = activeMainTab?.id === tab.id || hasActiveChild(tab, activeTab);
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleMainTabClick(tab)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm
                transition-all duration-200
                ${isActive 
                  ? 'bg-[#3A3A3C] text-white border border-[#0A84FF] shadow-lg shadow-[#0A84FF]/20' 
                  : 'bg-transparent text-[#8E8E93] border border-[#48484A] hover:bg-[#2C2C2E] hover:text-white hover:border-[#5E5E60]'
                }
              `}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#0A84FF]' : 'text-[#8E8E93]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary Tabs - Flat Tabs for Children */}
      {activeMainTab?.hasChildren && (
        <div className="flex items-center gap-0 border-b border-[#38383A]">
          {activeMainTab.children.map(subTab => {
            const isActive = activeSubTab?.id === subTab.id;

            return (
              <button
                key={subTab.id}
                onClick={() => handleSubTabClick(subTab)}
                className={`
                  px-5 py-3 text-sm font-medium transition-all duration-200 relative
                  ${isActive 
                    ? 'text-white' 
                    : 'text-[#8E8E93] hover:text-white hover:bg-[#2C2C2E]/50'
                  }
                `}
              >
                {subTab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A84FF]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WorkflowTabsNavigation;
