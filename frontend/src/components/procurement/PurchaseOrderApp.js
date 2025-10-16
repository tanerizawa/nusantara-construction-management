import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Building, FileText, Eye, Tool, Briefcase, Package, HardHat } from 'lucide-react';
import ProjectSelectionDialog from './ProjectSelectionDialog';
import CreatePurchaseOrder from './CreatePurchaseOrder';
import CreateWorkOrder from './CreateWorkOrder';
import PurchaseOrderManagement from './PurchaseOrderManagement';
import RABItemsSelectionContainer from './RABItemsSelectionContainer';
import { isWorkOrderItem, isPurchaseOrderItem, detectItemType } from '../workflow/purchase-orders/config/workOrderTypes';
import WorkOrdersNotImplemented from '../workflow/purchase-orders/views/WorkOrdersNotImplemented';

const PurchaseOrderApp = () => {
  const [currentView, setCurrentView] = useState('management'); // 'management', 'create', 'create-wo', 'select-items', 'project-selection'
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedRABItems, setSelectedRABItems] = useState([]);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [documentType, setDocumentType] = useState('po'); // 'po' or 'wo'

  const handleCreateNew = (type) => {
    setDocumentType(type);
    setShowProjectDialog(true);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setShowProjectDialog(false);
    
    // Go to RAB items selection first
    setCurrentView('select-items');
  };
  
  const handleItemsSelected = (selectedItems) => {
    setSelectedRABItems(selectedItems);
    
    // Choose view based on document type
    if (documentType === 'po') {
      setCurrentView('create');
    } else {
      setCurrentView('create-wo');
    }
  };

  const handleBackToManagement = () => {
    setCurrentView('management');
    setSelectedProject(null);
    setSelectedRABItems([]);
  };

  const handlePOSaved = (savedPO) => {
    console.log('Purchase Order saved:', savedPO);
    // Refresh the management view
    setRefreshTrigger(prev => prev + 1);
    // Go back to management view
    handleBackToManagement();
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'select-items':
        return (
          <RABItemsSelectionContainer
            project={selectedProject}
            onBack={handleBackToManagement}
            onContinue={handleItemsSelected}
            documentType={documentType}
          />
        );
      
      case 'create':
        return (
          <CreatePurchaseOrder
            projectId={selectedProject?.id}
            project={selectedProject}
            selectedRABItems={selectedRABItems}
            onBack={() => setCurrentView('select-items')}
            onSave={handlePOSaved}
            documentType="po"
          />
        );
      
      case 'create-wo':
        return (
          <CreateWorkOrder
            projectId={selectedProject?.id}
            project={selectedProject}
            selectedRABItems={selectedRABItems}
            onBack={() => setCurrentView('select-items')}
            onSave={handlePOSaved}
          />
        );
      
      case 'management':
      default:
        return (
          <PurchaseOrderManagement 
            onCreatePO={() => handleCreateNew('po')}
            onCreateWO={() => handleCreateNew('wo')}
            refreshTrigger={refreshTrigger}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Procurement System</h1>
                <p className="text-gray-600">Kelola Purchase Order dan Work Order untuk semua proyek</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {currentView !== 'management' && (
                <button
                  onClick={handleBackToManagement}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  <Eye className="h-4 w-4" />
                  Lihat Semua Dokumen
                </button>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleCreateNew('po')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Buat PO Baru
                </button>
                
                <button
                  onClick={() => handleCreateNew('wo')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  Buat Work Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      {currentView !== 'management' && (
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm">
                <button
                  onClick={handleBackToManagement}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Procurement
                </button>
                <span className="text-gray-500">/</span>
                
                {currentView === 'select-items' && (
                  <>
                    <span className="text-gray-700">
                      {documentType === 'po' ? 'Pilih Item untuk PO' : 'Pilih Item untuk WO'}
                    </span>
                    {selectedProject && (
                      <>
                        <span className="text-gray-500">/</span>
                        <span className="text-gray-900 font-medium">{selectedProject.name}</span>
                      </>
                    )}
                  </>
                )}
              </div>
              
              {/* Document type selector */}
              {currentView === 'select-items' && (
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    type="button"
                    onClick={() => setDocumentType('po')}
                    className={`px-4 py-2 text-sm font-medium ${
                      documentType === 'po' 
                        ? 'text-blue-700 bg-blue-100 border border-blue-300' 
                        : 'text-gray-700 bg-white border border-gray-300'
                    } rounded-l-lg focus:z-10 focus:ring-2 focus:ring-blue-700 flex items-center`}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Purchase Order
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocumentType('wo')}
                    className={`px-4 py-2 text-sm font-medium ${
                      documentType === 'wo' 
                        ? 'text-purple-700 bg-purple-100 border border-purple-300' 
                        : 'text-gray-700 bg-white border border-gray-300'
                    } rounded-r-lg focus:z-10 focus:ring-2 focus:ring-purple-700 flex items-center`}
                  >
                    <HardHat className="h-4 w-4 mr-2" />
                    Work Order
                  </button>
                </div>
              )}
              
              {currentView === 'create' && (
                <>
                  <span className="text-gray-700">Buat Purchase Order</span>
                  {selectedProject && (
                    <>
                      <span className="text-gray-500">/</span>
                      <span className="text-gray-900 font-medium">{selectedProject.name}</span>
                    </>
                  )}
                </>
              )}
              
              {currentView === 'create-wo' && (
                <>
                  <span className="text-gray-700">Buat Work Order</span>
                  {selectedProject && (
                    <>
                      <span className="text-gray-500">/</span>
                      <span className="text-gray-900 font-medium">{selectedProject.name}</span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {renderCurrentView()}
      </main>

      {/* Project Selection Dialog */}
      <ProjectSelectionDialog
        isOpen={showProjectDialog}
        onClose={() => setShowProjectDialog(false)}
        onSelectProject={handleProjectSelect}
        documentType={documentType}
      />

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Building className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-600">Nusantara Construction Management</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Bantuan</a>
              <a href="#" className="hover:text-gray-900">Dokumentasi</a>
              <a href="#" className="hover:text-gray-900">Kontak Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PurchaseOrderApp;
