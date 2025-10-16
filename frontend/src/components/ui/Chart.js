/**
 * Chart Component Library
 * 
 * This file has been modularized into separate components
 * located at /src/components/ui/Chart/
 * 
 * This file now re-exports the modularized components to maintain backward compatibility
 */

// Import all components from the modularized Chart directory
import {
  ChartContainer,
  BudgetChart,
  MilestoneChart,
  ProgressBudgetChart,
  FinancialBarChart,
  DistributionPieChart,
  FinancialSummaryCard,
  ComparisonBarChart,
  TimeSeriesChart,
  PerformanceRadarChart
} from './Chart/index';

// Re-export all named exports
export {
  ChartContainer,
  BudgetChart,
  MilestoneChart,
  ProgressBudgetChart,
  FinancialBarChart,
  DistributionPieChart,
  FinancialSummaryCard,
  ComparisonBarChart,
  TimeSeriesChart,
  PerformanceRadarChart
};

// Define a ChartComponents object that contains all chart components
// to maintain the original default export structure
const ChartComponents = {
  ChartContainer,
  BudgetChart,
  MilestoneChart,
  ProgressBudgetChart,
  FinancialBarChart,
  DistributionPieChart,
  FinancialSummaryCard,
  ComparisonBarChart,
  TimeSeriesChart,
  PerformanceRadarChart
};

// Export the ChartComponents object as the default export
export default ChartComponents;
