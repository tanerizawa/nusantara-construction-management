import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { PIE_CHART_COLORS, CHART_STYLES } from '../../config/chartConfig';

/**
 * CategoryDistributionChart Component
 * Visualizes distribution of items across categories
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data array
 */
const CategoryDistributionChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} 
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value, name) => [`${value}%`, name]}
          contentStyle={CHART_STYLES.tooltipStyles}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryDistributionChart;