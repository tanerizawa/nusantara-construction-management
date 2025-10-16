import React from 'react';
import ChartGrid from './components/ChartGrid';

/**
 * AnalyticsCharts Component
 * Main container for analytics charts
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Optional data to override mock data
 * @param {function} props.fetchFn - Optional API fetch function
 */
const AnalyticsCharts = ({ data, fetchFn }) => {
  return <ChartGrid data={data} fetchFn={fetchFn} />;
};

export default AnalyticsCharts;