import React from 'react';

// Hooks
import { usePurchaseOrderData } from './hooks/usePurchaseOrderData';
import { usePOWorkflowNavigation } from './hooks/usePOWorkflowNavigation';
import { usePOFilters } from './hooks/usePOFilters';
import { useRABItems } from './hooks/useRABItems';
import { usePOForm } from './hooks/usePOForm';

// Views
import PurchaseOrderListView from './views/PurchaseOrderListView';
import ProjectSelectionView from './views/ProjectSelectionView';
import CreatePOView from './views/CreatePOView';
import PODetailView from './views/PODetailView';

// Components
import NavigationBreadcrumb from './components/NavigationBreadcrumb';

// Config
import { VIEWS } from './config/poConfig';

/**
 * Main Purchase Order Workflow Component
 * Modularized from original 1,040 lines monolithic component
 */
const PurchaseOrderWorkflow = () => {
  // Data hooks
  const { 
    purchaseOrders, 
    projects, 
    loading, 
    refreshPurchaseOrders 
  } = usePurchaseOrderData();

  // Navigation hooks
  const {
    currentView,
    selectedPO,
    selectedProject,
    handleProjectSelect,
    handleViewPODetail,
    handleBackToList,
    handleShowProjectSelection,
    goBackToProjectSelection
  } = usePOWorkflowNavigation();

  // Filter hooks
  const {
    filter,
    setFilter,
    poSummary,
    filteredPOs
  } = usePOFilters(purchaseOrders);

  // RAB items hook
  const { rabItems, loadRABItems } = useRABItems();

  // Form hooks
  const {
    selectedItems,
    supplierInfo,
    loading: formLoading,
    handleItemToggle,
    handleQuantityChange,
    handleSupplierInfoChange,
    submitPO
  } = usePOForm(
    selectedProject,
    rabItems,
    async () => {
      await refreshPurchaseOrders();
      handleBackToList();
    },
    (error) => {
      console.error('PO creation error:', error);
    }
  );

  // Handle project selection with RAB loading
  const onProjectSelect = async (project) => {
    handleProjectSelect(project);
    await loadRABItems(project.id);
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <NavigationBreadcrumb
        currentView={currentView}
        selectedProject={selectedProject}
        selectedPO={selectedPO}
        onBackToList={handleBackToList}
        onShowProjectSelection={handleShowProjectSelection}
      />

      {/* Render Views */}
      {currentView === VIEWS.LIST && (
        <PurchaseOrderListView 
          purchaseOrders={purchaseOrders}
          filter={filter}
          setFilter={setFilter}
          poSummary={poSummary}
          filteredPOs={filteredPOs}
          onShowProjectSelection={handleShowProjectSelection}
          onViewPODetail={handleViewPODetail}
        />
      )}

      {currentView === VIEWS.PROJECT_SELECTION && (
        <ProjectSelectionView
          projects={projects}
          onSelectProject={onProjectSelect}
          onBack={handleBackToList}
        />
      )}

      {currentView === VIEWS.CREATE_FORM && selectedProject && (
        <CreatePOView
          project={selectedProject}
          rabItems={rabItems}
          selectedItems={selectedItems}
          supplierInfo={supplierInfo}
          loading={formLoading}
          onItemToggle={handleItemToggle}
          onQuantityChange={handleQuantityChange}
          onSupplierInfoChange={handleSupplierInfoChange}
          onSubmit={submitPO}
          onBack={goBackToProjectSelection}
          onCancel={handleBackToList}
        />
      )}

      {currentView === VIEWS.PO_DETAIL && selectedPO && (
        <PODetailView
          po={selectedPO}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
};

export default PurchaseOrderWorkflow;