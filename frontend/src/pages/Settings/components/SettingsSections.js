import React from 'react';
import { FileText, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SETTINGS_SECTIONS } from '../utils';

/**
 * Component to render a card for each settings section
 * @param {Object} props Component properties
 * @param {Object} props.section Section data
 * @param {Function} props.onSectionSelect Function to call when section is clicked
 * @returns {JSX.Element} Settings section card
 */
const SettingSectionCard = ({ section, onSectionSelect }) => {
  const navigate = useNavigate();
  const { title, description, path, icon: SectionIcon, favorite } = section;

  const handleClick = () => {
    // Call the parent handler
    onSectionSelect(section.id);
  };

  return (
    <div className="rounded-xl p-6 hover:shadow-md transition-shadow" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
      <div className="flex justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#3A3A3C' }}>
            <SectionIcon className="h-6 w-6 text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>{title}</h2>
        </div>
        {favorite && (
          <Star className="h-5 w-5 text-yellow-400 fill-current" />
        )}
      </div>
      <p className="mt-2 text-sm" style={{ color: '#AEAEB2' }}>{description}</p>
      <div className="flex mt-4 justify-between">
        <div className="flex items-center text-xs" style={{ color: '#8E8E93' }}>
          <FileText className="h-3 w-3 mr-1" />
          <span>{path.replace(/^\//, '')}</span>
        </div>
        <button 
          className="px-3 py-1 rounded-md text-sm transition-colors font-medium"
          style={{ backgroundColor: '#0A84FF', color: 'white' }}
          onClick={handleClick}
        >
          Buka
        </button>
      </div>
    </div>
  );
};

/**
 * Component to render all settings sections
 * @param {Object} props Component properties
 * @param {string} props.selectedSection Currently selected section
 * @param {Function} props.onSectionSelect Function to call when a section is selected
 * @returns {JSX.Element} Settings sections grid
 */
const SettingsSections = ({ selectedSection, onSectionSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {SETTINGS_SECTIONS.map((section, index) => (
        <div 
          key={index} 
          className={`${selectedSection === section.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
        >
          <SettingSectionCard 
            section={section} 
            onSectionSelect={onSectionSelect}
          />
        </div>
      ))}
    </div>
  );
};

export default SettingsSections;