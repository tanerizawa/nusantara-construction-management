import React from 'react';

// Simple placeholder component to fix build issues
const InvoiceDetailView = ({ invoice, onApprove, onReject, onEdit, onPrint }) => {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Detail Invoice</h2>
        <div className="flex space-x-2">
          <button 
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm" 
            onClick={onEdit}
          >
            Edit
          </button>
          <button 
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm" 
            onClick={onPrint}
          >
            Print
          </button>
          <button 
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm" 
            onClick={onApprove}
          >
            Approve
          </button>
          <button 
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm" 
            onClick={onReject}
          >
            Reject
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
          Waiting for Approval
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium">Invoice Information</h3>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Invoice Number:</span>
              <span>{invoice?.number || 'INV-00001'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date:</span>
              <span>{invoice?.date || '15/10/2025'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Due Date:</span>
              <span>{invoice?.dueDate || '15/11/2025'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total:</span>
              <span className="font-semibold">Rp {invoice?.total?.toLocaleString() || '100,000,000'}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium">Client Information</h3>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Name:</span>
              <span>{invoice?.client?.name || 'PT. Client'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Address:</span>
              <span>{invoice?.client?.address || 'Jakarta'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Contact:</span>
              <span>{invoice?.client?.contact || 'John Doe'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span>{invoice?.client?.email || 'client@example.com'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { InvoiceDetailView };
export default InvoiceDetailView;