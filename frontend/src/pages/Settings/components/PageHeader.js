import React from 'react';

/**
 * Header component for Settings page
 * @param {Object} props Component properties
 * @param {React.ReactNode} props.icon Icon component
 * @param {string} props.title Header title
 * @param {string} props.subtitle Header subtitle
 * @returns {JSX.Element} Header UI
 */
const PageHeader = ({ icon, title, subtitle }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-3">
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(10, 132, 255, 0.1)' }}>
          {icon}
        </div>
        <h1 className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>
          {title}
        </h1>
      </div>
      <p style={{ color: '#98989D' }}>
        {subtitle}
      </p>
    </div>
  );
};

export default PageHeader;