import React from 'react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { CHART_STYLES, CHART_COLORS } from '../../config/chartConfig';

/**
 * WarehouseUtilizationChart Component
 * Visualizes warehouse capacity utilization
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data array
 */
const WarehouseUtilizationChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="horizontal">
        <CartesianGrid 
          strokeDasharray={CHART_STYLES.strokeDasharray} 
          stroke={CHART_STYLES.borderColor} 
        />
        <XAxis 
          type="number" 
          domain={[0, 100]} 
          stroke={CHART_STYLES.secondaryTextColor} 
        />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={80} 
          stroke={CHART_STYLES.secondaryTextColor} 
        />
        <Tooltip 
          formatter={(value) => `${value}%`}
          contentStyle={CHART_STYLES.tooltipStyles}
        />
        <Legend 
          wrapperStyle={{ color: CHART_STYLES.secondaryTextColor }} 
        />
        <Bar 
          dataKey="utilization" 
          fill={CHART_COLORS.purple} 
          name="Utilization %" 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WarehouseUtilizationChart;