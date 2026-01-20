import { useState } from 'react';

/**
 * Custom hook untuk mengelola state sidebar (collapsed/expanded)
 */
export const useSidebarState = (initialCollapsed = false) => {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  const toggleCollapsed = () => {
    setIsCollapsed(prev => !prev);
  };

  return {
    isCollapsed,
    setIsCollapsed,
    toggleCollapsed
  };
};
