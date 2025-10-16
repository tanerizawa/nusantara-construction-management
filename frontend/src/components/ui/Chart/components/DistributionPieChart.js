import React from 'react';
import ChartContainer from './ChartContainer';
import { PieChart } from 'lucide-react';
import { formatPercentage, formatCurrency } from '../utils/chartUtils';

/**
 * DistributionPieChart Component
 * Pie chart for distribution data
 *
 * @param {object} props - Component props
 * @param {string} props.title - Chart title
 * @param {string} props.subtitle - Chart subtitle
 * @param {array} props.data - Chart data
 * @param {string} props.nameKey - Name key in data
 * @param {string} props.valueKey - Value key in data
 * @param {array} props.colors - Color array for segments
 */
const DistributionPieChart = ({
  title,
  subtitle,
  data = [],
  nameKey = 'name',
  valueKey = 'value',
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
}) => {
  // Check if data is available
  const hasData = data && data.length > 0;
  
  // Calculate total for percentages
  const total = hasData ? data.reduce((sum, item) => sum + (item[valueKey] || 0), 0) : 0;
  
  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      height="h-80"
    >
      <div className="p-6">
        {hasData && total > 0 ? (
          <div className="flex flex-col h-full">
            {/* SVG Pie Chart Visualization */}
            <div className="relative w-40 h-40 mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {data.map((item, index) => {
                  // Calculate percentages and angles for SVG
                  const percentage = item[valueKey] / total;
                  const startAngle = data
                    .slice(0, index)
                    .reduce((sum, d) => sum + (d[valueKey] / total) * 360, 0);
                  const endAngle = startAngle + (percentage * 360);
                  
                  // Convert angles to radians
                  const startRad = (startAngle - 90) * (Math.PI / 180);
                  const endRad = (endAngle - 90) * (Math.PI / 180);
                  
                  // Calculate path coordinates
                  const x1 = 50 + 40 * Math.cos(startRad);
                  const y1 = 50 + 40 * Math.sin(startRad);
                  const x2 = 50 + 40 * Math.cos(endRad);
                  const y2 = 50 + 40 * Math.sin(endRad);
                  
                  // Determine if the arc should be drawn as large (> 180 degrees)
                  const largeArc = percentage > 0.5 ? 1 : 0;
                  
                  // Create SVG path for the pie slice
                  const path = [
                    `M 50 50`,
                    `L ${x1} ${y1}`,
                    `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
                    `Z`
                  ].join(' ');
                  
                  return (
                    <path
                      key={index}
                      d={path}
                      fill={colors[index % colors.length]}
                      stroke="#fff"
                      strokeWidth="0.5"
                    />
                  );
                })}
              </svg>
            </div>
            
            {/* Legend */}
            <div className="mt-6 space-y-2 max-h-40 overflow-auto">
              {data.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-sm mr-2"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <span className="text-sm">{item[nameKey]}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">
                      {formatCurrency(item[valueKey])}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({formatPercentage((item[valueKey] / total) * 100)})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 h-full flex flex-col items-center justify-center">
            <PieChart size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No data available</p>
          </div>
        )}
      </div>
    </ChartContainer>
  );
};

export default DistributionPieChart;