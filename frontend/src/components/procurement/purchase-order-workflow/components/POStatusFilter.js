import React from 'react';
import { FILTER_OPTIONS } from '../config/poConfig';

/**
 * Purchase Order Status Filter Component
 */
const POStatusFilter = ({ filter, setFilter }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => setFilter(option.value)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === option.value
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default POStatusFilter;