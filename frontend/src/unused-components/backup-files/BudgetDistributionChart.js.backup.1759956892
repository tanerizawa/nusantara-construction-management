import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/budgetFormatters';

/**
 * Component pie chart untuk budget distribution
 */
const BudgetDistributionChart = ({ categories = [] }) => {
  return (
    <div className="bg-[#2C2C2E] rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-white mb-4">Budget Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={categories}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="budgetAmount"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {categories.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`hsl(${index * 360 / categories.length}, 70%, 60%)`} 
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetDistributionChart;
