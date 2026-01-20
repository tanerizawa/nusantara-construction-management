import React from 'react';
import { TabItem } from './TabItem';

/**
 * Container untuk navigation tabs
 */
export const NavigationTabs = ({ tabs, activeTab, isCollapsed, onTabChange }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {tabs.map((tab) => (
        <TabItem
          key={tab.id}
          tab={tab}
          isActive={activeTab === tab.id}
          isCollapsed={isCollapsed}
          onClick={onTabChange}
        />
      ))}
    </div>
  );
};
