import React from 'react';
import SettingSectionCard from './SettingSectionCard';

/**
 * Settings sections grid component
 * 
 * @param {Object} props Component props
 * @param {Array} props.sections Settings sections configuration
 * @param {Function} props.onSectionClick Section click handler
 * @returns {JSX.Element} Settings sections grid UI
 */
const SettingSectionsGrid = ({ sections, onSectionClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {sections.map((section, index) => (
        <SettingSectionCard
          key={index}
          section={section}
          onClick={onSectionClick}
        />
      ))}
    </div>
  );
};

export default SettingSectionsGrid;