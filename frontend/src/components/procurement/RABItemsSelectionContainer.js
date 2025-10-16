import React, { useState, useEffect } from 'react';
import { ArrowLeft, Briefcase, ShoppingCart, FileText } from 'lucide-react';
import RABSelectionViewTabs from '../workflow/purchase-orders/views/RABSelectionViewTabs';

/**
 * Container component for RAB item selection with document type filtering
 * Serves as an intermediate step between project selection and actual document creation
 */
const RABItemsSelectionContainer = ({ 
  project, 
  onBack, 
  onContinue, 
  documentType = 'po' // 'po' for Purchase Orders, 'wo' for Work Orders
}) => {
  const [rabItems, setRABItems] = useState([]);
  const [selectedRABItems, setSelectedRABItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (project?.id) {
      fetchRABItems();
    }
  }, [project]);
  
  const fetchRABItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${project.id}/rab-items`);
      
      if (response.ok) {
        const data = await response.json();
        setRABItems(data.rabItems || data || []);
      } else {
        console.error('Failed to fetch RAB items');
        setRABItems([]);
      }
    } catch (error) {
      console.error('Error fetching RAB items:', error);
      setRABItems([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleContinue = () => {
    onContinue(selectedRABItems);
  };
  
  const getDocumentTypeLabel = () => {
    return documentType === 'po' ? 'Purchase Order' : 'Work Order';
  };
  
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Pilih Item RAB untuk {getDocumentTypeLabel()}
            </h2>
            <p className="text-gray-600">
              {documentType === 'po' 
                ? 'Pilih material yang akan dibuat Purchase Order' 
                : 'Pilih jasa dan tenaga kerja untuk Work Order'}
            </p>
          </div>
        </div>
        
        <div>
          <button 
            onClick={handleContinue}
            disabled={selectedRABItems.length === 0}
            className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
              selectedRABItems.length === 0 
              ? 'bg-gray-300 cursor-not-allowed' 
              : documentType === 'po' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            Lanjutkan ke Formulir {getDocumentTypeLabel()}
          </button>
        </div>
      </div>
      
      {/* Toggle between PO and WO modes if needed */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => {}}
          className={`flex items-center px-4 py-2 rounded ${
            documentType === 'po' 
              ? 'bg-blue-100 text-blue-800 border border-blue-300' 
              : 'text-gray-600 bg-white border border-gray-200'
          }`}
          disabled={documentType === 'po'}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Material (Purchase Order)
        </button>
        
        <button
          onClick={() => {}}
          className={`flex items-center px-4 py-2 rounded ${
            documentType === 'wo' 
              ? 'bg-purple-100 text-purple-800 border border-purple-300' 
              : 'text-gray-600 bg-white border border-gray-200'
          }`}
          disabled={documentType === 'wo'}
        >
          <FileText className="w-4 h-4 mr-2" />
          Pekerjaan (Work Order)
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
        <h3 className="font-medium mb-2 text-gray-700">
          {documentType === 'po' 
            ? 'Pilih item material untuk Purchase Order' 
            : 'Pilih item jasa dan tenaga kerja untuk Work Order'}
        </h3>
        <p className="text-sm text-gray-600">
          {documentType === 'po' 
            ? 'Item yang dipilih akan digunakan untuk membuat Purchase Order kepada supplier' 
            : 'Item yang dipilih akan digunakan untuk membuat Work Order kepada vendor atau subkontraktor'}
        </p>
      </div>
      
      <RABSelectionViewTabs
        rabItems={rabItems}
        selectedRABItems={selectedRABItems}
        setSelectedRABItems={setSelectedRABItems}
        loading={loading}
        projectId={project?.id}
        mode={documentType}
      />
    </div>
  );
};

export default RABItemsSelectionContainer;