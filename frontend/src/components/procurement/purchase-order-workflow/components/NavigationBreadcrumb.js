import React from 'react';
import { getBreadcrumbItems } from '../utils/poUtils';

/**
 * Navigation Breadcrumb Component
 */
const NavigationBreadcrumb = ({ 
  currentView, 
  selectedProject, 
  selectedPO, 
  onBackToList,
  onShowProjectSelection 
}) => {
  if (currentView === 'list') {
    return null; // No breadcrumb for list view
  }

  const breadcrumbItems = getBreadcrumbItems(currentView, selectedProject, selectedPO);

  const handleClick = (item) => {
    if (item.onClick === 'handleBackToList') {
      onBackToList();
    } else if (item.onClick === 'handleShowProjectSelection') {
      onShowProjectSelection();
    }
  };

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {item.onClick ? (
            <button 
              onClick={() => handleClick(item)}
              className="hover:text-blue-600 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span>{item.label}</span>
          )}
          {index < breadcrumbItems.length - 1 && <span>/</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default NavigationBreadcrumb;