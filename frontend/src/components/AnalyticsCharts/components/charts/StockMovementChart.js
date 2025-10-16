import React from 'react';
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { CHART_STYLES, CHART_COLORS } from '../../config/chartConfig';
import { formatNumber } from '../../utils/chartUtils';

/**
 * StockMovementChart Component
 * Visualizes stock movement with in/out and net flows
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data array
 */
const StockMovementChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid 
          strokeDasharray={CHART_STYLES.strokeDasharray} 
          stroke={CHART_STYLES.borderColor} 
        />
        <XAxis 
          dataKey="name" 
          stroke={CHART_STYLES.secondaryTextColor} 
        />
        <YAxis 
          stroke={CHART_STYLES.secondaryTextColor} 
        />
        <Tooltip 
          formatter={(value) => formatNumber(value)}
          contentStyle={CHART_STYLES.tooltipStyles}
        />
        <Legend 
          wrapperStyle={{ color: CHART_STYLES.secondaryTextColor }} 
        />
        <Area 
          type="monotone" 
          dataKey="stockIn" 
          stackId="1" 
          stroke={CHART_COLORS.success} 
          fill={CHART_COLORS.success} 
          fillOpacity={0.8}
          name="Stock In"
        />
        <Area 
          type="monotone" 
          dataKey="stockOut" 
          stackId="1" 
          stroke={CHART_COLORS.danger} 
          fill={CHART_COLORS.danger} 
          fillOpacity={0.8}
          name="Stock Out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default StockMovementChart;