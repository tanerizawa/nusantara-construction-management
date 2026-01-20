import React from 'react';
import {
  useManpowerData,
  useManpowerForm,
  useManpowerFilters,
  useEmployeeDetailModal
} from './hooks';
import {
  ManpowerHeader,
  ErrorAlert,
  StatsCards,
  SearchAndFilters,
  EmployeeTable,
  EmployeeInlineForm,
  EmployeeDetailModal
} from './components';

/**
 * Manpower management page
 * @returns {JSX.Element} Manpower page
 */
const ManpowerPage = () => {
  // Data and delete operations
  const {
    employees,
    loading,
    error,
    setError,
    fetchData,
    handleDeleteEmployee,
    stats
  } = useManpowerData();

  // Form state and submission
  const {
    formData,
    submitLoading,
    isAddingInline,
    setIsAddingInline,
    resetForm,
    handleInputChange,
    handleSubmitEmployee
  } = useManpowerForm(fetchData);

  // Search and filter state
  const {
    searchTerm,
    setSearchTerm,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    showFilters,
    setShowFilters,
    filteredEmployees,
    resetFilters,
    hasActiveFilters
  } = useManpowerFilters(employees);

  // Detail modal management
  const {
    showDetailModal,
    selectedEmployee,
    openDetailModal,
    closeDetailModal
  } = useEmployeeDetailModal();

  // Handle add employee button
  const handleAddEmployee = () => {
    setIsAddingInline(true);
  };

  // Handle form cancel
  const handleCancelForm = () => {
    setIsAddingInline(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="relative isolate min-h-screen flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden="true">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),_transparent_45%)]" />
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A84FF]"></div>
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-screen">
      <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden="true">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),_transparent_45%)]" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 space-y-6">
        {/* Header */}
        <ManpowerHeader onAddClick={handleAddEmployee} />

        {/* Error Display */}
        <ErrorAlert error={error} onDismiss={() => setError(null)} />

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Search & Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          hasActiveFilters={hasActiveFilters}
          resetFilters={resetFilters}
        />

        {/* Employee Table */}
        <EmployeeTable
          employees={filteredEmployees}
          isAddingInline={isAddingInline}
          onViewDetail={openDetailModal}
          onDelete={handleDeleteEmployee}
          formComponent={
            <EmployeeInlineForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmitEmployee={handleSubmitEmployee}
              submitLoading={submitLoading}
              cancelForm={handleCancelForm}
            />
          }
        />

        {/* Detail Modal */}
        <EmployeeDetailModal
          isOpen={showDetailModal}
          employee={selectedEmployee}
          onClose={closeDetailModal}
        />
      </div>
    </div>
  );
};

export default ManpowerPage;