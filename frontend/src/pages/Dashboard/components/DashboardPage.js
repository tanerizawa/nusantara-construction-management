import React from 'react';
import { useDashboardData } from '../hooks';
import { LoadingSpinner, ErrorDisplay } from '../../../components/common/DashboardComponents';
import {
  DashboardHeader,
  StatsGrid,
  QuickActions,
  RecentActivities,
  ProjectStatusOverview
} from '../components';

/**
 * Main dashboard page component
 * @returns {JSX.Element} Dashboard UI
 */
const DashboardPage = () => {
  const {
    dashboardData,
    recentActivities,
    loading,
    error,
    fetchDashboardData
  } = useDashboardData();

  if (loading) {
    return <LoadingSpinner message="Loading dashboard data..." />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchDashboardData} title="Dashboard Error" />;
  }

  return (
    <div className="p-6 bg-[#1C1C1E] min-h-screen">
      {/* Header */}
      <DashboardHeader 
        loading={loading} 
        onRefresh={fetchDashboardData} 
      />

      {/* Stats Grid */}
      <StatsGrid data={dashboardData} />

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Activities */}
        <RecentActivities activities={recentActivities} />
      </div>

      {/* Project Status Overview */}
      <ProjectStatusOverview projectData={dashboardData.projects} />
    </div>
  );
};

export default DashboardPage;