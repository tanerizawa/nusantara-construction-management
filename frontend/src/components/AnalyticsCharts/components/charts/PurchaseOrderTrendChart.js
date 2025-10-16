import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar
} from 'recharts';
import { CHART_STYLES, CHART_COLORS } from '../../config/chartConfig';
import { formatCurrency } from '../../utils/chartUtils';

/**
 * PurchaseOrderTrendChart Component
 * Visualizes purchase order trends over time
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data array
 */
const PurchaseOrderTrendChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid 
          strokeDasharray={CHART_STYLES.strokeDasharray} 
          stroke={CHART_STYLES.borderColor} 
        />
        <XAxis 
          dataKey="month" 
          stroke={CHART_STYLES.secondaryTextColor} 
        />
        <YAxis 
          yAxisId="left" 
          stroke={CHART_STYLES.secondaryTextColor} 
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          stroke={CHART_STYLES.secondaryTextColor} 
          tickFormatter={(value) => formatCurrency(value, { minimumFractionDigits: 0 })} 
        />
        <Tooltip 
          formatter={(value, name) => {
            if (name === 'value') {
              return [formatCurrency(value, { minimumFractionDigits: 0 }), 'Total Value'];
            }
            return [value, 'Total Orders'];
          }}
          contentStyle={CHART_STYLES.tooltipStyles}
        />
        <Legend 
          wrapperStyle={{ color: CHART_STYLES.secondaryTextColor }} 
        />
        <Bar 
          yAxisId="left" 
          dataKey="orders" 
          fill={CHART_COLORS.primary} 
          name="Orders Count" 
        />
        <Line 
          yAxisId="right" 
          type="monotone" 
          dataKey="value" 
          stroke={CHART_COLORS.danger} 
          strokeWidth={3} 
          name="Total Value" 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PurchaseOrderTrendChart;