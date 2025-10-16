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
 * SupplierPerformanceChart Component
 * Visualizes supplier performance metrics
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data array
 */
const SupplierPerformanceChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid 
          strokeDasharray={CHART_STYLES.strokeDasharray} 
          stroke={CHART_STYLES.borderColor} 
        />
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end" 
          height={100} 
          stroke={CHART_STYLES.secondaryTextColor} 
        />
        <YAxis 
          stroke={CHART_STYLES.secondaryTextColor} 
        />
        <Tooltip 
          contentStyle={CHART_STYLES.tooltipStyles} 
        />
        <Legend 
          wrapperStyle={{ color: CHART_STYLES.secondaryTextColor }} 
        />
        <Bar 
          dataKey="orders" 
          fill={CHART_COLORS.primary} 
          name="Total Orders" 
        />
        <Bar 
          dataKey="onTime" 
          fill={CHART_COLORS.success} 
          name="On Time Delivery" 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SupplierPerformanceChart;