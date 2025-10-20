import React from 'react';
import { useDashboardData } from '../hooks';
import { useDashboardSummary } from '../hooks/useDashboardSummary';
import { LoadingSpinner, ErrorDisplay } from '../../../components/common/DashboardComponents';
import {
  DashboardHeader,
  ProjectStatusOverview,
  RecentActivities
} from '../components';
import EnhancedStatsGrid from './EnhancedStatsGrid';
import ApprovalSection from './ApprovalSection';
import QuickLinks from './QuickActions'; // Will use renamed file

/**
 * Main dashboard page component
 * @returns {JSX.Element} Dashboard UI
 */
const DashboardPage = () => {
  const {
    dashboardData,
    recentActivities,
    loading: oldLoading,
    error: oldError,
    fetchDashboardData
  } = useDashboardData();

  // Use new dashboard summary hook
  const {
    data: summaryData,
    loading: summaryLoading,
    error: summaryError,
    refresh: refreshSummary
  } = useDashboardSummary();

  // Use new summary data if available, fallback to old data
  const loading = summaryData ? summaryLoading : oldLoading;
  const error = summaryError || oldError;
  const handleRefresh = summaryData ? refreshSummary : fetchDashboardData;

  if (loading && !summaryData && !dashboardData) {
    return <LoadingSpinner message="Loading dashboard data..." />;
  }

  if (error && !summaryData && !dashboardData) {
    return <ErrorDisplay error={error} onRetry={handleRefresh} title="Dashboard Error" />;
  }

  return (
    <div className="p-6 bg-[#1C1C1E] min-h-screen">
      {/* Header */}
      <DashboardHeader 
        loading={loading} 
        onRefresh={handleRefresh} 
      />

      {/* Enhanced Stats Grid - 8 cards */}
      <EnhancedStatsGrid data={summaryData || dashboardData} />

      {/* Approval Section - PRIORITY */}
      <ApprovalSection />

      {/* Quick Links & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Quick Links - Revised */}
        <QuickLinks />

        {/* Recent Activities */}
        <RecentActivities activities={recentActivities} />
      </div>

      {/* Project Status Overview */}
      <ProjectStatusOverview projectData={(summaryData || dashboardData)?.projects} />
    </div>
  );
};

export default DashboardPage;