import React from 'react';
import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import { TABLE_CONFIG } from '../config/tableConfig';

export const TableHeaderCell = ({
  children,
  sortable = false,
  sortDirection = null,
  onSort,
  align = 'left',
  className = '',
  ...props
}) => {
  const densityConfig = TABLE_CONFIG.density.normal;
  const alignClass = TABLE_CONFIG.alignment[align];
  
  const content = sortable ? (
    <button
      type="button"
      onClick={onSort}
      className="group inline-flex items-center space-x-2 font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
    >
      <span>{children}</span>
      <span className="flex flex-col">
        {sortDirection === 'asc' ? (
          <ChevronUp size={TABLE_CONFIG.icons.size} className={TABLE_CONFIG.colors.sortActive} />
        ) : sortDirection === 'desc' ? (
          <ChevronDown size={TABLE_CONFIG.icons.size} className={TABLE_CONFIG.colors.sortActive} />
        ) : (
          <ArrowUpDown size={TABLE_CONFIG.icons.size} className="text-gray-400 group-hover:text-gray-600" />
        )}
      </span>
    </button>
  ) : (
    <span className="font-medium text-gray-700">{children}</span>
  );
  
  return (
    <th
      className={`
        ${densityConfig.headerPadding} ${alignClass}
        text-xs font-medium text-gray-500 uppercase tracking-wider
        ${className}
      `}
      {...props}
    >
      {content}
    </th>
  );
};

export const TableCell = ({
  children,
  align = 'left',
  className = '',
  ...props
}) => {
  const densityConfig = TABLE_CONFIG.density.normal;
  const alignClass = TABLE_CONFIG.alignment[align];
  
  return (
    <td
      className={`
        ${densityConfig.padding} whitespace-nowrap
        ${alignClass} ${TABLE_CONFIG.colors.text}
        ${className}
      `}
      {...props}
    >
      {children}
    </td>
  );
};