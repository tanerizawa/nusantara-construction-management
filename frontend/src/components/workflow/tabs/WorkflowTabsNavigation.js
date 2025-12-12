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
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {workflowTabsConfig.map(tab => {
          const isActive = activeMainTab?.id === tab.id || hasActiveChild(tab, activeTab);
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleMainTabClick(tab)}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                isActive
                  ? 'border-[#0ea5e9]/40 bg-[#0ea5e9]/20 text-white shadow-[0_10px_25px_rgba(14,165,233,0.25)]'
                  : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:text-white'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#0ea5e9]' : 'text-white/40'}`} />
              <span className="hidden sm:inline tracking-normal">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeMainTab?.hasChildren && (
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
          {activeMainTab.children.map(subTab => {
            const isActive = activeSubTab?.id === subTab.id;

            return (
              <button
                key={subTab.id}
                onClick={() => handleSubTabClick(subTab)}
                className={`relative rounded-2xl px-4 py-2 text-xs font-semibold transition ${
                  isActive
                    ? 'border border-white/20 bg-white/15 text-white shadow-[0_10px_20px_rgba(0,0,0,0.35)]'
                    : 'border border-white/5 bg-transparent text-white/60 hover:border-white/20 hover:text-white'
                }`}
              >
                {subTab.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WorkflowTabsNavigation;
