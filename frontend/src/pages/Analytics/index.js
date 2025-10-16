import React from 'react';
import AnalyticsCharts from '../../components/AnalyticsCharts/index';
import { useTranslation } from '../../i18n';

/**
 * Analytics Dashboard Page Component
 * Displays comprehensive analytics and reporting for construction projects
 */
const Analytics = () => {
  const { analytics } = useTranslation();

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: "#1C1C1E" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
          <h1 className="text-2xl font-bold mb-4" style={{ color: "#FFFFFF" }}>{analytics.title}</h1>
          <p className="mb-6" style={{ color: "#98989D" }}>{analytics.subtitle}</p>
          <AnalyticsCharts />
        </div>
      </div>
    </div>
  );
};

export default Analytics;