import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartContainer from './ChartContainer';
import { getChartColors } from '../config/chartConfig';
import { formatCurrency, formatDate, formatNumber } from '../utils/chartUtils';

/**
 * TimeSeriesChart Component
 * Line chart for displaying time series data with multiple lines
 * 
 * @param {object} props - Component props
 * @param {string} props.title - Chart title
 * @param {string} props.subtitle - Chart subtitle
 * @param {Array} props.data - Array of data objects with timestamps and values
 * @param {string} props.dateKey - Key for date values
 * @param {Array} props.lineKeys - Array of keys for the lines to display
 * @param {Array} props.lineNames - Array of display names for the lines
 * @param {boolean} props.isCurrency - Format values as currency
 * @param {string} props.height - Container height (default: h-72)
 * @param {boolean} props.showLegend - Whether to show the legend
 */
const TimeSeriesChart = ({
  title,
  subtitle,
  data = [],
  dateKey = 'date',
  lineKeys = ['value'],
  lineNames = ['Value'],
  isCurrency = false,
  height = 'h-72',
  showLegend = true
}) => {
  const colors = getChartColors(lineKeys.length);
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-gray-700">{formatDate(label)}</p>
          <div className="mt-2">
            {payload.map((entry, index) => (
              <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {' '}
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
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey={dateKey} 
              tick={{ fontSize: 12 }}
              tickFormatter={tick => formatDate(tick, 'short')}
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
            
            {lineKeys.map((key, index) => (
              <Line 
                key={key}
                type="monotone"
                dataKey={key}
                name={lineNames[index] || key}
                stroke={colors[index]}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 1, fill: '#ffffff' }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default TimeSeriesChart;