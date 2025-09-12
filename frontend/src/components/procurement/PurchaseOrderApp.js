import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Building, FileText, Eye } from 'lucide-react';
import ProjectSelectionDialog from './ProjectSelectionDialog';
import CreatePurchaseOrder from './CreatePurchaseOrder';
import PurchaseOrderManagement from './PurchaseOrderManagement';

const PurchaseOrderApp = () => {
  const [currentView, setCurrentView] = useState('management'); // 'management', 'create', 'project-selection'
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedRABItems, setSelectedRABItems] = useState([]);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateNewPO = () => {
    setShowProjectDialog(true);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setShowProjectDialog(false);
    // For now, go directly to create PO form
    // In a full implementation, you might want to show RAB selection first
    setCurrentView('create');
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
      case 'create':
        return (
          <CreatePurchaseOrder
            projectId={selectedProject?.id}
            project={selectedProject}
            selectedRABItems={selectedRABItems}
            onBack={handleBackToManagement}
            onSave={handlePOSaved}
          />
        );
      
      case 'management':
      default:
        return (
          <PurchaseOrderManagement 
            onCreateNew={handleCreateNewPO}
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
                <h1 className="text-2xl font-bold text-gray-900">Purchase Order System</h1>
                <p className="text-gray-600">Kelola Purchase Order untuk semua proyek</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {currentView !== 'management' && (
                <button
                  onClick={handleBackToManagement}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  <Eye className="h-4 w-4" />
                  Lihat Semua PO
                </button>
              )}
              
              <button
                onClick={handleCreateNewPO}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Buat PO Baru
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      {currentView !== 'management' && (
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center space-x-2 text-sm">
              <button
                onClick={handleBackToManagement}
                className="text-blue-600 hover:text-blue-800"
              >
                Purchase Orders
              </button>
              <span className="text-gray-500">/</span>
              
              {currentView === 'create' && (
                <>
                  <span className="text-gray-700">Buat PO Baru</span>
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
