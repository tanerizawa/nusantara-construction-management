import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useSubsidiaryTabs = (defaultTab = 'basic') => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Set tab from URL hash if present
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['basic', 'legal', 'financial', 'governance'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  const goToTab = (tabId) => {
    setActiveTab(tabId);
    // Update URL hash without triggering navigation
    window.history.replaceState(null, null, `#${tabId}`);
  };

  const goToNextTab = () => {
    const tabs = ['basic', 'legal', 'financial', 'governance'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      goToTab(tabs[currentIndex + 1]);
    }
  };

  const goToPreviousTab = () => {
    const tabs = ['basic', 'legal', 'financial', 'governance'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      goToTab(tabs[currentIndex - 1]);
    }
  };

  const isFirstTab = () => {
    return activeTab === 'basic';
  };

  const isLastTab = () => {
    return activeTab === 'governance';
  };

  return {
    activeTab,
    setActiveTab: goToTab,
    goToNextTab,
    goToPreviousTab,
    isFirstTab,
    isLastTab
  };
};