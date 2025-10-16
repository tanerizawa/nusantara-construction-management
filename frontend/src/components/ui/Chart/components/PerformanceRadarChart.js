import React from 'react';
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import ChartContainer from './ChartContainer';
import { getChartColors } from '../config/chartConfig';
import { formatNumber, formatPercentage } from '../utils/chartUtils';

/**
 * PerformanceRadarChart Component
 * Radar chart for visualizing multiple metrics across several dimensions
 * 
 * @param {object} props - Component props
 * @param {string} props.title - Chart title
 * @param {string} props.subtitle - Chart subtitle
 * @param {Array} props.data - Array of data objects
 * @param {string} props.angleKey - Key for angular axis values
 * @param {Array} props.radarKeys - Array of keys for the radar values
 * @param {Array} props.radarNames - Array of display names for radar values
 * @param {boolean} props.isPercentage - Format values as percentages
 * @param {string} props.height - Container height (default: h-80)
 */
const PerformanceRadarChart = ({
  title,
  subtitle,
  data = [],
  angleKey = 'subject',
  radarKeys = ['value'],
  radarNames = ['Score'],
  isPercentage = false,
  height = 'h-80'
}) => {
  const colors = getChartColors(radarKeys.length);
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-gray-700">{label}</p>
          <div className="mt-2">
            {payload.map((entry, index) => (
              <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {' '}
                {isPercentage 
                  ? formatPercentage(entry.value / 100) 
                  : formatNumber(entry.value)}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer title={title} subtitle={subtitle} height={height}>
      <div className="p-4 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart 
            cx="50%" 
            cy="50%" 
            outerRadius="80%" 
            data={data}
          >
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis 
              dataKey={angleKey}
              tick={{ fontSize: 12, fill: '#4B5563' }}
            />
            <PolarRadiusAxis 
              angle={30}
              domain={[0, 'auto']}
              tick={{ fontSize: 10, fill: '#6B7280' }}
              tickFormatter={tick => isPercentage ? formatPercentage(tick / 100) : formatNumber(tick)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            
            {radarKeys.map((key, index) => (
              <Radar
                key={key}
                name={radarNames[index] || key}
                dataKey={key}
                stroke={colors[index]}
                fill={colors[index]}
                fillOpacity={0.2}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default PerformanceRadarChart;