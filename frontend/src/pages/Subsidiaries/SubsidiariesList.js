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
    <div className="min-h-screen" style={{ backgroundColor: "#1C1C1E" }}>
      <div className="max-w-7xl mx-auto p-6">
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
          <div className="mb-6 p-4 rounded-lg text-red-300 bg-red-900/20 border border-red-900">
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