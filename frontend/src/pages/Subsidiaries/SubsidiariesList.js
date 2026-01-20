import React from 'react';
import { useSubsidiariesData, useSubsidiaryFilters } from './hooks';
import {
  PageHeader,
  StatsCards,
  SearchAndFilters,
  SubsidiariesGrid
} from './components';

/**
 * Subsidiaries List Page
 * @returns {JSX.Element} Subsidiaries page
 */
const SubsidiariesList = () => {
  // Data fetching and deletion
  const {
    subsidiaries,
    loading,
    stats,
    error,
    handleDeleteSubsidiary
  } = useSubsidiariesData();

  // Search and filtering
  const {
    searchTerm,
    setSearchTerm,
    specializationFilter,
    setSpecializationFilter,
    statusFilter,
    setStatusFilter,
    showFilters,
    setShowFilters,
    filteredSubsidiaries,
    resetFilters,
    hasActiveFilters
  } = useSubsidiaryFilters(subsidiaries);

  return (
    <div className="relative isolate min-h-screen">
      <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden="true">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),_transparent_45%)]" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 space-y-6">
        {/* Header */}
        <PageHeader />
        
        {/* Statistics Cards */}
        <StatsCards stats={stats} />
        
        {/* Search & Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          specializationFilter={specializationFilter}
          setSpecializationFilter={setSpecializationFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          resetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
        
        {/* Error Message */}
        {error && (
          <div className="rounded-2xl border border-[#FF453A]/30 bg-[#FF453A]/10 px-4 py-3 text-[#FF453A] backdrop-blur-xl">
            {error}
          </div>
        )}
        
        {/* Subsidiaries Grid */}
        <SubsidiariesGrid
          subsidiaries={filteredSubsidiaries}
          loading={loading}
          onDelete={handleDeleteSubsidiary}
        />
      </div>
    </div>
  );
};

export default SubsidiariesList;