import { useState } from 'react';
import { SETTINGS_SECTIONS } from '../utils';

/**
 * Custom hook for managing settings section selection
 * 
 * @returns {Object} Section selection state and handler
 */
const useSettingsSections = () => {
  const [selectedSection, setSelectedSection] = useState(null);

  /**
   * Get section by ID
   * @param {string} id - Section ID
   * @returns {Object|null} Section configuration object or null
   */
  const getSectionById = (id) => {
    return SETTINGS_SECTIONS.find(section => section.id === id) || null;
  };

  /**
   * Handle section click
   * @param {string} sectionId - ID of the section
   */
  const handleSectionClick = (sectionId) => {
    const section = getSectionById(sectionId);
    if (section && section.status === 'available') {
      setSelectedSection(sectionId);
    }
  };

  return {
    selectedSection,
    setSelectedSection,
    handleSectionClick,
    getSectionById
  };
};

export default useSettingsSections;