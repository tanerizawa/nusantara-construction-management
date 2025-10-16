import React from 'react';
import { DataLoader } from '../../../components/DataStates';
import { useTaxData } from '../hooks';
import {
  PageHeader,
  StatsCards,
  TaxActions,
  TaxTable,
  TaxTypesSummary,
  Pagination,
  EmptyState
} from '../components';

/**
 * Tax page component
 * Main component for the tax management page
 * @returns {JSX.Element} Tax page UI
 */
const TaxPage = () => {
  const {
    taxes,
    stats,
    loading,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder,
    handleSortChange,
    compact,
    setCompact,
    page,
    setPage,
    serverPagination,
    pageSize
  } = useTaxData();

  if (loading) {
    return <DataLoader />;
  }

  const hasFilters = statusFilter || searchTerm;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader 
        title="Manajemen Pajak" 
        subtitle="Kelola kewajiban pajak terkait proyek di Karawang" 
        count={serverPagination.count} 
      />

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Actions */}
      <TaxActions 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        sortOrder={sortOrder}
        handleSortChange={handleSortChange}
        compact={compact}
        setCompact={setCompact}
      />

      {/* Tax Table */}
      {taxes.length > 0 ? (
        <TaxTable taxes={taxes} compact={compact} />
      ) : (
        <EmptyState hasFilters={hasFilters} />
      )}

      {/* Tax Types Summary */}
      <TaxTypesSummary stats={stats} />

      {/* Pagination */}
      <Pagination 
        page={page}
        setPage={setPage}
        pagination={serverPagination}
        pageSize={pageSize}
      />
    </div>
  );
};

export default TaxPage;