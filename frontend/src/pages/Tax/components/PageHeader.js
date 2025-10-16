import React from 'react';

/**
 * Component for displaying the page header
 * @param {Object} props Component props
 * @param {string} props.title Page title
 * @param {string} props.subtitle Page subtitle
 * @param {number} props.count Number of entries
 * @returns {JSX.Element} Page header UI
 */
const PageHeader = ({ title, subtitle, count }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>
      {count !== undefined && (
        <div className="text-sm text-gray-500">{count} entri</div>
      )}
    </div>
  );
};

export default PageHeader;