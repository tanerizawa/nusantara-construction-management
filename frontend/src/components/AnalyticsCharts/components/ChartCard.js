import React from 'react';
import { CHART_STYLES } from '../config/chartConfig';

/**
 * ChartCard Component
 * Container for chart components with consistent styling
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Chart title
 * @param {React.ReactNode} props.children - Chart component
 * @param {object} props.className - Additional CSS classes
 */
const ChartCard = ({ title, children, className = '' }) => {
  return (
    <div 
      className={`p-6 rounded-lg shadow-lg ${className}`} 
      style={{ 
        backgroundColor: CHART_STYLES.backgroundColor, 
        border: `1px solid ${CHART_STYLES.borderColor}` 
      }}
    >
      <h3 
        className="text-lg font-semibold mb-4" 
        style={{ color: CHART_STYLES.textColor }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
};

export default ChartCard;