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
  const resolvedData = summaryData || dashboardData;
  const loading = summaryData ? summaryLoading : oldLoading;
  const error = summaryError || oldError;
  const handleRefresh = summaryData ? refreshSummary : fetchDashboardData;

  if (loading && !summaryData && !dashboardData) {
    return <LoadingSpinner message="Memuat data dasbor..." />;
  }

  if (error && !summaryData && !dashboardData) {
    return <ErrorDisplay error={error} onRetry={handleRefresh} title="Kesalahan Dasbor" />;
  }

  return (
    <div className="relative isolate min-h-screen">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 blur-3xl opacity-70" aria-hidden="true">
        <div className="mx-auto h-full max-w-3xl bg-gradient-to-r from-[#0ea5e9]/30 via-[#6366f1]/30 to-[#f472b6]/20" />
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        <DashboardHeader 
          loading={loading} 
          onRefresh={handleRefresh}
          insightData={resolvedData}
        />

        <EnhancedStatsGrid data={resolvedData} />

        <ApprovalSection />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <QuickLinks />
          <RecentActivities activities={recentActivities} />
        </div>

        <ProjectStatusOverview projectData={resolvedData?.projects} />
      </div>
    </div>
  );
};

export default DashboardPage;
