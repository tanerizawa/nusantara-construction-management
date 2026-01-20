import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/budgetFormatters';

/**
 * Component timeline chart untuk budget vs actual
 */
const BudgetTimelineChart = ({ timeline = [] }) => {
  if (timeline.length === 0) return null;

  return (
    <div className="bg-[#2C2C2E] rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-white mb-4">Budget vs Actual Timeline</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="budgetAmount" 
              stroke="#8884d8" 
              strokeWidth={2}
              name="Budget"
            />
            <Line 
              type="monotone" 
              dataKey="actualAmount" 
              stroke="#82ca9d" 
              strokeWidth={2}
              name="Actual"
            />
            <Line 
              type="monotone" 
              dataKey="committedAmount" 
              stroke="#ffc658" 
              strokeWidth={2}
              name="Committed"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetTimelineChart;
