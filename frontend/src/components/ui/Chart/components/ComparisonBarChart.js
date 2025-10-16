import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartContainer from './ChartContainer';
import { getChartColors } from '../config/chartConfig';
import { formatCurrency, formatNumber } from '../utils/chartUtils';

/**
 * ComparisonBarChart Component
 * A side-by-side bar chart for comparing multiple metrics across categories
 * 
 * @param {object} props - Component props
 * @param {string} props.title - Chart title
 * @param {string} props.subtitle - Chart subtitle
 * @param {Array} props.data - Array of data objects
 * @param {string} props.xAxisKey - Key for X-axis values
 * @param {Array} props.barKeys - Array of keys for the bars to display
 * @param {Array} props.barNames - Array of display names for the bars
 * @param {boolean} props.isCurrency - Format values as currency
 * @param {string} props.height - Container height (default: h-72)
 * @param {boolean} props.showLegend - Whether to show the legend
 */
const ComparisonBarChart = ({
  title,
  subtitle,
  data = [],
  xAxisKey = 'name',
  barKeys = ['value1', 'value2'],
  barNames = ['Value 1', 'Value 2'],
  isCurrency = false,
  height = 'h-72',
  showLegend = true
}) => {
  const colors = getChartColors(barKeys.length);
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-gray-700">{label}</p>
          <div className="mt-2">
            {payload.map((entry, index) => (
              <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
                {barNames[index] || entry.name}: {' '}
                {isCurrency 
                  ? formatCurrency(entry.value) 
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
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
              tickFormatter={tick => isCurrency ? formatCurrency(tick, true) : formatNumber(tick, true)}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend wrapperStyle={{ paddingTop: 10 }} />}
            
            {barKeys.map((key, index) => (
              <Bar 
                key={key}
                dataKey={key}
                name={barNames[index] || key}
                fill={colors[index]}
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default ComparisonBarChart;