import React from 'react';

// Simple segmented density toggle: Comfortable vs Compact
const DensityToggle = ({ compact, onChange }) => {
  return (
    <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden text-sm">
      <button
        type="button"
        className={`px-3 py-1.5 ${!compact ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
        onClick={() => onChange(false)}
        aria-pressed={!compact}
      >
        Nyaman
      </button>
      <button
        type="button"
        className={`px-3 py-1.5 ${compact ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
        onClick={() => onChange(true)}
        aria-pressed={compact}
      >
        Padat
      </button>
    </div>
  );
};

export default DensityToggle;
