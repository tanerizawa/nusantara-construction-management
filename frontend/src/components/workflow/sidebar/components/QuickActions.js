import React from 'react';
import { FolderOpen, BarChart3 } from 'lucide-react';

/**
 * Quick action buttons di bagian bawah sidebar
 */
export const QuickActions = ({ isCollapsed, onActionTrigger }) => {
  if (!isCollapsed) {
    return (
      <div className="space-y-2">
        <button
          className="w-full flex items-center px-3 py-2 text-sm text-[#98989D] hover:bg-[#3A3A3C] hover:text-white rounded-lg transition-colors"
          onClick={() => onActionTrigger?.('open-files')}
        >
          <FolderOpen size={16} className="mr-2" />
          Project Files
        </button>
        <button
          className="w-full flex items-center px-3 py-2 text-sm text-[#98989D] hover:bg-[#3A3A3C] hover:text-white rounded-lg transition-colors"
          onClick={() => onActionTrigger?.('generate-report')}
        >
          <BarChart3 size={16} className="mr-2" />
          Generate Report
        </button>
      </div>
    );
  }

  // Collapsed mode
  return (
    <div className="space-y-2">
      <ActionButton
        icon={FolderOpen}
        title="Project Files"
        onClick={() => onActionTrigger?.('open-files')}
      />
      <ActionButton
        icon={BarChart3}
        title="Generate Report"
        onClick={() => onActionTrigger?.('generate-report')}
      />
    </div>
  );
};

const ActionButton = ({ icon: Icon, title, onClick }) => (
  <div className="relative group">
    <button
      className="w-full flex items-center justify-center p-2 text-[#98989D] hover:bg-[#3A3A3C] hover:text-white rounded-lg transition-colors"
      onClick={onClick}
      title={title}
    >
      <Icon size={16} />
    </button>
    <div className="absolute left-full top-0 ml-2 px-2 py-1 bg-[#2C2C2E] border border-[#38383A] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
      {title}
      <div className="absolute top-2 -left-1 w-2 h-2 bg-[#2C2C2E] border-l border-b border-[#38383A] transform rotate-45"></div>
    </div>
  </div>
);
