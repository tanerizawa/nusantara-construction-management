import React, { memo } from 'react';
import { Plus, Building2, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { StatsCard } from '../ui/StateComponents';
import Button from '../ui/Button';

/**
 * Professional Project Header Component
 * Displays statistics and main actions
 */
const ProjectHeader = memo(({ 
  stats, 
  onCreateProject, 
  loading = false,
  error = null 
}) => {
  // Default stats if not provided
  const defaultStats = {
    total: 0,
    active: 0,
    completed: 0,
    overdue: 0
  };

  const projectStats = { ...defaultStats, ...stats };

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Manajemen Proyek
            </h1>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Kelola proyek konstruksi NUSANTARA GROUP secara profesional dan efisien
          </p>
          
          {/* Quick Summary */}
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                {projectStats.total} total proyek
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                {projectStats.active} aktif
              </span>
            </div>
            
            {projectStats.overdue > 0 && (
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">
                  {projectStats.overdue} terlambat
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Main Action */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onCreateProject}
            disabled={loading}
            size="lg"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            Proyek Baru
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Proyek"
          value={loading ? '...' : projectStats.total.toLocaleString('id-ID')}
          subtitle="Semua proyek"
          icon={Building2}
          color="blue"
        />
        
        <StatsCard
          title="Proyek Aktif"
          value={loading ? '...' : projectStats.active.toLocaleString('id-ID')}
          subtitle="Sedang berlangsung"
          icon={TrendingUp}
          color="green"
          trend={projectStats.activeTrend ? {
            direction: projectStats.activeTrend > 0 ? 'up' : 'down',
            value: `${Math.abs(projectStats.activeTrend)}%`,
            label: 'dari bulan lalu'
          } : undefined}
        />
        
        <StatsCard
          title="Selesai"
          value={loading ? '...' : projectStats.completed.toLocaleString('id-ID')}
          subtitle="Proyek diselesaikan"
          icon={Clock}
          color="blue"
          trend={projectStats.completedTrend ? {
            direction: 'up',
            value: `+${projectStats.completedTrend}`,
            label: 'bulan ini'
          } : undefined}
        />
        
        <StatsCard
          title="Terlambat"
          value={loading ? '...' : projectStats.overdue.toLocaleString('id-ID')}
          subtitle="Melewati deadline"
          icon={AlertTriangle}
          color={projectStats.overdue > 0 ? 'red' : 'green'}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                Peringatan Sistem
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

ProjectHeader.displayName = 'ProjectHeader';

export default ProjectHeader;
