import React from 'react';
import { CHART_STYLES } from '../config/chartConfig';

/**
 * ChartContainer Component
 * A consistent container for all chart types
 *
 * @param {object} props - Component props
 * @param {string} props.title - Chart title
 * @param {string} props.subtitle - Optional chart subtitle
 * @param {React.ReactNode} props.children - Chart content
 * @param {React.ReactNode} props.actionIcon - Optional action icon
 * @param {string} props.height - Container height (CSS class)
 * @param {boolean} props.darkMode - Enable dark mode
 * @param {function} props.onActionClick - Action icon click handler
 */
const ChartContainer = ({
  title,
  subtitle,
  children,
  actionIcon,
  height = 'h-80',
  darkMode = false,
  onActionClick
}) => {
  const containerBg = darkMode ? CHART_STYLES.containerBgDark : CHART_STYLES.containerBg;
  const headerBg = darkMode ? CHART_STYLES.headerBgDark : CHART_STYLES.headerBg;
  const textPrimary = darkMode ? CHART_STYLES.textPrimaryDark : CHART_STYLES.textPrimary;
  const textSecondary = darkMode ? CHART_STYLES.textSecondaryDark : CHART_STYLES.textSecondary;
  const border = darkMode ? CHART_STYLES.borderDark : CHART_STYLES.border;
  
  return (
    <div className={`${containerBg} ${CHART_STYLES.shadow} ${CHART_STYLES.radius} ${border} ${height} flex flex-col overflow-hidden`}>
      <div className={`${headerBg} px-6 py-4 ${border.replace('border', 'border-b')}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-medium ${textPrimary}`}>{title}</h3>
            {subtitle && <p className={`text-sm ${textSecondary} mt-1`}>{subtitle}</p>}
          </div>
          
          {actionIcon && (
            <button 
              onClick={onActionClick}
              className={`p-1 rounded-full hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors duration-150`}
            >
              {actionIcon}
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default ChartContainer;