import React from 'react';
import { TABLE_CONFIG } from '../config/tableConfig';

export const BaseTable = ({
  children,
  density = TABLE_CONFIG.defaults.density,
  bordered = TABLE_CONFIG.defaults.bordered,
  striped = TABLE_CONFIG.defaults.striped,
  hoverable = TABLE_CONFIG.defaults.hoverable,
  variant = 'default',
  className = '',
  ...props
}) => {
  const densityConfig = TABLE_CONFIG.density[density];
  const variantClass = TABLE_CONFIG.variants[variant];
  
  const tableClasses = [
    'w-full',
    densityConfig.textSize,
    striped ? '[&_tbody_tr:nth-child(even)]:bg-gray-50' : '',
    hoverable ? '[&_tbody_tr]:hover:bg-gray-50' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`w-full overflow-hidden rounded-xl ${variantClass}`}>
      <div className="overflow-x-auto">
        <table
          className={tableClasses}
          {...props}
        >
          {children}
        </table>
      </div>
    </div>
  );
};

export const TableHeader = ({ children, className = '', ...props }) => (
  <thead className={`bg-gray-50 ${className}`} {...props}>
    {children}
  </thead>
);

export const TableBody = ({ children, className = '', ...props }) => (
  <tbody className={`bg-white divide-y divide-gray-200 ${className}`} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ children, selected = false, className = '', ...props }) => {
  const rowClasses = [
    selected ? 'bg-blue-50' : '',
    'transition-colors duration-150',
    className
  ].filter(Boolean).join(' ');

  return (
    <tr className={rowClasses} {...props}>
      {children}
    </tr>
  );
};