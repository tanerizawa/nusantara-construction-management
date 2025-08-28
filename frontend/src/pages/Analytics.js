import React from 'react';
import AnalyticsCharts from '../components/AnalyticsCharts';

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
        <p className="text-gray-600 mb-6">Comprehensive analytics and reporting for your construction projects.</p>
        <AnalyticsCharts />
      </div>
    </div>
  );
};

export default Analytics;
