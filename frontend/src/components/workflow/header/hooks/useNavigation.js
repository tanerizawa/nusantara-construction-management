import { useState, useEffect, useCallback } from 'react';
import { navigationConfig, findItemByPath, hasActiveChild } from '../config/navigationConfig';

/**
 * Custom hook untuk navigation state dan helpers
 * 
 * @param {string} activeTab - Currently active tab/path
 * @returns {object} Navigation state and helpers
 */
export const useNavigation = (activeTab) => {
  const [currentPath, setCurrentPath] = useState(activeTab);
  const [activeCategory, setActiveCategory] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  // Update current path when activeTab changes
  useEffect(() => {
    setCurrentPath(activeTab);
  }, [activeTab]);

  // Calculate active category and breadcrumbs
  useEffect(() => {
    const result = findItemByPath(currentPath);
    
    if (result) {
      setActiveCategory(result.parent || result.item);
      
      // Build breadcrumbs
      const crumbs = [];
      if (result.parent) {
        crumbs.push({
          label: result.parent.label,
          path: null // Category doesn't have direct path
        });
      }
      crumbs.push({
        label: result.item.label,
        path: result.item.path
      });
      
      setBreadcrumbs(crumbs);
    } else {
      setActiveCategory(null);
      setBreadcrumbs([]);
    }
  }, [currentPath]);

  // Check if a path is active
  const isPathActive = useCallback((path) => {
    return currentPath === path;
  }, [currentPath]);

  // Check if a category is active (any child is active)
  const isCategoryActive = useCallback((category) => {
    if (category.type === 'single') {
      return isPathActive(category.path);
    }
    return hasActiveChild(category, currentPath);
  }, [currentPath, isPathActive]);

  // Get all navigation items
  const navigationItems = navigationConfig;

  return {
    currentPath,
    activeCategory,
    breadcrumbs,
    navigationItems,
    isPathActive,
    isCategoryActive
  };
};

export default useNavigation;
