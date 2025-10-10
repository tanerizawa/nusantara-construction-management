import React from 'react';
import { useBudgetData, useBudgetFilters } from './budget-monitoring/hooks';
import {
  BudgetHeader,
  BudgetSummaryCards,
  BudgetAlerts,
  BudgetUtilization,
  CategoryTable,
  BudgetDistributionChart,
  BudgetTimelineChart,
  CashFlowForecast,
  BudgetControls,
  BudgetLoadingState,
  BudgetEmptyState
} from './budget-monitoring/components';

/**
 * Main component untuk Project Budget Monitoring
 * Modularized version - business logic extracted to hooks and components
 */
const ProjectBudgetMonitoring = ({ projectId, project, onDataChange }) => {
  // Custom hooks
  const { timeframe, handleTimeframeChange } = useBudgetFilters();
  const { budgetData, loading, refreshData } = useBudgetData(projectId, timeframe);

  // Loading state
  if (loading) {
    return <BudgetLoadingState />;
  }

  // Empty state
  if (!budgetData) {
    return <BudgetEmptyState />;
  }

  // Destructure budget data
  const summary = budgetData.summary || {};
  const categories = budgetData.categories || [];
  const timeline = budgetData.timeline || [];
  const alerts = budgetData.alerts || [];
  const forecast = budgetData.forecast || [];

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <BudgetHeader
        projectName={project.name}
        timeframe={timeframe}
        onTimeframeChange={handleTimeframeChange}
        onRefresh={refreshData}
      />

      {/* Budget alerts */}
      <BudgetAlerts alerts={alerts} />

      {/* Summary cards */}
      <BudgetSummaryCards summary={summary} />

      {/* Category breakdown and distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryTable categories={categories} />
        <BudgetDistributionChart categories={categories} />
      </div>

      {/* Budget utilization progress */}
      <BudgetUtilization summary={summary} />

      {/* Budget timeline chart */}
      <BudgetTimelineChart timeline={timeline} />

      {/* Cash flow forecast */}
      <CashFlowForecast forecast={forecast} />

      {/* Budget control actions */}
      <BudgetControls />
    </div>
  );
};

export default ProjectBudgetMonitoring;
