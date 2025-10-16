import React from 'react';
import StatusBadge from './StatusBadge';

/**
 * Settings section card component
 * 
 * @param {Object} props Component props
 * @param {Object} props.section Section configuration
 * @param {Function} props.onClick Section click handler
 * @returns {JSX.Element} Settings section card UI
 */
const SettingSectionCard = ({ section, onClick }) => {
  const IconComponent = section.icon;
  const isDisabled = section.status === 'coming-soon';
  
  return (
    <div
      className="rounded-xl transition-all duration-300 hover:border-opacity-100"
      style={{
        backgroundColor: '#2C2C2E',
        border: '1px solid #38383A',
        opacity: isDisabled ? 0.7 : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer'
      }}
      onClick={() => !isDisabled && onClick(section)}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${section.color}15` }}>
            <IconComponent className="h-6 w-6" style={{ color: section.color }} />
          </div>
          <StatusBadge status={section.status} />
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#FFFFFF' }}>
          {section.title}
        </h3>
        <p className="text-sm" style={{ color: '#98989D' }}>
          {section.description}
        </p>
      </div>
      
      {/* Footer Button */}
      <div className="p-6 pt-0">
        <button
          disabled={isDisabled}
          className="w-full px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          style={{
            backgroundColor: isDisabled ? '#38383A' : 'transparent',
            border: `1px solid ${isDisabled ? '#48484A' : section.color}`,
            color: isDisabled ? '#636366' : section.color,
            cursor: isDisabled ? 'not-allowed' : 'pointer'
          }}
        >
          {isDisabled ? 'Segera Hadir' : 'Buka Pengaturan'}
        </button>
      </div>
    </div>
  );
};

export default SettingSectionCard;