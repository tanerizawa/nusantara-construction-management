import React from 'react';

/**
 * InvoiceDetailView Component
 * Displays detailed information about an invoice
 */
const InvoiceDetailView = ({ 
  invoice = {}, 
  onApprove, 
  onReject, 
  onEdit,
  loading = false
}) => {
  if (!invoice || !invoice.id) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No invoice selected</p>
      </div>
    );
  }

  const {
    id,
    invoiceNumber,
    issueDate,
    dueDate,
    totalAmount,
    status,
    items = [],
    client = {},
    paymentTerms,
    notes
  } = invoice;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="invoice-detail-view">
      {loading ? (
        <div className="p-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-500">Loading invoice details...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Invoice #{invoiceNumber}</h2>
              <p className="text-sm text-gray-500">ID: {id}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit?.(id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              
              {status?.toLowerCase() === 'pending' && (
                <>
                  <button
                    onClick={() => onApprove?.(id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject?.(id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Status and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Status</p>
              <div className="mt-1">
                <span className={`px-2 py-1 rounded text-sm ${getStatusColor(status)}`}>
                  {status}
                </span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Issue Date</p>
              <p className="text-base font-medium">
                {new Date(issueDate).toLocaleDateString()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Due Date</p>
              <p className="text-base font-medium">
                {new Date(dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {/* Client Info */}
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-base font-medium">{client.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="text-base font-medium">{client.company}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base font-medium">{client.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-base font-medium">{client.phone}</p>
              </div>
            </div>
          </div>
          
          {/* Invoice Items */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <tr key={item.id || index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          {/* Payment Terms & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-md font-medium text-gray-900 mb-2">Payment Terms</h3>
              <p className="text-sm text-gray-600">{paymentTerms}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-md font-medium text-gray-900 mb-2">Notes</h3>
              <p className="text-sm text-gray-600">{notes || 'No notes provided'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetailView;