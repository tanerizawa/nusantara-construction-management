import React from 'react';
import ChartContainer from './ChartContainer';
import { BarChart3 } from 'lucide-react';
import { formatCurrency } from '../utils/chartUtils';
import { CHART_COLORS } from '../config/chartConfig';

/**
 * FinancialBarChart Component
 * General bar chart for financial data
 *
 * @param {object} props - Component props
 * @param {string} props.title - Chart title
 * @param {string} props.subtitle - Chart subtitle
 * @param {array} props.data - Chart data
 * @param {string} props.xAxisKey - X-axis data key
 * @param {array} props.series - Data series configuration
 * @param {boolean} props.horizontal - Horizontal orientation
 */
const FinancialBarChart = ({
  title,
  subtitle,
  data = [],
  xAxisKey = 'name',
  series = [],
  horizontal = false
}) => {
  // Check if data is available
  const hasData = data && data.length > 0;
  
  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      height="h-80"
    >
      <div className="p-6">
        {hasData ? (
          <div className="h-full">
            {/* This is a placeholder for the actual chart implementation */}
            {/* In a real implementation, you would use a library like recharts */}
            <div className="space-y-4">
              {data.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item[xAxisKey]}</span>
                    <span className="text-xs text-gray-500">
                      {series.map(s => formatCurrency(item[s.dataKey])).join(' / ')}
                    </span>
                  </div>
                  <div className="flex space-x-1 h-6">
                    {series.map((s, i) => {
                      // Find the max value for scaling
                      const maxValue = Math.max(...data.map(d => 
                        Math.max(...series.map(s => d[s.dataKey] || 0))
                      ));
                      
                      const percentage = (item[s.dataKey] / maxValue) * 100;
                      
                      return (
                        <div
                          key={i}
                          className="rounded"
                          style={{
                            backgroundColor: s.color || CHART_COLORS.primary.default,
                            width: horizontal ? `${percentage}%` : `${100 / series.length}%`,
                            height: horizontal ? '100%' : `${percentage}%`
                          }}
                          title={`${s.name}: ${formatCurrency(item[s.dataKey])}`}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center mt-6 space-x-4">
              {series.map((s, i) => (
                <div key={i} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-sm mr-1" 
                    style={{ backgroundColor: s.color || CHART_COLORS.primary.default }}
                  ></div>
                  <span className="text-xs text-gray-600">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 h-full flex flex-col items-center justify-center">
            <BarChart3 size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No data available</p>
          </div>
        )}
      </div>
    </ChartContainer>
  );
};

export default FinancialBarChart;